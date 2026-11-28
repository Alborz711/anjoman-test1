/* بدمینتون انجمن ایرانیان سوندبی‌بری — نسخهٔ سه‌بعدی
   بازی با رایانه (چهار سطح)، تمرین با دستگاه شاتل‌انداز، و بازی آنلاین دونفره (PeerJS)
   گرافیک: Three.js (از پوشهٔ volleyball/lib) و بازیکنان واقعی از athletes.js */
(function () {
"use strict";

/* ---------------- ابزار ---------------- */
var $ = function (id) { return document.getElementById(id); };
function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
function rnd(a, b) { return a + Math.random() * (b - a); }
function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
var LANG = store("lang") === "sv" ? "sv" : "fa";
var FAD = "۰۱۲۳۴۵۶۷۸۹";
function num(n) { n = String(n); return LANG === "fa" ? n.replace(/\d/g, function (d) { return FAD[d]; }) : n; }

var S = {
fa: {
  title: "بدمینتون", back: "→ بازگشت به تارنمای انجمن", langBtn: "Svenska",
  intro: "بدمینتون در یک سالن مسابقهٔ واقعی: با رایانه در چهار سطح بازی کنید، با دستگاه شاتل‌انداز تمرین کنید، یا آنلاین با یک هموند دیگر مسابقه بدهید.",
  name: "نام شما", namePh: "مثلاً: البرز",
  level: "سطح بازی",
  lv: { e: "آسان", m: "متوسط", h: "دشوار", p: "حرفه‌ای" },
  lvd: { e: "شاتل آهسته، ضربه خودکار", m: "ضربه‌ها خودکار", h: "کلیر، دراپ، اسمش، درایو", p: "حریف سریع و دقیق" },
  racket: "نوع راکت", def: "دفاعی", defd: "سبک‌سر؛ دسترس و کنترل بیشتر", all: "همه‌جانبه", alld: "متعادل", off: "تهاجمی", offd: "سنگین‌سر؛ اسمش تندتر، خطای بیشتر",
  len: "طول مسابقه", len1: "یک گیم", len3: "بهترین ۳ گیم",
  loading: "آماده‌سازی بازیکنان", loadFail: "بارگذاری بازیکنان ناموفق بود؛ بازی با آدمک‌های ساده اجرا می‌شود.",
  vsAI: "مسابقه با رایانه", practice: "تمرین با دستگاه شاتل‌انداز", mk: "ساختن اتاق آنلاین", jn: "پیوستن به اتاق", code: "کد اتاق", go: "پیوستن",
  rulesT: "راهنما و قوانین",
  rules: [
    "هر گیم تا ۲۱ امتیاز است؛ برنده باید ۲ امتیاز جلو باشد و در ۲۹–۲۹ امتیاز سی‌ام برنده است.",
    "هر رالی یک امتیاز دارد و برندهٔ رالی سرویس بعدی را می‌زند. با امتیاز زوج از سمت راست و با امتیاز فرد از سمت چپ سرویس زده می‌شود و شاتل باید ضربدری در خانهٔ سرویس روبه‌رو بیفتد. خانهٔ درست سرویس روی زمین می‌درخشد.",
    "بازیکن را با انگشت یا موس به جایی ببرید که شاتل پایین می‌آید؛ وقتی شاتل به دسترس راکت رسید، ضربه خودبه‌خود زده می‌شود. سایهٔ شاتل روی زمین کمک می‌کند جای فرود را حدس بزنید.",
    "در سطح آسان و متوسط نوع ضربه خودکار انتخاب می‌شود. در سطح دشوار و حرفه‌ای خودتان انتخاب می‌کنید: کلیر (بلند و عمیق)، دراپ (آرام و نزدیک تور)، اسمش (تند و رو به پایین؛ فقط وقتی شاتل بالاست) و درایو (صاف و تند). در سرویس، دراپ یعنی سرویس کوتاه و بقیه سرویس بلند.",
    "ضربه با لبهٔ دسترس راکت، دراپ از ته زمین و اسمش با راکت تهاجمی احتمال خطا را بالا می‌برند.",
    "راکت دفاعی (سبک‌سر) دسترس و کنترل بیشتری دارد؛ راکت تهاجمی (سنگین‌سر) اسمش تندتری دارد ولی خطایش بیشتر است.",
    "بعد از رالی‌های طولانی یا اسمش برنده، بازپخش آهسته نشان داده می‌شود؛ با یک ضربه روی صفحه رد می‌شود.",
    "در حالت تمرین، دستگاه پشت سر هم شاتل می‌اندازد. هر شاتلی که درست به زمین آن سو برگردانید یک ضربهٔ پیاپی حساب می‌شود.",
    "کلیدها: جهت‌ها برای حرکت، ۱ تا ۴ برای نوع ضربه، فاصله برای سرویس."
  ],
  computer: "رایانه", me: "هموند", machine: "شاتل‌انداز",
  serveYou: "سرویس با شماست", serveYouS: "روی زمین بزنید یا کلید فاصله را بزنید", serveOpp: "سرویس با {n}",
  point: "امتیاز برای {n}", r_in: "شاتل در زمین افتاد", r_out: "شاتل بیرون افتاد", r_net: "شاتل به تور خورد", r_fault: "خطای سرویس",
  setWon: "گیم به {n} رسید", matchWon: "{n} برندهٔ مسابقه شد", setPt: "امتیاز گیم", matchPt: "امتیاز مسابقه",
  youWon: "شما بردید!", youLost: "این بار حریف برد", again: "بازی دوباره", menu: "بازگشت به منو", waitHost: "منتظر میزبان برای بازی دوباره…",
  pause: "مکث", resume: "ادامه", exit: "خروج", sndOn: "صدا: روشن", sndOff: "صدا: خاموش", paused: "بازی متوقف شد",
  creating: "در حال ساختن اتاق…", roomT: "اتاق آنلاین", roomP: "این کد را به هموند خود بدهید تا با «پیوستن به اتاق» وارد شود:",
  waitOpp: "منتظر حریف…", oppIn: "{n} وارد اتاق شد", start: "شروع بازی", cancel: "لغو",
  joining: "در حال پیوستن…", joined: "به اتاق پیوستید. منتظر بمانید تا میزبان بازی را شروع کند.",
  noRoom: "اتاقی با این کد پیدا نشد.", connFail: "اتصال برقرار نشد.", lost: "ارتباط با حریف قطع شد.", noPeer: "بخش آنلاین بار نشد؛ اتصال اینترنت را بررسی کنید.",
  noGL: "مرورگر شما گرافیک سه‌بعدی (WebGL) را پشتیبانی نمی‌کند. لطفاً با Chrome یا Safari تازه امتحان کنید.",
  code4: "کد چهاررقمی اتاق را بنویسید.", full: "این اتاق پر است.",
  hint: "بازیکن را با انگشت یا موس به زیر شاتل ببرید؛ ضربه خودبه‌خود زده می‌شود.",
  hintH: "نوع ضربه را با دکمه‌ها یا کلیدهای ۱ تا ۴ انتخاب کنید.",
  hintP: "شاتل‌ها را به زمین آن سوی تور برگردانید. نوع شاتل دستگاه را از دکمه‌ها انتخاب کنید.",
  shots: { clear: "کلیر", drop: "دراپ", smash: "اسمش", drive: "درایو" },
  shotLbl: { clear: "Clear", drop: "Drop", smash: "SMASH!", drive: "Drive", net: "Net shot", lift: "Lift" },
  feed: { mix: "ترکیبی", high: "بلند", net: "تور", smash: "اسمش", drive: "درایو" },
  setW: "گیم", rally: "رالی", streak: "ضربهٔ پیاپی", best: "رکورد", good: "عالی!", miss: "از دست رفت",
  replay: "بازپخش", skip: "برای رد شدن، روی صفحه بزنید",
  statsT: "آمار مسابقه", sPts: "امتیازها", sLong: "طولانی‌ترین رالی", sFast: "سریع‌ترین ضربه", sSmash: "اسمش", sSrv: "امتیاز روی سرویس خود", sAce: "سرویس برنده", kmh: "km/h"
},
sv: {
  title: "Badminton", back: "← Tillbaka till föreningens webbplats", langBtn: "فارسی",
  intro: "Badminton i en riktig tävlingshall: spela mot datorn på fyra nivåer, träna med bollmaskin eller möt en annan medlem online.",
  name: "Ditt namn", namePh: "t.ex. Alborz",
  level: "Nivå",
  lv: { e: "Lätt", m: "Medel", h: "Svår", p: "Proffs" },
  lvd: { e: "Långsam boll, automatiska slag", m: "Automatiska slag", h: "Clear, dropp, smash, drive", p: "Snabb och exakt motståndare" },
  racket: "Racket", def: "Defensiv", defd: "Lätt huvud; längre räckvidd, mer kontroll", all: "Allround", alld: "Balanserad", off: "Offensiv", offd: "Tungt huvud; hårdare smash, fler misstag",
  len: "Matchlängd", len1: "Ett set", len3: "Bäst av 3",
  loading: "Förbereder spelarna", loadFail: "Spelarna kunde inte laddas; spelet körs med enkla figurer.",
  vsAI: "Match mot datorn", practice: "Träna med bollmaskin", mk: "Skapa onlinerum", jn: "Gå med i rum", code: "Rumskod", go: "Gå med",
  rulesT: "Regler och styrning",
  rules: [
    "Ett set spelas till 21 poäng; man måste vinna med 2, och vid 29–29 avgör den trettionde poängen.",
    "Varje boll ger poäng och vinnaren av bollen servar nästa. Vid jämn poäng servar man från höger, vid udda från vänster, och bollen ska landa diagonalt i motståndarens serveruta. Rätt serveruta lyser på golvet.",
    "För spelaren med fingret eller musen dit bollen faller; när bollen når racketen slås den automatiskt. Bollens skugga på golvet hjälper dig att bedöma var den landar.",
    "På Lätt och Medel väljs slaget automatiskt. På Svår och Proffs väljer du själv: clear (högt och djupt), dropp (mjukt nära nätet), smash (hårt och nedåt; bara när bollen är hög) och drive (platt och snabbt). Vid serve betyder dropp kort serve, övriga lång serve.",
    "Träff i kanten av räckvidden, dropp från baklinjen och smash med offensiv racket ger större risk för misstag.",
    "Defensiv racket (lätt huvud) ger längre räckvidd och mer kontroll; offensiv racket (tungt huvud) ger hårdare smash men fler misstag.",
    "Efter långa bollar eller vinnande smashar visas en repris i slow motion; tryck på skärmen för att hoppa över.",
    "I träningsläget matar maskinen bollar i följd. Varje boll du slår tillbaka rätt räknas i din svit.",
    "Tangenter: piltangenterna flyttar spelaren, 1–4 väljer slag, mellanslag för serve."
  ],
  computer: "Datorn", me: "Medlem", machine: "Bollmaskin",
  serveYou: "Din serve", serveYouS: "Tryck på planen eller mellanslag", serveOpp: "{n} servar",
  point: "Poäng till {n}", r_in: "Bollen landade inne", r_out: "Bollen landade ute", r_net: "Bollen tog i nätet", r_fault: "Servfel",
  setWon: "Setet till {n}", matchWon: "{n} vann matchen", setPt: "Setboll", matchPt: "Matchboll",
  youWon: "Du vann!", youLost: "Motståndaren vann den här gången", again: "Spela igen", menu: "Till menyn", waitHost: "Väntar på att värden startar igen…",
  pause: "Paus", resume: "Fortsätt", exit: "Avsluta", sndOn: "Ljud: på", sndOff: "Ljud: av", paused: "Pausad",
  creating: "Skapar rum…", roomT: "Onlinerum", roomP: "Ge den här koden till din motspelare så att hen kan gå med via ”Gå med i rum”:",
  waitOpp: "Väntar på motspelare…", oppIn: "{n} har anslutit", start: "Starta matchen", cancel: "Avbryt",
  joining: "Ansluter…", joined: "Du är med i rummet. Vänta tills värden startar matchen.",
  noRoom: "Hittade inget rum med den koden.", connFail: "Anslutningen misslyckades.", lost: "Anslutningen till motspelaren bröts.", noPeer: "Onlinedelen kunde inte laddas; kontrollera internet.",
  noGL: "Din webbläsare stöder inte 3D-grafik (WebGL). Prova en uppdaterad Chrome eller Safari.",
  code4: "Skriv den fyrsiffriga rumskoden.", full: "Rummet är fullt.",
  hint: "För spelaren under bollen med fingret eller musen; slaget sker automatiskt.",
  hintH: "Välj slag med knapparna eller tangenterna 1–4.",
  hintP: "Slå tillbaka bollarna till andra planhalvan. Välj maskinens boll med knapparna.",
  shots: { clear: "Clear", drop: "Dropp", smash: "Smash", drive: "Drive" },
  shotLbl: { clear: "Clear", drop: "Dropp", smash: "SMASH!", drive: "Drive", net: "Nätboll", lift: "Lyft" },
  feed: { mix: "Blandat", high: "Höga", net: "Nät", smash: "Smash", drive: "Drive" },
  setW: "Set", rally: "Rally", streak: "Svit", best: "Rekord", good: "Snyggt!", miss: "Miss",
  replay: "Repris", skip: "Tryck på skärmen för att hoppa över",
  statsT: "Matchstatistik", sPts: "Poäng", sLong: "Längsta rally", sFast: "Snabbaste slag", sSmash: "Smashar", sSrv: "Poäng på egen serve", sAce: "Serveess", kmh: "km/h"
}
};
function t(k) { return S[LANG][k]; }
function tf(k, n) { return t(k).replace("{n}", n); }

var toastT;
function toast(m) { var e = $("toast"); e.textContent = m; e.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(function () { e.classList.remove("on"); }, 3200); }

/* ---------------- زمین و فیزیک شاتل ---------------- */
var CL = 6.7, CWS = 2.59, CWD = 3.05, NET = 1.55, NETB = 0.79, SSL = 1.98, LSD = 5.94, GR = 9.8, KD = 0.22;
var RT = {
  def: { ctl: 0.65, reach: 1.1, spd: 1.05, smash: -0.19 },
  all: { ctl: 1, reach: 1.0, spd: 1, smash: -0.23 },
  off: { ctl: 1.35, reach: 0.95, spd: 0.97, smash: -0.29 }
};
var LV = {
  e: { ts: 0.55, auto: true, reach: 1.32, pSpd: 6.4, aiSpd: 3.9, aiReact: 0.36, aiErr: 0.2, aiJudge: 0.3, err: 0.6 },
  m: { ts: 0.62, auto: true, reach: 1.2, pSpd: 6.2, aiSpd: 4.6, aiReact: 0.28, aiErr: 0.12, aiJudge: 0.5, err: 0.7 },
  h: { ts: 0.75, auto: false, reach: 1, pSpd: 6.5, aiSpd: 6.0, aiReact: 0.14, aiErr: 0.05, aiJudge: 0.88, err: 1 },
  p: { ts: 0.82, auto: false, reach: 0.96, pSpd: 6.6, aiSpd: 6.9, aiReact: 0.09, aiErr: 0.025, aiJudge: 0.95, err: 1.05 }
};
var SHOT = {
  clear: { ang: 0.74, d: [5.4, 6.4] },
  lift: { ang: 0.98, d: [5.2, 6.2] },
  drop: { ang: 0.17, d: [2.3, 3.1] },
  net: { ang: 0.55, d: [2.1, 2.6] },
  drive: { ang: 0.07, d: [4.6, 6.2] },
  smash: { ang: -0.23, d: [4.0, 6.2] },
  slong: { ang: 0.9, d: [6.0, 6.5] },
  sshort: { ang: 0.26, d: [2.15, 2.6] }
};

function step(s, dt) {
  var v = Math.hypot(s.vx, s.vy, s.vz), k = KD * v;
  s.vx -= k * s.vx * dt; s.vy -= (GR + k * s.vy) * dt; s.vz -= k * s.vz * dt;
  s.x += s.vx * dt; s.y += s.vy * dt; s.z += s.vz * dt;
}
function phys(s, dt, cb) {
  var pz = s.z;
  step(s, dt);
  if (pz * s.z <= 0 && pz !== s.z && Math.abs(s.x) < CWD + 0.08 && s.y < NET && s.y > NETB - 0.05) {
    s.z = pz > 0 ? 0.03 : -0.03; s.vz *= -0.08; s.vx *= 0.2; s.vy = Math.min(s.vy, 0) * 0.2;
    cb("net");
  }
  if (s.y <= 0) { s.y = 0; cb("land"); }
}
function rangeOf(h0, v, ang, nd) {
  var r = 0, y = h0, vr = v * Math.cos(ang), vy = v * Math.sin(ang), ny = null, dt = 1 / 120;
  for (var i = 0; i < 900; i++) {
    var sp = Math.hypot(vr, vy), k = KD * sp;
    vr -= k * vr * dt; vy -= (GR + k * vy) * dt; r += vr * dt; y += vy * dt;
    if (ny === null && nd !== null && r >= nd) ny = y;
    if (y <= 0) break;
  }
  return [r, ny];
}
function plan(s, xt, zt, ang, clear) {
  var dx = xt - s.x, dz = zt - s.z, D = Math.hypot(dx, dz), nd = s.z * zt < 0 ? D * Math.abs(s.z) / Math.abs(dz) : null, v = 10;
  for (var it = 0; it < 12; it++) {
    var lo = 0.5, hi = 80;
    for (var i = 0; i < 24; i++) { var mid = (lo + hi) / 2; if (rangeOf(s.y, mid, ang, null)[0] < D) lo = mid; else hi = mid; }
    v = hi;
    if (!clear || nd === null) break;
    var ny = rangeOf(s.y, v, ang, nd)[1];
    if (ny !== null && ny > NET + 0.1) break;
    ang += 0.07;
  }
  var c = Math.cos(ang);
  s.vx = v * c * dx / D; s.vz = v * c * dz / D; s.vy = v * Math.sin(ang);
}

/* ---------------- وضعیت بازی ---------------- */
var G = null, ME = 0, MODE = null; // ai | practice | host | guest
var peer = null, conn = null, PFX = "anjoman-badminton-";

function mkS() { return { x: 0, y: 1, z: 3, vx: 0, vy: 0, vz: 0, hitter: 0, serve: false, n: 0 }; }
function mkP(p) { var s = p === 0 ? 1 : -1; return { x: 0, z: s * 3.8, tx: 0, tz: s * 3.8, vx: 0, vz: 0, sw: 0, jump: 0, sh: null, aim: 0, walk: 0 }; }
function newStats() { return { pts: [0, 0], long: 0, fast: [0, 0], smash: [0, 0], srv: [0, 0], ace: [0, 0] }; }

function newGame(o) {
  G = {
    lvl: o.lvl, L: LV[o.lvl] || LV.m, best: o.best, names: o.names, rts: o.rts,
    sets: [0, 0], pts: [0, 0], setNo: 1, server: Math.random() < 0.5 ? 0 : 1,
    pl: [mkP(0), mkP(1)], s: mkS(), st: "serve", tm: 0, ev: [], shot: ["clear", "clear"],
    over: false, winner: -1, msg: null, paused: false, ai: { d: 0, pred: null, pn: -1, fe: 0, sv: 0, skip: false }, clock: 0, mark: null, trail: [],
    stats: newStats(), rally: 0, spd: 0, lastHitter: -1, lastSmash: false, rec: [], recT: 0, recMore: 0, rp0: false, rp: null,
    practice: !!o.practice, streak: 0, bestStreak: +(store("bd-streak") || 0), shake: 0, cheer: 0, rserver: 0
  };
  if (G.practice) { G.server = 0; G.st = "point"; G.tm = 1; G.after = "feed"; G.s.y = -5; G.pl[0].z = G.pl[0].tz = 4; }
  else setupServe();
}
function say(m) { G.msg = m; G.msgT = Date.now(); }
function ev(e) { G.ev.push(e); sfx(e); vfx(e); }

function servePos() {
  var p = G.server, even = G.pts[p] % 2 === 0, side = p === 0 ? 1 : -1;
  var sx = (even ? 1 : -1) * side * 0.9;
  return { sx: sx, sz: side * 3.0, rx: -sx, rz: -side * 3.3 };
}
function specialPoint() {
  for (var p = 0; p < 2; p++) {
    var a = G.pts[p], o = G.pts[1 - p];
    if ((a >= 20 && a > o) || a === 29) return G.sets[p] + 1 > G.best / 2 ? "matchPt" : "setPt";
  }
  return "";
}
function setupServe() {
  G.st = "serve"; G.ai.sv = 0; G.ai.pred = null; G.rally = 0; G.rec = []; G.recT = 0; G.lastSmash = false;
  var sp = servePos(), sv = G.pl[G.server], rc = G.pl[1 - G.server];
  sv.x = sv.tx = sp.sx; sv.z = sv.tz = sp.sz; rc.x = rc.tx = sp.rx; rc.z = rc.tz = sp.rz;
  holdS();
  say({ k: "serve", n: G.server, sp: specialPoint() });
}
function holdS() {
  var p = G.pl[G.server], s = G.s, side = G.server === 0 ? 1 : -1;
  s.x = p.x - 0.3 * side; s.z = p.z - 0.32 * side; s.y = 1.0 + 0.04 * Math.sin(G.clock * 3); s.vx = 0; s.vy = -0.1; s.vz = -side * 0.1;
}

function aimFor(p) {
  var o = G.pl[1 - p], me = G.pl[p];
  if (me.aim) { var a = me.aim; me.aim = 0; return clamp(a, -2.3, 2.3); }
  var sgn = Math.random() < 0.72 ? (o.x > 0 ? -1 : 1) : (Math.random() < 0.5 ? -1 : 1);
  var human = MODE !== "ai" || p === 0;
  if (human && Math.abs(me.vx) > 2.5) sgn = me.vx > 0 ? 1 : -1;
  if (G.practice) sgn = Math.random() < 0.5 ? -1 : 1;
  return sgn * rnd(1.1, 2.25);
}
function spd() { var s = G.s; return Math.hypot(s.vx, s.vy, s.vz) * 3.6; }

function doServe(p, kind) {
  if (!G || G.st !== "serve" || p !== G.server || G.over) return;
  if (MODE === "ai" && p === 1) kind = aiServeKind();
  if (!kind) kind = G.L.auto ? "clear" : G.shot[p];
  var s = G.s, side = p === 0 ? 1 : -1, sp = servePos();
  holdS();
  var sh = kind === "drop" ? SHOT.sshort : SHOT.slong;
  var xt = sp.rx > 0 ? rnd(0.5, 2.1) : -rnd(0.5, 2.1), zt = -side * rnd(sh.d[0], sh.d[1]);
  var e = errNoise(p, 0.6);
  plan(s, xt + e[1], zt - side * e[0], sh.ang, true);
  s.hitter = p; s.serve = true; s.n++;
  G.st = "rally"; G.msg = null; G.pl[p].sw = 0.3; G.rally = 0; G.lastHitter = p; G.lastSmash = false; G.spd = spd(); G.rserver = p;
  ev("hit");
  if (p === ME) showShot(kind === "drop" ? "net" : "clear");
}
function errNoise(p, k) {
  var c = RT[G.rts[p]].ctl * G.L.err * k;
  return [(Math.random() - 0.5) * 0.5 * c, (Math.random() - 0.5) * 0.4 * c];
}
function serveBox() { var sp = servePos(); return { sgn: sp.rx > 0 ? 1 : -1, zs: G.server === 0 ? -1 : 1 }; }
function inServeBox(x, z) {
  var b = serveBox();
  return Math.abs(z) >= SSL && Math.abs(z) <= CL + 0.02 && x * b.sgn >= -0.02 && x * b.sgn <= CWS + 0.02;
}
function onEv(e) {
  var s = G.s; if (G.st !== "rally") return;
  if (G.practice) return onPracticeEv(e);
  if (e === "net") { ev("net"); s.net = true; return; }
  if (e === "land") {
    ev("land");
    G.mark = { x: s.x, z: s.z, t: 1.6 };
    var h = s.hitter, side = s.z > 0 ? 0 : 1;
    if (side === h) return award(1 - h, s.serve ? "r_fault" : "r_net");
    var inn = s.serve ? inServeBox(s.x, s.z) : (Math.abs(s.x) <= CWS + 0.02 && Math.abs(s.z) <= CL + 0.02);
    if (inn) award(h, "r_in"); else award(1 - h, s.serve ? "r_fault" : "r_out");
  }
}
function award(w, why) {
  G.pts[w]++; ev("point");
  var st = G.stats; st.pts[w]++; if (G.rally > st.long) st.long = G.rally;
  if (w === G.rserver) { st.srv[w]++; if (G.rally === 0 && why === "r_in") st.ace[w]++; }
  crowd(Math.min(1, 0.35 + G.rally * 0.05 + (G.lastSmash ? 0.3 : 0))); G.cheer = 1.6;
  if (MODE === "ai" && G.rec.length > 40 && (G.rally >= 8 || (G.lastSmash && w === G.lastHitter && why === "r_in"))) G.rp0 = true;
  G.recMore = 0.6;
  var a = G.pts[w], o = G.pts[1 - w];
  G.server = w;
  G.st = "point"; G.tm = 1.5; G.after = "serve";
  if ((a >= 21 && a - o >= 2) || a >= 30) {
    G.sets[w]++;
    if (G.sets[w] > G.best / 2) { G.over = true; G.winner = w; G.tm = 2; G.after = "end"; say({ k: "match", n: w }); crowd(1); return; }
    say({ k: "set", n: w, why: why }); G.tm = 2.3; G.after = "newset"; return;
  }
  say({ k: "point", n: w, why: why });
}

function reachOf(p) { return RT[G.rts[p]].reach * G.L.reach; }
function tryHit(p) {
  var s = G.s, pl = G.pl[p], side = p === 0 ? 1 : -1;
  if (s.hitter === p || s.z * side < 0.05) return false;
  if (G.practice && p === 1) return false;
  var dh = Math.hypot(s.x - pl.x, s.z - pl.z), R = reachOf(p);
  var top = G.L.auto ? 2.75 : 2.95;
  if (dh > R || s.y > top || s.y < 0.12) return false;
  if (s.vy > 0 && s.y > 1.6 && s.vz * side > 0 && Math.abs(s.z) > 2) return false;
  if (MODE === "ai" && p === 1) aiShot();
  hit(p, dh / R);
  return true;
}
function chooseShot(p) {
  var s = G.s, az = Math.abs(s.z), pick = G.L.auto ? null : G.shot[p];
  if (!pick) {
    if (s.y > 2.1 && az < 4.6 && Math.random() < 0.35) pick = "smash";
    else if (s.y > 1.7) pick = Math.random() < 0.7 ? "clear" : "drop";
    else pick = Math.random() < 0.55 ? "drive" : "clear";
  }
  if (pick === "smash" && s.y < 1.9) pick = s.y < 1.1 ? "lift" : "drive";
  if (pick === "clear" && s.y < 1.0) pick = "lift";
  if (pick === "drop" && az < 2.6 && s.y < 1.5) pick = "net";
  if (pick === "drive" && s.y < 0.7) pick = az < 2.6 ? "net" : "lift";
  return pick;
}
function hit(p, edge) {
  var s = G.s, side = p === 0 ? 1 : -1, T = RT[G.rts[p]], L = G.L;
  G.pl[p].hp = [s.x, s.y, s.z];
  var kind = chooseShot(p), sh = SHOT[kind], ang = kind === "smash" ? T.smash : sh.ang;
  var xt = aimFor(p), depth = rnd(sh.d[0], sh.d[1]);
  if (kind === "net" || kind === "drop") xt *= 0.7;
  var e = 0, ex = 0, clear = true, c = T.ctl * L.err;
  if (edge > 0.8) { e += (Math.random() - 0.5) * 2.2 * (edge - 0.8) / 0.2 * c; ex += (Math.random() - 0.5) * 1.4 * (edge - 0.8) / 0.2 * c; }
  e += (Math.random() - 0.5) * 0.5 * c; ex += (Math.random() - 0.5) * 0.4 * c;
  if (kind === "drop" && Math.abs(s.z) > 5 && Math.random() < 0.13 * c) clear = false;
  if (kind === "smash" && Math.random() < 0.06 * c * (T === RT.off ? 1.5 : 1)) e += 1.1;
  if (MODE === "ai" && p === 1) { e += G.ai.fe; if (G.ai.fe < -1) clear = false; }
  var zt = -side * Math.max(0.6, depth + e);
  xt += ex;
  if (!clear) { zt = -side * 0.5; ang = -0.12; }
  plan(s, xt, zt, ang, clear);
  s.hitter = p; s.serve = false; s.n++; s.net = false;
  var pl = G.pl[p]; pl.sw = 0.3; if (kind === "smash") { pl.jump = 0.5; G.shake = 1; }
  G.rally++; G.lastHitter = p; G.lastSmash = kind === "smash"; G.spd = spd();
  if (G.spd > G.stats.fast[p]) G.stats.fast[p] = G.spd;
  if (kind === "smash") G.stats.smash[p]++;
  ev(kind === "smash" ? "smash" : "hit");
  if (p === ME) { showShot(kind); try { if (navigator.vibrate) navigator.vibrate(kind === "smash" ? 25 : 10); } catch (x) {} }
}

/* ---------------- تمرین با دستگاه شاتل‌انداز ---------------- */
var feedType = store("bd-feed") || "mix";
function feedBall() {
  var s = G.s, kind = feedType;
  if (kind === "mix") kind = ["high", "net", "smash", "drive", "high"][Math.floor(Math.random() * 5)];
  s.x = rnd(-0.5, 0.5); s.z = -5.2; s.y = kind === "smash" ? 2.6 : 1.7;
  var xt = rnd(-2.1, 2.1), zt, ang;
  if (kind === "high") { zt = rnd(4.8, 6.2); ang = 0.95; }
  else if (kind === "net") { zt = rnd(2.1, 2.9); ang = 0.5; xt *= 0.8; }
  else if (kind === "smash") { zt = rnd(3.4, 5.6); ang = -0.18; }
  else { zt = rnd(4, 5.8); ang = 0.1; }
  plan(s, xt, zt, ang, true);
  s.hitter = 1; s.serve = false; s.n++; s.net = false;
  G.st = "rally"; G.msg = null; G.rally = 0; G.spd = spd();
  ev("feed");
}
function onPracticeEv(e) {
  var s = G.s;
  if (e === "net") { ev("net"); s.net = true; return; }
  if (e === "land") {
    ev("land"); G.mark = { x: s.x, z: s.z, t: 1.2 };
    if (s.hitter === 1) {
      if (s.z < 0 || Math.abs(s.x) > CWS + 0.05 || s.z > CL + 0.05) { G.st = "point"; G.tm = 0.6; G.after = "feed"; return; }
      return practiceEnd(false);
    }
    practiceEnd(s.z < 0 && Math.abs(s.x) <= CWS + 0.02 && Math.abs(s.z) <= CL + 0.02);
  }
}
function practiceEnd(ok) {
  G.st = "point"; G.after = "feed"; G.tm = ok ? 0.55 : 1;
  if (ok) {
    G.streak++;
    if (G.streak > G.bestStreak) { G.bestStreak = G.streak; store("bd-streak", String(G.bestStreak)); }
    if (G.streak % 10 === 0) { crowd(0.8); G.cheer = 1.4; }
    say({ k: "good" });
  } else { if (G.streak >= 5) crowd(0.4); G.streak = 0; say({ k: "pmiss" }); sfx("miss"); }
}

/* ---------------- رایانه ---------------- */
function predict(p) {
  var s = G.s, c = { x: s.x, y: s.y, z: s.z, vx: s.vx, vy: s.vy, vz: s.vz }, side = p === 0 ? 1 : -1, dt = 1 / 120, hc = 2.35, pick = null, land = null;
  for (var i = 0; i < 700; i++) {
    step(c, dt);
    if (!pick && c.z * side > 0.3 && c.y <= hc && (c.vy < 0 || c.y < 1.6)) pick = { x: c.x, z: c.z };
    if (c.y <= 0) { land = { x: c.x, z: c.z }; break; }
    if (c.z * side < -0.05 && Math.abs(c.z) < 0.2 && c.y < NET) return { net: true };
  }
  if (!land) land = { x: c.x, z: c.z };
  var out = Math.abs(land.x) > CWS || Math.abs(land.z) > CL || land.z * side < 0;
  if (!pick) pick = land;
  return { x: pick.x, z: pick.z, out: out };
}
function aiThink(dtR, dtS) {
  var A = G.ai, pl = G.pl[1], s = G.s, L = G.L;
  if (G.st === "serve") {
    if (G.server === 1) { A.sv += dtR; if (A.sv > 1.2) doServe(1); }
    move(pl, dtS, L.aiSpd);
    return;
  }
  if (G.st === "rally" && s.hitter === 0) {
    if (A.pn !== s.n) {
      A.d += dtR;
      if (A.d >= L.aiReact) {
        A.pred = predict(1); A.pn = s.n; A.d = 0; A.fe = 0;
        A.skip = !!(A.pred && A.pred.out && Math.random() < L.aiJudge);
        if (A.pred && !A.pred.net) {
          A.off = (Math.random() - 0.5) * 0.3;
          if (Math.random() < L.aiErr) { if (Math.random() < 0.4) A.off += (Math.random() < 0.5 ? -1 : 1) * 1.6; else A.fe = Math.random() < 0.5 ? -1.5 : 1.0; }
        }
      }
    }
    if (A.pred && !A.pred.net && !A.skip) { pl.tx = clamp(A.pred.x + A.off, -3.2, 3.2); pl.tz = clamp(A.pred.z, -7.6, -0.6); }
    else if (A.skip) { pl.tx = A.pred.x > 0 ? A.pred.x - 1.8 : A.pred.x + 1.8; pl.tz = -4; }
  } else if (G.st === "rally") { pl.tx = pl.tx * 0.6; pl.tz = -4.0; }
  move(pl, dtS, L.aiSpd);
}
function move(pl, dtS, sp) {
  var dx = pl.tx - pl.x, dz = pl.tz - pl.z, d = Math.hypot(dx, dz), mx = sp * dtS, ox = pl.x, oz = pl.z;
  if (mx <= 0) return;
  if (d > mx) { pl.x += dx / d * mx; pl.z += dz / d * mx; } else { pl.x = pl.tx; pl.z = pl.tz; }
  var k = dtS > 0 ? 1 / dtS : 0;
  pl.vx += ((pl.x - ox) * k - pl.vx) * 0.3; pl.vz += ((pl.z - oz) * k - pl.vz) * 0.3;
}
function aiShot() {
  var s = G.s, hard = !G.L.auto, h = G.pl[0], q = Math.random(), pick;
  if (!hard) { G.shot[1] = null; return; }
  var pro = G.lvl === "p";
  if (s.y > 2.1 && Math.abs(s.z) < 5.2 && q < (pro ? 0.72 : 0.6)) pick = "smash";
  else if (h.z < 3.2) pick = q < 0.75 ? "clear" : "drive";
  else if (h.z > 5) pick = q < (pro ? 0.7 : 0.6) ? "drop" : "clear";
  else pick = q < 0.4 ? "clear" : q < 0.7 ? "drop" : "drive";
  G.shot[1] = pick;
}
function aiServeKind() { return !G.L.auto && Math.random() < 0.45 ? "drop" : "clear"; }

/* ---------------- صدا ---------------- */
var AC = null, muted = store("bd-mute") === "1", NB = null, CROWD = null;
function audio() { if (AC) return AC; try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { AC = null; } return AC; }
function tone(f, t0, dur, vol, type) { var a = AC, o = a.createOscillator(), g = a.createGain(); o.type = type || "sine"; o.frequency.value = f; g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur); o.connect(g).connect(a.destination); o.start(t0); o.stop(t0 + dur + 0.05); }
function sfx(k) {
  if (muted || !AC) return;
  var a = AC, t0 = a.currentTime;
  if (k === "point") { tone(660, t0, 0.25, 0.12); tone(990, t0 + 0.12, 0.3, 0.12); return; }
  if (k === "miss") { tone(300, t0, 0.2, 0.08, "triangle"); tone(220, t0 + 0.1, 0.25, 0.08, "triangle"); return; }
  if (!NB) { NB = a.createBuffer(1, a.sampleRate * 0.12, a.sampleRate); var d = NB.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 4); }
  var P2 = { hit: [2600, 0.9, 3], feed: [900, 0.5, 2], smash: [1800, 1.5, 1.5], land: [700, 0.35, 1], net: [380, 0.45, 1.5] }[k]; if (!P2) return;
  var src = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
  src.buffer = NB; f.type = "bandpass"; f.frequency.value = P2[0]; f.Q.value = P2[2]; g.gain.value = P2[1];
  src.connect(f).connect(g).connect(a.destination); src.start(t0);
  if (k === "smash") tone(180, t0, 0.12, 0.2, "triangle");
}
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
var UP = null;

