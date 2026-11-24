# Usage:
#   blender -b --factory-startup --python design/tools/export-models.py -- <assetsDir> <outDir> [model]
#
# Turns the downloaded source models into production assets:
#   - real-world scale in metres, origin at the base centre, resting on y = 0
#   - every model's front faces glTF +Z (toward a default camera)
#   - semantic part names code can address (laptop lid, arm joints, screens)
#   - the robot arm regrouped into a joint hierarchy at its authored pivots
#   - borrowed materials harmonised to the site's finish system
#   - textures capped at 2048 px (later compressed by gltf-transform)
import sys
import math
import bpy
import numpy as np
from mathutils import Vector, Matrix

argv = sys.argv[sys.argv.index("--") + 1:]
ASSETS, OUT = argv[0], argv[1]
ONLY = argv[2] if len(argv) > 2 else None


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def srgb(h):
    h = h.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c)


def principled(name, hexcolor, rough, metal=0.0, coat=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*srgb(hexcolor), 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    b.inputs["Coat Weight"].default_value = coat
    return m


def import_glb(path):
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=path)
    return [o for o in bpy.data.objects if o not in before]


def meshes_of(objs):
    return [o for o in objs if o.type == "MESH"]


def bounds(objs):
    pts = [o.matrix_world @ Vector(c) for o in objs if o.type == "MESH" for c in o.bound_box]
    lo = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
    hi = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    return lo, hi


def make_root(name, objs):
    root = bpy.data.objects.new(name, None)
    bpy.context.scene.collection.objects.link(root)
    for o in objs:
        if o.parent is None:
            o.parent = root
    bpy.context.view_layer.update()
    return root


def apply_root(root, matrix):
    root.matrix_world = matrix @ root.matrix_world
    bpy.context.view_layer.update()


def normalise(root, meshes, longest, yaw_deg=0.0, level=False):
    """Scale to real size (longest side, metres), face front, centre, ground."""
    if level:
        # Find the orientation in which the model is thinnest: for a board that
        # is its face normal. (Variance-based fits get pulled off by dense
        # headers and port stacks.) Then put the board side down.
        samples = []
        for o in meshes:
            step = max(1, len(o.data.vertices) // 6000)
            for i in range(0, len(o.data.vertices), step):
                p = o.matrix_world @ o.data.vertices[i].co
                samples.append((p.x, p.y, p.z))
        a = np.array(samples)
        best, best_n = None, None
        k = 6000
        idx = np.arange(k) + 0.5
        phi = np.arccos(1 - idx / k)  # hemisphere
        theta = np.pi * (1 + 5 ** 0.5) * idx
        dirs = np.stack([np.cos(theta) * np.sin(phi), np.sin(theta) * np.sin(phi), np.cos(phi)], 1)
        proj = a @ dirs.T
        # Percentiles, not min/max: a few stray vertices must not decide it.
        extent = np.percentile(proj, 99, axis=0) - np.percentile(proj, 1, axis=0)
        j = int(extent.argmin())
        n = Vector(dirs[j])
        pr = proj[:, j]
        # The board sits at whichever end has the dense, flat layer of points.
        if (pr.mean() - pr.min()) > (pr.max() - pr.mean()):
            n = -n
        apply_root(root, n.rotation_difference(Vector((0, 0, 1))).to_matrix().to_4x4())
    if yaw_deg:
        apply_root(root, Matrix.Rotation(math.radians(yaw_deg), 4, "Z"))
    lo, hi = bounds(meshes)
    apply_root(root, Matrix.Scale(longest / max(hi - lo), 4))
    lo, hi = bounds(meshes)
    c = (lo + hi) / 2
    apply_root(root, Matrix.Translation(Vector((-c.x, -c.y, -lo.z))))


def bake_transforms(objs):
    """Apply transforms on meshes so scale is 1 and exported nodes are clean."""
    bpy.ops.object.select_all(action="DESELECT")
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)


