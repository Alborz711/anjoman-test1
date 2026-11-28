/* پینگ‌پنگ انجمن ایرانیان سوندبی‌بری — نسخهٔ سه‌بعدی
   بازی با رایانه (چهار سطح)، تمرین با دستگاه توپ‌انداز، و بازی آنلاین دونفره (PeerJS)
   گرافیک: Three.js (lib/three.min.js) */
(function () {
"use strict";

/* ---------------- ابزار ---------------- */
var $ = function (id) { return document.getElementById(id); };
function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
function lerp(a, b, k) { return a + (b - a) * k; }
function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
var LANG = store("lang") === "sv" ? "sv" : "fa";
var FAD = "۰۱۲۳۴۵۶۷۸۹";
function num(n) { n = String(n); return LANG === "fa" ? n.replace(/\d/g, function (d) { return FAD[d]; }) : n; }

var S = {
fa: {
  title: "پینگ‌پنگ", back: "→ بازگشت به تارنمای انجمن", langBtn: "Svenska",
  intro: "پینگ‌پنگ در یک سالن مسابقهٔ واقعی: با رایانه در چهار سطح بازی کنید، با دستگاه توپ‌انداز تمرین کنید، یا آنلاین با یک هموند دیگر مسابقه بدهید.",
  name: "نام شما", namePh: "مثلاً: البرز",
  level: "سطح بازی",
  lv: { e: "آسان", m: "متوسط", h: "دشوار", p: "حرفه‌ای" },
  lvd: { e: "توپ آهسته، حریف آرام", m: "بی‌پیچ، ریتم معمولی", h: "تاپ، بک و ساید‌اسپین", p: "پیچ کامل، حریف بی‌رحم" },
  racket: "نوع راکت", def: "دفاعی", defd: "کنترل بیشتر، بک‌اسپین قوی", all: "همه‌جانبه", alld: "متعادل", off: "تهاجمی", offd: "ضربهٔ تند، تاپ‌اسپین قوی",
  len: "طول مسابقه", len1: "یک ست", len3: "بهترین ۳ ست", len5: "بهترین ۵ ست",
  vsAI: "مسابقه با رایانه", practice: "تمرین با دستگاه توپ‌انداز", mk: "ساختن اتاق آنلاین", jn: "پیوستن به اتاق", code: "کد اتاق", go: "پیوستن",
  rulesT: "راهنما و قوانین",
  rules: [
    "هر ست تا ۱۱ امتیاز است و برنده باید دست‌کم ۲ امتیاز جلو باشد.",
    "سرویس هر ۲ امتیاز عوض می‌شود؛ از ۱۰–۱۰ به بعد هر امتیاز.",
    "سرویس باید اول در زمین خودتان و بعد در زمین حریف بخورد. اگر سرویس به تور بخورد و درست بیفتد، تکرار می‌شود.",
    "راکت را با انگشت یا موس جابه‌جا کنید؛ وقتی توپ یک بار در زمین شما خورد و به راکت رسید، ضربه خودبه‌خود زده می‌شود.",
    "اگر لحظهٔ برخورد، راکت را رو به جلو بکشید ضربه تند و عمیق می‌شود؛ حرکت به چپ و راست جهت توپ را تعیین می‌کند. توپ بلند را با حرکت تند رو به جلو «اسمش» کنید.",
    "راکت دفاعی کنترل بیشتر و بک‌اسپین قوی‌تر دارد؛ راکت تهاجمی ضربه‌های تندتر و تاپ‌اسپین قوی‌تر، ولی خطای بیشتر.",
    "در سطح دشوار و حرفه‌ای توپ پیچ دارد: تاپ‌اسپین تند پایین می‌آید و جلو می‌جهد، بک‌اسپین آهسته و کوتاه می‌ماند، ساید‌اسپین به پهلو می‌پیچد. بک‌اسپین را با تاپ یا بک جواب دهید و تاپ‌اسپین را با تاپ؛ وگرنه توپ به تور می‌خورد یا بیرون می‌رود.",
    "بعد از رالی‌های طولانی یا اسمش برنده، بازپخش آهسته نشان داده می‌شود؛ با یک ضربه روی صفحه رد می‌شود.",
    "در حالت تمرین، دستگاه پشت سر هم توپ می‌اندازد. هر توپی که درست به زمین آن سو برگردانید یک ضربهٔ پیاپی حساب می‌شود.",
    "کلیدها: جهت‌ها برای حرکت راکت، ۱ تا ۴ برای نوع ضربه، فاصله برای سرویس."
  ],
  computer: "رایانه", me: "هموند", machine: "توپ‌انداز",
  serveYou: "سرویس با شماست", serveYouS: "روی میز بزنید یا کلید فاصله را بزنید", serveOpp: "سرویس با {n}",
  point: "امتیاز برای {n}", r_out: "توپ بیرون رفت", r_net: "توپ به تور خورد", r_own: "توپ در زمین خودی افتاد", r_miss: "توپ از دست رفت", r_double: "توپ دو بار در زمین خورد",
  let: "سرویس تکرار می‌شود (let)", setWon: "ست به {n} رسید", matchWon: "{n} برندهٔ مسابقه شد",
  setPt: "امتیاز ست", matchPt: "امتیاز مسابقه",
  youWon: "شما بردید!", youLost: "این بار حریف برد", again: "بازی دوباره", menu: "بازگشت به منو", waitHost: "منتظر میزبان برای بازی دوباره…",
  pause: "مکث", resume: "ادامه", exit: "خروج", sndOn: "صدا: روشن", sndOff: "صدا: خاموش", paused: "بازی متوقف شد",
  creating: "در حال ساختن اتاق…", roomT: "اتاق آنلاین", roomP: "این کد را به هموند خود بدهید تا با «پیوستن به اتاق» وارد شود:",
  waitOpp: "منتظر حریف…", oppIn: "{n} وارد اتاق شد", start: "شروع بازی", cancel: "لغو",
  joining: "در حال پیوستن…", joined: "به اتاق پیوستید. منتظر بمانید تا میزبان بازی را شروع کند.",
  noRoom: "اتاقی با این کد پیدا نشد.", connFail: "اتصال برقرار نشد.", lost: "ارتباط با حریف قطع شد.", noPeer: "بخش آنلاین بار نشد؛ اتصال اینترنت را بررسی کنید.",
  noGL: "مرورگر شما گرافیک سه‌بعدی (WebGL) را پشتیبانی نمی‌کند. لطفاً با Chrome یا Safari تازه امتحان کنید.",
  code4: "کد چهاررقمی اتاق را بنویسید.", full: "این اتاق پر است.",
  hint: "راکت را با انگشت یا موس حرکت دهید. لحظهٔ ضربه راکت را رو به جلو بکشید تا ضربه تندتر شود.",
  hintH: "نوع ضربه را با دکمه‌ها یا کلیدهای ۱ تا ۴ انتخاب کنید.",
  hintP: "توپ‌ها را به زمین آن سوی میز برگردانید. نوع توپ دستگاه را از دکمه‌ها انتخاب کنید.",
  shots: { flat: "تخت", top: "تاپ‌اسپین", back: "بک‌اسپین", side: "ساید‌اسپین" },
  feed: { mix: "ترکیبی", flat: "تخت", top: "تاپ", back: "بک", side: "ساید" },
  setW: "ست", ofW: "از", rally: "رالی", streak: "ضربهٔ پیاپی", best: "رکورد", good: "عالی!", miss: "از دست رفت",
  replay: "بازپخش", skip: "برای رد شدن، روی صفحه بزنید",
  statsT: "آمار مسابقه", sPts: "امتیازها", sLong: "طولانی‌ترین رالی", sFast: "سریع‌ترین ضربه", sSmash: "اسمش", sSrv: "امتیاز روی سرویس خود", sAce: "سرویس برنده", kmh: "km/h"
},
sv: {
  title: "Pingis", back: "← Tillbaka till föreningens webbplats", langBtn: "فارسی",
  intro: "Pingis i en riktig tävlingshall: spela mot datorn på fyra nivåer, träna med bollmaskin eller möt en annan medlem online.",
  name: "Ditt namn", namePh: "t.ex. Alborz",
  level: "Nivå",
  lv: { e: "Lätt", m: "Medel", h: "Svår", p: "Proffs" },
  lvd: { e: "Långsam boll, lugn motståndare", m: "Utan skruv, normalt tempo", h: "Top-, back- och sidospinn", p: "Full skruv, obarmhärtig" },
  racket: "Racket", def: "Defensiv", defd: "Mer kontroll, stark backspin", all: "Allround", alld: "Balanserad", off: "Offensiv", offd: "Snabba slag, stark topspin",
  len: "Matchlängd", len1: "Ett set", len3: "Bäst av 3", len5: "Bäst av 5",
  vsAI: "Match mot datorn", practice: "Träna med bollmaskin", mk: "Skapa onlinerum", jn: "Gå med i rum", code: "Rumskod", go: "Gå med",
  rulesT: "Regler och styrning",
  rules: [
    "Ett set spelas till 11 poäng och man måste vinna med minst 2.",
    "Serven byts varannan poäng; från 10–10 varje poäng.",
    "Serven ska studsa först på egen planhalva och sedan hos motståndaren. Tar serven i nätet men landar rätt blir det omserv.",
    "Flytta racketen med fingret eller musen; när bollen har studsat en gång hos dig och når racketen slås den automatiskt.",
    "Dra racketen framåt vid träffen för ett snabbare och djupare slag; sidledsrörelse styr riktningen. Smasha höga bollar med en snabb rörelse framåt.",
    "Defensiv racket ger mer kontroll och starkare backspin; offensiv racket ger snabbare slag och starkare topspin men fler misstag.",
    "På Svår och Proffs har bollen skruv: topspin dyker och studsar framåt, backspin blir långsam och kort, sidospinn skruvar i sidled. Svara på backspin med top eller back och på topspin med topspin – annars hamnar bollen i nätet eller utanför.",
    "Efter långa bollar eller vinnande smashar visas en repris i slow motion; tryck på skärmen för att hoppa över.",
    "I träningsläget matar maskinen bollar i följd. Varje boll du slår tillbaka rätt räknas i din svit.",
    "Tangenter: piltangenterna flyttar racketen, 1–4 väljer slag, mellanslag för serve."
  ],
  computer: "Datorn", me: "Medlem", machine: "Bollmaskin",
  serveYou: "Din serve", serveYouS: "Tryck på bordet eller mellanslag", serveOpp: "{n} servar",
  point: "Poäng till {n}", r_out: "Bollen gick ut", r_net: "Bollen tog i nätet", r_own: "Bollen studsade på egen planhalva", r_miss: "Missad boll", r_double: "Bollen studsade två gånger",
  let: "Omserv (let)", setWon: "Setet till {n}", matchWon: "{n} vann matchen",
  setPt: "Setboll", matchPt: "Matchboll",
  youWon: "Du vann!", youLost: "Motståndaren vann den här gången", again: "Spela igen", menu: "Till menyn", waitHost: "Väntar på att värden startar igen…",
  pause: "Paus", resume: "Fortsätt", exit: "Avsluta", sndOn: "Ljud: på", sndOff: "Ljud: av", paused: "Pausad",
  creating: "Skapar rum…", roomT: "Onlinerum", roomP: "Ge den här koden till din motspelare så att hen kan gå med via ”Gå med i rum”:",
  waitOpp: "Väntar på motspelare…", oppIn: "{n} har anslutit", start: "Starta matchen", cancel: "Avbryt",
  joining: "Ansluter…", joined: "Du är med i rummet. Vänta tills värden startar matchen.",
  noRoom: "Hittade inget rum med den koden.", connFail: "Anslutningen misslyckades.", lost: "Anslutningen till motspelaren bröts.", noPeer: "Onlinedelen kunde inte laddas; kontrollera internet.",
  noGL: "Din webbläsare stöder inte 3D-grafik (WebGL). Prova en uppdaterad Chrome eller Safari.",
  code4: "Skriv den fyrsiffriga rumskoden.", full: "Rummet är fullt.",
  hint: "Flytta racketen med fingret eller musen. Dra racketen framåt vid träffen för ett hårdare slag.",
  hintH: "Välj slag med knapparna eller tangenterna 1–4.",
  hintP: "Slå tillbaka bollarna till andra planhalvan. Välj maskinens boll med knapparna.",
  shots: { flat: "Platt", top: "Topspin", back: "Backspin", side: "Sidospinn" },
  feed: { mix: "Blandat", flat: "Platt", top: "Top", back: "Back", side: "Sido" },
  setW: "Set", ofW: "av", rally: "Rally", streak: "Svit", best: "Rekord", good: "Snyggt!", miss: "Miss",
  replay: "Repris", skip: "Tryck på skärmen för att hoppa över",
  statsT: "Matchstatistik", sPts: "Poäng", sLong: "Längsta rally", sFast: "Snabbaste slag", sSmash: "Smashar", sSrv: "Poäng på egen serve", sAce: "Serveess", kmh: "km/h"
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
  e: { ts: 0.48, spin: false, reach: 1.32, aiSpd: 1.3, aiReact: 0.32, aiErr: 0.24, aiNoise: 0.15, aiPow: [0.15, 0.3] },
  m: { ts: 0.55, spin: false, reach: 1.18, aiSpd: 1.7, aiReact: 0.24, aiErr: 0.13, aiNoise: 0.1, aiPow: [0.25, 0.4] },
  h: { ts: 0.7, spin: true, reach: 1, aiSpd: 2.6, aiReact: 0.1, aiErr: 0.05, aiNoise: 0.035, aiPow: [0.5, 0.5] },
  p: { ts: 0.78, spin: true, reach: 0.95, aiSpd: 3.3, aiReact: 0.06, aiErr: 0.022, aiNoise: 0.022, aiPow: [0.62, 0.38] }
};

function mkBall() { return { x: 0, y: 0.3, z: 1.6, vx: 0, vy: 0, vz: 0, pz: 1.6, top: 0, sx: 0, hitter: 0, landed: false, net: false, serve: 0, next: null, n: 0 }; }
function mkR(p) { var s = p === 0 ? 1 : -1; return { x: 0, y: 0.2, z: s * 1.75, tx: 0, tz: s * 1.75, vx: 0, vz: 0, sw: null, swing: 0 }; }

function phys(b, dt, cb) {
  var pz = b.z, py = b.y;
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
  var ax = KS * b.sx, ay = -GR - KM * b.top, vx, vy, vz;
  for (var i = 0; i < 30; i++) {
    vx = (xt - b.x - 0.5 * ax * tt * tt) / tt; vz = (zt - b.z) / tt; vy = (BR - b.y - 0.5 * ay * tt * tt) / tt;
    if (clear && b.z * zt < 0) {
      var tn = -b.z / vz, yn = b.y + vy * tn + 0.5 * ay * tn * tn;
      if (yn < NH + BR + 0.03) { tt *= 1.07; continue; }
    }
    break;
  }
  b.vx = vx; b.vy = vy; b.vz = vz;
}

/* ---------------- وضعیت بازی ---------------- */
var G = null, ME = 0, MODE = null; // MODE: ai | practice | host | guest
var peer = null, conn = null, PFX = "anjoman-pingpong-";

function newStats() { return { pts: [0, 0], long: 0, fast: [0, 0], smash: [0, 0], srv: [0, 0], ace: [0, 0] }; }
function newGame(o) {
  G = {
    lvl: o.lvl, L: LV[o.lvl] || LV.m, best: o.best, names: o.names, rts: o.rts,
    sets: [0, 0], pts: [0, 0], setNo: 1, first: Math.random() < 0.5 ? 0 : 1, server: 0,
    rk: [mkR(0), mkR(1)], b: mkBall(), st: "serve", tm: 0, ev: [], shot: ["flat", "flat"],
    over: false, winner: -1, msg: null, paused: false, ai: { d: 0, pred: null, pn: -1, noise: 0, fe: 0, sv: 0 }, clock: 0,
    stats: newStats(), rally: 0, spd: 0, lastHitter: -1, lastSmash: false, rec: [], recT: 0, recMore: 0, rp0: null, rp: null,
    practice: !!o.practice, streak: 0, bestStreak: +(store("pp-streak") || 0), hits: 0, shake: 0, cheer: 0
  };
  G.server = G.first;
  if (G.practice) { G.server = 1; G.st = "point"; G.tm = 1; G.after = "feed"; G.b.y = -5; }
  else setupServe();
}

function say(m) { G.msg = m; G.msgT = Date.now(); }
function ev(e) { G.ev.push(e); sfx(e); vfx(e); }

function setupServe() {
  G.st = "serve"; G.ai.sv = 0; G.rally = 0; G.rec = []; G.recT = 0; G.lastSmash = false;
  var b = G.b; b.top = 0; b.sx = 0; b.vx = b.vy = b.vz = 0; b.next = null; b.serve = 0; b.landed = false; b.net = false;
  holdBall();
  say({ k: "serve", n: G.server, sp: specialPoint() });
}
function specialPoint() {
  if (G.practice) return "";
  for (var p = 0; p < 2; p++) {
    var a = G.pts[p], o = G.pts[1 - p];
    if (a >= 10 && a > o) return G.sets[p] + 1 > G.best / 2 ? "matchPt" : "setPt";
  }
  return "";
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
  if (MODE === "host" && p === 1) return { aim: clamp((r.rvx || 0) / 2.2, -1, 1), pow: clamp(0.22 + (r.rvz || 0) / 2.4, 0.15, 1) };
  var fwd = p === 0 ? -r.vz : r.vz;
  return { aim: clamp(r.vx / 2.2, -1, 1), pow: clamp(0.22 + fwd / 2.4, 0.15, 1) };
}
function speedNow() { var b = G.b; return Math.hypot(b.vx, b.vy, b.vz) * 3.6; }

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
  G.st = "rally"; G.msg = null; G.rally = 0; G.lastHitter = p; G.lastSmash = false; G.spd = b.next.v * 3.6;
  r.swing = 1;
  ev("hit");
  if (p === ME) showShot(shot, false);
}

function onEv(e, s) {
  var b = G.b; if (G.st !== "rally") return;
  if (G.practice) return onPracticeEv(e, s);
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
  var st = G.stats; st.pts[w]++; if (G.rally > st.long) st.long = G.rally;
  if (w === G.server) { st.srv[w]++; if (G.rally === 0) st.ace[w]++; }
  crowd(Math.min(1, 0.35 + G.rally * 0.06 + (G.lastSmash ? 0.3 : 0)));
  G.cheer = 1.6;
  if (MODE === "ai" && G.rec.length > 40 && (G.rally >= 6 || (G.lastSmash && w === G.lastHitter))) G.rp0 = true;
  G.recMore = 0.6;
  var a = G.pts[w], o = G.pts[1 - w];
  G.st = "point"; G.tm = 1.5; G.after = "serve";
  if (a >= 11 && a - o >= 2) {
    G.sets[w]++;
    if (G.sets[w] > G.best / 2) { G.over = true; G.winner = w; G.tm = 2; G.after = "end"; say({ k: "match", n: w }); crowd(1); return; }
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
  if (G.practice && p === 1) return false;
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
  G.rally++; G.lastHitter = p; G.lastSmash = smash; G.spd = speedNow();
  if (G.spd > G.stats.fast[p]) G.stats.fast[p] = G.spd;
  if (smash) { G.stats.smash[p]++; G.shake = 1; }
  G.rk[p].swing = smash ? 1.4 : 1;
  ev(smash ? "smash" : "hit");
  if (p === ME) { showShot(shot, smash); try { if (navigator.vibrate) navigator.vibrate(smash ? 25 : 10); } catch (x) {} }
}

/* ---------------- تمرین با دستگاه توپ‌انداز ---------------- */
var feedType = store("pp-feed") || "mix";
function feedBall() {
  var b = G.b, L = G.L, kind = L.spin ? feedType : "flat";
  if (kind === "mix") kind = ["flat", "top", "back", "side", "top"][Math.floor(Math.random() * 5)];
  b.x = (Math.random() - 0.5) * 0.3; b.y = 0.28; b.z = -TL - 0.12; b.pz = b.z;
  var sp = spinOf(kind, RT.all, Math.random() - 0.5); b.top = sp[0] * 0.9; b.sx = sp[1] * 0.9;
  var xt = (Math.random() - 0.5) * 1.1, zt = 0.45 + Math.random() * 0.75, v = (4.4 + Math.random() * 2.4) * (kind === "back" ? 0.85 : 1) * (G.lvl === "p" ? 1.15 : G.lvl === "e" ? 0.85 : 1);
  plan(b, xt, zt, Math.hypot(xt - b.x, zt - b.z) / v, true);
  b.hitter = 1; b.landed = false; b.net = false; b.serve = 0; b.next = null; b.n++;
  G.st = "rally"; G.msg = null; G.rally = 0; G.spd = speedNow(); G.feedKind = kind;
  ev("feed");
}
function onPracticeEv(e, s) {
  var b = G.b;
  if (e === "net") { if (!b.net) ev("net"); b.net = true; return; }
  if (e === "bounce") {
    ev("bounce");
    if (b.hitter === 1) { if (s !== 0) return; if (b.landed) return practiceEnd(false); b.landed = true; return; }
    if (s === 0) return practiceEnd(false);
    return practiceEnd(true);
  }
  if (e === "floor") {
    if (b.hitter === 1 && !b.landed) { G.st = "point"; G.tm = 0.5; G.after = "feed"; return; }
    practiceEnd(false);
  }
}
function practiceEnd(ok) {
  G.st = "point"; G.after = "feed"; G.tm = ok ? 0.45 : 0.9;
  if (ok) {
    G.streak++; G.hits++;
    if (G.streak > G.bestStreak) { G.bestStreak = G.streak; store("pp-streak", String(G.bestStreak)); }
    if (G.streak % 10 === 0) { crowd(0.8); G.cheer = 1.4; }
    say({ k: "good" });
  } else {
    if (G.streak >= 5) crowd(0.4);
    G.streak = 0; say({ k: "pmiss" }); sfx("miss");
  }
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
  var b = G.b, hard = G.L.spin, r = G.rk[1], P = G.L.aiPow;
  var tx = (Math.random() < 0.5 ? -1 : 1) * (hard ? 0.35 + Math.random() * 0.3 : Math.random() * 0.45);
  var s = { aim: clamp(tx / 0.62, -1, 1), pow: P[0] + Math.random() * P[1] };
  var shot = "flat";
  if (hard) {
    var q = Math.random();
    if (b.y > 0.42 && q < (G.lvl === "p" ? 0.9 : 0.8)) { shot = "flat"; s.pow = 1; }
    else if (b.top < -0.25) shot = q < 0.6 ? "top" : q < 0.92 ? "back" : "flat";
    else if (b.top > 0.25) shot = q < 0.8 ? "top" : q < 0.9 ? "side" : "back";
    else shot = q < 0.45 ? "top" : q < 0.65 ? "side" : q < 0.85 ? "back" : "flat";
  }
  G.shot[1] = shot; r.sw = s;
}
function aiServe() {
  var hard = G.L.spin, q = Math.random();
  G.shot[1] = hard ? (q < 0.35 ? "back" : q < 0.6 ? "side" : q < 0.85 ? "top" : "flat") : "flat";
  G.rk[1].sw = { aim: (Math.random() - 0.5) * 1.6, pow: G.L.aiPow[0] * 0.6 + Math.random() * 0.5 };
}

/* ---------------- صدا ---------------- */
var AC = null, muted = store("pp-mute") === "1", NB = null, CROWD = null;
function audio() { if (AC) return AC; try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { AC = null; } return AC; }
function tone(f, t0, dur, vol, type) { var a = AC, o = a.createOscillator(), g = a.createGain(); o.type = type || "sine"; o.frequency.value = f; g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur); o.connect(g).connect(a.destination); o.start(t0); o.stop(t0 + dur + 0.05); }
function sfx(k) {
  if (muted || !AC) return;
  var a = AC, t0 = a.currentTime;
  if (k === "point") { tone(660, t0, 0.25, 0.12); tone(990, t0 + 0.12, 0.3, 0.12); return; }
  if (k === "miss") { tone(300, t0, 0.2, 0.08, "triangle"); tone(220, t0 + 0.1, 0.25, 0.08, "triangle"); return; }
  if (!NB) { NB = a.createBuffer(1, a.sampleRate * 0.08, a.sampleRate); var d = NB.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3); }
  var src = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
  src.buffer = NB; f.type = "bandpass";
  var P = { hit: [1500, 0.9, 6], smash: [1100, 1.4, 3], feed: [700, 0.5, 2], bounce: [3400, 0.55, 9], net: [420, 0.5, 2] }[k]; if (!P) return;
  f.frequency.value = P[0]; f.Q.value = P[2]; g.gain.value = P[1];
  src.connect(f).connect(g).connect(a.destination); src.start(t0);
  if (k === "bounce" || k === "hit" || k === "smash") { var o = a.createOscillator(), og = a.createGain(); o.frequency.value = k === "bounce" ? 1900 : k === "smash" ? 600 : 900; og.gain.setValueAtTime(k === "smash" ? 0.22 : 0.12, t0); og.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.06); o.connect(og).connect(a.destination); o.start(t0); o.stop(t0 + 0.08); }
}
/* تشویق تماشاگران: صدها کف کوتاه روی هم */
function crowd(vol) {
  if (muted || !AC) return;
  var a = AC;
  if (!CROWD) {
    var len = a.sampleRate * 2.4; CROWD = a.createBuffer(2, len, a.sampleRate);
    for (var ch = 0; ch < 2; ch++) {
      var d = CROWD.getChannelData(ch);
      for (var k = 0; k < 420; k++) {
        var st = Math.floor(Math.pow(Math.random(), 1.6) * (len - 2000)), amp = 0.25 + Math.random() * 0.6, cl = 250 + Math.random() * 500;
        for (var i = 0; i < cl; i++) d[st + i] += (Math.random() * 2 - 1) * amp * Math.pow(1 - i / cl, 4);
      }
      for (i = 0; i < len; i++) d[i] *= Math.min(1, i / 2000) * Math.pow(1 - i / len, 1.4) * 0.5;
    }
  }
  var s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
  s.buffer = CROWD; f.type = "bandpass"; f.frequency.value = 1900; f.Q.value = 0.6; g.gain.value = 0.18 + 0.4 * vol;
  s.connect(f).connect(g).connect(a.destination); s.start(a.currentTime + 0.05);
}

