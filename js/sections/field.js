Arvio.Field = class {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.points = [];
    this.gridOpacity = 0;
    this.running = false;
    this.resizeObserver = null;
    this.init();
  }

  init() {
    this.spawnPoints(80);
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.canvas.parentElement);
    this.resize();
  }

  spawnPoints(count) {
    for (let i = 0; i < count; i++) {
      this.points.push(this.createPoint());
    }
  }

  createPoint() {
    const w = this.width || 800;
    const h = this.height || 600;
    return {
      x: Arvio.utils.rand(0, w),
      y: Arvio.utils.rand(0, h),
      vx: Arvio.utils.rand(-0.4, 0.4),
      vy: Arvio.utils.rand(-0.4, 0.4),
      radius: Arvio.utils.rand(1, 3),
      opacity: Arvio.utils.rand(0.2, 0.8),
      splitTimer: Arvio.utils.randInt(200, 600),
      mergeRadius: Arvio.utils.rand(30, 60),
      hue: Math.random() > 0.7 ? 'violet' : 'cyan'
    };
  }

  resize() {
    const dims = Arvio.utils.resizeCanvas(this.canvas, this.ctx);
    this.width = dims.width;
    this.height = dims.height;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.animate();
  }

  stop() {
    this.running = false;
  }

  updateGrid() {
    if (this.gridOpacity < 0.12) {
      this.gridOpacity += 0.0008;
    }
  }

  updatePoints() {
    const { width, height } = this;

    this.points.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      p.splitTimer--;
      if (p.splitTimer <= 0 && this.points.length < 120) {
        const child = this.createPoint();
        child.x = p.x;
        child.y = p.y;
        child.vx = Arvio.utils.rand(-0.6, 0.6);
        child.vy = Arvio.utils.rand(-0.6, 0.6);
        child.radius = p.radius * 0.6;
        this.points.push(child);
        p.splitTimer = Arvio.utils.randInt(300, 800);
      }

      for (let j = i + 1; j < this.points.length; j++) {
        const other = this.points[j];
        const dx = other.x - p.x;
        const dy = other.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < p.mergeRadius && dist > 0 && Math.random() < 0.002) {
          p.x = (p.x + other.x) / 2;
          p.y = (p.y + other.y) / 2;
          p.radius = Math.min(p.radius + other.radius * 0.3, 5);
          p.opacity = Math.min(p.opacity + 0.1, 1);
          this.points.splice(j, 1);
          break;
        }
      }
    });
  }

  drawGrid() {
    const { ctx, width, height, gridOpacity } = this;
    const spacing = 40;

    ctx.strokeStyle = `rgba(110, 231, 255, ${gridOpacity})`;
    ctx.lineWidth = 0.5;

    for (let x = 0; x < width; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y < height; y += spacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  drawPoints() {
    const { ctx } = this;

    this.points.forEach(p => {
      const color = p.hue === 'violet'
        ? `rgba(167, 139, 250, ${p.opacity})`
        : `rgba(110, 231, 255, ${p.opacity})`;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      if (p.radius > 2) {
        const glowColor = p.hue === 'violet'
          ? `rgba(167, 139, 250, ${p.opacity * 0.15})`
          : `rgba(110, 231, 255, ${p.opacity * 0.15})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = glowColor;
        ctx.fill();
      }
    });

    ctx.strokeStyle = 'rgba(110, 231, 255, 0.05)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < this.points.length; i++) {
      for (let j = i + 1; j < this.points.length; j++) {
        const a = this.points[i];
        const b = this.points[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          ctx.globalAlpha = (1 - dist / 80) * 0.3;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  draw() {
    const { ctx, width, height } = this;
    ctx.fillStyle = Arvio.utils.colors.bg;
    ctx.fillRect(0, 0, width, height);
    this.drawGrid();
    this.drawPoints();
  }

  animate() {
    if (!this.running) return;
    this.updateGrid();
    this.updatePoints();
    this.draw();
    requestAnimationFrame(() => this.animate());
  }

  destroy() {
    this.stop();
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }
};
