Arvio.Corridor = class {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.signals = [];
    this.running = false;
    this.scrollOffset = 0;
    this.types = ['trend', 'risk', 'opportunity', 'disruption'];
    this.typeColors = {
      trend: '#6EE7FF',
      risk: '#F87171',
      opportunity: '#34D399',
      disruption: '#A78BFA'
    };
    this.init();
  }

  init() {
    this.spawnSignals(40);
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.canvas.parentElement);
    this.resize();
    this.setupScroll();
  }

  spawnSignals(count) {
    for (let i = 0; i < count; i++) {
      this.signals.push(this.createSignal());
    }
  }

  createSignal() {
    const type = Arvio.utils.pick(this.types);
    return {
      x: Arvio.utils.rand(0, 1),
      y: Arvio.utils.rand(-1, 2),
      speed: Arvio.utils.rand(0.002, 0.006),
      size: Arvio.utils.rand(2, 6),
      type,
      pulse: Arvio.utils.rand(0, Math.PI * 2),
      intensity: Arvio.utils.rand(0.3, 1)
    };
  }

  resize() {
    const dims = Arvio.utils.resizeCanvas(this.canvas, this.ctx);
    this.width = dims.width;
    this.height = dims.height;
  }

  setupScroll() {
    const section = this.canvas.parentElement;
    window.addEventListener('scroll', () => {
      const rect = section.getBoundingClientRect();
      const progress = 1 - (rect.top + rect.height) / (window.innerHeight + rect.height);
      const clamped = Arvio.utils.clamp(progress, 0, 1);
      document.getElementById('corridorPosition').style.width = `${clamped * 100}%`;

      const activeType = this.types[Math.floor(clamped * this.types.length) % this.types.length];
      document.querySelectorAll('.signal-type').forEach(el => {
        el.classList.toggle('active', el.dataset.type === activeType);
      });
    });
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.animate();
  }

  stop() {
    this.running = false;
  }

  update() {
    this.signals.forEach(s => {
      s.y += s.speed;
      s.pulse += 0.05;
      if (s.y > 1.2) {
        s.y = -0.2;
        s.x = Arvio.utils.rand(0, 1);
        s.type = Arvio.utils.pick(this.types);
      }
    });
  }

  draw() {
    const { ctx, width, height } = this;

    const grad = ctx.createLinearGradient(0, 0, width, 0);
    grad.addColorStop(0, Arvio.utils.colors.bg);
    grad.addColorStop(0.5, Arvio.utils.colors.void);
    grad.addColorStop(1, Arvio.utils.colors.bg);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 5; i++) {
      const laneY = (i / 4) * height;
      ctx.strokeStyle = 'rgba(110, 231, 255, 0.03)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, laneY);
      ctx.lineTo(width, laneY);
      ctx.stroke();
    }

    this.signals.forEach(s => {
      const px = s.x * width;
      const py = s.y * height;
      const color = this.typeColors[s.type];
      const pulseSize = s.size + Math.sin(s.pulse) * 2;

      const hex = color;
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);

      ctx.beginPath();
      ctx.arc(px, py, pulseSize * s.intensity, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${s.intensity * 0.6})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(px, py, pulseSize * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${s.intensity * 0.1})`;
      ctx.fill();

      ctx.globalAlpha = 1;

      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px, py - 30 - Math.sin(s.pulse) * 10);
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.2)`;
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  }

  animate() {
    if (!this.running) return;
    this.update();
    this.draw();
    requestAnimationFrame(() => this.animate());
  }

  destroy() {
    this.stop();
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }
};