/* ---------------- گرافیک سه‌بعدی ---------------- */
var GL = null, THREE = window.THREE;
var logo = new Image(), logoOk = false;
logo.onload = function () { logoOk = true; if (GL) refreshTextures(); };
logo.src = "../tasvir/logo.webp";

function cTex(w, h, fn, rep) {
  var c = document.createElement("canvas"); c.width = w; c.height = h; fn(c.getContext("2d"), w, h);
  var tx = new THREE.CanvasTexture(c); tx.encoding = THREE.sRGBEncoding; tx.anisotropy = GL ? GL.aniso : 4;
  if (rep) { tx.wrapS = tx.wrapT = THREE.RepeatWrapping; tx.repeat.set(rep[0], rep[1]); }
  tx.userData = { draw: fn, canvas: c };
  return tx;
}
function redraw(tx) { var c = tx.userData.canvas, x = c.getContext("2d"); x.clearRect(0, 0, c.width, c.height); tx.userData.draw(x, c.width, c.height); tx.needsUpdate = true; }
function std(col, o) { var m = new THREE.MeshStandardMaterial({ color: col, roughness: 0.6, metalness: 0 }); if (o) for (var k in o) { if (k === "emissive") m.emissive.setHex(o[k]); else m[k] = o[k]; } return m; }
function mesh(geo, mat, x, y, z, cast, recv) { var m = new THREE.Mesh(geo, mat); m.position.set(x || 0, y || 0, z || 0); m.castShadow = !!cast; m.receiveShadow = !!recv; return m; }

