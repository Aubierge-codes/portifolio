// Usage: node glb-inspect.mjs <file.glb> [...]
// Reads only the GLB's JSON chunk (no code execution, no dependencies) and
// reports what a production pipeline needs to know about each model.
import fs from "node:fs";

for (const file of process.argv.slice(2)) {
  const buf = fs.readFileSync(file);
  if (buf.readUInt32LE(0) !== 0x46546c67) {
    console.log(`${file}: not a GLB`);
    continue;
  }
  const jsonLen = buf.readUInt32LE(12);
  const gltf = JSON.parse(buf.subarray(20, 20 + jsonLen).toString("utf8"));
  const acc = gltf.accessors ?? [];
  let tris = 0;
  let verts = 0;
  for (const mesh of gltf.meshes ?? []) {
    for (const p of mesh.primitives) {
      const mode = p.mode ?? 4;
      if (p.indices !== undefined) tris += mode === 4 ? acc[p.indices].count / 3 : 0;
      else tris += mode === 4 ? acc[p.attributes.POSITION].count / 3 : 0;
      verts += acc[p.attributes.POSITION]?.count ?? 0;
    }
  }
  // Instancing via nodes: count how many nodes reference each mesh.
  const meshUse = {};
  for (const n of gltf.nodes ?? []) if (n.mesh !== undefined) meshUse[n.mesh] = (meshUse[n.mesh] ?? 0) + 1;
  let drawnTris = 0;
  (gltf.meshes ?? []).forEach((mesh, i) => {
    let t = 0;
    for (const p of mesh.primitives) t += p.indices !== undefined ? acc[p.indices].count / 3 : acc[p.attributes.POSITION].count / 3;
    drawnTris += t * (meshUse[i] ?? 0);
  });
  const imgs = (gltf.images ?? []).map((im) => {
    const bv = gltf.bufferViews?.[im.bufferView];
    return `${im.mimeType ?? "?"} ${bv ? Math.round(bv.byteLength / 1024) + "KB" : im.uri ?? ""}`;
  });
  const names = (gltf.nodes ?? []).map((n) => n.name).filter(Boolean);
  const mats = (gltf.materials ?? []).map((m) => {
    const pbr = m.pbrMetallicRoughness ?? {};
    return `${m.name ?? "?"}(m${pbr.metallicFactor ?? 1}/r${pbr.roughnessFactor ?? 1}${pbr.baseColorTexture ? ",tex" : ""}${m.normalTexture ? ",nrm" : ""})`;
  });
  console.log(`\n=== ${file}  ${(buf.length / 1048576).toFixed(1)} MB`);
  console.log(`generator: ${gltf.asset?.generator ?? "?"}  copyright: ${gltf.asset?.copyright ?? "-"}`);
  const extras = gltf.asset?.extras ? JSON.stringify(gltf.asset.extras).slice(0, 300) : "-";
  console.log(`extras: ${extras}`);
  console.log(`extensions: ${(gltf.extensionsUsed ?? []).join(", ") || "-"}`);
  console.log(`meshes ${gltf.meshes?.length ?? 0}, nodes ${gltf.nodes?.length ?? 0}, materials ${gltf.materials?.length ?? 0}, textures ${gltf.textures?.length ?? 0}, animations ${gltf.animations?.length ?? 0}, skins ${gltf.skins?.length ?? 0}`);
  console.log(`triangles (unique) ${Math.round(tris).toLocaleString()}, drawn ${Math.round(drawnTris).toLocaleString()}, vertices ${verts.toLocaleString()}`);
  console.log(`images: ${imgs.join("; ") || "-"}`);
  console.log(`materials: ${mats.slice(0, 18).join("; ")}${mats.length > 18 ? " ..." : ""}`);
  console.log(`node names (${names.length}): ${names.slice(0, 40).join(", ")}${names.length > 40 ? " ..." : ""}`);
  if (gltf.animations?.length) console.log(`animations: ${gltf.animations.map((a) => a.name).join(", ")}`);
}
