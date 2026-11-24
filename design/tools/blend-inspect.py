# Usage: blender -b --factory-startup --python blend-inspect.py -- <file.glb>...
# Imports each GLB into an empty scene and reports object hierarchy, origins
# and world bounds, so we know which parts are separable and where they pivot.
import sys
import bpy
from mathutils import Vector

files = sys.argv[sys.argv.index("--") + 1:]

for path in files:
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=path)
    meshes = [o for o in bpy.context.scene.objects if o.type == "MESH"]
    lo = Vector((1e9, 1e9, 1e9))
    hi = Vector((-1e9, -1e9, -1e9))
    rows = []
    for o in meshes:
        corners = [o.matrix_world @ Vector(c) for c in o.bound_box]
        mn = Vector((min(c.x for c in corners), min(c.y for c in corners), min(c.z for c in corners)))
        mx = Vector((max(c.x for c in corners), max(c.y for c in corners), max(c.z for c in corners)))
        lo = Vector((min(lo.x, mn.x), min(lo.y, mn.y), min(lo.z, mn.z)))
        hi = Vector((max(hi.x, mx.x), max(hi.y, mx.y), max(hi.z, mx.z)))
        size = mx - mn
        mats = ",".join(s.material.name for s in o.material_slots if s.material)
        rows.append((o.name, o.parent.name if o.parent else "-", len(o.data.polygons),
                     tuple(round(v, 3) for v in o.matrix_world.translation),
                     tuple(round(v, 3) for v in (mn + mx) / 2),
                     tuple(round(v, 3) for v in size), mats))
    size = hi - lo
    print(f"\n=== {path}")
    print(f"world size (x,y,z Blender Z-up): {tuple(round(v, 3) for v in size)}  mesh objects: {len(meshes)}")
    for r in sorted(rows, key=lambda r: -r[2])[:45]:
        print(f"  {r[0][:28]:28} parent={r[1][:22]:22} faces={r[2]:6}  origin={r[3]}  centre={r[4]}  size={r[5]}  mat={r[6]}")