function initGL() {
  if (GL) return true;
  if (!THREE) return false;
  var canvas = document.createElement("canvas"), r;
  canvas.className = "gl";
  try { r = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: "high-performance" }); } catch (e) { return false; }
  var mob = /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent);
  r.setPixelRatio(Math.min(mob ? 1.75 : 2, window.devicePixelRatio || 1));
  r.outputEncoding = THREE.sRGBEncoding; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 0.92;
  r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
  var scene = new THREE.Scene(); scene.background = new THREE.Color(0x06080f); scene.fog = new THREE.Fog(0x06080f, 9, 24);
  var cam = new THREE.PerspectiveCamera(45, 1, 0.05, 60);
  GL = { r: r, scene: scene, cam: cam, canvas: canvas, aniso: r.capabilities.getMaxAnisotropy(), o: {}, tex: [], look: new THREE.Vector3(), camPos: new THREE.Vector3(0, 1.3, 3.4), camLook: new THREE.Vector3(0, 0, -0.6), ray: new THREE.Raycaster(), tmpV: new THREE.Vector3(), plane: new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.15), hit: new THREE.Vector3(), W: 1, H: 1, t: 0 };
  buildArena();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refreshTextures);
  return true;
}
function refreshTextures() { if (!GL) return; GL.tex.forEach(redraw); GL.scoreKey = ""; }

