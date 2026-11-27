/* پینگ‌پنگ انجمن ایرانیان سوندبی‌بری
   بازی با رایانه (متوسط / دشوار) و بازی آنلاین دونفره (PeerJS) */
(function () {
"use strict";

/* ---------------- ابزار ---------------- */
var $ = function (id) { return document.getElementById(id); };
function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
var LANG = store("lang") === "sv" ? "sv" : "fa";
var FAD = "۰۱۲۳۴۵۶۷۸۹";
function num(n) { n = String(n); return LANG === "fa" ? n.replace(/\d/g, function (d) { return FAD[d]; }) : n; }

var S = {
fa: {
  title: "پینگ‌پنگ", back: "→ بازگشت به تارنمای انجمن", langBtn: "Svenska",
  intro: "پینگ‌پنگ در یک سالن واقعی: با رایانه در دو سطح بازی کنید، یا آنلاین با یک هموند دیگر. نتیجه روی تابلوی دیجیتال سالن دیده می‌شود.",
  name: "نام شما", namePh: "مثلاً: البرز",
  level: "سطح بازی", lvlM: "متوسط", lvlMd: "بی‌پیچ، توپ آرام‌تر", lvlH: "دشوار", lvlHd: "تاپ‌اسپین، بک‌اسپین، ساید‌اسپین",
  racket: "نوع راکت", def: "دفاعی", defd: "کنترل بیشتر، بک‌اسپین قوی", all: "همه‌جانبه", alld: "متعادل", off: "تهاجمی", offd: "ضربهٔ تند، تاپ‌اسپین قوی",
  len: "طول مسابقه", len1: "یک ست", len3: "بهترین ۳ ست", len5: "بهترین ۵ ست",
  vsAI: "بازی با رایانه", mk: "ساختن اتاق آنلاین", jn: "پیوستن به اتاق", code: "کد اتاق", go: "پیوستن",
  rulesT: "راهنما و قوانین",
  rules: [
    "هر ست تا ۱۱ امتیاز است و برنده باید دست‌کم ۲ امتیاز جلو باشد.",
    "سرویس هر ۲ امتیاز عوض می‌شود؛ از ۱۰–۱۰ به بعد هر امتیاز.",
    "سرویس باید اول در زمین خودتان و بعد در زمین حریف بخورد. اگر سرویس به تور بخورد و درست بیفتد، تکرار می‌شود.",
    "راکت را با انگشت یا موس جابه‌جا کنید؛ وقتی توپ یک بار در زمین شما خورد و به راکت رسید، ضربه خودبه‌خود زده می‌شود.",
    "اگر لحظهٔ برخورد، راکت را رو به جلو بکشید ضربه تند و عمیق می‌شود؛ حرکت به چپ و راست جهت توپ را تعیین می‌کند. توپ بلند را با حرکت تند رو به جلو «اسمش» کنید.",
    "راکت دفاعی کنترل بیشتر و بک‌اسپین قوی‌تر دارد؛ راکت تهاجمی ضربه‌های تندتر و تاپ‌اسپین قوی‌تر، ولی خطای بیشتر.",
    "سطح دشوار: تاپ‌اسپین توپ را تند پایین می‌آورد و پس از برخورد با میز جلو می‌جهد؛ بک‌اسپین توپ را آهسته و کوتاه نگه می‌دارد؛ ساید‌اسپین توپ را به پهلو می‌پیچاند. پیچ حریف را با ضربهٔ مناسب جواب دهید: بک‌اسپین را با تاپ‌اسپین یا بک‌اسپین، تاپ‌اسپین را با تاپ‌اسپین. وگرنه توپ به تور می‌خورد یا بیرون می‌رود.",
    "کلیدها: جهت‌ها برای حرکت راکت، ۱ تا ۴ برای نوع ضربه، فاصله برای سرویس."
  ],
  computer: "رایانه", me: "هموند",
  serveYou: "سرویس با شماست", serveYouS: "روی میز بزنید یا کلید فاصله را بزنید", serveOpp: "سرویس با {n}",
  point: "امتیاز برای {n}", r_out: "توپ بیرون رفت", r_net: "توپ به تور خورد", r_own: "توپ در زمین خودی افتاد", r_miss: "توپ از دست رفت", r_double: "توپ دو بار در زمین خورد",
  let: "سرویس تکرار می‌شود (let)", setWon: "ست به {n} رسید", matchWon: "{n} برندهٔ مسابقه شد",
  youWon: "شما بردید", youLost: "این بار حریف برد", again: "بازی دوباره", menu: "بازگشت به منو", waitHost: "منتظر میزبان برای بازی دوباره…",
  pause: "مکث", resume: "ادامه", exit: "خروج", sndOn: "صدا: روشن", sndOff: "صدا: خاموش", paused: "بازی متوقف شد",
  creating: "در حال ساختن اتاق…", roomT: "اتاق آنلاین", roomP: "این کد را به هموند خود بدهید تا با «پیوستن به اتاق» وارد شود:",
  waitOpp: "منتظر حریف…", oppIn: "{n} وارد اتاق شد", start: "شروع بازی", cancel: "لغو",
  joining: "در حال پیوستن…", joined: "به اتاق پیوستید. منتظر بمانید تا میزبان بازی را شروع کند.",
  noRoom: "اتاقی با این کد پیدا نشد.", connFail: "اتصال برقرار نشد.", lost: "ارتباط با حریف قطع شد.", noPeer: "بخش آنلاین بار نشد؛ اتصال اینترنت را بررسی کنید.",
  code4: "کد چهاررقمی اتاق را بنویسید.", full: "این اتاق پر است.",
  hint: "راکت را با انگشت یا موس حرکت دهید. لحظهٔ ضربه راکت را رو به جلو بکشید تا ضربه تندتر شود.",
  hintH: "نوع ضربه را با دکمه‌ها یا کلیدهای ۱ تا ۴ انتخاب کنید.",
  shots: { flat: "تخت", top: "تاپ‌اسپین", back: "بک‌اسپین", side: "ساید‌اسپین" },
  setW: "ست", ofW: "از", lvlTag: { m: "سطح متوسط", h: "سطح دشوار" }
},
sv: {
  title: "Pingis", back: "← Tillbaka till föreningens webbplats", langBtn: "فارسی",
  intro: "Pingis i en riktig hall: spela mot datorn på två nivåer, eller online mot en annan medlem. Resultatet syns på hallens digitala resultattavla.",
  name: "Ditt namn", namePh: "t.ex. Alborz",
  level: "Nivå", lvlM: "Medel", lvlMd: "Utan skruv, lugnare boll", lvlH: "Svår", lvlHd: "Topspin, backspin, sidospinn",
  racket: "Racket", def: "Defensiv", defd: "Mer kontroll, stark backspin", all: "Allround", alld: "Balanserad", off: "Offensiv", offd: "Snabba slag, stark topspin",
  len: "Matchlängd", len1: "Ett set", len3: "Bäst av 3", len5: "Bäst av 5",
  vsAI: "Spela mot datorn", mk: "Skapa onlinerum", jn: "Gå med i rum", code: "Rumskod", go: "Gå med",
  rulesT: "Regler och styrning",
  rules: [
    "Ett set spelas till 11 poäng och man måste vinna med minst 2.",
    "Serven byts varannan poäng; från 10–10 varje poäng.",
    "Serven ska studsa först på egen planhalva och sedan hos motståndaren. Tar serven i nätet men landar rätt blir det omserv.",
    "Flytta racketen med fingret eller musen; när bollen har studsat en gång hos dig och når racketen slås den automatiskt.",
    "Dra racketen framåt vid träffen för ett snabbare och djupare slag; sidledsrörelse styr riktningen. Smasha höga bollar med en snabb rörelse framåt.",
    "Defensiv racket ger mer kontroll och starkare backspin; offensiv racket ger snabbare slag och starkare topspin men fler misstag.",
    "Svår nivå: topspin får bollen att dyka och studsa framåt; backspin gör bollen långsam och kort; sidospinn får bollen att skruva i sidled. Svara rätt på motståndarens skruv: backspin med topspin eller backspin, topspin med topspin – annars hamnar bollen i nätet eller utanför.",
    "Tangenter: piltangenterna flyttar racketen, 1–4 väljer slag, mellanslag för serve."
  ],
  computer: "Datorn", me: "Medlem",
  serveYou: "Din serve", serveYouS: "Tryck på bordet eller mellanslag", serveOpp: "{n} servar",
  point: "Poäng till {n}", r_out: "Bollen gick ut", r_net: "Bollen tog i nätet", r_own: "Bollen studsade på egen planhalva", r_miss: "Missad boll", r_double: "Bollen studsade två gånger",
  let: "Omserv (let)", setWon: "Setet till {n}", matchWon: "{n} vann matchen",
  youWon: "Du vann", youLost: "Motståndaren vann den här gången", again: "Spela igen", menu: "Till menyn", waitHost: "Väntar på att värden startar igen…",
  pause: "Paus", resume: "Fortsätt", exit: "Avsluta", sndOn: "Ljud: på", sndOff: "Ljud: av", paused: "Pausad",
  creating: "Skapar rum…", roomT: "Onlinerum", roomP: "Ge den här koden till din motspelare så att hen kan gå med via ”Gå med i rum”:",
  waitOpp: "Väntar på motspelare…", oppIn: "{n} har anslutit", start: "Starta matchen", cancel: "Avbryt",
  joining: "Ansluter…", joined: "Du är med i rummet. Vänta tills värden startar matchen.",
  noRoom: "Hittade inget rum med den koden.", connFail: "Anslutningen misslyckades.", lost: "Anslutningen till motspelaren bröts.", noPeer: "Onlinedelen kunde inte laddas; kontrollera internet.",
  code4: "Skriv den fyrsiffriga rumskoden.", full: "Rummet är fullt.",
  hint: "Flytta racketen med fingret eller musen. Dra racketen framåt vid träffen för ett hårdare slag.",
  hintH: "Välj slag med knapparna eller tangenterna 1–4.",
  shots: { flat: "Platt", top: "Topspin", back: "Backspin", side: "Sidospinn" },
  setW: "Set", ofW: "av", lvlTag: { m: "Medelnivå", h: "Svår nivå" }
}
};
function t(k) { return S[LANG][k]; }
function tf(k, n) { return t(k).replace("{n}", n); }

var toastT;
function toast(m) { var e = $("toast"); e.textContent = m; e.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(function () { e.classList.remove("on"); }, 3200); }

/* ---------------- فیزیک ---------------- */
var TL = 1.37, TW = 0.7625, NH = 0.1525, NW = 0.915, BR = 0.02, FLOOR = -0.76, GR = 9.8;
var KM = 7, KS = 3, KB = 1.1, KBS = 0.6;
var RT = {
  def: { spd: 0.86, ctl: 0.6, top: 0.8, back: 1.3, reach: 0.33 },
  all: { spd: 1, ctl: 1, top: 1, back: 1, reach: 0.30 },
  off: { spd: 1.18, ctl: 1.35, top: 1.3, back: 0.8, reach: 0.28 }
};
var LV = {
  m: { ts: 0.55, spin: false, reach: 1.18, aiSpd: 1.7, aiReact: 0.24, aiErr: 0.13, aiNoise: 0.1 },
  h: { ts: 0.7, spin: true, reach: 1, aiSpd: 2.6, aiReact: 0.1, aiErr: 0.05, aiNoise: 0.035 }
};

function mkBall() { return { x: 0, y: 0.3, z: 1.6, vx: 0, vy: 0, vz: 0, pz: 1.6, top: 0, sx: 0, hitter: 0, landed: false, net: false, serve: 0, next: null, n: 0 }; }
function mkR(p) { var s = p === 0 ? 1 : -1; return { x: 0, y: 0.2, z: s * 1.75, tx: 0, tz: s * 1.75, vx: 0, vz: 0, sw: null }; }

function phys(b, dt, cb) {
  var px = b.x, py = b.y, pz = b.z;
  b.vx += KS * b.sx * dt; b.vy += (-GR - KM * b.top) * dt;
  b.x += b.vx * dt; b.y += b.vy * dt; b.z += b.vz * dt;
  if (pz * b.z <= 0 && pz !== b.z && Math.abs(b.x) < NW && b.y < NH + BR && b.y > -0.02) {
    b.z = pz > 0 ? BR + 0.002 : -BR - 0.002; b.vz *= -0.2; b.vx *= 0.4; b.vy = Math.min(b.vy, 0) * 0.3;
    cb("net");
  }
  if (b.vy < 0 && b.y <= BR && py > BR - 0.002 && Math.abs(b.x) <= TW + BR * 0.5 && Math.abs(b.z) <= TL + BR * 0.5) {
    b.y = BR; b.vy = -b.vy * 0.88; var dz = b.vz >= 0 ? 1 : -1;
    b.vz += dz * b.top * KB; b.vx += b.sx * KBS; b.top *= 0.55; b.sx *= 0.55;
    cb("bounce", b.z > 0 ? 0 : 1);
  }
  if (b.y <= FLOOR + BR) { b.y = FLOOR + BR; b.vy = -b.vy * 0.55; b.vx *= 0.7; b.vz *= 0.7; cb("floor"); }
  else if (Math.abs(b.z) > 4.1 || Math.abs(b.x) > 3.2) cb("floor");
}

/* سرعت لازم برای رسیدن به نقطهٔ هدف در زمان t، با گذر از روی تور */
function plan(b, xt, zt, tt, clear) {
  var ax = KS * b.sx, ay = -GR - KM * b.top;
  for (var i = 0; i < 30; i++) {
    var vx = (xt - b.x - 0.5 * ax * tt * tt) / tt, vz = (zt - b.z) / tt, vy = (BR - b.y - 0.5 * ay * tt * tt) / tt;
    if (clear && b.z * zt < 0) {
      var tn = -b.z / vz, yn = b.y + vy * tn + 0.5 * ay * tn * tn;
      if (yn < NH + BR + 0.03) { tt *= 1.07; continue; }
    }
    b.vx = vx; b.vy = vy; b.vz = vz; return;
  }
  b.vx = vx; b.vy = vy; b.vz = vz;
}

/* ---------------- وضعیت بازی ---------------- */
var G = null, ME = 0, MODE = null; // MODE: ai | host | guest
var peer = null, conn = null, PFX = "anjoman-pingpong-";

function newGame(o) {
  G = {
    lvl: o.lvl, L: LV[o.lvl], best: o.best, names: o.names, rts: o.rts,
    sets: [0, 0], pts: [0, 0], setNo: 1, first: Math.random() < 0.5 ? 0 : 1, server: 0,
    rk: [mkR(0), mkR(1)], b: mkBall(), st: "serve", tm: 0, ev: [], shot: ["flat", "flat"],
    over: false, winner: -1, msg: null, paused: false, ai: { d: 0, pred: null, pn: -1, noise: 0, fe: 0, sv: 0 }, clock: 0
  };
  G.server = G.first;
  setupServe();
}

function say(m) { G.msg = m; G.msgT = Date.now(); }
function ev(e) { G.ev.push(e); sfx(e); }

function setupServe() {
  G.st = "serve"; G.ai.sv = 0;
  var b = G.b; b.top = 0; b.sx = 0; b.vx = b.vy = b.vz = 0; b.next = null; b.serve = 0; b.landed = false; b.net = false;
  holdBall();
  say({ k: "serve", n: G.server });
}
function holdBall() {
  var r = G.rk[G.server], b = G.b;
  b.x = r.x; b.z = G.server === 0 ? Math.max(r.z, TL + 0.06) : Math.min(r.z, -TL - 0.06);
  b.y = 0.22 + 0.1 * Math.abs(Math.sin(G.clock * 3)); b.pz = b.z;
}

function spinOf(shot, T, aim) {
  var top = 0, sx = 0;
  if (shot === "top") top = 0.9 * T.top;
  else if (shot === "back") top = -0.85 * T.back;
  else if (shot === "side") { top = 0.25; sx = (aim >= 0 ? 1 : -1) * 0.9; }
  return [top, sx];
}

function swingOf(p) {
  var r = G.rk[p];
  if (r.sw) { var s = r.sw; r.sw = null; return s; }
  var fwd = p === 0 ? -r.vz : r.vz;
  return { aim: clamp(r.vx / 2.2, -1, 1), pow: clamp(0.22 + fwd / 2.4, 0.15, 1) };
}

function doServe(p, shot) {
  if (!G || G.st !== "serve" || p !== G.server || G.over) return;
  var r = G.rk[p], b = G.b, d = p === 0 ? -1 : 1, T = RT[G.rts[p]];
  if (MODE === "ai" && p === 1) aiServe();
  var sw = swingOf(p);
  shot = G.L.spin ? (shot || G.shot[p]) : "flat";
  holdBall(); b.y = 0.3;
  var sp = spinOf(shot, T, sw.aim); b.top = sp[0] * 0.8; b.sx = sp[1] * 0.8;
  var x1 = clamp(b.x * 0.55, -0.55, 0.55), z1 = -d * TL * 0.55;
  var x2 = clamp(-r.x * 0.45 + sw.aim * 0.5, -0.6, 0.6), z2 = d * (0.5 + 0.65 * sw.pow);
  plan(b, x1, z1, 0.3, false);
  b.next = { x: x2, z: z2, v: (4.2 + 2.6 * sw.pow) * T.spd * (shot === "back" ? 0.8 : 1) };
  b.hitter = p; b.serve = 1; b.landed = false; b.net = false; b.n++;
  G.st = "rally"; G.msg = null;
  ev("hit");
  if (p === ME) showShot(shot, false);
}

function onEv(e, s) {
  var b = G.b; if (G.st !== "rally") return;
  if (e === "net") { if (!b.net) ev("net"); b.net = true; return; }
  if (e === "bounce") {
    ev("bounce");
    var h = b.hitter;
    if (b.serve === 1) {
      if (s !== h) return award(1 - h, "r_out");
      b.serve = 2;
      if (b.next) { var nx = b.next; b.next = null; var dist = Math.hypot(nx.x - b.x, nx.z - b.z); plan(b, nx.x, nx.z, dist / nx.v, true); }
      return;
    }
    if (s === h) return award(1 - h, b.net ? "r_net" : "r_own");
    if (!b.landed) {
      b.landed = true;
      if (b.serve === 2 && b.net) return letServe();
      b.serve = 0; return;
    }
    return award(h, "r_double");
  }
  if (e === "floor") {
    if (b.landed) award(b.hitter, "r_miss");
    else award(1 - b.hitter, b.net ? "r_net" : "r_out");
  }
}

function letServe() { G.st = "point"; G.tm = 1.1; G.after = "serve"; say({ k: "let" }); }

function award(w, why) {
  G.pts[w]++; ev("point");
  var a = G.pts[w], o = G.pts[1 - w];
  G.st = "point"; G.tm = 1.4; G.after = "serve";
  if (a >= 11 && a - o >= 2) {
    G.sets[w]++;
    if (G.sets[w] > G.best / 2) { G.over = true; G.winner = w; G.tm = 2; G.after = "end"; say({ k: "match", n: w }); return; }
    say({ k: "set", n: w, why: why }); G.tm = 2.2; G.after = "newset"; return;
  }
  say({ k: "point", n: w, why: why });
  rotateServe();
}
function rotateServe() {
  var tot = G.pts[0] + G.pts[1];
  G.server = tot < 20 ? (G.first + Math.floor(tot / 2)) % 2 : (G.first + tot) % 2;
}

function tryHit(p) {
  var b = G.b, r = G.rk[p];
  if (b.hitter === p || !b.landed) return false;
  var dirIn = p === 0 ? 1 : -1;
  if (b.vz * dirIn <= 0) return false;
  if (!((b.pz - r.z) * dirIn < 0 && (b.z - r.z) * dirIn >= 0)) return false;
  var R = RT[G.rts[p]].reach * G.L.reach, dx = b.x - r.x;
  if (Math.abs(dx) > R || b.y < -0.3 || b.y > 1.2) return false;
  if (MODE === "ai" && p === 1) aiShot();
  hit(p, dx / R);
  return true;
}

function hit(p, off) {
  var b = G.b, T = RT[G.rts[p]], L = G.L, d = p === 0 ? -1 : 1;
  var sw = swingOf(p);
  var shot = L.spin ? G.shot[p] : "flat";
  var smash = b.y > 0.42 && sw.pow > 0.55 && shot !== "back";
  var aimX = clamp(sw.aim * 0.62 - off * 0.22, -0.7, 0.7);
  var sp = smash ? [L.spin ? 0.15 : 0, 0] : L.spin ? spinOf(shot, T, aimX) : [0, 0];
  var depth = smash ? 1 : sw.pow;
  var zt = d * (0.45 + 0.75 * depth);
  var e = 0, it = b.top;
  if (L.spin) {
    if (it > 0) e += it * (shot === "back" ? 0.5 : shot === "flat" ? 0.22 : shot === "side" ? 0.15 : 0.04);
    else if (it < 0) e += it * (shot === "flat" ? 0.45 : shot === "side" ? 0.3 : 0.07);
    aimX += b.sx * (shot === "side" ? 0.05 : 0.3);
  }
  var ao = Math.abs(off);
  if (ao > 0.72) e += (Math.random() - 0.5) * 1.1 * (ao - 0.72) / 0.28;
  e += (Math.random() - 0.5) * 0.12 * sw.pow;
  e *= T.ctl; if (smash) e *= 1.3;
  if (MODE === "ai" && p === 1) e += G.ai.fe;
  zt += d * e;
  aimX = clamp(aimX + (Math.random() - 0.5) * 0.08 * T.ctl, -0.85, 0.85);
  var v = (5 + 4.6 * sw.pow) * T.spd * (shot === "back" && !smash ? 0.72 : 1) * (smash ? 1.45 : 1) * (shot === "top" ? 1.08 : 1);
  b.top = sp[0]; b.sx = sp[1]; b.hitter = p; b.landed = false; b.net = false; b.serve = 0; b.n++;
  if (e < -0.32) {
    var zz = d * 0.4, tt = Math.hypot(aimX - b.x, zz - b.z) / v;
    plan(b, aimX, zz, tt, false);
    var tn = -b.z / b.vz, ay = -GR - KM * b.top;
    b.vy = (NH * 0.4 - b.y - 0.5 * ay * tn * tn) / tn;
  } else {
    plan(b, aimX, zt, Math.hypot(aimX - b.x, zt - b.z) / v, true);
  }
  ev("hit");
  if (p === ME) showShot(shot, smash);
}

/* ---------------- رایانه ---------------- */
function predict(p) {
  var b = G.b, c = { x: b.x, y: b.y, z: b.z, vx: b.vx, vy: b.vy, vz: b.vz, top: b.top, sx: b.sx, next: b.next };
  var landed = b.landed, dt = 1 / 240, apex = null, dead = false, pts = [], sg = p === 1 ? -1 : 1;
  for (var i = 0; i < 900 && !dead; i++) {
    var prevVy = c.vy;
    phys(c, dt, function (e, s) {
      if (e === "bounce") {
        if (s === p) { if (landed) dead = true; landed = true; }
        else if (c.next) { var nx = c.next; c.next = null; plan(c, nx.x, nx.z, Math.hypot(nx.x - c.x, nx.z - c.z) / nx.v, true); }
        else if (landed) dead = true;
      }
      if (e === "floor" || e === "net") dead = true;
    });
    if (dead) break;
    if (landed) {
      pts.push([c.x, c.z]);
      if (!apex && prevVy > 0 && c.vy <= 0) apex = c.z;
      if (c.z * sg >= 2.4) break;
    }
  }
  if (!landed || !pts.length) return null;
  var zp = apex === null ? 1.75 : clamp(apex * sg + 0.08, 1.2, 2.3);
  var lastZ = pts[pts.length - 1][1] * sg;
  if (lastZ < zp) zp = Math.max(1.15, lastZ - 0.05);
  for (var k = 0; k < pts.length; k++) if (pts[k][1] * sg >= zp) return { x: pts[k][0], z: zp * sg };
  return { x: pts[pts.length - 1][0], z: zp * sg };
}

function aiThink(dtR, dtS) {
  var A = G.ai, r = G.rk[1], b = G.b, L = G.L;
  if (G.st === "serve" && G.server === 1) {
    A.sv += dtR; r.tx = Math.sin(G.clock * 0.9) * 0.3; r.tz = -1.7;
    if (A.sv > 1.1) doServe(1);
  } else if (G.st === "rally" && b.hitter === 0) {
    if (A.pn !== b.n) {
      A.d += dtR;
      if (A.d >= L.aiReact) {
        A.pred = predict(1); A.pn = b.n; A.d = 0;
        A.noise = (Math.random() - 0.5) * 2 * L.aiNoise;
        A.fe = 0;
        if (Math.random() < L.aiErr) { if (Math.random() < 0.35) A.noise += (Math.random() < 0.5 ? -1 : 1) * 0.5; else A.fe = (Math.random() < 0.5 ? -0.5 : 0.45); }
      }
    }
    if (A.pred) { r.tx = A.pred.x + A.noise; r.tz = A.pred.z; }
  } else {
    if (G.st !== "rally" || b.hitter === 1) { A.pred = null; }
    r.tx = r.tx * 0.98; r.tz = -1.75;
  }
  var mx = L.aiSpd * dtS;
  var ox = r.x, oz = r.z;
  r.x += clamp(r.tx - r.x, -mx, mx); r.z += clamp(r.tz - r.z, -mx, mx);
  r.vx = (r.x - ox) / Math.max(dtR, 1e-3); r.vz = (r.z - oz) / Math.max(dtR, 1e-3);
}
function aiShot() {
  var b = G.b, hard = G.L.spin, r = G.rk[1];
  var tx = (Math.random() < 0.5 ? -1 : 1) * (hard ? 0.35 + Math.random() * 0.3 : Math.random() * 0.45);
  var s = { aim: clamp(tx / 0.62, -1, 1), pow: hard ? 0.5 + Math.random() * 0.5 : 0.25 + Math.random() * 0.4 };
  var shot = "flat";
  if (hard) {
    var q = Math.random();
    if (b.y > 0.42 && q < 0.8) { shot = "flat"; s.pow = 1; }
    else if (b.top < -0.25) shot = q < 0.6 ? "top" : q < 0.92 ? "back" : "flat";
    else if (b.top > 0.25) shot = q < 0.8 ? "top" : q < 0.9 ? "side" : "back";
    else shot = q < 0.45 ? "top" : q < 0.65 ? "side" : q < 0.85 ? "back" : "flat";
  }
  G.shot[1] = shot; r.sw = s;
}
function aiServe() {
  var hard = G.L.spin, q = Math.random();
  G.shot[1] = hard ? (q < 0.35 ? "back" : q < 0.6 ? "side" : q < 0.85 ? "top" : "flat") : "flat";
  G.rk[1].sw = { aim: (Math.random() - 0.5) * 1.6, pow: 0.25 + Math.random() * 0.55 };
}

/* ---------------- صدا ---------------- */
var AC = null, muted = store("pp-mute") === "1", NB = null;
function audio() { if (AC) return AC; try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { AC = null; } return AC; }
function sfx(k) {
  if (muted || !AC) return;
  var a = AC, t0 = a.currentTime;
  if (k === "point") {
    [660, 990].forEach(function (f, i) { var o = a.createOscillator(), g = a.createGain(); o.type = "sine"; o.frequency.value = f; g.gain.setValueAtTime(0.0001, t0 + i * 0.12); g.gain.exponentialRampToValueAtTime(0.18, t0 + i * 0.12 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + i * 0.12 + 0.25); o.connect(g).connect(a.destination); o.start(t0 + i * 0.12); o.stop(t0 + i * 0.12 + 0.3); });
    return;
  }
  if (!NB) { NB = a.createBuffer(1, a.sampleRate * 0.08, a.sampleRate); var d = NB.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3); }
  var src = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
  src.buffer = NB; f.type = "bandpass";
  var P = { hit: [1500, 0.9, 6], bounce: [3400, 0.55, 9], net: [420, 0.5, 2] }[k]; if (!P) return;
  f.frequency.value = P[0]; f.Q.value = P[2]; g.gain.value = P[1];
  src.connect(f).connect(g).connect(a.destination); src.start(t0);
  if (k === "bounce" || k === "hit") { var o = a.createOscillator(), og = a.createGain(); o.frequency.value = k === "hit" ? 900 : 1900; og.gain.setValueAtTime(0.12, t0); og.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.05); o.connect(og).connect(a.destination); o.start(t0); o.stop(t0 + 0.06); }
}

