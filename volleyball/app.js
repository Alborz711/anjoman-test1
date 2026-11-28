/* والیبال ساحلی انجمن ایرانیان سوندبی‌بری — سه‌بعدی با بازیکنان واقع‌گرا (Mixamo)
   دو نفر در برابر دو نفر، بازی با رایانه در چهار سطح و تمرین اسپک
   گرافیک: Three.js r149 (lib/three.module.js) */
import * as THREE from "three";
import { GLTFLoader } from "./lib/jsm/GLTFLoader.js";

/* ---------------- ابزار ---------------- */
const $ = (id) => document.getElementById(id);
function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const rnd = (a, b) => a + Math.random() * (b - a);
const lerp = (a, b, k) => a + (b - a) * k;
function esc(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
let LANG = store("lang") === "sv" ? "sv" : "fa";
const FAD = "۰۱۲۳۴۵۶۷۸۹";
const num = (n) => { n = String(n); return LANG === "fa" ? n.replace(/\d/g, (d) => FAD[d]) : n; };

const S = {
fa: {
  title: "والیبال ساحلی", back: "→ بازگشت به تارنمای انجمن", langBtn: "Svenska",
  intro: "والیبال ساحلی دو نفر در برابر دو نفر، کنار دریا و با بازیکنانی که حرکتشان از ورزشکاران واقعی ضبط شده است. شما و هم‌تیمی‌تان (رایانه) در برابر تیم رایانه.",
  name: "نام شما", namePh: "مثلاً: البرز",
  level: "سطح بازی",
  lv: { e: "آسان", m: "متوسط", h: "دشوار", p: "حرفه‌ای" },
  lvd: { e: "توپ آهسته، حریف آرام", m: "ریتم معمولی", h: "حریف تند و دقیق", p: "سرعت واقعی، بلاک و اسپک قوی" },
  len: "طول مسابقه", len1: "یک گیم ۲۱ امتیازی", len3: "بهترین ۳ گیم",
  vsAI: "مسابقه با رایانه", practice: "تمرین اسپک", loading: "در حال آماده‌سازی بازیکنان…", loadFail: "بارگذاری بازیکنان ناموفق بود. صفحه را دوباره باز کنید.",
  rulesT: "راهنما و قوانین",
  rules: [
    "هر تیم دو بازیکن دارد. شما بازیکن پیراهن قرمز نزدیک دوربین هستید و هم‌تیمی‌تان را رایانه بازی می‌کند.",
    "حرکت: انگشت یا موس را روی زمین بکشید تا بازیکن به آنجا برود. حلقهٔ زرد روی شن جایی را نشان می‌دهد که باید زیر توپ بروید. وقتی به توپ برسید، ساعد یا پاس خودبه‌خود زده می‌شود.",
    "اسپک: ضربهٔ سوم با شماست وقتی دایرهٔ «اسپک» پایین صفحه ظاهر شود. روی جایی از زمین حریف بزنید که می‌خواهید توپ آنجا فرود بیاید. بهترین لحظه وقتی است که دایره کامل پر شده.",
    "سرویس: وقتی نوبت سرویس شماست، روی جای دلخواه در زمین حریف بزنید.",
    "بلاک: وقتی حریف اسپک می‌زند و شما نزدیک تور هستید، در لحظهٔ درست روی صفحه بزنید تا بپرید.",
    "هر تیم حداکثر سه ضربه دارد. هر رالی یک امتیاز دارد و برندهٔ رالی سرویس می‌زند. گیم اول و دوم تا ۲۱ و گیم سوم تا ۱۵ است و باید دو امتیاز جلو بود.",
    "صفحه‌کلید: جهت‌ها برای حرکت، فاصله برای اسپک، بلاک و سرویس."
  ],
  computer: "رایانه", partner: "هم‌تیمی", me: "هموند", teamCpu: "تیم رایانه",
  serveYou: "سرویس با شماست", serveYouS: "روی جای فرود در زمین حریف بزنید", servePartner: "هم‌تیمی شما سرویس می‌زند", serveOpp: "سرویس حریف",
  point: "امتیاز برای {n}", r_in: "توپ در زمین افتاد", r_out: "توپ بیرون رفت", r_net: "توپ به تور خورد", r_block: "بلاک!", r_ace: "سرویس برنده",
  setWon: "گیم به {n} رسید", matchWon: "{n} برندهٔ مسابقه شد", setPt: "امتیاز گیم", matchPt: "امتیاز مسابقه",
  youWon: "شما بردید!", youLost: "این بار حریف برد", again: "بازی دوباره", menu: "بازگشت به منو",
  pause: "مکث", resume: "ادامه", exit: "خروج", sndOn: "صدا: روشن", sndOff: "صدا: خاموش", paused: "بازی متوقف شد",
  noGL: "مرورگر شما گرافیک سه‌بعدی (WebGL) را پشتیبانی نمی‌کند.",
  hint: "بکشید تا حرکت کنید · روی زمین حریف بزنید تا اسپک یا سرویس بزنید",
  hintP: "هم‌تیمی برایتان پاس می‌دهد؛ وقتی دایره پر شد، روی هدف در زمین حریف بزنید.",
  spike: "اسپک", block: "بلاک", serve: "سرویس", go: "برو زیر توپ",
  setW: "گیم", rally: "رالی", streak: "اسپک موفق پیاپی", best: "رکورد", good: "عالی!", miss: "خطا",
  replay: "بازپخش", skip: "برای رد شدن، روی صفحه بزنید", perfect: "عالی!", early: "زود", late: "دیر",
  statsT: "آمار مسابقه", sPts: "امتیازها", sKill: "اسپک برنده", sBlock: "بلاک", sAce: "سرویس برنده", sErr: "خطا", sFast: "سریع‌ترین اسپک", sLong: "طولانی‌ترین رالی (ضربه)", kmh: "km/h"
},
sv: {
  title: "Beachvolleyboll", back: "← Tillbaka till föreningens webbplats", langBtn: "فارسی",
  intro: "Beachvolleyboll två mot två vid havet, med spelare vars rörelser är inspelade från riktiga idrottare. Du och din lagkamrat (datorn) mot datorns lag.",
  name: "Ditt namn", namePh: "t.ex. Alborz",
  level: "Nivå",
  lv: { e: "Lätt", m: "Medel", h: "Svår", p: "Proffs" },
  lvd: { e: "Långsam boll, lugn motståndare", m: "Normalt tempo", h: "Snabb och exakt motståndare", p: "Verkligt tempo, starka block och smashar" },
  len: "Matchlängd", len1: "Ett set till 21", len3: "Bäst av 3 set",
  vsAI: "Match mot datorn", practice: "Smashträning", loading: "Förbereder spelarna…", loadFail: "Spelarna kunde inte laddas. Ladda om sidan.",
  rulesT: "Regler och styrning",
  rules: [
    "Varje lag har två spelare. Du är spelaren i röd tröja närmast kameran och datorn spelar din lagkamrat.",
    "Rörelse: dra fingret eller musen över sanden så springer spelaren dit. Den gula ringen visar var du ska stå under bollen. När du når bollen sker bagger eller fingerslag automatiskt.",
    "Smash: tredje slaget är ditt när cirkeln ”Smash” syns längst ner. Tryck där på motståndarens plan där bollen ska landa. Bäst är när cirkeln är helt fylld.",
    "Serve: när det är din serve, tryck där du vill att bollen ska landa på motståndarens plan.",
    "Block: när motståndaren smashar och du står nära nätet, tryck i rätt ögonblick för att hoppa.",
    "Varje lag får högst tre touchar. Varje boll ger poäng och vinnaren servar. Set 1 och 2 spelas till 21 och set 3 till 15, med två poängs marginal.",
    "Tangenter: piltangenterna flyttar, mellanslag för smash, block och serve."
  ],
  computer: "Datorn", partner: "Lagkamrat", me: "Medlem", teamCpu: "Datorns lag",
  serveYou: "Din serve", serveYouS: "Tryck där bollen ska landa på motståndarens plan", servePartner: "Din lagkamrat servar", serveOpp: "Motståndarens serve",
  point: "Poäng till {n}", r_in: "Bollen landade inne", r_out: "Bollen gick ut", r_net: "Bollen tog i nätet", r_block: "Block!", r_ace: "Serveess",
  setWon: "Setet till {n}", matchWon: "{n} vann matchen", setPt: "Setboll", matchPt: "Matchboll",
  youWon: "Du vann!", youLost: "Motståndarna vann den här gången", again: "Spela igen", menu: "Till menyn",
  pause: "Paus", resume: "Fortsätt", exit: "Avsluta", sndOn: "Ljud: på", sndOff: "Ljud: av", paused: "Pausad",
  noGL: "Din webbläsare stöder inte 3D-grafik (WebGL).",
  hint: "Dra för att springa · tryck på motståndarens plan för smash eller serve",
  hintP: "Lagkamraten passar dig; när cirkeln är fylld, tryck på målet på motståndarens plan.",
  spike: "Smash", block: "Block", serve: "Serve", go: "Gå under bollen",
  setW: "Set", rally: "Rally", streak: "Smashar i rad", best: "Rekord", good: "Snyggt!", miss: "Miss",
  replay: "Repris", skip: "Tryck på skärmen för att hoppa över", perfect: "Perfekt!", early: "Tidigt", late: "Sent",
  statsT: "Matchstatistik", sPts: "Poäng", sKill: "Vinnande smash", sBlock: "Block", sAce: "Serveess", sErr: "Misstag", sFast: "Snabbaste smash", sLong: "Längsta rally (touchar)", kmh: "km/h"
}
};
const t = (k) => S[LANG][k];
const tf = (k, n) => t(k).replace("{n}", n);
let toastT;
function toast(m) { const e = $("toast"); e.textContent = m; e.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => e.classList.remove("on"), 3200); }

/* ---------------- زمین و فیزیک ---------------- */
const CW = 4, CL = 8, NET = 2.35, BR = 0.11, GRAV = 9.8, ANT = 4.05;
const LV = {
  e: { ts: 0.72, aiSpd: 4.0, react: 0.35, err: 0.16, blk: 0.1, reach: 1.4, spk: 15, myErr: 0.6 },
  m: { ts: 0.8, aiSpd: 4.8, react: 0.25, err: 0.09, blk: 0.25, reach: 1.2, spk: 18, myErr: 0.8 },
  h: { ts: 0.9, aiSpd: 5.6, react: 0.16, err: 0.05, blk: 0.4, reach: 1.05, spk: 21, myErr: 1 },
  p: { ts: 1.0, aiSpd: 6.3, react: 0.1, err: 0.03, blk: 0.55, reach: 0.95, spk: 24, myErr: 1.1 }
};
const SIDE = [1, -1]; // تیم ۰ نزدیک دوربین (z مثبت)، تیم ۱ دور
const TEAM = (i) => (i < 2 ? 0 : 1);
const V3 = THREE.Vector3;

function launchApex(p, q, apex) {
  apex = Math.max(apex, p.y + 0.3, q.y + 0.3);
  const vy = Math.sqrt(2 * GRAV * (apex - p.y)), tu = vy / GRAV, td = Math.sqrt(2 * (apex - q.y) / GRAV), T = tu + td;
  return { v: new V3((q.x - p.x) / T, vy, (q.z - p.z) / T), T };
}
function launchTime(p, q, T) { return { v: new V3((q.x - p.x) / T, (q.y - p.y + 0.5 * GRAV * T * T) / T, (q.z - p.z) / T), T }; }
function heightAtNet(p, v) { if (Math.abs(v.z) < 1e-4 || p.z * (p.z + v.z) > 0 && Math.sign(p.z) === Math.sign(v.z)) return null; const tt = -p.z / v.z; if (tt < 0) return null; return { y: p.y + v.y * tt - 0.5 * GRAV * tt * tt, x: p.x + v.x * tt, t: tt }; }
function ballAt(p, v, tt) { return new V3(p.x + v.x * tt, p.y + v.y * tt - 0.5 * GRAV * tt * tt, p.z + v.z * tt); }
function timeToY(p, v, h) { const a = -0.5 * GRAV, b = v.y, c = p.y - h, d = b * b - 4 * a * c; if (d < 0) return null; const s = Math.sqrt(d); const t1 = (-b - s) / (2 * a); return t1 > 0 ? t1 : null; }