function initGL() {
  if (GL) return true;
  if (!THREE) return false;
  var canvas = document.createElement("canvas"), r;
  canvas.className = "gl";
  try { r = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: "high-performance" }); } catch (e) { return false; }
  var mob = /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent);
  r.setPixelRatio(Math.min(mob ? 1.75 : 2, window.devicePixelRatio || 1));
  r.outputEncoding = THREE.sRGBEncoding; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 0.95;
  r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
  var scene = new THREE.Scene(); scene.background = new THREE.Color(0x0a0d16); scene.fog = new THREE.Fog(0x0a0d16, 28, 70);
  var cam = new THREE.PerspectiveCamera(42, 1, 0.1, 120);
  UP = new THREE.Vector3(0, 1, 0);
  GL = { r: r, scene: scene, cam: cam, canvas: canvas, aniso: r.capabilities.getMaxAnisotropy(), o: {}, tex: [], mob: mob,
    camLook: new THREE.Vector3(0, 0, -1.5), ray: new THREE.Raycaster(), tmpV: new THREE.Vector3(), tmpV2: new THREE.Vector3(), q: new THREE.Quaternion(),
    plane: new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), hit: new THREE.Vector3(), W: 1, H: 1, t: 0 };
  buildHall();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refreshTextures);
  return true;
}
function refreshTextures() { if (!GL) return; GL.tex.forEach(redraw); GL.scoreKey = ""; }

