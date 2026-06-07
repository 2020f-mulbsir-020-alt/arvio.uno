Arvio.Core = class {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.rotation = { fast: 0, mid: 0, slow: 0 };
    this.running = false;
    this.predictions = {
      short: ['+2.4%', '-0.8%', '+5.1%', '±1.2%'],
      mid: ['0.67λ', '0.43λ', '0.89λ', '0.51λ'],
      long: ['2087', '2094', '2101', '2112']
    };
    this.init();
  }

  init() {
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.canvas.parentElement);
    this.resize();
    setInterval(() => this.recalculate(), 2000);
  }

  resize() {
    const dims = Arvio.utils.resizeCanvas(this.canvas, this.ctx);
    this.width = dims.width;
    this.height = dims.height;
    this.cx = dims.width / 2;
    this.cy = dims.height / 2;
  }

  recalculate() {
    document.getElementById('coreShort').textContent = Arvio.utils.pick(this.predictions.short);
    document.getElementById('coreMid').textContent = Arvio.utils.pick(this.predictions.mid);
    document.getElementById('coreLong').textContent = Arvio.utils.pick(this.predictions.long);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.recalculate();
    this.animate();
  }

  stop() {
    this.running = false;
  }

  drawLayer(radius, speed, rotation, color, segments, dashed = false) {
    const { ctx, cx, cy } = this;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);

    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const nextAngle = ((i + 1) / segments) * Math.PI * 2;
      const innerR = radius * 0.85;
      const outerR = radius;

      ctx.beginPath();
      ctx.arc(0, 0, outerR, angle, nextAngle);
      ctx.arc(0, 0, innerR, nextAngle, angle, true);
      ctx.closePath();

      const alpha = 0.1 + (i % 3) * 0.05;
      const hex = color;
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.fill();
    }

    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.4;
    ctx.lineWidth = 1;
    if (dashed) ctx.setLineDash([4, 8]);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;

    for (let i = 0; i < segments; i += 2) {
      const angle = (i / segments) * Math.PI * 2;
      const px = Math.cos(angle) * radius;
      const py = Math.sin(angle) * radius;
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.6;
      ctx.fill();
    }

    ctx.restore();
  }

  draw() {
    const { ctx, width, height, cx, cy } = this;

    ctx.fillStyle = 'transparent';
    ctx.clearRect(0, 0, width, height);

    const baseRadius = Math.min(width, height) * 0.15;

    this.drawLayer(baseRadius * 2.2, 0.008, this.rotation.slow, '#A78BFA', 12, true);
    this.drawLayer(baseRadius * 1.5, 0.015, this.rotation.mid, '#6EE7FF', 8);
    this.drawLayer(baseRadius, 0.03, this.rotation.fast, '#6EE7FF', 6);

    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 8);
    grad.addColorStop(0, '#E6F0FF');
    grad.addColorStop(0.5, '#6EE7FF');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, 20, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(110, 231, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  animate() {
    if (!this.running) return;
    this.rotation.fast += 0.03;
    this.rotation.mid += 0.015;
    this.rotation.slow += 0.005;
    this.draw();
    requestAnimationFrame(() => this.animate());
  }

  destroy() {
    this.stop();
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }
};