/* ---------------- صدا ---------------- */
let AC = null, muted = store("vb-mute") === "1", NB = null, CROWD = null, SURF = null, surfSrc = null;
function audio() { if (AC) return AC; try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { AC = null; } return AC; }
function tone(f, t0, dur, vol, type) { const a = AC, o = a.createOscillator(), g = a.createGain(); o.type = type || "sine"; o.frequency.value = f; g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur); o.connect(g).connect(a.destination); o.start(t0); o.stop(t0 + dur + 0.05); }
function sfx(k) {
  if (muted || !AC) return;
  const a = AC, t0 = a.currentTime;
  if (k === "point") { tone(660, t0, 0.25, 0.1); tone(990, t0 + 0.12, 0.3, 0.1); return; }
  if (k === "whistle") { tone(2400, t0, 0.35, 0.06, "square"); tone(2550, t0 + 0.02, 0.33, 0.04, "square"); return; }
  if (!NB) { NB = a.createBuffer(1, a.sampleRate * 0.15, a.sampleRate); const d = NB.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3); }
  const P = { bump: [500, 0.7, 1.2], set: [900, 0.45, 1.5], spike: [380, 1.6, 0.9], serve: [420, 1.1, 1], sand: [250, 0.6, 0.7], net: [300, 0.5, 2], block: [450, 1.3, 1] }[k]; if (!P) return;
  const s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
  s.buffer = NB; f.type = "bandpass"; f.frequency.value = P[0]; f.Q.value = P[2]; g.gain.value = P[1];
  s.connect(f).connect(g).connect(a.destination); s.start(t0);
  if (k === "spike" || k === "serve") tone(120, t0, 0.1, 0.25, "triangle");
}
function crowd(vol) {
  if (muted || !AC) return;
  const a = AC;
  if (!CROWD) {
    const len = a.sampleRate * 2.4; CROWD = a.createBuffer(2, len, a.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = CROWD.getChannelData(ch);
      for (let k = 0; k < 420; k++) { const st = Math.floor(Math.pow(Math.random(), 1.6) * (len - 2000)), amp = 0.25 + Math.random() * 0.6, cl = 250 + Math.random() * 500; for (let i = 0; i < cl; i++) d[st + i] += (Math.random() * 2 - 1) * amp * Math.pow(1 - i / cl, 4); }
      for (let i = 0; i < len; i++) d[i] *= Math.min(1, i / 2000) * Math.pow(1 - i / len, 1.4) * 0.5;
    }
  }
  const s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
  s.buffer = CROWD; f.type = "bandpass"; f.frequency.value = 1900; f.Q.value = 0.6; g.gain.value = 0.15 + 0.35 * vol;
  s.connect(f).connect(g).connect(a.destination); s.start(a.currentTime + 0.05);
}
/* صدای موج دریا در پس‌زمینه */
function surf(on) {
  if (!AC) return;
  if (!on || muted) { if (surfSrc) { try { surfSrc.stop(); } catch (e) {} surfSrc = null; } return; }
  if (surfSrc) return;
  const a = AC;
  if (!SURF) { const len = a.sampleRate * 6; SURF = a.createBuffer(1, len, a.sampleRate); const d = SURF.getChannelData(0); let b = 0; for (let i = 0; i < len; i++) { b = b * 0.985 + (Math.random() * 2 - 1) * 0.015; const w = 0.35 + 0.65 * Math.pow(Math.sin(Math.PI * i / len * 2), 2); d[i] = b * 6 * w; } }
  const s = a.createBufferSource(), g = a.createGain(), f = a.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 900; g.gain.value = 0.18;
  s.buffer = SURF; s.loop = true; s.connect(f).connect(g).connect(a.destination); s.start(); surfSrc = s;
}

/* ---------------- گرافیک ---------------- */
let GL = null;
const logo = new Image(); let logoOk = false;
logo.onload = () => { logoOk = true; if (GL) GL.tex.forEach(redraw); };
logo.src = "../tasvir/logo.webp";
function cTex(w, h, fn, rep, srgb) {
  const c = document.createElement("canvas"); c.width = w; c.height = h; fn(c.getContext("2d"), w, h);
  const tx = new THREE.CanvasTexture(c); if (srgb !== false) tx.encoding = THREE.sRGBEncoding; tx.anisotropy = GL ? GL.aniso : 4;
  if (rep) { tx.wrapS = tx.wrapT = THREE.RepeatWrapping; tx.repeat.set(rep[0], rep[1]); }
  tx.userData = { draw: fn, canvas: c };
  return tx;
}
function redraw(tx) { const c = tx.userData.canvas, x = c.getContext("2d"); x.clearRect(0, 0, c.width, c.height); tx.userData.draw(x, c.width, c.height); tx.needsUpdate = true; }
function std(col, o) { const m = new THREE.MeshStandardMaterial({ color: col, roughness: 0.7, metalness: 0 }); if (o) for (const k in o) { if (k === "emissive") m.emissive.setHex(o[k]); else m[k] = o[k]; } return m; }
function mesh(geo, mat, x, y, z, cast, recv) { const m = new THREE.Mesh(geo, mat); m.position.set(x || 0, y || 0, z || 0); m.castShadow = !!cast; m.receiveShadow = !!recv; return m; }

function initGL() {
  if (GL) return true;
  const canvas = document.createElement("canvas"); canvas.className = "gl";
  let r;
  try { r = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" }); } catch (e) { return false; }
  const mob = /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent);
  r.setPixelRatio(Math.min(mob ? 1.6 : 2, window.devicePixelRatio || 1));
  r.outputEncoding = THREE.sRGBEncoding; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 0.92;
  r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene(); scene.fog = new THREE.Fog(0xf3d3a6, 60, 230);
  const cam = new THREE.PerspectiveCamera(42, 1, 0.1, 500);
  GL = { r, scene, cam, canvas, mob, aniso: r.capabilities.getMaxAnisotropy(), tex: [], o: {}, W: 1, H: 1, t: 0,
    camLook: new V3(0, 1, -1.5), ray: new THREE.Raycaster(), plane: new THREE.Plane(new V3(0, 1, 0), 0), hit: new V3(), tmp: new V3(), snap: true };
  buildBeach();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => GL.tex.forEach(redraw));
  return true;
}

function noiseCanvas(c, w, h, base, amt, n) {
  c.fillStyle = base; c.fillRect(0, 0, w, h);
  for (let i = 0; i < n; i++) { const v = Math.random(); c.fillStyle = v < 0.5 ? `rgba(255,255,255,${amt * Math.random()})` : `rgba(90,60,20,${amt * Math.random()})`; c.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 2, 1 + Math.random() * 2); }
}
function boardTex(kind) {
  return cTex(1024, 256, (c, w, h) => {
    const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#0d4c7a"); g.addColorStop(1, "#082f4d"); c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.fillStyle = "#e0a63a"; c.fillRect(0, h - 22, w, 10); c.textBaseline = "middle";
    if (kind === 0) {
      if (logoOk) c.drawImage(logo, 24, 28, 176, 176);
      c.fillStyle = "#fff"; c.font = "800 78px Vazirmatn, Tahoma, sans-serif"; c.textAlign = "left"; c.direction = "ltr";
      c.fillText("ANJOMAN", 226, 92); c.fillStyle = "#ffd77a"; c.font = "700 50px Vazirmatn, Tahoma, sans-serif"; c.fillText("SUNDBYBERG", 230, 166);
    } else {
      c.fillStyle = "#fff"; c.font = "800 70px Vazirmatn, Tahoma, sans-serif"; c.textAlign = "center"; c.direction = "rtl";
      c.fillText("انجمن ایرانیان سوندبی‌بری", w / 2, h / 2 - 8);
    }
  });
}