function boardTex(kind) {
  return cTex(1024, 256, function (c, w, h) {
    var g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#1f6b4a"); g.addColorStop(1, "#124a32"); c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.fillStyle = "#e0a63a"; c.fillRect(0, h - 22, w, 10);
    c.textBaseline = "middle";
    if (kind === 0) {
      if (logoOk) c.drawImage(logo, 24, 28, 176, 176);
      c.fillStyle = "#ffffff"; c.font = "800 78px Vazirmatn, Tahoma, sans-serif"; c.textAlign = "left"; c.direction = "ltr";
      c.fillText("ANJOMAN", 226, 92); c.fillStyle = "#ffd77a"; c.font = "700 50px Vazirmatn, Tahoma, sans-serif"; c.fillText("SUNDBYBERG", 230, 166);
    } else {
      c.fillStyle = "#ffffff"; c.font = "800 70px Vazirmatn, Tahoma, sans-serif"; c.textAlign = "center"; c.direction = "rtl";
      c.fillText("انجمن ایرانیان سوندبی‌بری", w / 2, h / 2 - 8);
    }
  });
}

function buildHall() {
  var sc = GL.scene, o = GL.o, i, k, s;
  /* نور سالن */
  sc.add(new THREE.HemisphereLight(0xdfe8ff, 0x3a2a1a, 0.55));
  sc.add(new THREE.AmbientLight(0x404a66, 0.25));
  var sun = new THREE.DirectionalLight(0xfff3e0, 1.25);
  sun.position.set(3.5, 14, 4); sun.target.position.set(0, 0, 0); sun.castShadow = true;
  var sm = GL.mob ? 1024 : 2048; sun.shadow.mapSize.set(sm, sm);
  var scam = sun.shadow.camera; scam.left = -6; scam.right = 6; scam.top = 9.5; scam.bottom = -9.5; scam.near = 2; scam.far = 30; sun.shadow.bias = -0.0006;
  sc.add(sun, sun.target);
  var fill = new THREE.DirectionalLight(0xbcd0ff, 0.35); fill.position.set(-6, 9, -8); sc.add(fill);
  var sp = new THREE.SpotLight(0xffffff, 0.8, 40, 0.7, 0.8, 1); sp.position.set(0, 13, 0); sp.target.position.set(0, 0, 0); sc.add(sp, sp.target);

  /* کف چوبی پارکت */
  var wood = cTex(512, 512, function (c, w, h) {
    var pw = 64;
    for (var x = 0; x < w; x += pw) for (var y = 0; y < h; y += 256) {
      var off = (x / pw) % 2 ? 128 : 0, l = 58 + Math.random() * 10;
      c.fillStyle = "hsl(" + (28 + Math.random() * 6) + " 48% " + l + "%)"; c.fillRect(x, y - off, pw, 256); c.fillRect(x, y - off + 512, pw, 256);
      for (var j = 0; j < 10; j++) { c.fillStyle = "rgba(120,70,30," + (0.05 + Math.random() * 0.06) + ")"; c.fillRect(x + Math.random() * pw, 0, 1 + Math.random() * 2, h); }
      c.fillStyle = "rgba(60,30,10,0.35)"; c.fillRect(x, 0, 1.5, h); c.fillRect(x, y - off, pw, 1.5);
    }
  }, [6, 9]);
  var floor = mesh(new THREE.PlaneGeometry(22, 36), std(0xffffff, { map: wood, roughness: 0.42 }), 0, -0.002, 0, false, true);
  floor.rotation.x = -Math.PI / 2; sc.add(floor);

  /* زمین سبز با خطوط دقیق */
  var MW = 7.6, ML = 15.4;
  var court = cTex(760, 1540, function (c, w, h) {
    c.fillStyle = "#2a7a52"; c.fillRect(0, 0, w, h);
    for (var n = 0; n < 6000; n++) { c.fillStyle = Math.random() < 0.5 ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.05)"; c.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
    var sx = w / MW, sz = h / ML, lw = 0.04;
    function X(x) { return (x + MW / 2) * sx; } function Z(z) { return (z + ML / 2) * sz; }
    c.fillStyle = "#f6f6f2";
    function lineX(z, x0, x1) { c.fillRect(X(x0), Z(z) - lw * sz / 2, (x1 - x0) * sx, lw * sz); }
    function lineZ(x, z0, z1) { c.fillRect(X(x) - lw * sx / 2, Z(z0), lw * sx, (z1 - z0) * sz); }
    [-CWD, -CWS, CWS, CWD].forEach(function (x) { lineZ(x, -CL, CL); });
    [-CL, -LSD, -SSL, SSL, LSD, CL].forEach(function (z) { lineX(z, -CWD, CWD); });
    lineZ(0, -CL, -SSL); lineZ(0, SSL, CL);
  });
  var mat = mesh(new THREE.PlaneGeometry(MW, ML), std(0xffffff, { map: court, roughness: 0.7 }), 0, 0.002, 0, false, true);
  mat.rotation.x = -Math.PI / 2; sc.add(mat);

  /* خانهٔ سرویس درخشان */
  o.box = mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color: 0xffe066, transparent: true, opacity: 0.3, depthWrite: false, blending: THREE.AdditiveBlending, polygonOffset: true, polygonOffsetFactor: -4 }), 0, 0.02, 0);
  o.box.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(1, 1)), new THREE.LineBasicMaterial({ color: 0xffd23f })));
  o.box.rotation.x = -Math.PI / 2; o.box.visible = false; sc.add(o.box);

  /* تور و تیرک‌ها */
  var netTex = cTex(512, 128, function (c, w, h) {
    c.clearRect(0, 0, w, h); c.strokeStyle = "rgba(25,28,35,0.9)"; c.lineWidth = 1.2;
    for (var x = 0; x <= w; x += 8) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); }
    for (var y = 0; y <= h; y += 8) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
  });
  netTex.wrapS = THREE.RepeatWrapping; netTex.repeat.set(4, 1);
  sc.add(mesh(new THREE.PlaneGeometry(CWD * 2 + 0.1, NET - NETB), new THREE.MeshStandardMaterial({ map: netTex, transparent: true, side: THREE.DoubleSide, depthWrite: false, roughness: 0.9 }), 0, (NET + NETB) / 2, 0, true, false));
  sc.add(mesh(new THREE.BoxGeometry(CWD * 2 + 0.1, 0.06, 0.012), std(0xf6f6f2), 0, NET - 0.03, 0, true, false));
  var post = std(0x1f6b4a, { metalness: 0.4, roughness: 0.4 });
  [-1, 1].forEach(function (q) {
    sc.add(mesh(new THREE.CylinderGeometry(0.025, 0.025, NET + 0.02, 12), post, q * (CWD + 0.06), (NET + 0.02) / 2, 0, true, false));
    sc.add(mesh(new THREE.BoxGeometry(0.34, 0.06, 0.6), std(0x16191f, { metalness: 0.3 }), q * (CWD + 0.2), 0.03, 0, true, true));
  });

  /* دیواره‌های تبلیغاتی */
  var bA = boardTex(0), bB = boardTex(1); GL.tex.push(bA, bB);
  var side = std(0x0d3324, { roughness: 0.7 });
  function panel(x, z, ry, i2) {
    var face = std(0xffffff, { map: i2 % 2 ? bB : bA, roughness: 0.55, emissive: 0x06180f, emissiveIntensity: 0.5 });
    var m = mesh(new THREE.BoxGeometry(2.4, 0.8, 0.06), [side, side, side, side, face, side], x, 0.4, z, true, true);
    m.rotation.y = ry; sc.add(m);
  }
  for (i = 0; i < 4; i++) panel(-3.6 + i * 2.4, -9.6, 0, i);
  for (i = 0; i < 7; i++) { panel(-5.4, -8.2 + i * 2.4, Math.PI / 2, i + 1); panel(5.4, -8.2 + i * 2.4, -Math.PI / 2, i); }

  /* سکوها و تماشاگران */
  var tierM = std(0x1d2230, { roughness: 0.9 }), seats = [];
  for (i = 0; i < 7; i++) {
    var hh = 0.5 * (i + 1), d = 1.0;
    sc.add(mesh(new THREE.BoxGeometry(16, hh, d), tierM, 0, hh / 2, -10.8 - i * d, false, true));
    for (s = -1; s <= 1; s += 2) sc.add(mesh(new THREE.BoxGeometry(d, hh, 19), tierM, s * (6.6 + i * d), hh / 2, -0.8, false, true));
    for (k = 0; k < 26; k++) if (Math.random() < 0.82) seats.push([-7.2 + k * 0.58 + rnd(-0.05, 0.05), hh, -10.8 - i * d]);
    for (s = -1; s <= 1; s += 2) for (k = 0; k < 30; k++) if (Math.random() < 0.78) seats.push([s * (6.6 + i * d), hh, -9.6 + k * 0.6]);
  }
  var pal = [0xc62828, 0x1e88e5, 0xfdd835, 0x43a047, 0xffffff, 0x8e24aa, 0xff7043, 0x263238, 0x90a4ae, 0x5d4037];
  var bodies = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.17, 0.21, 0.55, 8), std(0xffffff, { roughness: 0.85 }), seats.length);
  var heads = new THREE.InstancedMesh(new THREE.SphereGeometry(0.115, 10, 8), std(0xffffff, { roughness: 0.7 }), seats.length);
  var skin = [0xe0b48a, 0xc68a5e, 0x8d5a3b, 0xf1c9a5, 0xa86f48], mtx = new THREE.Matrix4(), col = new THREE.Color();
  seats.forEach(function (p, j) {
    mtx.makeTranslation(p[0], p[1] + 0.28, p[2]); bodies.setMatrixAt(j, mtx); col.setHex(pal[j % pal.length]).multiplyScalar(0.55); bodies.setColorAt(j, col);
    mtx.makeTranslation(p[0], p[1] + 0.68, p[2]); heads.setMatrixAt(j, mtx); col.setHex(skin[j % skin.length]).multiplyScalar(0.65); heads.setColorAt(j, col);
  });
  sc.add(bodies, heads);
  o.crowd = { bodies: bodies, heads: heads, seats: seats, ph: seats.map(function () { return Math.random() * 6.28; }), on: false };

  /* دیوار ته سالن، پرچم‌ها و صفحهٔ نمایش */
  sc.add(mesh(new THREE.PlaneGeometry(30, 14), std(0x151a26, { roughness: 0.9 }), 0, 7, -18.5));
  var scr = cTex(1024, 360, drawScreen); GL.tex.push(scr); o.screenTex = scr;
  sc.add(mesh(new THREE.BoxGeometry(6.4, 2.3, 0.15), std(0x111318, { metalness: 0.5, roughness: 0.5 }), 0, 7.2, -17.6));
  sc.add(mesh(new THREE.PlaneGeometry(6.1, 2.1), new THREE.MeshBasicMaterial({ map: scr, toneMapped: false, fog: false }), 0, 7.2, -17.51));
  var flagCols = [0x239f40, 0xffffff, 0xda0000, 0x006aa7, 0xfecc00, 0xe0a63a];
  for (i = 0; i < 6; i++) {
    var fl = mesh(new THREE.PlaneGeometry(1.1, 1.7), std(flagCols[i], { side: THREE.DoubleSide, roughness: 0.8 }), -7 + i * 2.8, 9.2, -12);
    sc.add(fl);
  }
  /* سقف و چراغ‌ها */
  var lampM = new THREE.MeshBasicMaterial({ color: 0xfff6e2 });
  for (i = -2; i <= 2; i++) for (k = -1; k <= 1; k += 2) sc.add(mesh(new THREE.BoxGeometry(1.2, 0.08, 0.5), lampM, k * 2.6, 12, i * 4));
  var truss = std(0x2b2f3a, { metalness: 0.6, roughness: 0.4 });
  [-2.6, 2.6].forEach(function (x) { sc.add(mesh(new THREE.BoxGeometry(0.16, 0.16, 20), truss, x, 12.15, 0)); });

  /* صندلی داور */
  var chair = new THREE.Group(), cm = std(0x2b2f3a, { metalness: 0.5, roughness: 0.4 });
  [[-0.3, -0.3], [0.3, -0.3], [-0.3, 0.3], [0.3, 0.3]].forEach(function (q) { var l = mesh(new THREE.BoxGeometry(0.05, 1.7, 0.05), cm, q[0] * 0.8, 0.85, q[1] * 0.8, true, false); l.rotation.z = q[0] * 0.08; l.rotation.x = -q[1] * 0.08; chair.add(l); });
  chair.add(mesh(new THREE.BoxGeometry(0.6, 0.06, 0.6), std(0x1f6b4a), 0, 1.72, 0, true, false));
  chair.add(mesh(new THREE.BoxGeometry(0.06, 0.6, 0.6), std(0x1a5440), 0.3, 2.0, 0, true, false));
  var ump = mkPlayer(0x20242e, 0x111111); ump.g.position.set(0, 1.0, 0); ump.g.rotation.y = -Math.PI / 2; ump.g.scale.setScalar(0.95);
  chair.add(ump.g); chair.position.set(CWD + 1.35, 0, 0); sc.add(chair);
  ump.static = true; poseStatic(ump); o.ump = ump; o.umpSeat = [CWD + 1.35, 1.75, 0];
  /* صندلی داوران خط */
  o.judges = [];
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (q) {
    var jx = q[0] * (CWD + 0.75), jz = q[1] * (CL + 0.7), jc = new THREE.Group();
    jc.add(mesh(new THREE.BoxGeometry(0.46, 0.05, 0.44), std(0x1f6b4a), 0, 0.46, 0, true, true));
    jc.add(mesh(new THREE.BoxGeometry(0.46, 0.46, 0.05), std(0x1a5440), 0, 0.72, -0.2, true, false));
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (l) { jc.add(mesh(new THREE.BoxGeometry(0.035, 0.46, 0.035), cm, l[0] * 0.2, 0.23, l[1] * 0.19, true, false)); });
    var ry = q[1] < 0 ? 0 : Math.PI;
    jc.position.set(jx, 0, jz); jc.rotation.y = ry; sc.add(jc);
    o.judges.push([jx, 0.48, jz, ry]);
  });

  /* شاتل، سایه، دنباله */
  o.sh = mkShuttle(); sc.add(o.sh);
  o.blob = mesh(new THREE.CircleGeometry(0.06, 20), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.4, depthWrite: false }));
  o.blob.rotation.x = -Math.PI / 2; sc.add(o.blob);
  o.trail = [];
  for (i = 0; i < 8; i++) { var tm = new THREE.Mesh(new THREE.SphereGeometry(0.022 * (1 - i * 0.08), 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false })); sc.add(tm); o.trail.push(tm); }
  o.ring = mesh(new THREE.RingGeometry(0.16, 0.2, 32), new THREE.MeshBasicMaterial({ color: 0xffd23f, transparent: true, opacity: 0, depthWrite: false }), 0, 0.008, 0);
  o.ring.rotation.x = -Math.PI / 2; sc.add(o.ring);

  /* بازیکنان و دستگاه */
  o.p0 = mkPlayer(0xc62828, 0x1a1d24); o.p1 = mkPlayer(0x1f4fb3, 0x1a1d24);
  sc.add(o.p0.g, o.p0.ext, o.p0.arm, o.p0.rk, o.p1.g, o.p1.ext, o.p1.arm, o.p1.rk);
  o.machine = mkMachine(); sc.add(o.machine);

  o.sparks = [];
  var spG = new THREE.SphereGeometry(0.02, 6, 4);
  for (i = 0; i < 30; i++) { var pm = new THREE.Mesh(spG, new THREE.MeshBasicMaterial({ color: 0xfff2c4, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })); pm.visible = false; sc.add(pm); o.sparks.push({ m: pm, v: new THREE.Vector3(), life: 0 }); }
}

