/* ============================================
   PARTICLE BACKGROUND
   ============================================ */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

let W, H, particles = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// ✦ パーティクルの数・色はここで調整
const PARTICLE_COUNT = 60;
const COLORS = ['#7c4dff', '#b39dff', '#6c47ff', '#c084fc', '#818cf8'];

class Particle {
  constructor() { this.reset(true); }

  reset(initial = false) {
    this.x  = Math.random() * W;
    this.y  = initial ? Math.random() * H : H + 10;
    this.r  = Math.random() * 1.5 + 0.4;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = -(Math.random() * 0.5 + 0.2);
    this.alpha = Math.random() * 0.6 + 0.2;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.fade  = Math.random() * 0.003 + 0.001;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.fade;
    if (this.alpha <= 0 || this.y < -10) this.reset();
  }

  draw() {
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push(new Particle());
}

function loop() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  ctx.globalAlpha = 1;
  requestAnimationFrame(loop);
}
loop();

/* ============================================
   LINK BUTTON: RIPPLE EFFECT
   ============================================ */
document.querySelectorAll('.link-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      left: ${x}px; top: ${y}px;
      width: 6px; height: 6px;
      border-radius: 50%;
      background: rgba(180,150,255,0.5);
      transform: translate(-50%,-50%) scale(0);
      animation: ripple 0.5s ease-out forwards;
      pointer-events: none;
    `;

    if (!btn.style.position) btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });
});

const style = document.createElement('style');
style.textContent = `@keyframes ripple { to { transform: translate(-50%,-50%) scale(30); opacity: 0; } }`;
document.head.appendChild(style);
