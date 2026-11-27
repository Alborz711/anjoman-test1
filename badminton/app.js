/* بدمینتون انجمن ایرانیان سوندبی‌بری
   بازی با رایانه (متوسط / دشوار) و بازی آنلاین دونفره (PeerJS) */
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
  intro: "بدمینتون در یک سالن ورزشی: با رایانه در دو سطح بازی کنید، یا آنلاین با یک هموند دیگر. نتیجه روی تابلوی دیجیتال سالن دیده می‌شود.",
  name: "نام شما", namePh: "مثلاً: البرز",
  level: "سطح بازی", lvlM: "متوسط", lvlMd: "شاتل آرام‌تر، ضربه‌ها خودکار", lvlH: "دشوار", lvlHd: "کلیر، دراپ، اسمش، درایو",
  racket: "نوع راکت", def: "دفاعی", defd: "سبک‌سر؛ دسترس و کنترل بیشتر", all: "همه‌جانبه", alld: "متعادل", off: "تهاجمی", offd: "سنگین‌سر؛ اسمش تندتر، خطای بیشتر",
  len: "طول مسابقه", len1: "یک گیم", len3: "بهترین ۳ گیم",
  vsAI: "بازی با رایانه", mk: "ساختن اتاق آنلاین", jn: "پیوستن به اتاق", code: "کد اتاق", go: "پیوستن",
  rulesT: "راهنما و قوانین",
  rules: [
    "هر گیم تا ۲۱ امتیاز است؛ برنده باید ۲ امتیاز جلو باشد و در ۲۹–۲۹ امتیاز سی‌ام برنده است.",
    "هر رالی یک امتیاز دارد و برندهٔ رالی سرویس بعدی را می‌زند. با امتیاز زوج از سمت راست و با امتیاز فرد از سمت چپ سرویس زده می‌شود و شاتل باید ضربدری در خانهٔ سرویس روبه‌رو بیفتد.",
    "بازیکن را با انگشت یا موس به جایی ببرید که شاتل پایین می‌آید؛ وقتی شاتل به دسترس راکت رسید، ضربه خودبه‌خود زده می‌شود. سایهٔ شاتل روی زمین کمک می‌کند جای فرود را حدس بزنید.",
    "در سطح متوسط نوع ضربه خودکار انتخاب می‌شود. در سطح دشوار خودتان انتخاب می‌کنید: کلیر (بلند و عمیق)، دراپ (آرام و نزدیک تور)، اسمش (تند و رو به پایین؛ فقط وقتی شاتل بالاست) و درایو (صاف و تند). در سرویس، دراپ یعنی سرویس کوتاه و بقیه سرویس بلند.",
    "ضربه با لبهٔ دسترس راکت، دراپ از ته زمین و اسمش با راکت تهاجمی احتمال خطا را بالا می‌برند.",
    "راکت دفاعی (سبک‌سر) دسترس و کنترل بیشتری دارد؛ راکت تهاجمی (سنگین‌سر) اسمش تندتری دارد ولی خطایش بیشتر است.",
    "کلیدها: جهت‌ها برای حرکت، ۱ تا ۴ برای نوع ضربه، فاصله برای سرویس."
  ],
  computer: "رایانه", me: "هموند",
  serveYou: "سرویس با شماست", serveYouS: "روی زمین بزنید یا کلید فاصله را بزنید", serveOpp: "سرویس با {n}",
  point: "امتیاز برای {n}", r_in: "شاتل در زمین افتاد", r_out: "شاتل بیرون افتاد", r_net: "شاتل به تور خورد", r_fault: "خطای سرویس",
  setWon: "گیم به {n} رسید", matchWon: "{n} برندهٔ مسابقه شد",
  youWon: "شما بردید", youLost: "این بار حریف برد", again: "بازی دوباره", menu: "بازگشت به منو", waitHost: "منتظر میزبان برای بازی دوباره…",
  pause: "مکث", resume: "ادامه", exit: "خروج", sndOn: "صدا: روشن", sndOff: "صدا: خاموش", paused: "بازی متوقف شد",
  creating: "در حال ساختن اتاق…", roomT: "اتاق آنلاین", roomP: "این کد را به هموند خود بدهید تا با «پیوستن به اتاق» وارد شود:",
  waitOpp: "منتظر حریف…", oppIn: "{n} وارد اتاق شد", start: "شروع بازی", cancel: "لغو",
  joining: "در حال پیوستن…", joined: "به اتاق پیوستید. منتظر بمانید تا میزبان بازی را شروع کند.",
  noRoom: "اتاقی با این کد پیدا نشد.", connFail: "اتصال برقرار نشد.", lost: "ارتباط با حریف قطع شد.", noPeer: "بخش آنلاین بار نشد؛ اتصال اینترنت را بررسی کنید.",
  code4: "کد چهاررقمی اتاق را بنویسید.", full: "این اتاق پر است.",
  hint: "بازیکن را با انگشت یا موس به زیر شاتل ببرید؛ ضربه خودبه‌خود زده می‌شود.",
  hintH: "نوع ضربه را با دکمه‌ها یا کلیدهای ۱ تا ۴ انتخاب کنید.",
  shots: { clear: "کلیر", drop: "دراپ", smash: "اسمش", drive: "درایو" },
  shotLbl: { clear: "Clear", drop: "Drop", smash: "SMASH!", drive: "Drive", net: "Net shot", lift: "Lift" },
  setW: "گیم", ofW: "از", lvlTag: { m: "سطح متوسط", h: "سطح دشوار" }
},
sv: {
  title: "Badminton", back: "← Tillbaka till föreningens webbplats", langBtn: "فارسی",
  intro: "Badminton i en idrottshall: spela mot datorn på två nivåer, eller online mot en annan medlem. Resultatet syns på hallens digitala resultattavla.",
  name: "Ditt namn", namePh: "t.ex. Alborz",
  level: "Nivå", lvlM: "Medel", lvlMd: "Lugnare boll, automatiska slag", lvlH: "Svår", lvlHd: "Clear, dropp, smash, drive",
  racket: "Racket", def: "Defensiv", defd: "Lätt huvud; längre räckvidd, mer kontroll", all: "Allround", alld: "Balanserad", off: "Offensiv", offd: "Tungt huvud; hårdare smash, fler misstag",
  len: "Matchlängd", len1: "Ett set", len3: "Bäst av 3",
  vsAI: "Spela mot datorn", mk: "Skapa onlinerum", jn: "Gå med i rum", code: "Rumskod", go: "Gå med",
  rulesT: "Regler och styrning",
  rules: [
    "Ett set spelas till 21 poäng; man måste vinna med 2, och vid 29–29 avgör den trettionde poängen.",
    "Varje boll ger poäng och vinnaren av bollen servar nästa. Vid jämn poäng servar man från höger, vid udda från vänster, och bollen ska landa diagonalt i motståndarens serveruta.",
    "För spelaren med fingret eller musen dit bollen faller; när bollen når racketen slås den automatiskt. Bollens skugga på golvet hjälper dig att bedöma var den landar.",
    "På medelnivå väljs slaget automatiskt. På svår nivå väljer du själv: clear (högt och djupt), dropp (mjukt nära nätet), smash (hårt och nedåt; bara när bollen är hög) och drive (platt och snabbt). Vid serve betyder dropp kort serve, övriga lång serve.",
    "Träff i kanten av räckvidden, dropp från baklinjen och smash med offensiv racket ger större risk för misstag.",
    "Defensiv racket (lätt huvud) ger längre räckvidd och mer kontroll; offensiv racket (tungt huvud) ger hårdare smash men fler misstag.",
    "Tangenter: piltangenterna flyttar spelaren, 1–4 väljer slag, mellanslag för serve."
  ],
  computer: "Datorn", me: "Medlem",
  serveYou: "Din serve", serveYouS: "Tryck på planen eller mellanslag", serveOpp: "{n} servar",
  point: "Poäng till {n}", r_in: "Bollen landade inne", r_out: "Bollen landade ute", r_net: "Bollen tog i nätet", r_fault: "Servfel",
  setWon: "Setet till {n}", matchWon: "{n} vann matchen",
  youWon: "Du vann", youLost: "Motståndaren vann den här gången", again: "Spela igen", menu: "Till menyn", waitHost: "Väntar på att värden startar igen…",
  pause: "Paus", resume: "Fortsätt", exit: "Avsluta", sndOn: "Ljud: på", sndOff: "Ljud: av", paused: "Pausad",
  creating: "Skapar rum…", roomT: "Onlinerum", roomP: "Ge den här koden till din motspelare så att hen kan gå med via ”Gå med i rum”:",
  waitOpp: "Väntar på motspelare…", oppIn: "{n} har anslutit", start: "Starta matchen", cancel: "Avbryt",
  joining: "Ansluter…", joined: "Du är med i rummet. Vänta tills värden startar matchen.",
  noRoom: "Hittade inget rum med den koden.", connFail: "Anslutningen misslyckades.", lost: "Anslutningen till motspelaren bröts.", noPeer: "Onlinedelen kunde inte laddas; kontrollera internet.",
  code4: "Skriv den fyrsiffriga rumskoden.", full: "Rummet är fullt.",
  hint: "För spelaren under bollen med fingret eller musen; slaget sker automatiskt.",
  hintH: "Välj slag med knapparna eller tangenterna 1–4.",
  shots: { clear: "Clear", drop: "Dropp", smash: "Smash", drive: "Drive" },
  shotLbl: { clear: "Clear", drop: "Dropp", smash: "SMASH!", drive: "Drive", net: "Nätboll", lift: "Lyft" },
  setW: "Set", ofW: "av", lvlTag: { m: "Medelnivå", h: "Svår nivå" }
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
  m: { ts: 0.62, auto: true, reach: 1.2, pSpd: 6.2, aiSpd: 4.6, aiReact: 0.28, aiErr: 0.12, aiJudge: 0.5, err: 0.7 },
  h: { ts: 0.75, auto: false, reach: 1, pSpd: 6.5, aiSpd: 6.0, aiReact: 0.14, aiErr: 0.05, aiJudge: 0.88, err: 1 }
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
/* برد افقی با سرعت v و زاویهٔ ang از ارتفاع h0؛ ارتفاع در فاصلهٔ nd را هم برمی‌گرداند */
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
var G = null, ME = 0, MODE = null;
var peer = null, conn = null, PFX = "anjoman-badminton-";

function mkS() { return { x: 0, y: 1, z: 3, vx: 0, vy: 0, vz: 0, hitter: 0, serve: false, n: 0 }; }
function mkP(p) { var s = p === 0 ? 1 : -1; return { x: 0, z: s * 3.8, tx: 0, tz: s * 3.8, vx: 0, vz: 0, sw: 0, sh: null, aim: 0 }; }

function newGame(o) {
  G = {
    lvl: o.lvl, L: LV[o.lvl], best: o.best, names: o.names, rts: o.rts,
    sets: [0, 0], pts: [0, 0], setNo: 1, server: Math.random() < 0.5 ? 0 : 1,
    pl: [mkP(0), mkP(1)], s: mkS(), st: "serve", tm: 0, ev: [], shot: ["clear", "clear"],
    over: false, winner: -1, msg: null, paused: false, ai: { d: 0, pred: null, pn: -1, fe: 0, sv: 0, skip: false }, clock: 0, mark: null, trail: []
  };
  setupServe();
}
function say(m) { G.msg = m; }
function ev(e) { G.ev.push(e); sfx(e); }

/* جای ایستادن سرویس‌زن و دریافت‌کننده */
function servePos() {
  var p = G.server, even = G.pts[p] % 2 === 0, side = p === 0 ? 1 : -1;
  var sx = (even ? 1 : -1) * side * 0.9;
  return { sx: sx, sz: side * 3.0, rx: -sx, rz: -side * 3.3 };
}
function setupServe() {
  G.st = "serve"; G.ai.sv = 0; G.ai.pred = null;
  var sp = servePos(), sv = G.pl[G.server], rc = G.pl[1 - G.server];
  sv.x = sv.tx = sp.sx; sv.z = sv.tz = sp.sz; rc.x = rc.tx = sp.rx; rc.z = rc.tz = sp.rz;
  holdS();
  say({ k: "serve", n: G.server });
}
function holdS() {
  var p = G.pl[G.server], s = G.s, side = G.server === 0 ? 1 : -1;
  s.x = p.x + 0.32 * side; s.z = p.z - 0.25 * side; s.y = 1.0 + 0.04 * Math.sin(G.clock * 3); s.vx = 0; s.vy = -0.1; s.vz = -side * 0.1;
}

function aimFor(p) {
  var o = G.pl[1 - p], me = G.pl[p];
  if (me.aim) { var a = me.aim; me.aim = 0; return clamp(a, -2.3, 2.3); }
  var sgn = Math.random() < 0.72 ? (o.x > 0 ? -1 : 1) : (Math.random() < 0.5 ? -1 : 1);
  var human = MODE !== "ai" || p === 0;
  if (human && Math.abs(me.vx) > 2.5) sgn = me.vx > 0 ? 1 : -1;
  return sgn * rnd(1.1, 2.25);
}

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
  G.st = "rally"; G.msg = null; G.pl[p].sw = 0.3;
  ev("hit");
  if (p === ME) showShot(kind === "drop" ? "net" : "clear");
}
function errNoise(p, k) {
  var c = RT[G.rts[p]].ctl * G.L.err * k;
  return [(Math.random() - 0.5) * 0.5 * c, (Math.random() - 0.5) * 0.4 * c];
}

