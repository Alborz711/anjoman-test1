/* تماشاگران واقعی (Mixamo) برای پینگ‌پنگ
   مش‌های نشستهٔ ساده‌شده از ../badminton/assets/crowd.glb خوانده می‌شوند؛
   کتابخانهٔ سه‌بعدی از ../volleyball/lib. سپس app.js راه می‌افتد. */
import * as THREE from "three";
import { GLTFLoader } from "../volleyball/lib/jsm/GLTFLoader.js";

window.THREE = THREE;
const CR = { ready: false, failed: false, scene: null };
window.PPCROWD = CR;

new GLTFLoader().loadAsync("../badminton/assets/crowd.glb").then((g) => {
  CR.scene = g.scene; CR.ready = true;
}).catch((e) => { console.error(e); CR.failed = true; });

function parts(kind) {
  const out = [];
  CR.scene.traverse((o) => { if (o.isMesh && o.name.indexOf(kind) === 0) out.push(o); });
  return out;
}
/* seats: [x, y, z, ry]؛ y سطح نشیمن است */
CR.build = function (seats, mob) {
  const g = new THREE.Group();
  const list = mob ? seats.filter((s, i) => i % 2 === 0) : seats;
  const per = [[], [], [], []];
  list.forEach((s, i) => per[(i * 7 + (i >> 3)) % 4].push(s));
  const sets = [], col = new THREE.Color();
  for (let c = 0; c < 4; c++) {
    const S = per[c]; if (!S.length) continue;
    const mk = (src) => src.map((m) => { const im = new THREE.InstancedMesh(m.geometry, m.material, S.length); im.frustumCulled = false; g.add(im); return im; });
    const A = mk(parts("C" + c + "_sit")), B = mk(parts("C" + c + "_cheer"));
    S.forEach((s, j) => { const v = 0.8 + Math.random() * 0.3; col.setRGB(v, v * (0.97 + Math.random() * 0.06), v); A.concat(B).forEach((im) => im.setColorAt(j, col)); });
    sets.push({ S, A, B, ph: S.map(() => Math.random() * 6.28), cheer: S.map(() => Math.random() < 0.55) });
  }
  const mtx = new THREE.Matrix4(), q = new THREE.Quaternion(), one = new THREE.Vector3(1, 1, 1), zero = new THREE.Vector3(0, 0, 0), pos = new THREE.Vector3(), Y = new THREE.Vector3(0, 1, 0);
  function set(t, cheer) {
    sets.forEach((st) => {
      st.S.forEach((s, j) => {
        q.setFromAxisAngle(Y, s[3] + Math.sin(t * 0.3 + st.ph[j]) * 0.08);
        const on = cheer > 0 && st.cheer[j];
        pos.set(s[0], s[1] + (on ? Math.max(0, Math.sin(t * 10 + st.ph[j])) * 0.1 * Math.min(1, cheer) : 0), s[2]);
        mtx.compose(pos, q, on ? zero : one); st.A.forEach((im) => im.setMatrixAt(j, mtx));
        mtx.compose(pos, q, on ? one : zero); st.B.forEach((im) => im.setMatrixAt(j, mtx));
      });
      st.A.concat(st.B).forEach((im) => { im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true; });
    });
  }
  set(0, 0);
  let was = false;
  return { g, update(t, cheer) { if (cheer > 0 || was) { set(t, cheer); was = cheer > 0; } } };
};

/* راه‌اندازی بازی */
(function boot() {
  const q = import.meta.url.split("?")[1] ? "?" + import.meta.url.split("?")[1] : "";
  const s1 = document.createElement("script"); s1.src = "lib/peerjs.min.js";
  s1.onload = s1.onerror = () => { const s2 = document.createElement("script"); s2.src = "app.js" + q; document.body.appendChild(s2); };
  document.body.appendChild(s1);
})();
