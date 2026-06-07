Arvio.Timeline = class {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.branches = [];
    this.depth = 0;
    this.activeBranch = null;
    this.running = false;
    this.time = 0;
    this.branchData = {
      economic: { color: '#6EE7FF', label: 'Economic Shift', desc: 'Capital flows restructure around predictive commodity indices. Traditional market signals decouple from outcome probabilities.' },
      social: { color: '#A78BFA', label: 'Social Change', desc: 'Collective behavior models reveal emergent consensus patterns. Cultural evolution accelerates through networked simulation.' },
      technological: { color: '#34D399', label: 'Technological Evolution', desc: 'Convergence points detected across multiple innovation vectors. Exponential curves intersect at previously unmodeled thresholds.' },
      environmental: { color: '#FBBF24', label: 'Environmental Outcome', desc: 'Ecological feedback loops generate non-linear response surfaces. Climate trajectories branch beyond current resolution limits.' }
    };
    this.init();
  }

  init() {
    this.generateBranches();
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.canvas.parentElement);
    this.resize();
    this.setupInteraction();
  }

  generateBranches() {
    const types = ['economic', 'social', 'technological', 'environmental'];
    types.forEach((type, i) => {
      this.branches.push({
        type,
        nodes: this.generatePath(i),
        progress: 0,
        depth: 0,
        children: []
      });
    });
  }

  generatePath(seed) {
    const nodes = [{ x: 0, y: 0.5 }];
    let y = 0.5;
    const segments = 8 + seed * 2;

    for (let i = 1; i <= segments; i++) {
      const t = i / segments;
      y += Arvio.utils.rand(-0.08, 0.08);
      y = Arvio.utils.clamp(y, 0.1, 0.9);
      nodes.push({ x: t, y });
    }
    return nodes;
  }

  resize() {
    const dims = Arvio.utils.resizeCanvas(this.canvas, this.ctx);
    this.width = dims.width;
    this.height = dims.height;
  }

  setupInteraction() {
    this.canvas.addEventListener('click', (e) => this.handleClick(e));
    this.canvas.style.cursor = 'crosshair';

    document.querySelectorAll('.legend-item').forEach(item => {
      item.addEventListener('click', () => {
        const type = item.dataset.branch;
        this.followBranch(type);
        document.querySelectorAll('.legend-item').forEach(el => el.classList.remove('active'));
        item.classList.add('active');
      });
    });
  }

  handleClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    let closest = null;
    let minDist = Infinity;

    this.branches.forEach(branch => {
      branch.nodes.forEach(node => {
        const dx = node.x - x;
        const dy = node.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDist && dist < 0.08) {
          minDist = dist;
          closest = branch;
        }
      });
    });

    if (closest) this.followBranch(closest.type);
  }

  followBranch(type) {
    const branch = this.branches.find(b => b.type === type);
    if (!branch) return;

    this.activeBranch = type;
    this.depth = Math.min(this.depth + 1, 5);
    document.getElementById('depthValue').textContent = this.depth;

    const detail = document.getElementById('branchDetail');
    const data = this.branchData[type];
    document.getElementById('branchTitle').textContent = data.label + ` // L${this.depth}`;
    document.getElementById('branchDesc').textContent = data.desc;
    detail.hidden = false;

    if (this.depth < 5) {
      const childPath = this.generatePath(this.branches.length);
      branch.children.push({ nodes: childPath, depth: this.depth });
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

  draw() {
    const { ctx, width, height } = this;
    ctx.fillStyle = Arvio.utils.colors.void;
    ctx.fillRect(0, 0, width, height);

    const marginX = 60;
    const usableW = width - marginX * 2;

    this.branches.forEach((branch, bi) => {
      const data = this.branchData[branch.type];
      const isActive = this.activeBranch === branch.type;
      const offsetY = (bi - 1.5) * 30;

      ctx.beginPath();
      branch.nodes.forEach((node, i) => {
        const px = marginX + node.x * usableW;
        const py = height * node.y + offsetY;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });

      ctx.strokeStyle = data.color;
      ctx.globalAlpha = isActive ? 0.9 : 0.35;
      ctx.lineWidth = isActive ? 2 : 1;
      ctx.stroke();

      branch.nodes.forEach((node, i) => {
        if (i > 0 && i % 3 === 0) {
          const px = marginX + node.x * usableW;
          const py = height * node.y + offsetY;
          const splitAngle = Arvio.utils.rand(-0.5, 0.5);
          const splitLen = 20 + Math.sin(this.time * 0.02 + i) * 5;

          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px + splitLen, py + splitLen * splitAngle);
          ctx.strokeStyle = data.color;
          ctx.globalAlpha = 0.2;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });

      branch.children.forEach(child => {
        ctx.beginPath();
        child.nodes.forEach((node, i) => {
          const px = marginX + node.x * usableW;
          const py = height * node.y + offsetY + child.depth * 15;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.strokeStyle = data.color;
        ctx.globalAlpha = 0.5;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      ctx.globalAlpha = 1;
    });

    ctx.fillStyle = 'rgba(110, 231, 255, 0.5)';
    ctx.beginPath();
    ctx.arc(marginX, height / 2, 4, 0, Math.PI * 2);
    ctx.fill();
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
