/* حکم — انجمن ایرانیان سوندبی‌بری
   بازی با رایانه روی یک دستگاه، یا آنلاین تا چهار هموند (PeerJS فقط برای آشنا کردن دستگاه‌ها).
   جای‌ها: ۰ پایین، ۱ راست، ۲ بالا، ۳ چپ — نوبت پادساعتگرد (به راست). یارها: ۰ و ۲، ۱ و ۳. */
(function () {
"use strict";
var $app = document.getElementById("app"), $toast = document.getElementById("toast");
var FA = "۰۱۲۳۴۵۶۷۸۹";
function fa(n) { return String(n).replace(/\d/g, function (d) { return FA[d]; }); }
function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
function toast(t, ms) { $toast.textContent = t; $toast.classList.add("on"); clearTimeout(toast._t); toast._t = setTimeout(function () { $toast.classList.remove("on"); }, ms || 2600); }
function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

/* ---------------- cards ---------------- */
var SUITS = ["h", "d", "c", "s"];
var SUIT_FA = { h: "دل", d: "خشت", c: "گشنیز", s: "پیک" };
var RANK_TXT = { 11: "J", 12: "Q", 13: "K", 14: "A" };
var SVG = {
  h: '<path d="M50 90C20 66 4 49 4 30 4 15 16 5 30 5c10 0 17 6 20 13C53 11 60 5 70 5c14 0 26 10 26 25 0 19-16 36-46 60z"/>',
  d: '<path d="M50 3l38 47-38 47-38-47z"/>',
  s: '<path d="M50 3C40 22 7 40 7 61c0 14 11 22 23 22 8 0 14-4 17-10-1 10-5 18-13 24h32c-8-6-12-14-13-24 3 6 9 10 17 10 12 0 23-8 23-22C93 40 60 22 50 3z"/>',
  c: '<circle cx="50" cy="27" r="19"/><circle cx="27" cy="57" r="19"/><circle cx="73" cy="57" r="19"/><path d="M46 52h8c0 22 4 34 14 45H32c10-11 14-23 14-45z"/>'
};
function suitSvg(s) { return '<svg viewBox="0 0 100 100" aria-hidden="true">' + SVG[s] + "</svg>"; }
function rk(c) { return +c.slice(0, -1); }
function st(c) { return c.slice(-1); }
function rankTxt(r) { return RANK_TXT[r] || String(r); }
function cardName(c) { var r = rk(c), n = { 11: "سرباز", 12: "بی‌بی", 13: "شاه", 14: "آس" }[r] || fa(r); return n + " " + SUIT_FA[st(c)]; }
var PIPS = {
  2: [[50, 26], [50, 74, 1]],
  3: [[50, 26], [50, 50], [50, 74, 1]],
  4: [[33, 26], [67, 26], [33, 74, 1], [67, 74, 1]],
  5: [[33, 26], [67, 26], [50, 50], [33, 74, 1], [67, 74, 1]],
  6: [[33, 26], [67, 26], [33, 50], [67, 50], [33, 74, 1], [67, 74, 1]],
  7: [[33, 26], [67, 26], [50, 38], [33, 50], [67, 50], [33, 74, 1], [67, 74, 1]],
  8: [[33, 26], [67, 26], [50, 38], [33, 50], [67, 50], [50, 62, 1], [33, 74, 1], [67, 74, 1]],
  9: [[33, 24], [67, 24], [33, 41], [67, 41], [50, 50], [33, 59, 1], [67, 59, 1], [33, 76, 1], [67, 76, 1]],
  10: [[33, 24], [67, 24], [50, 33], [33, 41], [67, 41], [33, 59, 1], [67, 59, 1], [50, 67, 1], [33, 76, 1], [67, 76, 1]]
};
function cardHTML(c, cls, attrs) {
  if (!c) return '<div class="card back ' + (cls || "") + '"></div>';
  var r = rk(c), s = st(c), col = (s === "h" || s === "d") ? "r" : "k", ix = rankTxt(r) + suitSvg(s), h = "";
  h += '<span class="ix">' + ix + '</span><span class="ix b">' + ix + "</span>";
  if (r >= 11 && r <= 13) return '<div class="card ' + col + " " + (cls || "") + '" style="background-image:url(cards/' + RANK_TXT[r] + s + '.webp)" ' + (attrs || "") + ' aria-label="' + cardName(c) + '">' + h + "</div>";
  if (r === 14) h += '<span class="pip big" style="left:50%;top:50%">' + suitSvg(s) + "</span>";
  else PIPS[r].forEach(function (p) { h += '<span class="pip' + (p[2] ? " f" : "") + '" style="left:' + p[0] + "%;top:" + p[1] + '%">' + suitSvg(s) + "</span>"; });
  return '<div class="card num ' + col + " " + (cls || "") + '" ' + (attrs || "") + ' aria-label="' + cardName(c) + '">' + h + "</div>";
}
function newDeck() { var d = []; SUITS.forEach(function (s) { for (var r = 2; r <= 14; r++) d.push(r + s); }); for (var i = d.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = d[i]; d[i] = d[j]; d[j] = t; } return d; }
function sortHand(h, trump) {
  var order = trump ? [trump].concat(SUITS.filter(function (s) { return s !== trump; })) : SUITS;
  return h.slice().sort(function (a, b) { var d = order.indexOf(st(a)) - order.indexOf(st(b)); return d || rk(b) - rk(a); });
}

/* ---------------- engine (runs on the host / offline device) ---------------- */
var G = null;              // game state (host only)
var MODE = null;           // "solo" | "host" | "guest"
var MYSEAT = 0;
var AI_NAMES = ["کوروش", "شیرین", "آرش"];
function team(p) { return p % 2; }
function legal(hand, trick) {
  if (!trick.length) return hand.slice();
  var led = st(trick[0].c), same = hand.filter(function (c) { return st(c) === led; });
  return same.length ? same : hand.slice();
}
function trickWinner(trick, trump) {
  var led = st(trick[0].c), best = trick[0];
  trick.forEach(function (t) {
    var a = t.c, b = best.c;
    if (st(a) === st(b)) { if (rk(a) > rk(b)) best = t; }
    else if (st(a) === trump) best = t;
  });
  return best.p;
}
function newGame(names, types) {
  G = { names: names, types: types, score: [0, 0], hakem: -1, trump: null, hands: [[], [], [], []], trick: [], turn: -1,
        tricks: [0, 0], phase: "init", played: [], deck: [], last: null, msg: "", handNo: 0, gameWin: -1 };
  // تعیین حاکم: ورق یکی‌یکی پخش می‌شود تا آس به کسی برسد
  var d = newDeck(), p = Math.floor(Math.random() * 4);
  for (var i = 0; i < 52; i++) { if (rk(d[i]) === 14) break; p = (p + 1) % 4; }
  G.hakem = p;
  G.msg = "آس به " + G.names[p] + " رسید؛ حاکم است.";
  startHand();
}
function startHand() {
  G.handNo++; G.deck = newDeck(); G.hands = [[], [], [], []]; G.trick = []; G.tricks = [0, 0]; G.trump = null; G.played = []; G.last = null;
  for (var k = 0; k < 4; k++) { var p = (G.hakem + k) % 4; G.hands[p] = G.deck.splice(0, 5); }
  G.phase = "choose"; G.turn = G.hakem;
  push(); schedule();
}
function chooseTrump(p, s) {
  if (!G || G.phase !== "choose" || p !== G.hakem || SUITS.indexOf(s) < 0) return;
  G.trump = s;
  for (var round = 0; round < 2; round++) for (var k = 0; k < 4; k++) { var q = (G.hakem + k) % 4; G.hands[q] = G.hands[q].concat(G.deck.splice(0, 4)); }
  G.phase = "play"; G.turn = G.hakem; G.msg = G.names[p] + " حکم را «" + SUIT_FA[s] + "» کرد.";
  push(); schedule();
}
function playCard(p, c) {
  if (!G || G.phase !== "play" || p !== G.turn) return false;
  var h = G.hands[p], i = h.indexOf(c);
  if (i < 0 || legal(h, G.trick).indexOf(c) < 0) return false;
  h.splice(i, 1); G.trick.push({ p: p, c: c }); G.played.push(c); G.msg = "";
  if (G.trick.length < 4) { G.turn = (p + 1) % 4; push(); schedule(); return true; }
  var w = trickWinner(G.trick, G.trump); G.tricks[team(w)]++; G.phase = "trick"; G.turn = -1; G.last = w;
  push();
  setTimeout(function () {
    if (!G) return;
    G.trick = [];
    if (G.tricks[team(w)] >= 7) return endHand(team(w));
    G.phase = "play"; G.turn = w; push(); schedule();
  }, 1300);
  return true;
}
function endHand(win) {
  var lose = 1 - win, hk = team(G.hakem), pts = 1, kot = "";
  if (G.tricks[lose] === 0) { pts = lose === hk ? 3 : 2; kot = lose === hk ? "کُتِ حاکم!" : "کُت!"; }
  G.score[win] += pts;
  var names = win === 0 ? G.names[0] + " و " + G.names[2] : G.names[1] + " و " + G.names[3];
  G.msg = (kot ? kot + " " : "") + names + " این دست را بردند (" + fa(pts) + " امتیاز).";
  if (win !== hk) G.hakem = (G.hakem + 1) % 4;
  G.phase = G.score[win] >= 7 ? "over" : "hand";
  if (G.phase === "over") G.gameWin = win;
  push();
  if (G.phase === "hand") setTimeout(function () { if (G && G.phase === "hand") startHand(); }, 3800);
}

/* ---------------- computer player ---------------- */
function aiTrump(hand) {
  var best = null, bs = -1;
  SUITS.forEach(function (s) {
    var cs = hand.filter(function (c) { return st(c) === s; }), sc = cs.length * 10;
    cs.forEach(function (c) { sc += Math.max(0, rk(c) - 9); });
    if (sc > bs) { bs = sc; best = s; }
  });
  return best;
}
function isBoss(c, hand) {
  var s = st(c);
  for (var r = rk(c) + 1; r <= 14; r++) { var x = r + s; if (G.played.indexOf(x) < 0 && hand.indexOf(x) < 0) return false; }
  return true;
}
function lowest(cs) { return cs.slice().sort(function (a, b) { return rk(a) - rk(b); })[0]; }
function aiPlay(p) {
  var hand = G.hands[p], L = legal(hand, G.trick), T = G.trump, tr = G.trick;
  var nonT = L.filter(function (c) { return st(c) !== T; });
  if (!tr.length) {
    var boss = nonT.filter(function (c) { return isBoss(c, hand); });
    if (boss.length) return boss.sort(function (a, b) { return rk(b) - rk(a); })[0];
    var trumps = L.filter(function (c) { return st(c) === T; });
    if (trumps.length >= 4 && isBoss(trumps.sort(function (a, b) { return rk(b) - rk(a); })[0], hand)) return trumps[0];
    if (nonT.length) {
      // از بلندترین خال غیرحکم، کوچک‌ترین ورق
      var by = {}; nonT.forEach(function (c) { (by[st(c)] = by[st(c)] || []).push(c); });
      var ks = Object.keys(by).sort(function (a, b) { return by[b].length - by[a].length; });
      return lowest(by[ks[0]]);
    }
    return lowest(L);
  }
  var led = st(tr[0].c), w = trickWinner(tr, T), wc = tr.filter(function (t) { return t.p === w; })[0].c;
  var partnerWin = team(w) === team(p), last = tr.length === 3;
  var partnerSafe = partnerWin && (last || isBoss(wc, hand) || (st(wc) === T && led !== T));
  function beats(c) { if (st(c) === st(wc)) return rk(c) > rk(wc); return st(c) === T; }
  if (st(L[0]) === led) {                       // می‌تواند خال را بیاید
    if (partnerSafe) return lowest(L);
    var win = L.filter(beats);
    if (!win.length) return lowest(L);
    if (last) return lowest(win);
    var bw = win.filter(function (c) { return isBoss(c, hand); });
    if (bw.length) return lowest(bw);
    return partnerWin ? lowest(L) : lowest(L);
  }
  // خال را ندارد
  if (partnerSafe || (partnerWin && tr.length === 2 && isBoss(wc, hand))) return nonT.length ? lowest(nonT) : lowest(L);
  var tw = L.filter(function (c) { return st(c) === T && beats(c); });
  if (tw.length) return lowest(tw);
  return nonT.length ? lowest(nonT) : lowest(L);
}
var aiTimer = null;
function schedule() {
  clearTimeout(aiTimer);
  if (!G) return;
  var p = G.turn; if (p < 0 || G.types[p] !== "ai") return;
  aiTimer = setTimeout(function () {
    if (!G || G.turn !== p || G.types[p] !== "ai") return;
    if (G.phase === "choose") chooseTrump(p, aiTrump(G.hands[p]));
    else if (G.phase === "play") playCard(p, aiPlay(p));
  }, G.phase === "choose" ? 1100 : 750);
}

/* ---------------- views ---------------- */
function viewFor(seat) {
  return { me: seat, names: G.names, types: G.types, score: G.score, hakem: G.hakem, trump: G.trump, phase: G.phase,
    turn: G.turn, tricks: G.tricks, trick: G.trick, last: G.last, msg: G.msg, gameWin: G.gameWin,
    hand: sortHand(G.hands[seat], G.trump), counts: G.hands.map(function (h) { return h.length; }), mode: MODE };
}
var conns = {};   // seat -> DataConnection (host)
function push() {
  if (MODE === "host") Object.keys(conns).forEach(function (s) { try { conns[s].send({ t: "v", v: viewFor(+s) }); } catch (e) {} });
  render(viewFor(MYSEAT));
}

/* ---------------- rendering ---------------- */
var V = null, lastTrickKey = "";
function rel(p, me) { return (p - me + 4) % 4; }
var POS = ["s-bottom", "s-right", "s-top", "s-left"];
function render(v) {
  V = v; var me = v.me;
  var myTeam = team(me), us = v.tricks[myTeam], them = v.tricks[1 - myTeam];
  var h = '<div class="hud"><span class="pill">امتیاز: <b>ما ' + fa(v.score[myTeam]) + "</b> · آن‌ها " + fa(v.score[1 - myTeam]) + " <small>(تا ۷)</small></span>";
  h += '<span class="pill trumpb">حکم: ' + (v.trump ? '<span class="' + (v.trump === "h" || v.trump === "d" ? "r" : "k") + '" style="color:' + (v.trump === "h" || v.trump === "d" ? "#ff6b6b" : "#fff") + '">' + suitSvg(v.trump) + "</span> <b>" + SUIT_FA[v.trump] + "</b>" : "<b>—</b>") + "</span>";
  h += '<span class="pill">دست: <b>ما ' + fa(us) + "</b> · آن‌ها " + fa(them) + "</span></div>";
  h += '<div class="table">';
  for (var p = 0; p < 4; p++) {
    var r = rel(p, me), cls = "seat " + POS[r] + (v.turn === p ? " turn" : "");
    var who = p === me ? "شما" : esc(v.names[p]) + (team(p) === myTeam ? " (یار)" : "");
    h += '<div class="' + cls + '">' + (v.hakem === p ? '<span class="crown" title="حاکم">👑</span>' : "") + '<span class="nm">' + who + "</span>";
    if (p !== me) { h += '<div class="mini">'; for (var k = 0; k < Math.min(v.counts[p], 7); k++) h += cardHTML(null); h += '</div><span class="cnt">' + fa(v.counts[p]) + " ورق</span>"; }
    h += "</div>";
  }
  var key = v.trick.map(function (t) { return t.c; }).join(",");
  h += '<div class="trick">';
  v.trick.forEach(function (t, i) {
    var isNew = lastTrickKey.split(",").indexOf(t.c) < 0;
    var win = v.phase === "trick" && v.last === t.p;
    h += cardHTML(t.c, "p" + rel(t.p, me) + (isNew ? " in" : "") + (win ? " win" : ""));
  });
  h += "</div>";
  lastTrickKey = key;
  // center messages
  if (v.phase === "choose" && v.hakem === me) {
    h += '<div class="center-msg"><h3>شما حاکمید</h3><p>با نگاه به پنج ورق‌تان، حکم را برگزینید:</p><div class="suits">' +
      SUITS.map(function (s) { return '<button type="button" data-suit="' + s + '" style="color:' + (s === "h" || s === "d" ? "#b3121b" : "#1d1d1d") + '">' + suitSvg(s) + "<span>" + SUIT_FA[s] + "</span></button>"; }).join("") + "</div></div>";
  } else if (v.phase === "choose") {
    h += '<div class="center-msg"><p>' + esc(v.names[v.hakem]) + " دارد حکم را برمی‌گزیند…</p>" + (v.msg ? "<p>" + esc(v.msg) + "</p>" : "") + "</div>";
  } else if (v.phase === "hand") {
    h += '<div class="center-msg"><h3>پایان دست</h3><p>' + esc(v.msg) + "</p><p>امتیاز: ما " + fa(v.score[myTeam]) + " · آن‌ها " + fa(v.score[1 - myTeam]) + "</p></div>";
  } else if (v.phase === "over") {
    var won = v.gameWin === myTeam;
    h += '<div class="center-msg"><h3>' + (won ? "🎉 بردید!" : "این بار باختید") + "</h3><p>" + esc(v.msg) + "</p><p>امتیاز پایانی: ما " + fa(v.score[myTeam]) + " · آن‌ها " + fa(v.score[1 - myTeam]) + "</p>" +
      (MODE !== "guest" ? '<button class="btn" id="again">بازی دوباره</button>' : "<p>منتظر میزبان برای بازی دوباره…</p>") +
      '<button class="btn ghost" id="quit">بازگشت به آغاز</button></div>';
  }
  h += "</div>";
  // hand
  var myTurn = v.phase === "play" && v.turn === me, L = myTurn ? legal(v.hand, v.trick) : [];
  h += '<div class="hand' + (myTurn ? " myturn" : "") + '">';
  v.hand.forEach(function (c) {
    var ok = L.indexOf(c) >= 0;
    h += cardHTML(c, myTurn ? (ok ? "ok" : "no") : "", 'data-c="' + c + '"' + (ok ? ' tabindex="0" role="button"' : ""));
  });
  h += "</div>";
  var hint = "";
  if (myTurn) hint = v.trick.length ? "نوبت شماست — اگر خالِ زمین را دارید باید همان را بازی کنید." : "نوبت شماست — ورقی را برای شروع این دست بازی کنید.";
  else if (v.phase === "play" && v.turn >= 0) hint = "نوبت " + esc(v.names[v.turn]) + " است…";
  else if (v.msg && v.phase !== "hand" && v.phase !== "over") hint = esc(v.msg);
  h += '<p class="hint">' + hint + "</p>";
  if (MODE !== "solo") h += '<p class="hint" style="opacity:.6">' + (MODE === "host" ? "شما میزبان این میز هستید." : "بازی آنلاین") + "</p>";
  $app.innerHTML = h;
  // events
  $app.querySelectorAll(".suits button").forEach(function (b) { b.onclick = function () { act({ a: "trump", s: b.getAttribute("data-suit") }); }; });
  $app.querySelectorAll(".hand .card.ok").forEach(function (el) {
    el.onclick = function () { act({ a: "play", c: el.getAttribute("data-c") }); };
    el.onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); el.click(); } };
  });
  var ag = document.getElementById("again"); if (ag) ag.onclick = function () { newGame(G.names, G.types); };
  var qt = document.getElementById("quit"); if (qt) qt.onclick = function () { leave(); };
}
function act(a) {
  if (MODE === "guest") { if (hostConn) hostConn.send({ t: "act", a: a }); return; }
  if (a.a === "trump") chooseTrump(MYSEAT, a.s);
  else if (a.a === "play") playCard(MYSEAT, a.c);
}

