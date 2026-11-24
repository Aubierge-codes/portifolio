# Usage: blender -b --factory-startup --python concept-render.py -- <concept A|B|C> <out.png> <assetsDir> [preview]
# Stages the portfolio's real hardware models as one workstation and renders
# it in the lighting and materials of a design concept.
import sys
import math
import bpy
import numpy as np
from mathutils import Vector, Matrix

argv = sys.argv[sys.argv.index("--") + 1:]
concept, out, assets = argv[0], argv[1], argv[2]
preview = len(argv) > 3 and argv[3] == "preview"

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
col = scene.collection


def bounds(objs):
    pts = [o.matrix_world @ Vector(c) for o in objs if o.type == "MESH" for c in o.bound_box]
    lo = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
    hi = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    return lo, hi


def level_rotation(meshes):
    """Rotation that lays the dominant plane flat (smallest-variance axis -> +Z)."""
    samples = []
    for o in meshes:
        mw = o.matrix_world
        verts = o.data.vertices
        step = max(1, len(verts) // 4000)
        for i in range(0, len(verts), step):
            p = mw @ verts[i].co
            samples.append((p.x, p.y, p.z))
    a = np.array(samples)
    a -= a.mean(axis=0)
    w, v = np.linalg.eigh(np.cov(a.T))
    n = Vector(v[:, 0])
    if n.z < 0:
        n = -n
    return n.rotation_difference(Vector((0, 0, 1))).to_matrix().to_4x4()


def place(path, name, longest, at, yaw=0.0, level=False, extra=None):
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=path)
    new = [o for o in bpy.data.objects if o not in before]
    root = bpy.data.objects.new(name, None)
    col.objects.link(root)
    for o in new:
        if o.parent is None:
            o.parent = root
    bpy.context.view_layer.update()
    meshes = [o for o in new if o.type == "MESH"]
    if level:
        root.matrix_world = level_rotation(meshes) @ root.matrix_world
        bpy.context.view_layer.update()
    if extra:
        root.matrix_world = extra @ root.matrix_world
        bpy.context.view_layer.update()
    lo, hi = bounds(meshes)
    s = longest / max(hi - lo)
    root.matrix_world = Matrix.Scale(s, 4) @ root.matrix_world
    bpy.context.view_layer.update()
    lo, hi = bounds(meshes)
    c = (lo + hi) / 2
    root.matrix_world = Matrix.Translation(Vector((-c.x, -c.y, -lo.z))) @ root.matrix_world
    root.matrix_world = Matrix.Translation(Vector(at)) @ Matrix.Rotation(yaw, 4, "Z") @ root.matrix_world
    bpy.context.view_layer.update()
    for m in meshes:
        m.visible_shadow = True
    return root, meshes


def mat(name, color, rough=0.5, metal=0.0, coat=0.0, emission=None, strength=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    b.inputs["Coat Weight"].default_value = coat
    if emission:
        b.inputs["Emission Color"].default_value = (*emission, 1)
        b.inputs["Emission Strength"].default_value = strength
    return m


def srgb(h):
    h = h.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c)