function buildBeach() {
  const sc = GL.scene, o = GL.o;
  /* آسمان */
  const sky = new THREE.Mesh(new THREE.SphereGeometry(400, 32, 16), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: new THREE.Color(0x2f6fb8) }, mid: { value: new THREE.Color(0x8fc3e8) }, hor: { value: new THREE.Color(0xffd7a3) } },
    vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
    fragmentShader: "uniform vec3 top; uniform vec3 mid; uniform vec3 hor; varying vec3 vP; void main(){ float h = vP.y; vec3 c = h>0.12 ? mix(mid, top, smoothstep(0.12,0.6,h)) : mix(hor, mid, smoothstep(-0.02,0.12,h)); float sun = pow(max(dot(normalize(vP), normalize(vec3(-0.35,0.12,-1.0))),0.0), 300.0); c += vec3(1.0,0.85,0.6)*sun*2.0; c += vec3(1.0,0.7,0.4)*pow(max(dot(normalize(vP), normalize(vec3(-0.35,0.12,-1.0))),0.0), 8.0)*0.25; gl_FragColor = vec4(c,1.0); }"
  }));
  sc.add(sky);
  /* نور خورشید عصر */
  sc.add(new THREE.HemisphereLight(0xbfdcff, 0xd9b47a, 0.6));
  const sun = new THREE.DirectionalLight(0xffe0b5, 1.75);
  sun.position.set(-9, 16, -14); sun.castShadow = true;
  const sm = GL.mob ? 1024 : 2048; sun.shadow.mapSize.set(sm, sm);
  Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 14, bottom: -14, near: 2, far: 60 }); sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.02;
  sc.add(sun, sun.target);
  const fill = new THREE.DirectionalLight(0x9fc0ff, 0.35); fill.position.set(8, 6, 10); sc.add(fill);

  /* شن */
  const sand = cTex(512, 512, (c, w, h) => {
    noiseCanvas(c, w, h, "#e6c99a", 0.18, 26000);
    c.strokeStyle = "rgba(150,110,60,0.08)"; c.lineWidth = 2;
    for (let y = 0; y < h; y += 9) { c.beginPath(); for (let x = 0; x <= w; x += 16) c.lineTo(x, y + Math.sin(x * 0.05 + y) * 2); c.stroke(); }
  }, [40, 40]);
  const sandN = cTex(256, 256, (c, w, h) => { c.fillStyle = "rgb(128,128,255)"; c.fillRect(0, 0, w, h); for (let i = 0; i < 9000; i++) { c.fillStyle = `rgb(${110 + Math.random() * 36},${110 + Math.random() * 36},255)`; c.fillRect(Math.random() * w, Math.random() * h, 2, 2); } }, [60, 60], false);
  const ground = mesh(new THREE.PlaneGeometry(160, 120), std(0xffffff, { map: sand, normalMap: sandN, roughness: 0.95 }), 0, 0, 14, false, true);
  ground.rotation.x = -Math.PI / 2; sc.add(ground);
  /* لبهٔ خیس ساحل */
  const wet = mesh(new THREE.PlaneGeometry(400, 10), new THREE.MeshStandardMaterial({ color: 0xa88b5d, roughness: 0.35, transparent: true, opacity: 0.85 }), 0, 0.01, -43.5);
  wet.rotation.x = -Math.PI / 2; sc.add(wet);

  /* دریا */
  const sea = new THREE.Mesh(new THREE.PlaneGeometry(600, 300, 120, 60), new THREE.ShaderMaterial({
    uniforms: { time: { value: 0 }, deep: { value: new THREE.Color(0x0b4f7a) }, shallow: { value: new THREE.Color(0x2fa7b8) }, sky: { value: new THREE.Color(0xbfe0f5) } },
    vertexShader: "uniform float time; varying vec3 vW; varying float vH; void main(){ vec3 p = position; float h = sin(p.x*0.08+time*0.9)*0.25 + sin(p.y*0.13-time*1.3)*0.18 + sin((p.x+p.y)*0.21+time*1.7)*0.08; p.z += h; vH = h; vec4 w = modelMatrix*vec4(p,1.0); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }",
    fragmentShader: "uniform vec3 deep; uniform vec3 shallow; uniform vec3 sky; uniform float time; varying vec3 vW; varying float vH; void main(){ vec3 V = normalize(cameraPosition - vW); float fres = pow(1.0 - max(V.y,0.0), 3.0); float d = clamp((-vW.z-44.0)/60.0, 0.0, 1.0); vec3 c = mix(shallow, deep, d); c = mix(c, sky, fres*0.7); vec3 L = normalize(vec3(-0.35,0.12,-1.0)); vec3 R = reflect(-L, vec3(0.0,1.0,0.0)); float sp = pow(max(dot(R, V),0.0), 60.0); float sparkle = step(0.985, fract(sin(dot(floor(vW.xz*3.0), vec2(12.9898,78.233)) + time*0.5)*43758.5)); c += vec3(1.0,0.9,0.7)*(sp*1.6 + sparkle*sp*6.0); c += vH*0.12; float foam = smoothstep(0.0, 1.5, 1.6 - abs(-vW.z - 46.0)) * (0.5+0.5*sin(vW.x*0.5+time*2.0)); c = mix(c, vec3(0.95), foam*0.6); gl_FragColor = vec4(c,1.0); }"
  }));
  sea.rotation.x = -Math.PI / 2; sea.position.set(0, -0.05, -195); sc.add(sea); o.sea = sea;
  /* جزیره‌های دوردست */
  const isl = new THREE.MeshBasicMaterial({ color: 0x6f8fa8, fog: false });
  [[-140, -330, 60, 14], [-70, -340, 34, 9], [120, -320, 80, 18], [190, -310, 40, 10]].forEach((q) => { const m = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), isl); m.scale.set(q[2], q[3], q[2] * 0.4); m.position.set(q[0], -0.5, q[1]); sc.add(m); });

  /* خطوط زمین (نوار آبی) */
  const lineM = std(0x1f6fd1, { roughness: 0.5 });
  const lw = 0.06;
  [[0, CL, CW * 2 + lw, lw], [0, -CL, CW * 2 + lw, lw]].forEach((q) => sc.add(mesh(new THREE.BoxGeometry(q[2], 0.015, q[3]), lineM, q[0], 0.008, q[1], false, true)));
  [-CW, CW].forEach((x) => sc.add(mesh(new THREE.BoxGeometry(lw, 0.015, CL * 2 + lw), lineM, x, 0.008, 0, false, true)));
  /* تور */
  const netTex = cTex(512, 64, (c, w, h) => { c.clearRect(0, 0, w, h); c.strokeStyle = "rgba(15,20,30,0.95)"; c.lineWidth = 1.4; for (let x = 0; x <= w; x += 8) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); } for (let y = 0; y <= h; y += 8) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); } }, null);
  netTex.wrapS = THREE.RepeatWrapping; netTex.repeat.set(6, 1);
  sc.add(mesh(new THREE.PlaneGeometry(8.6, 1.0), new THREE.MeshStandardMaterial({ map: netTex, transparent: true, side: THREE.DoubleSide, depthWrite: false, roughness: 0.9 }), 0, NET - 0.5, 0, true, false));
  sc.add(mesh(new THREE.BoxGeometry(8.6, 0.07, 0.015), std(0x1f6fd1), 0, NET - 0.035, 0, true, false));
  sc.add(mesh(new THREE.BoxGeometry(8.6, 0.05, 0.015), std(0x1f6fd1), 0, NET - 1.0, 0, true, false));
  const antTex = cTex(16, 128, (c, w, h) => { for (let y = 0; y < h; y += 16) { c.fillStyle = (y / 16) % 2 ? "#ffffff" : "#d62828"; c.fillRect(0, y, w, 16); } });
  [-ANT, ANT].forEach((x) => sc.add(mesh(new THREE.CylinderGeometry(0.01, 0.01, 1.8, 6), std(0xffffff, { map: antTex }), x, NET - 0.1, 0, true, false)));
  [-4.6, 4.6].forEach((x) => {
    sc.add(mesh(new THREE.CylinderGeometry(0.05, 0.05, NET + 0.2, 12), std(0xdddddd, { metalness: 0.6, roughness: 0.3 }), x, (NET + 0.2) / 2, 0, true, false));
    sc.add(mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.8, 16), std(0x1f6fd1, { roughness: 0.6 }), x, 0.9, 0, true, false));
  });
  /* داور و صندلی */
  const ch = new THREE.Group(), cm = std(0xffffff, { metalness: 0.4, roughness: 0.4 });
  [[-0.25, -0.25], [0.25, -0.25], [-0.25, 0.25], [0.25, 0.25]].forEach((q) => ch.add(mesh(new THREE.BoxGeometry(0.04, 1.5, 0.04), cm, q[0], 0.75, q[1], true, false)));
  ch.add(mesh(new THREE.BoxGeometry(0.6, 0.06, 0.6), std(0x1f6fd1), 0, 1.5, 0, true, false));
  ch.position.set(-5.4, 0, 0); sc.add(ch);

  /* تابلوهای تبلیغاتی */
  const bA = boardTex(0), bB = boardTex(1); GL.tex.push(bA, bB);
  const side = std(0x082f4d);
  const panel = (x, z, ry, i) => { const face = std(0xffffff, { map: i % 2 ? bB : bA, roughness: 0.55 }); const m = mesh(new THREE.BoxGeometry(3, 0.9, 0.06), [side, side, side, side, face, side], x, 0.45, z, true, true); m.rotation.y = ry; sc.add(m); };
  for (let i = 0; i < 6; i++) { panel(-8.2, -9 + i * 3.2, Math.PI / 2, i); panel(8.2, -9 + i * 3.2, -Math.PI / 2, i + 1); }
  for (let i = 0; i < 4; i++) panel(-4.8 + i * 3.2, -12.5, 0, i);

  /* سکوها و تماشاگران */
  const tierM = std(0xc9d3dc, { roughness: 0.6, metalness: 0.2 }), seats = [];
  for (let i = 0; i < 4; i++) {
    const hh = 0.45 * (i + 1), d = 0.9;
    for (const s of [-1, 1]) {
      sc.add(mesh(new THREE.BoxGeometry(d, 0.12, 20), tierM, s * (9.6 + i * d), hh, -0.5, true, true));
      sc.add(mesh(new THREE.BoxGeometry(d, hh, 20), std(0x56606b), s * (9.6 + i * d), hh / 2 - 0.06, -0.5, false, false));
      for (let k = 0; k < 32; k++) if (Math.random() < 0.72) seats.push([s * (9.6 + i * d), hh + 0.06, -10 + k * 0.6 + rnd(-0.05, 0.05)]);
    }
  }
  const pal = [0xc62828, 0x1e88e5, 0xfdd835, 0x43a047, 0xffffff, 0x8e24aa, 0xff7043, 0x26a69a, 0xf48fb1, 0x5d4037];
  const bodies = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.17, 0.21, 0.55, 8), std(0xffffff), seats.length);
  const heads = new THREE.InstancedMesh(new THREE.SphereGeometry(0.115, 10, 8), std(0xffffff), seats.length);
  const skin = [0xe0b48a, 0xc68a5e, 0x8d5a3b, 0xf1c9a5, 0xa86f48], mtx = new THREE.Matrix4(), col = new THREE.Color();
  bodies.castShadow = heads.castShadow = true;
  seats.forEach((p, j) => {
    mtx.makeTranslation(p[0], p[1] + 0.28, p[2]); bodies.setMatrixAt(j, mtx); col.setHex(pal[j % pal.length]).multiplyScalar(0.85); bodies.setColorAt(j, col);
    mtx.makeTranslation(p[0], p[1] + 0.68, p[2]); heads.setMatrixAt(j, mtx); col.setHex(skin[j % skin.length]); heads.setColorAt(j, col);
  });
  sc.add(bodies, heads);
  o.crowd = { bodies, heads, seats, ph: seats.map(() => Math.random() * 6.28), on: false };

  /* درخت نخل و چتر */
  const leaf = cTex(256, 64, (c, w, h) => {
    c.clearRect(0, 0, w, h); c.strokeStyle = "#3d6b2a"; c.lineWidth = 3; c.beginPath(); c.moveTo(0, h / 2); c.lineTo(w, h / 2); c.stroke();
    for (let x = 6; x < w - 6; x += 5) { const L = (1 - x / w) * 26 + 6; c.strokeStyle = x % 10 ? "#4f8a32" : "#3f7a2a"; c.lineWidth = 3; c.beginPath(); c.moveTo(x, h / 2); c.lineTo(x + 10, h / 2 - L); c.moveTo(x, h / 2); c.lineTo(x + 10, h / 2 + L); c.stroke(); }
  });
  const trunkM = std(0x8a6a45, { roughness: 0.9 }), leafM = new THREE.MeshStandardMaterial({ map: leaf, alphaTest: 0.4, side: THREE.DoubleSide, roughness: 0.8 });
  const palm = (x, z, h, lean) => {
    const g = new THREE.Group(); let px = 0, py = 0;
    for (let i = 0; i < 8; i++) { const seg = mesh(new THREE.CylinderGeometry(0.16 - i * 0.008, 0.2 - i * 0.008, h / 8 + 0.05, 8), trunkM, px, py + h / 16, 0, true, false); seg.rotation.z = -lean * (i / 8); g.add(seg); px += Math.sin(lean * i / 8) * h / 8; py += Math.cos(lean * i / 8) * h / 8; }
    for (let k = 0; k < 9; k++) { const f = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 0.8, 6, 1), leafM); const pos = f.geometry.attributes.position; for (let i = 0; i < pos.count; i++) { const xx = pos.getX(i); pos.setZ(i, -Math.pow((xx + 1.6) / 3.2, 2) * 1.1); } f.geometry.translate(1.6, 0, 0); f.geometry.computeVertexNormals(); f.position.set(px, py, 0); f.rotation.set(Math.PI / 2 - 0.3, 0, k / 9 * Math.PI * 2); f.rotation.order = "ZXY"; f.castShadow = true; g.add(f); }
    g.position.set(x, 0, z); g.rotation.y = rnd(0, 6); sc.add(g);
  };
  [[-13, -16, 8, 0.3], [-17, -8, 9.5, 0.25], [14, -18, 9, 0.35], [18, -6, 8, 0.2], [-16, 6, 7.5, 0.3], [17, 8, 8.5, 0.25], [-25, -20, 10, 0.2], [26, -22, 9, 0.3]].forEach((q) => palm(...q));
  const umbTex = cTex(256, 32, (c, w, h) => { for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? "#ffffff" : ["#e53935", "#1e88e5", "#fdd835"][Math.floor(i / 2) % 3]; c.fillRect(i * w / 8, 0, w / 8, h); } });
  const umb = (x, z) => { const g = new THREE.Group(); g.add(mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.3, 6), std(0xeeeeee), 0, 1.15, 0, true, false)); g.add(mesh(new THREE.ConeGeometry(1.4, 0.5, 16, 1, true), std(0xffffff, { map: umbTex, side: THREE.DoubleSide }), 0, 2.3, 0, true, false)); g.position.set(x, 0, z); sc.add(g); };
  [[-12.5, -12], [-14.5, 1], [13, -12], [15, 2], [-20, -14], [21, -13]].forEach((q) => umb(...q));

  /* توپ والیبال */
  const ballTex = cTex(512, 256, (c, w, h) => {
    const cols = ["#ffd23f", "#1e63c8", "#ffffff"];
    for (let i = 0; i < 6; i++) { c.fillStyle = cols[i % 3]; c.beginPath(); c.moveTo(i * w / 6, 0); c.bezierCurveTo(i * w / 6 + 40, h / 2, i * w / 6 - 40, h / 2, i * w / 6, h); c.lineTo((i + 1) * w / 6, h); c.bezierCurveTo((i + 1) * w / 6 - 40, h / 2, (i + 1) * w / 6 + 40, h / 2, (i + 1) * w / 6, 0); c.closePath(); c.fill(); }
    c.strokeStyle = "rgba(0,0,0,0.25)"; c.lineWidth = 2; for (let i = 0; i <= 6; i++) { c.beginPath(); c.moveTo(i * w / 6, 0); c.bezierCurveTo(i * w / 6 + 40, h / 2, i * w / 6 - 40, h / 2, i * w / 6, h); c.stroke(); }
  });
  o.ball = mesh(new THREE.SphereGeometry(BR, 32, 20), std(0xffffff, { map: ballTex, roughness: 0.5 }), 0, 1, 0, true, false); sc.add(o.ball);
  o.blob = mesh(new THREE.CircleGeometry(BR * 1.4, 20), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35, depthWrite: false })); o.blob.rotation.x = -Math.PI / 2; sc.add(o.blob);
  o.mark = mesh(new THREE.RingGeometry(0.42, 0.55, 40), new THREE.MeshBasicMaterial({ color: 0xffd23f, transparent: true, opacity: 0.8, depthWrite: false })); o.mark.rotation.x = -Math.PI / 2; o.mark.visible = false; sc.add(o.mark);
  o.aim = mesh(new THREE.RingGeometry(0.3, 0.42, 40), new THREE.MeshBasicMaterial({ color: 0xff4d4d, transparent: true, opacity: 0.85, depthWrite: false })); o.aim.rotation.x = -Math.PI / 2; o.aim.visible = false; sc.add(o.aim);
  o.trail = [];
  for (let i = 0; i < 8; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(BR * (0.9 - i * 0.08), 10, 8), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false })); m.visible = false; sc.add(m); o.trail.push(m); }
  o.puffs = [];
  const pg = new THREE.SphereGeometry(0.06, 6, 4);
  for (let i = 0; i < 40; i++) { const m = new THREE.Mesh(pg, new THREE.MeshBasicMaterial({ color: 0xe8d1a8, transparent: true, opacity: 0, depthWrite: false })); m.visible = false; sc.add(m); o.puffs.push({ m, v: new V3(), life: 0 }); }
  /* نشانگر تیم زیر پای بازیکنان */
  o.rings = [0xff4d4d, 0xff4d4d, 0xffffff, 0xffffff].map((c, i) => { const m = mesh(new THREE.RingGeometry(0.34, i === 0 ? 0.44 : 0.4, 32), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: i === 0 ? 0.75 : 0.35, depthWrite: false })); m.rotation.x = -Math.PI / 2; sc.add(m); return m; });
}

/* ---------------- بارگذاری بازیکنان و حرکت‌ها ---------------- */
const CHARS = ["Ch42", "Ch47", "Ch38", "Ch02"];
const ASSETS = { chars: [], clips: {}, ready: false, failed: false, prog: 0 };
const norm = (n) => n.replace(/^mixamorig\d*/, "");
function prepClip(clip, srcRestY, name) {
  const c = clip.clone(); c.name = name;
  c.tracks = c.tracks.filter((tr) => tr.name.endsWith(".quaternion") || /Hips\.position$/.test(tr.name)).map((tr) => { const i = tr.name.lastIndexOf("."); tr.name = norm(tr.name.slice(0, i)) + tr.name.slice(i); return tr; });
  c.userData = { srcRestY };
  return c;
}
function loadAssets(onProg) {
  if (ASSETS.ready || ASSETS.loading) return ASSETS.loading;
  const L = new GLTFLoader(), sizes = { char: 2.7e6, clip: 9e4 }, got = {};
  const CL2 = ["goalkeeper_catch", "kettlebell_swing", "snatch", "idle", "running", "jog_strafe_left", "jog_strafe_right", "victory", "defeated"];
  const NAMES = ["jump", "swing", "squat", "idle", "run", "sl", "sr", "win", "lose"];
  const total = sizes.char * 4 + sizes.clip * CL2.length;
  const prog = (k) => (e) => { got[k] = e.loaded || 0; ASSETS.prog = Math.min(0.99, Object.values(got).reduce((a, b) => a + b, 0) / total); onProg && onProg(ASSETS.prog); };
  const restOf = (g) => { let y = null; g.scene.traverse((o) => { if (y === null && norm(o.name) === "Hips") y = o.position.y; }); return y || 1; };
  ASSETS.loading = Promise.all([
    ...CHARS.map((c) => L.loadAsync("assets/" + c + ".glb", prog(c))),
    ...CL2.map((c) => L.loadAsync("assets/" + c + ".glb", prog(c)))
  ]).then((res) => {
    ASSETS.chars = res.slice(0, 4);
    CL2.forEach((c, i) => { const g = res[4 + i]; ASSETS.clips[NAMES[i]] = prepClip(g.animations[0], restOf(g), NAMES[i]); });
    ASSETS.ready = true; ASSETS.prog = 1; onProg && onProg(1);
  }).catch((e) => { console.error(e); ASSETS.failed = true; onProg && onProg(-1); });
  return ASSETS.loading;
}

/* تکه‌های حرکت: [کلیپ، شروع، پایان، لحظهٔ تماس از شروع] */
const SEG = {
  bump: ["swing", 0.0, 0.75, 0.3],
  set: ["swing", 0.5, 1.35, 0.42],
  jump: ["jump", 0.95, 2.2, 0.6],
  dig: ["squat", 0.1, 0.75, 0.2],
  cheer: ["jump", 1.0, 2.3, 0.55],
  win: ["win", 0.0, 2.6, 0],
  lose: ["lose", 0.3, 3.0, 0],
  ready: ["jump", 0.0, 0.0, 0]
};