/* ---------------- دوربین و رسم ---------------- */
var CAM = { x: 0, y: 1.05, z: 3.35 }, TGT = { x: 0, y: -0.12, z: -0.55 };
var Fv, Rv, Uv, f = 500, cx = 200, cy = 200;
function setCam(portrait) {
  if (portrait) { CAM = { x: 0, y: 1.75, z: 3.0 }; TGT = { x: 0, y: -0.35, z: -0.6 }; }
  else { CAM = { x: 0, y: 1.05, z: 3.35 }; TGT = { x: 0, y: -0.12, z: -0.55 }; }
  var dx = TGT.x - CAM.x, dy = TGT.y - CAM.y, dz = TGT.z - CAM.z, l = Math.hypot(dx, dy, dz);
  Fv = [dx / l, dy / l, dz / l];
  var rx = -Fv[2], rz = Fv[0], rl = Math.hypot(rx, rz); Rv = [rx / rl, 0, rz / rl];
  Uv = [Rv[1] * Fv[2] - Rv[2] * Fv[1], Rv[2] * Fv[0] - Rv[0] * Fv[2], Rv[0] * Fv[1] - Rv[1] * Fv[0]];
}
setCam(false);
function P(x, y, z) {
  var dx = x - CAM.x, dy = y - CAM.y, dz = z - CAM.z;
  var xc = dx * Rv[0] + dy * Rv[1] + dz * Rv[2], yc = dx * Uv[0] + dy * Uv[1] + dz * Uv[2], zc = dx * Fv[0] + dy * Fv[1] + dz * Fv[2];
  if (zc < 0.05) zc = 0.05;
  return [cx + f * xc / zc, cy - f * yc / zc, f / zc];
}
function unproj(sx, sy, py) {
  var xc = (sx - cx) / f, yc = -(sy - cy) / f;
  var d = [Fv[0] + Rv[0] * xc + Uv[0] * yc, Fv[1] + Rv[1] * xc + Uv[1] * yc, Fv[2] + Rv[2] * xc + Uv[2] * yc];
  if (d[1] > -0.01) return null;
  var k = (py - CAM.y) / d[1];
  return { x: CAM.x + d[0] * k, z: CAM.z + d[2] * k };
}
function layout(W, H) {
  setCam(H > W * 1.1);
  f = Math.min(0.8 * W, 1.6 * H); cx = W / 2;
  for (var i = 0; i < 6; i++) {
    cy = 0; var top = P(0, 2.2, -4.3)[1], bot = P(0, 0.02, 2.35)[1];
    if (bot - top > H * 0.95) { f *= (H * 0.95) / (bot - top); continue; }
    cy = H * 0.03 - top; if (cy + bot > H * 0.985) cy = H * 0.985 - bot;
    break;
  }
}
function poly(c, pts, fill, stroke, lw) {
  c.beginPath(); pts.forEach(function (q, i) { var p = P(q[0], q[1], q[2]); if (i) c.lineTo(p[0], p[1]); else c.moveTo(p[0], p[1]); }); c.closePath();
  if (fill) { c.fillStyle = fill; c.fill(); }
  if (stroke) { c.strokeStyle = stroke; c.lineWidth = lw || 1; c.stroke(); }
}
function line(c, a, b, col, lw) { var p = P(a[0], a[1], a[2]), q = P(b[0], b[1], b[2]); c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(q[0], q[1]); c.strokeStyle = col; c.lineWidth = lw; c.stroke(); }

