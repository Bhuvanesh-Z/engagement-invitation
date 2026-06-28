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
const MUSIC_URL = "neethanae.mp3";

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
   5. COUNTDOWN — Stable, flicker-free flip animation
   Architecture:
   • One setInterval at exactly 1000ms for time math
   • DOM panels added/removed only when value changes
   • requestAnimationFrame NOT used (no drift)
   • Each flip-card has: static top+bot (show current),
     animated panels that fold in/out on change
══════════════════════════════════════════════════════ */
const TARGET_DATE = new Date('2026-07-12T18:00:00');

// Track displayed values to avoid unnecessary flips
const _cdCurrent = { days: -1, hours: -1, mins: -1, secs: -1 };

// Whether a unit is mid-animation (block overlapping flips)
const _cdFlipping = { days: false, hours: false, mins: false, secs: false };

function _cdPad(n) { return String(n).padStart(2, '0'); }

/**
 * Performs a single flip for one unit.
 * Strategy:
 *  1. Immediately update the bottom static panel (new value).
 *  2. Create a "fold-out" panel (shows old value) on top — animates away.
 *  3. Create a "fold-in" panel (shows new value) on bottom — animates in.
 *  4. After animation: clean up panels, update top static.
 */
function _cdFlip(unit, oldVal, newVal) {
  if (_cdFlipping[unit]) return; // skip if already animating this unit

  const card = document.getElementById('fc-' + unit);
  if (!card) return;

  const topEl    = card.querySelector('.flip-top .cd-num');
  const botEl    = card.querySelector('.flip-bot .cd-num');
  const newStr   = _cdPad(newVal);
  const oldStr   = _cdPad(oldVal);

  _cdFlipping[unit] = true;

  // Update the static bottom immediately (hidden during animation)
  botEl.textContent = newStr;

  // Build fold-out panel (old value, folds away upward)
  const foldOut = document.createElement('div');
  foldOut.className = 'flip-top-panel';
  foldOut.innerHTML = `<span class="cd-num">${oldStr}</span>`;
  card.appendChild(foldOut);

  // Build fold-in panel (new value, unfolds downward)
  const foldIn = document.createElement('div');
  foldIn.className = 'flip-bot-panel';
  foldIn.innerHTML = `<span class="cd-num">${newStr}</span>`;
  card.appendChild(foldIn);

  // Trigger reflow so CSS animation applies
  void foldOut.offsetHeight;

  // Add animation class
  card.classList.add('is-flipping');

  // After animation completes: clean up
  const TOTAL_MS = 480; // 300ms fold-out + 180ms delay + 300ms fold-in ≈ 480ms
  setTimeout(() => {
    // Update static top to new value
    topEl.textContent = newStr;
    // Remove panels and animation class
    foldOut.remove();
    foldIn.remove();
    card.classList.remove('is-flipping');
    _cdFlipping[unit] = false;
  }, TOTAL_MS);
}

function startCountdown() {
  // Guard: prevent double-start
  if (startCountdown._running) return;
  startCountdown._running = true;

  const grid     = document.getElementById('countdownGrid');
  const arrivedEl = document.createElement('p');
  arrivedEl.className = 'countdown-arrived';
  arrivedEl.textContent = 'Our Special Day Has Arrived ❤️';

  function _update() {
    const now  = Date.now();
    const diff = new Date('2026-07-12T18:00:00').getTime() - now;

    if (diff <= 0) {
      // Show arrived message, hide grid
      if (grid) grid.style.display = 'none';
      if (!arrivedEl.parentNode) {
        grid.parentNode.appendChild(arrivedEl);
      }
      clearInterval(_intervalId);
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    const units = [
      { key: 'days',  val: d },
      { key: 'hours', val: h },
      { key: 'mins',  val: m },
      { key: 'secs',  val: s }
    ];

    units.forEach(({ key, val }) => {
      if (val !== _cdCurrent[key]) {
        const old = _cdCurrent[key];
        _cdCurrent[key] = val;

        if (old === -1) {
          // First run: set static values without animation
          const card = document.getElementById('fc-' + key);
          if (card) {
            card.querySelector('.flip-top .cd-num').textContent = _cdPad(val);
            card.querySelector('.flip-bot .cd-num').textContent = _cdPad(val);
          }
        } else {
          _cdFlip(key, old, val);
        }
      }
    });
  }

  _update(); // immediate first tick
  const _intervalId = setInterval(_update, 1000);
}

/* ══════════════════════════════════════════════════════
   9. SVG COUPLE — no Three.js needed
   All animation is pure CSS (see style.css).
   This function is kept as a no-op stub so openInvitation()
   call still works without errors.
══════════════════════════════════════════════════════ */
function init3DCouple() {
  // No-op: couple is now an inline SVG with CSS animations.
  // All animations are handled by CSS keyframes defined in style.css.
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
   9. SVG COUPLE — no Three.js needed
   All animation is pure CSS (see style.css).
   This function is kept as a no-op stub so openInvitation()
   works without errors.
══════════════════════════════════════════════════════ */
function init3DCouple() {
  // No-op: couple is now an inline SVG with CSS animations.
  // All animations are handled by CSS keyframes defined in style.css.
}