class Player {
  constructor(i, gltf) {
    this.i = i; this.team = TEAM(i);
    const root = gltf.scene; this.root = root;
    root.traverse((o) => { if (o.isBone || o.type === "Object3D" || o.type === "Bone") o.name = norm(o.name); if (o.isMesh) { o.castShadow = true; o.receiveShadow = false; o.frustumCulled = false; if (o.material) { o.material.roughness = Math.max(0.55, o.material.roughness || 0.6); o.material.metalness = 0; } } });
    this.b = {}; root.traverse((o) => { if (["Hips", "Spine1", "Spine2", "Head", "RightArm", "RightForeArm", "RightHand", "LeftArm", "LeftForeArm", "LeftHand"].includes(o.name) && !this.b[o.name]) this.b[o.name] = o; });
    this.hipsY = this.b.Hips.position.y;
    this.mixer = new THREE.AnimationMixer(root);
    this.act = {};
    for (const k in ASSETS.clips) {
      const src = ASSETS.clips[k], c = src.clone(), k2 = this.hipsY / src.userData.srcRestY, hx = this.b.Hips.position.x, hz = this.b.Hips.position.z;
      c.tracks.forEach((tr) => { if (tr.name === "Hips.position") { const v = tr.values; for (let j = 0; j < v.length; j += 3) { v[j] = hx; v[j + 1] *= k2; v[j + 2] = hz; } } });
      const a = this.mixer.clipAction(c); a.enabled = true; a.setEffectiveWeight(0); a.play(); this.act[k] = a;
    }
    ["jump", "swing", "squat", "win", "lose"].forEach((k) => { this.act[k].paused = true; });
    this.x = 0; this.z = SIDE[this.team] * 5; this.tx = this.x; this.tz = this.z; this.vx = 0; this.vz = 0; this.ry = this.team === 0 ? Math.PI : 0;
    this.os = null; this.arm = null; this.w = { run: 0, sl: 0, sr: 0 };
    root.position.set(this.x, 0, this.z);
  }
  face() { return this.team === 0 ? -1 : 1; }
  play(kind, speedMul) {
    const s = SEG[kind]; this.os = { kind, clip: s[0], a: s[1], b: s[2], c: s[3], t: 0, sp: speedMul || 1 };
  }
  contactIn() { return this.os ? (this.os.c - this.os.t) : null; }
  update(dt) {
    /* حرکت به سوی هدف */
    const sp = Math.hypot(this.vx, this.vz);
    let osw = 0;
    if (this.os) {
      const o = this.os; o.t += dt * o.sp; const dur = o.b - o.a;
      osw = o.t < 0.12 ? o.t / 0.12 : o.t > dur - 0.18 ? Math.max(0, (dur - o.t) / 0.18) : 1;
      const a = this.act[o.clip]; a.time = clamp(o.a + o.t, 0, a.getClip().duration);
      if (o.t >= dur) { this.os = null; osw = 0; }
    }
    const base = 1 - osw;
    for (const k of ["jump", "swing", "squat", "win", "lose"]) this.act[k].setEffectiveWeight(this.os && this.os.clip === k ? osw : 0);
    /* جهت بدن: حرکت جانبی رو به تور (استریف)، دویدن بلند رو به مسیر */
    const netYaw = this.team === 0 ? Math.PI : 0;
    let ty = netYaw;
    if (sp > 0.3) {
      const fN = this.vx * Math.sin(netYaw) + this.vz * Math.cos(netYaw), lN = Math.abs(this.vx * Math.cos(netYaw) - this.vz * Math.sin(netYaw));
      if (sp > 2.2 && Math.abs(fN) > lN * 0.8 && !this.os) ty = Math.atan2(this.vx, this.vz);
    }
    const dy = ((ty - this.ry + Math.PI * 3) % (Math.PI * 2)) - Math.PI; this.ry += dy * Math.min(1, dt * 9);
    const fw = this.vx * Math.sin(this.ry) + this.vz * Math.cos(this.ry), lat = -this.vx * Math.cos(this.ry) + this.vz * Math.sin(this.ry);
    const k = Math.min(1, dt * 9);
    this.w.run = lerp(this.w.run, clamp(Math.abs(fw) / 2.6, 0, 1), k);
    this.w.sr = lerp(this.w.sr, clamp(lat / 2.2, 0, 1), k); this.w.sl = lerp(this.w.sl, clamp(-lat / 2.2, 0, 1), k);
    let sum = this.w.run + this.w.sr + this.w.sl; const nrm = sum > 1 ? 1 / sum : 1;
    this.act.run.setEffectiveWeight(this.w.run * nrm * base); this.act.sr.setEffectiveWeight(this.w.sr * nrm * base); this.act.sl.setEffectiveWeight(this.w.sl * nrm * base);
    this.act.idle.setEffectiveWeight(Math.max(0, 1 - sum * nrm) * base);
    this.act.run.timeScale = (fw < -0.2 ? -1 : 1) * clamp(Math.abs(fw) / 4.5, 0.6, 1.4);
    this.act.sr.timeScale = this.act.sl.timeScale = clamp(Math.abs(lat) / 3, 0.6, 1.4);
    this.mixer.update(dt);
    this.root.position.set(this.x, 0, this.z); this.root.rotation.y = this.ry;
    this.root.updateMatrixWorld(true);
    if (this.arm) this.armPose(dt);
  }
  /* تنظیم دست‌ها روی اسکلت با هدف جهانی */
  aim(bn, cn, dir, w) {
    const b = this.b[bn], c = this.b[cn]; if (!b || !c || w <= 0) return;
    const bp = b.getWorldPosition(_v1), cp = c.getWorldPosition(_v2), cur = _v3.copy(cp).sub(bp).normalize();
    _q1.setFromUnitVectors(cur, _v4.copy(dir).normalize());
    b.getWorldQuaternion(_q2); _q3.copy(_q1).multiply(_q2);
    b.parent.getWorldQuaternion(_q4); _q4.invert().multiply(_q3);
    b.quaternion.slerp(_q4, w); b.updateMatrixWorld(true);
  }
  armPose(dt) {
    const A = this.arm; A.t += dt;
    const f = this.face(), right = -f, w = A.t < 0.1 ? A.t / 0.1 : A.t > A.dur - 0.15 ? Math.max(0, (A.dur - A.t) / 0.15) : 1;
    if (A.t >= A.dur) { this.arm = null; return; }
    const fw = _v5.set(0, 0, f), up = _v6.set(0, 1, 0), rt = _v7.set(right, 0, 0);
    if (A.tgt && (A.mode === "bump" || A.mode === "set" || A.mode === "spike" || A.mode === "serve")) { this.armTo(A, w, fw, up, rt); return; }
    if (A.mode === "bump") {
      const d = _v8.copy(fw).multiplyScalar(0.85).addScaledVector(up, -0.55);
      this.aim("RightArm", "RightForeArm", _v9.copy(d).addScaledVector(rt, -0.2), w); this.aim("RightForeArm", "RightHand", _v9.copy(d).addScaledVector(rt, -0.12), w);
      this.aim("LeftArm", "LeftForeArm", _v9.copy(d).addScaledVector(rt, 0.2), w); this.aim("LeftForeArm", "LeftHand", _v9.copy(d).addScaledVector(rt, 0.12), w);
    } else if (A.mode === "set") {
      this.aim("RightArm", "RightForeArm", _v9.copy(up).addScaledVector(fw, 0.35).addScaledVector(rt, 0.55), w); this.aim("RightForeArm", "RightHand", _v9.copy(up).addScaledVector(fw, 0.25).addScaledVector(rt, -0.35), w);
      this.aim("LeftArm", "LeftForeArm", _v9.copy(up).addScaledVector(fw, 0.35).addScaledVector(rt, -0.55), w); this.aim("LeftForeArm", "LeftHand", _v9.copy(up).addScaledVector(fw, 0.25).addScaledVector(rt, 0.35), w);
    } else if (A.mode === "spike" || A.mode === "serve") {
      /* دست چپ رو به توپ، دست راست عقب و بالا، سپس ضربهٔ سریع رو به جلو و پایین */
      const k = A.t - A.hit; // منفی پیش از ضربه
      const back = clamp(1 + k / 0.35, 0, 1), swing = clamp(k / 0.15, 0, 1);
      const rd = _v8.copy(up).addScaledVector(fw, -0.9 * back * (1 - swing) + 1.2 * swing).addScaledVector(rt, 0.25);
      if (swing > 0) rd.addScaledVector(up, -1.3 * swing);
      this.aim("RightArm", "RightForeArm", rd, w); this.aim("RightForeArm", "RightHand", _v9.copy(rd).addScaledVector(up, 0.6 * (1 - swing)).addScaledVector(fw, 0.2), w);
      this.aim("LeftArm", "LeftForeArm", _v9.copy(up).addScaledVector(fw, 0.6 - swing).addScaledVector(rt, -0.3), w * (1 - swing * 0.7));
    } else if (A.mode === "block") {
      this.aim("RightArm", "RightForeArm", _v9.copy(up).addScaledVector(fw, 0.25).addScaledVector(rt, 0.15), w); this.aim("RightForeArm", "RightHand", _v9.copy(up).addScaledVector(fw, 0.3), w);
      this.aim("LeftArm", "LeftForeArm", _v9.copy(up).addScaledVector(fw, 0.25).addScaledVector(rt, -0.15), w); this.aim("LeftForeArm", "LeftHand", _v9.copy(up).addScaledVector(fw, 0.3), w);
    }
  }
  /* دست‌ها مستقیم به سوی نقطهٔ واقعی توپ */
  armTo(A, w, fw, up, rt) {
    const T = A.tgt, sh = new V3(), d = new V3(), e = new V3();
    if (A.mode === "bump") {
      for (const sd of [1, -1]) {
        const arm = sd > 0 ? "RightArm" : "LeftArm", fa = sd > 0 ? "RightForeArm" : "LeftForeArm", hd = sd > 0 ? "RightHand" : "LeftHand";
        this.b[arm].getWorldPosition(sh);
        d.copy(T).addScaledVector(rt, sd * 0.05).sub(sh);
        this.aim(arm, fa, d, w); this.aim(fa, hd, d, w);
      }
    } else if (A.mode === "set") {
      for (const sd of [1, -1]) {
        const arm = sd > 0 ? "RightArm" : "LeftArm", fa = sd > 0 ? "RightForeArm" : "LeftForeArm", hd = sd > 0 ? "RightHand" : "LeftHand";
        this.b[arm].getWorldPosition(sh);
        const h = e.copy(T).addScaledVector(rt, sd * 0.1).addScaledVector(up, -0.13).addScaledVector(fw, -0.06);
        const elbow = d.copy(sh).lerp(h, 0.5).addScaledVector(rt, sd * 0.2).addScaledVector(up, -0.05);
        this.aim(arm, fa, d.copy(elbow).sub(sh), w);
        this.b[fa].getWorldPosition(sh); this.aim(fa, hd, e.copy(h).sub(sh), w);
      }
    } else {
      /* اسپک و سرویس: دست راست عقب و بالا، در لحظهٔ ضربه دقیقاً روی توپ، سپس دنبالهٔ حرکت رو به جلو و پایین */
      const k = A.t - A.hit;
      this.b.RightArm.getWorldPosition(sh);
      const toBall = d.copy(T).sub(sh).normalize().clone();
      const cock = new V3().copy(up).multiplyScalar(0.6).addScaledVector(fw, -0.55).addScaledVector(rt, 0.35).normalize();
      let dir, fdir;
      if (k < -0.32) { dir = cock; fdir = new V3().copy(up).addScaledVector(fw, -0.6).normalize(); }
      else if (k < 0) { const u = (k + 0.32) / 0.32; dir = cock.clone().lerp(toBall, u * u).normalize(); fdir = new V3().copy(up).addScaledVector(fw, -0.6).normalize().lerp(toBall, u).normalize(); }
      else { const u = clamp(k / 0.18, 0, 1), fol = new V3().copy(fw).addScaledVector(up, -0.7).addScaledVector(rt, -0.2).normalize(); dir = toBall.clone().lerp(fol, u).normalize(); fdir = dir; }
      this.aim("RightArm", "RightForeArm", dir, w);
      this.aim("RightForeArm", "RightHand", fdir, w);
      this.b.LeftArm.getWorldPosition(sh);
      const ld = e.copy(T).sub(sh).normalize().addScaledVector(up, 0.3);
      this.aim("LeftArm", "LeftForeArm", k < 0 ? ld : ld.lerp(new V3().copy(fw).addScaledVector(up, -0.9), clamp(k / 0.2, 0, 1)), w * 0.9);
    }
  }
  handPoint(kind, out) {
    const L = this.b.LeftHand, R = this.b.RightHand;
    if (kind === "spike" || kind === "serve") return R.getWorldPosition(out).add(_v6.set(0, 0.06, 0));
    L.getWorldPosition(_v1); R.getWorldPosition(_v2); out.copy(_v1).add(_v2).multiplyScalar(0.5);
    if (kind === "bump" || kind === "dig") { this.b.LeftForeArm.getWorldPosition(_v3); this.b.RightForeArm.getWorldPosition(_v4); _v3.add(_v4).multiplyScalar(0.5); out.multiplyScalar(0.72).addScaledVector(_v3, 0.28); out.y -= 0.05; }
    else out.y += 0.12;
    return out;
  }

}
const _v1 = new V3(), _v2 = new V3(), _v3 = new V3(), _v4 = new V3(), _v5 = new V3(), _v6 = new V3(), _v7 = new V3(), _v8 = new V3(), _v9 = new V3();
const _q1 = new THREE.Quaternion(), _q2 = new THREE.Quaternion(), _q3 = new THREE.Quaternion(), _q4 = new THREE.Quaternion();

let PLAYERS = null;
function makePlayers() {
  if (PLAYERS) return PLAYERS;
  PLAYERS = ASSETS.chars.map((g, i) => { const p = new Player(i, g); GL.scene.add(p.root); return p; });
  return PLAYERS;
}

/* ---------------- منطق بازی ---------------- */
let G = null, MODE = null;
const ball = { p: new V3(0, 1.2, 5), v: new V3(), live: false, spin: new V3(), hist: [] };

