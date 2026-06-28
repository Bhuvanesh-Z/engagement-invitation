/* ═══════════════════════════════════════════════════════
   SARANYA & ARIVAZHAGAN — ENGAGEMENT INVITATION
   script.js  |  All interactive & animation logic
   ═══════════════════════════════════════════════════════

   ── MUSIC CONFIGURATION ──────────────────────────────
   Replace the path below with your audio file.
   Drop the .mp3 into the /music/ folder, then update:

     const MUSIC_URL = "music/neethanae.mp3";

   The file structure should be:
     index.html
     style.css
     script.js
     music/
       neethanae.mp3   ← your file goes here
     assets/
     fonts/
   ──────────────────────────────────────────────────── */
const MUSIC_URL = "music/neethanae.mp3";

/* ══════════════════════════════════════════════════════
   1. ENTRANCE — GOLDEN SPARK PARTICLES
══════════════════════════════════════════════════════ */
(function initEntranceSparks() {
  const canvas = document.getElementById('entranceParticles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, sparks = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Spawn initial burst of sparks
  function spawnBurst(x, y, count) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 2.5;
      sparks.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        life: 1,
        decay: 0.008 + Math.random() * 0.012,
        size: 1 + Math.random() * 3,
        hue: 38 + Math.random() * 20 // gold range
      });
    }
  }

  // Initial burst from center
  setTimeout(() => {
    spawnBurst(W / 2, H / 2, 80);
    // Periodic ambient sparks
    setInterval(() => {
      const cx = W * 0.2 + Math.random() * W * 0.6;
      const cy = H * 0.2 + Math.random() * H * 0.5;
      spawnBurst(cx, cy, 6);
    }, 600);
  }, 100);

  function tick() {
    ctx.clearRect(0, 0, W, H);
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.x  += s.vx;
      s.y  += s.vy;
      s.vy += 0.04; // gravity
      s.vx *= 0.99;
      s.life -= s.decay;
      if (s.life <= 0) { sparks.splice(i, 1); continue; }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${s.hue}, 85%, 65%, ${s.life})`;
      ctx.fill();

      // Tail trail
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - s.vx * 3, s.y - s.vy * 3);
      ctx.strokeStyle = `hsla(${s.hue}, 85%, 70%, ${s.life * 0.5})`;
      ctx.lineWidth = s.size * 0.5 * s.life;
      ctx.stroke();
    }
    requestAnimationFrame(tick);
  }
  tick();
})();

/* ══════════════════════════════════════════════════════
   2. BACKGROUND CANVAS — bokeh, light rays, hearts
══════════════════════════════════════════════════════ */
(function initBgCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  let bokeh = [], rays = [], hearts = [];
  let active = false;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    if (active) buildBokeh();
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  function buildBokeh() {
    bokeh = [];
    const count = Math.min(30, Math.floor(W * H / 25000));
    for (let i = 0; i < count; i++) {
      bokeh.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 20 + Math.random() * 80,
        a: Math.random() * Math.PI * 2,
        speed: 0.0003 + Math.random() * 0.0005,
        alpha: 0.03 + Math.random() * 0.07,
        hue: Math.random() < 0.5 ? 38 : 340 // gold or rose
      });
    }
    rays = [];
    for (let i = 0; i < 5; i++) {
      rays.push({
        x: W * (0.2 + i * 0.15),
        angle: -Math.PI / 2 + (Math.random() - 0.5) * 0.5,
        alpha: 0.03 + Math.random() * 0.05,
        width: 80 + Math.random() * 160,
        phase: Math.random() * Math.PI * 2
      });
    }
    hearts = [];
    for (let i = 0; i < 8; i++) {
      hearts.push({
        x: Math.random() * W,
        y: H + 40,
        size: 8 + Math.random() * 16,
        speed: 0.3 + Math.random() * 0.5,
        drift: (Math.random() - 0.5) * 0.5,
        alpha: 0.5 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  function drawHeart(ctx, x, y, size) {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.3);
    ctx.bezierCurveTo(size * 0.5, -size * 0.9, size * 1.0, size * 0.1, 0, size * 0.7);
    ctx.bezierCurveTo(-size * 1.0, size * 0.1, -size * 0.5, -size * 0.9, 0, -size * 0.3);
    ctx.closePath();
    ctx.restore();
  }

  let t = 0;
  function tick() {
    if (!active) { requestAnimationFrame(tick); return; }
    ctx.clearRect(0, 0, W, H);
    t += 0.016;

    // Bokeh circles
    for (const b of bokeh) {
      b.a += b.speed;
      const px = b.x + Math.cos(b.a) * 30;
      const py = b.y + Math.sin(b.a * 0.7) * 20;
      const grad = ctx.createRadialGradient(px, py, 0, px, py, b.r);
      grad.addColorStop(0, `hsla(${b.hue}, 70%, 70%, ${b.alpha})`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(px - b.r, py - b.r, b.r * 2, b.r * 2);
    }

    // Light rays from top
    for (const ray of rays) {
      const pulse = Math.sin(t * 0.4 + ray.phase) * 0.015;
      ctx.save();
      ctx.translate(ray.x, 0);
      ctx.rotate(ray.angle);
      const rayGrad = ctx.createLinearGradient(0, 0, 0, H * 0.7);
      rayGrad.addColorStop(0, `rgba(200,169,110,${ray.alpha + pulse})`);
      rayGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = rayGrad;
      ctx.fillRect(-ray.width / 2, 0, ray.width, H * 0.7);
      ctx.restore();
    }

    // Floating hearts
    for (const h of hearts) {
      h.y -= h.speed;
      h.x += Math.sin(t * 0.8 + h.phase) * h.drift;
      if (h.y < -60) {
        h.y = H + 40;
        h.x = Math.random() * W;
      }
      ctx.save();
      ctx.globalAlpha = h.alpha * Math.abs(Math.sin(t * 0.5 + h.phase));
      drawHeart(ctx, h.x, h.y, h.size);
      const hGrad = ctx.createRadialGradient(h.x, h.y, 0, h.x, h.y, h.size);
      hGrad.addColorStop(0, '#F0B8C8');
      hGrad.addColorStop(1, '#D4738A');
      ctx.fillStyle = hGrad;
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(tick);
  }
  tick();

  // Expose activation
  window.activateBgCanvas = function() {
    active = true;
    buildBokeh();
    canvas.classList.add('active');
  };
})();

/* ══════════════════════════════════════════════════════
   3. ENTRANCE — open invitation
══════════════════════════════════════════════════════ */
function openInvitation() {
  // Prevent double-fire
  if (openInvitation._called) return;
  openInvitation._called = true;

  const entrance = document.getElementById('entrance');
  const main     = document.getElementById('main');

  entrance.classList.add('hide');
  main.classList.add('show');

  // Stagger background activations
  setTimeout(() => {
    if (window.activateBgCanvas) window.activateBgCanvas();
    spawnPetals();
    startCountdown();
    initScratch();
    observeFadeIns();
    init3DCouple();
  }, 400);

  // Music
  const music = document.getElementById('bgMusic');
  music.src = MUSIC_URL;
  setTimeout(() => { music.play().catch(() => {}); }, 900);
}

// Keyboard accessibility for entrance
document.getElementById('entrance').addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') openInvitation();
});

/* ══════════════════════════════════════════════════════
   4. FLOATING PETALS
══════════════════════════════════════════════════════ */
function spawnPetals() {
  const container = document.getElementById('petalsContainer');
  const emojis = ['🌸', '🌺', '✿', '❀', '🌼', '🌹', '🪷'];

  function addPetal() {
    const p = document.createElement('div');
    p.className = 'petal';
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.left = Math.random() * 100 + 'vw';
    p.style.animationDuration = (9 + Math.random() * 12) + 's';
    p.style.animationDelay    = (Math.random() * 4) + 's';
    p.style.fontSize  = (0.8 + Math.random() * 1.0) + 'rem';
    p.style.setProperty('--drift', (Math.random() > 0.5 ? 1 : -1) * (20 + Math.random() * 60) + 'px');
    container.appendChild(p);
    // Recycle petal after its animation to avoid DOM bloat
    setTimeout(() => { p.remove(); addPetal(); }, (22 + Math.random() * 8) * 1000);
  }

  // Start 20 petals staggered
  for (let i = 0; i < 20; i++) {
    setTimeout(addPetal, i * 280);
  }
}

/* ══════════════════════════════════════════════════════
   5. FLIP COUNTDOWN
══════════════════════════════════════════════════════ */
const TARGET_DATE = new Date('2026-07-12T18:00:00');

const cdState = { days: -1, hours: -1, mins: -1, secs: -1 };

function flipUnit(topEl, botEl, card, newVal) {
  const str = String(newVal).padStart(2, '0');
  if (topEl.textContent === str) return; // no change

  // Prime the bottom with new value before flip starts
  botEl.textContent = str;

  // Trigger CSS flip
  card.classList.add('flipping');
  setTimeout(() => {
    topEl.textContent = str;
    card.classList.remove('flipping');
  }, 380);
}

function startCountdown() {
  function update() {
    const now  = new Date();
    const diff = TARGET_DATE - now;

    if (diff <= 0) {
      ['days','hours','mins','secs'].forEach(u => {
        document.getElementById(`cd-${u}-top`).textContent = '00';
        document.getElementById(`cd-${u}-bot`).textContent = '00';
      });
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    const units = [
      { key:'days',  val:d, cardId:'cd-box-days'  },
      { key:'hours', val:h, cardId:'cd-box-hours' },
      { key:'mins',  val:m, cardId:'cd-box-mins'  },
      { key:'secs',  val:s, cardId:'cd-box-secs'  }
    ];

    units.forEach(u => {
      if (u.val !== cdState[u.key]) {
        cdState[u.key] = u.val;
        const box  = document.getElementById(u.cardId);
        const card = box.querySelector('.flip-card');
        const top  = box.querySelector(`#cd-${u.key}-top`);
        const bot  = box.querySelector(`#cd-${u.key}-bot`);
        flipUnit(top, bot, card, u.val);
      }
    });
  }

  update();
  setInterval(update, 1000);
}

