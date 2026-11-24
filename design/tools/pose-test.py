# Usage: blender -b --factory-startup --python design/tools/pose-test.py -- <arm.glb> <outPrefix>
# Imports the exported arm and renders it in a few joint poses, to check that
# each segment bends about its real pivot before the rig is used on the site.
import sys
import math
import bpy
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:]
path, prefix = argv[0], argv[1]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=path)
scene = bpy.context.scene
j = {o.name: o for o in scene.objects if o.type == "EMPTY"}
print("JOINTS", sorted(j))

cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam"))
scene.collection.objects.link(cam)
cam.location = (0.9, -0.9, 0.45)
cam.rotation_euler = (Vector((0, 0, 0.2)) - cam.location).to_track_quat("-Z", "Y").to_euler()
scene.camera = cam
sun = bpy.data.objects.new("sun", bpy.data.lights.new("sun", "SUN"))
sun.data.energy = 3
sun.rotation_euler = (0.7, 0.2, 0.6)
scene.collection.objects.link(sun)
world = bpy.data.worlds.new("w")
scene.world = world
world.use_nodes = True
world.node_tree.nodes["Background"].inputs[1].default_value = 1.0
scene.display.shading.light = "STUDIO"
scene.display.shading.color_type = "MATERIAL"
scene.render.engine = "BLENDER_WORKBENCH"
scene.render.resolution_x, scene.render.resolution_y = 420, 320

for o in j.values():
    o.rotation_mode = "XYZ"  # glTF import uses quaternions; Euler edits need this
rest = {n: o.rotation_euler.copy() for n, o in j.items()}
poses = {
    "rest": {},
    "shoulder": {"joint_shoulder": (0.5, 0, 0)},
    "elbow": {"joint_elbow": (-0.7, 0, 0)},
    "base": {"joint_base": (0, 0, 0.9)},
    "hand": {"joint_wrist": (0.5, 0, 0), "finger_a": (0, 0, 0.3), "finger_b": (0, 0, -0.3)},
}
for pose, rot in poses.items():
    for n, o in j.items():
        o.rotation_euler = rest[n].copy()
    for n, (x, y, z) in rot.items():
        if n in j:
            e = j[n]
            e.rotation_euler = (rest[n].x + x, rest[n].y + y, rest[n].z + z)
    scene.render.filepath = f"{prefix}-{pose}.png"
    bpy.ops.render.render(write_still=True)
print("POSES DONE")