function newGame(o) {
  G = {
    lvl: o.lvl, L: LV[o.lvl] || LV.m, best: o.best, names: o.names, practice: !!o.practice,
    sets: [0, 0], pts: [0, 0], setNo: 1, srvTeam: Math.random() < 0.5 ? 0 : 1, srvIdx: [0, 0],
    st: "serve", tm: 0, msg: null, paused: false, over: false, winner: -1, clock: 0,
    touches: 0, side: 0, last: -1, plan: null, attack: null, block: null, rally: 0, lastSpike: false, lastSpd: 0,
    stats: { pts: [0, 0], kill: [0, 0], block: [0, 0], ace: [0, 0], err: [0, 0], fast: [0, 0], long: 0 },
    rec: [], recT: 0, recMore: 0, rp0: false, rp: null, cheer: 0, shake: 0, aimP: null, act: null, tapT: null,
    streak: 0, bestStreak: +(store("vb-streak") || 0), ai: {}
  };
  if (G.practice) { G.srvTeam = 0; G.st = "point"; G.tm = 0.8; G.after = "feed"; }
  else setupServe();
}
function say(m) { G.msg = m; G.msgT = Date.now(); }
function server() { return G.srvTeam * 2 + G.srvIdx[G.srvTeam]; }
function specialPoint() {
  const tgt = G.setNo === 3 ? 15 : 21;
  for (let p = 0; p < 2; p++) { const a = G.pts[p], o = G.pts[1 - p]; if (a >= tgt - 1 && a > o) return G.sets[p] + 1 > G.best / 2 ? "matchPt" : "setPt"; }
  return "";
}
function basePos(i, mode) {
  const tm = TEAM(i), s = SIDE[tm], left = i % 2 === 0 ? 1 : -1;
  if (mode === "recv") return [left * 1.9 * (tm === 0 ? 1 : -1), s * 5.4];
  return [left * 1.6 * (tm === 0 ? 1 : -1), s * 4.6];
}
function setupServe() {
  G.st = "serve"; G.plan = null; G.attack = null; G.block = null; G.touches = 0; G.last = -1; G.rally = 0; G.rec = []; G.recT = 0; G.lastSpike = false; G.tapT = null;
  const sv = server(), st = G.srvTeam, s = SIDE[st];
  PLAYERS.forEach((p, i) => {
    let pos;
    if (i === sv) pos = [rnd(-1.5, 1.5), s * (CL + 0.9)];
    else if (TEAM(i) === st) pos = [-(PLAYERS[sv].x || 1) > 0 ? 1.6 : -1.6, s * 3.2];
    else pos = basePos(i, "recv");
    p.x = p.tx = pos[0]; p.z = p.tz = pos[1]; p.vx = p.vz = 0; p.os = null; p.arm = null;
  });
  const p = PLAYERS[sv]; p.x = p.tx = rnd(-1.5, 1.5);
  holdBall();
  G.ai.srvT = 0;
  say({ k: "serve", who: sv, sp: specialPoint() });
}
function holdBall() { const p = PLAYERS[server()]; ball.p.set(p.x + 0.25 * -p.face(), 1.15, p.z + p.face() * 0.35); ball.v.set(0, 0, 0); ball.live = false; }

/* زدن سرویس: پرتاب، پرش و ضربه */
function startServe(aim) {
  if (G.st !== "serve") return;
  const sv = server(), p = PLAYERS[sv], tm = TEAM(sv), s = SIDE[tm];
  G.st = "toss"; G.msg = null;
  G.toss = { t: 0, hit: 0.6, aim: aim || aiAim(tm, true), who: sv };
  ball.p.set(p.x + 0.25 * -p.face(), 1.5, p.z + p.face() * 0.45); ball.v.set(0, 5.6, p.face() * 0.9); ball.live = true; G.tossing = true;
  p.play("jump", 1); p.arm = { mode: "serve", t: 0, dur: 1.1, hit: 0.6, tgt: ballAt(ball.p, ball.v, 0.6) };
}
function doServeHit() {
  const T = G.toss, p = PLAYERS[T.who], tm = TEAM(T.who), L = G.L;
  G.tossing = false;
  const human = T.who === 0;
  let aim = T.aim.clone();
  const errK = human ? 0.6 * L.myErr : 0.5 + L.err * 4;
  aim.x += rnd(-1, 1) * errK; aim.z += rnd(-1, 1) * errK;
  const from = p.handPoint("serve", new V3());
  if (from.distanceTo(ball.p) > 1.2) from.copy(ball.p);
  ball.p.copy(from);
  const spd = human ? 15 : 12 + L.spk * 0.25;
  let tt = from.distanceTo(aim) / spd, sol;
  for (let i = 0; i < 12; i++) { sol = launchTime(from, new V3(aim.x, BR, aim.z), tt); const hn = heightAtNet(from, sol.v); if (!hn || hn.y > NET + 0.35) break; tt *= 1.08; }
  if (!human && Math.random() < L.err * 0.6) { sol = launchTime(from, new V3(aim.x, BR, SIDE[tm] * 0.4), tt * 0.8); }
  ball.v.copy(sol.v); ball.live = true;
  G.st = "rally"; G.last = T.who; G.side = tm; G.touches = 0; G.lastSpd = sol.v.length() * 3.6;
  sfx("serve"); puff(ball.p, 0);
  planReceive(tm);
}

/* برنامه‌ریزی دریافت برای تیم مقابل */
function planReceive(fromTeam) {
  const R = 1 - fromTeam, s = SIDE[R];
  const fast = ball.v.length() > 14;
  const h = fast ? 0.75 : 0.85;
  if (G.practice) { G.plan = null; return; }
  const tt = timeToY(ball.p, ball.v, h); G.plan = null;
  if (tt === null) return;
  const cp = ballAt(ball.p, ball.v, tt);
  const land = ballAt(ball.p, ball.v, timeToY(ball.p, ball.v, BR) || tt);
  if (cp.z * s <= 0.2) return; /* روی زمین خودی یا تور */
  const inC = Math.abs(land.x) <= CW + 0.05 && Math.abs(land.z) <= CL + 0.05;
  const cand = [R * 2, R * 2 + 1];
  let who = cand[0], d0 = Math.hypot(PLAYERS[cand[0]].x - cp.x, PLAYERS[cand[0]].z - cp.z), d1 = Math.hypot(PLAYERS[cand[1]].x - cp.x, PLAYERS[cand[1]].z - cp.z);
  if (d1 < d0) who = cand[1];
  /* رایانه گاهی توپ بیرون را رها می‌کند */
  const leave = !inC && R === 1 && Math.random() < 0.5 + (1 - G.L.err * 5) * 0.4;
  G.plan = { who, kind: fast ? "dig" : "bump", h, cp, tEnd: G.clock + tt, inC, leave };
  if (R === 1 || who === 1) aiMoveTo(who, cp, tt, true);
}
function aiAim(tm, serve) {
  const o = 1 - tm, s = SIDE[o], ops = [o * 2, o * 2 + 1].map((i) => PLAYERS[i]);
  let best = null, bd = -1;
  for (let k = 0; k < 8; k++) {
    const x = rnd(-CW + 0.7, CW - 0.7), z = s * (serve ? rnd(3.5, CL - 0.8) : rnd(1.5, CL - 0.8));
    const d = Math.min(...ops.map((p) => Math.hypot(p.x - x, p.z - z)));
    if (d > bd) { bd = d; best = new V3(x, BR, z); }
  }
  return best;
}
function aiMoveTo(i, cp, tt, recv) {
  const p = PLAYERS[i], f = p.face();
  const off = recv ? 0.55 : 0.22;
  p.react = G.clock + (i === 1 ? 0.08 : G.L.react);
  p.goal = { x: cp.x + rnd(-1, 1) * G.L.err * 1.5, z: cp.z - f * off };
}

/* اجرای ضربه‌ها */
function touch(i, kind, quality, anim) {  
  const p = PLAYERS[i], tm = p.team, s = SIDE[tm], L = G.L, human = i === 0;
  if (G.last >= 0 && TEAM(G.last) === tm) G.touches++; else G.touches = 1;
  G.last = i; G.side = tm; G.rally++; G.plan = null;
  const partner = tm * 2 + (i % 2 === 0 ? 1 : 0);
  const err = (human ? (1 - quality) * 1.2 * L.myErr : (Math.random() < L.err ? 1 : 0) * rnd(0.8, 2.2));
  if (kind === "bump" || kind === "dig") {
    if (!anim) { p.play(kind === "dig" ? "dig" : "bump", 1.2); p.arm = { mode: "bump", t: 0.3, dur: 0.6 }; }
    sfx("bump"); puff(ball.p, 0.3);
    if (G.touches >= 3) return sendOver(i, false);
    const P2 = PLAYERS[partner];
    const sx = clamp(P2.x * 0.4 + rnd(-0.4, 0.4), -2.4, 2.4), sz = s * 1.6;
    const q = new V3(sx + rnd(-1, 1) * err * 0.8, 2.15, sz + rnd(-1, 1) * err * 0.8 * s);
    const sol = launchApex(ball.p, q, 4.3 + rnd(-0.4, 0.4));
    ball.v.copy(sol.v);
    G.plan = { who: partner, kind: "set", cp: q, tEnd: G.clock + sol.T, h: 2.15 };
    if (partner !== 0) aiMoveTo(partner, q, sol.T, false);
    planAttackerApproach(i, sol.T);
  } else if (kind === "set") {
    if (!anim) { p.play("set", 1.1); p.arm = { mode: "set", t: 0.4, dur: 0.75 }; }
    sfx("set");
    if (G.touches >= 3) return sendOver(i, false);
    const A = PLAYERS[partner];
    const ax = clamp(A.x * 0.8 + rnd(-0.3, 0.3), -3, 3), az = s * 0.9;
    const q = new V3(ax + rnd(-1, 1) * err * 0.6, 2.6, az + rnd(-0.3, 0.3) * err * s);
    const sol = launchApex(ball.p, q, 4.6 + rnd(-0.3, 0.3));
    ball.v.copy(sol.v);
    G.attack = { who: partner, cp: q, tHit: G.clock + sol.T, jumped: false, team: tm };
    G.plan = { who: partner, kind: "attack", cp: q, tEnd: G.clock + sol.T, h: 2.6 };
    const ap = PLAYERS[partner]; ap.goal = { x: q.x - 0.25 * -ap.face(), z: q.z - ap.face() * 1.6 }; ap.react = G.clock;
    planBlock(1 - tm, q);
  }
}
function planAttackerApproach(i, T) {
  const p = PLAYERS[i]; p.goal = { x: clamp(p.x, -2.8, 2.8), z: SIDE[p.team] * 3.2 }; p.react = G.clock + 0.15;
}
function planBlock(tm, q) {
  /* بازیکن نزدیک‌تر به تور در تیم مدافع آماده بلاک می‌شود */
  const c = [tm * 2, tm * 2 + 1].map((i) => PLAYERS[i]);
  const bl = Math.abs(c[0].z) < Math.abs(c[1].z) ? c[0] : c[1];
  const df = bl === c[0] ? c[1] : c[0];
  G.block = { who: bl.i, x: q.x, jumpAt: null, tm };
  if (bl.i !== 0) { bl.goal = { x: q.x, z: SIDE[tm] * 0.75 }; bl.react = G.clock + G.L.react; bl.willBlock = Math.random() < G.L.blk; }
  if (df.i !== 0) { df.goal = { x: -q.x * 0.5, z: SIDE[tm] * 5.2 }; df.react = G.clock + G.L.react; }
}
/* حملهٔ نهایی: اسپک یا ضربهٔ آرام */
function doAttack(i, aim, quality, spike) {  
  const p = PLAYERS[i], tm = p.team, L = G.L, human = i === 0;
  p.arm = { mode: "spike", t: p.arm && p.arm.mode === "spike" ? p.arm.t : 0.45, dur: 0.75, hit: 0.45 };
  G.attack = null; G.plan = null;
  if (G.last >= 0 && TEAM(G.last) === tm) G.touches++; else G.touches = 1;
  G.last = i; G.side = tm; G.rally++;
  const from = ball.p.clone();
  aim = aim || aiAim(tm, false);
  const e = human ? (1 - quality) * 2.2 * L.myErr + 0.15 : (Math.random() < L.err ? rnd(1.2, 2.5) : rnd(0, 0.5));
  const tgt = new V3(aim.x + rnd(-1, 1) * e, BR, aim.z + rnd(-1, 1) * e);
  let sol;
  if (spike) {
    const spd = (human ? 13 + 12 * quality : L.spk) * rnd(0.92, 1.05);
    let tt = from.distanceTo(tgt) / spd;
    for (let k = 0; k < 14; k++) { sol = launchTime(from, tgt, tt); const hn = heightAtNet(from, sol.v); if (!hn || hn.y > NET + 0.12) break; tt *= 1.06; }
    if (human && quality < 0.25 && Math.random() < 0.5) sol = launchTime(from, new V3(tgt.x, BR, SIDE[tm] * 0.3), tt * 0.7);
    sfx("spike"); G.shake = 1; G.lastSpike = true;
  } else {
    sol = launchApex(from, tgt, 3.6 + rnd(0, 0.6)); sfx("set"); G.lastSpike = false;
  }
  ball.v.copy(sol.v);
  G.lastSpd = sol.v.length() * 3.6;
  if (spike && G.lastSpd > G.stats.fast[tm]) G.stats.fast[tm] = G.lastSpd;
  puff(from, 0.5);
  /* بررسی بلاک هنگام عبور از تور */
  const hn = heightAtNet(from, ball.v);
  if (G.block && hn && spike) G.block.cross = { t: G.clock + hn.t, x: hn.x, y: hn.y };
  else if (G.block) G.block.cross = null;
  planReceive(tm);
}
function sendOver(i, spike) { doAttack(i, aiAim(PLAYERS[i].team, false), 0.6, spike); }

function blockHit(b) { 
  const p = PLAYERS[b.who];
  ball.v.set(rnd(-1.5, 1.5), -rnd(1, 3), SIDE[1 - p.team] * rnd(1.5, 3.5));
  ball.p.z = SIDE[1 - p.team] * 0.15;
  G.last = b.who; G.side = p.team; G.block = null; G.plan = null; G.blocked = b.who;
  sfx("block"); G.shake = 0.8; puff(ball.p, 0.4);
  showLbl("block");
}