function inServeBox(x, z) {
  var sp = servePos(), sgn = sp.rx > 0 ? 1 : -1;
  return Math.abs(z) >= SSL && Math.abs(z) <= CL + 0.02 && x * sgn >= -0.02 && x * sgn <= CWS + 0.02;
}
function onEv(e) {
  var s = G.s; if (G.st !== "rally") return;
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
  var a = G.pts[w], o = G.pts[1 - w];
  G.server = w;
  G.st = "point"; G.tm = 1.5; G.after = "serve";
  if ((a >= 21 && a - o >= 2) || a >= 30) {
    G.sets[w]++;
    if (G.sets[w] > G.best / 2) { G.over = true; G.winner = w; G.tm = 2; G.after = "end"; say({ k: "match", n: w }); return; }
    say({ k: "set", n: w, why: why }); G.tm = 2.3; G.after = "newset"; return;
  }
  say({ k: "point", n: w, why: why });
}

function reachOf(p) { return RT[G.rts[p]].reach * G.L.reach; }
function tryHit(p) {
  var s = G.s, pl = G.pl[p], side = p === 0 ? 1 : -1;
  if (s.hitter === p || s.z * side < 0.05) return false;
  var dh = Math.hypot(s.x - pl.x, s.z - pl.z), R = reachOf(p);
  var top = G.L.auto ? 2.75 : 2.95;
  if (dh > R || s.y > top || s.y < 0.12) return false;
  if (s.vy > 0 && s.y > 1.6 && s.vz * side > 0 && Math.abs(s.z) > 2) return false; /* صبر تا شاتل پایین بیاید */
  if (MODE === "ai" && p === 1) aiShot();
  hit(p, dh / R);
  return true;
}
function chooseShot(p) {
  var s = G.s, side = p === 0 ? 1 : -1, az = Math.abs(s.z), pick = G.L.auto ? null : G.shot[p];
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
  G.pl[p].sw = 0.3;
  ev(kind === "smash" ? "smash" : "hit");
  if (p === ME) showShot(kind);
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
function move(pl, dtS, spd) {
  var dx = pl.tx - pl.x, dz = pl.tz - pl.z, d = Math.hypot(dx, dz), mx = spd * dtS, ox = pl.x, oz = pl.z;
  if (d > mx) { pl.x += dx / d * mx; pl.z += dz / d * mx; } else { pl.x = pl.tx; pl.z = pl.tz; }
  var k = dtS > 0 ? 1 / dtS : 0;
  pl.vx += ((pl.x - ox) * k - pl.vx) * 0.3; pl.vz += ((pl.z - oz) * k - pl.vz) * 0.3;
}
function aiShot() {
  var s = G.s, hard = !G.L.auto, h = G.pl[0], q = Math.random(), pick;
  if (!hard) { G.shot[1] = null; return; }
  if (s.y > 2.1 && Math.abs(s.z) < 5.2 && q < 0.6) pick = "smash";
  else if (h.z < 3.2) pick = q < 0.75 ? "clear" : "drive";
  else if (h.z > 5) pick = q < 0.6 ? "drop" : "clear";
  else pick = q < 0.4 ? "clear" : q < 0.7 ? "drop" : "drive";
  G.shot[1] = pick;
}
function aiServeKind() { return !G.L.auto && Math.random() < 0.45 ? "drop" : "clear"; }

/* ---------------- صدا ---------------- */
var AC = null, muted = store("bd-mute") === "1", NB = null;
function audio() { if (AC) return AC; try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { AC = null; } return AC; }
function sfx(k) {
  if (muted || !AC) return;
  var a = AC, t0 = a.currentTime;
  if (k === "point") {
    [660, 990].forEach(function (f, i) { var o = a.createOscillator(), g = a.createGain(); o.type = "sine"; o.frequency.value = f; g.gain.setValueAtTime(0.0001, t0 + i * 0.12); g.gain.exponentialRampToValueAtTime(0.18, t0 + i * 0.12 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + i * 0.12 + 0.25); o.connect(g).connect(a.destination); o.start(t0 + i * 0.12); o.stop(t0 + i * 0.12 + 0.3); });
    return;
  }
  if (!NB) { NB = a.createBuffer(1, a.sampleRate * 0.12, a.sampleRate); var d = NB.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 4); }
  var P2 = { hit: [2600, 0.9, 3], smash: [1800, 1.4, 1.5], land: [700, 0.35, 1], net: [380, 0.45, 1.5] }[k]; if (!P2) return;
  var src = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
  src.buffer = NB; f.type = "bandpass"; f.frequency.value = P2[0]; f.Q.value = P2[2]; g.gain.value = P2[1];
  src.connect(f).connect(g).connect(a.destination); src.start(t0);
}

