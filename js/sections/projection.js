Arvio.Projection = class {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.rotation = 0;
    this.running = false;
    this.particles = [];
    this.init();
  }

  init() {
    this.spawnParticles(200);
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.canvas.parentElement);
    this.resize();
    this.setupEnterButton();
  }

  spawnParticles(count) {
    for (let i = 0; i < count; i++) {
      const theta = Arvio.utils.rand(0, Math.PI * 2);
      const phi = Arvio.utils.rand(0, Math.PI);
      this.particles.push({
        theta,
        phi,
        size: Arvio.utils.rand(0.5, 2),
        speed: Arvio.utils.rand(0.001, 0.005),
        hue: Math.random() > 0.5 ? 'cyan' : 'violet'
      });
    }
  }

  resize() {
    const dims = Arvio.utils.resizeCanvas(this.canvas, this.ctx);
    this.width = dims.width;
    this.height = dims.height;
    this.cx = dims.width / 2;
    this.cy = dims.height / 2;
    this.radius = Math.min(dims.width, dims.height) * 0.25;
  }

  setupEnterButton() {
    const btn = document.getElementById('enterArvio');
    const waves = document.getElementById('probabilityWaves');

    btn.addEventListener('mouseenter', (e) => this.emitWaves(e, waves));
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  emitWaves(e, container) {
    const rect = e.currentTarget.getBoundingClientRect();
    const section = this.canvas.parentElement.parentElement;
    const sectionRect = section.getBoundingClientRect();
    const x = rect.left + rect.width / 2 - sectionRect.left;
    const y = rect.top + rect.height / 2 - sectionRect.top;

    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const wave = document.createElement('div');
        wave.className = 'prob-wave';
        wave.style.left = `${x}px`;
        wave.style.top = `${y}px`;
        wave.style.width = '80px';
        wave.style.height = '80px';
        container.appendChild(wave);
        setTimeout(() => wave.remove(), 2000);
      }, i * 300);
    }
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.animate();
  }

  stop() {
    this.running = false;
  }

  project(theta, phi, rotY) {
    const r = this.radius;
    let x = r * Math.sin(phi) * Math.cos(theta + rotY);
    let y = r * Math.cos(phi);
    let z = r * Math.sin(phi) * Math.sin(theta + rotY);

    const scale = 300 / (300 + z);
    return {
      x: this.cx + x * scale,
      y: this.cy + y * scale,
      z,
      scale
    };
  }

  draw() {
    const { ctx, width, height } = this;

    ctx.fillStyle = 'transparent';
    ctx.clearRect(0, 0, width, height);

    const sorted = this.particles.map(p => {
      const pos = this.project(p.theta, p.phi, this.rotation);
      return { ...p, ...pos };
    }).sort((a, b) => a.z - b.z);

    sorted.forEach(p => {
      const color = p.hue === 'cyan'
        ? `rgba(110, 231, 255, ${0.3 + p.scale * 0.5})`
        : `rgba(167, 139, 250, ${0.3 + p.scale * 0.5})`;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.scale, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    });

    const rings = 5;
    for (let r = 0; r < rings; r++) {
      const ringRadius = this.radius * (0.5 + r * 0.12);
      ctx.beginPath();
      for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI * 2;
        const pos = this.project(theta, Math.PI / 2, this.rotation);
        const adjusted = this.project(theta, Math.PI / 2 + Math.sin(theta + this.rotation) * 0.2, this.rotation);
        if (i === 0) ctx.moveTo(adjusted.x, adjusted.y);
        else ctx.lineTo(adjusted.x, adjusted.y);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(110, 231, 255, ${0.1 - r * 0.015})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    const glowGrad = ctx.createRadialGradient(this.cx, this.cy, 0, this.cx, this.cy, this.radius * 1.5);
    glowGrad.addColorStop(0, 'rgba(110, 231, 255, 0.08)');
    glowGrad.addColorStop(0.5, 'rgba(167, 139, 250, 0.04)');
    glowGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, width, height);
  }

  animate() {
    if (!this.running) return;
    this.rotation += 0.005;
    this.particles.forEach(p => {
      p.theta += p.speed;
    });
    this.draw();
    requestAnimationFrame(() => this.animate());
  }

  destroy() {
    this.stop();
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }
};