function award(w, why) { 
  if (G.st !== "rally") return;
  G.pts[w]++; sfx("point"); sfx("whistle");
  const st = G.stats; st.pts[w]++; if (G.rally > st.long) st.long = G.rally;
  if (why === "r_in" && G.lastSpike && TEAM(G.last) === w) st.kill[w]++;
  if (why === "r_block") st.block[w]++;
  if (why === "r_ace") st.ace[w]++;
  if (why === "r_out" || why === "r_net") st.err[1 - w]++;
  crowd(Math.min(1, 0.35 + G.rally * 0.06 + (G.lastSpike ? 0.25 : 0))); G.cheer = 1.8;
  if (MODE === "ai" && G.rec.length > 50 && (G.rally >= 6 || (G.lastSpike && why === "r_in") || why === "r_block")) G.rp0 = true;
  G.recMore = 0.7;
  const tgt = G.setNo === 3 ? 15 : 21;
  const a = G.pts[w], o = G.pts[1 - w];
  if (G.srvTeam !== w) { G.srvTeam = w; G.srvIdx[w] = 1 - G.srvIdx[w]; }
  G.st = "point"; G.tm = 1.8; G.after = "serve"; G.plan = null; G.attack = null; G.block = null;
  PLAYERS.forEach((p) => { if (!G.practice || p.team === 0) { if (p.team === w) p.play(Math.random() < 0.5 ? "win" : "cheer", 1); else if (Math.random() < 0.6) p.play("lose", 1.2); } });
  if (a >= tgt && a - o >= 2) {
    G.sets[w]++;
    if (G.sets[w] > G.best / 2) { G.over = true; G.winner = w; G.tm = 2.4; G.after = "end"; say({ k: "match", n: w }); crowd(1); return; }
    say({ k: "set", n: w, why }); G.tm = 2.6; G.after = "newset"; return;
  }
  say({ k: "point", n: w, why });
}

/* ---------------- تمرین اسپک ---------------- */
function feed() {
  const setter = PLAYERS[1], me = PLAYERS[0];
  setter.x = setter.tx = 0.3; setter.z = setter.tz = 1.6;
  me.goal = null;
  ball.p.set(0.3, 2.1, 1.75); ball.live = true;
  const q = new V3(clamp(me.x, -2.5, 2.5) * 0.6 + rnd(-0.4, 0.4), 2.6, 0.9);
  const sol = launchApex(ball.p, q, 4.4); ball.v.copy(sol.v);
  setter.play("set", 1.1); setter.arm = { mode: "set", t: 0.4, dur: 0.75, tgt: ball.p.clone() }; sfx("set");
  G.st = "rally"; G.last = 1; G.side = 0; G.touches = 1; G.msg = null;
  G.attack = { who: 0, cp: q, tHit: G.clock + sol.T, jumped: false, team: 0 };
  G.plan = { who: 0, kind: "attack", cp: q, tEnd: G.clock + sol.T, h: 2.6 };
  me.goal = { x: q.x - 0.25, z: q.z + 1.6 }; me.react = G.clock;
  G.prTarget = new V3(rnd(-2.8, 2.8), BR, -rnd(3, 7));
}
function practiceLand(inside, near) { 
  G.st = "point"; G.tm = 1.0; G.after = "feed";
  if (inside) { G.streak++; if (G.streak > G.bestStreak) { G.bestStreak = G.streak; store("vb-streak", String(G.bestStreak)); } say({ k: near ? "perfectP" : "good" }); if (near) { crowd(0.6); G.cheer = 1.2; } }
  else { G.streak = 0; say({ k: "pmiss" }); }
}

/* ---------------- شبیه‌سازی ---------------- */
function aiStep(dt) {
  PLAYERS.forEach((p, i) => {
    if (i === 0 && !G.practice && !(G.attack && G.attack.who === 0)) return;
    if (i === 0 && G.practice && !(G.attack && G.attack.who === 0)) return;
    if (p.goal && G.clock >= (p.react || 0)) { p.tx = clamp(p.goal.x, -CW - 2, CW + 2); p.tz = p.goal.z; }
  });
}
function movePlayers(dt) {
  PLAYERS.forEach((p, i) => {
    const human = i === 0 && !(G.attack && G.attack.who === 0 && G.st === "rally");
    const spd = human ? 5.6 : (i === 1 ? 5.4 : G.L.aiSpd);
    const att = G.attack && G.attack.who === i;
    if (!att && p.os && (p.os.kind === "jump" || p.os.kind === "dig") && p.os.t > 0.2) { p.vx *= 0.85; p.vz *= 0.85; p.x += p.vx * dt * 0.5; p.z += p.vz * dt * 0.5; return; }
    const dx = p.tx - p.x, dz = p.tz - p.z, d = Math.hypot(dx, dz);
    let vx = 0, vz = 0;
    if (d > 0.04) { const s = Math.min(spd, d * 6); vx = dx / d * s; vz = dz / d * s; }
    p.vx = lerp(p.vx, vx, Math.min(1, dt * 10)); p.vz = lerp(p.vz, vz, Math.min(1, dt * 10));
    p.x += p.vx * dt; p.z += p.vz * dt;
    /* هر تیم در زمین خودش */
    const s = SIDE[p.team]; if (p.z * s < 0.35) p.z = s * 0.35;
  });
}
function humanKeys(dt) {
  const p = PLAYERS[0], sp = 6 * dt;
  if (keys.ArrowLeft) p.tx = p.x - sp * 3;
  if (keys.ArrowRight) p.tx = p.x + sp * 3;
  if (keys.ArrowUp) p.tz = p.z - sp * 3;
  if (keys.ArrowDown) p.tz = p.z + sp * 3;
  if (keys.ArrowLeft || keys.ArrowRight || keys.ArrowUp || keys.ArrowDown) { p.tx = clamp(p.tx, -CW - 2, CW + 2); p.tz = clamp(p.tz, 0.4, CL + 2.5); }
}

function stepBall(dt) {
  if (!ball.live) return;
  const pz = ball.p.z;
  ball.v.y -= GRAV * dt;
  ball.p.addScaledVector(ball.v, dt);
  ball.spin.x += ball.v.z * dt * 6; ball.spin.z -= ball.v.x * dt * 6;
  /* تور */
  if (pz * ball.p.z <= 0 && pz !== ball.p.z && G.st === "rally") {
    if (G.block && G.block.cross && G.block.ok === undefined) {
      const b = G.block, bp = PLAYERS[b.who], s = bp.os && bp.os.kind === "jump" ? bp.os.t : -1;
      const inAir = s > 0.35 && s < 0.95, close = Math.abs(ball.p.x - bp.x) < 0.6;
      b.ok = inAir && close && ball.p.y < 3.4 && (b.who === 0 || bp.willBlock);
      if (b.ok) { blockHit(b); return; }
    }
    if (ball.p.y < NET + BR && Math.abs(ball.p.x) < 4.6) {
      ball.p.z = pz > 0 ? 0.12 : -0.12; ball.v.z *= -0.25; ball.v.x *= 0.5; ball.v.y = Math.min(ball.v.y, 0) * 0.3;
      sfx("net"); G.netHit = true; G.plan = null;
    } else if (Math.abs(ball.p.x) > ANT) { G.antenna = true; }
  }
  /* زمین */
  if (ball.p.y <= BR) {
    ball.p.y = BR; const L = ball.p;
    sfx("sand"); puff(L, 1);
    GL.o.mark.visible = false;
    if (G.practice) { if (G.st !== "rally") { ball.v.y = Math.abs(ball.v.y) * 0.15; ball.v.x *= 0.2; ball.v.z *= 0.2; if (Math.abs(ball.v.y) < 0.3) ball.live = false; return; } const inside = L.z < 0 && Math.abs(L.x) <= CW && Math.abs(L.z) <= CL; practiceLand(inside, inside && G.prTarget && Math.hypot(L.x - G.prTarget.x, L.z - G.prTarget.z) < 1.2); ball.v.multiplyScalar(0.2); ball.v.y = Math.abs(ball.v.y) * 0.15; return; }
    if (G.st === "rally") {
      const sideT = L.z > 0 ? 0 : 1, inside = Math.abs(L.x) <= CW + 0.03 && Math.abs(L.z) <= CL + 0.03 && !G.antenna;
      const lastT = G.last >= 0 ? TEAM(G.last) : G.srvTeam;
      let w, why;
      if (G.blocked !== undefined && G.blocked !== null) { const bt = TEAM(G.blocked); if (inside && sideT !== bt) { w = bt; why = "r_block"; } else if (inside) { w = 1 - bt; why = "r_in"; } else { w = 1 - bt; why = "r_out"; } }
      else if (inside) { w = 1 - sideT; why = sideT === lastT ? (G.netHit ? "r_net" : "r_in") : (G.rally === 0 ? "r_ace" : "r_in"); }
      else { w = 1 - lastT; why = G.netHit ? "r_net" : "r_out"; }
      G.netHit = false; G.antenna = false; G.blocked = null;
      award(w, why);
    }
    ball.v.y = Math.abs(ball.v.y) * 0.15; ball.v.x *= 0.2; ball.v.z *= 0.2;
    if (Math.abs(ball.v.y) < 0.3) ball.live = false;
  }
}
function checkTouches() {
  if (G.st !== "rally" || !ball.live) return;
  /* ضربهٔ حمله */
  const A = G.attack;
  if (A) {
    const p = PLAYERS[A.who], human = A.who === 0, tTo = A.tHit - G.clock;
    if (!A.jumped && !human && tTo <= SEG.jump[3] + 0.02) { p.play("jump", 1); p.arm = { mode: "spike", t: 0, dur: 1.0, hit: SEG.jump[3], tgt: A.cp.clone() }; A.jumped = true; }
    if (!A.jumped && human && tTo <= SEG.jump[3] - 0.12) { A.jumped = true; A.auto = true; p.play("jump", 1); p.arm = { mode: "spike", t: 0.12, dur: 1.0, hit: SEG.jump[3], tgt: A.cp.clone() }; }
    if (A.jumped && tTo < 0.1 && tTo > 0) { p.handPoint("spike", _v8); ball.p.lerp(_v8, 0.06); }
    if (tTo <= SEG.jump[3] + 0.25 && !A.run) { A.run = true; p.goal = { x: A.cp.x + 0.25 * p.face(), z: A.cp.z - p.face() * 0.35 }; p.react = 0; }
    const B = G.block;
    if (B && B.who !== 0 && B.tm !== A.team && !B.jumped && PLAYERS[B.who].willBlock && G.clock >= A.tHit - 0.45) { B.jumped = true; const bp = PLAYERS[B.who]; bp.play("jump", 1); bp.arm = { mode: "block", t: 0, dur: 1.0 }; }
    if (tTo <= 0) {
      const hp = p.handPoint("spike", _v8), dist = ball.p.distanceTo(hp);
      if (dist < 1.3) ball.p.copy(hp);
      if (human) {
        if (A.jumped && G.tapT !== null && !A.auto) {
          const e = Math.abs(G.tapT - (A.tHit - SEG.jump[3]));
          const q = clamp(1 - e / 0.4, 0, 1);
          showLbl(e < 0.1 ? "perfect" : G.tapT < A.tHit - SEG.jump[3] ? "early" : "late");
          doAttack(0, G.aimP, q, true);
        } else { doAttack(0, G.aimP || aiAim(0, false), 0.4, false); }
        G.tapT = null; G.aimP = null; return;
      }
      if (dist < 1.3) { doAttack(A.who, null, 1, Math.random() < 0.8 || G.lvl === "p"); return; }
      G.attack = null;
    }
    return;
  }
  const P = G.plan; if (!P || P.kind === "attack") return;
  const p = PLAYERS[P.who];
  if (P.leave && ball.p.y < 2) return;
  const segK = P.kind === "set" ? "set" : P.kind === "dig" ? "dig" : "bump", spd = P.kind === "set" ? 1.1 : 1.2;
  const tc = ball.v.y < 0 || ball.p.y > P.h ? timeToY(ball.p, ball.v, P.h) : 0;
  const f = p.face(), ideal = { x: P.cp.x, z: P.cp.z - f * (P.kind === "set" ? 0.22 : 0.55) };
  const reach = P.who === 0 ? G.L.reach : (P.who === 1 ? 1.25 : 1.3);
  const dIdeal = Math.hypot(p.x - ideal.x, p.z - ideal.z);
  /* کمک جای‌گیری: وقتی نزدیک است، بازیکن خودش را دقیق زیر توپ می‌برد */
  if (tc !== null && tc < 0.75 && dIdeal < reach) { p.tx = ideal.x; p.tz = ideal.z; }
  /* شروع حرکت پیش از رسیدن توپ تا لحظهٔ تماس دقیقاً با رسیدن توپ یکی شود */
  if (!P.anim && tc !== null && tc <= SEG[segK][3] / spd && dIdeal < reach + 0.3) {
    P.anim = true; p.play(segK, spd);
    p.arm = { mode: segK === "set" ? "set" : "bump", t: 0, dur: (SEG[segK][2] - SEG[segK][1]) / spd, tgt: new V3(P.cp.x, P.h, P.cp.z) };
  }
  if (P.anim && tc !== null && tc < 0.08) { p.handPoint(P.kind, _v8); ball.p.lerp(_v8, 0.08); }
  if (ball.v.y < 0 && ball.p.y <= P.h + 0.03) {
    if (P.anim) {
      const hp = p.handPoint(P.kind, _v8), d = ball.p.distanceTo(hp);
      if (d <= 0.9) { ball.p.copy(hp); touch(P.who, P.kind, clamp(1 - dIdeal / reach, 0, 1), true); return; }
    }
    if (ball.p.y < P.h - 0.5) { G.plan = null; }
  }

}
function updAim() {
  const o = GL.o, P = G.plan;
  /* حلقهٔ زرد: جای ایستادن بازیکن خودی */
  if (G.st === "rally" && P && (P.who === 0) && P.kind !== "attack") { o.mark.visible = true; o.mark.position.set(P.cp.x, 0.02, P.cp.z - PLAYERS[0].face() * 0.45); o.mark.material.opacity = 0.55 + 0.3 * Math.sin(GL.t * 8); }
  else o.mark.visible = false;
  o.aim.visible = !!G.aimShow;
  if (G.aimShow) o.aim.position.set(G.aimShow.x, 0.025, G.aimShow.z);
  if (G.practice && G.prTarget) { o.aim.visible = true; o.aim.position.set(G.prTarget.x, 0.025, G.prTarget.z); o.aim.scale.setScalar(2.8); } else o.aim.scale.setScalar(1);
}