/* شاتل سه‌بعدی: سر چوب‌پنبه و دامن پر */
function mkShuttle() {
  var g = new THREE.Group();
  var feather = cTex(256, 64, function (c, w, h) {
    c.fillStyle = "#fbfbf6"; c.fillRect(0, 0, w, h);
    c.strokeStyle = "rgba(120,125,135,0.55)"; c.lineWidth = 1.2;
    for (var x = 0; x < w; x += 16) { c.beginPath(); c.moveTo(x, h); c.lineTo(x + 4, 0); c.stroke(); }
    c.fillStyle = "rgba(200,40,40,0.8)"; c.fillRect(0, h * 0.45, w, 5);
  });
  var skirt = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.013, 0.07, 16, 1, true), new THREE.MeshStandardMaterial({ map: feather, side: THREE.DoubleSide, roughness: 0.7, transparent: true, opacity: 0.95 }));
  skirt.position.y = 0.045; skirt.castShadow = true;
  var cork = new THREE.Mesh(new THREE.SphereGeometry(0.0135, 14, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), std(0xf2e6cf, { roughness: 0.6 }));
  cork.position.y = 0.012; cork.castShadow = true;
  var band = mesh(new THREE.CylinderGeometry(0.0138, 0.0138, 0.012, 14), std(0x1a6b4a), 0, 0.012, 0);
  g.add(skirt, cork, band);
  g.scale.setScalar(1.9);
  return g;
}

