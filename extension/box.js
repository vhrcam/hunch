(() => {
  if (window.hunch) return window.hunch.toggle();

  const site = "https://hunch-b3dy.onrender.com";
  const steps = ["Pulling domain records", "Reading the seller's site", "Checking for pressure tactics", "Comparing the price", "Weighing the clues"];
  const stamp = { safe: "Looks legit", caution: "Be careful", danger: "Don't pay" };
  const ring = { safe: "HUNCH VERIFIED", caution: "HUNCH CAUTION", danger: "HUNCH FLAGGED" };

  const detective = `
    <svg class="detective" viewBox="0 0 200 200" width="64" height="64" role="img" aria-label="Hunch, the detective">
      <defs>
        <radialGradient id="dhead" cx="36%" cy="30%" r="78%"><stop offset="0" stop-color="#ffffff"/><stop offset="0.45" stop-color="#eeeef0"/><stop offset="0.82" stop-color="#c4c5cb"/><stop offset="1" stop-color="#9fa1a8"/></radialGradient>
        <linearGradient id="dfelt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5a5c64"/><stop offset="1" stop-color="#1d1e22"/></linearGradient>
        <linearGradient id="dbrim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a4c53"/><stop offset="1" stop-color="#1a1b1e"/></linearGradient>
        <linearGradient id="dpipe" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5a5c64"/><stop offset="1" stop-color="#1d1e22"/></linearGradient>
        <linearGradient id="dsuit" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2b30"/><stop offset="1" stop-color="#101113"/></linearGradient>
        <radialGradient id="dshade" cx="35%" cy="28%" r="85%"><stop offset="0" stop-color="#4a4c54"/><stop offset="0.6" stop-color="#17181b"/><stop offset="1" stop-color="#070708"/></radialGradient>
        <radialGradient id="dglass" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#ffffff" stop-opacity="0.55"/><stop offset="1" stop-color="#d9dbe0" stop-opacity="0.15"/></radialGradient>
        <clipPath id="dclip"><circle cx="100" cy="100" r="56"/></clipPath>
      </defs>
      <path d="M34 200c2-30 28-48 66-48s64 18 66 48Z" fill="url(#dsuit)"/>
      <path d="M84 152l16 30 16-30Z" fill="#ececed"/>
      <path d="M95 157h10l3 21-8 11-8-11Z" fill="#0b0c0e"/>
      <path d="M95 157h10l-1.5 6h-7Z" fill="#2c2d32"/>
      <path d="M82 151l-14 9 30 38ZM118 151l14 9-30 38Z" fill="#1c1d21"/>
      <path d="M70 161l26 34M130 161l-26 34" stroke="#fff" stroke-width="1.2" opacity="0.12"/>
      <circle cx="100" cy="100" r="56" fill="url(#dhead)"/>
      <g clip-path="url(#dclip)">
        <g data-look="6 4">
          <path d="M72 79l13 2M128 79l-13 2" fill="none" stroke="#16171a" stroke-width="4.5" stroke-linecap="round"/>
          <path d="M66.5 96 51 93M133.5 96l15.5-3" stroke="#0b0c0e" stroke-width="3" stroke-linecap="round"/>
          <ellipse cx="82" cy="98" rx="16" ry="15" fill="url(#dshade)" stroke="#0b0c0e" stroke-width="3.5"/>
          <ellipse cx="118" cy="98" rx="16" ry="15" fill="url(#dshade)" stroke="#0b0c0e" stroke-width="3.5"/>
          <path d="M98 96q2-2.5 4 0" fill="none" stroke="#0b0c0e" stroke-width="3" stroke-linecap="round"/>
          <g data-look="-2 -1.5" stroke="#fff" stroke-linecap="round" fill="none">
            <path d="M72 95a10 10 0 0 1 7-8M108 95a10 10 0 0 1 7-8" stroke-width="2.5" opacity="0.75"/>
            <path d="M75 103l10-10M111 103l10-10" stroke-width="2" opacity="0.16"/>
          </g>
          <path d="M88 131.5h11" fill="none" stroke="#16171a" stroke-width="3" stroke-linecap="round"/>
          <path d="M86.5 128q-2.5 3.5 0 7" fill="none" stroke="#16171a" stroke-width="2.5" stroke-linecap="round"/>
        </g>
      </g>
      <g data-look="6 4">
        <path d="M101 130.5 131 132.5v6.5l-30-5.5Z" fill="url(#dpipe)"/>
        <circle cx="101" cy="132" r="2.6" fill="#0b0c0e"/>
        <path d="M129 123h17v11a8.5 8.5 0 0 1-17 0Z" fill="url(#dfelt)"/>
        <ellipse cx="137.5" cy="123" rx="8.5" ry="2.6" fill="#6b6e75"/>
        <ellipse cx="137.5" cy="123" rx="5.8" ry="1.5" fill="#0b0c0e"/>
        <path d="M132.5 126.5v8" stroke="#fff" stroke-width="1.5" stroke-linecap="round" opacity="0.18"/>
        <path class="smoke" d="M139 117c-2-6 6-9 4-15s6-9 4-15" fill="none" stroke="#8e9097" stroke-width="2.5" stroke-linecap="round" opacity="0.75"/>
      </g>
      <g data-look="2.5 1.5">
        <ellipse cx="100" cy="60" rx="72" ry="13" fill="url(#dbrim)"/>
        <path d="M34 56c26-6 106-6 132 0" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.14"/>
        <path d="M64 58C62 38 70 20 84 15c7-2 12 4 16 4s9-6 16-4c14 5 22 23 20 43Z" fill="url(#dfelt)"/>
        <path d="M100 21c-1.5 9-1.5 18 0 26" fill="none" stroke="#0f1012" stroke-width="2.5" stroke-linecap="round" opacity="0.55"/>
        <path d="M75 26c-5 10-6 19-6 28" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity="0.14"/>
        <path d="M65 47c23 6 47 6 70 0l1 10c-24 6-48 6-72 0Z" fill="#0d0e10"/>
        <path d="M28 60c12 10 42 14 72 14s60-4 72-14c-22 6-47 7-72 7s-50-1-72-7Z" fill="#3e4047"/>
      </g>
      <g class="search">
        <path d="M36 168 22 183" stroke="#b9bbc1" stroke-width="7" stroke-linecap="round"/>
        <circle cx="48" cy="155" r="16" fill="url(#dglass)" stroke="#d4d5da" stroke-width="4"/>
        <path d="M40 149a10 10 0 0 1 5-5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
      </g>
    </svg>`;

  const seal = `
    <svg class="seal" viewBox="0 0 100 100" width="76" height="76" role="img">
      <defs>
        <path id="sring" d="M50 13a37 37 0 1 1 0 74a37 37 0 1 1 0-74"/>
        <filter id="sink" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="3" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.7" result="rough"/>
          <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="3" seed="8" result="blot"/>
          <feColorMatrix in="blot" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.5 1.75" result="wear"/>
          <feComposite in="rough" in2="wear" operator="in"/>
        </filter>
      </defs>
      <g filter="url(#sink)" fill="currentColor">
        <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" stroke-width="2.6"/>
        <circle cx="50" cy="50" r="29" opacity="0.1"/>
        <circle cx="50" cy="50" r="29" fill="none" stroke="currentColor" stroke-width="2"/>
        <g transform="translate(29 28) scale(0.656)" opacity="0.35">
          <path d="M18 28c0-12 5-19 10-20q4 3 8 0c5 1 10 8 10 20Z"/>
          <path d="M5 30q27-9 54 0q-27 7-54 0Z"/>
          <g fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round">
            <circle cx="23.5" cy="42" r="7"/><circle cx="40.5" cy="42" r="7"/>
            <path d="M30.5 41q1.5-2 3 0"/><path d="M37 53q6 3.5 12 1.5"/>
          </g>
          <path d="M47.5 47h9v5.5a4.5 4.5 0 0 1-9 0Z"/>
        </g>
        <text class="mono" font-weight="700" font-size="8" dy="2.8"><textPath class="ring-text" href="#sring" textLength="229" lengthAdjust="spacing"></textPath></text>
      </g>
    </svg>`;

  const css = `
    * { box-sizing: border-box; margin: 0; }
    .box {
      width: 320px;
      padding: 14px;
      border-radius: 18px;
      background: rgba(8, 9, 10, 0.72);
      backdrop-filter: blur(16px) saturate(140%);
      -webkit-backdrop-filter: blur(16px) saturate(140%);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 18px 50px rgba(0, 0, 0, 0.45);
      color: #ececed;
      font: 13px/1.45 Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
      letter-spacing: -0.006em;
      cursor: grab;
      user-select: none;
      animation: open 0.22s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .box.dragging { cursor: grabbing; }
    .mono, .label, .step, .stamp { font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace; }
    .top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
    .label { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.08em; color: #6b6e75; }
    .close { all: unset; cursor: pointer; width: 22px; height: 22px; display: grid; place-items: center; border-radius: 6px; color: #9b9da3; font-size: 17px; line-height: 1; }
    .close:hover { background: rgba(255, 255, 255, 0.08); color: #f5f5f6; }
    .hero { display: flex; align-items: center; gap: 10px; }
    .detective { flex-shrink: 0; }
    .detective [data-look] { transition: transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1); }
    .search { display: none; animation: search 2.4s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
    .searching .search { display: inline; }
    .smoke { animation: smoke 3.2s ease-in-out infinite; transform-box: fill-box; transform-origin: bottom; }
    form { position: relative; flex: 1; min-width: 0; }
    form::before {
      content: "";
      position: absolute;
      left: -5px;
      top: 50%;
      width: 9px;
      height: 9px;
      background: #141517;
      border-left: 1px solid #2d2f33;
      border-bottom: 1px solid #2d2f33;
      transform: translateY(-50%) rotate(45deg);
    }
    input {
      all: unset;
      box-sizing: border-box;
      width: 100%;
      padding: 10px 12px;
      border-radius: 12px;
      background: #141517;
      border: 1px solid #2d2f33;
      color: #ececed;
      font: inherit;
      cursor: text;
      user-select: text;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: border-color 0.15s;
    }
    input::placeholder { color: #6b6e75; }
    input:focus { border-color: #9b9da3; }
    .hint { margin-top: 6px; padding-left: 74px; color: #6b6e75; font-size: 11.5px; }
    .step { margin-top: 12px; color: #9b9da3; font-size: 11.5px; }
    .step::after { content: ""; display: inline-block; width: 0.55em; height: 1em; margin-left: 3px; vertical-align: -2px; background: currentColor; animation: blink 0.7s steps(1) infinite; }
    .error { margin-top: 12px; color: #e5484d; }
    .result { margin-top: 14px; padding-top: 14px; border-top: 1px solid rgba(255, 255, 255, 0.08); }
    .row { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
    .score { margin-top: 4px; font-size: 44px; font-weight: 700; letter-spacing: -0.045em; line-height: 1; }
    .score span { font-size: 15px; font-weight: 500; letter-spacing: 0; color: #6b6e75; }
    .mark { display: flex; flex-direction: column; align-items: center; gap: 4px; }
    .seal { animation: slam 0.5s cubic-bezier(0.2, 0.9, 0.25, 1) 0.3s both; }
    .stamp { height: 16px; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.18em; white-space: nowrap; }
    .bar { height: 5px; margin-top: 12px; border-radius: 99px; background: #141517; overflow: hidden; }
    .bar i { display: block; height: 100%; border-radius: 99px; background: currentColor; }
    .verdict { margin-top: 12px; color: #f5f5f6; font-size: 13.5px; line-height: 1.5; }
    .clues { margin-top: 12px; }
    .clue { display: flex; gap: 10px; padding: 8px 0; border-top: 1px solid rgba(255, 255, 255, 0.06); }
    .clue b { width: 28px; flex-shrink: 0; font: 600 12px "JetBrains Mono", ui-monospace, Menlo, monospace; color: #6b6e75; }
    .clue b.up { color: #4cb782; }
    .clue b.down { color: #e5484d; }
    .clue p { color: #9b9da3; font-size: 12px; }
    .clue strong { display: block; color: #f5f5f6; font-weight: 500; font-size: 12.5px; }
    .full { display: inline-flex; align-items: center; gap: 4px; margin-top: 10px; color: #ececed; font-weight: 500; text-decoration: none; cursor: pointer; }
    .full:hover { color: #fff; text-decoration: underline; text-underline-offset: 3px; }
    .safe { color: #4cb782; }
    .caution { color: #d9a441; }
    .danger { color: #e5484d; }
    [hidden] { display: none !important; }
    @keyframes open { from { opacity: 0; transform: translateY(6px) scale(0.98); } }
    @keyframes slam { 0% { opacity: 0; transform: scale(2.3) rotate(-16deg); } 60% { opacity: 1; transform: scale(0.93) rotate(-5deg); } 100% { opacity: 1; transform: scale(1) rotate(-6deg); } }
    @keyframes blink { 50% { opacity: 0; } }
    @keyframes smoke { 0% { opacity: 0; transform: translateY(4px) scaleY(0.8); } 35% { opacity: 0.7; } 100% { opacity: 0; transform: translateY(-6px) scaleY(1.1); } }
    @keyframes search { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(5px, -4px) rotate(-8deg); } }
    @media (prefers-reduced-motion: reduce) {
      .box, .smoke, .search, .step::after { animation: none; }
      .seal { animation: none; transform: rotate(-6deg); }
    }
  `;

  const host = document.createElement("div");
  host.style.cssText = "all: initial; position: fixed; top: 0; left: 0; z-index: 2147483647;";
  const root = host.attachShadow({ mode: "closed" });
  root.innerHTML = `
    <style>${css}</style>
    <div class="box">
      <div class="top">
        <span class="label">Hunch</span>
        <button class="close" aria-label="Close">×</button>
      </div>
      <div class="hero">
        ${detective}
        <form><input placeholder="Paste a seller's link..." spellcheck="false"></form>
      </div>
      <p class="hint">Press Enter to investigate</p>
      <p class="step" hidden></p>
      <p class="error" hidden></p>
      <div class="result" hidden>
        <div class="row">
          <div>
            <p class="label">Trust score</p>
            <p class="score"><b></b><span>/100</span></p>
          </div>
          <div class="mark"><span class="seal-slot"></span><p class="stamp"></p></div>
        </div>
        <div class="bar"><i></i></div>
        <p class="verdict"></p>
        <div class="clues"></div>
        <a class="full" target="_blank" rel="noopener">Full report <span aria-hidden="true">›</span></a>
      </div>
    </div>`;
  document.documentElement.append(host);

  const $ = (s) => root.querySelector(s);
  const box = $(".box");
  const svg = $(".detective");
  const input = $("input");
  const hint = $(".hint");
  const step = $(".step");
  const error = $(".error");
  const result = $(".result");
  let pos = { x: innerWidth - 344, y: 24 };
  let timers = [];

  const place = () => {
    pos.x = Math.max(8, Math.min(pos.x, innerWidth - box.offsetWidth - 8));
    pos.y = Math.max(8, Math.min(pos.y, innerHeight - box.offsetHeight - 8));
    host.style.left = `${pos.x}px`;
    host.style.top = `${pos.y}px`;
  };

  const wander = () => {
    const x = Math.random() * 2 - 1;
    const y = Math.random() * 1.4 - 0.6;
    svg.querySelectorAll("[data-look]").forEach((g) => {
      const [fx, fy] = g.dataset.look.split(" ").map(Number);
      g.style.transform = `translate(${x * fx}px, ${y * fy}px)`;
    });
    setTimeout(wander, 1600 + Math.random() * 2000);
  };
  setTimeout(wander, 1000);

  const reset = () => {
    timers.forEach(clearTimeout);
    timers = [];
    svg.classList.remove("searching");
    input.value = location.href;
    hint.hidden = false;
    step.hidden = true;
    error.hidden = true;
    result.hidden = true;
    requestAnimationFrame(place);
  };

  const show = (data, text) => {
    svg.classList.remove("searching");
    step.hidden = true;
    result.className = `result ${data.level}`;
    result.hidden = false;
    $(".score b").textContent = data.score;
    $(".bar i").style.width = `${data.score}%`;
    $(".verdict").textContent = data.verdict;
    $(".seal-slot").innerHTML = seal;
    $(".ring-text").textContent = `${ring[data.level]} • ${ring[data.level]} •`;
    $(".seal").setAttribute("aria-label", `${ring[data.level]}: ${stamp[data.level]}`);

    const label = stamp[data.level];
    const typed = $(".stamp");
    typed.textContent = "";
    label.split("").forEach((_, i) => timers.push(setTimeout(() => (typed.textContent = label.slice(0, i + 1)), 450 + i * 55)));

    const clues = $(".clues");
    clues.replaceChildren();
    [...data.clues].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact)).slice(0, 3).forEach((c) => {
      const row = document.createElement("div");
      row.className = "clue";
      const n = document.createElement("b");
      n.className = c.impact > 0 ? "up" : c.impact < 0 ? "down" : "";
      n.textContent = c.impact > 0 ? `+${c.impact}` : c.impact || "0";
      const p = document.createElement("p");
      const t = document.createElement("strong");
      t.textContent = c.label;
      p.append(t, c.detail);
      row.append(n, p);
      clues.append(row);
    });

    $(".full").href = `${site}/vet?input=${encodeURIComponent(text)}`;
    requestAnimationFrame(place);
  };

  const investigate = (text) => {
    reset();
    input.value = text;
    hint.hidden = true;
    svg.classList.add("searching");
    step.hidden = false;
    steps.forEach((s, i) => timers.push(setTimeout(() => (step.textContent = s), i * 1800)));
    requestAnimationFrame(place);
    fetch(`${site}/api/vet`, { method: "POST", body: JSON.stringify({ input: text }) })
      .then((res) => res.json())
      .then((data) => {
        timers.forEach(clearTimeout);
        show(data, text);
      })
      .catch(() => {
        timers.forEach(clearTimeout);
        svg.classList.remove("searching");
        step.hidden = true;
        error.textContent = "Hunch couldn't reach the case files. Try again.";
        error.hidden = false;
      });
  };

  $("form").addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value.trim()) investigate(input.value.trim());
  });

  const close = () => {
    timers.forEach(clearTimeout);
    host.style.display = "none";
  };
  $(".close").addEventListener("click", close);

  let grab = null;
  box.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 || e.target.closest("input, button, a")) return;
    grab = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    box.setPointerCapture(e.pointerId);
    box.classList.add("dragging");
  });
  box.addEventListener("pointermove", (e) => {
    if (!grab) return;
    pos = { x: e.clientX - grab.x, y: e.clientY - grab.y };
    place();
  });
  box.addEventListener("pointerup", () => {
    if (!grab) return;
    grab = null;
    box.classList.remove("dragging");
    chrome.storage.local.set({ pos });
  });
  addEventListener("resize", place);

  chrome.storage.local.get("pos").then((saved) => {
    if (saved.pos) pos = saved.pos;
    place();
  });

  window.hunch = {
    toggle() {
      if (host.style.display === "none") {
        host.style.display = "";
        reset();
      } else {
        close();
      }
    },
  };
  reset();
})();