function simulate(dtR) {
  const dt = dtR * G.L.ts;
  G.clock += dt; G.shake = Math.max(0, G.shake - dtR * 3); G.cheer = Math.max(0, G.cheer - dtR);
  if (G.st === "replay") { stepReplay(dtR); return; }
  humanKeys(dt);
  aiStep(dt);
  if (G.st === "serve") {
    holdBall();
    const sv = server();
    if (sv !== 0 && !G.practice) { G.ai.srvT += dtR; if (G.ai.srvT > 1.4) startServe(null); }
  } else if (G.st === "toss") {
    G.toss.t += dt; ball.v.y -= GRAV * dt; ball.p.addScaledVector(ball.v, dt);
    if (G.toss.hit - G.toss.t < 0.1) { PLAYERS[G.toss.who].handPoint("serve", _v8); ball.p.lerp(_v8, 0.25); }
    if (G.toss.t >= G.toss.hit) doServeHit();
  } else if (G.st === "rally") {
    const n = Math.ceil(dt / (1 / 240)), h = dt / n;
    for (let k = 0; k < n && G.st === "rally"; k++) { stepBall(h); checkTouches(); }
    record(dtR);
  } else if (G.st === "point") {
    stepBall(dt);
    if (G.recMore > 0) { G.recMore -= dtR; record(dtR); }
    G.tm -= dtR; if (G.tm <= 0) afterPoint();
  }
  movePlayers(dt);
  PLAYERS.forEach((p) => p.update(dt));
  trail();
  updAction();
}
function afterPoint() {
  if (G.rp0 && MODE === "ai" && G.rec.length > 20) {
    G.rp0 = false;
    const f = G.rec, end = f[f.length - 1].t; let i0 = 0; while (i0 < f.length - 1 && f[i0].t < end - 3.6) i0++;
    G.rp = { f: f.slice(i0), i: 0, t: f[i0].t, end }; G.st = "replay"; G.msg = null; GL.snap = true; return;
  }
  finishPoint();
}
function finishPoint() {
  G.rp0 = false; G.blocked = null;
  if (G.after === "end") { G.st = "over"; showEnd(); }
  else if (G.after === "newset") { G.pts = [0, 0]; G.setNo++; setupServe(); }
  else if (G.after === "feed") feed();
  else setupServe();
}
/* ضبط برای بازپخش آهسته */
function record(dt) {
  G.recT += dt;
  const fr = { t: G.recT, b: [ball.p.x, ball.p.y, ball.p.z], pl: PLAYERS.map((p) => ({ x: p.x, z: p.z, vx: p.vx, vz: p.vz, os: p.os ? { ...p.os } : null, arm: p.arm ? { ...p.arm } : null })) };
  G.rec.push(fr); if (G.rec.length > 1200) G.rec.shift();
}
function stepReplay(dtR) {
  const rp = G.rp; rp.t += dtR * 0.4;
  while (rp.i < rp.f.length - 1 && rp.f[rp.i + 1].t <= rp.t) rp.i++;
  const f = rp.f[rp.i];
  ball.p.set(f.b[0], f.b[1], f.b[2]);
  PLAYERS.forEach((p, i) => { const s = f.pl[i]; p.x = s.x; p.z = s.z; p.vx = s.vx; p.vz = s.vz; p.os = s.os ? { ...s.os } : null; p.arm = s.arm ? { ...s.arm } : null; p.update(dtR * 0.4 * G.L.ts); });
  if (rp.t > rp.end + 0.2) endReplay();
}
function endReplay() { if (!G || G.st !== "replay") return; G.rp = null; GL.snap = true; finishPoint(); }
function trail() { if (!G.trail) G.trail = []; if (G.st === "rally" || G.st === "toss") { G.trail.push([ball.p.x, ball.p.y, ball.p.z]); if (G.trail.length > 10) G.trail.shift(); } else G.trail.length = 0; }

/* دکمهٔ زمان‌بندی اسپک / بلاک / سرویس */
function updAction() {
  let a = null;
  if (G.st === "serve" && server() === 0) a = { k: "serve", p: 1 };
  else if (G.st === "rally" && G.attack && G.attack.who === 0) {
    const ideal = G.attack.tHit - SEG.jump[3], r = clamp(1 - (ideal - G.clock) / 1.2, 0, 1);
    a = { k: "spike", p: r, good: Math.abs(ideal - G.clock) < 0.12 };
  } else if (G.st === "rally" && G.block && G.block.who === 0 && G.attack && G.attack.team === 1 && Math.abs(PLAYERS[0].z) < 2.4 && !G.block.jumped) {
    const ideal = G.attack.tHit - 0.45, r = clamp(1 - (ideal - G.clock) / 1.0, 0, 1);
    a = { k: "block", p: r, good: Math.abs(ideal - G.clock) < 0.15 };
  }
  G.act = a;
  const el = $("act"); if (!el) return;
  el.classList.toggle("on", !!a);
  if (a) { el.style.setProperty("--p", Math.round(a.p * 100) + "%"); el.classList.toggle("good", !!a.good); const lbl = t(a.k); if (el.textContent !== lbl) el.innerHTML = "<span>" + lbl + "</span>"; }
}
function humanTap(world) {
  if (!G || G.paused) return;
  const me = PLAYERS[0];
  if (G.st === "replay") { endReplay(); return; }
  if (G.st === "serve" && server() === 0) {
    const aim = world && world.z < -0.5 ? new V3(clamp(world.x, -CW + 0.3, CW - 0.3), BR, clamp(world.z, -CL + 0.3, -1)) : aiAim(0, true);
    G.aimShow = aim.clone(); setTimeout(() => { if (G) G.aimShow = null; }, 1200);
    startServe(aim); return;
  }
  if (G.st !== "rally") return;
  if (G.attack && G.attack.who === 0 && !G.attack.jumped) {
    G.attack.jumped = true; G.tapT = G.clock;
    G.aimP = world && world.z < -0.3 ? new V3(clamp(world.x, -CW - 0.5, CW + 0.5), BR, clamp(world.z, -CL - 0.5, -0.8)) : null;
    if (G.aimP) { G.aimShow = G.aimP.clone(); setTimeout(() => { if (G) G.aimShow = null; }, 1100); }
    me.play("jump", 1); me.arm = { mode: "spike", t: 0, dur: 1.0, hit: SEG.jump[3], tgt: G.attack.cp.clone() };
    return;
  }
  if (G.block && G.block.who === 0 && !G.block.jumped && Math.abs(me.z) < 2.4) {
    G.block.jumped = true; me.play("jump", 1); me.arm = { mode: "block", t: 0, dur: 1.0 }; me.tx = me.x; me.tz = me.z;
  }
}
function showLbl(k) { const el = $("shot"); if (!el) return; el.textContent = t(k); el.classList.add("on"); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove("on"), 800); }

/* ---------------- رندر ---------------- */
function puff(p, k) {
  if (!GL) return;
  const n = k >= 1 ? 14 : 5;
  for (let i = 0, c = 0; i < GL.o.puffs.length && c < n; i++) {
    const s = GL.o.puffs[i]; if (s.life > 0) continue; c++;
    s.life = 0.6 + Math.random() * 0.3; s.m.visible = true; s.m.position.set(p.x, Math.max(0.05, k >= 1 ? 0.05 : p.y), p.z);
    s.v.set(rnd(-1, 1) * 1.5, rnd(0.5, 2) * (k >= 1 ? 1 : 0.6), rnd(-1, 1) * 1.5);
    s.m.material.color.setHex(k >= 1 ? 0xe8d1a8 : 0xffffff);
  }
}
function updFx(dt) {
  const o = GL.o;
  o.puffs.forEach((s) => { if (s.life <= 0) return; s.life -= dt; s.v.y -= 4 * dt; s.m.position.addScaledVector(s.v, dt); s.m.scale.setScalar(1 + (0.9 - s.life) * 2); s.m.material.opacity = Math.max(0, s.life * 0.8); if (s.life <= 0) s.m.visible = false; });
  o.sea.material.uniforms.time.value = GL.t;
  const cr = o.crowd, ch = G ? G.cheer : 0;
  if (ch > 0 || cr.on) {
    cr.on = ch > 0; const m = new THREE.Matrix4(), a = Math.min(1, ch);
    for (let j = 0; j < cr.seats.length; j++) { const p = cr.seats[j], up = Math.max(0, Math.sin(GL.t * 11 + cr.ph[j])) * 0.12 * a; m.makeTranslation(p[0], p[1] + 0.28 + up, p[2]); cr.bodies.setMatrixAt(j, m); m.makeTranslation(p[0], p[1] + 0.68 + up, p[2]); cr.heads.setMatrixAt(j, m); }
    cr.bodies.instanceMatrix.needsUpdate = true; cr.heads.instanceMatrix.needsUpdate = true;
  }
}
function sizeGL(W, H) { GL.W = W; GL.H = H; GL.r.setSize(W, H, false); GL.cam.aspect = W / H; GL.cam.updateProjectionMatrix(); }
function render3D(dt, mode) {
  const o = GL.o, cam = GL.cam; GL.t += dt;
  o.ball.position.copy(ball.p); o.ball.rotation.set(ball.spin.x, 0, ball.spin.z);
  o.blob.position.set(ball.p.x, 0.02, ball.p.z); o.blob.scale.setScalar(clamp(1 + ball.p.y * 0.3, 1, 3)); o.blob.material.opacity = clamp(0.45 - ball.p.y * 0.04, 0.12, 0.45);
  const tr = G && (G.st === "rally" || G.st === "toss") ? G.trail : G && G.st === "replay" ? G.rp.f.slice(Math.max(0, G.rp.i - 9), G.rp.i + 1).map((f) => f.b) : [];
  o.trail.forEach((m, i) => { const q = tr[tr.length - 2 - i]; if (!q) { m.visible = false; return; } m.visible = true; m.position.set(q[0], q[1], q[2]); m.material.opacity = 0.25 * (1 - i / o.trail.length); });
  if (PLAYERS) PLAYERS.forEach((p, i) => { o.rings[i].position.set(p.x, 0.022, p.z); o.rings[i].visible = !(G && G.practice && i > 1); p.root.visible = !(G && G.practice && i > 1); });
  if (G && mode === "play") updAim(); else { o.mark.visible = false; o.aim.visible = false; }
  updFx(dt);
  /* دوربین */
  const asp = GL.W / GL.H, por = asp < 1;
  let fov;
  if (mode === "hero") {
    const a = GL.t * 0.1 + 0.4; fov = por ? 62 : 42;
    cam.position.set(Math.sin(a) * 15, 5.5, Math.cos(a) * 15); GL.camLook.set(0, 1.2, 0);
  } else if (mode === "replay") {
    fov = por ? 64 : 40; const k = Math.min(1, dt * 3);
    cam.position.lerp(GL.tmp.set(por ? 12 : 10.5, por ? 5 : 3.0, ball.p.z * 0.35 + 3.2), GL.snap ? 1 : k);
    GL.camLook.lerp(GL.tmp.set(0, 1.5, ball.p.z * 0.5), GL.snap ? 1 : k); GL.snap = false;
  } else {
    const me = PLAYERS ? PLAYERS[0] : { x: 0 };
    const fx = clamp(me.x * 0.45 + ball.p.x * 0.15, -2.6, 2.6);
    const P = por ? [0, 10.2, 12.8] : [0, 4.9, 13.6], Lk = por ? [0, 0.2, -0.9] : [0, 1.3, -2.4];
    fov = por ? clamp(2 * Math.atan(Math.tan(19 * Math.PI / 180) / asp) * 180 / Math.PI, 50, 72) : 47;
    const k = Math.min(1, dt * 2.5);
    cam.position.lerp(GL.tmp.set(P[0] + fx, P[1], P[2]), GL.snap ? 1 : k);
    GL.camLook.lerp(GL.tmp.set(Lk[0] + fx * 0.5, Lk[1], Lk[2]), GL.snap ? 1 : k); GL.snap = false;
  }
  if (Math.abs(cam.fov - fov) > 0.1) { cam.fov = fov; cam.updateProjectionMatrix(); }
  cam.lookAt(GL.camLook);
  if (G && G.shake > 0) { cam.position.x += rnd(-1, 1) * 0.04 * G.shake; cam.position.y += rnd(-1, 1) * 0.04 * G.shake; }
  GL.r.render(GL.scene, cam);
}
function attachGL(parent) { if (GL.canvas.parentNode !== parent) parent.insertBefore(GL.canvas, parent.firstChild); GL.snap = true; }

/* ---------------- رابط کاربری ---------------- */
const $app = $("app");
let gm = null, raf = 0, last = 0, hero = null, keys = {}, msgEl = null, tvKey = "", rallyKey = "", lastMsgKey = "";

function setLang(l) {
  LANG = l; store("lang", l);
  document.documentElement.lang = l; document.documentElement.dir = l === "fa" ? "rtl" : "ltr";
  $("ttl").textContent = t("title"); $("back").textContent = t("back"); $("lang").textContent = t("langBtn");
  document.title = t("title") + (l === "fa" ? " · انجمن ایرانیان سوندبی‌بری" : " · Iranska föreningen i Sundbyberg");
  tvKey = ""; rallyKey = ""; lastMsgKey = "";
  if (G && gm) buildBar(); else if (!G) menu();
}
$("lang").onclick = () => setLang(LANG === "fa" ? "sv" : "fa");
function myName() { const e = $("nm"), n = ((e && e.value) || store("vb-name") || store("pp-name") || "").trim().slice(0, 16); if (n) store("vb-name", n); return n || t("me"); }
function radio(name, items, cur) { return '<div class="opts">' + items.map((it) => '<label><input type="radio" name="' + name + '" value="' + it[0] + '"' + (it[0] === cur ? " checked" : "") + '><span class="o">' + it[1] + (it[2] ? "<small>" + it[2] + "</small>" : "") + "</span></label>").join("") + "</div>"; }
const val = (name) => { const e = document.querySelector('input[name="' + name + '"]:checked'); return e ? e.value : null; };

