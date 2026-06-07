Arvio.Stream = class {
  constructor() {
    this.container = document.getElementById('streamContainer');
    this.left = document.getElementById('streamLeft');
    this.center = document.getElementById('streamCenter');
    this.right = document.getElementById('streamRight');
    this.pauseIndicator = document.getElementById('streamPauseIndicator');
    this.pausePath = document.getElementById('pausePath');
    this.fragments = this.generateFragments();
    this.init();
  }

  generateFragments() {
    const types = ['Scenario Fragment', 'Outcome Variation', 'Probability Line'];
    const scenarios = [
      'Quantum compute threshold crossed in distributed networks',
      'Demographic inversion accelerates in coastal megacities',
      'Carbon capture efficiency exceeds projection baseline',
      'Neural interface adoption reaches critical mass',
      'Supply chain reconfiguration via autonomous logistics',
      'Energy grid decentralization outpaces regulatory frameworks',
      'Synthetic biology applications enter consumer markets',
      'Geopolitical alignment shifts along resource corridors',
      'Atmospheric modeling reveals new oscillation patterns',
      'Labor automation redefines economic participation models',
      'Ocean thermal gradients unlock alternative energy pathways',
      'Social cohesion metrics diverge across digital divides',
      'Materials science breakthrough enables orbital manufacturing',
      'Predictive governance frameworks emerge in city-states',
      'Biodiversity corridors reshape continental migration flows'
    ];

    return scenarios.map((text, i) => ({
      type: types[i % types.length],
      text,
      prob: Arvio.utils.rand(0.12, 0.89)
    }));
  }

  createFragmentEl(fragment) {
    const el = document.createElement('div');
    el.className = 'stream-fragment';
    el.innerHTML = `
      <div class="stream-fragment__type">${fragment.type}</div>
      <div class="stream-fragment__text">${fragment.text}</div>
      <div class="stream-fragment__prob">P = ${Arvio.utils.formatProb(fragment.prob)}</div>
    `;

    el.addEventListener('mouseenter', () => this.pauseAt(fragment));
    el.addEventListener('mouseleave', () => this.resume());

    return el;
  }

  populateColumn(column, offset = 0) {
    const doubled = [...this.fragments, ...this.fragments];
    doubled.forEach((frag, i) => {
      if (i % 3 === offset) {
        column.appendChild(this.createFragmentEl(frag));
      }
    });
  }

  init() {
    this.populateColumn(this.left, 0);
    this.populateColumn(this.center, 1);
    this.populateColumn(this.right, 2);
  }

  pauseAt(fragment) {
    this.container.classList.add('paused');
    this.pauseIndicator.classList.add('active');
    this.pausePath.textContent = `${fragment.type}: ${fragment.text} [${Arvio.utils.formatProb(fragment.prob)}]`;
  }

  resume() {
    this.container.classList.remove('paused');
    this.pauseIndicator.classList.remove('active');
  }
};
