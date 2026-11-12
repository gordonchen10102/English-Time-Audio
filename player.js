/* English Time shared player.
   Each level folder has a small index.html that sets window.LEVEL and loads this file.
   The page lists the MP3s in its own folder and builds itself from their names, e.g.
   "04 Unit 1 In The Neighborhood Practice Time D Listen And Sing along(Song Title).mp3" */
(function () {
  // Colours match each Student Book cover.
  const PALETTE = {
    0: { btn: "#34495e", headDark: "#a9b8c8", soft: "#e6eaef", softDark: "#2a2f36", song: "#c2571a" }, // start page
    1: { btn: "#2563a8", headDark: "#7fb3ec", soft: "#e3eefa", softDark: "#1f2c3b", song: "#c2571a" }, // blue
    2: { btn: "#c22a45", headDark: "#f28d9b", soft: "#fbe4e8", softDark: "#3c2228", song: "#2563a8" }, // red
    3: { btn: "#2e8540", headDark: "#7fd08b", soft: "#e2f3e4", softDark: "#1f3323", song: "#c2571a" }, // green
    4: { btn: "#5b3fa8", headDark: "#a996ea", soft: "#ebe6f8", softDark: "#29243f", song: "#c2571a" }, // purple
    5: { btn: "#c84f14", headDark: "#f5a06a", soft: "#fdeadf", softDark: "#3d2a1f", song: "#2563a8" }, // orange
    6: { btn: "#0f7c80", headDark: "#6fd0d3", soft: "#dff3f3", softDark: "#1d3536", song: "#c2571a" }  // teal
  };
  const L = Object.assign({}, window.LEVEL, PALETTE[window.LEVEL.n || 0] || {});
  const LOGO = new URL("logo.png", document.currentScript.src).href;
  const BOOKS = [[1, 12], [2, 12], [3, 12], [4, 12], [5, 10], [6, 10]];
  // Passcode check (stored as a hash, remembered on each device once entered).
  const PASS_HASH = "c570baa958a5ca0b0aa22d4e58a240f7876ce19b2afe538bed626f07db577849";
  const css = `
  :root { --bg:#f7f5ef; --card:#fff; --text:#222; --muted:#666; --btn:${L.btn}; --head:${L.btn}; --soft:${L.soft}; --song:${L.song}; }
  @media (prefers-color-scheme: dark) {
    :root { --bg:#1b1d1c; --card:#262927; --text:#eee; --muted:#aaa; --head:${L.headDark}; --soft:${L.softDark}; }
  }
  * { box-sizing:border-box; }
  body { margin:0; font-family:system-ui,-apple-system,"Segoe UI",sans-serif; background:var(--bg); color:var(--text); padding-bottom:150px; }
  header { background:var(--btn); color:#fff; padding:18px 16px 20px; text-align:center; }
  .back { display:inline-block; margin-bottom:8px; color:#fff; text-decoration:none; font-size:.9rem; background:rgba(255,255,255,.18); padding:6px 12px; border-radius:999px; }
  .lead { text-align:center; color:var(--muted); margin:6px 0 16px; font-size:1.05rem; }
  .books { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .book { display:block; text-decoration:none; color:#fff; border-radius:18px; padding:18px 12px 16px; text-align:center; box-shadow:0 3px 10px rgba(0,0,0,.15); }
  .book .badge { width:60px; height:60px; font-size:2.1rem; }
  .book b { display:block; font-size:1.15rem; margin-top:10px; }
  .book small { display:block; opacity:.92; margin-top:2px; }
  .gate { max-width:360px; margin:28px auto; background:var(--card); border-radius:18px; padding:24px 20px; text-align:center; box-shadow:0 2px 10px rgba(0,0,0,.1); }
  .gate h2 { margin:0 0 6px; font-size:1.3rem; }
  .gate p { color:var(--muted); margin:0 0 16px; }
  .gate input { width:100%; font-size:1.7rem; letter-spacing:.4em; text-align:center; padding:12px; border-radius:12px; border:2px solid var(--btn); background:var(--bg); color:var(--text); }
  .gate button { margin-top:12px; width:100%; padding:14px; font-size:1.1rem; font-weight:700; border:0; border-radius:12px; background:var(--btn); color:#fff; cursor:pointer; }
  .gate .err { color:#e0414f; min-height:1.4em; margin-top:10px; font-weight:600; }
  h1 { margin:0 0 6px; font-size:1.9rem; color:#fff; display:flex; align-items:center; justify-content:center; gap:10px; }
  .badge { display:inline-flex; align-items:center; justify-content:center; width:48px; height:48px; border-radius:50%;
           background:#fff; color:var(--btn); font-size:1.7rem; font-weight:800; box-shadow:0 2px 6px rgba(0,0,0,.2); }
  header p { margin:0; color:rgba(255,255,255,.92); font-size:1rem; }
  main { max-width:720px; margin:0 auto; padding:16px; }
  .quick { background:var(--card); border-radius:16px; padding:16px; box-shadow:0 2px 8px rgba(0,0,0,.08); border-top:6px solid var(--btn); }
  .quick h2 { margin:0 0 4px; font-size:1.2rem; }
  .quick p { margin:0 0 12px; color:var(--muted); font-size:.95rem; }
  .qgrid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .qbtn { border:0; border-radius:14px; padding:16px 10px; font-size:1.1rem; font-weight:700; cursor:pointer; background:var(--btn); color:#fff; line-height:1.3; }
  .qbtn small { display:block; font-weight:400; font-size:.8rem; opacity:.95; }
  .qbtn.songs { grid-column:1 / -1; background:var(--song); font-size:1.25rem; }
  .qbtn.all { grid-column:1 / -1; background:var(--soft); color:var(--text); }
  h3 { font-size:1.1rem; margin:28px 0 10px; color:var(--head); }
  .units { display:flex; flex-wrap:wrap; gap:8px; }
  .units button { border:0; border-radius:999px; padding:8px 14px; font-size:.95rem; cursor:pointer; background:var(--soft); color:var(--text); }
  .units button.on { background:var(--btn); color:#fff; }
  .uhead { font-size:1.05rem; margin:20px 0 8px; color:var(--head); font-weight:600; }
  .track { display:flex; align-items:center; justify-content:space-between; gap:10px; background:var(--card); border-radius:12px;
           padding:10px 14px; margin-bottom:8px; box-shadow:0 1px 3px rgba(0,0,0,.08); border:2px solid transparent; }
  .track.song { background:color-mix(in srgb, var(--song) 14%, var(--card)); }
  .track.now { border-color:var(--btn); }
  .track button { border:0; border-radius:10px; padding:8px 14px; background:var(--btn); color:#fff; font-size:.95rem; cursor:pointer; white-space:nowrap; }
  .bar { position:fixed; left:0; right:0; bottom:0; background:var(--card); box-shadow:0 -2px 10px rgba(0,0,0,.15); padding:10px 16px 14px; display:none; }
  .bar.show { display:block; }
  .bar .inner { max-width:720px; margin:0 auto; }
  .bar .label { font-size:.85rem; color:var(--muted); }
  .bar .title { font-weight:600; margin:2px 0 6px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .bar .ctrls { display:flex; align-items:center; gap:8px; }
  .bar .ctrls button { border:0; border-radius:10px; width:44px; height:40px; font-size:1.1rem; background:var(--soft); color:var(--text); cursor:pointer; }
  .bar audio { flex:1; min-width:0; height:40px; }
  .msg { text-align:center; color:var(--muted); padding:40px 16px; font-size:1.05rem; }
  footer { text-align:center; color:var(--muted); font-size:.85rem; padding:24px 16px; }
  .wm { position:fixed; inset:0; pointer-events:none; z-index:50; opacity:.07;
        background:url("${LOGO}") center 55% / min(70vw, 380px) auto no-repeat; }
  @media (prefers-color-scheme: dark) { .wm { opacity:.09; } }
  .bar { z-index:60; }`;
  document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`);
  document.title = L.start ? "English Time Audio" : `English Time ${L.n} Audio`;
  document.head.insertAdjacentHTML("beforeend", `<meta name="robots" content="noindex, nofollow">`);
  document.head.insertAdjacentHTML("beforeend", `<meta name="theme-color" content="${L.btn}">`);
  document.body.innerHTML = `
  <header>${L.start
      ? `<h1>English Time 🎧</h1><p>Audio for listening at home</p>`
      : `<a class="back" href="${L.home || "../"}">← All levels</a><h1>English Time <span class="badge">${L.n}</span></h1><p>Level ${L.n} · Listen and practise at home 🎧</p>`}</header>
  <main id="main"><div class="msg">Loading…</div></main>
  <footer>For students and parents of our class</footer>
  <div class="wm" aria-hidden="true"></div>
  <div class="bar" id="bar"><div class="inner">
    <div class="label" id="label"></div><div class="title" id="nowTitle"></div>
    <div class="ctrls"><button id="prev" aria-label="Previous">⏮</button><audio id="player" controls></audio><button id="next" aria-label="Next">⏭</button></div>
  </div></div>`;

  // ---------- where am I ----------
  const owner = location.hostname.split(".")[0];
  const parts = location.pathname.split("/").filter(Boolean);
  const repo = parts[0];
  // L.audio lets a page read its audio from another folder ("" = the main folder).
  const folder = L.audio !== undefined ? L.audio : (parts[1] && !parts[1].endsWith(".html") ? parts[1] : "");
  const prefix = L.audio !== undefined ? "../" + (L.audio ? L.audio + "/" : "") : "";

  // ---------- file list ----------
  async function listFiles() {
    const key = `et-files-${repo}-${folder}`;
    try {
      const c = JSON.parse(localStorage.getItem(key) || "null");
      if (c && Date.now() - c.t < 3600e3 && c.files.length) return c.files;
    } catch (e) {}
    let files = null;
    try {
      const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${folder}?ref=main`);
      if (r.ok) files = (await r.json()).filter(f => f.type === "file").map(f => f.name);
    } catch (e) {}
    if (!files) {
      try {
        const r = await fetch(`https://data.jsdelivr.com/v1/packages/gh/${owner}/${repo}@main?structure=flat`);
        if (r.ok) files = (await r.json()).files.map(f => f.name)
          .filter(n => n.startsWith(`/${folder}/`) && n.split("/").length === 3).map(n => n.split("/")[2]);
      } catch (e) {}
    }
    if (!files) {
      try { const c = JSON.parse(localStorage.getItem(key) || "null"); if (c) return c.files; } catch (e) {}
      return null;
    }
    files = files.filter(n => /\.mp3$/i.test(n));
    if (files.length) { try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), files })); } catch (e) {} }
    return files;
  }

  // ---------- turn file names into tracks ----------
  const FIXES = [[/Neighborfood/g, "Neighborhood"], [/Counting Chart/g, "Counting Chant"], [/Ride O Bike/g, "Ride a Bike"],
                 [/Campasite/g, "Campsite"], [/What Aer You/g, "What Are You"],
                 [/\bJome\b/g, "Home"], [/\bPaoer\b/g, "Paper"], [/Oh,No!/g, "Oh, No!"]];
  const tidy = s => FIXES.reduce((a, [re, r]) => a.replace(re, r),
    s.replace(/_(?=(s|re|t|ll|m|ve|d)\b)/gi, "'").replace(/_$/, "?").replace(/_/g, "/").trim());
  const icons = [[/conversation/i, "💬"], [/word/i, "🔤"], [/practice/i, "✏️"], [/phonics/i, "🔊"], [/story|reading/i, "📖"], [/review/i, "🔁"]];
  // Short style used by some levels: "01 At The Campsite.mp3", "02 Word.mp3", "03 Practice.mp3",
  // "04 Song Title.mp3", "05 Phonics.mp3" — every 5 files are one unit.
  function parseShort(file) {
    const m = file.match(/^(\d+)\s+(.*?)(?:\s+\d)?\.mp3$/i);
    if (!m) return null;
    const num = +m[1], u = Math.ceil(num / 5), k = (num - 1) % 5, name = tidy(m[2]);
    const base = { num, u, unitName: "", letter: "", file };
    if (/^word$/i.test(name)) return { ...base, section: "Word Time", song: false, icon: "🔤", title: "Word Time" };
    if (/^practice$/i.test(name)) return { ...base, section: "Practice Time", song: false, icon: "✏️", title: "Practice Time" };
    if (/^phonics$/i.test(name)) return { ...base, section: "Phonics Time", song: false, icon: "🔊", title: "Phonics Time" };
    if (k === 0) return { ...base, unitName: name, section: "Conversation Time", song: false, icon: "💬", title: "Conversation Time" };
    return { ...base, section: "Song", song: true, icon: "🎵", title: `Song: ${name}` };
  }
  function parse(file) {
    const m = file.match(/^(\d+)\s+Unit\s+(\d+)\s+(.*)\.mp3$/i);
    if (!m) return parseShort(file);
    const num = +m[1], u = +m[2];
    let rest = m[3], paren = "";
    const pm = rest.match(/\(([^)]*)\)\s*$/) || rest.match(/\((.*)\)\s*$/);
    if (pm) { paren = tidy(pm[1]); rest = rest.slice(0, pm.index).trim(); }
    const sm = rest.match(/\b([A-Z][A-Za-z]*) Time\b(?:\s+([A-Z])\b)?/);
    const unitName = sm ? tidy(rest.slice(0, sm.index)) : "";
    const section = sm ? `${sm[1]} Time` : tidy(rest);
    const letter = sm && sm[2] ? sm[2] : "";
    const song = /\bsing\b|\bsong\b|\bchant\b/i.test(rest + " " + paren);
    let icon = song ? "🎵" : "🎧";
    if (!song) for (const [re, ic] of icons) if (re.test(section)) { icon = ic; break; }
    const generic = /^(chant|sing-along|song)$/i.test(paren);
    const title = song ? (generic ? paren : `Song: ${paren || section}`) : paren ? `${section}: ${paren}` : section;
    return { num, u, unitName, section, letter, song, icon, title, file };
  }

  // ---------- player ----------
  const player = document.getElementById("player"), bar = document.getElementById("bar");
  let queue = [], pos = 0, queueName = "";
  function play(list, start, label) { queue = list; pos = start || 0; queueName = label; load(); }
  function load() {
    const t = queue[pos];
    player.src = prefix + encodeURIComponent(t.file);
    player.play().catch(() => {});
    bar.classList.add("show");
    document.getElementById("label").textContent = queue.length > 1 ? `${queueName} — ${pos + 1} of ${queue.length}` : queueName;
    document.getElementById("nowTitle").textContent = `${t.icon} Unit ${t.u} · ${t.title}`;
    document.querySelectorAll(".track").forEach(el => el.classList.toggle("now", el.dataset.file === t.file));
  }
  player.addEventListener("ended", () => { if (pos < queue.length - 1) { pos++; load(); } });
  document.getElementById("next").onclick = () => { if (pos < queue.length - 1) { pos++; load(); } };
  document.getElementById("prev").onclick = () => { if (player.currentTime > 3 || pos === 0) player.currentTime = 0; else { pos--; load(); } };

  function groups(n) {
    return n === 10 ? [[1, 3], [4, 6], [7, 8], [9, 10]] : [[1, 3], [4, 6], [7, 9], [10, 12]];
  }

  // ---------- start page ----------
  function renderStart() {
    const main = document.getElementById("main");
    main.innerHTML = `<p class="lead">Tap the book your child uses.</p><div class="books">${BOOKS.map(([n, u]) =>
      `<a class="book" href="level-${n}/" style="background:${PALETTE[n].btn}">
         <span class="badge" style="color:${PALETTE[n].btn}">${n}</span>
         <b>English Time ${n}</b><small>Units 1–${u}</small></a>`).join("")}</div>`;
  }

  // ---------- passcode ----------
  async function sha(text) {
    const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join("");
  }
  function unlocked() { try { return localStorage.getItem("et-pass") === PASS_HASH; } catch (e) { return false; } }
  function gate(next) {
    const main = document.getElementById("main");
    main.innerHTML = `<form class="gate" id="gate"><h2>🔒 Class passcode</h2><p>Please enter the passcode from your teacher.</p>
      <input id="code" type="password" inputmode="numeric" autocomplete="off" aria-label="Passcode" required>
      <button type="submit">Enter</button><div class="err" id="err"></div></form>`;
    const code = document.getElementById("code");
    code.focus();
    document.getElementById("gate").onsubmit = async e => {
      e.preventDefault();
      if (await sha("english-time:" + code.value.trim()) === PASS_HASH) {
        try { localStorage.setItem("et-pass", PASS_HASH); } catch (err) {}
        next();
      } else {
        document.getElementById("err").textContent = "That passcode isn't right. Please try again.";
        code.value = ""; code.focus();
      }
    };
  }

  // ---------- level page ----------
  function renderLevel() {
  listFiles().then(files => {
    const main = document.getElementById("main");
    if (files === null) { main.innerHTML = `<div class="msg">Couldn't load the list of tracks. Please refresh the page in a minute.</div>`; return; }
    const T = files.map(parse).filter(Boolean).sort((a, b) => a.num - b.num || a.file.localeCompare(b.file));
    if (!T.length) { main.innerHTML = `<div class="msg">Audio for English Time ${L.n} is coming soon. 🎧</div>`; return; }
    // add the letter (A, B…) when one unit has two tracks with the same name
    const dup = T.map(t => !t.song && t.letter && T.some(o => o !== t && o.u === t.u && o.title === t.title));
    T.forEach((t, i) => { if (dup[i]) t.title += ` ${t.letter}`; });
    const units = [...new Set(T.map(t => t.u))].sort((a, b) => a - b);
    const unitName = u => (T.find(t => t.u === u && t.unitName) || {}).unitName || "";

    const q = [];
    const songs = T.filter(t => t.song);
    if (songs.length) q.push([`<button class="qbtn songs">🎵 All Songs<small>${songs.length} songs</small></button>`, songs, "All Songs"]);
    for (const [a, b] of groups(L.units)) {
      const g = T.filter(t => t.u >= a && t.u <= b);
      if (g.length) q.push([`<button class="qbtn">Units ${a}–${b}<small>${g.length} tracks</small></button>`, g, `Units ${a}–${b}`]);
    }
    q.push([`<button class="qbtn all">Play Everything<small>all ${T.length} tracks</small></button>`, T, "Everything"]);

    main.innerHTML = `
      <section class="quick"><h2>▶ Quick Play</h2><p>Tap one button. Everything plays one after another.</p>
        <div class="qgrid">${q.map(x => x[0]).join("")}</div></section>
      <h3>Or choose one track</h3><div class="units" id="units"></div><div id="list"></div>`;
    main.querySelectorAll(".qbtn").forEach((b, i) => b.onclick = () => play(q[i][1], 0, q[i][2]));

    const unitsEl = document.getElementById("units"), list = document.getElementById("list");
    function show(u) {
      [...unitsEl.children].forEach(b => b.classList.toggle("on", +b.dataset.u === u));
      const ut = T.filter(t => t.u === u);
      list.innerHTML = "";
      const h = document.createElement("div"); h.className = "uhead";
      h.textContent = `Unit ${u}${unitName(u) ? " · " + unitName(u) : ""}`; list.appendChild(h);
      ut.forEach((t, i) => {
        const d = document.createElement("div");
        d.className = "track" + (t.song ? " song" : ""); d.dataset.file = t.file;
        d.innerHTML = `<span></span><button>▶ Play</button>`;
        d.querySelector("span").textContent = `${t.icon} ${t.title}`;
        d.querySelector("button").onclick = () => play(ut, i, `Unit ${u}`);
        list.appendChild(d);
      });
      const cur = queue[pos]; if (cur) document.querySelectorAll(".track").forEach(el => el.classList.toggle("now", el.dataset.file === cur.file));
    }
    units.forEach(u => { const b = document.createElement("button"); b.textContent = `Unit ${u}`; b.dataset.u = u; b.onclick = () => show(u); unitsEl.appendChild(b); });
    show(units[0]);
  });
  }

  const go = L.start ? renderStart : renderLevel;
  if (unlocked()) go(); else gate(go);
})();