/* ---------------- دوربین ---------------- */
var CAM, TGT, Fv, Rv, Uv, f = 500, cx = 200, cy = 200;
function setCam(portrait) {
  if (portrait) { CAM = { x: 0, y: 7.2, z: 13.2 }; TGT = { x: 0, y: -0.6, z: -1.2 }; }
  else { CAM = { x: 0, y: 6.3, z: 13.8 }; TGT = { x: 0, y: -0.4, z: -1.6 }; }
  var dx = TGT.x - CAM.x, dy = TGT.y - CAM.y, dz = TGT.z - CAM.z, l = Math.hypot(dx, dy, dz);
  Fv = [dx / l, dy / l, dz / l];
  var rx = -Fv[2], rz = Fv[0], rl = Math.hypot(rx, rz); Rv = [rx / rl, 0, rz / rl];
  Uv = [Rv[1] * Fv[2] - Rv[2] * Fv[1], Rv[2] * Fv[0] - Rv[0] * Fv[2], Rv[0] * Fv[1] - Rv[1] * Fv[0]];
}
setCam(false);
function P(x, y, z) {
  var dx = x - CAM.x, dy = y - CAM.y, dz = z - CAM.z;
  var xc = dx * Rv[0] + dy * Rv[1] + dz * Rv[2], yc = dx * Uv[0] + dy * Uv[1] + dz * Uv[2], zc = dx * Fv[0] + dy * Fv[1] + dz * Fv[2];
  if (zc < 0.1) zc = 0.1;
  return [cx + f * xc / zc, cy - f * yc / zc, f / zc];
}
function unproj(sx, sy, py) {
  var xc = (sx - cx) / f, yc = -(sy - cy) / f;
  var d = [Fv[0] + Rv[0] * xc + Uv[0] * yc, Fv[1] + Rv[1] * xc + Uv[1] * yc, Fv[2] + Rv[2] * xc + Uv[2] * yc];
  if (d[1] > -0.01) return null;
  var k = (py - CAM.y) / d[1];
  return { x: CAM.x + d[0] * k, z: CAM.z + d[2] * k };
}
var BTOP = 6.6;
function layout(W, H) {
  setCam(H > W * 1.1);
  f = W * 2.2; cx = W / 2;
  for (var i = 0; i < 8; i++) {
    cy = 0;
    var near = P(-3.4, 0, 7.6), nr = P(3.4, 0, 7.6);
    if (nr[0] - near[0] > W * 0.96) { f *= W * 0.96 / (nr[0] - near[0]); continue; }
    var top = P(0, BTOP, WZ)[1], bot = P(0, 0, 7.9)[1];
    if (bot - top > H * 0.96) { f *= (H * 0.96) / (bot - top); continue; }
    cy = H * 0.02 - top; if (cy + bot > H * 0.99) cy = H * 0.99 - bot;
    break;
  }
}

/* ---------------- رسم ---------------- */
function poly(c, pts, fill, stroke, lw) {
  c.beginPath(); pts.forEach(function (q, i) { var p = P(q[0], q[1], q[2]); if (i) c.lineTo(p[0], p[1]); else c.moveTo(p[0], p[1]); }); c.closePath();
  if (fill) { c.fillStyle = fill; c.fill(); }
  if (stroke) { c.strokeStyle = stroke; c.lineWidth = lw || 1; c.stroke(); }
}
function line(c, a, b, col, lw) { var p = P(a[0], a[1], a[2]), q = P(b[0], b[1], b[2]); c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(q[0], q[1]); c.strokeStyle = col; c.lineWidth = lw; c.stroke(); }
function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

var logo = new Image(); logo.src = "../tasvir/logo.webp"; var logoOk = false;
logo.onload = function () { logoOk = true; bgDirty = true; };
var BG = document.createElement("canvas"), bgDirty = true;
var WX = 7.5, WZ = -11, WZN = 16, CEIL = 9;