/* بازیکن سه‌بعدی ساده با دست راکت‌دار */
function limb(r1, r2, mat) { var gg = new THREE.CylinderGeometry(r1, r2, 1, 10); gg.translate(0, 0.5, 0); var m = new THREE.Mesh(gg, mat); m.castShadow = true; return m; }
function mkPlayer(shirt, shorts) {
  var g = new THREE.Group(), skinM = std(0xd9a77c, { roughness: 0.7 }), shirtM = std(shirt, { roughness: 0.7 }), shortM = std(shorts, { roughness: 0.8 }), shoeM = std(0xf4f4f4, { roughness: 0.5 }), hairM = std(0x2b1d14, { roughness: 0.8 });
  var body = new THREE.Group(); g.add(body);
  var torso = mesh(new THREE.CylinderGeometry(0.2, 0.16, 0.56, 14), shirtM, 0, 1.2, 0, true, false); torso.scale.z = 0.7; body.add(torso);
  var hips = mesh(new THREE.CylinderGeometry(0.165, 0.17, 0.2, 12), shortM, 0, 0.88, 0, true, false); hips.scale.z = 0.75; body.add(hips);
  body.add(mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.08, 8), skinM, 0, 1.52, 0, true, false));
  var head = mesh(new THREE.SphereGeometry(0.115, 16, 12), skinM, 0, 1.64, 0, true, false); body.add(head);
  var hair = mesh(new THREE.SphereGeometry(0.12, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.55), hairM, 0, 1.655, -0.01, true, false); body.add(hair);
  var lArm = limb(0.04, 0.035, skinM); lArm.position.set(0.22, 1.45, 0); lArm.rotation.z = Math.PI - 0.25; body.add(lArm);
  var ext = new THREE.Group();
  var sleeve = mesh(new THREE.SphereGeometry(0.075, 10, 8), shirtM, 0, 0, 0, true, false); ext.add(sleeve);
  var legs = [], shoes = [];
  for (var i = 0; i < 2; i++) { var lg = limb(0.06, 0.045, skinM); ext.add(lg); legs.push(lg); var sh = mesh(new THREE.BoxGeometry(0.1, 0.07, 0.24), shoeM, 0, 0, 0, true, false); ext.add(sh); shoes.push(sh); }
  /* دست راکت‌دار و راکت در فضای جهان */
  var arm = limb(0.042, 0.035, skinM);
  var rk = new THREE.Group(), frameM = std(0x22252c, { metalness: 0.5, roughness: 0.35 }), gripM = std(shirt, { roughness: 0.6 });
  var grip = mesh(new THREE.CylinderGeometry(0.014, 0.016, 0.2, 10), gripM, 0, 0.1, 0, true, false);
  var shaft = mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.28, 6), frameM, 0, 0.34, 0, true, false);
  var head2 = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.007, 8, 32), frameM); head2.scale.set(0.82, 1.08, 1); head2.position.y = 0.58; head2.castShadow = true;
  var strTex = cTex(64, 64, function (c, w, h) { c.clearRect(0, 0, w, h); c.strokeStyle = "rgba(255,255,255,0.75)"; c.lineWidth = 1; for (var x = 2; x < w; x += 5) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); c.beginPath(); c.moveTo(0, x); c.lineTo(w, x); c.stroke(); } });
  var strings = new THREE.Mesh(new THREE.CircleGeometry(0.1, 24), new THREE.MeshBasicMaterial({ map: strTex, transparent: true, side: THREE.DoubleSide, depthWrite: false })); strings.scale.set(0.82, 1.08, 1); strings.position.y = 0.58;
  rk.add(grip, shaft, head2, strings);
  var mats = [skinM, shirtM, shortM, shoeM, hairM, frameM, gripM];
  return { g: g, ext: ext, body: body, legs: legs, shoes: shoes, arm: arm, rk: rk, sleeve: sleeve, mats: mats };
}
function setLimb(m, a, b) {
  var d = GL.tmpV2.copy(b).sub(a), L = d.length() || 0.001;
  m.position.copy(a); GL.q.setFromUnitVectors(UP, d.multiplyScalar(1 / L)); m.quaternion.copy(GL.q); m.scale.set(1, L, 1);
}
function poseStatic(P) {
  P.legs.forEach(function (lg, i) { lg.visible = false; P.shoes[i].visible = false; });
  P.arm.visible = P.rk.visible = P.sleeve.visible = false;
}
/* قرار دادن بازیکن در صحنه: x,z، جهت، تاب ضربه، پرش و دست به سوی شاتل */
function posePlayer(P, st, p, sx, sz, sw, jump, walk, vx, vz, shuttle, alpha, show) {
  P.g.visible = P.arm.visible = P.rk.visible = P.sleeve.visible = show;
  P.legs.forEach(function (l) { l.visible = show; }); P.shoes.forEach(function (l) { l.visible = show; });
  if (!show) return;
  var face = p === 0 ? -1 : 1, jy = jump > 0 ? Math.sin(Math.PI * (1 - jump / 0.5)) * 0.42 : 0;
  P.g.position.set(sx, 0, sz);
  P.g.rotation.y = p === 0 ? Math.PI : 0;
  P.body.position.y = jy;
  var lean = clamp(vz * face * 0.04, -0.15, 0.2), roll = clamp(-vx * 0.03 * face, -0.15, 0.15);
  P.body.rotation.set(lean, 0, roll);
  /* پاها */
  var ws = Math.sin(walk) * 0.22 * clamp(Math.hypot(vx, vz) / 3, 0, 1);
  var right = -face; /* سمت راست بازیکن در محور x جهان */
  for (var i = 0; i < 2; i++) {
    var sd = i === 0 ? 1 : -1, fx = sx + sd * 0.11 * right, fz = sz + face * (i === 0 ? ws : -ws);
    var hip = GL.tmpV.set(sx + sd * 0.1 * right, 0.85 + jy, sz).clone();
    var foot = new THREE.Vector3(fx, 0.06 + (jy > 0 ? jy * 0.6 : Math.max(0, (i === 0 ? ws : -ws)) * 0.25), fz);
    setLimb(P.legs[i], foot, hip);
    P.shoes[i].position.set(fx, foot.y - 0.025, fz + face * 0.05); P.shoes[i].rotation.y = P.g.rotation.y;
  }
  /* دست راکت‌دار */
  var shoulder = new THREE.Vector3(sx + 0.22 * right, 1.45 + jy, sz);
  var rest = new THREE.Vector3(sx + 0.42 * right, 1.25 + jy, sz + face * 0.25);
  var hand = rest;
  if (shuttle) {
    var dd = Math.hypot(shuttle.x - sx, shuttle.z - sz);
    if (dd < 2.4 && shuttle.y < 3.4 && shuttle.y > 0.05) {
      var k = clamp(1 - (dd - 0.6) / 1.8, 0, 1);
      hand = new THREE.Vector3(rest.x + (shuttle.x - rest.x) * k * 0.5, rest.y + (Math.min(shuttle.y, 2.4) - rest.y) * k * 0.6, rest.z + (shuttle.z - rest.z) * k * 0.3);
    }
  }
  if (sw > 0) { var ph = 1 - sw / 0.3, a = Math.sin(ph * Math.PI); hand = new THREE.Vector3(hand.x - right * 0.25 * a, hand.y + 0.45 * a, hand.z + face * 0.35 * a); }
  var dir = hand.clone().sub(shoulder); if (dir.length() > 0.6) dir.setLength(0.6);
  var handP = shoulder.clone().add(dir);
  setLimb(P.arm, shoulder, handP);
  P.sleeve.position.copy(shoulder);
  P.rk.position.copy(handP);
  var rdir = dir.clone().normalize();
  if (sw <= 0) rdir.add(new THREE.Vector3(0, 0.9, 0)).normalize();
  GL.q.setFromUnitVectors(UP, rdir); P.rk.quaternion.copy(GL.q);
  P.rk.rotateY(face > 0 ? 0 : Math.PI);
  for (var m = 0; m < P.mats.length; m++) { P.mats[m].transparent = alpha < 1; P.mats[m].opacity = alpha; P.mats[m].depthWrite = alpha >= 1; }
}
function mkMachine() {
  var g = new THREE.Group(), body = std(0x2c3340, { metalness: 0.3, roughness: 0.5 });
  g.add(mesh(new THREE.BoxGeometry(0.5, 0.35, 0.45), body, 0, 1.35, 0, true, false));
  var tube = mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.9, 16, 1, true), new THREE.MeshStandardMaterial({ color: 0xbfd8ff, transparent: true, opacity: 0.35, side: THREE.DoubleSide }), 0, 1.95, -0.05); g.add(tube);
  for (var i = 0; i < 10; i++) { var s = mkShuttle(); s.scale.setScalar(1.3); s.position.set(0, 1.6 + i * 0.08, -0.05); g.add(s); }
  var noz = mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.3, 16), std(0xff8a1f), 0, 1.45, 0.3, true, false); noz.rotation.x = Math.PI / 2 - 0.4; g.add(noz);
  var leg = std(0x15171c, { metalness: 0.5 });
  [[-1, -1], [1, -1], [0, 1]].forEach(function (q) { var l = mesh(new THREE.BoxGeometry(0.04, 1.3, 0.04), leg, q[0] * 0.25, 0.62, q[1] * 0.25, true, false); l.rotation.z = -q[0] * 0.18; l.rotation.x = q[1] * 0.18; g.add(l); });
  g.position.set(0, 0, -5.6);
  return g;
}

