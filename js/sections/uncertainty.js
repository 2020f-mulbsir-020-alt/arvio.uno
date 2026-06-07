Arvio.Uncertainty = class {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.paths = [];
    this.running = false;
    this.time = 0;
    this.predictions = [
      'Convergence uncertain',
      'Probability unstable',
      'Model diverging',
      'Signal degraded',
      'Outcome unresolved',
      'Confidence: ±47%',
      'Path bifurcating',
      'Data incomplete',
      'Forecast decaying',
      'Threshold unknown'
    ];
    this.init();
  }

  init() {
    this.spawnPaths(15);
    this.populatePredictions();
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.canvas.parentElement);
    this.resize();
  }

  spawnPaths(count) {
    for (let i = 0; i < count; i++) {
      this.paths.push({
        x1: Arvio.utils.rand(0, 1),
        y1: Arvio.utils.rand(0, 1),
        x2: Arvio.utils.rand(0, 1),
        y2: Arvio.utils.rand(0, 1),
        opacity: Arvio.utils.rand(0.1, 0.6),
        flickerSpeed: Arvio.utils.rand(0.02, 0.08),
        phase: Arvio.utils.rand(0, Math.PI * 2),
        blur: Arvio.utils.rand(0, 1)
      });
    }
  }

  populatePredictions() {
    const container = document.getElementById('uncertaintyPredictions');
    this.predictions.forEach((text, i) => {
      const el = document.createElement('div');
      el.className = 'uncertainty-pred';
      el.textContent = text;
      el.style.setProperty('--fade-duration', `${3 + Math.random() * 4}s`);
      el.style.setProperty('--fade-delay', `${i * 0.5}s`);
      el.style.setProperty('--fade-peak', `${0.3 + Math.random() * 0.5}`);
      container.appendChild(el);
    });
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

  draw() {
    const { ctx, width, height } = this;
    ctx.fillStyle = Arvio.utils.colors.void;
    ctx.fillRect(0, 0, width, height);

    this.paths.forEach(path => {
      const flicker = (Math.sin(this.time * path.flickerSpeed + path.phase) + 1) / 2;
      const opacity = path.opacity * flicker;

      ctx.beginPath();
      ctx.moveTo(path.x1 * width, path.y1 * height);
      ctx.lineTo(path.x2 * width, path.y2 * height);

      const blurAmount = path.blur * (1 - flicker);
      ctx.strokeStyle = `rgba(110, 231, 255, ${opacity * 0.5})`;
      ctx.lineWidth = 1;
      ctx.globalAlpha = opacity;
      ctx.stroke();

      if (blurAmount > 0.5) {
        ctx.strokeStyle = `rgba(167, 139, 250, ${opacity * 0.2})`;
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
    });

    for (let i = 0; i < 8; i++) {
      const x = Arvio.utils.rand(0, width);
      const y = Arvio.utils.rand(0, height);
      const flicker = Math.sin(this.time * 0.05 + i) > 0.5 ? 0.3 : 0;
      ctx.fillStyle = `rgba(230, 240, 255, ${flicker})`;
      ctx.font = '8px Space Grotesk, sans-serif';
      ctx.fillText('?', x, y);
    }
  }

  animate() {
    if (!this.running) return;
    this.time++;
    this.draw();
    requestAnimationFrame(() => this.animate());
  }

  destroy() {
    this.stop();
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }
};