function drawRoom(c, W, H) {
  c.fillStyle = "#cfd8e6"; c.fillRect(0, 0, W, H);
  var g = c.createLinearGradient(0, P(0, CEIL, WZ)[1], 0, P(0, 0, WZ)[1]);
  g.addColorStop(0, "#c3cde0"); g.addColorStop(0.6, "#e3e8f1"); g.addColorStop(1, "#c9d1e2");
  poly(c, [[-WX, CEIL, WZ], [WX, CEIL, WZ], [WX, 0, WZ], [-WX, 0, WZ]], g);
  [-1, 1].forEach(function (s) {
    var a = P(s * WX, CEIL, WZ), b = P(s * WX, CEIL, 6), gg = c.createLinearGradient(a[0], 0, b[0], 0);
    gg.addColorStop(0, "#bac5da"); gg.addColorStop(1, "#8e9bb9");
    poly(c, [[s * WX, CEIL, WZ], [s * WX, CEIL, WZN], [s * WX, 0, WZN], [s * WX, 0, WZ]], gg);
    for (var k = 0; k < 4; k++) {
      var z0 = -9.6 + k * 4.6, z1 = z0 + 2.8;
      poly(c, [[s * WX, 7.6, z0], [s * WX, 7.6, z1], [s * WX, 4.6, z1], [s * WX, 4.6, z0]], "#9fd0f0", "#6b7a99", 2);
      line(c, [s * WX, 6.1, z0], [s * WX, 6.1, z1], "#6b7a99", 1.5);
    }
    /* پرده‌های سبز کناری */
    poly(c, [[s * (WX - 0.02), 2.4, WZ], [s * (WX - 0.02), 2.4, 8], [s * (WX - 0.02), 0, 8], [s * (WX - 0.02), 0, WZ]], s < 0 ? "#1f5f45" : "#1a5440");
  });
  poly(c, [[-WX, 2.4, WZ], [WX, 2.4, WZ], [WX, 0, WZ], [-WX, 0, WZ]], "#1f5f45");
  poly(c, [[-WX, 2.48, WZ], [WX, 2.48, WZ], [WX, 2.4, WZ], [-WX, 2.4, WZ]], "#e0a63a");
  var bt = P(0, 1.2, WZ), bs = bt[2];
  c.fillStyle = "#ffd77a"; c.font = "800 " + Math.max(6, 0.55 * bs) + "px Vazirmatn,Tahoma,sans-serif"; c.textAlign = "center"; c.textBaseline = "middle";
  c.fillText("ANJOMAN · SUNDBYBERG", bt[0] - 3.4 * bs, bt[1]);
  c.fillText("انجمن ایرانیان سوندبی‌بری", bt[0] + 3.4 * bs, bt[1]);
  /* کف چوبی */
  var fl = c.createLinearGradient(0, P(0, 0, WZ)[1], 0, H);
  fl.addColorStop(0, "#b98551"); fl.addColorStop(1, "#d6a46b");
  poly(c, [[-WX, 0, WZ], [WX, 0, WZ], [WX, 0, WZN], [-WX, 0, WZN]], fl);
  c.save(); c.globalAlpha = 0.18;
  for (var xx = -WX; xx <= WX; xx += 0.5) line(c, [xx, 0, WZ], [xx, 0, 9], "#7a5022", 1);
  c.restore();
  /* زمین سبز و خطوط */
  poly(c, [[-3.75, 0, -7.6], [3.75, 0, -7.6], [3.75, 0, 7.6], [-3.75, 0, 7.6]], "#2f7d55");
  var lw = function (z) { return Math.max(1, 0.045 * P(0, 0, z)[2]); }, W2 = "#f4f4f4";
  [[-CWD, -CL, -CWD, CL], [CWD, -CL, CWD, CL], [-CWS, -CL, -CWS, CL], [CWS, -CL, CWS, CL], [-CWD, -CL, CWD, -CL], [-CWD, CL, CWD, CL],
   [-CWD, -LSD, CWD, -LSD], [-CWD, LSD, CWD, LSD], [-CWD, -SSL, CWD, -SSL], [-CWD, SSL, CWD, SSL], [0, -CL, 0, -SSL], [0, SSL, 0, CL]].forEach(function (q) {
    line(c, [q[0], 0, q[1]], [q[2], 0, q[3]], W2, lw((q[1] + q[3]) / 2));
  });
  /* وسایل کنار زمین */
  drawBag(c, -5.2, -8.6); drawShoes(c, -4.3, -8.3); drawBasket(c, 5.0, -8.6); drawChair(c, 4.6, 0.2);
  var lt = P(0, 0, 0), rg = c.createRadialGradient(lt[0], lt[1], 10, lt[0], lt[1], W * 0.8);
  rg.addColorStop(0, "#ffffff1c"); rg.addColorStop(1, "#ffffff00");
  poly(c, [[-WX, 0, WZ], [WX, 0, WZ], [WX, 0, WZN], [-WX, 0, WZN]], rg);
  if (logoOk) { var a1 = P(-6.4, 6.4, WZ), b1 = P(-4.4, 4.4, WZ), sz = Math.min(b1[0] - a1[0], b1[1] - a1[1]); c.drawImage(logo, a1[0], a1[1], sz, sz); }
  var ck = P(5.3, 5.4, WZ), cr = 0.85 * ck[2];
  c.beginPath(); c.arc(ck[0], ck[1], cr, 0, 7); c.fillStyle = "#fff"; c.fill(); c.lineWidth = Math.max(1, cr * 0.12); c.strokeStyle = "#1f5f45"; c.stroke();
}
function drawBag(c, x, z) {
  var L = 0.85, Hh = 0.35, D = 0.32;
  var sh = P(x, 0, z), s = sh[2];
  c.fillStyle = "#0004"; c.beginPath(); c.ellipse(sh[0], sh[1], L * 0.6 * s, 0.12 * s, 0, 0, 7); c.fill();
  poly(c, [[x - L / 2, 0, z + D / 2], [x + L / 2, 0, z + D / 2], [x + L / 2, Hh * 0.8, z + D / 2], [x + L * 0.38, Hh, z + D / 2], [x - L * 0.38, Hh, z + D / 2], [x - L / 2, Hh * 0.8, z + D / 2]], "#1f4fb3", "#123070", 1.2);
  poly(c, [[x - L * 0.38, Hh, z + D / 2], [x + L * 0.38, Hh, z + D / 2], [x + L * 0.38, Hh, z - D / 2], [x - L * 0.38, Hh, z - D / 2]], "#2a63d6", "#123070", 1);
  line(c, [x - L / 2, 0.12, z + D / 2 + 0.002], [x + L / 2, 0.12, z + D / 2 + 0.002], "#ffc83d", Math.max(1, 0.03 * s));
  var h1 = P(x - 0.2, Hh, z), h2 = P(x + 0.2, Hh, z), hh = P(x, Hh + 0.18, z);
  c.beginPath(); c.moveTo(h1[0], h1[1]); c.quadraticCurveTo(hh[0], hh[1] - (h1[1] - hh[1]) * 0.6, h2[0], h2[1]); c.strokeStyle = "#0d1d4a"; c.lineWidth = Math.max(1.5, 0.035 * s); c.stroke();
  /* راکت بیرون‌زده از ساک */
  line(c, [x + 0.2, Hh, z], [x + 0.45, Hh + 0.42, z], "#333", Math.max(1, 0.015 * s));
  var rh = P(x + 0.52, Hh + 0.55, z); c.beginPath(); c.ellipse(rh[0], rh[1], 0.1 * s, 0.13 * s, 0.5, 0, 7); c.strokeStyle = "#c62828"; c.lineWidth = Math.max(1, 0.02 * s); c.stroke();
}
function drawShoe(c, x, z) {
  var s = P(x, 0, z)[2], L = 0.3;
  poly(c, [[x - L / 2, 0, z], [x + L / 2, 0, z], [x + L / 2, 0.03, z], [x - L / 2, 0.03, z]], "#f4f4f4", "#999", 1);
  poly(c, [[x - L / 2, 0.03, z], [x + L * 0.42, 0.03, z], [x + L * 0.2, 0.08, z], [x - L * 0.15, 0.12, z], [x - L / 2, 0.11, z]], "#e2572b", "#8a2c12", 1);
  var sh = P(x, 0, z); c.fillStyle = "#0003"; c.beginPath(); c.ellipse(sh[0], sh[1] + 1, L * 0.55 * s, 0.03 * s, 0, 0, 7); c.fill();
}
function drawShoes(c, x, z) { drawShoe(c, x, z - 0.06); drawShoe(c, x + 0.04, z + 0.1); }
function drawBasket(c, x, z) {
  var R = 0.32, Hh = 0.4, p0 = P(x, 0, z), s = p0[2];
  c.fillStyle = "#0004"; c.beginPath(); c.ellipse(p0[0], p0[1], R * 1.2 * s, 0.09 * s, 0, 0, 7); c.fill();
  [[-0.14, 0.75, "#c62828"], [0.0, 0.85, "#1f4fb3"], [0.14, 0.75, "#2f7d55"]].forEach(function (q, i) {
    line(c, [x + q[0], Hh, z], [x + q[0] * 1.6, Hh + q[1] - 0.12, z], "#333", Math.max(1, 0.015 * s));
    var bc = P(x + q[0] * 1.8, Hh + q[1], z);
    c.save(); c.translate(bc[0], bc[1]); c.rotate((i - 1) * 0.3); c.beginPath(); c.ellipse(0, 0, 0.1 * s, 0.13 * s, 0, 0, 7); c.strokeStyle = q[2]; c.lineWidth = Math.max(1, 0.02 * s); c.stroke();
    c.strokeStyle = "#ffffff66"; c.lineWidth = 0.5; for (var k = -2; k <= 2; k++) { c.beginPath(); c.moveTo(k * 0.035 * s, -0.12 * s); c.lineTo(k * 0.035 * s, 0.12 * s); c.stroke(); } c.restore();
  });
  /* لوله‌های شاتل */
  [[0.2, "#1a7a4a"], [0.27, "#e0a63a"]].forEach(function (q) { line(c, [x + q[0], Hh - 0.05, z + 0.05], [x + q[0] + 0.05, Hh + 0.55, z + 0.05], q[1], Math.max(2, 0.07 * s)); });
  var tl = P(x - R, Hh, z), tr = P(x + R, Hh, z), bl = P(x - R * 0.8, 0, z), brr = P(x + R * 0.8, 0, z);
  c.beginPath(); c.moveTo(tl[0], tl[1]); c.lineTo(tr[0], tr[1]); c.lineTo(brr[0], brr[1]); c.lineTo(bl[0], bl[1]); c.closePath();
  var gw = c.createLinearGradient(0, tl[1], 0, bl[1]); gw.addColorStop(0, "#d9a55b"); gw.addColorStop(1, "#9c6b2e"); c.fillStyle = gw; c.fill(); c.strokeStyle = "#7a5022"; c.lineWidth = 1; c.stroke();
  c.save(); c.clip(); c.strokeStyle = "#7a502288"; c.lineWidth = Math.max(1, 0.012 * s);
  for (var k = 1; k < 6; k++) { var yy = tl[1] + (bl[1] - tl[1]) * k / 6; c.beginPath(); c.moveTo(tl[0] - 5, yy); c.lineTo(tr[0] + 5, yy); c.stroke(); }
  c.restore();
  [[-0.15, 0.02], [-0.05, 0.05], [0.06, 0.02], [0.12, 0.05]].forEach(function (q) { drawShuttleAt(c, x + q[0], Hh + q[1], z, 0, 1, 0); });
}
function drawChair(c, x, z) {
  var s = P(x, 0, z)[2], col = "#3a3f4b", lw = Math.max(1.5, 0.05 * s);
  [[-0.3, -0.3], [0.3, -0.3], [-0.3, 0.3], [0.3, 0.3]].forEach(function (q) { line(c, [x + q[0], 0, z + q[1]], [x + q[0] * 0.6, 1.6, z + q[1] * 0.6], col, lw); });
  poly(c, [[x - 0.25, 1.6, z - 0.25], [x + 0.25, 1.6, z - 0.25], [x + 0.25, 1.6, z + 0.25], [x - 0.25, 1.6, z + 0.25]], "#1f5f45", col, 1);
  poly(c, [[x + 0.22, 1.6, z - 0.25], [x + 0.22, 2.2, z - 0.25], [x + 0.22, 2.2, z + 0.25], [x + 0.22, 1.6, z + 0.25]], "#1a5440", col, 1);
  line(c, [x - 0.27, 0.6, z - 0.27], [x - 0.27, 0.6, z + 0.27], col, lw * 0.7); line(c, [x - 0.24, 1.1, z - 0.24], [x - 0.24, 1.1, z + 0.24], col, lw * 0.7);
}
function drawNet(c) {
  var a = P(-CWD, NET, 0), b = P(CWD, NET, 0), d = P(CWD, NETB, 0), e = P(-CWD, NETB, 0);
  c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.lineTo(d[0], d[1]); c.lineTo(e[0], e[1]); c.closePath();
  c.fillStyle = "#11111133"; c.fill();
  c.save(); c.clip(); c.strokeStyle = "#ffffff30"; c.lineWidth = 0.7;
  for (var i = 0; i <= 60; i++) { var xx = -CWD + i * CWD / 30, p = P(xx, NET, 0), q = P(xx, NETB, 0); c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(q[0], q[1]); c.stroke(); }
  for (i = 1; i < 8; i++) { var yy = NETB + (NET - NETB) * i / 8, p2 = P(-CWD, yy, 0), q2 = P(CWD, yy, 0); c.beginPath(); c.moveTo(p2[0], p2[1]); c.lineTo(q2[0], q2[1]); c.stroke(); }
  c.restore();
  line(c, [-CWD, NET, 0], [CWD, NET, 0], "#f4f4f4", Math.max(1.5, 0.05 * a[2]));
  [-1, 1].forEach(function (s) { line(c, [s * (CWD + 0.05), NET + 0.02, 0], [s * (CWD + 0.05), 0, 0], "#1b1b1b", Math.max(2, 0.06 * a[2])); });
}
function drawBoard(c, st) {
  var a = P(-3.4, BTOP, WZ + 0.02), b = P(3.4, 3.4, WZ + 0.02), x = a[0], y = a[1], w = b[0] - a[0], h = b[1] - a[1];
  c.save();
  c.fillStyle = "#0a0a0d"; c.strokeStyle = "#5a5f6e"; c.lineWidth = Math.max(1.5, w * 0.012);
  rr(c, x, y, w, h, w * 0.03); c.fill(); c.stroke();
  var pad = w * 0.045, rowH = (h - pad * 1.2) / 3.2, fs = rowH * 0.78;
  c.textBaseline = "middle";
  for (var i = 0; i < 2; i++) {
    var ry = y + pad * 0.7 + rowH * (i + 0.5);
    if (st.server === i && !st.over) { c.fillStyle = "#ffd23f"; c.shadowColor = "#ffd23f"; c.shadowBlur = fs * 0.4; c.beginPath(); c.arc(x + pad * 0.9, ry, fs * 0.16, 0, 7); c.fill(); c.shadowBlur = 0; }
    c.fillStyle = "#f2f2f2"; c.font = "700 " + fs * 0.82 + "px Vazirmatn,Tahoma,sans-serif"; c.textAlign = "left"; c.direction = "ltr";
    var nm = String(st.names[i] || ""); if (nm.length > 12) nm = nm.slice(0, 11) + "…";
    c.fillText(nm, x + pad * 1.6, ry);
    c.textAlign = "center";
    led(c, String(st.sets[i]), x + w * 0.67, ry, "#ffb02e", fs);
    led(c, String(st.pts[i]), x + w * 0.85, ry, "#ff3b2f", fs * 1.08);
  }
  c.strokeStyle = "#2a2d36"; c.lineWidth = 1; c.beginPath(); c.moveTo(x + pad, y + pad * 0.7 + rowH * 2.1); c.lineTo(x + w - pad, y + pad * 0.7 + rowH * 2.1); c.stroke();
  c.font = "700 " + fs * 0.7 + "px Vazirmatn,Tahoma,sans-serif"; c.fillStyle = "#58e06f"; c.shadowColor = "#58e06f"; c.shadowBlur = fs * 0.3;
  c.direction = LANG === "fa" ? "rtl" : "ltr";
  c.fillText(t("setW") + " " + num(st.setNo) + " " + t("ofW") + " " + num(st.best), x + w / 2, y + pad * 0.7 + rowH * 2.65);
  c.restore();
}
function led(c, s, x, y, col, fs) {
  c.font = "700 " + fs + "px 'Courier New',ui-monospace,monospace";
  c.fillStyle = col + "22"; c.fillText("88".slice(0, Math.max(1, s.length)), x, y);
  c.fillStyle = col; c.shadowColor = col; c.shadowBlur = fs * 0.35; c.fillText(s, x, y); c.shadowBlur = 0;
}
function drawClockHands(c) {
  var ck = P(5.3, 5.4, WZ), cr = 0.85 * ck[2], d = new Date(), m = d.getMinutes(), hr = d.getHours() % 12 + m / 60;
  c.strokeStyle = "#1f5f45"; c.lineCap = "round";
  [[hr / 12, 0.5, 0.1], [m / 60, 0.78, 0.07]].forEach(function (q) { var an = q[0] * Math.PI * 2 - Math.PI / 2; c.lineWidth = Math.max(1, cr * q[2]); c.beginPath(); c.moveTo(ck[0], ck[1]); c.lineTo(ck[0] + Math.cos(an) * cr * q[1], ck[1] + Math.sin(an) * cr * q[1]); c.stroke(); });
  c.lineCap = "butt";
}

