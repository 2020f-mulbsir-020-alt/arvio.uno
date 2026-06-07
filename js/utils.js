const Arvio = window.Arvio || {};

Arvio.utils = {
  colors: {
    void: '#0B0F1A',
    cyan: '#6EE7FF',
    bg: '#05070D',
    text: '#E6F0FF',
    violet: '#A78BFA',
    cyanDim: 'rgba(110, 231, 255, 0.15)',
    violetDim: 'rgba(167, 139, 250, 0.15)'
  },

  rand(min, max) {
    return min + Math.random() * (max - min);
  },

  randInt(min, max) {
    return Math.floor(this.rand(min, max + 1));
  },

  lerp(a, b, t) {
    return a + (b - a) * t;
  },

  clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  },

  resizeCanvas(canvas, ctx) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { width: rect.width, height: rect.height };
  },

  isInViewport(el, threshold = 0.1) {
    const rect = el.getBoundingClientRect();
    const h = window.innerHeight || document.documentElement.clientHeight;
    return rect.top < h * (1 - threshold) && rect.bottom > h * threshold;
  },

  formatProb(value) {
    return (value * 100).toFixed(1) + '%';
  },

  pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
};

window.Arvio = Arvio;