function drawScreen(c, w, h) {
  c.fillStyle = "#05070c"; c.fillRect(0, 0, w, h);
  var g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#0f3a29"); g.addColorStop(1, "#061a12"); c.fillStyle = g; c.fillRect(8, 8, w - 16, h - 16);
  c.textBaseline = "middle";
  var st = G || DEMO; if (!st) return;
  if (logoOk) c.drawImage(logo, 24, h / 2 - 70, 140, 140);
  if (st.practice) {
    c.fillStyle = "#ffd77a"; c.font = "800 54px Vazirmatn, Tahoma, sans-serif"; c.textAlign = "center"; c.direction = LANG === "fa" ? "rtl" : "ltr";
    c.fillText(t("streak"), w / 2 + 60, 110); c.fillStyle = "#fff"; c.font = "900 140px Vazirmatn, Tahoma, sans-serif"; c.fillText(num(st.streak || 0), w / 2 + 60, 235);
    return;
  }
  for (var i = 0; i < 2; i++) {
    var y = 120 + i * 120, nm = String(st.names[i] || ""); if (nm.length > 11) nm = nm.slice(0, 10) + "…";
    if (st.server === i && !st.over) { c.fillStyle = "#ffd23f"; c.beginPath(); c.arc(196, y, 13, 0, 7); c.fill(); }
    c.fillStyle = "#fff"; c.font = "800 62px Vazirmatn, Tahoma, sans-serif";
    c.direction = /[؀-ۿ]/.test(nm) ? "rtl" : "ltr"; c.textAlign = c.direction === "rtl" ? "right" : "left";
    c.fillText(nm, c.direction === "rtl" ? 620 : 226, y);
    c.direction = "ltr"; c.textAlign = "center";
    c.fillStyle = "#14402c"; c.fillRect(680, y - 50, 120, 100); c.fillStyle = "#ffb02e"; c.font = "800 76px 'Courier New', monospace"; c.fillText(String(st.sets[i]), 740, y + 4);
    c.fillStyle = "#c62828"; c.fillRect(820, y - 50, 170, 100); c.fillStyle = "#fff"; c.font = "900 82px 'Courier New', monospace"; c.fillText(String(st.pts[i]), 905, y + 4);
  }
}

function vfx(e) {
  if (!GL || !G) return;
  var s = G.s, o = GL.o;
  if (e === "hit" || e === "smash" || e === "feed") {
    var n = e === "smash" ? 16 : 7;
    for (var i = 0, k = 0; i < o.sparks.length && k < n; i++) {
      var sp = o.sparks[i]; if (sp.life > 0) continue; k++;
      sp.life = 0.35 + Math.random() * 0.2; sp.m.visible = true; sp.m.position.set(s.x, s.y, s.z);
      sp.v.set(rnd(-1, 1) * 2.5, rnd(0, 2), rnd(-1, 1) * 2.5).multiplyScalar(e === "smash" ? 1.6 : 1);
      sp.m.material.color.setHex(e === "smash" ? 0xffa040 : 0xfff2c4);
    }
  }
  if (e === "land") { o.ring.position.set(s.x, 0.02, s.z); o.ringT = 0.9; }
}
function updFx(dt, st) {
  var o = GL.o;
  o.sparks.forEach(function (s) { if (s.life <= 0) return; s.life -= dt; s.v.y -= 6 * dt; s.m.position.addScaledVector(s.v, dt); s.m.material.opacity = Math.max(0, s.life * 2.2); if (s.life <= 0) s.m.visible = false; });
  if (o.ringT > 0) { o.ringT -= dt; var k = 1 - o.ringT / 0.9; o.ring.scale.setScalar(1 + k * 1.5); o.ring.material.opacity = 0.8 * (1 - k); }
  var cr = o.crowd, cheer = st ? st.cheer || 0 : 0;
  if (GL.A) { GL.A.crowd.update(GL.t, cheer); return; }
  if (!CYL()) return;
  if (cheer > 0 || cr.on) {
    cr.on = cheer > 0;
    var m = new THREE.Matrix4(), a = Math.min(1, cheer);
    for (var j = 0; j < cr.seats.length; j++) {
      var p = cr.seats[j], up = Math.max(0, Math.sin(GL.t * 11 + cr.ph[j])) * 0.1 * a;
      m.makeTranslation(p[0], p[1] + 0.28 + up, p[2]); cr.bodies.setMatrixAt(j, m);
      m.makeTranslation(p[0], p[1] + 0.68 + up, p[2]); cr.heads.setMatrixAt(j, m);
    }
    cr.bodies.instanceMatrix.needsUpdate = true; cr.heads.instanceMatrix.needsUpdate = true;
  }
}
function setTrail(list) {
  var tr = GL.o.trail;
  for (var i = 0; i < tr.length; i++) {
    var q = list[list.length - 2 - i];
    if (!q) { tr[i].visible = false; continue; }
    tr[i].visible = true; tr[i].position.set(q[0], q[1], q[2]); tr[i].material.opacity = 0.32 * (1 - i / tr.length);
  }
}
function sizeGL(W, H) { GL.W = W; GL.H = H; GL.r.setSize(W, H, false); GL.cam.aspect = W / H; GL.cam.updateProjectionMatrix(); }
/* بازیکنان واقعی: ساخت پس از بارگذاری و پیش‌بینی لحظهٔ ضربه برای حرکت دست */
/* آدمک‌های استوانه‌ای فقط وقتی دیده می‌شوند که بارگذاری بازیکنان واقعی ناموفق باشد */
function CYL() { return !GL.A && (!window.ATH || ATH.failed); }
function makeAthletes() {
  var o = GL.o;
  try {
    GL.A = ATH.make({ seats: o.crowd.seats.map(function (p) { var ry = p[2] < -10.5 ? 0 : p[0] < 0 ? Math.PI / 2 : -Math.PI / 2; return [p[0], p[1], p[2], ry]; }), mob: GL.mob, judges: o.judges });
  } catch (e) { console.error(e); GL.A = null; ATH.ready = false; ATH.failed = true; return; }
  GL.A.players.forEach(function (A) { GL.scene.add(A.root); });
  GL.scene.add(GL.A.ump.root);
  GL.A.ump.place(o.umpSeat[0], o.umpSeat[1], o.umpSeat[2], -Math.PI / 2);
  o.ump.g.visible = false;
  GL.scene.add(GL.A.crowd.g); o.crowd.bodies.visible = o.crowd.heads.visible = false;
  GL.A.judges.forEach(function (j) { GL.scene.add(j); });
}
function contactPred(st, p, pl, s, replay) {
  if (!s || s.y <= 0.02) return null;
  var side = p === 0 ? 1 : -1, toward = (s.vz || 0) * side > 0.3;
  if (replay) { if (!toward) return null; }
  else if (s.hitter === p || (!toward && s.z * side < 0)) return null;
  var c = { x: s.x, y: s.y, z: s.z, vx: s.vx || 0, vy: s.vy || 0, vz: s.vz || 0 }, dt = 1 / 120;
  /* بازیکن هم در همین مدت به سوی هدفش می‌دود */
  var px = pl.x, pz = pl.z, mvx = 0, mvz = 0, md = 0, live = !replay && pl.tx !== undefined && G && G.L;
  if (live) {
    var dx = pl.tx - pl.x, dz = pl.tz - pl.z; md = Math.hypot(dx, dz);
    var spd = MODE === "ai" && p === 1 ? G.L.aiSpd : G.L.pSpd * RT[G.rts[p]].spd;
    if (md > 1e-3) { mvx = dx / md * spd; mvz = dz / md * spd; }
  }
  var R = G && G.rts && !replay ? reachOf(p) : 1.1, top = 2.95, moved = 0;
  for (var i = 1; i <= 110; i++) {
    var oz = c.z; step(c, dt);
    if (md > 0 && moved < md) { var st2 = Math.min(md - moved, Math.hypot(mvx, mvz) * dt); moved += st2; px += mvx / Math.hypot(mvx, mvz) * st2; pz += mvz / Math.hypot(mvx, mvz) * st2; }
    if (c.y <= 0.05) return null;
    if (oz * c.z <= 0 && c.y < NET) return null;
    if (c.z * side > 0.05 && c.y <= top && c.y >= 0.12 && Math.hypot(c.x - px, c.z - pz) <= R) return { tc: i * dt, x: c.x, y: c.y, z: c.z };
  }
  return null;
}
function playCam(view) {
  var asp = GL.W / GL.H, pos, look, fov;
  if (asp >= 1.05) { pos = [0, 5.4, 12.6]; look = [0, 0.2, -1.4]; fov = 42; }
  else { pos = [0, 8.4, 12.4]; look = [0, -0.3, -0.9]; fov = Math.max(50, 2 * Math.atan(3.6 / 13 / asp) * 180 / Math.PI); }
  if (view === 1) { pos[2] = -pos[2]; look[2] = -look[2]; }
  return { pos: pos, look: look, fov: fov };
}
function render3D(dt, st, mode) {
  var o = GL.o, cam = GL.cam;
  GL.t += dt;
  var s = st.s, p0 = st.pl[0], p1 = st.pl[1], trail = st.trail || [];
  var replay = mode === "replay" && st.rp;
  if (replay) {
    var f = st.rp.f[st.rp.i];
    s = { x: f[0], y: f[1], z: f[2], vx: f[3], vy: f[4], vz: f[5] };
    p0 = { x: f[6], z: f[7], sw: f[8], jump: f[9], walk: f[10], vx: 0, vz: 0 }; p1 = { x: f[11], z: f[12], sw: f[13], jump: f[14], walk: f[15], vx: 0, vz: 0 };
    trail = st.rp.f.slice(Math.max(0, st.rp.i - 9), st.rp.i + 1);
  }
  /* شاتل */
  var live = mode === "hero" || replay || st.st === "rally" || st.st === "serve" || st.st === "point";
  o.sh.visible = o.blob.visible = live && s.y > -1;
  o.sh.position.set(s.x, s.y, s.z);
  var v = GL.tmpV.set(-(s.vx || 0), -(s.vy || 0), -(s.vz || 0));
  if (v.lengthSq() < 0.01) v.set(0, 1, 0);
  GL.q.setFromUnitVectors(UP, v.normalize()); o.sh.quaternion.copy(GL.q);
  o.blob.position.set(s.x, 0.015, s.z); o.blob.scale.setScalar(clamp(1 + s.y * 0.35, 1, 2.4)); o.blob.material.opacity = clamp(0.5 - s.y * 0.07, 0.15, 0.5);
  setTrail((mode === "play" && st.st === "rally") || replay ? trail : []);
  /* خانهٔ سرویس */
  var bx = o.box;
  if (mode === "play" && st.st === "serve" && !st.practice) {
    var sp = servePosOf(st), sgn = sp.rx > 0 ? 1 : -1, zs = st.server === 0 ? -1 : 1;
    bx.visible = true; bx.scale.set(CWS, CL - SSL, 1); bx.position.set(sgn * CWS / 2, 0.02, zs * (SSL + CL) / 2);
    bx.material.opacity = 0.22 + 0.12 * Math.sin(GL.t * 4);
  } else bx.visible = false;
  /* بازیکنان */
  var me = mode === "hero" ? 0 : ME, prac = !!st.practice, shV = st.st === "rally" || replay || mode === "hero" ? s : null;
  if (!GL.A && window.ATH && ATH.ready) makeAthletes();
  o.ump.g.visible = o.crowd.bodies.visible = o.crowd.heads.visible = CYL();
  if (GL.A) {
    var tsc = mode === "replay" ? 0.45 * ((st.L && st.L.ts) || 1) : mode === "play" ? ((st.L && st.L.ts) || 1) : 1, adt = dt * tsc;
    var sv = mode === "play" && st.st === "serve" && !st.over ? st.server : -1;
    [p0, p1].forEach(function (pl, p) {
      var A = GL.A.players[p], show = p === 0 || !prac;
      var pred = (mode === "play" && st.st === "rally") || replay ? contactPred(st, p, pl, s, !!replay) : null;
      var mood = st.over && st.winner >= 0 && mode === "play" ? (st.winner === p ? "win" : "lose") : null;
      A.update(adt, { x: pl.x, z: pl.z, sw: pl.sw || 0, show: show, pred: pred, serving: sv === p, hold: sv === p ? GL.tmpV2.set(s.x, s.y, s.z) : null, serveHit: !!(st.s && st.s.serve), mood: mood, hp: !replay && pl.hp ? pl.hp : null });
    });
    if (sv >= 0) { GL.A.players[sv].holdPoint(GL.tmpV); o.sh.position.copy(GL.tmpV); o.sh.quaternion.identity(); o.blob.position.set(GL.tmpV.x, 0.015, GL.tmpV.z); }
    GL.A.ump.look(o.sh.visible ? o.sh.position : null, dt);
  }
  posePlayer(o.p0, st, 0, p0.x, p0.z, p0.sw || 0, p0.jump || 0, p0.walk || 0, p0.vx || 0, p0.vz || 0, shV, me === 0 && !replay && mode !== "hero" ? 0.82 : 1, CYL());
  posePlayer(o.p1, st, 1, p1.x, p1.z, p1.sw || 0, p1.jump || 0, p1.walk || 0, p1.vx || 0, p1.vz || 0, shV, me === 1 && !replay ? 0.82 : 1, !prac && CYL());
  o.machine.visible = prac;
  updFx(dt, st);

  /* دوربین */
  var target, k2 = Math.min(1, dt * 2.5);
  if (mode === "hero") {
    var a = GL.t * 0.12 + 0.7; target = { fov: GL.W / GL.H < 1 ? 60 : 44 };
    cam.position.set(Math.sin(a) * 11, 5.2, Math.cos(a) * 11); GL.camLook.set(0, 0.6, 0);
  } else if (replay) {
    var por = GL.W / GL.H < 1;
    target = { fov: por ? 58 : 58 };
    var kk = st.rp.i < 2 ? 1 : Math.min(1, dt * 3);
    if (por) { cam.position.lerp(GL.tmpV.set(-4.6, 6.2, s.z * 0.35 + 8.5), kk); GL.camLook.lerp(GL.tmpV.set(0, 0.6, s.z * 0.45 - 0.5), kk); }
    else { cam.position.lerp(GL.tmpV.set(-5.0, 2.9, s.z * 0.45), kk); GL.camLook.lerp(GL.tmpV.set(0, 1.0, s.z * 0.55), kk); }
  } else {
    target = playCam(me);
    var mp = st.pl[me], fx = clamp(mp.x * 0.25 + s.x * 0.1, -1.2, 1.2);
    cam.position.lerp(GL.tmpV.set(target.pos[0] + fx, target.pos[1], target.pos[2]), GL.snap ? 1 : k2);
    GL.camLook.lerp(GL.tmpV.set(target.look[0] + fx * 0.5, target.look[1], target.look[2]), GL.snap ? 1 : k2);
    GL.snap = false;
  }
  if (Math.abs(cam.fov - target.fov) > 0.1) { cam.fov = target.fov; cam.updateProjectionMatrix(); }
  cam.lookAt(GL.camLook);
  if (st.shake > 0) { cam.position.x += (Math.random() - 0.5) * 0.06 * st.shake; cam.position.y += (Math.random() - 0.5) * 0.06 * st.shake; }
  if (mode !== "hero") {
    var key = JSON.stringify([st.pts, st.sets, st.server, st.names, st.over, st.streak, st.practice, LANG]);
    if (key !== GL.scoreKey) { GL.scoreKey = key; redraw(o.screenTex); }
  }
  GL.r.render(GL.scene, cam);
}
function servePosOf(st) { var p = st.server, even = st.pts[p] % 2 === 0, side = p === 0 ? 1 : -1, sx = (even ? 1 : -1) * side * 0.9; return { rx: -sx }; }
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