/* شاتل: سر چوب‌پنبه‌ای و دامن پر، رو به جهت حرکت */
function drawShuttleAt(c, x, y, z, vx, vy, vz) {
  var v = Math.hypot(vx, vy, vz) || 1, ux = vx / v, uy = vy / v, uz = vz / v;
  var p = P(x, y, z), q = P(x - ux * 0.07, y - uy * 0.07, z - uz * 0.07);
  var dx = q[0] - p[0], dy = q[1] - p[1], dl = Math.hypot(dx, dy);
  var minL = Math.max(3, 0.07 * p[2]) * 0.55;
  if (dl < minL) { if (dl < 0.01) { dx = 0; dy = -1; dl = 1; } dx = dx / dl * minL; dy = dy / dl * minL; dl = minL; }
  var nx = -dy / dl, ny = dx / dl, rc = Math.max(2.2, 0.014 * p[2]), rs = Math.max(4.2, 0.034 * q[2]);
  c.beginPath(); c.moveTo(p[0] + nx * rc, p[1] + ny * rc); c.lineTo(p[0] + dx + nx * rs, p[1] + dy + ny * rs); c.lineTo(p[0] + dx - nx * rs, p[1] + dy - ny * rs); c.lineTo(p[0] - nx * rc, p[1] - ny * rc); c.closePath();
  c.fillStyle = "#fbfbf7"; c.fill(); c.strokeStyle = "#9aa0a8"; c.lineWidth = 0.8; c.stroke();
  c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(p[0] + dx, p[1] + dy); c.strokeStyle = "#c9ccd2"; c.stroke();
  c.beginPath(); c.arc(p[0], p[1], rc * 1.15, 0, 7); c.fillStyle = "#f2e6cf"; c.fill(); c.strokeStyle = "#b9a37a"; c.lineWidth = 0.7; c.stroke();
}
function drawShuttle(c, s, VF, tr) {
  for (var i = 0; i < tr.length; i++) { var a = P(tr[i][0], tr[i][1], tr[i][2]); c.fillStyle = "rgba(255,255,255," + (0.05 + 0.2 * i / tr.length) + ")"; c.beginPath(); c.arc(a[0], a[1], Math.max(1.2, 0.012 * a[2]), 0, 7); c.fill(); }
  var sh = P(s.x * VF, 0, s.z * VF), r = Math.max(2.5, 0.05 * sh[2]);
  c.fillStyle = "#0000004a"; c.beginPath(); c.ellipse(sh[0], sh[1], r, r * 0.4, 0, 0, 7); c.fill();
  drawShuttleAt(c, s.x * VF, s.y, s.z * VF, s.vx * VF, s.vy, s.vz * VF);
}