def cap_textures(px=2048):
    for img in bpy.data.images:
        if img.size[0] > px or img.size[1] > px:
            s = px / max(img.size)
            img.scale(max(1, int(img.size[0] * s)), max(1, int(img.size[1] * s)))


def export(path, image_format="WEBP"):
    bpy.ops.export_scene.gltf(
        filepath=path,
        export_format="GLB",
        export_yup=True,
        export_apply=False,
        export_extras=True,
        # WebP straight from Blender: some source maps are 16-bit or greyscale
        # PNGs that gltf-transform's image library cannot convert.
        export_image_format=image_format,
        export_image_quality=86,
    )
    print("EXPORTED", path)


GRAPHITE = ("#2B2D31", 0.38, 0.6, 0.4)
ALUMINIUM = ("#C9CBCE", 0.3, 0.95, 0.0)
MAROON = ("#6E1F24", 0.35, 0.0, 0.6)


# --- Robot arm ------------------------------------------------------------------
# The source has 40 loose parts with real pivots. Parts are assigned to the
# segment they belong to (by name, from inspecting the model in Blender) and
# parented under empties placed on each joint's axle, so code can rotate them.
ARM_JOINTS = {
    # name: (pivot in the source's own coordinates, parent joint, parts)
    "joint_base": ((0.0, 0.0, 0.0), None,
                   ["Object_26", "Object_28", "Object_32", "Object_30"]),
    "joint_shoulder": ((0.0, 0.065, 0.073), "joint_base",
                       ["Object_34", "Object_36"]),
    "joint_elbow": ((0.0, -0.471, 0.394), "joint_shoulder",
                    ["Object_44", "Object_38", "Object_40", "Object_42", "Object_46",
                     "Object_48", "Object_50", "Object_52", "Object_54", "Object_56"]),
    "joint_wrist": ((0.0, -0.054, 0.76), "joint_elbow",
                    ["Object_60", "Object_58", "Object_62", "Object_64"]),
    "joint_hand": ((0.0, 0.247, 0.663), "joint_wrist",
                   ["Object_66", "Object_72", "Object_74", "Object_76", "Object_78",
                    "Object_80", "Object_82"]),
    "finger_a": ((-0.025, 0.403, 0.614), "joint_hand", ["Object_68"]),
    "finger_b": ((-0.02, 0.571, 0.583), "joint_hand", ["Object_70"]),
}


def export_arm():
    reset()
    objs = import_glb(f"{ASSETS}/robot_arm.glb")
    by_name = {o.name: o for o in objs}
    meshes = meshes_of(objs)
    # Work in the source's own frame first: unparent meshes keeping world transform.
    for m in meshes:
        mw = m.matrix_world.copy()
        m.parent = None
        m.matrix_world = mw
    for o in objs:
        if o.type != "MESH":
            bpy.data.objects.remove(o, do_unlink=True)
    bpy.context.view_layer.update()

    root = bpy.data.objects.new("robot_arm", None)
    bpy.context.scene.collection.objects.link(root)
    empties = {}
    for name, (pivot, parent, _) in ARM_JOINTS.items():
        e = bpy.data.objects.new(name, None)
        bpy.context.scene.collection.objects.link(e)
        e.location = pivot
        empties[name] = e
    bpy.context.view_layer.update()
    for name, (_, parent, parts) in ARM_JOINTS.items():
        e = empties[name]
        mw = e.matrix_world.copy()
        e.parent = empties[parent] if parent else root
        e.matrix_world = mw
        for p in parts:
            m = by_name.get(p)
            if not m:
                print("MISSING PART", p)
                continue
            mw = m.matrix_world.copy()
            m.parent = e
            m.matrix_world = mw
    for m in meshes:
        if m.parent is None:  # static base plates
            mw = m.matrix_world.copy()
            m.parent = root
            m.matrix_world = mw
    bpy.context.view_layer.update()

    # Harmonise: graphite structure, aluminium joints, one maroon accent.
    g = principled("arm_graphite", *GRAPHITE)
    a = principled("arm_aluminium", *ALUMINIUM)
    r = principled("arm_accent", *MAROON)
    for m in meshes:
        lo, hi = bounds([m])
        big = (hi - lo).length > 0.12
        m.data.materials.clear()
        m.data.materials.append(r if m.name == "Object_28" else (g if big else a))

    # Gripper reaches toward source +Y; turn it to face glTF +Z (Blender -Y).
    normalise(root, meshes, 0.42, yaw_deg=180)
    export(f"{OUT}/robot-arm.glb")