function menu() {
  stopLoop(); G = null; MODE = null; gm = null; surf(false);
  let lvl = store("vb-lvl") || "m"; if (!LV[lvl]) lvl = "m";
  const ln = store("vb-len") || "1";
  $app.innerHTML = '<div class="panel menu">' +
    '<div class="hero" id="hero"><div class="hero-badge">3D</div></div>' +
    '<div class="load" id="load"><span>' + t("loading") + ' <b id="lp">۰٪</b></span><div class="barx"><i id="lb"></i></div></div>' +
    "<h2>" + t("title") + "</h2><p>" + t("intro") + "</p>" +
    '<label class="field"><span>' + t("name") + '</span><input id="nm" maxlength="16" value="' + esc(store("vb-name") || store("pp-name") || "") + '" placeholder="' + t("namePh") + '" autocomplete="nickname"></label>' +
    '<div class="field"><span>' + t("level") + "</span>" + radio("lvl", ["e", "m", "h", "p"].map((k) => [k, t("lv")[k], t("lvd")[k]]), lvl) + "</div>" +
    '<div class="field"><span>' + t("len") + "</span>" + radio("len", [["1", t("len1")], ["3", t("len3")]], ln) + "</div>" +
    '<button class="btn" id="solo" disabled>' + t("vsAI") + "</button>" +
    '<button class="btn green" id="prac" disabled>' + t("practice") + "</button>" +
    '<details class="rules"><summary>' + t("rulesT") + "</summary><ul>" + t("rules").map((r) => "<li>" + r + "</li>").join("") + "</ul></details>" +
    "</div>";
  const saveOpts = () => { store("vb-lvl", val("lvl")); store("vb-len", val("len")); myName(); };
  const go = (fn) => () => { saveOpts(); audio(); if (AC && AC.state === "suspended") AC.resume(); if (!ASSETS.ready) return; fn(); };
  $("solo").onclick = go(startAI); $("prac").onclick = go(startPractice);
  if (!initGL()) { $("hero").classList.add("nogl"); $("hero").textContent = t("noGL"); $("load").hidden = true; return; }
  hero = $("hero"); attachGL(hero); sizeHero();
  const onProg = (p) => {
    const lp = $("lp"), lb = $("lb"); if (!lp) return;
    if (p < 0) { $("load").textContent = t("loadFail"); return; }
    lp.textContent = num(Math.round(p * 100)) + (LANG === "fa" ? "٪" : "%"); lb.style.width = Math.round(p * 100) + "%";
    if (p >= 1) { $("load").hidden = true; $("solo").disabled = false; $("prac").disabled = false; heroSetup(); }
  };
  if (ASSETS.ready) onProg(1); else { onProg(ASSETS.prog); loadAssets(onProg); }
  startLoop();
}
function heroSetup() {
  makePlayers();
  const pos = [[1.5, 4.5], [-1.8, 3], [0.8, -2.2], [-1.6, -5]];
  PLAYERS.forEach((p, i) => { p.x = p.tx = pos[i][0]; p.z = p.tz = pos[i][1]; p.vx = p.vz = 0; p.os = null; p.arm = null; });
  PLAYERS[2].play("jump", 1); PLAYERS[2].arm = { mode: "spike", t: 0, dur: 1.0, hit: 0.6 };
  ball.p.set(0.6, 3.1, -1.6);
}
function sizeHero() { if (!hero || !GL) return; const w = hero.clientWidth, h = Math.round(w * 0.6); hero.style.height = h + "px"; sizeGL(w, h); }

function startAI() {
  MODE = "ai";
  newGame({ lvl: store("vb-lvl") || "m", best: +(store("vb-len") || 1), names: [myName(), t("teamCpu")] });
  gameView();
}
function startPractice() {
  MODE = "practice";
  newGame({ lvl: store("vb-lvl") || "m", best: 1, names: [myName(), ""], practice: true });
  gameView();
}
function gameView() {
  hero = null; makePlayers();
  PLAYERS.forEach((p) => { p.os = null; p.arm = null; p.goal = null; });
  $app.innerHTML = '<div class="game" id="gm"><div class="tv" id="tv"></div><div class="rally" id="rally"></div>' +
    '<div class="rp" id="rp"><b><i></i>' + t("replay") + "</b><small>" + t("skip") + "</small></div>" +
    '<div class="act" id="act"></div><div class="shotlbl" id="shot"></div><div class="msg" id="msg"></div></div><div class="bar" id="bar"></div><p class="hint" id="hint"></p>';
  gm = $("gm"); msgEl = $("msg"); tvKey = ""; rallyKey = ""; lastMsgKey = "";
  attachGL(gm); buildBar(); resize(); bindInput(); startLoop(); surf(true);
}
function buildBar() {
  const bar = $("bar"); if (!bar || !G) return;
  bar.innerHTML = '<button type="button" id="snd">' + (muted ? t("sndOff") : t("sndOn")) + '</button><button type="button" id="pz">' + (G.paused ? t("resume") : t("pause")) + '</button><button type="button" id="ex">' + t("exit") + "</button>";
  $("hint").textContent = (G.practice ? t("hintP") : t("hint")) + "  ·  " + t("lv")[G.lvl];
  $("snd").onclick = () => { muted = !muted; store("vb-mute", muted ? "1" : "0"); audio(); surf(!muted); buildBar(); };
  $("pz").onclick = () => { G.paused = !G.paused; buildBar(); };
  $("ex").onclick = leave;
}
function resize() {
  if (hero) { sizeHero(); return; }
  if (!gm || !GL) return;
  const bar = $("bar"), hint = $("hint"), top = document.querySelector(".top");
  const extra = (top ? top.offsetHeight : 50) + (bar ? bar.offsetHeight : 50) + (hint && hint.offsetParent ? hint.offsetHeight : 0) + 34;
  const W = gm.clientWidth, avail = window.innerHeight - extra;
  const H = Math.round(window.innerHeight > W * 1.1 ? clamp(avail, 360, W * 1.9) : clamp(avail, 300, W * 0.66));
  gm.style.height = H + "px"; sizeGL(W, H); GL.snap = true;
}
window.addEventListener("resize", resize);

function bindInput() {
  let down = null;
  const world = (e) => {
    const rc = gm.getBoundingClientRect(), sx = (e.clientX - rc.left) / rc.width, sy = (e.clientY - rc.top) / rc.height;
    GL.ray.setFromCamera({ x: sx * 2 - 1, y: -(sy * 2 - 1) }, GL.cam);
    return GL.ray.ray.intersectPlane(GL.plane, GL.hit) ? GL.hit.clone() : null;
  };
  const moveTo = (w) => {
    if (!w || !G) return; const p = PLAYERS[0];
    if (G.attack && G.attack.who === 0) return;
    if (G.st === "serve" && server() === 0) return;
    p.tx = clamp(w.x, -CW - 2, CW + 2); p.tz = clamp(w.z, 0.4, CL + 2.5);
  };
  gm.onpointerdown = (e) => {
    audio(); if (AC && AC.state === "suspended") AC.resume();
    try { gm.setPointerCapture(e.pointerId); } catch (x) {}
    const w = world(e);
    down = { x: e.clientX, y: e.clientY, t: performance.now(), w };
    /* ضربه روی زمین حریف = اقدام (اسپک/سرویس)؛ روی زمین خودی = حرکت */
    if (G && (G.st === "replay" || G.act || (w && w.z < -0.2))) { humanTap(w); down.acted = true; }
    else moveTo(w);
  };
  gm.onpointermove = (e) => { if (!down || down.acted) return; moveTo(world(e)); };
  gm.onpointerup = () => { down = null; };
  document.onkeydown = (e) => {
    if (!G) return; if (e.target && e.target.tagName === "INPUT") return;
    keys[e.key] = true;
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); audio(); humanTap(null); }
    if (/^Arrow/.test(e.key)) e.preventDefault();
  };
  document.onkeyup = (e) => { keys[e.key] = false; };
}

function startLoop() { stopLoop(); last = performance.now(); raf = requestAnimationFrame(frame); }
function stopLoop() { if (raf) cancelAnimationFrame(raf); raf = 0; }
function frame(now) {
  raf = requestAnimationFrame(frame);
  const dt = clamp((now - last) / 1000, 0, 0.05); last = now;
  if (!GL) return;
  if (G && gm && PLAYERS) {
    if (!G.paused) simulate(dt);
    updMsg(); updHUD();
    render3D(G.paused ? 0 : dt, G.st === "replay" ? "replay" : "play");
  } else if (hero) {
    if (PLAYERS) {
      const P2 = PLAYERS[2]; if (!P2.os) { P2.play("jump", 1); P2.arm = { mode: "spike", t: 0, dur: 1.0, hit: 0.6 }; }
      const P0 = PLAYERS[0]; if (!P0.os) { P0.play(Math.random() < 0.5 ? "bump" : "set", 0.8); P0.arm = { mode: P0.os.kind === "bump" ? "bump" : "set", t: 0, dur: 0.8 }; }
      PLAYERS.forEach((p) => p.update(dt));
      ball.p.y = 2.6 + Math.sin(GL.t * 2) * 0.5;
    }
    render3D(dt, "hero");
  }
}

function msgHTML(m) {
  if (!m) return "";
  const nm = (i) => esc(G.names[i]);
  const sp = m.sp ? '<em class="sp">' + t(m.sp) + "</em>" : "";
  if (m.k === "serve") return sp + (m.who === 0 ? t("serveYou") + "<small>" + t("serveYouS") + "</small>" : m.who === 1 ? t("servePartner") : t("serveOpp"));
  if (m.k === "point") return tf("point", nm(m.n)) + "<small>" + t(m.why) + "</small>";
  if (m.k === "set") return tf("setWon", nm(m.n)) + "<small>" + t(m.why) + "</small>";
  if (m.k === "match") return tf("matchWon", nm(m.n));
  if (m.k === "good") return '<span class="good">' + t("good") + "</span>";
  if (m.k === "perfectP") return '<span class="good">' + t("perfect") + "</span>";
  if (m.k === "pmiss") return t("miss");
  return "";
}
function updMsg() {
  if (!msgEl) return;
  const m = G.paused ? { k: "_p" } : G.msg, key = m ? JSON.stringify(m) + LANG : "";
  if (key !== lastMsgKey) { lastMsgKey = key; if (m) msgEl.innerHTML = m.k === "_p" ? t("paused") : msgHTML(m); msgEl.classList.toggle("on", !!m); }
  if (G.msg && ["good", "pmiss", "perfectP"].includes(G.msg.k) && Date.now() - G.msgT > 800) G.msg = null;
}
function updHUD() {
  const tv = $("tv"), ra = $("rally"), rp = $("rp"); if (!tv) return;
  let key;
  if (G.practice) {
    key = [G.streak, G.bestStreak, LANG].join();
    if (key !== tvKey) { tvKey = key; tv.innerHTML = '<div class="tvp"><span>' + t("streak") + "</span><b>" + num(G.streak) + '</b></div><div class="tvp dim"><span>' + t("best") + "</span><b>" + num(G.bestStreak) + "</b></div>"; }
  } else {
    key = JSON.stringify([G.names, G.sets, G.pts, G.srvTeam, G.setNo, G.over, LANG]);
    if (key !== tvKey) {
      tvKey = key;
      tv.innerHTML = [0, 1].map((i) => '<div class="tvr' + (i === 0 ? " me" : "") + '"><i class="' + (G.srvTeam === i && !G.over ? "on" : "") + '"></i><span class="nm">' + esc(G.names[i]) + '</span><b class="s">' + num(G.sets[i]) + '</b><b class="p">' + num(G.pts[i]) + "</b></div>").join("") +
        '<div class="tvf">' + t("setW") + " " + num(G.setNo) + " · " + t("len" + G.best) + "</div>";
    }
  }
  const showR = (G.st === "rally" || G.st === "point") && G.rally >= 2;
  key = showR ? G.rally + "|" + Math.round(G.lastSpd) + LANG : "";
  if (key !== rallyKey) { rallyKey = key; ra.classList.toggle("on", showR); if (showR) ra.innerHTML = "<span>" + t("rally") + " <b>" + num(G.rally) + '</b></span><span class="kmh">' + num(Math.round(G.lastSpd)) + " " + t("kmh") + "</span>"; }
  rp.classList.toggle("on", G.st === "replay");
}
function showEnd() {
  if (!gm || gm.querySelector(".end")) return;
  const won = G.winner === 0, d = document.createElement("div"); d.className = "end";
  const s = G.stats, row = (lbl, a, b) => "<tr><td>" + a + "</td><th>" + lbl + "</th><td>" + b + "</td></tr>";
  const rows = '<table class="stats"><thead><tr><td>' + esc(G.names[0]) + "</td><th>" + t("statsT") + "</th><td>" + esc(G.names[1]) + "</td></tr></thead><tbody>" +
    row(t("sPts"), num(s.pts[0]), num(s.pts[1])) + row(t("sKill"), num(s.kill[0]), num(s.kill[1])) + row(t("sBlock"), num(s.block[0]), num(s.block[1])) +
    row(t("sAce"), num(s.ace[0]), num(s.ace[1])) + row(t("sErr"), num(s.err[0]), num(s.err[1])) + row(t("sFast"), num(Math.round(s.fast[0])), num(Math.round(s.fast[1]))) +
    '</tbody></table><p class="long">' + t("sLong") + ": <b>" + num(s.long) + "</b></p>";
  d.innerHTML = '<div class="panel"><h2>' + (won ? t("youWon") : t("youLost")) + "</h2><p>" + tf("matchWon", esc(G.names[G.winner])) + '</p><div class="big">' + num(G.sets[0]) + " – " + num(G.sets[1]) + "</div>" + rows +
    '<button class="btn" id="again">' + t("again") + '</button><button class="btn ghost" id="tomenu">' + t("menu") + "</button></div>";
  gm.appendChild(d); if (won) crowd(1);
  $("again").onclick = () => startAI();
  $("tomenu").onclick = leave;
}
function leave() { stopLoop(); G = null; MODE = null; menu(); }
document.addEventListener("visibilitychange", () => { if (document.hidden && G && G.st !== "over") { G.paused = true; buildBar(); surf(false); } });



setLang(LANG);