var logo = new Image(); logo.src = "../tasvir/logo.webp"; var logoOk = false;
logo.onload = function () { logoOk = true; bgDirty = true; };
var BG = document.createElement("canvas"), bgDirty = true;

var WX = 3.4, WZ = -4.3, WZN = 3.2, CEIL = 2.9;
function drawRoom(c, W, H) {
  /* دیوار پشت */
  var g = c.createLinearGradient(0, P(0, CEIL, WZ)[1], 0, P(0, FLOOR, WZ)[1]);
  g.addColorStop(0, "#c9d3e6"); g.addColorStop(0.55, "#dfe5f0"); g.addColorStop(1, "#b9c3d8");
  c.fillStyle = "#c9d3e6"; c.fillRect(0, 0, W, H);
  poly(c, [[-WX, CEIL, WZ], [WX, CEIL, WZ], [WX, FLOOR, WZ], [-WX, FLOOR, WZ]], g);
  /* دیوارهای کناری */
  [-1, 1].forEach(function (s) {
    var a = P(s * WX, CEIL, WZ), b = P(s * WX, CEIL, WZN), gg = c.createLinearGradient(a[0], 0, b[0], 0);
    gg.addColorStop(0, "#b7c2d9"); gg.addColorStop(1, "#8f9cba");
    poly(c, [[s * WX, CEIL, WZ], [s * WX, CEIL, WZN], [s * WX, FLOOR, WZN], [s * WX, FLOOR, WZ]], gg);
    /* پنجرهٔ بلند */
    for (var k = 0; k < 2; k++) {
      var z0 = -3.4 + k * 2.1, z1 = z0 + 1.3;
      poly(c, [[s * WX, 2.5, z0], [s * WX, 2.5, z1], [s * WX, 1.1, z1], [s * WX, 1.1, z0]], "#9fd0f0", "#6b7a99", 2);
      line(c, [s * WX, 1.8, z0], [s * WX, 1.8, z1], "#6b7a99", 1.5);
      line(c, [s * WX, 2.5, (z0 + z1) / 2], [s * WX, 1.1, (z0 + z1) / 2], "#6b7a99", 1.5);
    }
  });
  /* نوار رنگی دیوار پشت */
  poly(c, [[-WX, 0.35, WZ], [WX, 0.35, WZ], [WX, 0.15, WZ], [-WX, 0.15, WZ]], "#1e2f66");
  poly(c, [[-WX, 0.15, WZ], [WX, 0.15, WZ], [WX, 0.1, WZ], [-WX, 0.1, WZ]], "#e0a63a");
  /* کف */
  var fl = c.createLinearGradient(0, P(0, FLOOR, WZ)[1], 0, H);
  fl.addColorStop(0, "#7a3428"); fl.addColorStop(1, "#a9493a");
  poly(c, [[-WX, FLOOR, WZ], [WX, FLOOR, WZ], [WX, FLOOR, WZN], [-WX, FLOOR, WZN]], fl);
  var lt = P(0, FLOOR, -0.4), rg = c.createRadialGradient(lt[0], lt[1], 10, lt[0], lt[1], W * 0.7);
  rg.addColorStop(0, "#ffffff22"); rg.addColorStop(1, "#ffffff00");
  poly(c, [[-WX, FLOOR, WZ], [WX, FLOOR, WZ], [WX, FLOOR, WZN], [-WX, FLOOR, WZN]], rg);
  /* لوگوی انجمن و ساعت */
  if (logoOk) { var a1 = P(-2.75, 2.2, WZ), b1 = P(-1.85, 1.3, WZ), sz = Math.min(b1[0] - a1[0], b1[1] - a1[1]); c.drawImage(logo, a1[0], a1[1], sz, sz); }
  var ck = P(2.3, 1.75, WZ), cr = 0.36 * ck[2];
  c.beginPath(); c.arc(ck[0], ck[1], cr, 0, 7); c.fillStyle = "#fff"; c.fill(); c.lineWidth = Math.max(1, cr * 0.12); c.strokeStyle = "#1e2f66"; c.stroke();
  /* حصارهای دور زمین */
  var BZ = -3.05, BX = 2.7, BH = FLOOR + 0.7;
  poly(c, [[-BX, BH, BZ], [BX, BH, BZ], [BX, FLOOR, BZ], [-BX, FLOOR, BZ]], "#1e2f66", "#0f1a40", 1);
  var bt = P(0, FLOOR + 0.35, BZ), bs = bt[2];
  c.fillStyle = "#ffd77a"; c.font = "800 " + Math.max(7, 0.22 * bs) + "px Vazirmatn,Tahoma,sans-serif"; c.textAlign = "center"; c.textBaseline = "middle";
  c.font = "800 " + Math.max(6, 0.16 * bs) + "px Vazirmatn,Tahoma,sans-serif";
  c.fillText("ANJOMAN", bt[0] - 1.3 * bs, bt[1]);
  c.fillText("SUNDBYBERG", bt[0] + 1.3 * bs, bt[1]);
  [-1, 1].forEach(function (s) {
    poly(c, [[s * BX, BH, BZ], [s * BX, BH, 0.6], [s * BX, FLOOR, 0.6], [s * BX, FLOOR, BZ]], s < 0 ? "#22377a" : "#1a2c63", "#0f1a40", 1);
  });
  /* ساک ورزشی، کفش‌ها و سبد راکت و توپ */
  drawBag(c, -2.2, -2.6); drawShoes(c, -2.25, -2.05); drawBasket(c, 2.25, -2.5);
  /* میز */
  drawTable(c);
}
function drawBag(c, x, z) {
  var L = 0.65, Hh = 0.32, D = 0.3, y0 = FLOOR;
  var sh = P(x, y0, z), s = sh[2];
  c.fillStyle = "#0004"; c.beginPath(); c.ellipse(sh[0], sh[1], L * 0.6 * s, 0.12 * s, 0, 0, 7); c.fill();
  poly(c, [[x - L / 2, y0, z + D / 2], [x + L / 2, y0, z + D / 2], [x + L / 2, y0 + Hh * 0.8, z + D / 2], [x + L * 0.38, y0 + Hh, z + D / 2], [x - L * 0.38, y0 + Hh, z + D / 2], [x - L / 2, y0 + Hh * 0.8, z + D / 2]], "#1f4fb3", "#123070", 1.2);
  poly(c, [[x - L * 0.38, y0 + Hh, z + D / 2], [x + L * 0.38, y0 + Hh, z + D / 2], [x + L * 0.38, y0 + Hh, z - D / 2], [x - L * 0.38, y0 + Hh, z - D / 2]], "#2a63d6", "#123070", 1);
  line(c, [x - L / 2, y0 + 0.12, z + D / 2 + 0.002], [x + L / 2, y0 + 0.12, z + D / 2 + 0.002], "#ffc83d", Math.max(1, 0.03 * s));
  line(c, [x - L * 0.36, y0 + Hh - 0.03, z + D / 2 + 0.003], [x + L * 0.36, y0 + Hh - 0.03, z + D / 2 + 0.003], "#0d1d4a", Math.max(1, 0.012 * s));
  var h1 = P(x - 0.16, y0 + Hh, z), h2 = P(x + 0.16, y0 + Hh, z), hh = P(x, y0 + Hh + 0.16, z);
  c.beginPath(); c.moveTo(h1[0], h1[1]); c.quadraticCurveTo(hh[0], hh[1] - (h1[1] - hh[1]) * 0.6, h2[0], h2[1]); c.strokeStyle = "#0d1d4a"; c.lineWidth = Math.max(1.5, 0.035 * s); c.stroke();
  var lb = P(x + 0.12, y0 + 0.2, z + D / 2 + 0.004); c.fillStyle = "#fff"; c.font = "800 " + Math.max(5, 0.07 * s) + "px Tahoma,sans-serif"; c.textAlign = "center"; c.fillText("SPORT", lb[0], lb[1]);
}
function drawShoe(c, x, z, flip) {
  var y0 = FLOOR, s = P(x, y0, z)[2], L = 0.3 * flip;
  poly(c, [[x - L / 2, y0, z], [x + L / 2, y0, z], [x + L / 2, y0 + 0.03, z], [x - L / 2, y0 + 0.03, z]], "#f4f4f4", "#999", 1);
  poly(c, [[x - L / 2, y0 + 0.03, z], [x + L * 0.42, y0 + 0.03, z], [x + L * 0.2, y0 + 0.08, z], [x - L * 0.15, y0 + 0.12, z], [x - L / 2, y0 + 0.11, z]], "#e2572b", "#8a2c12", 1);
  line(c, [x - L * 0.12, y0 + 0.11, z + 0.001], [x + L * 0.15, y0 + 0.07, z + 0.001], "#fff", Math.max(1, 0.012 * s));
  var sh = P(x, y0, z); c.fillStyle = "#0003"; c.beginPath(); c.ellipse(sh[0], sh[1] + 1, Math.abs(L) * 0.55 * s, 0.03 * s, 0, 0, 7); c.fill();
}
function drawShoes(c, x, z) { drawShoe(c, x, z - 0.06, 1); drawShoe(c, x + 0.04, z + 0.08, 1); }
function drawBasket(c, x, z) {
  var y0 = FLOOR, R = 0.26, Hh = 0.34, p0 = P(x, y0, z), s = p0[2];
  c.fillStyle = "#0004"; c.beginPath(); c.ellipse(p0[0], p0[1], R * 1.2 * s, 0.09 * s, 0, 0, 7); c.fill();
  /* راکت‌ها */
  [[-0.11, 0.25, "#c62828"], [0.02, 0.32, "#222"], [0.13, 0.27, "#c62828"]].forEach(function (q, i) {
    var hb = P(x + q[0], y0 + Hh + 0.02, z), hd = P(x + q[0] * 1.35, y0 + Hh + q[1] - 0.09, z), bc = P(x + q[0] * 1.5, y0 + Hh + q[1], z);
    c.strokeStyle = "#a8743a"; c.lineWidth = Math.max(2, 0.04 * s); c.beginPath(); c.moveTo(hb[0], hb[1]); c.lineTo(hd[0], hd[1]); c.stroke();
    c.save(); c.translate(bc[0], bc[1]); c.rotate((i - 1) * 0.35); c.fillStyle = q[2]; c.beginPath(); c.ellipse(0, 0, 0.085 * s, 0.095 * s, 0, 0, 7); c.fill(); c.strokeStyle = "#111"; c.lineWidth = 1; c.stroke(); c.restore();
  });
  /* سبد حصیری */
  var tl = P(x - R, y0 + Hh, z), tr = P(x + R, y0 + Hh, z), bl = P(x - R * 0.8, y0, z), brr = P(x + R * 0.8, y0, z);
  c.beginPath(); c.moveTo(tl[0], tl[1]); c.lineTo(tr[0], tr[1]); c.lineTo(brr[0], brr[1]); c.lineTo(bl[0], bl[1]); c.closePath();
  var gw = c.createLinearGradient(0, tl[1], 0, bl[1]); gw.addColorStop(0, "#d9a55b"); gw.addColorStop(1, "#9c6b2e"); c.fillStyle = gw; c.fill();
  c.strokeStyle = "#7a5022"; c.lineWidth = 1; c.stroke();
  c.save(); c.clip(); c.strokeStyle = "#7a502288"; c.lineWidth = Math.max(1, 0.012 * s);
  for (var k = 1; k < 6; k++) { var yy = tl[1] + (bl[1] - tl[1]) * k / 6; c.beginPath(); c.moveTo(tl[0] - 5, yy); c.lineTo(tr[0] + 5, yy); c.stroke(); }
  for (k = -6; k <= 6; k++) { var xx = (tl[0] + tr[0]) / 2 + k * 0.045 * s; c.beginPath(); c.moveTo(xx, tl[1]); c.lineTo(xx + k * 0.6, bl[1]); c.stroke(); }
  c.restore();
  /* توپ‌ها */
  var e = P(x, y0 + Hh, z); c.fillStyle = "#6b4518"; c.beginPath(); c.ellipse(e[0], e[1], R * s, 0.06 * s, 0, 0, 7); c.fill();
  [[-0.12, 0.01, "#fff"], [-0.04, 0.03, "#ff9d2e"], [0.05, 0.015, "#fff"], [0.13, 0.025, "#ff9d2e"], [0.0, 0.055, "#fff"], [0.09, 0.06, "#fff"], [-0.09, 0.055, "#ff9d2e"]].forEach(function (q) {
    var b = P(x + q[0], y0 + Hh + q[1], z + 0.01), r = Math.max(1.5, 0.028 * b[2]);
    c.beginPath(); c.arc(b[0], b[1], r, 0, 7); c.fillStyle = q[2]; c.fill(); c.strokeStyle = "#0002"; c.lineWidth = 0.6; c.stroke();
  });
}
function drawTable(c) {
  var y = 0, th = 0.035, legC = "#1b1b1b";
  /* سایه زیر میز */
  poly(c, [[-TW - 0.1, FLOOR, -TL - 0.1], [TW + 0.1, FLOOR, -TL - 0.1], [TW + 0.1, FLOOR, TL + 0.1], [-TW - 0.1, FLOOR, TL + 0.1]], "#00000038");
  /* پایه‌ها */
  [[-TW + 0.15, -TL + 0.25], [TW - 0.15, -TL + 0.25], [-TW + 0.15, TL - 0.25], [TW - 0.15, TL - 0.25]].forEach(function (q) {
    var a = P(q[0], -th, q[1]), b = P(q[0], FLOOR, q[1]); c.strokeStyle = legC; c.lineWidth = Math.max(2, 0.05 * a[2]); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke();
  });
  line(c, [-TW + 0.15, -0.45, -TL + 0.25], [-TW + 0.15, -0.45, TL - 0.25], legC, 3);
  line(c, [TW - 0.15, -0.45, -TL + 0.25], [TW - 0.15, -0.45, TL - 0.25], legC, 3);
  /* لبهٔ جلو و کناره‌ها */
  poly(c, [[-TW, y, TL], [TW, y, TL], [TW, y - th, TL], [-TW, y - th, TL]], "#0f2f6e");
  poly(c, [[TW, y, -TL], [TW, y, TL], [TW, y - th, TL], [TW, y - th, -TL]], "#13377f");
  poly(c, [[-TW, y, -TL], [-TW, y, TL], [-TW, y - th, TL], [-TW, y - th, -TL]], "#13377f");
  /* سطح میز */
  var a = P(0, 0, -TL), b = P(0, 0, TL), gt = c.createLinearGradient(0, a[1], 0, b[1]);
  gt.addColorStop(0, "#1d4fae"); gt.addColorStop(1, "#2a67d4");
  poly(c, [[-TW, y, -TL], [TW, y, -TL], [TW, y, TL], [-TW, y, TL]], gt);
  var lw = function (z) { return Math.max(1, 0.02 * P(0, 0, z)[2]); };
  poly(c, [[-TW + 0.01, y, -TL + 0.01], [TW - 0.01, y, -TL + 0.01], [TW - 0.01, y, TL - 0.01], [-TW + 0.01, y, TL - 0.01]], null, "#fff", lw(0));
  line(c, [0, y, -TL + 0.01], [0, y, TL - 0.01], "#ffffffcc", lw(0) * 0.6);
}
function drawNet(c) {
  var top = NH, a = P(-NW, top, 0), b = P(NW, top, 0), d = P(NW, 0, 0), e = P(-NW, 0, 0);
  c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.lineTo(d[0], d[1]); c.lineTo(e[0], e[1]); c.closePath();
  c.fillStyle = "#0b123055"; c.fill();
  c.save(); c.clip(); c.strokeStyle = "#ffffff33"; c.lineWidth = 0.7;
  for (var i = 0; i <= 40; i++) { var xx = -NW + i * NW / 20, p = P(xx, top, 0), q = P(xx, 0, 0); c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(q[0], q[1]); c.stroke(); }
  for (i = 1; i < 6; i++) { var yy = top * i / 6, p2 = P(-NW, yy, 0), q2 = P(NW, yy, 0); c.beginPath(); c.moveTo(p2[0], p2[1]); c.lineTo(q2[0], q2[1]); c.stroke(); }
  c.restore();
  line(c, [-NW, top, 0], [NW, top, 0], "#f4f4f4", Math.max(1.5, 0.02 * a[2]));
  [-1, 1].forEach(function (s) { line(c, [s * NW, top + 0.01, 0], [s * NW, -0.03, 0], "#222", Math.max(2, 0.03 * a[2])); });
}