/* ══════════════════════════════════════════════════════
   6. SCRATCH CARD
══════════════════════════════════════════════════════ */
function initScratch() {
  const canvas = document.getElementById('scratchCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  // Draw gold foil overlay
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0,   '#7a5200');
  grad.addColorStop(0.3, '#C8A96E');
  grad.addColorStop(0.5, '#9A7240');
  grad.addColorStop(0.7, '#C8A96E');
  grad.addColorStop(1,   '#7a5200');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Overlay texture dots
  ctx.fillStyle = 'rgba(200,169,110,0.25)';
  for (let i = 0; i < 10; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * W, Math.random() * H, 8 + Math.random() * 18, 0, Math.PI * 2);
    ctx.fill();
  }

  // Instruction text
  ctx.fillStyle = '#3B2010';
  ctx.font = 'bold 13px serif';
  ctx.textAlign = 'center';
  ctx.fillText('✦ SCRATCH HERE ✦', W / 2, 42);
  ctx.font = '11px serif';
  ctx.fillText('Reveal the auspicious date', W / 2, 64);
  ctx.font = '10px serif';
  ctx.fillStyle = 'rgba(59,32,16,0.7)';
  ctx.fillText('(Touch & drag to scratch)', W / 2, 88);

  // Switch to eraser mode
  ctx.globalCompositeOperation = 'destination-out';

  let isDrawing = false;
  let scratched = 0;
  const total = W * H;
  const REVEAL_THRESHOLD = 0.55;

  function getPos(e) {
    const r = canvas.getBoundingClientRect();
    const scaleX = W / r.width;
    const scaleY = H / r.height;
    if (e.touches) return {
      x: (e.touches[0].clientX - r.left) * scaleX,
      y: (e.touches[0].clientY - r.top)  * scaleY
    };
    return {
      x: (e.clientX - r.left) * scaleX,
      y: (e.clientY - r.top)  * scaleY
    };
  }

  function scratch(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const p = getPos(e);
    ctx.beginPath();
    ctx.arc(p.x, p.y, 26, 0, Math.PI * 2);
    ctx.fill();
    scratched += 1800;
    if (scratched > total * REVEAL_THRESHOLD) {
      setTimeout(() => {
        canvas.style.transition = 'opacity 0.6s ease';
        canvas.style.opacity = '0';
        setTimeout(() => { canvas.style.display = 'none'; }, 650);
      }, 100);
      document.getElementById('scratchedMsg').style.display = 'block';
    }
  }

  canvas.addEventListener('mousedown',  e => { isDrawing = true; scratch(e); });
  canvas.addEventListener('mousemove',  scratch);
  canvas.addEventListener('mouseup',    () => { isDrawing = false; });
  canvas.addEventListener('mouseleave', () => { isDrawing = false; });
  canvas.addEventListener('touchstart', e => { isDrawing = true; scratch(e); }, { passive: false });
  canvas.addEventListener('touchmove',  scratch, { passive: false });
  canvas.addEventListener('touchend',   () => { isDrawing = false; });
}

