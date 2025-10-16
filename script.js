// PumpCreate — script.js
// Author: PumpCreate logic (2025). Handles options, randomize, download and saving.

(() => {
  // --- Option data (arrays of functions that render SVG nodes) ---
  const eyesOptions = [
    { id:'eyes_round', render: () => /*svg*/`<g transform="translate(0,0)">
        <ellipse cx="230" cy="250" rx="28" ry="36" fill="#fff"/>
        <ellipse cx="370" cy="250" rx="28" ry="36" fill="#fff"/>
        <circle cx="235" cy="260" r="10" fill="#2a1f0f"/>
        <circle cx="375" cy="260" r="10" fill="#2a1f0f"/>
      </g>`},
    { id:'eyes_squint', render: () => /*svg*/`<g>
        <path d="M200 250 q30 -26 60 0" stroke="#2a1f0f" stroke-width="9" stroke-linecap="round" fill="none"/>
        <path d="M360 250 q30 -26 60 0" stroke="#2a1f0f" stroke-width="9" stroke-linecap="round" fill="none"/>
      </g>`},
    { id:'eyes_glow', render: () => /*svg*/`<g>
        <ellipse cx="230" cy="250" rx="24" ry="30" fill="#fff"/>
        <ellipse cx="370" cy="250" rx="24" ry="30" fill="#fff"/>
        <circle cx="230" cy="250" r="10" fill="#ffd86b"/>
        <circle cx="370" cy="250" r="10" fill="#ffd86b"/>
        <circle cx="235" cy="255" r="4" fill="#fff"/>
        <circle cx="375" cy="255" r="4" fill="#fff"/>
      </g>`},
    { id:'eyes_star', render: () => `<g transform="translate(0,0)">
        <path d="M230 236 l6 16 l16 0 l-13 10 l5 16 l-14 -10 l-14 10 l5 -16 l-13 -10 l16 0 z" fill="#2a1f0f"/>
        <path d="M370 236 l6 16 l16 0 l-13 10 l5 16 l-14 -10 l-14 10 l5 -16 l-13 -10 l16 0 z" fill="#2a1f0f"/>
      </g>`},
  ];

  const noseOptions = [
    { id:'nose_none', render: () => `` },
    { id:'nose_triangle', render: () => `<g><path d="M300 300 L280 330 L320 330 Z" fill="#2a1f0f"/></g>`},
    { id:'nose_round', render: () => `<g><ellipse cx="300" cy="315" rx="12" ry="10" fill="#2a1f0f"/></g>`},
  ];

  const mouthOptions = [
    { id:'mouth_smile', render: () => `<g><path d="M230 360 q70 50 140 0" stroke="#2a1f0f" stroke-width="16" stroke-linecap="round" fill="none"/></g>`},
    { id:'mouth_scary', render: () => `<g>
        <path d="M220 360 q60 90 160 0" fill="#2a1f0f"/>
        <rect x="250" y="340" width="8" height="30" fill="#fff" transform="skewX(-8)"/>
        <rect x="290" y="340" width="8" height="30" fill="#fff" transform="skewX(-8)"/>
        <rect x="330" y="340" width="8" height="30" fill="#fff" transform="skewX(-8)"/>
      </g>`},
    { id:'mouth_o', render: () => `<g><ellipse cx="300" cy="360" rx="36" ry="26" fill="#2a1f0f" /></g>`},
    { id:'mouth_grin', render: () => `<g><path d="M220 355 q80 40 160 0" stroke="#2a1f0f" stroke-width="10" stroke-linecap="round" fill="none"/></g>`}
  ];

  const accessories = [
    { id:'acc_none', name:'None', render: () => ``},
    { id:'acc_hat', name:'Witch Hat', render: () => `<g id="hat" transform="translate(170,60)">
        <path d="M60 10 Q120 -20 200 10 L180 48 L80 48 Z" fill="#2a1f0f" stroke="#000" stroke-opacity="0.12"/>
        <rect x="125" y="12" width="40" height="8" transform="rotate(-12 145 16)" fill="#ffb86b"/>
      </g>`},
    { id:'acc_scarf', name:'Scarf', render: () => `<g id="scarf" transform="translate(0,350)">
        <path d="M160 20 q60 24 140 0 q-8 28 -10 30 q-36 20 -130 2 z" fill="#6b3b22" />
        <path d="M270 30 q40 18 80 40 q-20 10 -30 12 q-56 -22 -70 -34z" fill="#5a2f1b" opacity="0.95"/>
      </g>`},
    { id:'acc_glasses', name:'Glasses', render: () => `<g transform="translate(0,0)">
        <rect x="200" y="228" width="60" height="44" rx="10" fill="none" stroke="#36261b" stroke-width="8"/>
        <rect x="340" y="228" width="60" height="44" rx="10" fill="none" stroke="#36261b" stroke-width="8"/>
        <path d="M260 250 L340 250" stroke="#36261b" stroke-width="6" stroke-linecap="round"/>
      </g>`},
    { id:'acc_leaf', name:'Leaf', render: () => `<g transform="translate(430,110) rotate(-20)">
        <path d="M0 0 q24 -12 54 4 q-12 24 -40 26 q-22 -10 -14 -30z" fill="#6bb04a" stroke="#35621e"/>
      </g>`}
  ];

  const colorOptions = [
    { id:'color_orange', name:'Classic', color:'#FF8C2B', stroke:'#c55f15' },
    { id:'color_pale', name:'Ghost White', color:'#fefcf8', stroke:'#e2d6c9' },
    { id:'color_greenish', name:'Greeny', color:'#9ad08a', stroke:'#5f8c5a' },
    { id:'color_golden', name:'Golden', color:'#ffb86b', stroke:'#c87a2a' },
  ];

  const bgOptions = [
    { id:'bg_autumn', name:'Autumn', cls:'autumn' },
    { id:'bg_night', name:'Night', cls:'night' },
    { id:'bg_spooky', name:'Spooky', cls:'spooky' },
  ];

  // --- State and element refs ---
  const state = {
    eyeIndex: 0, noseIndex: 0, mouthIndex: 0, accIndex: 0, colorIndex: 0, bgIndex: 0,
    sound: false
  };

  // element refs
  const svg = document.getElementById('pumpkinSVG');
  const eyesContainer = document.getElementById('eyes');
  const noseContainer = document.getElementById('nose');
  const mouthContainer = document.getElementById('mouth');
  const accessoryContainer = document.getElementById('accessoryGroup');
  const pumpOuter = document.getElementById('pumpOuter');

  // UI refs
  const eyesOptionsNode = document.getElementById('eyesOptions');
  const noseOptionsNode = document.getElementById('noseOptions');
  const mouthOptionsNode = document.getElementById('mouthOptions');
  const accessoriesNode = document.getElementById('accessoriesOptions');
  const colorOptionsNode = document.getElementById('colorOptions');
  const bgOptionsNode = document.getElementById('bgOptions');
  const backgroundLayer = document.getElementById('backgroundLayer');

  // buttons
  const randomBtn = document.getElementById('randomBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const randomBtn2 = document.getElementById('randomBtn2');
  const downloadBtn2 = document.getElementById('downloadBtn2');
  const soundToggle = document.getElementById('soundToggle');

  // --- Helper functions ---
  function setInnerSVG(targetNode, svgStr) {
    // simple DOM injection for small fragments
    targetNode.innerHTML = svgStr;
  }

  function applyFace() {
    // eyes
    setInnerSVG(eyesContainer, eyesOptions[state.eyeIndex].render());
    // nose
    setInnerSVG(noseContainer, noseOptions[state.noseIndex].render());
    // mouth
    setInnerSVG(mouthContainer, mouthOptions[state.mouthIndex].render());

    // small transition
    [eyesContainer, noseContainer, mouthContainer].forEach(el => {
      el.style.opacity = 0;
      requestAnimationFrame(()=> el.style.transition = 'opacity 240ms ease-in-out', el.style.opacity = 1);
    });
  }

  function applyAccessory() {
    setInnerSVG(accessoryContainer, accessories[state.accIndex].render());
  }

  function applyColor() {
    const c = colorOptions[state.colorIndex];
    if (c) {
      pumpOuter.setAttribute('fill', c.color);
      pumpOuter.setAttribute('stroke', c.stroke);
      // slight background tint
      document.documentElement.style.setProperty('--accent', c.color);
      document.documentElement.style.setProperty('--accent-dark', c.stroke);
    }
  }

  function applyBackground() {
    bgOptions.forEach(b => backgroundLayer.classList.remove(b.cls));
    const cls = bgOptions[state.bgIndex].cls;
    backgroundLayer.classList.add(cls);
  }

  // --- UI builders ---
  function makeOptionButton(svgHTML, idx, container, group, label) {
    const opt = document.createElement('div');
    opt.className = 'opt';
    opt.dataset.idx = idx;
    opt.innerHTML = svgHTML || `<div style="font-size:12px;text-align:center">${label||''}</div>`;
    opt.addEventListener('click', () => {
      // update state by group
      if (group === 'eyes') state.eyeIndex = idx;
      if (group === 'nose') state.noseIndex = idx;
      if (group === 'mouth') state.mouthIndex = idx;
      if (group === 'acc') state.accIndex = idx;
      if (group === 'color') state.colorIndex = idx;
      if (group === 'bg') state.bgIndex = idx;
      updateAll();
      playClick();
      saveState();
      highlightActive(container, idx);
    });
    container.appendChild(opt);
    return opt;
  }

  function highlightActive(container, idx) {
    container.querySelectorAll('.opt').forEach(n => n.classList.remove('active'));
    const el = container.querySelector(`.opt[data-idx='${idx}']`);
    if (el) el.classList.add('active');
  }

  function buildUI() {
    // eyes
    eyesOptions.forEach((o, i) => {
      const svgThumb = `<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">${o.render()}</svg>`;
      makeOptionButton(svgThumb, i, eyesOptionsNode, 'eyes', o.id);
    });
    // nose
    noseOptions.forEach((o, i) => {
      const svgThumb = `<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">${o.render()}</svg>`;
      makeOptionButton(svgThumb, i, noseOptionsNode, 'nose', o.id);
    });
    // mouth
    mouthOptions.forEach((o, i) => {
      const svgThumb = `<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">${o.render()}</svg>`;
      makeOptionButton(svgThumb, i, mouthOptionsNode, 'mouth', o.id);
    });
    // accessories
    accessories.forEach((o,i) => {
      const svgThumb = `<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">${o.render()}</svg>`;
      makeOptionButton(svgThumb, i, accessoriesNode, 'acc', o.name);
    });
    // colors
    colorOptions.forEach((o,i) => {
      const chip = `<div style="width:100%;height:100%;border-radius:8px;background:${o.color};box-shadow: inset 0 -6px 10px rgba(0,0,0,0.08)"></div>`;
      makeOptionButton(chip, i, colorOptionsNode, 'color', o.name);
    });
    // background
    bgOptions.forEach((o,i) => {
      const chip = `<div style="width:100%;height:100%;border-radius:8px;background:linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0.2));display:flex;align-items:center;justify-content:center;font-size:11px">${o.name}</div>`;
      makeOptionButton(chip, i, bgOptionsNode, 'bg', o.name);
    });

    // initial highlights
    highlightActive(eyesOptionsNode, state.eyeIndex);
    highlightActive(noseOptionsNode, state.noseIndex);
    highlightActive(mouthOptionsNode, state.mouthIndex);
    highlightActive(accessoriesNode, state.accIndex);
    highlightActive(colorOptionsNode, state.colorIndex);
    highlightActive(bgOptionsNode, state.bgIndex);
  }

  // --- Randomizer ---
  function randomizeAll() {
    state.eyeIndex = Math.floor(Math.random()*eyesOptions.length);
    state.noseIndex = Math.floor(Math.random()*noseOptions.length);
    state.mouthIndex = Math.floor(Math.random()*mouthOptions.length);
    state.accIndex = Math.floor(Math.random()*accessories.length);
    state.colorIndex = Math.floor(Math.random()*colorOptions.length);
    state.bgIndex = Math.floor(Math.random()*bgOptions.length);
    updateAll();
    saveState();
  }

  // --- Download logic: convert SVG to PNG ---
  function downloadPNG(filename='my-pumpkin.png') {
    // Serialize SVG
    const svgNode = document.getElementById('pumpkinSVG');
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgNode);

    // Create image
    const img = new Image();
    const svgBlob = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      // canvas sized to SVG viewBox(600x600)
      const canvas = document.createElement('canvas');
      canvas.width = 1200; canvas.height = 1200;
      const ctx = canvas.getContext('2d');
      // draw background (capture selected background)
      // Add a soft background rect to canvas
      ctx.fillStyle = window.getComputedStyle(document.getElementById('backgroundLayer')).background || '#fff';
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        const link = document.createElement('a');
        link.download = filename;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
      }, 'image/png');
      URL.revokeObjectURL(url);
    };
    img.onerror = (e) => { console.error('SVG -> IMG failed', e); URL.revokeObjectURL(url) };
    img.src = url;
    playClick();
  }

  // --- Persistence ---
  const STORAGE_KEY = 'pumpcreate_v1';
  function saveState(){
    const toSave = {...state};
    delete toSave.sound;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }
  function loadState(){
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return;
    try {
      const s = JSON.parse(raw);
      Object.assign(state, s);
    } catch(e) { console.warn('failed to parse state', e) }
  }

  // --- sound effect (tiny synth tone) ---
  let audioCtx = null;
  function playClick(){
    if(!state.sound) return;
    try {
      if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'sine'; o.frequency.value = 440 + Math.random()*80;
      g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime+0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime+0.3);
      o.connect(g); g.connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime+0.32);
    } catch(e){ /* ignore */ }
  }

  // --- Update everything UI & pumpkin ---
  function updateAll() {
    applyFace();
    applyAccessory();
    applyColor();
    applyBackground();

    // highlight UI
    highlightActive(eyesOptionsNode, state.eyeIndex);
    highlightActive(noseOptionsNode, state.noseIndex);
    highlightActive(mouthOptionsNode, state.mouthIndex);
    highlightActive(accessoriesNode, state.accIndex);
    highlightActive(colorOptionsNode, state.colorIndex);
    highlightActive(bgOptionsNode, state.bgIndex);
  }

  // --- Tabs behavior ---
  document.querySelectorAll('.tab').forEach(t => {
    t.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      const tabId = t.dataset.tab;
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      document.getElementById(tabId).classList.add('active');
    });
  });

  // --- Attach controls ---
  randomBtn.addEventListener('click', () => { randomizeAll(); });
  randomBtn2.addEventListener('click', () => { randomizeAll(); });
  downloadBtn.addEventListener('click', () => downloadPNG());
  downloadBtn2.addEventListener('click', () => downloadPNG());
  soundToggle.addEventListener('change', (e) => { state.sound = e.target.checked; });

  // --- Initialization ---
  function init() {
    loadState();
    buildUI();
    updateAll();
    // ensure sound toggle UI
    soundToggle.checked = !!state.sound;
  }
  init();

  // OPTIONAL: small keyboard shortcuts
  window.addEventListener('keydown', (e) => {
    if(e.key === 'r') { randomizeAll(); }
    if(e.key === 'd') { downloadPNG(); }
  });

})();