function buildArena() {
  var sc = GL.scene, o = GL.o;
  /* نور */
  sc.add(new THREE.HemisphereLight(0xa8b8ff, 0x2a1410, 0.5));
  sc.add(new THREE.AmbientLight(0x3a4466, 0.35));
  var sp = new THREE.SpotLight(0xfff1dc, 1.9, 16, 0.62, 0.6, 1.1);
  sp.position.set(0.7, 4.8, 1.3); sp.target.position.set(0, 0, 0); sp.castShadow = true;
  sp.shadow.mapSize.set(1024, 1024); sp.shadow.bias = -0.0003; sp.shadow.camera.near = 2; sp.shadow.camera.far = 9;
  sc.add(sp, sp.target);
  var sp2 = new THREE.SpotLight(0xdfe7ff, 0.9, 16, 0.7, 0.7, 1.1); sp2.position.set(-1.3, 4.6, -1.8); sp2.target.position.set(0, 0, 0); sc.add(sp2, sp2.target);
  var rim = new THREE.DirectionalLight(0x6f86ff, 0.35); rim.position.set(-4, 3, -6); sc.add(rim);

  /* کف */
  var floorTex = cTex(512, 512, function (c, w, h) {
    c.fillStyle = "#7d2620"; c.fillRect(0, 0, w, h);
    for (var i = 0; i < 9000; i++) { c.fillStyle = Math.random() < 0.5 ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.06)"; c.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
    var g = c.createLinearGradient(0, 0, w, 0); g.addColorStop(0, "rgba(0,0,0,0.05)"); g.addColorStop(0.5, "rgba(255,255,255,0.03)"); g.addColorStop(1, "rgba(0,0,0,0.05)"); c.fillStyle = g; c.fillRect(0, 0, w, h);
  }, [3, 5]);
  var dark = mesh(new THREE.PlaneGeometry(50, 50), std(0x12141b, { roughness: 0.95 }), 0, FLOOR - 0.002, 0, false, true); dark.rotation.x = -Math.PI / 2; sc.add(dark);
  var court = mesh(new THREE.PlaneGeometry(6.4, 10.4), std(0xffffff, { map: floorTex, roughness: 0.62 }), 0, FLOOR, -0.6, false, true); court.rotation.x = -Math.PI / 2; sc.add(court);

  /* دیواره‌های دور زمین با نام انجمن */
  var bA = cTex(1024, 256, function (c, w, h) {
    var g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#1b3a8c"); g.addColorStop(1, "#0f2257"); c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.fillStyle = "#e0a63a"; c.fillRect(0, h - 22, w, 10);
    if (logoOk) c.drawImage(logo, 24, 28, 176, 176);
    c.fillStyle = "#ffffff"; c.font = "800 78px Vazirmatn, Tahoma, sans-serif"; c.textAlign = "left"; c.textBaseline = "middle"; c.direction = "ltr";
    c.fillText("ANJOMAN", 226, 92); c.fillStyle = "#ffd77a"; c.font = "700 50px Vazirmatn, Tahoma, sans-serif"; c.fillText("SUNDBYBERG", 230, 166);
  });
  var bB = cTex(1024, 256, function (c, w, h) {
    var g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#1b3a8c"); g.addColorStop(1, "#0f2257"); c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.fillStyle = "#e0a63a"; c.fillRect(0, h - 22, w, 10);
    c.fillStyle = "#ffffff"; c.font = "800 70px Vazirmatn, Tahoma, sans-serif"; c.textAlign = "center"; c.textBaseline = "middle"; c.direction = "rtl";
    c.fillText("انجمن ایرانیان سوندبی‌بری", w / 2, h / 2 - 8);
  });
  GL.tex.push(bA, bB);
  var side = std(0x0c1a44, { roughness: 0.7 });
  function panel(x, z, ry, i) {
    var face = std(0xffffff, { map: i % 2 ? bB : bA, roughness: 0.55, emissive: 0x0a1030, emissiveIntensity: 0.4 });
    var m = mesh(new THREE.BoxGeometry(1.36, 0.7, 0.05), [side, side, side, side, face, side], x, FLOOR + 0.35, z, true, true);
    m.rotation.y = ry; sc.add(m);
  }
  for (var i = 0; i < 5; i++) panel(-2.8 + i * 1.4, -4.25, 0, i);
  for (i = 0; i < 5; i++) { panel(-3.15, -3.5 + i * 1.4, Math.PI / 2, i + 1); panel(3.15, -3.5 + i * 1.4, -Math.PI / 2, i); }

  /* سکوها و تماشاگران */
  var tierM = std(0x1a1f2e, { roughness: 0.9 }), seats = [];
  for (i = 0; i < 6; i++) {
    var h = 0.42 * (i + 1), d = 0.9;
    sc.add(mesh(new THREE.BoxGeometry(14, h, d), tierM, 0, FLOOR + h / 2, -5.3 - i * d, false, true));
    for (var s = -1; s <= 1; s += 2) sc.add(mesh(new THREE.BoxGeometry(d, h, 9.5), tierM, s * (4.3 + i * d), FLOOR + h / 2, -0.5, false, true));
    for (var k = 0; k < 24; k++) if (Math.random() < 0.86) seats.push([-6.3 + k * 0.55 + (Math.random() - 0.5) * 0.08, FLOOR + h, -5.3 - i * d]);
    for (s = -1; s <= 1; s += 2) for (k = 0; k < 16; k++) if (Math.random() < 0.8) seats.push([s * (4.3 + i * d), FLOOR + h, -4.6 + k * 0.55]);
  }
  var pal = [0xc62828, 0x1e88e5, 0xfdd835, 0x43a047, 0xffffff, 0x8e24aa, 0xff7043, 0x263238, 0x90a4ae, 0x5d4037];
  var bodyG = new THREE.CylinderGeometry(0.15, 0.19, 0.5, 8), headG = new THREE.SphereGeometry(0.105, 10, 8);
  var bodies = new THREE.InstancedMesh(bodyG, std(0xffffff, { roughness: 0.85 }), seats.length);
  var heads = new THREE.InstancedMesh(headG, std(0xffffff, { roughness: 0.7 }), seats.length);
  var skin = [0xe0b48a, 0xc68a5e, 0x8d5a3b, 0xf1c9a5, 0xa86f48], mtx = new THREE.Matrix4(), col = new THREE.Color();
  seats.forEach(function (p, j) {
    mtx.makeTranslation(p[0], p[1] + 0.25, p[2]); bodies.setMatrixAt(j, mtx); col.setHex(pal[j % pal.length]).multiplyScalar(0.5); bodies.setColorAt(j, col);
    mtx.makeTranslation(p[0], p[1] + 0.62, p[2]); heads.setMatrixAt(j, mtx); col.setHex(skin[j % skin.length]).multiplyScalar(0.6); heads.setColorAt(j, col);
  });
  bodies.visible = heads.visible = false; /* تا تماشاگران واقعی بارگذاری شوند پنهان‌اند */
  sc.add(bodies, heads);
  o.crowd = { bodies: bodies, heads: heads, seats: seats, ph: seats.map(function () { return Math.random() * 6.28; }), on: false };

  /* سقف و نورافکن‌ها */
  var lampM = new THREE.MeshBasicMaterial({ color: 0xfff4dd });
  [[-1.6, -1.2], [1.6, -1.2], [-1.6, 1.2], [1.6, 1.2], [0, -3.2], [0, 3]].forEach(function (q) { sc.add(mesh(new THREE.BoxGeometry(0.9, 0.06, 0.35), lampM, q[0], 5.6, q[1])); });
  var truss = std(0x2b2f3a, { metalness: 0.6, roughness: 0.4 });
  sc.add(mesh(new THREE.BoxGeometry(5, 0.12, 0.12), truss, 0, 5.7, -1.2), mesh(new THREE.BoxGeometry(5, 0.12, 0.12), truss, 0, 5.7, 1.2));

  /* صفحهٔ نمایش بزرگ */
  var scr = cTex(1024, 360, drawScreen);
  GL.tex.push(scr); o.screenTex = scr;
  var frame = mesh(new THREE.BoxGeometry(4.3, 1.55, 0.12), std(0x111318, { metalness: 0.5, roughness: 0.5 }), 0, 2.75, -8.1);
  var screen = mesh(new THREE.PlaneGeometry(4.1, 1.44), new THREE.MeshBasicMaterial({ map: scr, toneMapped: false, fog: false }), 0, 2.75, -8.03);
  sc.add(frame, screen);
  [-1.6, 1.6].forEach(function (x) { sc.add(mesh(new THREE.BoxGeometry(0.1, 3.4, 0.1), truss, x, 0.4, -8.12)); });

  /* میز */
  var tableTex = cTex(512, 1024, function (c, w, h) {
    var g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#143f93"); g.addColorStop(0.5, "#1a4aa6"); g.addColorStop(1, "#143f93"); c.fillStyle = g; c.fillRect(0, 0, w, h);
    for (var i = 0; i < 5000; i++) { c.fillStyle = Math.random() < 0.5 ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.05)"; c.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5); }
    var lw = Math.round(w * 0.02 / (TW * 2)); c.fillStyle = "#f7f7f7";
    c.fillRect(0, 0, w, lw); c.fillRect(0, h - lw, w, lw); c.fillRect(0, 0, lw, h); c.fillRect(w - lw, 0, lw, h);
    c.fillRect(w / 2 - 1.5, 0, 3, h);
    c.fillStyle = "rgba(0,0,0,0.35)"; c.fillRect(0, h / 2 - 2, w, 4);
  });
  var top = mesh(new THREE.PlaneGeometry(TW * 2, TL * 2), std(0xffffff, { map: tableTex, roughness: 0.38, metalness: 0.02 }), 0, 0.0005, 0, false, true);
  top.rotation.x = -Math.PI / 2; sc.add(top);
  sc.add(mesh(new THREE.BoxGeometry(TW * 2, 0.03, TL * 2), std(0x0f2f73, { roughness: 0.5 }), 0, -0.015, 0, true, true));
  var metal = std(0x2a2d33, { metalness: 0.7, roughness: 0.35 });
  sc.add(mesh(new THREE.BoxGeometry(TW * 2 - 0.12, 0.05, TL * 2 - 0.3), std(0x1c1f26), 0, -0.06, 0, true, false));
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (q) {
    var lx = q[0] * (TW - 0.16), lz = q[1] * (TL - 0.38), lh = -0.06 - FLOOR;
    sc.add(mesh(new THREE.BoxGeometry(0.05, lh, 0.05), metal, lx, FLOOR + lh / 2, lz, true, false));
    var wh = mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.035, 16), std(0x111111), lx, FLOOR + 0.045, lz + q[1] * 0.06, true, false); wh.rotation.z = Math.PI / 2; sc.add(wh);
  });
  [-1, 1].forEach(function (s) { sc.add(mesh(new THREE.BoxGeometry(0.04, 0.04, TL * 2 - 0.8), metal, s * (TW - 0.16), -0.42, 0, true, false)); });

  /* تور */
  var netTex = cTex(512, 64, function (c, w, h) {
    c.clearRect(0, 0, w, h); c.strokeStyle = "rgba(20,24,40,0.85)"; c.lineWidth = 1.4;
    for (var x = 0; x <= w; x += 6) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); }
    for (var y = 0; y <= h; y += 6) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
  });
  netTex.wrapS = THREE.RepeatWrapping; netTex.repeat.set(3, 1);
  var net = mesh(new THREE.PlaneGeometry(NW * 2, NH), new THREE.MeshStandardMaterial({ map: netTex, transparent: true, side: THREE.DoubleSide, depthWrite: false, roughness: 0.9 }), 0, NH / 2, 0, true, false);
  sc.add(net);
  sc.add(mesh(new THREE.BoxGeometry(NW * 2, 0.014, 0.008), std(0xf5f5f5), 0, NH, 0, true, false));
  [-1, 1].forEach(function (s) {
    sc.add(mesh(new THREE.BoxGeometry(0.025, NH + 0.03, 0.03), std(0x15171c, { metalness: 0.4 }), s * NW, NH / 2 - 0.01, 0, true, false));
    sc.add(mesh(new THREE.BoxGeometry(0.06, 0.04, 0.06), std(0x15171c, { metalness: 0.4 }), s * (TW + 0.01), -0.01, 0, true, false));
  });

  /* توپ، سایهٔ زیر توپ و دنباله */
  o.ball = mesh(new THREE.SphereGeometry(BR * 1.25, 24, 16), std(0xffffff, { roughness: 0.32, emissive: 0x2a2018, emissiveIntensity: 0.5 }), 0, 0.3, 0, true, false);
  sc.add(o.ball);
  o.blob = mesh(new THREE.CircleGeometry(BR * 1.5, 20), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35, depthWrite: false }));
  o.blob.rotation.x = -Math.PI / 2; sc.add(o.blob);
  o.trail = [];
  for (i = 0; i < 9; i++) { var tm = new THREE.Mesh(new THREE.SphereGeometry(BR * (0.95 - i * 0.07), 12, 8), new THREE.MeshBasicMaterial({ color: 0xfff0d8, transparent: true, opacity: 0.0, depthWrite: false })); sc.add(tm); o.trail.push(tm); }

  /* راکت‌ها و دستگاه توپ‌انداز */
  o.r0 = mkRacket(0xd32f2f, 0x1b1b1b); o.r1 = mkRacket(0x1b1b1b, 0xd32f2f);
  sc.add(o.r0, o.r1);
  o.machine = mkMachine(); sc.add(o.machine);

  /* جرقه‌ها و حلقه‌های برخورد */
  o.sparks = [];
  var spG = new THREE.SphereGeometry(0.008, 6, 4);
  for (i = 0; i < 40; i++) { var pm = new THREE.Mesh(spG, new THREE.MeshBasicMaterial({ color: 0xffd27a, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })); pm.visible = false; sc.add(pm); o.sparks.push({ m: pm, v: new THREE.Vector3(), life: 0 }); }
  o.rings = [];
  var rG = new THREE.RingGeometry(0.03, 0.042, 28);
  for (i = 0; i < 6; i++) { var rm = new THREE.Mesh(rG, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false })); rm.rotation.x = -Math.PI / 2; rm.visible = false; sc.add(rm); o.rings.push({ m: rm, life: 0 }); }
}

