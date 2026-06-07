(function () {
  'use strict';

  const modules = {};
  const canvasSections = {};

  function initLens() {
    const trigger = document.getElementById('lensTrigger');
    const menu = document.getElementById('radialMenu');

    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', !expanded);
      menu.hidden = expanded;
    });

    document.addEventListener('click', (e) => {
      if (!trigger.contains(e.target) && !menu.contains(e.target)) {
        trigger.setAttribute('aria-expanded', 'false');
        menu.hidden = true;
      }
    });

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        if (link.hasAttribute('data-contact')) {
          e.preventDefault();
          modules.contact.open();
        }
        trigger.setAttribute('aria-expanded', 'false');
        menu.hidden = true;
      });
    });
  }

  function initSections() {
    modules.stream = new Arvio.Stream();
    modules.matrix = new Arvio.Matrix();
    modules.lab = new Arvio.Lab();
    modules.contact = new Arvio.Contact();

    canvasSections.field = new Arvio.Field(document.getElementById('fieldCanvas'));
    canvasSections.timeline = new Arvio.Timeline(document.getElementById('timelineCanvas'));
    canvasSections.corridor = new Arvio.Corridor(document.getElementById('corridorCanvas'));
    canvasSections.core = new Arvio.Core(document.getElementById('coreCanvas'));
    canvasSections.map = new Arvio.Map(document.getElementById('mapCanvas'));
    canvasSections.uncertainty = new Arvio.Uncertainty(document.getElementById('uncertaintyCanvas'));
    canvasSections.projection = new Arvio.Projection(document.getElementById('sphereCanvas'));
  }

  function initVisibilityObserver() {
    const sectionMap = {
      'probability-field': 'field',
      'timeline-brancher': 'timeline',
      'signal-corridor': 'corridor',
      'prediction-core': 'core',
      'future-map': 'map',
      'uncertainty-zone': 'uncertainty',
      'final-projection': 'projection'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const key = sectionMap[entry.target.id];
        if (!key || !canvasSections[key]) return;

        if (entry.isIntersecting) {
          canvasSections[key].start();
        } else {
          canvasSections[key].stop();
        }
      });
    }, { threshold: 0.15, rootMargin: '50px' });

    Object.keys(sectionMap).forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }

  function init() {
    initLens();
    initSections();
    initVisibilityObserver();

    canvasSections.field.start();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