/* تابلوی دیجیتال روی دیوار */
function drawBoard(c, st) {
  var a = P(-1.65, 2.3, WZ + 0.02), b = P(1.65, 0.95, WZ + 0.02), x = a[0], y = a[1], w = b[0] - a[0], h = b[1] - a[1];
  c.save();
  c.fillStyle = "#0a0a0d"; c.strokeStyle = "#5a5f6e"; c.lineWidth = Math.max(1.5, w * 0.012);
  rr(c, x, y, w, h, w * 0.03); c.fill(); c.stroke();
  c.fillStyle = "#4a4f5c"; c.fillRect(x + w * 0.18, y - h * 0.18, w * 0.015, h * 0.18); c.fillRect(x + w * 0.8, y - h * 0.18, w * 0.015, h * 0.18);
  var pad = w * 0.045, rowH = (h - pad * 1.2) / 3.2, fs = rowH * 0.78;
  c.textBaseline = "middle";
  for (var i = 0; i < 2; i++) {
    var ry = y + pad * 0.7 + rowH * (i + 0.5);
    if (st.server === i && !st.over) { c.fillStyle = "#ffd23f"; c.shadowColor = "#ffd23f"; c.shadowBlur = fs * 0.4; c.beginPath(); c.arc(x + pad * 0.9, ry, fs * 0.16, 0, 7); c.fill(); c.shadowBlur = 0; }
    c.fillStyle = "#f2f2f2"; c.font = "700 " + fs * 0.82 + "px Vazirmatn,Tahoma,sans-serif"; c.textAlign = "left";
    c.direction = "ltr";
    var nm = String(st.names[i] || ""); if (nm.length > 12) nm = nm.slice(0, 11) + "…";
    c.fillText(nm, x + pad * 1.6, ry);
    c.font = "700 " + fs + "px 'Courier New',ui-monospace,monospace"; c.textAlign = "center";
    led(c, String(st.sets[i]), x + w * 0.69, ry, "#ffb02e", fs);
    led(c, String(st.pts[i]), x + w * 0.86, ry, "#ff3b2f", fs * 1.08);
  }
  c.strokeStyle = "#2a2d36"; c.lineWidth = 1; c.beginPath(); c.moveTo(x + pad, y + pad * 0.7 + rowH * 2.1); c.lineTo(x + w - pad, y + pad * 0.7 + rowH * 2.1); c.stroke();
  var sy = y + pad * 0.7 + rowH * 2.65;
  c.font = "700 " + fs * 0.7 + "px Vazirmatn,Tahoma,sans-serif"; c.textAlign = "center"; c.fillStyle = "#58e06f"; c.shadowColor = "#58e06f"; c.shadowBlur = fs * 0.3;
  c.direction = LANG === "fa" ? "rtl" : "ltr";
  c.fillText(t("setW") + " " + num(st.setNo) + " " + t("ofW") + " " + num(st.best), x + w / 2, sy);
  c.restore();
}
function led(c, s, x, y, col, fs) {
  c.font = "700 " + fs + "px 'Courier New',ui-monospace,monospace";
  c.fillStyle = col + "22"; c.fillText("88".slice(0, Math.max(1, s.length)), x, y);
  c.fillStyle = col; c.shadowColor = col; c.shadowBlur = fs * 0.35; c.fillText(s, x, y); c.shadowBlur = 0;
}
function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

