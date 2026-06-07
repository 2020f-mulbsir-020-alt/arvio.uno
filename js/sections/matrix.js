Arvio.Matrix = class {
  constructor() {
    this.grid = document.getElementById('matrixGrid');
    this.countEl = document.getElementById('matrixCount');
    this.states = this.generateStates(12);
    this.init();
  }

  generateStates(count) {
    const prefixes = ['ALPHA', 'BETA', 'GAMMA', 'DELTA', 'EPSILON', 'ZETA'];
    const conditions = [
      'Equilibrium cascade',
      'Volatile convergence',
      'Stable divergence',
      'Threshold oscillation',
      'Emergent symmetry',
      'Phase transition',
      'Latent potential',
      'Critical instability',
      'Harmonic resonance',
      'Stochastic drift',
      'Deterministic chaos',
      'Quantum superposition'
    ];

    return Array.from({ length: count }, (_, i) => ({
      id: `${Arvio.utils.pick(prefixes)}-${String(i + 1).padStart(3, '0')}`,
      state: conditions[i % conditions.length],
      prob: Arvio.utils.rand(0.05, 0.95)
    }));
  }

  createFrame(state) {
    const frame = document.createElement('div');
    frame.className = 'matrix-frame';
    frame.innerHTML = `
      <div class="matrix-frame__id">${state.id}</div>
      <div class="matrix-frame__state">${state.state}</div>
      <div class="matrix-frame__prob">${Arvio.utils.formatProb(state.prob)}</div>
    `;

    frame.addEventListener('click', () => this.interact(frame));
    return frame;
  }

  interact(clicked) {
    const frames = [...this.grid.querySelectorAll('.matrix-frame')];
    const wasExpanded = clicked.classList.contains('expanded');

    frames.forEach(f => f.classList.remove('expanded', 'collapsed'));

    if (!wasExpanded) {
      clicked.classList.add('expanded');
      frames.forEach(f => {
        if (f !== clicked) f.classList.add('collapsed');
      });
    }

    this.rearrange();
  }

  rearrange() {
    const frames = [...this.grid.querySelectorAll('.matrix-frame')];
    frames.forEach((frame, i) => {
      frame.style.order = wasShuffled(i);
    });
  }

  init() {
    this.states.forEach(state => {
      this.grid.appendChild(this.createFrame(state));
    });
    this.countEl.textContent = this.states.length;
    setInterval(() => this.pulse(), 4000);
  }

  pulse() {
    const frames = [...this.grid.querySelectorAll('.matrix-frame:not(.expanded)')];
    if (frames.length === 0) return;
    const frame = Arvio.utils.pick(frames);
    frame.style.transform = 'scale(1.02)';
    setTimeout(() => {
      if (!frame.classList.contains('expanded')) {
        frame.style.transform = '';
      }
    }, 600);
  }
};

function wasShuffled(index) {
  return Math.floor(Math.random() * 20) + index;
}