def export_laptop():
    reset()
    objs = import_glb(f"{ASSETS}/gaming_laptop.glb")
    meshes = meshes_of(objs)
    by_name = {o.name: o for o in objs}
    # The lid group's origin already sits on the hinge.
    lid = by_name.get("Cube.001_1")
    if lid:
        lid.name = "lid"
    base = by_name.get("Cube.003_2")
    if base:
        base.name = "base"
    keycap = principled("keycap", "#1D1E21", 0.6)
    body = principled("laptop_aluminium", "#C9CBCE", 0.32, 0.92)
    for m in meshes:
        names = [s.material.name for s in m.material_slots if s.material]
        if "Material.004" in names:
            # The display: named so the site can paint its own UI onto it.
            screen = principled("screen", "#000000", 0.15)
            m.data.materials.clear()
            m.data.materials.append(screen)
            m.name = "screen"
        elif "Material.009" in names or "Material.010" in names:
            m.data.materials.clear()
            m.data.materials.append(keycap)
        elif "Material" in names or "Material.001" in names:
            m.data.materials.clear()
            m.data.materials.append(body)
        for s in m.material_slots:
            if s.material and s.material.use_nodes:
                n = s.material.node_tree.nodes.get("Principled BSDF")
                if n:
                    n.inputs["Emission Strength"].default_value = 0.0
    # The lid back carries a third-party brand mark; it doesn't ship.
    logo = by_name.get("Object_11")
    if logo:
        meshes.remove(logo)
        objs.remove(logo)
        bpy.data.objects.remove(logo, do_unlink=True)
    root = make_root("laptop", objs)
    # Keyboard side is source +X; face it to glTF +Z (Blender -Y).
    normalise(root, meshes, 0.36, yaw_deg=-90)
    cap_textures(1024)
    export(f"{OUT}/laptop.glb")


def export_board(src, name, longest, level=False, yaw=0.0, cap=2048):
    reset()
    objs = import_glb(f"{ASSETS}/{src}")
    meshes = meshes_of(objs)
    root = make_root(name, objs)
    normalise(root, meshes, longest, yaw_deg=yaw, level=level)
    cap_textures(cap)
    export(f"{OUT}/{name}.glb")


def export_monitor():
    reset()
    objs = import_glb(f"{ASSETS}/monitor.glb")
    meshes = meshes_of(objs)
    for m in meshes:
        if any(s.material and "Screen" in s.material.name for s in m.material_slots):
            m.name = "monitor_body"
    root = make_root("monitor", objs)
    normalise(root, meshes, 0.54)
    cap_textures(1024)
    # WebP output from this model references missing images; JPEG is clean.
    export(f"{OUT}/monitor.glb", image_format="JPEG")


jobs = {
    "arm": export_arm,
    "laptop": export_laptop,
    "arduino": lambda: export_board("arduinoUNO.glb", "arduino", 0.0686, cap=1024),
    "pi": lambda: export_board("raspberry.glb", "raspberry-pi", 0.085, level=True, cap=2048),
    "monitor": export_monitor,
    "desk-lamp": lambda: export_board("lamp.glb", "desk-lamp", 0.45, cap=512),
}
for key, job in jobs.items():
    if ONLY and key != ONLY:
        continue
    job()