function drawClockHands(c) {
  var ck = P(2.3, 1.75, WZ), cr = 0.36 * ck[2], d = new Date(), m = d.getMinutes(), hr = d.getHours() % 12 + m / 60;
  c.strokeStyle = "#1e2f66"; c.lineCap = "round";
  [[hr / 12, 0.5, 0.1], [m / 60, 0.78, 0.07]].forEach(function (q) { var an = q[0] * Math.PI * 2 - Math.PI / 2; c.lineWidth = Math.max(1, cr * q[2]); c.beginPath(); c.moveTo(ck[0], ck[1]); c.lineTo(ck[0] + Math.cos(an) * cr * q[1], ck[1] + Math.sin(an) * cr * q[1]); c.stroke(); });
  c.lineCap = "butt";
}

function drawRacket(c, x, y, z, col, alpha) {
  var p = P(x, y, z), s = p[2], r = 0.09 * s;
  var sh = P(x, Math.abs(x) <= TW && Math.abs(z) <= TL ? 0 : FLOOR, z);
  c.fillStyle = "#0000002a"; c.beginPath(); c.ellipse(sh[0], sh[1], r * 0.9, r * 0.25, 0, 0, 7); c.fill();
  c.save(); c.globalAlpha = alpha;
  c.fillStyle = "#b07a3c"; c.strokeStyle = "#6b4518"; c.lineWidth = Math.max(1, r * 0.06);
  rr(c, p[0] - r * 0.17, p[1] + r * 0.75, r * 0.34, r * 1.05, r * 0.12); c.fill(); c.stroke();
  c.beginPath(); c.ellipse(p[0], p[1], r * 1.02, r * 1.1, 0, 0, 7); c.fillStyle = "#e8d2a8"; c.fill();
  c.beginPath(); c.ellipse(p[0], p[1], r * 0.95, r * 1.03, 0, 0, 7); c.fillStyle = col; c.fill();
  var g = c.createRadialGradient(p[0] - r * 0.35, p[1] - r * 0.4, r * 0.1, p[0], p[1], r);
  g.addColorStop(0, "#ffffff33"); g.addColorStop(1, "#ffffff00"); c.fillStyle = g; c.fill();
  c.restore();
}

