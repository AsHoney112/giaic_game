class CanvasRenderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.width = CANVAS_WIDTH;
    this.height = CANVAS_HEIGHT;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.scale = 1;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }
  resize() {
    const container = this.canvas.parentElement;
    const maxW = window.innerWidth;
    const maxH = window.innerHeight;
    let w = Math.min(maxW, 800);
    let h = w * (CANVAS_HEIGHT / CANVAS_WIDTH);
    if (h > maxH) {
      h = maxH;
      w = h * (CANVAS_WIDTH / CANVAS_HEIGHT);
    }
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.scale = w / CANVAS_WIDTH;
  }
  clear(color = '#1a1a2e') {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }
  getCtx() { return this.ctx; }
}
