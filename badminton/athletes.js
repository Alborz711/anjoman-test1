/* بازیکنان واقعی بدمینتون (همان آدم‌های Mixamo والیبال)
   بارگذاری، دویدن و جابه‌جایی، دست راکت‌دار که سر راکت را به جای واقعی شاتل می‌برد،
   داور نشسته، داوران خط و تماشاگران.
   این فایل کتابخانهٔ سه‌بعدی را از پوشهٔ volleyball می‌خواند و سپس app.js را راه می‌اندازد. */
import * as THREE from "three";
import { GLTFLoader } from "../volleyball/lib/jsm/GLTFLoader.js";

window.THREE = THREE;
const V3 = THREE.Vector3, Q = THREE.Quaternion;
const ROOT = "../volleyball/assets/";
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, k) => a + (b - a) * k;
const smooth = (k) => { k = clamp(k, 0, 1); return k * k * (3 - 2 * k); };
const norm = (n) => n.replace(/^mixamorig\d*:?/, "");

/* ---------------- ابزار اسکلت ---------------- */
const _a = new V3(), _b = new V3(), _c = new V3(), _d = new V3(), _q1 = new Q(), _q2 = new Q(), _q3 = new Q();
/* استخوان b را طوری بچرخان که فرزندش c در جهت dir (جهانی) قرار بگیرد */
export function aim(b, c, dir, w) {
  if (!b || !c || w <= 0 || dir.lengthSq() < 1e-8) return;
  const bp = b.getWorldPosition(_a), cp = c.getWorldPosition(_b), cur = _c.copy(cp).sub(bp);
  if (cur.lengthSq() < 1e-10) return;
  cur.normalize();
  _q1.setFromUnitVectors(cur, _d.copy(dir).normalize());
  b.getWorldQuaternion(_q2); _q3.copy(_q1).multiply(_q2);
  b.parent.getWorldQuaternion(_q2); _q2.invert().multiply(_q3);
  if (w >= 1) b.quaternion.copy(_q2); else b.quaternion.slerp(_q2, w);
  b.updateMatrixWorld(true);
}
/* چرخش جهانی دور یک محور */
function rotWorld(b, axis, ang) {
  _q1.setFromAxisAngle(axis, ang);
  b.getWorldQuaternion(_q2); _q3.copy(_q1).multiply(_q2);
  b.parent.getWorldQuaternion(_q2); _q2.invert().multiply(_q3);
  b.quaternion.copy(_q2); b.updateMatrixWorld(true);
}
export function bonesOf(root) {
  const b = {};
  root.traverse((o) => { if (o.isBone || o.type === "Object3D" || o.type === "Bone") { o.name = norm(o.name); if (!b[o.name]) b[o.name] = o; } });
  return b;
}
const W = (x, y, z) => new V3(x, y, z).normalize();
/* حالت نشسته؛ رو به +z در لحظهٔ ساخت. kind: sit | cheer | clap | ump */
export function poseSeated(root, b, kind) {
  root.updateMatrixWorld(true);
  for (const s of [1, -1]) {
    const L = s > 0 ? "Left" : "Right";
    aim(b[L + "UpLeg"], b[L + "Leg"], W(0.12 * s, -0.12, 1), 1);
    aim(b[L + "Leg"], b[L + "Foot"], W(0.04 * s, -1, 0.12), 1);
  }
  aim(b.Spine, b.Spine2, W(0, 1, 0.1), 1);
  for (const s of [1, -1]) {
    const L = s > 0 ? "Left" : "Right";
    if (kind === "cheer") {
      aim(b[L + "Arm"], b[L + "ForeArm"], W(0.45 * s, 1, 0.15), 1);
      aim(b[L + "ForeArm"], b[L + "Hand"], W(0.15 * s, 1, 0.05), 1);
    } else if (kind === "clap") {
      aim(b[L + "Arm"], b[L + "ForeArm"], W(0.25 * s, -0.55, 0.6), 1);
      aim(b[L + "ForeArm"], b[L + "Hand"], W(-0.55 * s, 0.6, 0.6), 1);
    } else {
      aim(b[L + "Arm"], b[L + "ForeArm"], W(0.18 * s, -1, 0.3), 1);
      aim(b[L + "ForeArm"], b[L + "Hand"], W(-0.2 * s, -0.75, 1), 1);
    }
  }
  root.updateMatrixWorld(true);
}
/* مچ دست راست را دور دستهٔ راکت جمع کن */
function curlHand(b, side) {
  const H = b[side + "Hand"], M = b[side + "HandMiddle1"], I = b[side + "HandIndex1"], P = b[side + "HandPinky1"];
  if (!H || !M || !I || !P) return null;
  const hp = H.getWorldPosition(new V3()), dir = M.getWorldPosition(new V3()).sub(hp).normalize();
  const lat = I.getWorldPosition(new V3()).sub(P.getWorldPosition(new V3())).normalize();
  let palm = new V3().crossVectors(dir, lat).normalize();
  if (palm.y > 0) palm.negate(); // در حالت T کف دست رو به پایین است
  const axis = new V3().crossVectors(dir, palm).normalize();
  for (const f of ["Index", "Middle", "Ring", "Pinky"]) {
    [1.15, 1.35, 0.9].forEach((ang, i) => { const bn = b[side + "Hand" + f + (i + 1)]; if (bn) rotWorld(bn, axis, ang); });
  }
  const t1 = b[side + "HandThumb1"];
  if (t1) { const td = b[side + "HandThumb2"].getWorldPosition(new V3()).sub(t1.getWorldPosition(new V3())).normalize(); const ax = new V3().crossVectors(td, palm).normalize(); rotWorld(t1, ax, 0.35); [2, 3].forEach((k) => { const bn = b[side + "HandThumb" + k]; if (bn) rotWorld(bn, ax, 0.45); }); }
  return { dir, lat, palm, hp };
}