function drawBall(c, b, trail) {
  for (var i = 0; i < trail.length; i++) {
    var q = trail[i], tp = P(q[0], q[1], q[2]); c.fillStyle = "rgba(255,230,190," + (0.05 + 0.25 * i / trail.length) + ")";
    c.beginPath(); c.arc(tp[0], tp[1], Math.max(1.5, BR * tp[2] * 0.9), 0, 7); c.fill();
  }
  var over = Math.abs(b.x) <= TW && Math.abs(b.z) <= TL && b.y >= -0.01;
  var sh = P(b.x, over ? 0.001 : FLOOR, b.z);
  c.fillStyle = "#00000044"; c.beginPath(); c.ellipse(sh[0], sh[1], Math.max(2, BR * 1.4 * sh[2]), Math.max(1, BR * 0.5 * sh[2]), 0, 0, 7); c.fill();
  var p = P(b.x, b.y, b.z), r = Math.max(3.2, BR * 1.3 * p[2]);
  var g = c.createRadialGradient(p[0] - r * 0.35, p[1] - r * 0.35, r * 0.1, p[0], p[1], r);
  g.addColorStop(0, "#ffffff"); g.addColorStop(1, "#ffb347");
  c.fillStyle = g; c.beginPath(); c.arc(p[0], p[1], r, 0, 7); c.fill();
}

/* صحنهٔ کامل؛ VF=-1 یعنی دید از سمت دیگر میز (برای مهمان) */
function render(c, W, H, st, VF) {
  if (bgDirty || BG.width !== c.canvas.width) {
    BG.width = c.canvas.width; BG.height = c.canvas.height;
    var bc = BG.getContext("2d"); bc.setTransform(c.canvas.width / W, 0, 0, c.canvas.width / W, 0, 0); drawRoom(bc, W, H); bgDirty = false;
  }
  c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(BG, 0, 0);
  c.setTransform(c.canvas.width / W, 0, 0, c.canvas.width / W, 0, 0);
  drawClockHands(c);
  drawBoard(c, st);
  var b = st.b, bv = { x: b.x * VF, y: b.y, z: b.z * VF }, me = VF === 1 ? 0 : 1, op = 1 - me;
  var ro = st.rk[op], rm = st.rk[me];
  var tr = (st.trail || []).map(function (q) { return [q[0] * VF, q[1], q[2] * VF]; });
  drawRacket(c, ro.x * VF, ro.y, ro.z * VF, me === 0 ? "#1c1c1c" : "#c62828", 1);
  if (bv.z < 0) drawBall(c, bv, tr);
  drawNet(c);
  if (bv.z >= 0) drawBall(c, bv, tr);
  drawRacket(c, rm.x * VF, rm.y, rm.z * VF, me === 0 ? "#c62828" : "#1c1c1c", 0.88);
}

/* ---------------- رابط کاربری ---------------- */
var $app = $("app"), cv = null, ctx = null, CW = 0, CH = 0, raf = 0, last = 0, sendT = 0;
var keys = {}, msgEl = null, shotEl = null, shotT = 0;

function setLang(l) {
  LANG = l; store("lang", l);
  document.documentElement.lang = l; document.documentElement.dir = l === "fa" ? "rtl" : "ltr";
  $("ttl").textContent = t("title"); $("back").textContent = t("back"); $("lang").textContent = t("langBtn");
  document.title = t("title") + (l === "fa" ? " · انجمن ایرانیان سوندبی‌بری" : " · Iranska föreningen i Sundbyberg");
  bgDirty = true;
  if (G && cv) buildBar(); else if (!G) menu();
}
$("lang").onclick = function () { setLang(LANG === "fa" ? "sv" : "fa"); };

function myName() { var e = $("nm"), n = ((e && e.value) || store("pp-name") || "").trim().slice(0, 16); if (n) store("pp-name", n); return n || t("me"); }
function radio(name, items, cur) {
  return '<div class="opts">' + items.map(function (it) {
    return '<label><input type="radio" name="' + name + '" value="' + it[0] + '"' + (it[0] === cur ? " checked" : "") + '><span class="o">' + it[1] + (it[2] ? "<small>" + it[2] + "</small>" : "") + "</span></label>";
  }).join("") + "</div>";
}
function val(name) { var e = document.querySelector('input[name="' + name + '"]:checked'); return e ? e.value : null; }

function menu() {
  stopLoop(); G = null; MODE = null; cv = null;
  var lvl = store("pp-lvl") || "m", rk = store("pp-rk") || "all", ln = store("pp-len") || "3";
  $app.innerHTML = '<div class="panel">' +
    '<canvas class="hero" id="hero"></canvas>' +
    "<h2>" + t("title") + "</h2><p>" + t("intro") + "</p>" +
    '<label class="field"><span>' + t("name") + '</span><input id="nm" maxlength="16" value="' + esc(store("pp-name") || "") + '" placeholder="' + t("namePh") + '" autocomplete="nickname"></label>' +
    '<div class="field"><span>' + t("level") + "</span>" + radio("lvl", [["m", t("lvlM"), t("lvlMd")], ["h", t("lvlH"), t("lvlHd")]], lvl) + "</div>" +
    '<div class="field"><span>' + t("racket") + "</span>" + radio("rk", [["def", t("def"), t("defd")], ["all", t("all"), t("alld")], ["off", t("off"), t("offd")]], rk) + "</div>" +
    '<div class="field"><span>' + t("len") + "</span>" + radio("len", [["1", t("len1")], ["3", t("len3")], ["5", t("len5")]], ln) + "</div>" +
    '<button class="btn" id="solo">' + t("vsAI") + "</button>" +
    '<div class="row"><button class="btn alt" id="mk">' + t("mk") + '</button><button class="btn alt" id="jn">' + t("jn") + "</button></div>" +
    '<div id="jbox" hidden><label class="field"><span>' + t("code") + '</span><input id="jc" inputmode="numeric" maxlength="4" dir="ltr" placeholder="1234"></label><button class="btn" id="jgo">' + t("go") + "</button></div>" +
    '<details class="rules"><summary>' + t("rulesT") + "</summary><ul>" + t("rules").map(function (r) { return "<li>" + r + "</li>"; }).join("") + "</ul></details>" +
    "</div>";
  function saveOpts() { store("pp-lvl", val("lvl")); store("pp-rk", val("rk")); store("pp-len", val("len")); myName(); }
  $("solo").onclick = function () { saveOpts(); audio(); startAI(); };
  $("mk").onclick = function () { saveOpts(); audio(); host(); };
  $("jn").onclick = function () { $("jbox").hidden = false; $("jc").focus(); };
  $("jgo").onclick = function () { saveOpts(); audio(); join($("jc").value); };
  $("jc").onkeydown = function (e) { if (e.key === "Enter") $("jgo").click(); };
  var hc = $("hero"), w = Math.min(440, $app.clientWidth - 36), h = Math.round(w * 0.62), dpr = Math.min(2, window.devicePixelRatio || 1);
  hc.width = w * dpr; hc.height = h * dpr; hc.style.height = h + "px";
  var demo = { names: ["Alborz", "Arshad"], sets: [1, 1], pts: [3, 6], setNo: 3, best: 5, server: 0, over: false, b: { x: 0.25, y: 0.32, z: -0.5 }, rk: [{ x: 0.2, y: 0.25, z: 1.7 }, { x: -0.3, y: 0.3, z: -1.75 }], trail: [] };
  layout(w, h); bgDirty = true;
  var hx = hc.getContext("2d");
  var draw = function () { render(hx, w, h, demo, 1); bgDirty = true; };
  draw(); logo.addEventListener("load", draw, { once: true });
}