/* ---------------- online (PeerJS) ---------------- */
var peer = null, hostConn = null, lobbySeats = null;
var PFX = "anjoman-hokm-";
var JOIN_ORDER = [2, 1, 3];   // نفر اول یار میزبان می‌شود
function myName() { var n = (document.getElementById("nm") || {}).value; n = (n || store("hokm-name") || "").trim().slice(0, 20); if (n) store("hokm-name", n); return n || "هموند"; }
function leave() {
  clearTimeout(aiTimer); G = null; MODE = null;
  try { if (peer) peer.destroy(); } catch (e) {}
  peer = null; hostConn = null; conns = {}; lobbySeats = null; menu();
}
function host() {
  if (!window.Peer) return toast("بخش آنلاین بار نشد؛ اتصال اینترنت را بررسی کنید.");
  var code = String(Math.floor(1000 + Math.random() * 9000)), name = myName();
  MODE = "host"; MYSEAT = 0; lobbySeats = [{ name: name, type: "me" }, null, null, null];
  $app.innerHTML = '<div class="panel"><h2>در حال ساختن میز…</h2></div>';
  peer = new Peer(PFX + code);
  peer.on("open", function () { lobby(code); });
  peer.on("error", function (e) {
    if (e && e.type === "unavailable-id") { try { peer.destroy(); } catch (x) {} return host(); }
    toast("اتصال برقرار نشد (" + (e && e.type || "?") + ").");
  });
  peer.on("connection", function (c) {
    c.on("open", function () {
      if (G) { c.send({ t: "full", why: "بازی شروع شده است." }); setTimeout(function () { c.close(); }, 300); return; }
      var seat = JOIN_ORDER.filter(function (s) { return !lobbySeats[s]; })[0];
      if (seat === undefined) { c.send({ t: "full", why: "میز پر است." }); setTimeout(function () { c.close(); }, 300); return; }
      lobbySeats[seat] = { name: "…", type: "remote", conn: c }; conns[seat] = c; c._seat = seat;
      c.send({ t: "seat", seat: seat });
      lobby(code);
    });
    c.on("data", function (d) {
      var s = c._seat; if (s === undefined) return;
      if (d && d.t === "hi") { lobbySeats[s] && (lobbySeats[s].name = String(d.name || "هموند").slice(0, 20)); if (G) G.names[s] = lobbySeats[s].name; lobby(code); }
      if (d && d.t === "act" && G) { if (d.a.a === "trump") chooseTrump(s, d.a.s); else if (d.a.a === "play") playCard(s, d.a.c); }
    });
    c.on("close", function () {
      var s = c._seat; if (s === undefined) return;
      delete conns[s];
      if (G) { G.types[s] = "ai"; toast(G.names[s] + " از بازی بیرون رفت؛ رایانه جایش بازی می‌کند."); G.names[s] += " (رایانه)"; push(); schedule(); }
      else { lobbySeats[s] = null; lobby(code); }
    });
  });
}
function lobby(code) {
  if (G) return;
  var lab = ["شما (میزبان)", "حریف — راست", "یار شما — روبه‌رو", "حریف — چپ"], h = '<div class="panel"><h2>میز آنلاین</h2><p>این کد را به هموندان بدهید تا با «پیوستن به میز» وارد شوند:</p><div class="code">' + fa(code) + '</div><ul class="seats">';
  for (var s = 0; s < 4; s++) h += "<li><span>" + lab[s] + "</span><b>" + (lobbySeats[s] ? esc(lobbySeats[s].name) : "خالی — رایانه") + "</b></li>";
  h += '</ul><p>جای خالی را رایانه بازی می‌کند. هر وقت آماده بودید، بازی را شروع کنید.</p><button class="btn" id="go">شروع بازی</button><button class="btn ghost" id="back">لغو</button></div>';
  $app.innerHTML = h;
  document.getElementById("go").onclick = function () {
    var names = [], types = [], ai = 0;
    for (var s = 0; s < 4; s++) { var x = lobbySeats[s]; if (x) { names.push(x.name); types.push(x.type === "me" ? "me" : "remote"); } else { names.push(AI_NAMES[ai++] + " (رایانه)"); types.push("ai"); } }
    newGame(names, types);
  };
  document.getElementById("back").onclick = leave;
}
function join(code) {
  if (!window.Peer) return toast("بخش آنلاین بار نشد؛ اتصال اینترنت را بررسی کنید.");
  code = String(code || "").replace(/[۰-۹]/g, function (d) { return FA.indexOf(d); }).replace(/\D/g, "");
  if (code.length !== 4) return toast("کد چهار رقمی میز را بنویسید.");
  var name = myName(); MODE = "guest";
  $app.innerHTML = '<div class="panel"><h2>در حال پیوستن…</h2><p>کد میز: <b>' + fa(code) + "</b></p></div>";
  peer = new Peer();
  peer.on("open", function () {
    hostConn = peer.connect(PFX + code, { reliable: true });
    var opened = false;
    var to = setTimeout(function () { if (!opened) { toast("میزی با این کد پیدا نشد."); leave(); } }, 12000);
    hostConn.on("open", function () { opened = true; clearTimeout(to); hostConn.send({ t: "hi", name: name }); $app.innerHTML = '<div class="panel"><h2>به میز پیوستید</h2><p>منتظر بمانید تا میزبان بازی را شروع کند…</p><button class="btn ghost" id="back">بیرون رفتن</button></div>'; document.getElementById("back").onclick = leave; });
    hostConn.on("data", function (d) {
      if (!d) return;
      if (d.t === "seat") MYSEAT = d.seat;
      if (d.t === "full") { toast(d.why); leave(); }
      if (d.t === "v") render(d.v);
    });
    hostConn.on("close", function () { if (MODE === "guest") { toast("ارتباط با میزبان قطع شد."); leave(); } });
  });
  peer.on("error", function (e) { if (MODE === "guest") { toast(e && e.type === "peer-unavailable" ? "میزی با این کد پیدا نشد." : "اتصال برقرار نشد."); leave(); } });
}