def box(name, size, loc, material, bevel=0.0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    o = bpy.context.active_object
    o.name = name
    o.scale = size
    bpy.ops.object.transform_apply(scale=True)
    if bevel:
        mod = o.modifiers.new("bevel", "BEVEL")
        mod.width = bevel
        mod.segments = 3
    o.data.materials.append(material)
    return o


def area_light(name, loc, target, size, power, color=(1, 1, 1)):
    data = bpy.data.lights.new(name, "AREA")
    data.shape = "RECTANGLE"
    data.size, data.size_y = size
    data.energy = power
    data.color = color
    o = bpy.data.objects.new(name, data)
    col.objects.link(o)
    o.location = loc
    d = Vector(target) - Vector(loc)
    o.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
    return o


# --- Palette per concept ------------------------------------------------------
P = {
    "A": dict(bg="#070708", desk="#141316", wall="#0a0a0b", key=420, fill=18, rim=380, world=0.005),
    "B": dict(bg="#f4f1ec", desk="#ece8e1", wall="#f4f1ec", key=520, fill=180, rim=160, world=0.55),
    "C": dict(bg="#d9d4cc", desk="#8a6a4f", wall="#cfc9bf", key=650, fill=140, rim=260, world=0.25),
}[concept]

# --- Set -----------------------------------------------------------------------
desk_mat = mat("desk", srgb(P["desk"]), rough=0.55 if concept != "A" else 0.35, coat=0.3 if concept == "A" else 0.1)
wall_mat = mat("wall", srgb(P["wall"]), rough=0.95)
if concept == "B":
    # Seamless cyclorama: floor sweeping into the wall, catalogue still life.
    bpy.ops.mesh.primitive_plane_add(size=6, location=(0, 0.6, -0.06))
    floor = bpy.context.active_object
    floor.data.materials.append(wall_mat)
    bpy.ops.mesh.primitive_plane_add(size=6, location=(0, 1.2, 3), rotation=(math.pi / 2, 0, 0))
    bpy.context.active_object.data.materials.append(wall_mat)
    box("plinth", (1.5, 0.8, 0.06), (0, 0.0, -0.03), desk_mat, bevel=0.01)
    top = 0.0
else:
    # A desk slab; C adds a pegboard wall and workbench feel.
    box("desk", (1.9, 0.95, 0.05), (0, 0.05, -0.025), desk_mat, bevel=0.006)
    bpy.ops.mesh.primitive_plane_add(size=8, location=(0, 0.6, -0.76))
    bpy.context.active_object.data.materials.append(wall_mat)
    bpy.ops.mesh.primitive_plane_add(size=8, location=(0, 0.75, 2), rotation=(math.pi / 2, 0, 0))
    bpy.context.active_object.data.materials.append(wall_mat)
    top = 0.0
    if concept == "C":
        peg = mat("peg", srgb("#b9b2a6"), rough=0.8)
        box("pegboard", (1.6, 0.02, 0.7), (0, 0.5, 0.45), peg)
        hole = mat("hole", srgb("#2a2622"), rough=1)
        for i in range(18):
            for j in range(7):
                bpy.ops.mesh.primitive_cylinder_add(radius=0.006, depth=0.004, location=(-0.76 + i * 0.09, 0.488, 0.15 + j * 0.09), rotation=(math.pi / 2, 0, 0))
                bpy.context.active_object.data.materials.append(hole)

# --- Hardware: real models, true-to-life sizes ---------------------------------
# A diagonal from the boards in the foreground, through the laptop, to the arm
# and monitor at the back right; the left of frame stays open for type.
A = assets
lap, lap_m = place(f"{A}/gaming_laptop.glb", "laptop", 0.36, (0.12, 0.12, top), yaw=math.radians(-90 + 16))
arm, arm_m = place(f"{A}/robot_arm.glb", "arm", 0.40, (0.66, 0.02, top), yaw=math.radians(-120))
ard, ard_m = place(f"{A}/arduinoUNO.glb", "arduino", 0.0686, (0.0, -0.37, top), yaw=math.radians(28))
pi, pi_m = place(f"{A}/raspberry.glb", "pi", 0.085, (0.24, -0.34, top), yaw=math.radians(-12), level=True)
if concept != "B":
    place(f"{A}/lamp.glb", "lamp", 0.42, (-0.42, 0.36, top), yaw=math.radians(35))

# --- Harmonise borrowed materials into one finish system -------------------------
graphite = mat("graphite", srgb("#2b2d31"), rough=0.38, metal=0.6, coat=0.4)
alu = mat("alu", srgb("#c9cbce"), rough=0.3, metal=0.95)
maroon = mat("maroon", srgb("#6e1f24"), rough=0.35, coat=0.6)
for i, m in enumerate(arm_m):
    # Big structural parts read graphite, joints aluminium, one accent ring.
    lo, hi = bounds([m])
    vol = (hi - lo).length
    m.data.materials.clear()
    m.data.materials.append(maroon if i == 8 else (graphite if vol > 0.12 else alu))

# The laptop's RGB keyboard and stock wallpaper don't belong to this brand.
for m in lap_m:
    for slot in m.material_slots:
        node = slot.material.node_tree.nodes.get("Principled BSDF") if slot.material and slot.material.use_nodes else None
        if node:
            node.inputs["Emission Strength"].default_value = 0.0

def screen_image(name, w, h, dark):
    img = bpy.data.images.new(name, w, h)
    px = np.ones((h, w, 4), dtype=np.float32)
    bg = srgb("#121214") if dark else srgb("#fbfaf8")
    ink = srgb("#e9e6e0") if dark else srgb("#151413")
    px[:, :, :3] = bg
    def rect(x, y, rw, rh, c):
        px[y:y + rh, x:x + rw, :3] = c  # glTF UVs are flipped, so rows run top-down
    rect(int(w*.08), int(h*.12), int(w*.05), int(h*.02), srgb("#6e1f24"))
    rect(int(w*.08), int(h*.2), int(w*.55), int(h*.06), ink)
    rect(int(w*.08), int(h*.29), int(w*.42), int(h*.06), ink)
    for k in range(3):
        rect(int(w*.08), int(h*(.42+k*.05)), int(w*(.5-k*.08)), int(h*.015), tuple(c*.55+b*.45 for c,b in zip(ink,bg)))
    yy, xx = np.ogrid[:h, :w]
    cx, cy, r = int(w*.75), int(h*.55), int(h*.12)
    mask = (xx-cx)**2 + (yy-cy)**2 <= r*r
    px[mask, :3] = srgb("#eb5a3c")
    img.pixels = px.ravel()
    return img

def screen_mat(name, img, strength):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    b = nt.nodes["Principled BSDF"]
    t = nt.nodes.new("ShaderNodeTexImage")
    t.image = img
    nt.links.new(t.outputs["Color"], b.inputs["Emission Color"])
    nt.links.new(t.outputs["Color"], b.inputs["Base Color"])
    b.inputs["Emission Strength"].default_value = strength
    b.inputs["Roughness"].default_value = 0.15
    return m

dark = concept == "A"
# Laptop: its own screen quad shows the portfolio; keycaps go matte graphite.
lap_screen = screen_mat("lapscreen", screen_image("lap", 1024, 576, dark), 1.5 if dark else 1.05)
keycap = mat("keycap", srgb("#1d1e21"), rough=0.6)
for m in lap_m:
    names = [sl.material.name for sl in m.material_slots if sl.material]
    if "Material.004" in names:
        m.data.materials.clear()
        m.data.materials.append(lap_screen)
    elif "Material.009" in names or "Material.010" in names:
        m.data.materials.clear()
        m.data.materials.append(keycap)

# --- Light ---------------------------------------------------------------------
world = bpy.data.worlds.new("w")
scene.world = world
world.use_nodes = True
world.node_tree.nodes["Background"].inputs[0].default_value = (*srgb(P["bg"]), 1)
world.node_tree.nodes["Background"].inputs[1].default_value = P["world"]
area_light("key", (-1.2, -1.0, 1.6), (0, 0.05, 0.1), (1.4, 1.0), P["key"], (1.0, 0.95, 0.88))
area_light("fill", (1.6, -1.4, 0.6), (0, 0, 0.15), (1.2, 1.2), P["fill"], (0.88, 0.93, 1.0))
area_light("rim", (0.6, 1.4, 1.1), (0, 0, 0.2), (1.0, 0.4), P["rim"], (1.0, 0.86, 0.75) if concept == "A" else (1, 1, 1))
if concept == "A":
    # A narrow maroon accent strip on the back wall: the brand, as light.
    strip = mat("strip", (0, 0, 0), emission=srgb("#6e1f24"), strength=6)
    box("accent", (1.2, 0.01, 0.012), (0.05, 0.74, 0.62), strip)

# --- Camera --------------------------------------------------------------------
cam_data = bpy.data.cameras.new("cam")
cam_data.lens = 34
cam = bpy.data.objects.new("cam", cam_data)
col.objects.link(cam)
cam.location = (-0.38, -1.02, 0.30) if concept != "B" else (-0.34, -1.08, 0.34)
target = Vector((0.12, 0.05, 0.14))
cam.rotation_euler = (target - cam.location).to_track_quat("-Z", "Y").to_euler()
scene.camera = cam
cam_data.dof.use_dof = concept != "B"
cam_data.dof.focus_distance = (Vector((0.12, -0.3, 0.05)) - cam.location).length
cam_data.dof.aperture_fstop = 2.8

# --- Render --------------------------------------------------------------------
scene.render.engine = "CYCLES"
scene.cycles.device = "CPU"
scene.cycles.samples = 12 if preview else 64
scene.cycles.use_denoising = True
scene.render.resolution_x = 480 if preview else 1600
scene.render.resolution_y = 270 if preview else 900
scene.view_settings.view_transform = "AgX"
scene.view_settings.look = "AgX - Medium High Contrast" if concept == "A" else "None"
scene.render.film_transparent = False
scene.render.filepath = out
bpy.ops.render.render(write_still=True)
print("RENDERED", out)