function startAI() {
  MODE = "ai"; ME = 0;
  var lvl = store("pp-lvl") || "m";
  newGame({ lvl: lvl, best: +(store("pp-len") || 3), names: [myName(), t("computer")], rts: [store("pp-rk") || "all", lvl === "h" ? (Math.random() < 0.5 ? "off" : "all") : "all"] });
  gameView();
}

function gameView() {
  $app.innerHTML = '<div class="game" id="gm"><canvas id="cv"></canvas><div class="shotlbl" id="shot"></div><div class="msg" id="msg"></div></div><div class="bar" id="bar"></div><p class="hint" id="hint"></p>';
  cv = $("cv"); ctx = cv.getContext("2d"); msgEl = $("msg"); shotEl = $("shot");
  buildBar(); resize(); bindInput(); startLoop();
}
function buildBar() {
  var bar = $("bar"); if (!bar || !G) return;
  var h = "";
  if (G.L.spin) h += '<div class="spin">' + ["flat", "top", "back", "side"].map(function (k, i) { return '<button type="button" data-s="' + k + '" class="' + (G.shot[ME] === k ? "on" : "") + '">' + t("shots")[k] + "<kbd>" + (i + 1) + "</kbd></button>"; }).join("") + "</div>";
  h += '<button type="button" id="snd">' + (muted ? t("sndOff") : t("sndOn")) + "</button>";
  if (MODE === "ai") h += '<button type="button" id="pz">' + (G.paused ? t("resume") : t("pause")) + "</button>";
  h += '<button type="button" id="ex">' + t("exit") + "</button>";
  bar.innerHTML = h;
  $("hint").textContent = t("hint") + (G.L.spin ? " " + t("hintH") : "") + "  ·  " + t("lvlTag")[G.lvl] + " · " + t(G.rts[ME]);
  bar.querySelectorAll("[data-s]").forEach(function (b) { b.onclick = function () { setShot(b.getAttribute("data-s")); }; });
  $("snd").onclick = function () { muted = !muted; store("pp-mute", muted ? "1" : "0"); audio(); buildBar(); };
  if ($("pz")) $("pz").onclick = function () { G.paused = !G.paused; buildBar(); };
  $("ex").onclick = leave;
}
function setShot(k) { if (!G) return; G.shot[ME] = k; var bar = $("bar"); if (bar) bar.querySelectorAll("[data-s]").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-s") === k); }); }
function showShot(shot, smash) {
  if (!shotEl) return;
  if (!smash && (!G.L.spin || shot === "flat")) return;
  shotEl.textContent = smash ? "SMASH!" : t("shots")[shot]; shotEl.classList.add("on"); shotT = 0.8;
}

function resize() {
  if (!cv) return;
  var W = cv.parentNode.clientWidth, vh = window.innerHeight, avail = vh - 150;
  var H = Math.round(Math.max(320, Math.min(W * 1.6, avail)));
  if (W > H * 1.25) H = Math.round(Math.min(Math.max(H, W * 0.6), avail > 380 ? avail : W * 0.7));
  layout(W, H); var need = Math.round((P(0, 0.02, 2.35)[1] - P(0, 2.2, -4.3)[1]) / 0.95);
  if (need < H) H = Math.max(300, need);
  var dpr = Math.min(2, window.devicePixelRatio || 1);
  cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); cv.style.height = H + "px";
  CW = W; CH = H; layout(W, H); bgDirty = true;
}
window.addEventListener("resize", function () { if (cv) resize(); });

function bindInput() {
  function mv(e) {
    if (!G) return;
    var rc = cv.getBoundingClientRect(), sx = (e.clientX - rc.left) * CW / rc.width, sy = (e.clientY - rc.top) * CH / rc.height;
    if (e.pointerType === "touch") sy -= 45;
    var w = unproj(sx, sy, 0.15); if (!w) return;
    var VF = ME === 0 ? 1 : -1, r = G.rk[ME];
    r.tx = clamp(w.x * VF, -1.3, 1.3); r.tz = ME === 0 ? clamp(w.z, 1.15, 2.4) : clamp(-w.z, -2.4, -1.15);
  }
  cv.addEventListener("pointermove", mv);
  cv.addEventListener("pointerdown", function (e) { audio(); if (AC && AC.state === "suspended") AC.resume(); mv(e); try { cv.setPointerCapture(e.pointerId); } catch (x) {} serveReq(); });
  document.onkeydown = function (e) {
    if (!G) return;
    if (e.target && e.target.tagName === "INPUT") return;
    keys[e.key] = true;
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); audio(); serveReq(); }
    var k = { "1": "flat", "2": "top", "3": "back", "4": "side" }[e.key];
    if (k && G.L.spin) setShot(k);
    if (/^Arrow/.test(e.key)) e.preventDefault();
  };
  document.onkeyup = function (e) { keys[e.key] = false; };
}
function serveReq() {
  if (!G || G.paused || G.st !== "serve" || G.server !== ME) return;
  if (MODE === "guest") { if (conn) conn.send({ t: "sv", shot: G.shot[ME], sw: swingOf(ME) }); }
  else doServe(ME);
}

/* ---------------- حلقهٔ اصلی ---------------- */
function startLoop() { stopLoop(); last = performance.now(); raf = requestAnimationFrame(frame); }
function stopLoop() { if (raf) cancelAnimationFrame(raf); raf = 0; }

function moveMine(dt) {
  var r = G.rk[ME], VF = ME === 0 ? 1 : -1, sp = 2.4 * dt;
  if (keys.ArrowLeft) r.tx = clamp(r.tx - sp * VF, -1.3, 1.3);
  if (keys.ArrowRight) r.tx = clamp(r.tx + sp * VF, -1.3, 1.3);
  if (keys.ArrowUp) r.tz = ME === 0 ? clamp(r.tz - sp, 1.15, 2.4) : clamp(r.tz + sp, -2.4, -1.15);
  if (keys.ArrowDown) r.tz = ME === 0 ? clamp(r.tz + sp, 1.15, 2.4) : clamp(r.tz - sp, -2.4, -1.15);
  follow(r, dt, 20);
}
function follow(r, dt, k) {
  var ox = r.x, oz = r.z, a = Math.min(1, dt * k);
  r.x += (r.tx - r.x) * a; r.z += (r.tz - r.z) * a;
  var vx = (r.x - ox) / Math.max(dt, 1e-3), vz = (r.z - oz) / Math.max(dt, 1e-3);
  r.vx += (vx - r.vx) * 0.35; r.vz += (vz - r.vz) * 0.35;
}
function racketHeight(p, dt) {
  var r = G.rk[p], b = G.b, ty = 0.2;
  if (G.st === "rally" && b.hitter !== p && Math.abs(b.z - r.z) < 0.8) ty = clamp(b.y, 0.05, 0.75);
  if (G.st === "serve" && G.server === p) ty = 0.2;
  r.y += (ty - r.y) * Math.min(1, dt * 14);
}

function simulate(dt) {
  G.clock += dt;
  moveMine(dt);
  if (MODE === "ai") aiThink(dt, dt * G.L.ts);
  else follow(G.rk[1], dt, 18);
  racketHeight(0, dt); racketHeight(1, dt);
  if (G.st === "serve") holdBall();
  else if (G.st === "rally") {
    var ds = dt * G.L.ts, n = Math.ceil(ds / (1 / 300)), h = ds / n;
    for (var i = 0; i < n && G.st === "rally"; i++) {
      var b = G.b; b.pz = b.z;
      phys(b, h, onEv);
      if (G.st === "rally") { if (!tryHit(0)) tryHit(1); }
    }
  } else if (G.st === "point") {
    G.tm -= dt;
    if (G.tm <= 0) {
      if (G.after === "end") { G.st = "over"; showEnd(); }
      else if (G.after === "newset") { G.pts = [0, 0]; G.setNo++; G.first = 1 - G.first; G.server = G.first; setupServe(); }
      else setupServe();
    }
  }
  trail();
}
function trail() {
  if (!G.trail) G.trail = [];
  if (G.st === "rally") { G.trail.push([G.b.x, G.b.y, G.b.z]); if (G.trail.length > 7) G.trail.shift(); }
  else G.trail.length = 0;
}

function frame(now) {
  raf = requestAnimationFrame(frame);
  var dt = Math.min(0.05, (now - last) / 1000); last = now;
  if (!G || !cv) return;
  if (!G.paused) {
    if (MODE === "guest") guestStep(dt); else simulate(dt);
    if (MODE === "host") { sendT += dt; if (sendT > 0.033) { sendT = 0; hostSend(); } }
    if (MODE === "guest") { sendT += dt; if (sendT > 0.033) { sendT = 0; guestSend(); } }
  }
  if (shotT > 0) { shotT -= dt; if (shotT <= 0) shotEl.classList.remove("on"); }
  updMsg();
  render(ctx, CW, CH, G, ME === 0 ? 1 : -1);
}