function mkRacket(front, back) {
  var g = new THREE.Group(), inner = new THREE.Group();
  var wood = std(0xd7ad74, { roughness: 0.55 });
  function disc(r, th, mat, z) { var gg = new THREE.CylinderGeometry(r, r, th, 40); gg.rotateX(Math.PI / 2); gg.scale(1, 1.06, 1); return mesh(gg, mat, 0, 0, z, true, false); }
  var fm = std(front, { roughness: 0.75 }), bm = std(back, { roughness: 0.75 });
  inner.add(disc(0.079, 0.006, wood, 0), disc(0.077, 0.004, fm, 0.005), disc(0.077, 0.004, bm, -0.005));
  var hd = mesh(new THREE.BoxGeometry(0.03, 0.1, 0.026), std(0xb07a40, { roughness: 0.6 }), 0, -0.125, 0, true, false);
  var flare = mesh(new THREE.BoxGeometry(0.038, 0.022, 0.03), std(0x8a5a2b), 0, -0.168, 0, true, false);
  var neck = mesh(new THREE.BoxGeometry(0.024, 0.03, 0.016), wood, 0, -0.08, 0, true, false);
  inner.add(hd, flare, neck);
  inner.scale.setScalar(1.25);
  g.add(inner); g.userData = { inner: inner, mats: [fm, bm, wood, hd.material, flare.material] };
  return g;
}
function mkMachine() {
  var g = new THREE.Group();
  var body = std(0x2c3340, { metalness: 0.3, roughness: 0.5 }), acc = std(0xff8a1f, { roughness: 0.4 });
  g.add(mesh(new THREE.BoxGeometry(0.34, 0.2, 0.3), body, 0, 0.1, 0, true, false));
  g.add(mesh(new THREE.CylinderGeometry(0.17, 0.1, 0.22, 24, 1, true), new THREE.MeshStandardMaterial({ color: 0xbfd8ff, transparent: true, opacity: 0.35, side: THREE.DoubleSide, roughness: 0.1 }), 0, 0.31, 0));
  var bm = std(0xff9d2e, { roughness: 0.4 }), wb = std(0xffffff, { roughness: 0.4 }), bg = new THREE.SphereGeometry(BR, 10, 8);
  for (var i = 0; i < 18; i++) { var a = i * 2.4, rr = 0.04 + (i % 4) * 0.025; g.add(mesh(bg, i % 3 ? wb : bm, Math.cos(a) * rr, 0.24 + Math.floor(i / 6) * 0.035, Math.sin(a) * rr)); }
  var noz = mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.16, 16), acc, 0, 0.16, 0.18, true, false); noz.rotation.x = Math.PI / 2 - 0.25; g.add(noz);
  var leg = std(0x15171c, { metalness: 0.5 });
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (q) { g.add(mesh(new THREE.BoxGeometry(0.025, 0.86, 0.025), leg, q[0] * 0.13, -0.43, q[1] * 0.11, true, false)); });
  g.position.set(0, 0.1, -TL - 0.32);
  return g;
}

/* صفحهٔ نمایش بزرگ سالن */
function drawScreen(c, w, h) {
  c.fillStyle = "#05070c"; c.fillRect(0, 0, w, h);
  var g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#0d1a40"); g.addColorStop(1, "#060a18"); c.fillStyle = g; c.fillRect(8, 8, w - 16, h - 16);
  c.textBaseline = "middle";
  var st = G || DEMO;
  if (!st) return;
  if (logoOk) c.drawImage(logo, 24, h / 2 - 70, 140, 140);
  if (st.practice) {
    c.fillStyle = "#ffd77a"; c.font = "800 54px Vazirmatn, Tahoma, sans-serif"; c.textAlign = "center"; c.direction = LANG === "fa" ? "rtl" : "ltr";
    c.fillText(t("streak"), w / 2 + 60, 110);
    c.fillStyle = "#ffffff"; c.font = "900 140px Vazirmatn, Tahoma, sans-serif"; c.fillText(num(st.streak || 0), w / 2 + 60, 235);
    return;
  }
  for (var i = 0; i < 2; i++) {
    var y = 120 + i * 120;
    c.direction = "ltr"; c.textAlign = "left";
    if (st.server === i && !st.over) { c.fillStyle = "#ffd23f"; c.beginPath(); c.arc(196, y, 13, 0, 7); c.fill(); }
    c.fillStyle = "#ffffff"; c.font = "800 62px Vazirmatn, Tahoma, sans-serif";
    var nm = String(st.names[i] || ""); if (nm.length > 11) nm = nm.slice(0, 10) + "…";
    c.direction = /[؀-ۿ]/.test(nm) ? "rtl" : "ltr"; c.textAlign = c.direction === "rtl" ? "right" : "left";
    c.fillText(nm, c.direction === "rtl" ? 620 : 226, y);
    c.direction = "ltr"; c.textAlign = "center";
    c.fillStyle = "#1a2550"; c.fillRect(680, y - 50, 120, 100); c.fillStyle = "#ffb02e"; c.font = "800 76px 'Courier New', monospace"; c.fillText(String(st.sets[i]), 740, y + 4);
    c.fillStyle = "#c62828"; c.fillRect(820, y - 50, 160, 100); c.fillStyle = "#ffffff"; c.font = "900 82px 'Courier New', monospace"; c.fillText(String(st.pts[i]), 900, y + 4);
  }
}

/* سه‌بعدی: به‌روزرسانی هر فریم */
function placeRacket(m, r, p, alpha, show) {
  m.visible = show;
  if (!show) return;
  var d = p === 0 ? 1 : -1, sw = r.swing || 0;
  m.position.set(r.x, r.y, r.z);
  var yaw = clamp(-r.x * 0.35 + (r.vx || 0) * 0.06 * d, -0.5, 0.5), roll = clamp(r.x * 0.45, -0.4, 0.4);
  m.rotation.set(-d * (0.18 + sw * 0.8), yaw, -roll);
  var mats = m.userData.mats;
  for (var i = 0; i < mats.length; i++) { mats[i].transparent = alpha < 1; mats[i].opacity = alpha; }
}
function setTrail(list) {
  var tr = GL.o.trail;
  for (var i = 0; i < tr.length; i++) {
    var q = list[list.length - 2 - i];
    if (!q) { tr[i].material.opacity = 0; tr[i].visible = false; continue; }
    tr[i].visible = true; tr[i].position.set(q[0], q[1], q[2]); tr[i].material.opacity = 0.28 * (1 - i / tr.length);
  }
}
function vfx(e) {
  if (!GL || !G) return;
  var b = G.b, o = GL.o;
  if (e === "hit" || e === "smash" || e === "feed") {
    var n = e === "smash" ? 18 : 8;
    for (var i = 0, k = 0; i < o.sparks.length && k < n; i++) {
      var s = o.sparks[i]; if (s.life > 0) continue; k++;
      s.life = 0.35 + Math.random() * 0.2; s.m.visible = true; s.m.position.set(b.x, b.y, b.z);
      s.v.set((Math.random() - 0.5) * 2.2, Math.random() * 1.8, (Math.random() - 0.5) * 2.2).multiplyScalar(e === "smash" ? 1.6 : 1);
      s.m.material.color.setHex(e === "smash" ? 0xff9a3a : 0xffe2a8);
    }
  }
  if (e === "bounce") {
    for (i = 0; i < o.rings.length; i++) { var r = o.rings[i]; if (r.life > 0) continue; r.life = 0.5; r.m.visible = true; r.m.position.set(b.x, 0.002, b.z); break; }
  }
}
function updFx(dt) {
  var o = GL.o;
  o.sparks.forEach(function (s) {
    if (s.life <= 0) return;
    s.life -= dt; s.v.y -= 6 * dt; s.m.position.addScaledVector(s.v, dt); s.m.material.opacity = Math.max(0, s.life * 2.2);
    if (s.life <= 0) s.m.visible = false;
  });
  o.rings.forEach(function (r) {
    if (r.life <= 0) return;
    r.life -= dt; var k = 1 - r.life / 0.5; r.m.scale.setScalar(1 + k * 2.2); r.m.material.opacity = 0.7 * (1 - k);
    if (r.life <= 0) r.m.visible = false;
  });
  var cr = o.crowd, cheer = G ? G.cheer : 0;
  /* تماشاگران واقعی؛ آدمک‌های ساده فقط اگر بارگذاری ناموفق باشد */
  var PC = window.PPCROWD;
  if (!cr.real && PC && PC.ready) {
    try {
      cr.real = PC.build(cr.seats.map(function (p) { return [p[0], p[1], p[2], p[2] < -5 ? 0 : p[0] < 0 ? Math.PI / 2 : -Math.PI / 2]; }), Math.min(innerWidth, innerHeight) < 600);
      GL.scene.add(cr.real.g);
    } catch (e) { console.error(e); PC.failed = true; }
  }
  if (cr.real) { cr.real.update(GL.t, cheer); return; }
  cr.bodies.visible = cr.heads.visible = !PC || PC.failed;
  if (cheer > 0 || cr.on) {
    cr.on = cheer > 0;
    var m = new THREE.Matrix4(), a = Math.min(1, cheer);
    for (var j = 0; j < cr.seats.length; j++) {
      var p = cr.seats[j], up = Math.max(0, Math.sin(GL.t * 11 + cr.ph[j])) * 0.09 * a;
      m.makeTranslation(p[0], p[1] + 0.25 + up, p[2]); cr.bodies.setMatrixAt(j, m);
      m.makeTranslation(p[0], p[1] + 0.62 + up, p[2]); cr.heads.setMatrixAt(j, m);
    }
    cr.bodies.instanceMatrix.needsUpdate = true; cr.heads.instanceMatrix.needsUpdate = true;
  }
}