/* ---------------- menu ---------------- */
function menu() {
  var n = store("hokm-name") || "";
  $app.innerHTML = '<div class="panel">' +
    '<div class="fan">' + ["14h", "13s", "12d", "11c", "14s"].map(function (c, i) { return cardHTML(c, "", 'style="transform:rotate(' + ((i - 2) * 10) + "deg) translateY(" + Math.abs(i - 2) * 6 + 'px)"'); }).join("") + "</div>" +
    "<h2>حکم</h2><p>بازی ورق چهارنفره و دو تیمی ایرانی. شما و یارِ روبه‌رو در برابر دو حریف؛ هر تیمی که زودتر هفت دست ببرد، آن دست را برده است و اولین تیمی که به هفت امتیاز برسد، برندهٔ بازی است.</p>" +
    '<label class="field"><span>نام شما</span><input id="nm" maxlength="20" value="' + esc(n) + '" placeholder="مثلاً: البرز" autocomplete="nickname"></label>' +
    '<button class="btn" id="solo">بازی با رایانه</button>' +
    '<div class="row"><button class="btn alt" id="mk">ساختن میز آنلاین</button><button class="btn alt" id="jn">پیوستن به میز</button></div>' +
    '<div id="jbox" hidden><label class="field"><span>کد چهار رقمی میز</span><input id="code" inputmode="numeric" maxlength="4" dir="ltr"></label><button class="btn" id="jgo">پیوستن</button></div>' +
    '<details class="rules"><summary>قانون‌های بازی</summary><ul>' +
    "<li>در آغاز، ورق یکی‌یکی پخش می‌شود و آس به هر کس برسد، حاکم می‌شود.</li>" +
    "<li>به هر بازیکن پنج ورق می‌رسد؛ حاکم با دیدن آن‌ها «حکم» (خالِ برنده) را برمی‌گزیند. سپس بقیهٔ ورق‌ها پخش می‌شود تا هر کس سیزده ورق داشته باشد.</li>" +
    "<li>حاکم دست اول را شروع می‌کند و نوبت به سوی راست می‌چرخد. اگر خالِ زمین را دارید، باید همان را بازی کنید؛ وگرنه هر ورقی، حتی حکم، آزاد است.</li>" +
    "<li>بزرگ‌ترین حکم، یا اگر حکمی نیامده باشد بزرگ‌ترین ورقِ خالِ زمین، دست را می‌برد.</li>" +
    "<li>تیمی که هفت دست ببرد یک امتیاز می‌گیرد. اگر تیم دیگر هیچ دستی نبرده باشد «کُت» است: دو امتیاز، و اگر بازنده تیم حاکم باشد سه امتیاز.</li>" +
    "<li>اگر تیم حاکم ببازد، حاکمی به نفر سمت راست می‌رسد. نخستین تیم با هفت امتیاز برنده است.</li></ul></details></div>";
  document.getElementById("solo").onclick = function () { var nm = myName(); MODE = "solo"; MYSEAT = 0; newGame([nm, AI_NAMES[0], AI_NAMES[1], AI_NAMES[2]], ["me", "ai", "ai", "ai"]); };
  document.getElementById("mk").onclick = host;
  document.getElementById("jn").onclick = function () { var b = document.getElementById("jbox"); b.hidden = !b.hidden; if (!b.hidden) document.getElementById("code").focus(); };
  document.getElementById("jgo").onclick = function () { join(document.getElementById("code").value); };
  document.getElementById("code").onkeydown = function (e) { if (e.key === "Enter") join(this.value); };
}
window.addEventListener("beforeunload", function () { try { if (peer) peer.destroy(); } catch (e) {} });
menu();
/* برای آزمایش */
window.__hokm = { get G() { return G; }, schedule: function () { schedule(); }, newGame: function (n, t) { MODE = "solo"; newGame(n, t); } };
})();