function msgHTML(m) {
  if (!m) return "";
  var nm = function (i) { return esc(G.names[i]); };
  if (m.k === "serve") return m.n === ME ? t("serveYou") + "<small>" + t("serveYouS") + "</small>" : tf("serveOpp", nm(m.n));
  if (m.k === "point") return tf("point", nm(m.n)) + "<small>" + t(m.why) + "</small>";
  if (m.k === "set") return tf("setWon", nm(m.n)) + "<small>" + t(m.why) + "</small>";
  if (m.k === "match") return tf("matchWon", nm(m.n));
  if (m.k === "let") return t("let");
  return "";
}
var lastMsgKey = "";
function updMsg() {
  if (!msgEl) return;
  var m = G.paused ? { k: "_p" } : G.msg, key = m ? JSON.stringify(m) + LANG : "";
  if (key !== lastMsgKey) { lastMsgKey = key; if (m) msgEl.innerHTML = m.k === "_p" ? t("paused") : msgHTML(m); msgEl.classList.toggle("on", !!m); }
}

function showEnd() {
  var gm = $("gm"); if (!gm || gm.querySelector(".end")) return;
  var won = G.winner === ME, d = document.createElement("div"); d.className = "end";
  var sc = G.sets[0] + " – " + G.sets[1];
  d.innerHTML = '<div class="panel"><h2>' + (won ? t("youWon") : t("youLost")) + '</h2><p>' + tf("matchWon", esc(G.names[G.winner])) + '</p><div class="big">' + esc(G.names[0]) + " " + sc + " " + esc(G.names[1]) + "</div>" +
    (MODE === "guest" ? "<p>" + t("waitHost") + "</p>" : '<button class="btn" id="again">' + t("again") + "</button>") +
    '<button class="btn ghost" id="tomenu">' + t("menu") + "</button></div>";
  gm.appendChild(d);
  if ($("again")) $("again").onclick = function () {
    if (MODE === "ai") startAI();
    else if (MODE === "host" && conn) { var o = { lvl: G.lvl, best: G.best, names: G.names, rts: G.rts }; newGame(o); conn.send({ t: "cfg", o: o, first: G.first }); d.remove(); buildBar(); }
  };
  $("tomenu").onclick = leave;
}

document.addEventListener("visibilitychange", function () { if (document.hidden && G && MODE === "ai" && G.st !== "over") { G.paused = true; buildBar(); } });

/* ---------------- آنلاین ---------------- */
function leave() {
  stopLoop();
  try { if (peer) peer.destroy(); } catch (e) {}
  peer = null; conn = null; G = null; MODE = null; menu();
}
function host() {
  if (!window.Peer) return toast(t("noPeer"));
  var code = String(Math.floor(1000 + Math.random() * 9000)), name = myName(), lvl = store("pp-lvl") || "m", best = +(store("pp-len") || 3), rk = store("pp-rk") || "all";
  MODE = "host"; ME = 0;
  $app.innerHTML = '<div class="panel"><h2>' + t("creating") + "</h2></div>";
  peer = new Peer(PFX + code);
  var opp = null;
  function lobby() {
    if (G) return;
    $app.innerHTML = '<div class="panel"><h2>' + t("roomT") + "</h2><p>" + t("roomP") + '</p><div class="code">' + code + "</div>" +
      "<p>" + (opp ? tf("oppIn", "<b>" + esc(opp.name) + "</b>") : t("waitOpp")) + "</p>" +
      "<p>" + t("lvlTag")[lvl] + " · " + t("len" + best) + "</p>" +
      '<button class="btn" id="go"' + (opp ? "" : " disabled") + ">" + t("start") + '</button><button class="btn ghost" id="cn">' + t("cancel") + "</button></div>";
    $("go").onclick = function () {
      if (!opp) return;
      var o = { lvl: lvl, best: best, names: [name, opp.name], rts: [rk, opp.rt] };
      newGame(o); conn.send({ t: "cfg", o: o, first: G.first }); gameView();
    };
    $("cn").onclick = leave;
  }
  peer.on("open", lobby);
  peer.on("error", function (e) {
    if (e && e.type === "unavailable-id") { try { peer.destroy(); } catch (x) {} return host(); }
    if (MODE === "host") toast(t("connFail"));
  });
  peer.on("connection", function (c) {
    c.on("open", function () {
      if (conn) { c.send({ t: "full" }); setTimeout(function () { c.close(); }, 300); return; }
      conn = c;
      c.on("data", function (d) {
        if (!d) return;
        if (d.t === "hi") { opp = { name: String(d.name || t("me")).slice(0, 16), rt: RT[d.rt] ? d.rt : "all" }; lobby(); }
        if (!G) return;
        if (d.t === "in") { var r = G.rk[1]; r.tx = clamp(+d.x || 0, -1.3, 1.3); r.tz = clamp(+d.z || -1.75, -2.4, -1.15); r.rvx = +d.vx || 0; r.rvz = +d.vz || 0; if (d.shot) G.shot[1] = d.shot; }
        if (d.t === "sv" && G.server === 1) { if (d.sw) G.rk[1].sw = { aim: clamp(+d.sw.aim || 0, -1, 1), pow: clamp(+d.sw.pow || 0.3, 0.15, 1) }; doServe(1, d.shot); }
      });
      c.on("close", function () { if (MODE === "host") { toast(t("lost")); leave(); } });
    });
  });
}
/* مهمان سرعت راکت خودش را می‌فرستد؛ میزبان برای قدرت ضربه از آن استفاده می‌کند */
var _swingOf = swingOf;
swingOf = function (p) {
  if (MODE === "host" && p === 1 && !G.rk[1].sw) { var r = G.rk[1]; return { aim: clamp((r.rvx || 0) / 2.2, -1, 1), pow: clamp(0.22 + (r.rvz || 0) / 2.4, 0.15, 1) }; }
  return _swingOf(p);
};
function hostSend() {
  if (!conn || !G) return;
  var b = G.b;
  conn.send({
    t: "s", b: [b.x, b.y, b.z, b.vx, b.vy, b.vz, b.top, b.sx], r0: [G.rk[0].x, G.rk[0].y, G.rk[0].z], y1: G.rk[1].y,
    st: G.st, sc: [G.pts[0], G.pts[1], G.sets[0], G.sets[1], G.setNo, G.server], m: G.msg, ev: G.ev.splice(0), ov: G.over ? G.winner : -1, ts: G.L.ts
  });
}

function join(code) {
  if (!window.Peer) return toast(t("noPeer"));
  code = String(code || "").replace(/[۰-۹]/g, function (d) { return FAD.indexOf(d); }).replace(/\D/g, "");
  if (code.length !== 4) return toast(t("code4"));
  var name = myName(), rk = store("pp-rk") || "all";
  MODE = "guest"; ME = 1;
  $app.innerHTML = '<div class="panel"><h2>' + t("joining") + '</h2><div class="code">' + code + "</div></div>";
  peer = new Peer();
  peer.on("open", function () {
    conn = peer.connect(PFX + code, { reliable: true });
    var opened = false, to = setTimeout(function () { if (!opened) { toast(t("noRoom")); leave(); } }, 12000);
    conn.on("open", function () {
      opened = true; clearTimeout(to); conn.send({ t: "hi", name: name, rt: rk });
      $app.innerHTML = '<div class="panel"><h2>' + t("roomT") + "</h2><p>" + t("joined") + '</p><button class="btn ghost" id="cn">' + t("cancel") + "</button></div>";
      $("cn").onclick = leave;
    });
    conn.on("data", function (d) {
      if (!d) return;
      if (d.t === "full") { toast(t("full")); leave(); return; }
      if (d.t === "cfg") { newGame(d.o); G.first = d.first; G.netS = null; if (!cv || !$("cv")) gameView(); else { var e = document.querySelector(".end"); if (e) e.remove(); buildBar(); } return; }
      if (d.t === "s" && G) guestRecv(d);
    });
    conn.on("close", function () { if (MODE === "guest") { toast(t("lost")); leave(); } });
  });
  peer.on("error", function (e) { if (MODE === "guest") { toast(e && e.type === "peer-unavailable" ? t("noRoom") : t("connFail")); leave(); } });
}
function guestRecv(d) {
  var b = G.b, q = d.b;
  b.x = q[0]; b.y = q[1]; b.z = q[2]; b.vx = q[3]; b.vy = q[4]; b.vz = q[5]; b.top = q[6]; b.sx = q[7];
  var r0 = G.rk[0]; r0.tx = d.r0[0]; r0.y = d.r0[1]; r0.tz = d.r0[2]; G.rk[1].y = d.y1;
  G.st = d.st === "over" ? "point" : d.st;
  G.pts = [d.sc[0], d.sc[1]]; G.sets = [d.sc[2], d.sc[3]]; G.setNo = d.sc[4]; G.server = d.sc[5];
  G.msg = d.m;
  (d.ev || []).forEach(function (e) { sfx(e); });
  if (d.ov >= 0 && !G.over) { G.over = true; G.winner = d.ov; }
  if (G.over && d.st === "over") showEnd();
}
function guestStep(dt) {
  G.clock += dt;
  moveMine(dt);
  follow(G.rk[0], dt, 16);
  if (G.st === "rally") {
    var b = G.b, ds = dt * G.L.ts;
    b.vy += (-GR - KM * b.top) * ds; b.vx += KS * b.sx * ds;
    b.x += b.vx * ds; b.y += b.vy * ds; b.z += b.vz * ds;
    if (b.y < BR && Math.abs(b.x) <= TW && Math.abs(b.z) <= TL && b.vy < 0) { b.y = BR; b.vy = -b.vy * 0.88; }
  }
  trail();
}
function guestSend() {
  if (!conn || !G) return;
  var r = G.rk[1];
  conn.send({ t: "in", x: r.tx, z: r.tz, vx: r.vx, vz: r.vz, shot: G.shot[1] });
}

/* ---------------- شروع ---------------- */
setLang(LANG);
})();