function sizeGL(W, H) { GL.W = W; GL.H = H; GL.r.setSize(W, H, false); GL.cam.aspect = W / H; GL.cam.updateProjectionMatrix(); }
function playCam(view) {
  var asp = GL.W / GL.H, pos, look, fov;
  if (asp >= 1.05) { pos = [0, 1.32, 3.5]; look = [0, -0.02, -0.75]; fov = 44; }
  else { pos = [0, 1.8, 2.95]; look = [0, -0.3, -0.4]; fov = Math.max(46, 2 * Math.atan(0.37 / asp) * 180 / Math.PI); }
  if (view === 1) { pos[2] = -pos[2]; look[2] = -look[2]; }
  return { pos: pos, look: look, fov: fov };
}
function render3D(dt, st, mode) {
  var o = GL.o, cam = GL.cam;
  GL.t += dt;
  var b = st.b, r0 = st.rk[0], r1 = st.rk[1], trail = st.trail || [];
  var replay = mode === "replay" && st.rp;
  if (replay) {
    var f = st.rp.f[st.rp.i];
    b = { x: f[0], y: f[1], z: f[2] }; r0 = { x: f[3], y: f[4], z: f[5], swing: f[6], vx: 0 }; r1 = { x: f[7], y: f[8], z: f[9], swing: f[10], vx: 0 };
    trail = st.rp.f.slice(Math.max(0, st.rp.i - 10), st.rp.i + 1);
  }
  o.ball.position.set(b.x, b.y, b.z);
  var overT = Math.abs(b.x) <= TW && Math.abs(b.z) <= TL && b.y >= -0.01;
  o.blob.position.set(b.x, overT ? 0.0015 : FLOOR + 0.002, b.z);
  var hgt = b.y - (overT ? 0 : FLOOR); o.blob.scale.setScalar(clamp(1 + hgt * 1.4, 1, 3)); o.blob.material.opacity = clamp(0.42 - hgt * 0.35, 0.08, 0.42);
  o.blob.visible = o.ball.visible = b.y > FLOOR - 0.5;
  setTrail(mode === "play" && st.st === "rally" || replay ? trail : []);
  var me = mode === "hero" ? 0 : ME, prac = !!st.practice;
  placeRacket(o.r0, r0, 0, me === 0 && !replay ? 0.88 : 1, true);
  placeRacket(o.r1, r1, 1, me === 1 && !replay ? 0.88 : 1, !prac);
  o.machine.visible = prac;
  updFx(dt);

  /* دوربین */
  var target;
  if (mode === "hero") {
    var a = GL.t * 0.18 + 0.6; target = { pos: [Math.sin(a) * 3.6, 1.55, Math.cos(a) * 3.6], look: [0, 0.05, 0], fov: GL.W / GL.H < 1 ? 58 : 40 };
    cam.position.set(target.pos[0], target.pos[1], target.pos[2]); GL.camLook.set(0, 0.05, 0);
  } else if (replay) {
    var por = GL.W / GL.H < 1; target = { pos: [por ? 4.6 : 3.7, por ? 1.9 : 1.4, b.z * 0.45], look: [0, 0.0, b.z * 0.55], fov: por ? 58 : 44 };
    var kk = Math.min(1, dt * 3);
    if (st.rp.i < 2) kk = 1;
    cam.position.lerp(GL.tmpV.set(target.pos[0], target.pos[1], target.pos[2]), kk);
    GL.camLook.lerp(GL.tmpV.set(target.look[0], target.look[1], target.look[2]), kk);
  } else {
    target = playCam(me);
    var fx = clamp(b.x * 0.22 + st.rk[me].x * 0.12, -0.45, 0.45), k2 = Math.min(1, dt * 2.5);
    cam.position.lerp(GL.tmpV.set(target.pos[0] + fx, target.pos[1], target.pos[2]), GL.snap ? 1 : k2);
    GL.camLook.lerp(GL.tmpV.set(target.look[0] + fx * 0.6, target.look[1], target.look[2]), GL.snap ? 1 : k2);
    GL.snap = false;
  }
  if (Math.abs(cam.fov - target.fov) > 0.1) { cam.fov = target.fov; cam.updateProjectionMatrix(); }
  cam.lookAt(GL.camLook);
  if (st.shake > 0) { cam.position.x += (Math.random() - 0.5) * 0.03 * st.shake; cam.position.y += (Math.random() - 0.5) * 0.03 * st.shake; }

  if (mode !== "hero") {
    var key = JSON.stringify([st.pts, st.sets, st.server, st.names, st.over, st.streak, st.practice, LANG]);
    if (key !== GL.scoreKey) { GL.scoreKey = key; redraw(o.screenTex); }
  }
  GL.r.render(GL.scene, cam);
}
function attachGL(parent) { if (GL.canvas.parentNode !== parent) parent.insertBefore(GL.canvas, parent.firstChild); GL.snap = true; GL.scoreKey = ""; }

/* ---------------- رابط کاربری ---------------- */
var $app = $("app"), gm = null, CW = 0, CH = 0, raf = 0, last = 0, sendT = 0, hero = null, DEMO = null;
var keys = {}, msgEl = null, shotEl = null, shotT = 0, tvKey = "", rallyKey = "";

function setLang(l) {
  LANG = l; store("lang", l);
  document.documentElement.lang = l; document.documentElement.dir = l === "fa" ? "rtl" : "ltr";
  $("ttl").textContent = t("title"); $("back").textContent = t("back"); $("lang").textContent = t("langBtn");
  document.title = t("title") + (l === "fa" ? " · انجمن ایرانیان سوندبی‌بری" : " · Iranska föreningen i Sundbyberg");
  tvKey = ""; rallyKey = ""; if (GL) GL.scoreKey = "";
  if (G && gm) buildBar(); else if (!G) menu();
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
  stopLoop(); G = null; MODE = null; gm = null;
  var lvl = store("pp-lvl") || "m", rk = store("pp-rk") || "all", ln = store("pp-len") || "3";
  if (!LV[lvl]) lvl = "m";
  $app.innerHTML = '<div class="panel menu">' +
    '<div class="hero" id="hero"><div class="hero-badge">3D</div></div>' +
    "<h2>" + t("title") + "</h2><p>" + t("intro") + "</p>" +
    '<label class="field"><span>' + t("name") + '</span><input id="nm" maxlength="16" value="' + esc(store("pp-name") || "") + '" placeholder="' + t("namePh") + '" autocomplete="nickname"></label>' +
    '<div class="field"><span>' + t("level") + "</span>" + radio("lvl", ["e", "m", "h", "p"].map(function (k) { return [k, t("lv")[k], t("lvd")[k]]; }), lvl) + "</div>" +
    '<div class="field"><span>' + t("racket") + "</span>" + radio("rk", [["def", t("def"), t("defd")], ["all", t("all"), t("alld")], ["off", t("off"), t("offd")]], rk) + "</div>" +
    '<div class="field"><span>' + t("len") + "</span>" + radio("len", [["1", t("len1")], ["3", t("len3")], ["5", t("len5")]], ln) + "</div>" +
    '<button class="btn" id="solo">' + t("vsAI") + "</button>" +
    '<button class="btn green" id="prac">' + t("practice") + "</button>" +
    '<div class="row"><button class="btn alt" id="mk">' + t("mk") + '</button><button class="btn alt" id="jn">' + t("jn") + "</button></div>" +
    '<div id="jbox" hidden><label class="field"><span>' + t("code") + '</span><input id="jc" inputmode="numeric" maxlength="4" dir="ltr" placeholder="1234"></label><button class="btn" id="jgo">' + t("go") + "</button></div>" +
    '<details class="rules"><summary>' + t("rulesT") + "</summary><ul>" + t("rules").map(function (r) { return "<li>" + r + "</li>"; }).join("") + "</ul></details>" +
    "</div>";
  function saveOpts() { store("pp-lvl", val("lvl")); store("pp-rk", val("rk")); store("pp-len", val("len")); myName(); }
  function go(fn) { return function () { saveOpts(); audio(); if (AC && AC.state === "suspended") AC.resume(); if (!initGL()) return toast(t("noGL")); fn(); }; }
  $("solo").onclick = go(startAI);
  $("prac").onclick = go(startPractice);
  $("mk").onclick = go(host);
  $("jn").onclick = function () { $("jbox").hidden = false; $("jc").focus(); };
  $("jgo").onclick = go(function () { join($("jc").value); });
  $("jc").onkeydown = function (e) { if (e.key === "Enter") $("jgo").click(); };
  if (initGL()) {
    hero = $("hero"); attachGL(hero);
    DEMO = { names: ["Alborz", "Arshad"], sets: [1, 1], pts: [7, 6], setNo: 3, best: 5, server: 0, over: false, b: { x: 0.22, y: 0.3, z: -0.45 }, rk: [{ x: 0.25, y: 0.24, z: 1.72, swing: 0.3, vx: 0 }, { x: -0.3, y: 0.28, z: -1.72, swing: 0.6, vx: 0 }], trail: [], shake: 0 };
    sizeHero(); GL.scoreKey = ""; G = null; redraw(GL.o.screenTex);
    startLoop();
  } else { $("hero").classList.add("nogl"); $("hero").textContent = t("noGL"); }
}
function sizeHero() { if (!hero || !GL) return; var w = hero.clientWidth, h = Math.round(w * 0.6); hero.style.height = h + "px"; sizeGL(w, h); }

