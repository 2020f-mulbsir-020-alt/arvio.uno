Arvio.Contact = class {
  constructor() {
    this.dialog = document.getElementById('contactInterface');
    this.form = document.getElementById('contactForm');
    this.status = document.getElementById('contactStatus');
    this.closeBtn = document.getElementById('contactClose');
    this.init();
  }

  init() {
    this.closeBtn.addEventListener('click', () => this.close());
    this.dialog.addEventListener('click', (e) => {
      if (e.target === this.dialog) this.close();
    });

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.transmit();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.dialog.open) this.close();
    });
  }

  open() {
    this.dialog.showModal();
    this.status.textContent = '';
    document.getElementById('contactOrigin').focus();
  }

  close() {
    this.dialog.close();
  }

  transmit() {
    const origin = document.getElementById('contactOrigin').value.trim();
    const payload = document.getElementById('contactPayload').value.trim();

    if (!origin || !payload) return;

    this.status.textContent = 'ENCODING PAYLOAD...';

    setTimeout(() => {
      this.status.textContent = 'TRANSMITTING...';
    }, 600);

    setTimeout(() => {
      const hash = this.encodeSignal(origin, payload);
      this.status.textContent = `SIGNAL LOGGED // REF: ${hash}`;
      this.form.reset();
    }, 1400);
  }

  encodeSignal(origin, payload) {
    const raw = origin + payload + Date.now();
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = ((hash << 5) - hash) + raw.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).toUpperCase().slice(0, 8);
  }
};