/* ---------------- راکت ---------------- */
function strTex() {
  const c = document.createElement("canvas"); c.width = c.height = 64; const x = c.getContext("2d");
  x.strokeStyle = "rgba(255,255,255,0.8)"; x.lineWidth = 1;
  for (let i = 2; i < 64; i += 5) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, 64); x.stroke(); x.beginPath(); x.moveTo(0, i); x.lineTo(64, i); x.stroke(); }
  const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; return t;
}
function makeRacket(col) {
  const g = new THREE.Group(), fm = new THREE.MeshStandardMaterial({ color: 0x22252c, metalness: 0.5, roughness: 0.35 }), gm = new THREE.MeshStandardMaterial({ color: col, roughness: 0.6 });
  const add = (geo, m, y) => { const o = new THREE.Mesh(geo, m); o.position.y = y; o.castShadow = true; g.add(o); return o; };
  add(new THREE.CylinderGeometry(0.014, 0.016, 0.2, 10), gm, 0.1);
  add(new THREE.CylinderGeometry(0.005, 0.005, 0.28, 6), fm, 0.34);
  const hd = add(new THREE.TorusGeometry(0.1, 0.007, 8, 32), fm, 0.58); hd.scale.set(0.82, 1.08, 1);
  const st = new THREE.Mesh(new THREE.CircleGeometry(0.1, 24), new THREE.MeshBasicMaterial({ map: strTex(), transparent: true, side: THREE.DoubleSide, depthWrite: false }));
  st.scale.set(0.82, 1.08, 1); st.position.y = 0.58; g.add(st);
  const head = new THREE.Object3D(); head.position.y = 0.58; g.add(head);
  return { g, head };
}