/* بازیکن: از پشت (نزدیک) یا از روبه‌رو (دور) */
function drawPlayer(c, pl, VF, shirt, alpha, sw, sh, near) {
  var x = pl.x * VF, z = pl.z * VF, base = P(x, 0, z), s = base[2];
  c.fillStyle = "#00000038"; c.beginPath(); c.ellipse(base[0], base[1], 0.38 * s, 0.13 * s, 0, 0, 7); c.fill();
  c.save(); c.globalAlpha = alpha; c.lineCap = "round";
  var hip = P(x, 0.92, z), sho = P(x, 1.42, z), head = P(x, 1.62, z), hw = 0.17 * s;
  var step = Math.sin(pl.walk || 0) * 0.12;
  [[-1, step], [1, -step]].forEach(function (q) { var ft = P(x + q[0] * 0.14, 0.02, z + q[1]); c.strokeStyle = "#20242e"; c.lineWidth = 0.11 * s; c.beginPath(); c.moveTo(hip[0] + q[0] * hw * 0.5, hip[1]); c.lineTo(ft[0], ft[1]); c.stroke(); c.fillStyle = "#f4f4f4"; c.beginPath(); c.ellipse(ft[0], ft[1], 0.07 * s, 0.035 * s, 0, 0, 7); c.fill(); });
  c.fillStyle = "#20242e"; rr(c, hip[0] - hw, hip[1] - 0.08 * s, hw * 2, 0.16 * s, 0.04 * s); c.fill();
  c.fillStyle = shirt; rr(c, sho[0] - hw * 1.1, sho[1] - 0.03 * s, hw * 2.2, hip[1] - sho[1] + 0.04 * s, 0.07 * s); c.fill();
  /* راکت */
  var side = (near ? 1 : -1) * VF * (pl.hand || 1), rest = { x: x + 0.38 * side, y: 1.45, z: z };
  var rp = sh ? { x: sh.x * VF, y: sh.y, z: sh.z * VF } : null, hd = rest;
  if (rp) { var dd = Math.hypot(rp.x - x, rp.z - z); if (dd < 2.4 && rp.y < 3.2) { var k = clamp(1 - (dd - 0.8) / 1.6, 0, 1); hd = { x: rest.x + (rp.x - rest.x) * k * 0.85, y: rest.y + (Math.min(rp.y, 2.7) - rest.y) * k, z: rest.z + (rp.z - rest.z) * k * 0.6 }; } }
  if (sw > 0) { var ph = 1 - sw / 0.3; hd = { x: hd.x - side * 0.3 * Math.sin(ph * Math.PI), y: hd.y + 0.35 * Math.sin(ph * Math.PI), z: hd.z }; }
  var hand = P(x + (hd.x - x) * 0.55, 1.1 + (hd.y - 1.1) * 0.55, z + (hd.z - z) * 0.55), rh = P(hd.x, hd.y, hd.z), shp = P(x + 0.2 * side, 1.4, z);
  c.strokeStyle = "#e0b48c"; c.lineWidth = 0.07 * s; c.beginPath(); c.moveTo(shp[0], shp[1]); c.lineTo(hand[0], hand[1]); c.stroke();
  c.strokeStyle = "#333"; c.lineWidth = Math.max(1, 0.02 * s); c.beginPath(); c.moveTo(hand[0], hand[1]); c.lineTo(rh[0], rh[1]); c.stroke();
  var an = Math.atan2(rh[1] - hand[1], rh[0] - hand[0]) + Math.PI / 2;
  c.save(); c.translate(rh[0], rh[1]); c.rotate(an); c.beginPath(); c.ellipse(0, 0, 0.11 * rh[2], 0.14 * rh[2], 0, 0, 7); c.fillStyle = "#ffffff22"; c.fill(); c.strokeStyle = near ? "#c62828" : "#1f4fb3"; c.lineWidth = Math.max(1, 0.02 * rh[2]); c.stroke(); c.restore();
  c.fillStyle = "#e0b48c"; c.beginPath(); c.arc(head[0], head[1], 0.12 * s, 0, 7); c.fill();
  c.fillStyle = "#3b2a20"; c.beginPath(); c.arc(head[0], head[1] - (near ? 0 : 0.03 * s), 0.12 * s, Math.PI, near ? Math.PI * 3 : Math.PI * 2); c.fill();
  c.restore();
}

