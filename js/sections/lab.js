Arvio.Lab = class {
  constructor() {
    this.grid = document.getElementById('labGrid');
    this.experiments = this.generateExperiments(6);
    this.init();
  }

  generateExperiments(count) {
    const inputs = [
      'Global temperature +1.5°C',
      'Population density 12k/km²',
      'Compute capacity 10^18 FLOPS',
      'Trade volume index 847',
      'Renewable penetration 68%',
      'Urbanization rate 78%'
    ];
    const variables = [
      'Carbon feedback coefficient',
      'Migration elasticity factor',
      'Algorithmic efficiency delta',
      'Supply chain redundancy',
      'Grid storage capacity',
      'Infrastructure decay rate'
    ];
    const results = [
      'Cascade probability: 0.73',
      'Equilibrium shift in 14 cycles',
      'Phase lock at λ = 0.61',
      'Volatility spike +340%',
      'Stabilization within 8 units',
      'Bifurcation detected at t+12'
    ];

    return Array.from({ length: count }, (_, i) => ({
      id: `EXP-${String(i + 1).padStart(4, '0')}`,
      input: inputs[i],
      variable: variables[i],
      result: results[i]
    }));
  }

  createExperiment(exp) {
    const el = document.createElement('div');
    el.className = 'lab-experiment';
    el.innerHTML = `
      <div class="lab-experiment__header">
        <span class="lab-experiment__id">${exp.id}</span>
        <span class="lab-experiment__status">RUNNING</span>
      </div>
      <div class="lab-field">
        <div class="lab-field__label">Input Condition</div>
        <div class="lab-field__value">${exp.input}</div>
      </div>
      <div class="lab-field">
        <div class="lab-field__label">Variable Change</div>
        <div class="lab-field__value">${exp.variable}</div>
      </div>
      <div class="lab-field">
        <div class="lab-field__label">Result Variation</div>
        <div class="lab-field__value lab-field__value--result">${exp.result}</div>
      </div>
    `;
    return el;
  }

  init() {
    this.experiments.forEach(exp => {
      this.grid.appendChild(this.createExperiment(exp));
    });
    setInterval(() => this.updateResults(), 5000);
  }

  updateResults() {
    const resultEls = this.grid.querySelectorAll('.lab-field__value--result');
    const variations = [
      'Cascade probability: 0.73',
      'Equilibrium shift in 14 cycles',
      'Phase lock at λ = 0.61',
      'Volatility spike +340%',
      'Stabilization within 8 units',
      'Bifurcation detected at t+12',
      'Convergence at P = 0.44',
      'Anomaly flagged: σ > 3.2',
      'Outcome stable across 10^4 runs'
    ];

    resultEls.forEach(el => {
      el.style.opacity = '0';
      setTimeout(() => {
        el.textContent = Arvio.utils.pick(variations);
        el.style.opacity = '1';
      }, 400);
    });
  }
};