/* ---------------- بارگذاری ---------------- */
const PLAY = ["Ch42", "Ch38"], UMP = "Ch47";
const CL = ["goalkeeper_catch", "snatch", "idle", "running", "jog_strafe_left", "jog_strafe_right", "victory", "defeated"];
const CN = ["jump", "squat", "idle", "run", "sl", "sr", "win", "lose"];
const ATH = { ready: false, failed: false, prog: 0, listeners: [], data: null };
window.ATH = ATH;
function emit() { ATH.listeners.forEach((f) => { try { f(ATH.prog, ATH.ready, ATH.failed); } catch (e) {} }); }
ATH.on = (f) => { ATH.listeners.push(f); f(ATH.prog, ATH.ready, ATH.failed); };
function prepClip(clip, srcRestY, name) {
  const c = clip.clone(); c.name = name;
  c.tracks = c.tracks.filter((tr) => tr.name.endsWith(".quaternion") || /Hips\.position$/.test(tr.name)).map((tr) => { const i = tr.name.lastIndexOf("."); tr.name = norm(tr.name.slice(0, i)) + tr.name.slice(i); return tr; })
    .filter((tr) => !/^RightHand(Thumb|Index|Middle|Ring|Pinky)/.test(tr.name));
  c.userData = { srcRestY };
  return c;
}
function load() {
  const L = new GLTFLoader(), got = {}, SZ = { Ch42: 2.92e6, Ch38: 2.67e6, Ch47: 2.43e6, crowd: 4e5 }, total = 8.42e6 + 8.4e5;
  const prog = (k) => (e) => { got[k] = e.loaded || 0; ATH.prog = Math.min(0.99, Object.values(got).reduce((a, b) => a + b, 0) / total); emit(); };
  const restOf = (g) => { let y = null; g.scene.traverse((o) => { if (y === null && norm(o.name) === "Hips") y = o.position.y; }); return y || 1; };
  const files = [...PLAY, UMP].map((c) => ROOT + c + ".glb").concat(CL.map((c) => ROOT + c + ".glb"), ["assets/crowd.glb"]);
  const keys = [...PLAY, UMP, ...CL, "crowd"];
  return Promise.all(files.map((f, i) => L.loadAsync(f, prog(keys[i])))).then((res) => {
    const clips = {};
    CL.forEach((c, i) => { const g = res[3 + i]; clips[CN[i]] = prepClip(g.animations[0], restOf(g), CN[i]); });
    ATH.data = { players: res.slice(0, 2), ump: res[2], clips, crowd: res[res.length - 1] };
    ATH.ready = true; ATH.prog = 1; emit();
  }).catch((e) => { console.error(e); ATH.failed = true; emit(); });
}

function tidy(root) {
  root.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = false; o.frustumCulled = false; if (o.material) { o.material.roughness = Math.max(0.55, o.material.roughness || 0.6); o.material.metalness = 0; } } });
}