function render(c, W, H, st, VF) {
  if (bgDirty || BG.width !== c.canvas.width) {
    BG.width = c.canvas.width; BG.height = c.canvas.height;
    var bc = BG.getContext("2d"); bc.setTransform(c.canvas.width / W, 0, 0, c.canvas.width / W, 0, 0); drawRoom(bc, W, H); bgDirty = false;
  }
  c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(BG, 0, 0);
  c.setTransform(c.canvas.width / W, 0, 0, c.canvas.width / W, 0, 0);
  drawClockHands(c); drawBoard(c, st);
  if (st.mark) { var m = P(st.mark.x * VF, 0, st.mark.z * VF); c.strokeStyle = "rgba(255,215,90," + clamp(st.mark.t, 0, 1) + ")"; c.lineWidth = 2; c.beginPath(); c.ellipse(m[0], m[1], 0.22 * m[2], 0.08 * m[2], 0, 0, 7); c.stroke(); }
  var me = VF === 1 ? 0 : 1, op = 1 - me, s = st.s, sz = s.z * VF;
  var tr = (st.trail || []).map(function (q) { return [q[0] * VF, q[1], q[2] * VF]; });
  var sv = st.st === "rally" || st.st === "serve";
  var oz = st.pl[op].z * VF;
  if (sv && sz < 0 && sz < oz) drawShuttle(c, s, VF, tr);
  drawPlayer(c, st.pl[op], VF, me === 0 ? "#1f4fb3" : "#c62828", 1, st.pl[op].sw || 0, sv ? s : null, false);
  if (sv && sz < 0 && sz >= oz) drawShuttle(c, s, VF, tr);
  drawNet(c);
  var mz = st.pl[me].z * VF;
  if (sv && sz >= 0 && sz < mz) drawShuttle(c, s, VF, tr);
  drawPlayer(c, st.pl[me], VF, me === 0 ? "#c62828" : "#1f4fb3", 0.72, st.pl[me].sw || 0, sv ? s : null, true);
  if (sv && sz >= 0 && sz >= mz) drawShuttle(c, s, VF, tr);
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

function myName() { var e = $("nm"), n = ((e && e.value) || store("bd-name") || store("pp-name") || "").trim().slice(0, 16); if (n) store("bd-name", n); return n || t("me"); }
function radio(name, items, cur) {
  return '<div class="opts">' + items.map(function (it) {
    return '<label><input type="radio" name="' + name + '" value="' + it[0] + '"' + (it[0] === cur ? " checked" : "") + '><span class="o">' + it[1] + (it[2] ? "<small>" + it[2] + "</small>" : "") + "</span></label>";
  }).join("") + "</div>";
}
function val(name) { var e = document.querySelector('input[name="' + name + '"]:checked'); return e ? e.value : null; }

function menu() {
  stopLoop(); G = null; MODE = null; cv = null;
  var lvl = store("bd-lvl") || "m", rk = store("bd-rk") || "all", ln = store("bd-len") || "3";
  $app.innerHTML = '<div class="panel">' +
    '<canvas class="hero" id="hero"></canvas>' +
    "<h2>" + t("title") + "</h2><p>" + t("intro") + "</p>" +
    '<label class="field"><span>' + t("name") + '</span><input id="nm" maxlength="16" value="' + esc(store("bd-name") || store("pp-name") || "") + '" placeholder="' + t("namePh") + '" autocomplete="nickname"></label>' +
    '<div class="field"><span>' + t("level") + "</span>" + radio("lvl", [["m", t("lvlM"), t("lvlMd")], ["h", t("lvlH"), t("lvlHd")]], lvl) + "</div>" +
    '<div class="field"><span>' + t("racket") + "</span>" + radio("rk", [["def", t("def"), t("defd")], ["all", t("all"), t("alld")], ["off", t("off"), t("offd")]], rk) + "</div>" +
    '<div class="field"><span>' + t("len") + "</span>" + radio("len", [["1", t("len1")], ["3", t("len3")]], ln) + "</div>" +
    '<button class="btn" id="solo">' + t("vsAI") + "</button>" +
    '<div class="row"><button class="btn alt" id="mk">' + t("mk") + '</button><button class="btn alt" id="jn">' + t("jn") + "</button></div>" +
    '<div id="jbox" hidden><label class="field"><span>' + t("code") + '</span><input id="jc" inputmode="numeric" maxlength="4" dir="ltr" placeholder="1234"></label><button class="btn" id="jgo">' + t("go") + "</button></div>" +
    '<details class="rules"><summary>' + t("rulesT") + "</summary><ul>" + t("rules").map(function (r) { return "<li>" + r + "</li>"; }).join("") + "</ul></details>" +
    "</div>";
  function saveOpts() { store("bd-lvl", val("lvl")); store("bd-rk", val("rk")); store("bd-len", val("len")); myName(); }
  $("solo").onclick = function () { saveOpts(); audio(); startAI(); };
  $("mk").onclick = function () { saveOpts(); audio(); host(); };
  $("jn").onclick = function () { $("jbox").hidden = false; $("jc").focus(); };
  $("jgo").onclick = function () { saveOpts(); audio(); join($("jc").value); };
  $("jc").onkeydown = function (e) { if (e.key === "Enter") $("jgo").click(); };
  var hc = $("hero"), w = Math.min(440, $app.clientWidth - 36), h = Math.round(w * 0.62), dpr = Math.min(2, window.devicePixelRatio || 1);
  hc.width = w * dpr; hc.height = h * dpr; hc.style.height = h + "px";
  var demo = { names: ["Alborz", "Arshad"], sets: [1, 0], pts: [12, 9], setNo: 2, best: 3, server: 0, over: false, st: "rally",
    s: { x: -0.8, y: 3.2, z: -1.5, vx: -1, vy: 2, vz: -5 }, pl: [{ x: 0.6, z: 4.2, sw: 0 }, { x: -1.2, z: -4.5, sw: 0 }], trail: [] };
  layout(w, h); bgDirty = true;
  var hx = hc.getContext("2d");
  var draw = function () { render(hx, w, h, demo, 1); bgDirty = true; };
  draw(); logo.addEventListener("load", draw, { once: true });
}

function startAI() {
  MODE = "ai"; ME = 0;
  var lvl = store("bd-lvl") || "m";
  newGame({ lvl: lvl, best: +(store("bd-len") || 3), names: [myName(), t("computer")], rts: [store("bd-rk") || "all", lvl === "h" ? (Math.random() < 0.5 ? "off" : "all") : "all"] });
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
  if (!G.L.auto) h += '<div class="spin">' + ["clear", "drop", "smash", "drive"].map(function (k, i) { return '<button type="button" data-s="' + k + '" class="' + (G.shot[ME] === k ? "on" : "") + '">' + t("shots")[k] + "<kbd>" + (i + 1) + "</kbd></button>"; }).join("") + "</div>";
  h += '<button type="button" id="snd">' + (muted ? t("sndOff") : t("sndOn")) + "</button>";
  if (MODE === "ai") h += '<button type="button" id="pz">' + (G.paused ? t("resume") : t("pause")) + "</button>";
  h += '<button type="button" id="ex">' + t("exit") + "</button>";
  bar.innerHTML = h;
  $("hint").textContent = t("hint") + (!G.L.auto ? " " + t("hintH") : "") + "  ·  " + t("lvlTag")[G.lvl] + " · " + t(G.rts[ME]);
  bar.querySelectorAll("[data-s]").forEach(function (b) { b.onclick = function () { setShot(b.getAttribute("data-s")); }; });
  $("snd").onclick = function () { muted = !muted; store("bd-mute", muted ? "1" : "0"); audio(); buildBar(); };
  if ($("pz")) $("pz").onclick = function () { G.paused = !G.paused; buildBar(); };
  $("ex").onclick = leave;
}
function setShot(k) { if (!G) return; G.shot[ME] = k; var bar = $("bar"); if (bar) bar.querySelectorAll("[data-s]").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-s") === k); }); }
function showShot(kind) { if (!shotEl) return; shotEl.textContent = t("shotLbl")[kind] || ""; shotEl.classList.add("on"); shotT = 0.8; }

function resize() {
  if (!cv) return;
  var W = cv.parentNode.clientWidth, vh = window.innerHeight, avail = vh - 150;
  var H = Math.round(Math.max(320, Math.min(W * 1.6, avail)));
  if (W > H * 1.25) H = Math.round(Math.min(Math.max(H, W * 0.6), avail > 380 ? avail : W * 0.7));
  layout(W, H); var need = Math.round((P(0, 0, 7.9)[1] - P(0, BTOP, WZ)[1]) / 0.96);
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
    var w = unproj(sx, sy, 0); if (!w) return;
    var VF = ME === 0 ? 1 : -1, pl = G.pl[ME];
    if (G.st === "serve" && G.server === ME) return;
    pl.tx = clamp(w.x * VF, -3.3, 3.3); pl.tz = ME === 0 ? clamp(w.z, 0.6, 7.7) : clamp(-w.z, -7.7, -0.6);
  }
  cv.addEventListener("pointermove", mv);
  cv.addEventListener("pointerdown", function (e) { audio(); if (AC && AC.state === "suspended") AC.resume(); try { cv.setPointerCapture(e.pointerId); } catch (x) {} if (!serveReq()) mv(e); });
  document.onkeydown = function (e) {
    if (!G) return;
    if (e.target && e.target.tagName === "INPUT") return;
    keys[e.key] = true;
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); audio(); serveReq(); }
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
  [0, 1].forEach(function (p) { var pl = G.pl[p]; if (pl.sw > 0) pl.sw = Math.max(0, pl.sw - dt); var sp = Math.hypot(pl.vx, pl.vz); pl.walk = (pl.walk || 0) + sp * dt * 3; if (sp < 0.3) pl.walk *= 0.9; });
  if (G.mark) { G.mark.t -= dt; if (G.mark.t <= 0) G.mark = null; }
}
function simulate(dt) {
  G.clock += dt;
  var dtS = dt * G.L.ts;
  keyMove(dt);
  if (!(G.st === "serve" && G.server === 0)) move(G.pl[0], dtS, G.L.pSpd * RT[G.rts[0]].spd);
  if (MODE === "ai") aiThink(dt, dtS);
  else if (!(G.st === "serve" && G.server === 1)) move(G.pl[1], dtS, G.L.pSpd * RT[G.rts[1]].spd);
  anim(dt);
  if (G.st === "serve") holdS();
  else if (G.st === "rally") {
    var n = Math.ceil(dtS / (1 / 300)), h = dtS / n;
    for (var i = 0; i < n && G.st === "rally"; i++) {
      phys(G.s, h, onEv);
      if (G.st === "rally") { if (!tryHit(0)) tryHit(1); }
    }
  } else if (G.st === "point") {
    G.tm -= dt;
    if (G.tm <= 0) {
      if (G.after === "end") { G.st = "over"; showEnd(); }
      else if (G.after === "newset") { G.pts = [0, 0]; G.setNo++; setupServe(); }
      else setupServe();
    }
  }
  trail();
}
function trail() {
  if (G.st === "rally") { G.trail.push([G.s.x, G.s.y, G.s.z]); if (G.trail.length > 6) G.trail.shift(); }
  else G.trail.length = 0;
}
function frame(now) {
  raf = requestAnimationFrame(frame);
  var dt = Math.min(0.05, (now - last) / 1000); last = now;
  if (!G || !cv) return;
  if (!G.paused) {
    if (MODE === "guest") guestStep(dt); else simulate(dt);
    sendT += dt;
    if (sendT > 0.033) { sendT = 0; if (MODE === "host") hostSend(); else if (MODE === "guest") guestSend(); }
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
  d.innerHTML = '<div class="panel"><h2>' + (won ? t("youWon") : t("youLost")) + "</h2><p>" + tf("matchWon", esc(G.names[G.winner])) + '</p><div class="big">' + esc(G.names[0]) + " " + G.sets[0] + " – " + G.sets[1] + " " + esc(G.names[1]) + "</div>" +
    (MODE === "guest" ? "<p>" + t("waitHost") + "</p>" : '<button class="btn" id="again">' + t("again") + "</button>") +
    '<button class="btn ghost" id="tomenu">' + t("menu") + "</button></div>";
  gm.appendChild(d);
  if ($("again")) $("again").onclick = function () {
    if (MODE === "ai") startAI();
    else if (MODE === "host" && conn) { var o = { lvl: G.lvl, best: G.best, names: G.names, rts: G.rts }; newGame(o); conn.send({ t: "cfg", o: o, server: G.server }); d.remove(); buildBar(); }
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
  var code = String(Math.floor(1000 + Math.random() * 9000)), name = myName(), lvl = store("bd-lvl") || "m", best = +(store("bd-len") || 3), rk = store("bd-rk") || "all";
  MODE = "host"; ME = 0;
  $app.innerHTML = '<div class="panel"><h2>' + t("creating") + "</h2></div>";
  peer = new Peer(PFX + code);
  var opp = null;
  function lobby() {
    if (G) return;
    $app.innerHTML = '<div class="panel"><h2>' + t("roomT") + "</h2><p>" + t("roomP") + '</p><div class="code">' + code + "</div>" +
      "<p>" + (opp ? tf("oppIn", "<b>" + esc(opp.name) + "</b>") : t("waitOpp")) + "</p><p>" + t("lvlTag")[lvl] + " · " + t("len" + best) + "</p>" +
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
    p: [G.pl[0].x, G.pl[0].z, G.pl[0].sw, G.pl[1].x, G.pl[1].z, G.pl[1].sw],
    st: G.st, sc: [G.pts[0], G.pts[1], G.sets[0], G.sets[1], G.setNo, G.server], m: G.msg, ev: G.ev.splice(0), ov: G.over ? G.winner : -1,
    mk: G.mark ? [G.mark.x, G.mark.z, G.mark.t] : null
  });
}
function join(code) {
  if (!window.Peer) return toast(t("noPeer"));
  code = String(code || "").replace(/[۰-۹]/g, function (d) { return FAD.indexOf(d); }).replace(/\D/g, "");
  if (code.length !== 4) return toast(t("code4"));
  var name = myName(), rk = store("bd-rk") || "all";
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
      if (d.t === "cfg") { newGame(d.o); G.server = d.server; if (!cv || !$("cv")) gameView(); else { var e = document.querySelector(".end"); if (e) e.remove(); buildBar(); } return; }
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
  p0.tx = d.p[0]; p0.tz = d.p[1]; p0.sw = d.p[2];
  p1.hx = d.p[3]; p1.hz = d.p[4]; if (d.p[5] > 0.25) p1.sw = d.p[5];
  var wasServe = G.st === "serve";
  G.st = d.st === "over" ? "point" : d.st;
  G.pts = [d.sc[0], d.sc[1]]; G.sets = [d.sc[2], d.sc[3]]; G.setNo = d.sc[4]; G.server = d.sc[5];
  G.msg = d.m; G.mark = d.mk ? { x: d.mk[0], z: d.mk[1], t: d.mk[2] } : null;
  if (G.st === "serve") { p1.x = p1.tx = d.p[3]; p1.z = p1.tz = d.p[4]; }
  else if (wasServe) { p1.tx = p1.x; p1.tz = p1.z; }
  else if (Math.hypot(p1.x - d.p[3], p1.z - d.p[4]) > 1.2) { p1.x = d.p[3]; p1.z = d.p[4]; }
  (d.ev || []).forEach(function (e) { sfx(e); });
  if (d.ov >= 0 && !G.over) { G.over = true; G.winner = d.ov; }
  if (G.over && d.st === "over") showEnd();
}
function guestStep(dt) {
  G.clock += dt;
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
