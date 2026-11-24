# Usage: blender -b --factory-startup --python design/tools/front-check.py -- <out.png> <a.glb> [b.glb ...]
# Lines up exported models side by side, seen from glTF +Z (Blender -Y), to
# confirm each faces front, rests on the floor and has real-world size.
import sys
import bpy
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:]
out, files = argv[0], argv[1:]
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
x = 0.0
for f in files:
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=f)
    new = [o for o in bpy.data.objects if o not in before]
    meshes = [o for o in new if o.type == "MESH"]
    pts = [o.matrix_world @ Vector(c) for o in meshes for c in o.bound_box]
    lo = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
    hi = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    size = hi - lo
    print(f"SIZE {f.split('/')[-1]}: {size.x:.3f} x {size.y:.3f} x {size.z:.3f} m, min z {lo.z:.4f}, centre x {((lo+hi)/2).x:.4f} y {((lo+hi)/2).y:.4f}")
    for o in new:
        if o.parent is None:
            o.location.x += x - lo.x
    x += size.x + 0.08
cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam"))
cam.data.type = "ORTHO"
cam.data.ortho_scale = x + 0.1
scene.collection.objects.link(cam)
import math
cam.location = (x / 2, -3, 0.22)
cam.rotation_euler = (math.pi / 2, 0, 0)
scene.camera = cam
scene.render.engine = "BLENDER_WORKBENCH"
scene.display.shading.light = "STUDIO"
scene.display.shading.color_type = "MATERIAL"
scene.render.resolution_x, scene.render.resolution_y = 1400, 420
scene.render.filepath = out
bpy.ops.render.render(write_still=True)
print("CHECKED")