function startAI() {
  MODE = "ai"; ME = 0;
  var lvl = store("pp-lvl") || "m";
  newGame({ lvl: lvl, best: +(store("pp-len") || 3), names: [myName(), t("computer")], rts: [store("pp-rk") || "all", lvl === "h" || lvl === "p" ? (Math.random() < 0.5 ? "off" : "all") : "all"] });
  gameView();
}
function startPractice() {
  MODE = "practice"; ME = 0;
  newGame({ lvl: store("pp-lvl") || "m", best: 1, names: [myName(), t("machine")], rts: [store("pp-rk") || "all", "all"], practice: true });
  gameView();
}

function gameView() {
  hero = null;
  $app.innerHTML = '<div class="game" id="gm"><div class="tv" id="tv"></div><div class="rally" id="rally"></div>' +
    '<div class="rp" id="rp"><b><i></i>' + t("replay") + "</b><small>" + t("skip") + "</small></div>" +
    '<div class="shotlbl" id="shot"></div><div class="msg" id="msg"></div></div><div class="bar" id="bar"></div><p class="hint" id="hint"></p>';
  gm = $("gm"); msgEl = $("msg"); shotEl = $("shot"); tvKey = ""; rallyKey = "";
  attachGL(gm);
  buildBar(); resize(); bindInput(); startLoop();
}
function buildBar() {
  var bar = $("bar"); if (!bar || !G) return;
  var h = "";
  if (G.L.spin && !G.practice) h += '<div class="spin">' + ["flat", "top", "back", "side"].map(function (k, i) { return '<button type="button" data-s="' + k + '" class="' + (G.shot[ME] === k ? "on" : "") + '">' + t("shots")[k] + "<kbd>" + (i + 1) + "</kbd></button>"; }).join("") + "</div>";
  if (G.L.spin && G.practice) h += '<div class="spin">' + ["mix", "flat", "top", "back", "side"].map(function (k) { return '<button type="button" data-f="' + k + '" class="' + (feedType === k ? "on" : "") + '">' + t("feed")[k] + "</button>"; }).join("") + "</div>";
  if (G.L.spin && G.practice) h += '<div class="spin">' + ["flat", "top", "back", "side"].map(function (k, i) { return '<button type="button" data-s="' + k + '" class="' + (G.shot[ME] === k ? "on" : "") + '">' + t("shots")[k] + "<kbd>" + (i + 1) + "</kbd></button>"; }).join("") + "</div>";
  h += '<button type="button" id="snd">' + (muted ? t("sndOff") : t("sndOn")) + "</button>";
  if (MODE === "ai" || MODE === "practice") h += '<button type="button" id="pz">' + (G.paused ? t("resume") : t("pause")) + "</button>";
  h += '<button type="button" id="ex">' + t("exit") + "</button>";
  bar.innerHTML = h;
  $("hint").textContent = (G.practice ? t("hintP") : t("hint")) + (G.L.spin ? " " + t("hintH") : "") + "  ·  " + t("lv")[G.lvl] + " · " + t(G.rts[ME]);
  bar.querySelectorAll("[data-s]").forEach(function (b) { b.onclick = function () { setShot(b.getAttribute("data-s")); }; });
  bar.querySelectorAll("[data-f]").forEach(function (b) { b.onclick = function () { feedType = b.getAttribute("data-f"); store("pp-feed", feedType); bar.querySelectorAll("[data-f]").forEach(function (x) { x.classList.toggle("on", x === b); }); }; });
  $("snd").onclick = function () { muted = !muted; store("pp-mute", muted ? "1" : "0"); audio(); buildBar(); };
  if ($("pz")) $("pz").onclick = function () { G.paused = !G.paused; buildBar(); };
  $("ex").onclick = leave;
}
function setShot(k) { if (!G) return; G.shot[ME] = k; var bar = $("bar"); if (bar) bar.querySelectorAll("[data-s]").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-s") === k); }); }
function showShot(shot, smash) {
  if (!shotEl) return;
  if (!smash && (!G.L.spin || shot === "flat")) return;
  shotEl.textContent = smash ? "SMASH!" : t("shots")[shot]; shotEl.classList.toggle("smash", smash); shotEl.classList.add("on"); shotT = 0.9;
}

function resize() {
  if (hero) { sizeHero(); return; }
  if (!gm || !GL) return;
  var bar = $("bar"), hint = $("hint"), top = document.querySelector(".top");
  var extra = (top ? top.offsetHeight : 50) + (bar ? bar.offsetHeight : 50) + (hint ? hint.offsetHeight : 20) + 34;
  var W = gm.clientWidth, avail = window.innerHeight - extra, H;
  if (window.innerHeight > W * 1.1) H = clamp(avail, 340, W * 1.75);
  else H = clamp(avail, 300, W * 0.66);
  H = Math.round(H); gm.style.height = H + "px"; CW = W; CH = H; sizeGL(W, H); GL.snap = true;
}
window.addEventListener("resize", function () { resize(); });

function bindInput() {
  function mv(e) {
    if (!G || !GL) return;
    var rc = gm.getBoundingClientRect(), sx = (e.clientX - rc.left) / rc.width, sy = (e.clientY - rc.top) / rc.height;
    if (e.pointerType === "touch") sy -= 45 / rc.height;
    GL.ray.setFromCamera({ x: sx * 2 - 1, y: -(sy * 2 - 1) }, GL.cam);
    if (!GL.ray.ray.intersectPlane(GL.plane, GL.hit)) return;
    var w = GL.hit, r = G.rk[ME];
    r.tx = clamp(w.x, -1.3, 1.3); r.tz = ME === 0 ? clamp(w.z, 1.15, 2.4) : clamp(w.z, -2.4, -1.15);
  }
  gm.addEventListener("pointermove", mv);
  gm.addEventListener("pointerdown", function (e) {
    audio(); if (AC && AC.state === "suspended") AC.resume();
    if (G && G.st === "replay") { endReplay(); return; }
    mv(e); try { gm.setPointerCapture(e.pointerId); } catch (x) {} serveReq();
  });
  document.onkeydown = function (e) {
    if (!G) return;
    if (e.target && e.target.tagName === "INPUT") return;
    keys[e.key] = true;
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); audio(); if (G.st === "replay") endReplay(); else serveReq(); }
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
  r.swing = Math.max(0, (r.swing || 0) - dt * 4.5);
}
function record(dt) {
  var b = G.b, a = G.rk[0], c = G.rk[1];
  G.recT += dt;
  G.rec.push([b.x, b.y, b.z, a.x, a.y, a.z, a.swing, c.x, c.y, c.z, c.swing, G.recT]);
  if (G.rec.length > 1500) G.rec.shift();
}

function simulate(dt) {
  G.clock += dt; G.shake = Math.max(0, G.shake - dt * 3); G.cheer = Math.max(0, G.cheer - dt);
  if (G.st === "replay") { stepReplay(dt); return; }
  moveMine(dt);
  if (MODE === "ai") aiThink(dt, dt * G.L.ts);
  else if (MODE !== "practice") follow(G.rk[1], dt, 18);
  racketHeight(0, dt); racketHeight(1, dt);
  if (G.st === "serve") holdBall();
  else if (G.st === "rally") {
    var ds = dt * G.L.ts, n = Math.ceil(ds / (1 / 300)), h = ds / n;
    for (var i = 0; i < n && G.st === "rally"; i++) {
      var b = G.b; b.pz = b.z;
      phys(b, h, onEv);
      if (G.st === "rally") { if (!tryHit(0)) tryHit(1); }
    }
    record(dt);
  } else if (G.st === "point") {
    var bb = G.b; if (bb.y > FLOOR - 1) phys(bb, dt * G.L.ts, function () {});
    if (G.recMore > 0) { G.recMore -= dt; record(dt); }
    G.tm -= dt;
    if (G.tm <= 0) afterPoint();
  }
  trail();
}
function afterPoint() {
  if (G.rp0 && MODE === "ai") {
    G.rp0 = null;
    var f = G.rec, endT = f[f.length - 1][11], i0 = 0;
    while (i0 < f.length - 1 && f[i0][11] < endT - 3.2) i0++;
    G.rp = { f: f.slice(i0), i: 0, t: f[i0][11], end: endT };
    G.st = "replay"; G.msg = null; GL.snap = true;
    return;
  }
  finishPoint();
}
function stepReplay(dt) {
  var rp = G.rp; rp.t += dt * 0.42;
  while (rp.i < rp.f.length - 1 && rp.f[rp.i + 1][11] <= rp.t) rp.i++;
  if (rp.t > rp.end + 0.25) endReplay();
}
function endReplay() { if (!G || G.st !== "replay") return; G.rp = null; GL.snap = true; finishPoint(); }
function finishPoint() {
  if (G.after === "end") { G.st = "over"; showEnd(); }
  else if (G.after === "newset") { G.pts = [0, 0]; G.setNo++; G.first = 1 - G.first; G.server = G.first; setupServe(); }
  else if (G.after === "feed") feedBall();
  else setupServe();
}
function trail() {
  if (!G.trail) G.trail = [];
  if (G.st === "rally" || G.st === "point") { G.trail.push([G.b.x, G.b.y, G.b.z]); if (G.trail.length > 11) G.trail.shift(); }
  else G.trail.length = 0;
}

function frame(now) {
  raf = requestAnimationFrame(frame);
  var dt = Math.min(0.05, (now - last) / 1000); last = now;
  if (!GL) return;
  if (G && gm) {
    if (!G.paused) {
      if (MODE === "guest") guestStep(dt); else simulate(dt);
      if (MODE === "host") { sendT += dt; if (sendT > 0.033) { sendT = 0; hostSend(); } }
      if (MODE === "guest") { sendT += dt; if (sendT > 0.033) { sendT = 0; guestSend(); } }
    }
    if (shotT > 0) { shotT -= dt; if (shotT <= 0) shotEl.classList.remove("on"); }
    updMsg(); updHUD();
    render3D(G.paused ? 0 : dt, G, G.st === "replay" ? "replay" : "play");
  } else if (hero && DEMO) {
    DEMO.b.y = 0.22 + Math.abs(Math.sin(GL.t * 2.4)) * 0.22; DEMO.b.z = -0.45 + Math.sin(GL.t * 0.7) * 0.6;
    render3D(dt, DEMO, "hero");
  }
}

