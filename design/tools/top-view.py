# Usage: blender -b --factory-startup --python design/tools/top-view.py -- <out.png> <model.glb>
# Orthographic top view with a 5 mm grid in glTF coordinates (x right,
# z toward the viewer = down the image), for placing hotspots on real parts.
import sys, bpy
from mathutils import Vector
out, path = sys.argv[sys.argv.index("--") + 1:][:2]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=path)
s = bpy.context.scene
ms = [o for o in s.objects if o.type == "MESH"]
pts = [o.matrix_world @ Vector(c) for o in ms for c in o.bound_box]
lo = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
hi = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
print(f"BOUNDS x {lo.x:.4f}..{hi.x:.4f}  blender-y {lo.y:.4f}..{hi.y:.4f} (glTF z = -y)  height {hi.z:.4f}")
cam = bpy.data.objects.new("c", bpy.data.cameras.new("c")); s.collection.objects.link(cam); s.camera = cam
cam.data.type = "ORTHO"; cam.data.ortho_scale = max(hi.x - lo.x, hi.y - lo.y) * 1.15
cam.location = ((lo.x + hi.x) / 2, (lo.y + hi.y) / 2, 2); cam.rotation_euler = (0, 0, 0)
s.render.engine = "BLENDER_WORKBENCH"; s.display.shading.light = "FLAT"; s.display.shading.color_type = "TEXTURE"
s.render.resolution_x = s.render.resolution_y = 900
s.render.filepath = out
bpy.ops.render.render(write_still=True)
print("SCALE_M", cam.data.ortho_scale, "CENTER", (lo.x + hi.x) / 2, (lo.y + hi.y) / 2)