function myName() { var e = $("nm"), n = ((e && e.value) || store("bd-name") || store("pp-name") || "").trim().slice(0, 16); if (n) store("bd-name", n); return n || t("me"); }
function radio(name, items, cur) {
  return '<div class="opts">' + items.map(function (it) {
    return '<label><input type="radio" name="' + name + '" value="' + it[0] + '"' + (it[0] === cur ? " checked" : "") + '><span class="o">' + it[1] + (it[2] ? "<small>" + it[2] + "</small>" : "") + "</span></label>";
  }).join("") + "</div>";
}
function val(name) { var e = document.querySelector('input[name="' + name + '"]:checked'); return e ? e.value : null; }

function menu() {
  stopLoop(); G = null; MODE = null; gm = null;
  var lvl = store("bd-lvl") || "m", rk = store("bd-rk") || "all", ln = store("bd-len") || "3";
  if (!LV[lvl]) lvl = "m";
  $app.innerHTML = '<div class="panel menu">' +
    '<div class="hero" id="hero"><div class="hero-badge">3D</div></div>' +
    "<h2>" + t("title") + ' <small class="ldp" id="ldp"></small></h2><p>' + t("intro") + "</p>" +
    '<label class="field"><span>' + t("name") + '</span><input id="nm" maxlength="16" value="' + esc(store("bd-name") || store("pp-name") || "") + '" placeholder="' + t("namePh") + '" autocomplete="nickname"></label>' +
    '<div class="field"><span>' + t("level") + "</span>" + radio("lvl", ["e", "m", "h", "p"].map(function (k) { return [k, t("lv")[k], t("lvd")[k]]; }), lvl) + "</div>" +
    '<div class="field"><span>' + t("racket") + "</span>" + radio("rk", [["def", t("def"), t("defd")], ["all", t("all"), t("alld")], ["off", t("off"), t("offd")]], rk) + "</div>" +
    '<div class="field"><span>' + t("len") + "</span>" + radio("len", [["1", t("len1")], ["3", t("len3")]], ln) + "</div>" +
    '<button class="btn" id="solo">' + t("vsAI") + "</button>" +
    '<button class="btn green" id="prac">' + t("practice") + "</button>" +
    '<div class="row"><button class="btn alt" id="mk">' + t("mk") + '</button><button class="btn alt" id="jn">' + t("jn") + "</button></div>" +
    '<div id="jbox" hidden><label class="field"><span>' + t("code") + '</span><input id="jc" inputmode="numeric" maxlength="4" dir="ltr" placeholder="1234"></label><button class="btn" id="jgo">' + t("go") + "</button></div>" +
    '<details class="rules"><summary>' + t("rulesT") + "</summary><ul>" + t("rules").map(function (r) { return "<li>" + r + "</li>"; }).join("") + "</ul></details>" +
    "</div>";
  function saveOpts() { store("bd-lvl", val("lvl")); store("bd-rk", val("rk")); store("bd-len", val("len")); myName(); }
  function go(fn) { return function () { saveOpts(); audio(); if (AC && AC.state === "suspended") AC.resume(); if (!initGL()) return toast(t("noGL")); fn(); }; }
  $("solo").onclick = go(startAI);
  $("prac").onclick = go(startPractice);
  $("mk").onclick = go(host);
  $("jn").onclick = function () { $("jbox").hidden = false; $("jc").focus(); };
  $("jgo").onclick = go(function () { join($("jc").value); });
  $("jc").onkeydown = function (e) { if (e.key === "Enter") $("jgo").click(); };
  /* تا بازیکنان کامل بارگذاری نشده‌اند، دکمه‌ها غیرفعال‌اند */
  if (window.ATH) ATH.on(function (pr, ready, failed) {
    var el = $("ldp"); if (!el) return;
    var wait = !ready && !failed;
    ["solo", "prac", "mk", "jn", "jgo"].forEach(function (id) { var b = $(id); if (b) b.disabled = wait; });
    el.textContent = wait ? t("loading") + " " + num(Math.round(pr * 100)) + "٪" : "";
    if (LANG === "sv" && wait) el.textContent = t("loading") + " " + Math.round(pr * 100) + " %";
    if (failed && !el.dataset.f) { el.dataset.f = "1"; toast(t("loadFail")); }
  });
  if (initGL()) {
    hero = $("hero"); attachGL(hero);
    DEMO = { names: ["Alborz", "Arshad"], sets: [1, 0], pts: [12, 9], setNo: 2, best: 3, server: 0, over: false, st: "rally", cheer: 0, shake: 0,
      s: { x: -0.8, y: 3.2, z: -1.5, vx: -1, vy: 2, vz: -5 }, pl: [{ x: 0.6, z: 4.2, sw: 0, walk: 0, vx: 0, vz: 0 }, { x: -1.2, z: -4.5, sw: 0, walk: 0, vx: 0, vz: 0 }], trail: [] };
    sizeHero(); GL.scoreKey = ""; redraw(GL.o.screenTex);
    startLoop();
  } else { $("hero").classList.add("nogl"); $("hero").textContent = t("noGL"); }
}
function sizeHero() { if (!hero || !GL) return; var w = hero.clientWidth, h = Math.round(w * 0.6); hero.style.height = h + "px"; sizeGL(w, h); }

function startAI() {
  MODE = "ai"; ME = 0;
  var lvl = store("bd-lvl") || "m";
  newGame({ lvl: lvl, best: +(store("bd-len") || 3), names: [myName(), t("computer")], rts: [store("bd-rk") || "all", lvl === "h" || lvl === "p" ? (Math.random() < 0.5 ? "off" : "all") : "all"] });
  gameView();
}
function startPractice() {
  MODE = "practice"; ME = 0;
  newGame({ lvl: store("bd-lvl") || "m", best: 1, names: [myName(), t("machine")], rts: [store("bd-rk") || "all", "all"], practice: true });
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
  if (G.practice) h += '<div class="spin">' + ["mix", "high", "net", "smash", "drive"].map(function (k) { return '<button type="button" data-f="' + k + '" class="' + (feedType === k ? "on" : "") + '">' + t("feed")[k] + "</button>"; }).join("") + "</div>";
  if (!G.L.auto) h += '<div class="spin">' + ["clear", "drop", "smash", "drive"].map(function (k, i) { return '<button type="button" data-s="' + k + '" class="' + (G.shot[ME] === k ? "on" : "") + '">' + t("shots")[k] + "<kbd>" + (i + 1) + "</kbd></button>"; }).join("") + "</div>";
  h += '<button type="button" id="snd">' + (muted ? t("sndOff") : t("sndOn")) + "</button>";
  if (MODE === "ai" || MODE === "practice") h += '<button type="button" id="pz">' + (G.paused ? t("resume") : t("pause")) + "</button>";
  h += '<button type="button" id="ex">' + t("exit") + "</button>";
  bar.innerHTML = h;
  $("hint").textContent = (G.practice ? t("hintP") : t("hint")) + (!G.L.auto ? " " + t("hintH") : "") + "  ·  " + t("lv")[G.lvl] + " · " + t(G.rts[ME]);
  bar.querySelectorAll("[data-s]").forEach(function (b) { b.onclick = function () { setShot(b.getAttribute("data-s")); }; });
  bar.querySelectorAll("[data-f]").forEach(function (b) { b.onclick = function () { feedType = b.getAttribute("data-f"); store("bd-feed", feedType); bar.querySelectorAll("[data-f]").forEach(function (x) { x.classList.toggle("on", x === b); }); }; });
  $("snd").onclick = function () { muted = !muted; store("bd-mute", muted ? "1" : "0"); audio(); buildBar(); };
  if ($("pz")) $("pz").onclick = function () { G.paused = !G.paused; buildBar(); };
  $("ex").onclick = leave;
}
function setShot(k) { if (!G) return; G.shot[ME] = k; var bar = $("bar"); if (bar) bar.querySelectorAll("[data-s]").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-s") === k); }); }
function showShot(kind) { if (!shotEl) return; shotEl.textContent = t("shotLbl")[kind] || ""; shotEl.classList.toggle("smash", kind === "smash"); shotEl.classList.add("on"); shotT = 0.9; }

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
    GL.ray.setFromCamera({ x: sx * 2 - 1, y: -(sy * 2 - 1) }, GL.cam);
    if (!GL.ray.ray.intersectPlane(GL.plane, GL.hit)) return;
    var pl = G.pl[ME];
    if (G.st === "serve" && G.server === ME) return;
    pl.tx = clamp(GL.hit.x, -3.3, 3.3); pl.tz = ME === 0 ? clamp(GL.hit.z, 0.6, 7.7) : clamp(GL.hit.z, -7.7, -0.6);
  }
  gm.addEventListener("pointermove", mv);
  gm.addEventListener("pointerdown", function (e) {
    audio(); if (AC && AC.state === "suspended") AC.resume();
    if (G && G.st === "replay") { endReplay(); return; }
    try { gm.setPointerCapture(e.pointerId); } catch (x) {} if (!serveReq()) mv(e);
  });
  document.onkeydown = function (e) {
    if (!G) return;
    if (e.target && e.target.tagName === "INPUT") return;
    keys[e.key] = true;
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); audio(); if (G.st === "replay") endReplay(); else serveReq(); }
    var k = { "1": "clear", "2": "drop", "3": "smash", "4": "drive" }[e.key];
    if (k && !G.L.auto) setShot(k);
    if (/^Arrow/.test(e.key)) e.preventDefault();
  };
  document.onkeyup = function (e) { keys[e.key] = false; };
}
function serveReq() {
  if (!G || G.paused || G.st !== "serve" || G.server !== ME) return false;
  if (MODE === "guest") { if (conn) conn.send({ t: "sv", kind: G.L.auto ? "clear" : G.shot[ME] }); }
  else doServe(ME);
  return true;
}