/* ══════════════════════════════════════════════════════
   7. SCROLL FADE-IN
══════════════════════════════════════════════════════ */
function observeFadeIns() {
  if (!('IntersectionObserver' in window)) {
    // Fallback — just make everything visible
    document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
    return;
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
}

/* ══════════════════════════════════════════════════════
   8. MUSIC TOGGLE
══════════════════════════════════════════════════════ */
let playing = false;
function toggleMusic() {
  const m   = document.getElementById('bgMusic');
  const btn = document.getElementById('musicBtn');
  if (playing) {
    m.pause();
    btn.textContent = '🎵';
    btn.setAttribute('aria-label', 'Play background music');
    playing = false;
  } else {
    if (!m.src || m.src === window.location.href) m.src = MUSIC_URL;
    m.play().catch(() => {});
    btn.textContent = '⏸';
    btn.setAttribute('aria-label', 'Pause background music');
    playing = true;
  }
}

// Update button state when audio actually starts
document.getElementById('bgMusic').addEventListener('play',  () => { playing = true;  document.getElementById('musicBtn').textContent = '⏸'; });
document.getElementById('bgMusic').addEventListener('pause', () => { playing = false; document.getElementById('musicBtn').textContent = '🎵'; });

/* ══════════════════════════════════════════════════════
   9. THREE.JS 3D COUPLE
   South Indian bride (pink silk saree + jasmine gajra +
   traditional jewellery + bindi) facing groom (cream/
   golden sherwani), holding hands, with:
   — soft breathing, slow blink, hair sway, saree drape
     movement, gentle hand sway, floating golden particles,
     golden light backdrop, couple lean-in cycle
══════════════════════════════════════════════════════ */
function init3DCouple() {
  // Guard: only run once Three.js is loaded
  if (typeof THREE === 'undefined') {
    // Three.js hasn't finished loading yet — retry
    setTimeout(init3DCouple, 200);
    return;
  }

  const canvas = document.getElementById('coupleCanvas');
  if (!canvas) return;

  // Responsive canvas size
  const wrap = canvas.parentElement;
  const W = wrap.clientWidth  || 340;
  const H = wrap.clientHeight || 380;
  canvas.width  = W;
  canvas.height = H;

  // ── RENDERER ──
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: window.devicePixelRatio < 2,
    alpha: true,
    powerPreference: 'low-power'
  });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  renderer.shadowMap.enabled = false; // disabled for mobile perf
  renderer.setClearColor(0x000000, 0);

  // ── SCENE & CAMERA ──
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
  camera.position.set(0, 1.3, 6.8);
  camera.lookAt(0, 1.1, 0);

  // ── LIGHTS ──
  scene.add(new THREE.AmbientLight(0xfff5e0, 0.65));

  const keyLight = new THREE.DirectionalLight(0xffeebb, 1.5);
  keyLight.position.set(2, 6, 5);
  scene.add(keyLight);

  const fillLight = new THREE.PointLight(0xff88aa, 0.9, 22);
  fillLight.position.set(-3, 3, 3);
  scene.add(fillLight);

  const rimLight = new THREE.PointLight(0xc8a96e, 1.1, 18);
  rimLight.position.set(0, 5, -5);
  scene.add(rimLight);

  // Warm golden back-light — the "golden light behind the couple"
  const backGold = new THREE.PointLight(0xFFD060, 2.2, 12);
  backGold.position.set(0, 2.0, -2.0);
  scene.add(backGold);

  // ── MATERIAL HELPERS ──
  const mat = (color, rough = 0.65, metal = 0.05) =>
    new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });

  const skinMat    = mat(0xC07040, 0.75, 0.0);  // South Indian warm skin
  const darkHair   = mat(0x100500, 0.9,  0.0);
  const goldMat    = mat(0xC8A96E, 0.25, 0.85);
  const roseMat    = mat(0xD4738A, 0.55, 0.05);
  const pinkSari   = mat(0xE0607A, 0.50, 0.06);  // Deep pink silk saree
  const sherwaniM  = mat(0xEEDFA0, 0.62, 0.08);  // Cream/golden sherwani
  const whiteMat   = mat(0xfff8f0, 0.45, 0.0);
  const eyeMat     = mat(0x100500, 0.95, 0.0);
  const jasMat     = mat(0xFFFDF0, 0.6,  0.0);   // Jasmine flowers
  const rubyMat    = mat(0xCC1122, 0.4,  0.2);   // Bindi

  function sphere(r, m, ws = 16, hs = 12) {
    return new THREE.Mesh(new THREE.SphereGeometry(r, ws, hs), m);
  }
  function cyl(rt, rb, h, m, seg = 12) {
    return new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m);
  }
  function box(w, h, d, m) {
    return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  }

  // ──────────────────────────────────────
  // BRIDE GROUP (left, faces right/groom)
  // ──────────────────────────────────────
  const brideGroup = new THREE.Group();
  brideGroup.position.set(-0.85, 0, 0);
  brideGroup.rotation.y = 0.28; // face groom

  // Saree skirt — wide cone shape
  const brideBody = cyl(0.40, 0.52, 1.65, pinkSari, 18);
  brideBody.position.y = 0.52;
  brideGroup.add(brideBody);

  // Gold border at hem
  const sariBorderBot = cyl(0.52, 0.52, 0.07, goldMat, 18);
  sariBorderBot.position.y = -0.29;
  brideGroup.add(sariBorderBot);

  // Second gold stripe (pallu detail)
  const sariBorderMid = cyl(0.50, 0.50, 0.05, goldMat, 18);
  sariBorderMid.position.y = -0.16;
  brideGroup.add(sariBorderMid);

  // Blouse / torso
  const brideTorso = cyl(0.28, 0.37, 0.58, roseMat, 14);
  brideTorso.position.y = 1.40;
  brideGroup.add(brideTorso);

  // Pallu (saree drape over left shoulder) — animated separately
  const palluGeo = new THREE.PlaneGeometry(0.45, 1.05, 2, 8);
  const palluMat = new THREE.MeshStandardMaterial({
    color: 0xE0607A, roughness: 0.55, side: THREE.DoubleSide, opacity: 0.88, transparent: true
  });
  const pallu = new THREE.Mesh(palluGeo, palluMat);
  pallu.position.set(-0.30, 1.22, 0.13);
  pallu.rotation.z = 0.25;
  brideGroup.add(pallu);

  // Neck
  const brideNeck = cyl(0.10, 0.12, 0.24, skinMat, 8);
  brideNeck.position.y = 1.77;
  brideGroup.add(brideNeck);

  // Head
  const brideHead = sphere(0.29, skinMat, 18, 14);
  brideHead.position.y = 2.15;
  brideGroup.add(brideHead);

  // Hair cap
  const brideHairCap = sphere(0.30, darkHair, 18, 14);
  brideHairCap.position.set(0, 2.22, -0.04);
  brideHairCap.scale.set(1.0, 0.80, 0.92);
  brideGroup.add(brideHairCap);

  // Bun / knot at back
  const bun = sphere(0.15, darkHair, 12, 10);
  bun.position.set(0, 2.50, -0.14);
  brideGroup.add(bun);

  // Gajra — jasmine garland ring on bun
  const GAJRA_R = 0.17;
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    const jf = sphere(0.035, jasMat, 8, 6);
    jf.position.set(
      Math.cos(a) * GAJRA_R,
      2.52 + Math.sin(a) * 0.04,
      -0.14 + Math.sin(a) * GAJRA_R * 0.6
    );
    brideGroup.add(jf);
  }
  // Extra jasmine flowers trailing from bun
  for (let i = 0; i < 6; i++) {
    const jt = sphere(0.028, jasMat, 6, 5);
    jt.position.set((i % 3 - 1) * 0.07, 2.38 - i * 0.05, -0.18 + i * 0.02);
    brideGroup.add(jt);
  }

  // Eyes
  const bEyeL = sphere(0.042, eyeMat, 8, 6);
  bEyeL.position.set(-0.095, 2.16, 0.27);
  brideGroup.add(bEyeL);
  const bEyeR = sphere(0.042, eyeMat, 8, 6);
  bEyeR.position.set(0.095, 2.16, 0.27);
  brideGroup.add(bEyeR);

  // Eye whites
  const bEyeWL = sphere(0.055, whiteMat, 8, 6);
  bEyeWL.position.set(-0.095, 2.16, 0.25);
  bEyeWL.scale.set(1.1, 0.9, 0.7);
  brideGroup.add(bEyeWL);
  const bEyeWR = bEyeWL.clone();
  bEyeWR.position.set(0.095, 2.16, 0.25);
  brideGroup.add(bEyeWR);

  // Blink objects (scale Y to 0 for blink)
  const bBlinkL = sphere(0.044, eyeMat, 8, 6);
  bBlinkL.position.copy(bEyeL.position);
  brideGroup.add(bBlinkL);
  const bBlinkR = bBlinkL.clone();
  bBlinkR.position.copy(bEyeR.position);
  brideGroup.add(bBlinkR);

  // Bindi (ruby red dot)
  const bindi = sphere(0.028, rubyMat, 8, 6);
  bindi.position.set(0, 2.225, 0.28);
  brideGroup.add(bindi);

  // Smile arc
  const smileGeo = new THREE.TorusGeometry(0.07, 0.012, 6, 12, Math.PI);
  const smileMesh = new THREE.Mesh(smileGeo, roseMat);
  smileMesh.position.set(0, 2.09, 0.28);
  smileMesh.rotation.z = Math.PI;
  brideGroup.add(smileMesh);

  // Necklace
  for (let i = 0; i < 11; i++) {
    const a = ((i - 5) / 10) * 1.0;
    const bead = sphere(0.036, goldMat, 8, 6);
    bead.position.set(Math.sin(a) * 0.24, 1.74 - Math.cos(a) * 0.04, Math.cos(a) * 0.20);
    brideGroup.add(bead);
  }
  const pendant = sphere(0.058, goldMat, 10, 8);
  pendant.position.set(0, 1.66, 0.17);
  brideGroup.add(pendant);

  // Earrings (jhumka style — small bell shape)
  function addJhumka(x) {
    const base = sphere(0.065, goldMat, 10, 8);
    base.position.set(x, 2.07, 0.10);
    brideGroup.add(base);
    const bell = cyl(0.045, 0.065, 0.08, goldMat, 10);
    bell.position.set(x, 1.99, 0.10);
    brideGroup.add(bell);
    const ruby = sphere(0.025, rubyMat, 6, 5);
    ruby.position.set(x, 1.92, 0.10);
    brideGroup.add(ruby);
  }
  addJhumka(-0.29);
  addJhumka(0.29);

  // Bangles (left wrist, outer arm)
  const brideArmL = cyl(0.068, 0.078, 0.52, skinMat, 8);
  brideArmL.position.set(-0.44, 1.28, 0.10);
  brideArmL.rotation.z = Math.PI * 0.34;
  brideGroup.add(brideArmL);

  const bangColors = [goldMat, roseMat, goldMat, rubyMat, goldMat];
  for (let i = 0; i < 5; i++) {
    const bg = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.018, 8, 16), bangColors[i]);
    bg.position.set(-0.60 - i * 0.028, 1.10 - i * 0.04, 0.12);
    bg.rotation.z = Math.PI * 0.34;
    brideGroup.add(bg);
  }

  // Right arm (toward groom / center)
  const brideArmR = cyl(0.068, 0.078, 0.58, skinMat, 8);
  brideArmR.position.set(0.40, 1.22, 0.10);
  brideArmR.rotation.z = -Math.PI * 0.28;
  brideGroup.add(brideArmR);

  scene.add(brideGroup);

  // ──────────────────────────────────────
  // GROOM GROUP (right, faces left/bride)
  // ──────────────────────────────────────
  const groomGroup = new THREE.Group();
  groomGroup.position.set(0.85, 0, 0);
  groomGroup.rotation.y = -0.28; // face bride

  // Lower body sherwani (cream/gold)
  const groomBody = cyl(0.36, 0.44, 1.72, sherwaniM, 16);
  groomBody.position.y = 0.56;
  groomGroup.add(groomBody);

  // Gold hem border
  const hemBorder = cyl(0.45, 0.45, 0.06, goldMat, 16);
  hemBorder.position.y = -0.29;
  groomGroup.add(hemBorder);

  // Torso sherwani
  const groomTorso = cyl(0.30, 0.38, 0.72, sherwaniM, 14);
  groomTorso.position.y = 1.50;
  groomGroup.add(groomTorso);

  // Gold trim buttons
  for (let i = 0; i < 6; i++) {
    const btn = sphere(0.032, goldMat, 6, 5);
    btn.position.set(0, 1.78 - i * 0.12, 0.32);
    groomGroup.add(btn);
  }

  // Gold collar trim
  const collar = new THREE.Mesh(
    new THREE.TorusGeometry(0.19, 0.038, 6, 14, Math.PI * 1.1),
    goldMat
  );
  collar.position.set(0, 1.90, 0.08);
  collar.rotation.x = Math.PI * 0.38;
  groomGroup.add(collar);

  // Neck
  const groomNeck = cyl(0.11, 0.13, 0.24, skinMat, 8);
  groomNeck.position.y = 1.86;
  groomGroup.add(groomNeck);

  // Head
  const groomHead = sphere(0.31, skinMat, 18, 14);
  groomHead.position.y = 2.23;
  groomGroup.add(groomHead);

  // Hair (neat, traditional)
  const groomHairCap = sphere(0.32, darkHair, 16, 12);
  groomHairCap.position.set(0, 2.30, -0.03);
  groomHairCap.scale.set(1.0, 0.70, 0.90);
  groomGroup.add(groomHairCap);

  // Side-parting line detail
  const partGeo = new THREE.BoxGeometry(0.005, 0.02, 0.28);
  const part = new THREE.Mesh(partGeo, skinMat);
  part.position.set(-0.04, 2.46, 0.10);
  groomGroup.add(part);

  // Tilak (forehead mark)
  const tilakLine = box(0.028, 0.095, 0.018, rubyMat);
  tilakLine.position.set(0, 2.34, 0.30);
  groomGroup.add(tilakLine);

  // Eyes
  const gEyeL = sphere(0.048, eyeMat, 8, 6);
  gEyeL.position.set(-0.11, 2.23, 0.28);
  groomGroup.add(gEyeL);
  const gEyeR = sphere(0.048, eyeMat, 8, 6);
  gEyeR.position.set(0.11, 2.23, 0.28);
  groomGroup.add(gEyeR);

  // Eye whites
  const gEyeWL = sphere(0.058, whiteMat, 8, 6);
  gEyeWL.position.set(-0.11, 2.23, 0.26);
  gEyeWL.scale.set(1.1, 0.9, 0.7);
  groomGroup.add(gEyeWL);
  const gEyeWR = gEyeWL.clone();
  gEyeWR.position.set(0.11, 2.23, 0.26);
  groomGroup.add(gEyeWR);

  // Blink objects
  const gBlinkL = sphere(0.050, eyeMat, 8, 6);
  gBlinkL.position.copy(gEyeL.position);
  groomGroup.add(gBlinkL);
  const gBlinkR = gBlinkL.clone();
  gBlinkR.position.copy(gEyeR.position);
  groomGroup.add(gBlinkR);

  // Smile arc
  const gSmileGeo = new THREE.TorusGeometry(0.08, 0.013, 6, 12, Math.PI);
  const gSmileMesh = new THREE.Mesh(gSmileGeo, mat(0xB06040, 0.6, 0.0));
  gSmileMesh.position.set(0, 2.10, 0.29);
  gSmileMesh.rotation.z = Math.PI;
  groomGroup.add(gSmileMesh);

  // Left arm (outward)
  const groomArmOut = cyl(0.08, 0.09, 0.58, sherwaniM, 8);
  groomArmOut.position.set(0.46, 1.38, 0.06);
  groomArmOut.rotation.z = -Math.PI * 0.28;
  groomGroup.add(groomArmOut);

  // Right arm (toward bride)
  const groomArmIn = cyl(0.08, 0.09, 0.60, sherwaniM, 8);
  groomArmIn.position.set(-0.44, 1.30, 0.10);
  groomArmIn.rotation.z = Math.PI * 0.26;
  groomGroup.add(groomArmIn);

  // Wrist cuff (kara)
  const kara = new THREE.Mesh(new THREE.TorusGeometry(0.090, 0.026, 8, 14), goldMat);
  kara.position.set(-0.66, 1.10, 0.12);
  kara.rotation.z = Math.PI * 0.26;
  groomGroup.add(kara);

  scene.add(groomGroup);

  // ── JOINED HANDS (center) ──
  const handGroup = new THREE.Group();
  handGroup.position.set(0, 0.92, 0.18);

  const handB = sphere(0.105, skinMat, 10, 8);
  handB.position.set(-0.15, 0, 0);
  handGroup.add(handB);
  const handG = sphere(0.115, skinMat, 10, 8);
  handG.position.set(0.12, 0, 0);
  handGroup.add(handG);

  // Engagement ring on bride's finger
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.018, 8, 16), goldMat);
  ring.position.set(-0.15, 0.06, 0);
  ring.rotation.z = Math.PI / 2;
  handGroup.add(ring);

  const diamondMat = new THREE.MeshStandardMaterial({ color: 0xaaddff, roughness: 0.05, metalness: 0.9 });
  const diamond = sphere(0.030, diamondMat, 8, 6);
  diamond.position.set(-0.15, 0.11, 0);
  handGroup.add(diamond);

  scene.add(handGroup);

  // ── FLOWER GARLAND BETWEEN THEM ──
  const garlandPts = [];
  for (let i = 0; i <= 22; i++) {
    const tt = i / 22;
    garlandPts.push(new THREE.Vector3(
      (tt - 0.5) * 2.4,
      -Math.sin(tt * Math.PI) * 0.28 + 1.04,
      0.20
    ));
  }
  const garlandCurve = new THREE.CatmullRomCurve3(garlandPts);
  const garlandGeo   = new THREE.TubeGeometry(garlandCurve, 32, 0.025, 6, false);
  const garland = new THREE.Mesh(garlandGeo, mat(0x2A6B1A, 0.8, 0.0));
  scene.add(garland);

  const flowerColors = [0xFF5C8A, 0xFFD700, 0xFF3333, 0xFFFFF0, 0xFF8800, 0xFF80C0];
  for (let i = 0; i <= 14; i++) {
    const pt = garlandCurve.getPoint(i / 14);
    const fl = sphere(0.055, mat(flowerColors[i % flowerColors.length], 0.5, 0.0), 8, 6);
    fl.position.copy(pt);
    scene.add(fl);
  }

  // ── GOLDEN BACKGROUND GLOW ──
  const glowGeo = new THREE.CircleGeometry(2.4, 32);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x4a2200,
    transparent: true,
    opacity: 0.60,
    side: THREE.DoubleSide
  });
  const glowPlane = new THREE.Mesh(glowGeo, glowMat);
  glowPlane.position.set(0, 1.4, -1.3);
  scene.add(glowPlane);

  // Halo ring around the glow
  const haloRing = new THREE.Mesh(
    new THREE.RingGeometry(2.0, 2.5, 48),
    new THREE.MeshBasicMaterial({ color: 0xC8A96E, transparent: true, opacity: 0.12, side: THREE.DoubleSide })
  );
  haloRing.position.set(0, 1.4, -1.25);
  scene.add(haloRing);

  // ── DECORATIVE ARCH ──
  const archCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-2.4, 1.8, -0.6),
    new THREE.Vector3(0, 4.0, -0.6),
    new THREE.Vector3(2.4, 1.8, -0.6)
  );
  const archMesh = new THREE.Mesh(
    new THREE.TubeGeometry(archCurve, 32, 0.04, 6, false),
    goldMat
  );
  scene.add(archMesh);

  for (let i = 0; i <= 9; i++) {
    const apt = archCurve.getPoint(i / 9);
    const af = sphere(0.07, mat(flowerColors[i % flowerColors.length], 0.5, 0.0), 8, 6);
    af.position.copy(apt);
    scene.add(af);
  }

  // ── DIYA LAMPS ──
  function addDiya(x) {
    const bowl = cyl(0.12, 0.10, 0.09, mat(0xC8A96E, 0.4, 0.7), 12);
    bowl.position.set(x, 0.04, 0.3);
    scene.add(bowl);
    const flame = sphere(0.065, new THREE.MeshBasicMaterial({ color: 0xFF9900 }), 8, 6);
    flame.position.set(x, 0.15, 0.3);
    scene.add(flame);
    return flame;
  }
  const flameL = addDiya(-2.1);
  const flameR = addDiya(2.1);
  const diyaL  = new THREE.PointLight(0xFF8800, 0.7, 4);
  diyaL.position.set(-2.1, 0.3, 0.5);
  scene.add(diyaL);
  const diyaR  = new THREE.PointLight(0xFF8800, 0.7, 4);
  diyaR.position.set(2.1, 0.3, 0.5);
  scene.add(diyaR);

  // ── FLOATING PARTICLES (golden) ──
  const PARTICLE_COUNT = 100;
  const pPos    = new Float32Array(PARTICLE_COUNT * 3);
  const pSpeeds = new Float32Array(PARTICLE_COUNT);
  const pPhases = new Float32Array(PARTICLE_COUNT);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    pPos[i*3]   = (Math.random() - 0.5) * 5.5;
    pPos[i*3+1] = Math.random() * 5.5;
    pPos[i*3+2] = (Math.random() - 0.5) * 3.5;
    pSpeeds[i]  = 0.003 + Math.random() * 0.005;
    pPhases[i]  = Math.random() * Math.PI * 2;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: 0xE8D4A0,
    size: 0.065,
    transparent: true,
    opacity: 0.80
  }));
  scene.add(particles);

  // Ground shadow
  const shadowMesh = new THREE.Mesh(
    new THREE.CircleGeometry(2.0, 32),
    new THREE.MeshBasicMaterial({ color: 0x080200, transparent: true, opacity: 0.45 })
  );
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.y = -0.29;
  scene.add(shadowMesh);

  // ── BLINK TIMING ──
  let nextBrideBlinkAt = 3.5;
  let nextGroomBlinkAt = 4.8;
  const BLINK_DUR = 0.15; // seconds
  let brideBlink = 0, groomBlink = 0;

  // ── LEAN-IN CYCLE PARAMS ──
  const BASE_BRIDE_X = -0.85;
  const BASE_GROOM_X = 0.85;
  const LEAN_AMOUNT  = 0.10; // max lean-in px
  const LEAN_PERIOD  = 7;    // seconds per lean-in cycle

  // ── ANIMATION LOOP ──
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.016;

    // ── BREATHING ──
    const breatheB = Math.sin(t * 1.15) * 0.026;
    const breatheG = Math.sin(t * 1.05 + 0.7) * 0.022;
    brideGroup.position.y = breatheB;
    groomGroup.position.y = breatheG;
    handGroup.position.y  = 0.92 + (breatheB + breatheG) * 0.5;

    // ── GENTLE BODY SWAY ──
    brideGroup.rotation.z = Math.sin(t * 0.65) * 0.016;
    groomGroup.rotation.z = Math.sin(t * 0.65 + Math.PI) * 0.016;

    // ── HEAD TILT TOWARD EACH OTHER ──
    brideHead.rotation.z  = 0.10 + Math.sin(t * 0.5) * 0.018;
    groomHead.rotation.z  = -0.10 + Math.sin(t * 0.5 + 1.2) * 0.018;

    // ── PALLU / SAREE DRAPE SWAY ──
    pallu.rotation.z = 0.25 + Math.sin(t * 0.9 + 0.4) * 0.06;
    pallu.position.z = 0.13 + Math.sin(t * 1.1) * 0.03;

    // ── GARLAND SWAY ──
    garland.position.y = Math.sin(t * 0.75) * 0.018;

    // ── LEAN-IN CYCLE (couple moves toward each other) ──
    const lean = Math.sin((t / LEAN_PERIOD) * Math.PI * 2) * 0.5 + 0.5;
    brideGroup.position.x = BASE_BRIDE_X + lean * LEAN_AMOUNT;
    groomGroup.position.x = BASE_GROOM_X - lean * LEAN_AMOUNT;

    // ── BLINK — BRIDE ──
    if (t >= nextBrideBlinkAt) {
      brideBlink = t;
      nextBrideBlinkAt = t + 3.5 + Math.random() * 3.0;
    }
    const brideBlinkProgress = (t - brideBlink) / BLINK_DUR;
    if (brideBlinkProgress <= 1) {
      const s = brideBlinkProgress < 0.5
        ? 1 - brideBlinkProgress * 2
        : (brideBlinkProgress - 0.5) * 2;
      bBlinkL.scale.y = Math.max(0.05, s);
      bBlinkR.scale.y = Math.max(0.05, s);
    } else {
      bBlinkL.scale.y = 1;
      bBlinkR.scale.y = 1;
    }

    // ── BLINK — GROOM ──
    if (t >= nextGroomBlinkAt) {
      groomBlink = t;
      nextGroomBlinkAt = t + 4.0 + Math.random() * 2.5;
    }
    const groomBlinkProgress = (t - groomBlink) / BLINK_DUR;
    if (groomBlinkProgress <= 1) {
      const s = groomBlinkProgress < 0.5
        ? 1 - groomBlinkProgress * 2
        : (groomBlinkProgress - 0.5) * 2;
      gBlinkL.scale.y = Math.max(0.05, s);
      gBlinkR.scale.y = Math.max(0.05, s);
    } else {
      gBlinkL.scale.y = 1;
      gBlinkR.scale.y = 1;
    }

    // ── DIYA FLICKER ──
    diyaL.intensity = 0.6 + Math.sin(t * 9.1) * 0.18;
    diyaR.intensity = 0.6 + Math.sin(t * 7.7 + 1.3) * 0.18;
    flameL.scale.setScalar(0.88 + Math.sin(t * 11) * 0.22);
    flameR.scale.setScalar(0.88 + Math.sin(t * 9.5 + 0.7) * 0.22);

    // ── FILL LIGHT HEARTBEAT ──
    fillLight.intensity = 0.80 + Math.sin(t * 1.55) * 0.18;

    // ── HALO RING PULSE ──
    haloRing.material.opacity = 0.08 + Math.sin(t * 0.7) * 0.06;

    // ── GOLDEN PARTICLES DRIFT UPWARD ──
    const pos = pGeo.attributes.position.array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i*3+1] += pSpeeds[i];
      pos[i*3]   += Math.sin(t * 0.8 + pPhases[i]) * 0.0015;
      if (pos[i*3+1] > 5.2) {
        pos[i*3+1] = -0.5;
        pos[i*3]   = (Math.random() - 0.5) * 5.5;
      }
    }
    pGeo.attributes.position.needsUpdate = true;

    // ── CAMERA SUBTLE ORBIT ──
    camera.position.x = Math.sin(t * 0.18) * 0.28;
    camera.position.y = 1.3 + Math.sin(t * 0.14) * 0.12;
    camera.lookAt(0, 1.2, 0);

    renderer.render(scene, camera);
  }
  animate();

  // ── RESPONSIVE RESIZE ──
  function onCanvasResize() {
    const newW = wrap.clientWidth  || 340;
    const newH = wrap.clientHeight || 380;
    renderer.setSize(newW, newH);
    camera.aspect = newW / newH;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onCanvasResize, { passive: true });
}