function msgHTML(m) {
  if (!m) return "";
  var nm = function (i) { return esc(G.names[i]); };
  var sp = m.sp ? '<em class="sp">' + t(m.sp) + "</em>" : "";
  if (m.k === "serve") return sp + (m.n === ME ? t("serveYou") + "<small>" + t("serveYouS") + "</small>" : tf("serveOpp", nm(m.n)));
  if (m.k === "point") return tf("point", nm(m.n)) + "<small>" + t(m.why) + "</small>";
  if (m.k === "set") return tf("setWon", nm(m.n)) + "<small>" + t(m.why) + "</small>";
  if (m.k === "match") return tf("matchWon", nm(m.n));
  if (m.k === "let") return t("let");
  if (m.k === "good") return '<span class="good">' + t("good") + "</span>";
  if (m.k === "pmiss") return t("miss");
  return "";
}
var lastMsgKey = "";
function updMsg() {
  if (!msgEl) return;
  var m = G.paused ? { k: "_p" } : G.msg, key = m ? JSON.stringify(m) + LANG : "";
  if (key !== lastMsgKey) { lastMsgKey = key; if (m) msgEl.innerHTML = m.k === "_p" ? t("paused") : msgHTML(m); msgEl.classList.toggle("on", !!m); }
  if (G.msg && (G.msg.k === "good" || G.msg.k === "pmiss") && Date.now() - G.msgT > 700) G.msg = null;
}
function updHUD() {
  var tv = $("tv"), ra = $("rally"), rp = $("rp"); if (!tv) return;
  var key;
  if (G.practice) {
    key = [G.streak, G.bestStreak, G.hits, LANG].join();
    if (key !== tvKey) { tvKey = key; tv.innerHTML = '<div class="tvp"><span>' + t("streak") + "</span><b>" + num(G.streak) + '</b></div><div class="tvp dim"><span>' + t("best") + "</span><b>" + num(G.bestStreak) + "</b></div>"; }
  } else {
    key = JSON.stringify([G.names, G.sets, G.pts, G.server, G.setNo, G.over, LANG]);
    if (key !== tvKey) {
      tvKey = key;
      tv.innerHTML = [0, 1].map(function (i) {
        return '<div class="tvr' + (i === ME ? " me" : "") + '"><i class="' + (G.server === i && !G.over ? "on" : "") + '"></i><span class="nm">' + esc(G.names[i]) + '</span><b class="s">' + num(G.sets[i]) + '</b><b class="p">' + num(G.pts[i]) + "</b></div>";
      }).join("") + '<div class="tvf">' + t("setW") + " " + num(G.setNo) + " · " + t("len" + G.best) + "</div>";
    }
  }
  var showR = (G.st === "rally" || G.st === "point") && G.rally >= 2;
  key = showR ? G.rally + "|" + Math.round(G.spd) + LANG : "";
  if (key !== rallyKey) {
    rallyKey = key;
    ra.classList.toggle("on", showR);
    if (showR) ra.innerHTML = "<span>" + t("rally") + " <b>" + num(G.rally) + "</b></span><span class=\"kmh\">" + num(Math.round(G.spd)) + " " + t("kmh") + "</span>";
  }
  rp.classList.toggle("on", G.st === "replay");
}

function showEnd() {
  if (!gm || gm.querySelector(".end")) return;
  var won = G.winner === ME, d = document.createElement("div"); d.className = "end";
  var s = G.stats, rows = "";
  if (s) {
    var row = function (lbl, a, b) { return "<tr><td>" + a + "</td><th>" + lbl + "</th><td>" + b + "</td></tr>"; };
    rows = '<table class="stats"><thead><tr><td>' + esc(G.names[0]) + "</td><th>" + t("statsT") + "</th><td>" + esc(G.names[1]) + "</td></tr></thead><tbody>" +
      row(t("sPts"), num(s.pts[0]), num(s.pts[1])) +
      row(t("sFast"), num(Math.round(s.fast[0])), num(Math.round(s.fast[1]))) +
      row(t("sSmash"), num(s.smash[0]), num(s.smash[1])) +
      row(t("sSrv"), num(s.srv[0]), num(s.srv[1])) +
      row(t("sAce"), num(s.ace[0]), num(s.ace[1])) +
      '</tbody></table><p class="long">' + t("sLong") + ": <b>" + num(s.long) + "</b></p>";
  }
  var sc = num(G.sets[0]) + " – " + num(G.sets[1]);
  d.innerHTML = '<div class="panel"><h2>' + (won ? t("youWon") : t("youLost")) + '</h2><p>' + tf("matchWon", esc(G.names[G.winner])) + '</p><div class="big">' + sc + "</div>" + rows +
    (MODE === "guest" ? "<p>" + t("waitHost") + "</p>" : '<button class="btn" id="again">' + t("again") + "</button>") +
    '<button class="btn ghost" id="tomenu">' + t("menu") + "</button></div>";
  gm.appendChild(d);
  if (won) crowd(1);
  if ($("again")) $("again").onclick = function () {
    if (MODE === "ai") startAI();
    else if (MODE === "host" && conn) { var o = { lvl: G.lvl, best: G.best, names: G.names, rts: G.rts }; newGame(o); conn.send({ t: "cfg", o: o, first: G.first }); d.remove(); buildBar(); tvKey = ""; }
  };
  $("tomenu").onclick = leave;
}

document.addEventListener("visibilitychange", function () { if (document.hidden && G && (MODE === "ai" || MODE === "practice") && G.st !== "over") { G.paused = true; buildBar(); } });

/* ---------------- آنلاین ---------------- */
function leave() {
  stopLoop();
  try { if (peer) peer.destroy(); } catch (e) {}
  peer = null; conn = null; G = null; MODE = null; menu();
}
function host() {
  if (!window.Peer) return toast(t("noPeer"));
  var code = String(Math.floor(1000 + Math.random() * 9000)), name = myName(), lvl = store("pp-lvl") || "m", best = +(store("pp-len") || 3), rk = store("pp-rk") || "all";
  MODE = "host"; ME = 0; stopLoop(); hero = null;
  $app.innerHTML = '<div class="panel"><h2>' + t("creating") + "</h2></div>";
  peer = new Peer(PFX + code);
  var opp = null;
  function lobby() {
    if (G) return;
    $app.innerHTML = '<div class="panel"><h2>' + t("roomT") + "</h2><p>" + t("roomP") + '</p><div class="code">' + code + "</div>" +
      "<p>" + (opp ? tf("oppIn", "<b>" + esc(opp.name) + "</b>") : t("waitOpp")) + "</p>" +
      "<p>" + t("lv")[lvl] + " · " + t("len" + best) + "</p>" +
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
function hostSend() {
  if (!conn || !G) return;
  var b = G.b;
  conn.send({
    t: "s", b: [b.x, b.y, b.z, b.vx, b.vy, b.vz, b.top, b.sx], r0: [G.rk[0].x, G.rk[0].y, G.rk[0].z, G.rk[0].swing], y1: G.rk[1].y, w1: G.rk[1].swing,
    st: G.st, sc: [G.pts[0], G.pts[1], G.sets[0], G.sets[1], G.setNo, G.server, G.rally, Math.round(G.spd)], m: G.msg, ev: G.ev.splice(0), ov: G.over ? G.winner : -1, ts: G.L.ts,
    ss: G.over ? G.stats : 0
  });
}

function join(code) {
  if (!window.Peer) return toast(t("noPeer"));
  code = String(code || "").replace(/[۰-۹]/g, function (d) { return FAD.indexOf(d); }).replace(/\D/g, "");
  if (code.length !== 4) return toast(t("code4"));
  var name = myName(), rk = store("pp-rk") || "all";
  MODE = "guest"; ME = 1; stopLoop(); hero = null;
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
      if (d.t === "cfg") { newGame(d.o); G.first = d.first; tvKey = ""; if (!gm || !$("gm")) gameView(); else { var e = document.querySelector(".end"); if (e) e.remove(); buildBar(); } return; }
      if (d.t === "s" && G) guestRecv(d);
    });
    conn.on("close", function () { if (MODE === "guest") { toast(t("lost")); leave(); } });
  });
  peer.on("error", function (e) { if (MODE === "guest") { toast(e && e.type === "peer-unavailable" ? t("noRoom") : t("connFail")); leave(); } });
}
function guestRecv(d) {
  var b = G.b, q = d.b;
  b.x = q[0]; b.y = q[1]; b.z = q[2]; b.vx = q[3]; b.vy = q[4]; b.vz = q[5]; b.top = q[6]; b.sx = q[7];
  var r0 = G.rk[0]; r0.tx = d.r0[0]; r0.y = d.r0[1]; r0.tz = d.r0[2]; r0.swing = d.r0[3] || 0; G.rk[1].y = d.y1; if (d.w1 > G.rk[1].swing) G.rk[1].swing = d.w1;
  G.st = d.st === "over" ? "point" : d.st === "replay" ? "point" : d.st;
  G.pts = [d.sc[0], d.sc[1]]; G.sets = [d.sc[2], d.sc[3]]; G.setNo = d.sc[4]; G.server = d.sc[5]; G.rally = d.sc[6] || 0; G.spd = d.sc[7] || 0;
  G.msg = d.m;
  (d.ev || []).forEach(function (e) { sfx(e); vfx(e); if (e === "point") { G.cheer = 1.4; crowd(0.5); } if (e === "smash") G.shake = 1; });
  if (d.ss) G.stats = d.ss;
  if (d.ov >= 0 && !G.over) { G.over = true; G.winner = d.ov; }
  if (G.over && d.st === "over") showEnd();
}
function guestStep(dt) {
  G.clock += dt; G.shake = Math.max(0, G.shake - dt * 3); G.cheer = Math.max(0, G.cheer - dt);
  moveMine(dt);
  follow(G.rk[0], dt, 16);
  G.rk[1].swing = Math.max(0, (G.rk[1].swing || 0) - dt * 4.5);
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
if (THREE) THREE.ColorManagement && (THREE.ColorManagement.legacyMode = true);
setLang(LANG);
})();