/* ---------------- حلقهٔ اصلی ---------------- */
function startLoop() { stopLoop(); last = performance.now(); raf = requestAnimationFrame(frame); }
function stopLoop() { if (raf) cancelAnimationFrame(raf); raf = 0; }

function keyMove(dt) {
  var pl = G.pl[ME], VF = ME === 0 ? 1 : -1, sp = 4 * dt;
  if (G.st === "serve" && G.server === ME) return;
  if (keys.ArrowLeft) pl.tx = clamp(pl.x - sp * 3 * VF, -3.3, 3.3);
  if (keys.ArrowRight) pl.tx = clamp(pl.x + sp * 3 * VF, -3.3, 3.3);
  if (keys.ArrowUp) pl.tz = ME === 0 ? clamp(pl.z - sp * 3, 0.6, 7.7) : clamp(pl.z + sp * 3, -7.7, -0.6);
  if (keys.ArrowDown) pl.tz = ME === 0 ? clamp(pl.z + sp * 3, 0.6, 7.7) : clamp(pl.z - sp * 3, -7.7, -0.6);
}
function anim(dt) {
  [0, 1].forEach(function (p) {
    var pl = G.pl[p]; if (pl.sw > 0) pl.sw = Math.max(0, pl.sw - dt); if (pl.jump > 0) pl.jump = Math.max(0, pl.jump - dt);
    var sp = Math.hypot(pl.vx, pl.vz); pl.walk = (pl.walk || 0) + sp * dt * 3.2;
  });
  if (G.mark) { G.mark.t -= dt; if (G.mark.t <= 0) G.mark = null; }
}
function record(dt) {
  var s = G.s, a = G.pl[0], b = G.pl[1];
  G.recT += dt;
  G.rec.push([s.x, s.y, s.z, s.vx, s.vy, s.vz, a.x, a.z, a.sw, a.jump, a.walk, b.x, b.z, b.sw, b.jump, b.walk, G.recT]);
  if (G.rec.length > 1500) G.rec.shift();
}
function simulate(dt) {
  G.clock += dt; G.shake = Math.max(0, G.shake - dt * 3); G.cheer = Math.max(0, G.cheer - dt);
  if (G.st === "replay") { stepReplay(dt); return; }
  var dtS = dt * G.L.ts;
  keyMove(dt);
  if (!(G.st === "serve" && G.server === 0)) move(G.pl[0], dtS, G.L.pSpd * RT[G.rts[0]].spd);
  if (MODE === "ai") aiThink(dt, dtS);
  else if (MODE !== "practice" && !(G.st === "serve" && G.server === 1)) move(G.pl[1], dtS, G.L.pSpd * RT[G.rts[1]].spd);
  anim(dt);
  if (G.st === "serve") holdS();
  else if (G.st === "rally") {
    var n = Math.ceil(dtS / (1 / 300)), h = dtS / n;
    for (var i = 0; i < n && G.st === "rally"; i++) {
      phys(G.s, h, onEv);
      if (G.st === "rally") { if (!tryHit(0)) tryHit(1); }
    }
    record(dt);
  } else if (G.st === "point") {
    if (G.recMore > 0) { G.recMore -= dt; record(dt); }
    G.tm -= dt;
    if (G.tm <= 0) afterPoint();
  }
  trail();
}
function afterPoint() {
  if (G.rp0 && MODE === "ai") {
    G.rp0 = false;
    var f = G.rec, endT = f[f.length - 1][16], i0 = 0;
    while (i0 < f.length - 1 && f[i0][16] < endT - 3.4) i0++;
    G.rp = { f: f.slice(i0), i: 0, t: f[i0][16], end: endT };
    G.st = "replay"; G.msg = null; GL.snap = true;
    return;
  }
  finishPoint();
}
function stepReplay(dt) {
  var rp = G.rp; rp.t += dt * 0.45;
  while (rp.i < rp.f.length - 1 && rp.f[rp.i + 1][16] <= rp.t) rp.i++;
  if (rp.t > rp.end + 0.25) endReplay();
}
function endReplay() { if (!G || G.st !== "replay") return; G.rp = null; GL.snap = true; finishPoint(); }
function finishPoint() {
  if (G.after === "end") { G.st = "over"; showEnd(); }
  else if (G.after === "newset") { G.pts = [0, 0]; G.setNo++; setupServe(); }
  else if (G.after === "feed") feedBall();
  else setupServe();
}
function trail() {
  if (G.st === "rally") { G.trail.push([G.s.x, G.s.y, G.s.z]); if (G.trail.length > 10) G.trail.shift(); }
  else G.trail.length = 0;
}
function frame(now) {
  raf = requestAnimationFrame(frame);
  var dt = clamp((now - last) / 1000, 0, 0.05); last = now;
  if (!GL) return;
  if (G && gm) {
    if (!G.paused) {
      if (MODE === "guest") guestStep(dt); else simulate(dt);
      sendT += dt;
      if (sendT > 0.033) { sendT = 0; if (MODE === "host") hostSend(); else if (MODE === "guest") guestSend(); }
    }
    if (shotT > 0) { shotT -= dt; if (shotT <= 0) shotEl.classList.remove("on"); }
    updMsg(); updHUD();
    render3D(G.paused ? 0 : dt, G, G.st === "replay" ? "replay" : "play");
  } else if (hero && DEMO) {
    var a = GL.t * 1.3; DEMO.s.y = 2.4 + Math.sin(a) * 0.9; DEMO.s.z = Math.cos(a * 0.5) * 3; DEMO.s.vz = -Math.sin(a * 0.5) * 3; DEMO.s.vy = Math.cos(a);
    DEMO.pl[0].walk += dt * 2; DEMO.pl[1].walk += dt * 2;
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
    key = [G.streak, G.bestStreak, LANG].join();
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
    rallyKey = key; ra.classList.toggle("on", showR);
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
  d.innerHTML = '<div class="panel"><h2>' + (won ? t("youWon") : t("youLost")) + "</h2><p>" + tf("matchWon", esc(G.names[G.winner])) + '</p><div class="big">' + num(G.sets[0]) + " – " + num(G.sets[1]) + "</div>" + rows +
    (MODE === "guest" ? "<p>" + t("waitHost") + "</p>" : '<button class="btn" id="again">' + t("again") + "</button>") +
    '<button class="btn ghost" id="tomenu">' + t("menu") + "</button></div>";
  gm.appendChild(d);
  if (won) crowd(1);
  if ($("again")) $("again").onclick = function () {
    if (MODE === "ai") startAI();
    else if (MODE === "host" && conn) { var o = { lvl: G.lvl, best: G.best, names: G.names, rts: G.rts }; newGame(o); conn.send({ t: "cfg", o: o, server: G.server }); d.remove(); buildBar(); tvKey = ""; }
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
  var code = String(Math.floor(1000 + Math.random() * 9000)), name = myName(), lvl = store("bd-lvl") || "m", best = +(store("bd-len") || 3), rk = store("bd-rk") || "all";
  MODE = "host"; ME = 0; stopLoop(); hero = null;
  $app.innerHTML = '<div class="panel"><h2>' + t("creating") + "</h2></div>";
  peer = new Peer(PFX + code);
  var opp = null;
  function lobby() {
    if (G) return;
    $app.innerHTML = '<div class="panel"><h2>' + t("roomT") + "</h2><p>" + t("roomP") + '</p><div class="code">' + code + "</div>" +
      "<p>" + (opp ? tf("oppIn", "<b>" + esc(opp.name) + "</b>") : t("waitOpp")) + "</p><p>" + t("lv")[lvl] + " · " + t("len" + best) + "</p>" +
      '<button class="btn" id="go"' + (opp ? "" : " disabled") + ">" + t("start") + '</button><button class="btn ghost" id="cn">' + t("cancel") + "</button></div>";
    $("go").onclick = function () {
      if (!opp) return;
      var o = { lvl: lvl, best: best, names: [name, opp.name], rts: [rk, opp.rt] };
      newGame(o); conn.send({ t: "cfg", o: o, server: G.server }); gameView();
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
        if (d.t === "in") {
          var pl = G.pl[1];
          if (!(G.st === "serve" && G.server === 1)) { pl.tx = clamp(+d.x || 0, -3.3, 3.3); pl.tz = clamp(+d.z || -4, -7.7, -0.6); }
          if (SHOT[d.shot]) G.shot[1] = d.shot;
        }
        if (d.t === "sv" && G.server === 1) doServe(1, d.kind === "drop" ? "drop" : "clear");
      });
      c.on("close", function () { if (MODE === "host") { toast(t("lost")); leave(); } });
    });
  });
}
function hostSend() {
  if (!conn || !G) return;
  var s = G.s;
  conn.send({
    t: "s", s: [s.x, s.y, s.z, s.vx, s.vy, s.vz],
    p: [G.pl[0].x, G.pl[0].z, G.pl[0].sw, G.pl[1].x, G.pl[1].z, G.pl[1].sw, G.pl[0].jump, G.pl[1].jump],
    st: G.st, sc: [G.pts[0], G.pts[1], G.sets[0], G.sets[1], G.setNo, G.server, G.rally, Math.round(G.spd)], m: G.msg, ev: G.ev.splice(0), ov: G.over ? G.winner : -1,
    mk: G.mark ? [G.mark.x, G.mark.z, G.mark.t] : null, ss: G.over ? G.stats : 0
  });
}
function join(code) {
  if (!window.Peer) return toast(t("noPeer"));
  code = String(code || "").replace(/[۰-۹]/g, function (d) { return FAD.indexOf(d); }).replace(/\D/g, "");
  if (code.length !== 4) return toast(t("code4"));
  var name = myName(), rk = store("bd-rk") || "all";
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
      if (d.t === "cfg") { newGame(d.o); G.server = d.server; tvKey = ""; if (!gm || !$("gm")) gameView(); else { var e = document.querySelector(".end"); if (e) e.remove(); buildBar(); } return; }
      if (d.t === "s" && G) guestRecv(d);
    });
    conn.on("close", function () { if (MODE === "guest") { toast(t("lost")); leave(); } });
  });
  peer.on("error", function (e) { if (MODE === "guest") { toast(e && e.type === "peer-unavailable" ? t("noRoom") : t("connFail")); leave(); } });
}
function guestRecv(d) {
  var s = G.s, q = d.s;
  s.x = q[0]; s.y = q[1]; s.z = q[2]; s.vx = q[3]; s.vy = q[4]; s.vz = q[5];
  var p0 = G.pl[0], p1 = G.pl[1];
  p0.tx = d.p[0]; p0.tz = d.p[1]; p0.sw = d.p[2]; p0.jump = d.p[6] || 0;
  if (d.p[5] > 0.25) p1.sw = d.p[5]; if (d.p[7] > p1.jump) p1.jump = d.p[7];
  var wasServe = G.st === "serve";
  G.st = d.st === "over" ? "point" : d.st === "replay" ? "point" : d.st;
  G.pts = [d.sc[0], d.sc[1]]; G.sets = [d.sc[2], d.sc[3]]; G.setNo = d.sc[4]; G.server = d.sc[5]; G.rally = d.sc[6] || 0; G.spd = d.sc[7] || 0;
  G.msg = d.m; G.mark = d.mk ? { x: d.mk[0], z: d.mk[1], t: d.mk[2] } : null;
  if (G.st === "serve") { p1.x = p1.tx = d.p[3]; p1.z = p1.tz = d.p[4]; }
  else if (wasServe) { p1.tx = p1.x; p1.tz = p1.z; }
  else if (Math.hypot(p1.x - d.p[3], p1.z - d.p[4]) > 1.2) { p1.x = d.p[3]; p1.z = d.p[4]; }
  (d.ev || []).forEach(function (e) { sfx(e); vfx(e); if (e === "point") { G.cheer = 1.4; crowd(0.5); } if (e === "smash") G.shake = 1; });
  if (d.ss) G.stats = d.ss;
  if (d.ov >= 0 && !G.over) { G.over = true; G.winner = d.ov; }
  if (G.over && d.st === "over") showEnd();
}
function guestStep(dt) {
  G.clock += dt; G.shake = Math.max(0, G.shake - dt * 3); G.cheer = Math.max(0, G.cheer - dt);
  var dtS = dt * G.L.ts;
  keyMove(dt);
  if (!(G.st === "serve" && G.server === 1)) move(G.pl[1], dtS, G.L.pSpd * RT[G.rts[1]].spd);
  move(G.pl[0], dtS, 20);
  anim(dt);
  if (G.st === "rally") { step(G.s, dtS); if (G.s.y < 0) G.s.y = 0; }
  trail();
}
function guestSend() {
  if (!conn || !G) return;
  var pl = G.pl[1];
  conn.send({ t: "in", x: pl.tx, z: pl.tz, shot: G.shot[1] });
}

/* ---------------- شروع ---------------- */
setLang(LANG);
})();