/* ---------------- بازیکن ---------------- */
const SEG = {
  jump: ["jump", 0.95, 2.2, 0.6],
  dig: ["squat", 0.1, 0.75, 0.22],
  win: ["win", 0.0, 2.6, 0],
  lose: ["lose", 0.3, 3.0, 0]
};
const ONE = ["jump", "squat", "win", "lose"];
class Athlete {
  constructor(gltf, p, grip) {
    this.p = p;
    const root = gltf.scene; this.root = root; tidy(root);
    const b = bonesOf(root); this.b = b;
    root.updateMatrixWorld(true);
    /* راکت در دست راست، در حالت استراحت ساخته و به استخوان دست وصل می‌شود */
    const h = curlHand(b, "Right");
    const rk = makeRacket(grip); this.rk = rk;
    const Yw = h.lat.clone().multiplyScalar(0.85).addScaledVector(h.dir, 0.5).normalize();
    const Zw = h.palm.clone().addScaledVector(Yw, -h.palm.dot(Yw)).normalize(), Xw = new V3().crossVectors(Yw, Zw);
    const pc = h.hp.clone().addScaledVector(h.dir, 0.085).addScaledVector(h.palm, 0.03);
    const M = new THREE.Matrix4().makeBasis(Xw, Yw, Zw).setPosition(pc.clone().addScaledVector(Yw, -0.1));
    const inv = new THREE.Matrix4().copy(b.RightHand.matrixWorld).invert();
    M.premultiply(inv); M.decompose(rk.g.position, rk.g.quaternion, rk.g.scale);
    b.RightHand.add(rk.g); root.updateMatrixWorld(true);
    /* اندازه‌های دست */
    const wp = (n) => b[n].getWorldPosition(new V3());
    this.Lu = wp("RightArm").distanceTo(wp("RightForeArm")); this.Lf = wp("RightForeArm").distanceTo(wp("RightHand"));
    this.L1 = (this.Lu + this.Lf) * 0.96; this.L2 = wp("RightHand").distanceTo(rk.head.getWorldPosition(new V3()));
    this.hipsY = b.Hips.position.y;
    /* حرکت‌ها */
    this.mixer = new THREE.AnimationMixer(root); this.act = {};
    const C = ATH.data.clips;
    for (const k in C) {
      const src = C[k], c = src.clone(), k2 = this.hipsY / src.userData.srcRestY, hx = b.Hips.position.x, hz = b.Hips.position.z;
      c.tracks = c.tracks.map((tr) => { if (tr.name !== "Hips.position") return tr; const t2 = tr.clone(), v = t2.values; for (let j = 0; j < v.length; j += 3) { v[j] = hx; v[j + 1] *= k2; v[j + 2] = hz; } return t2; });
      const a = this.mixer.clipAction(c); a.enabled = true; a.setEffectiveWeight(0); a.play(); this.act[k] = a;
    }
    ONE.forEach((k) => { this.act[k].paused = true; });
    this.x = 0; this.z = p === 0 ? 4 : -4; this.vx = 0; this.vz = 0; this.ry = p === 0 ? Math.PI : 0;
    this.w = { run: 0, sl: 0, sr: 0 }; this.os = null; this.ft = -1; this.lastSw = 0; this.hitP = new V3(); this.kind = "fh";
    this.lunge = new V3(); this.rw = 0; this.init = false; this.mood = null;
    this.T = new V3(); this.P = new V3(); this.lastHead = new V3();
  }
  play(kind) { const s = SEG[kind]; this.os = { clip: s[0], a: s[1], b: s[2], c: s[3], t: 0 }; }
  frame() {
    const fw = new V3(Math.sin(this.ry), 0, Math.cos(this.ry)), up = new V3(0, 1, 0), rt = new V3().crossVectors(fw, up);
    return { fw, up, rt };
  }
  /* o: { x, z, sw, show, pred:{tc,x,y,z}, serving, mood } */
  update(dt, o) {
    const root = this.root;
    root.visible = o.show; if (!o.show) return;
    if (!this.init || dt <= 0) { if (!this.init) { this.x = o.x; this.z = o.z; this.init = true; } }
    if (dt > 0) {
      const ivx = (o.x - this.x) / dt, ivz = (o.z - this.z) / dt, k0 = Math.min(1, dt * 12);
      this.vx = lerp(this.vx, clamp(ivx, -9, 9), k0); this.vz = lerp(this.vz, clamp(ivz, -9, 9), k0);
    }
    this.x = o.x; this.z = o.z;
    const pred = o.pred; this.pred = pred;
    /* حرکت‌های یک‌باره: پرش برای اسمش، خم شدن برای شاتل پایین، شادی و ناراحتی */
    if (o.mood && this.mood !== o.mood) { this.mood = o.mood; this.play(o.mood); }
    if (!o.mood) this.mood = null;
    if (pred && !this.os) {
      if (pred.y > 2.3 && pred.tc <= SEG.jump[3] && pred.tc > 0.25) this.play("jump");
      else if (pred.y < 0.7 && pred.tc <= SEG.dig[3] + 0.02) this.play("dig");
    }
    let osw = 0;
    if (this.os) {
      const s = this.os; s.t += dt; const dur = s.b - s.a;
      osw = s.t < 0.12 ? s.t / 0.12 : s.t > dur - 0.18 ? Math.max(0, (dur - s.t) / 0.18) : 1;
      const a = this.act[s.clip]; a.time = clamp(s.a + s.t, 0, a.getClip().duration);
      if (s.t >= dur && !this.mood) { this.os = null; osw = 0; }
      if (s.t >= dur && this.mood) { s.t = dur; osw = 1; }
    }
    const base = 1 - osw;
    for (const k of ONE) this.act[k].setEffectiveWeight(this.os && this.os.clip === k ? osw : 0);
    /* جهت بدن: رو به تور، کمی چرخیده به سوی شاتل */
    const netYaw = this.p === 0 ? Math.PI : 0, sp = Math.hypot(this.vx, this.vz);
    let ty = netYaw;
    if (sp > 2.4 && !pred && !this.os) { const fN = this.vx * Math.sin(netYaw) + this.vz * Math.cos(netYaw); if (Math.abs(fN) > sp * 0.8 && fN < 0) ty = Math.atan2(this.vx, this.vz); }
    if (pred && pred.tc < 0.7) {
      const dx = pred.x - this.x, dz = pred.z - this.z, f = this.p === 0 ? -1 : 1;
      const lat = -dx * f; // مثبت = سمت راست بازیکن
      ty = netYaw + clamp(Math.atan2(lat, Math.max(0.3, dz * f)) * 0.45, -0.55, 0.55) * (pred.y > 1.8 ? 0.6 : 1);
      if (pred.y > 1.8 && lat > -0.2) ty += 0.35 * (this.p === 0 ? 1 : 1); // شانهٔ چپ رو به تور برای ضربهٔ بالای سر
    }
    const dy = ((ty - this.ry + Math.PI * 3) % (Math.PI * 2)) - Math.PI; this.ry += dy * Math.min(1, dt * 10);
    const fwv = this.vx * Math.sin(this.ry) + this.vz * Math.cos(this.ry), latv = -this.vx * Math.cos(this.ry) + this.vz * Math.sin(this.ry);
    const k = Math.min(1, dt * 9);
    this.w.run = lerp(this.w.run, clamp(Math.abs(fwv) / 2.6, 0, 1), k);
    this.w.sr = lerp(this.w.sr, clamp(latv / 2.2, 0, 1), k); this.w.sl = lerp(this.w.sl, clamp(-latv / 2.2, 0, 1), k);
    const sum = this.w.run + this.w.sr + this.w.sl, nrm = sum > 1 ? 1 / sum : 1;
    this.act.run.setEffectiveWeight(this.w.run * nrm * base); this.act.sr.setEffectiveWeight(this.w.sr * nrm * base); this.act.sl.setEffectiveWeight(this.w.sl * nrm * base);
    this.act.idle.setEffectiveWeight(Math.max(0, 1 - sum * nrm) * base);
    this.act.run.timeScale = (fwv < -0.2 ? -1 : 1) * clamp(Math.abs(fwv) / 4.5, 0.6, 1.4);
    this.act.sr.timeScale = this.act.sl.timeScale = clamp(Math.abs(latv) / 3, 0.6, 1.4);
    this.mixer.update(dt);
    /* لانژ: وقتی شاتل دور است، بدن به سویش کشیده می‌شود */
    const lt = new V3();
    if (pred && pred.tc < 0.45) { const dx = pred.x - this.x, dz = pred.z - this.z, dd = Math.hypot(dx, dz), ex = clamp(dd - 0.7, 0, 0.45); if (dd > 0.01) lt.set(dx / dd * ex, 0, dz / dd * ex); }
    this.lunge.lerp(lt, Math.min(1, dt * (lt.lengthSq() > 0 ? 9 : 4)));
    root.position.set(this.x + this.lunge.x, 0, this.z + this.lunge.z); root.rotation.y = this.ry;
    root.updateMatrixWorld(true);
    this.arms(dt, o);
  }
  /* دست راکت‌دار */
  arms(dt, o) {
    const b = this.b, { fw, up, rt } = this.frame(), S = b.RightArm.getWorldPosition(new V3());
    const pred = o.pred, sw = o.sw || 0;
    if (sw > this.lastSw + 0.05) { this.ft = 0; if (o.hp && !o.serveHit) this.hitP.set(o.hp[0], o.hp[1], o.hp[2]); else this.hitP.copy(this.lastHead); this.fkind = this.kind; }
    this.lastSw = sw;
    const ready = S.clone().addScaledVector(fw, 0.42).addScaledVector(up, 0.4).addScaledVector(rt, 0.28);
    let T = ready, pole = new V3().copy(up).multiplyScalar(-0.85).addScaledVector(fw, -0.15).addScaledVector(rt, 0.45);
    let lw = 0, lT = null;
    if (pred) {
      const P = this.P.set(pred.x, pred.y, pred.z), rel = P.clone().sub(S), lat = rel.dot(rt);
      const kind = pred.y > 1.75 ? "oh" : lat < -0.15 ? "bh" : "fh"; this.kind = kind;
      let C;
      if (kind === "oh") C = S.clone().addScaledVector(up, 0.2).addScaledVector(fw, -0.5).addScaledVector(rt, 0.22);
      else if (kind === "fh") C = S.clone().addScaledVector(rt, 0.65).addScaledVector(fw, -0.35).addScaledVector(up, pred.y < 0.9 ? -0.35 : 0.05);
      else C = S.clone().addScaledVector(rt, -0.55).addScaledVector(up, 0.25).addScaledVector(fw, 0.05);
      if (kind === "bh") pole = new V3().copy(up).multiplyScalar(-0.3).addScaledVector(fw, 0.4).addScaledVector(rt, -0.6);
      const WIN = 0.3, PRE = 0.85;
      if (pred.tc > WIN) T = ready.clone().lerp(C, smooth((PRE - pred.tc) / (PRE - WIN)));
      else { const u = clamp(1 - (pred.tc - 0.035) / (WIN - 0.035), 0, 1); T = C.clone().lerp(P, u * u * (1.4 - 0.4 * u)); }
      if (kind === "oh") { lw = smooth((0.9 - pred.tc) / 0.4); lT = P; }
    }
    if (this.ft >= 0) {
      this.ft += dt;
      const fk = this.fkind || "fh";
      let F;
      if (o.serveHit) F = S.clone().addScaledVector(fw, 0.65).addScaledVector(up, 0.35).addScaledVector(rt, -0.1);
      else if (fk === "oh") F = S.clone().addScaledVector(fw, 0.35).addScaledVector(up, -0.75).addScaledVector(rt, -0.5);
      else if (fk === "fh") F = S.clone().addScaledVector(fw, 0.45).addScaledVector(rt, -0.6).addScaledVector(up, 0.2);
      else F = S.clone().addScaledVector(rt, 0.55).addScaledVector(fw, 0.35).addScaledVector(up, 0.25);
      if (this.ft < 0.22) T = this.hitP.clone().lerp(F, smooth(this.ft / 0.22));
      else if (this.ft < 0.5 && !pred) T = F.lerp(ready, smooth((this.ft - 0.22) / 0.28));
      else this.ft = -1;
    }
    if (o.serving && o.hold) {
      /* سرویس: شاتل در دست چپ، سر راکت درست پشت آن */
      T = o.hold.clone().addScaledVector(fw, -0.11).addScaledVector(up, -0.06).addScaledVector(rt, 0.02);
      pole = new V3().copy(up).multiplyScalar(-0.7).addScaledVector(rt, 0.6);
    }
    /* نرم کردن هدف تا دست نپرد */
    if (!this.Tinit) { this.T.copy(T); this.Tinit = true; }
    const snap = (pred && pred.tc < 0.15) || (this.ft >= 0 && this.ft < 0.05);
    this.T.lerp(T, snap ? 1 : Math.min(1, dt * 22));
    this.ik(this.T, pole, up, rt, fw);
    this.rk.head.getWorldPosition(this.lastHead);
    /* دست چپ */
    if (o.serving && o.hold) {
      const ls = b.LeftArm.getWorldPosition(new V3());
      const tgt = o.hold.clone().addScaledVector(up, 0.08);
      const d = tgt.clone().sub(ls), L = d.length(), lu = this.Lu, lf = this.Lf, dl = clamp(L, 0.1, lu + lf - 0.01);
      const a2 = (lu * lu - lf * lf + dl * dl) / (2 * dl), h2 = Math.sqrt(Math.max(0, lu * lu - a2 * a2));
      d.normalize(); const ep = new V3().copy(up).multiplyScalar(-1).addScaledVector(rt, -0.5); ep.addScaledVector(d, -ep.dot(d)).normalize();
      const E = ls.clone().addScaledVector(d, a2).addScaledVector(ep, h2);
      aim(b.LeftArm, b.LeftForeArm, E.clone().sub(ls), 1);
      const ef = b.LeftForeArm.getWorldPosition(new V3()); aim(b.LeftForeArm, b.LeftHand, tgt.clone().sub(ef), 1);
    } else if (lw > 0 && lT) {
      const ls = b.LeftArm.getWorldPosition(new V3()), d = lT.clone().sub(ls).normalize().addScaledVector(up, 0.4);
      aim(b.LeftArm, b.LeftForeArm, d, lw * 0.9); aim(b.LeftForeArm, b.LeftHand, d, lw * 0.9);
    }
  }
  ik(T, pole, up, rt, fw) {
    const b = this.b, S = b.RightArm.getWorldPosition(new V3());
    const d = T.clone().sub(S); let dl = d.length(); d.multiplyScalar(1 / (dl || 1));
    const L1 = this.L1, L2 = this.L2;
    dl = clamp(dl, Math.abs(L1 - L2) + 0.03, L1 + L2 - 0.002);
    const a = (L1 * L1 - L2 * L2 + dl * dl) / (2 * dl), h = Math.sqrt(Math.max(0, L1 * L1 - a * a));
    const pp = pole.clone().addScaledVector(d, -pole.dot(d)); if (pp.lengthSq() < 1e-6) pp.copy(up).multiplyScalar(-1); pp.normalize();
    const Wp = S.clone().addScaledVector(d, a).addScaledVector(pp, h);
    /* آرنج */
    const sw = Wp.clone().sub(S), sl = Math.max(0.05, sw.length()); sw.multiplyScalar(1 / sl);
    const Lu = this.Lu, Lf = this.Lf, sl2 = clamp(sl, Math.abs(Lu - Lf) + 0.01, Lu + Lf - 0.001);
    const a2 = (Lu * Lu - Lf * Lf + sl2 * sl2) / (2 * sl2), h2 = Math.sqrt(Math.max(0, Lu * Lu - a2 * a2));
    const ep = new V3().copy(up).multiplyScalar(-0.8).addScaledVector(rt, 0.6).addScaledVector(fw, -0.2); ep.addScaledVector(sw, -ep.dot(sw)); if (ep.lengthSq() < 1e-6) ep.copy(rt); ep.normalize();
    const E = S.clone().addScaledVector(sw, a2).addScaledVector(ep, h2);
    aim(b.RightArm, b.RightForeArm, E.clone().sub(S), 1);
    const Ew = b.RightForeArm.getWorldPosition(new V3()); aim(b.RightForeArm, b.RightHand, Wp.clone().sub(Ew), 1);
    const Hw = b.RightHand.getWorldPosition(new V3()); aim(b.RightHand, this.rk.head, T.clone().sub(Hw), 1);
  }
  head(out) { return this.rk.head.getWorldPosition(out || new V3()); }
  holdPoint(out) {
    const H = this.b.LeftHand.getWorldPosition(out || new V3()), M = this.b.LeftHandMiddle1;
    if (M) { const m = M.getWorldPosition(new V3()); H.lerp(m, 1.4); }
    return H;
  }
}

