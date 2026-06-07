Arvio.Map = class {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.regions = [];
    this.connections = [];
    this.running = false;
    this.time = 0;
    this.init();
  }

  init() {
    this.defineRegions();
    this.generateConnections();
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.canvas.parentElement);
    this.resize();
    setInterval(() => this.updateHUD(), 3000);
  }

  defineRegions() {
    this.regions = [
      { name: 'North Atlantic', x: 0.25, y: 0.3, activity: 0.7 },
      { name: 'East Asia Pacific', x: 0.75, y: 0.35, activity: 0.9 },
      { name: 'Sub-Saharan Hub', x: 0.5, y: 0.55, activity: 0.5 },
      { name: 'Arctic Corridor', x: 0.45, y: 0.15, activity: 0.4 },
      { name: 'South American Axis', x: 0.3, y: 0.7, activity: 0.6 },
      { name: 'Central European Node', x: 0.52, y: 0.28, activity: 0.75 },
      { name: 'Indian Ocean Rim', x: 0.62, y: 0.5, activity: 0.55 },
      { name: 'Oceania Frontier', x: 0.82, y: 0.65, activity: 0.45 }
    ];
  }

  generateConnections() {
    for (let i = 0; i < this.regions.length; i++) {
      for (let j = i + 1; j < this.regions.length; j++) {
        if (Math.random() < 0.4) {
          this.connections.push({
            from: i,
            to: j,
            strength: Arvio.utils.rand(0.2, 1),
            phase: Arvio.utils.rand(0, Math.PI * 2)
          });
        }
      }
    }
  }

  resize() {
    const dims = Arvio.utils.resizeCanvas(this.canvas, this.ctx);
    this.width = dims.width;
    this.height = dims.height;
  }

  updateHUD() {
    const active = Arvio.utils.pick(this.regions);
    document.getElementById('regionName').textContent = active.name;
    document.getElementById('influenceCount').textContent = this.connections.length;

    active.activity = Arvio.utils.clamp(active.activity + Arvio.utils.rand(-0.15, 0.15), 0.2, 1);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.animate();
  }

  stop() {
    this.running = false;
  }

  draw() {
    const { ctx, width, height } = this;
    ctx.fillStyle = Arvio.utils.colors.bg;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(110, 231, 255, 0.05)';
    ctx.lineWidth = 0.5;
    const gridSize = 50;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    this.drawSimplifiedMap();

    this.connections.forEach(conn => {
      const from = this.regions[conn.from];
      const to = this.regions[conn.to];
      const fx = from.x * width;
      const fy = from.y * height;
      const tx = to.x * width;
      const ty = to.y * height;
      const pulse = (Math.sin(this.time * 0.03 + conn.phase) + 1) / 2;

      ctx.beginPath();
      ctx.moveTo(fx, fy);
      const cpx = (fx + tx) / 2 + Math.sin(conn.phase) * 50;
      const cpy = (fy + ty) / 2 + Math.cos(conn.phase) * 30;
      ctx.quadraticCurveTo(cpx, cpy, tx, ty);
      ctx.strokeStyle = `rgba(167, 139, 250, ${conn.strength * pulse * 0.4})`;
      ctx.lineWidth = conn.strength;
      ctx.stroke();

      const dotProgress = (this.time * 0.01 + conn.phase) % 1;
      const dotX = Arvio.utils.lerp(fx, tx, dotProgress);
      const dotY = Arvio.utils.lerp(fy, ty, dotProgress);
      ctx.beginPath();
      ctx.arc(dotX, dotY, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(110, 231, 255, 0.8)';
      ctx.fill();
    });

    this.regions.forEach(region => {
      const px = region.x * width;
      const py = region.y * height;
      const glow = region.activity + Math.sin(this.time * 0.02 + region.x * 10) * 0.1;

      const gradient = ctx.createRadialGradient(px, py, 0, px, py, 30 + glow * 20);
      gradient.addColorStop(0, `rgba(110, 231, 255, ${glow * 0.4})`);
      gradient.addColorStop(0.5, `rgba(167, 139, 250, ${glow * 0.15})`);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(px - 50, py - 50, 100, 100);

      ctx.beginPath();
      ctx.arc(px, py, 3 + glow * 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(110, 231, 255, ${glow})`;
      ctx.fill();
    });
  }

  drawSimplifiedMap() {
    const { ctx, width, height } = this;
    ctx.strokeStyle = 'rgba(110, 231, 255, 0.08)';
    ctx.lineWidth = 1;

    const continents = [
      [[0.15, 0.25], [0.2, 0.2], [0.28, 0.22], [0.32, 0.3], [0.28, 0.45], [0.22, 0.5], [0.15, 0.4]],
      [[0.45, 0.2], [0.55, 0.18], [0.58, 0.28], [0.52, 0.35], [0.45, 0.32]],
      [[0.6, 0.3], [0.72, 0.28], [0.78, 0.35], [0.75, 0.48], [0.65, 0.45], [0.6, 0.38]],
      [[0.2, 0.55], [0.28, 0.52], [0.32, 0.65], [0.28, 0.78], [0.22, 0.75], [0.18, 0.62]],
      [[0.72, 0.55], [0.82, 0.52], [0.85, 0.62], [0.78, 0.68], [0.72, 0.6]]
    ];

    continents.forEach(land => {
      ctx.beginPath();
      land.forEach((point, i) => {
        const x = point[0] * width;
        const y = point[1] * height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fillStyle = 'rgba(11, 15, 26, 0.8)';
      ctx.fill();
      ctx.stroke();
    });
  }

  animate() {
    if (!this.running) return;
    this.time++;
    this.regions.forEach(r => {
      r.activity = Arvio.utils.clamp(r.activity + Arvio.utils.rand(-0.01, 0.01), 0.2, 1);
    });
    this.draw();
    requestAnimationFrame(() => this.animate());
  }

  destroy() {
    this.stop();
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }
};