/* ---------------- داور نشسته ---------------- */
class Umpire {
  constructor(gltf) {
    const root = gltf.scene; this.root = root; tidy(root);
    this.b = bonesOf(root); root.position.set(0, 0, 0); root.rotation.set(0, 0, 0);
    poseSeated(root, this.b, "ump");
    this.headRest = this.b.Head.quaternion.clone(); this.neckRest = this.b.Neck ? this.b.Neck.quaternion.clone() : null;
    root.updateMatrixWorld(true);
    this.hips = this.b.Hips.getWorldPosition(new V3());
  }
  place(x, seatY, z, ry) {
    this.root.rotation.y = ry;
    const off = this.hips.clone().applyAxisAngle(new V3(0, 1, 0), ry);
    this.root.position.set(x - off.x, seatY + 0.1 - this.hips.y, z - off.z);
    this.root.updateMatrixWorld(true);
  }
  look(p, dt) {
    const h = this.b.Head, n = this.b.Neck;
    h.quaternion.copy(this.headRest); if (n) n.quaternion.copy(this.neckRest);
    this.root.updateMatrixWorld(true);
    if (!p) return;
    const hp = h.getWorldPosition(new V3()), d = p.clone().sub(hp), ry = this.root.rotation.y;
    const fwd = new V3(Math.sin(ry), 0, Math.cos(ry));
    let yaw = Math.atan2(d.x, d.z) - Math.atan2(fwd.x, fwd.z); yaw = ((yaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
    yaw = clamp(yaw, -1.3, 1.3);
    this.yaw = lerp(this.yaw || 0, yaw, Math.min(1, dt * 6));
    const pitch = clamp(Math.atan2(d.y, Math.hypot(d.x, d.z)), -0.5, 0.5);
    this.pitch = lerp(this.pitch || 0, pitch, Math.min(1, dt * 6));
    if (n) rotWorld(n, new V3(0, 1, 0), this.yaw * 0.4);
    rotWorld(h, new V3(0, 1, 0), this.yaw * 0.6);
    const side = new V3(Math.cos(ry + this.yaw), 0, -Math.sin(ry + this.yaw));
    rotWorld(h, side, -this.pitch * 0.7);
  }
}

/* ---------------- تماشاگران (مش‌های نشستهٔ ساده‌شده در assets/crowd.glb) ---------------- */
function crowdParts(kind) {
  const out = [];
  ATH.data.crowd.scene.traverse((o) => { if (o.isMesh && o.name.indexOf(kind) === 0) out.push(o); });
  return out;
}
function buildCrowd(seats, mob) {
  const g = new THREE.Group();
  const list = mob ? seats.filter((s, i) => i % 2 === 0) : seats;
  const per = [[], [], [], []];
  list.forEach((s, i) => per[(i * 7 + (i >> 3)) % 4].push(s));
  const sets = [];
  for (let c = 0; c < 4; c++) {
    const S = per[c]; if (!S.length) continue;
    const sit = crowdParts("C" + c + "_sit"), ch = crowdParts("C" + c + "_cheer");
    const mk = (src) => src.map((m) => { const im = new THREE.InstancedMesh(m.geometry, m.material, S.length); im.castShadow = false; im.receiveShadow = false; im.frustumCulled = false; g.add(im); return im; });
    const A = mk(sit), B = mk(ch);
    const col = new THREE.Color(), mtx = new THREE.Matrix4();
    S.forEach((s, j) => { const v = 0.82 + Math.random() * 0.3; col.setRGB(v, v * (0.97 + Math.random() * 0.06), v); A.concat(B).forEach((im) => im.setColorAt(j, col)); });
    sets.push({ S, A, B, ph: S.map(() => Math.random() * 6.28), up: S.map(() => Math.random()), cheer: S.map(() => Math.random() < 0.55) });
  }
  const mtx = new THREE.Matrix4(), q = new Q(), sc = new V3(1, 1, 1), z0 = new V3(0, 0, 0), pos = new V3(), Y = new V3(0, 1, 0);
  function set(t, cheer) {
    sets.forEach((st) => {
      st.S.forEach((s, j) => {
        q.setFromAxisAngle(Y, s[3] + Math.sin(t * 0.3 + st.ph[j]) * 0.08);
        const on = cheer > 0 && st.cheer[j];
        const hop = on ? Math.max(0, Math.sin(t * 10 + st.ph[j])) * 0.12 * Math.min(1, cheer) : 0;
        pos.set(s[0], s[1] + hop, s[2]);
        mtx.compose(pos, q, on ? z0 : sc); st.A.forEach((im) => im.setMatrixAt(j, mtx));
        mtx.compose(pos, q, on ? sc : z0); st.B.forEach((im) => im.setMatrixAt(j, mtx));
      });
      st.A.concat(st.B).forEach((im) => { im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true; });
    });
  }
  set(0, 0);
  let was = false;
  return { g, update(t, cheer) { if (cheer > 0 || was) { set(t, cheer); was = cheer > 0; } } };
}
function judgeMesh() {
  const parts = crowdParts("J_sit"), g = new THREE.Group();
  parts.forEach((m) => { const c = new THREE.Mesh(m.geometry, m.material); c.castShadow = true; g.add(c); });
  return g;
}

/* ---------------- رابط برای app.js ---------------- */
ATH.make = function (opts) {
  const D = ATH.data;
  const players = [new Athlete(D.players[0], 0, 0xc62828), new Athlete(D.players[1], 1, 0x1f4fb3)];
  const ump = new Umpire(D.ump);
  const crowd = buildCrowd(opts.seats, opts.mob);
  const judges = (opts.judges || []).map((j) => { const m = judgeMesh(); m.position.set(j[0], j[1], j[2]); m.rotation.y = j[3]; return m; });
  return { players, ump, crowd, judges };
};

if (!window.__BAKE) load();

/* راه‌اندازی بازی پس از آماده شدن کتابخانهٔ سه‌بعدی */
(function boot() {
  if (window.__BAKE) return;
  const v = document.currentScript ? "" : (import.meta.url.split("?")[1] || "");
  const q = v ? "?" + v : "";
  const s1 = document.createElement("script"); s1.src = "lib/peerjs.min.js";
  s1.onload = s1.onerror = () => { const s2 = document.createElement("script"); s2.src = "app.js" + q; document.body.appendChild(s2); };
  document.body.appendChild(s1);
})();
