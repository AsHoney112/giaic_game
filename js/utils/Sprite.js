class Sprite {
  constructor(w, h, color, outlineColor = null) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = w;
    this.canvas.height = h;
    this.ctx = this.canvas.getContext('2d');
    this.w = w;
    this.h = h;
    if (color) this.fill(color, outlineColor);
  }
  fill(color, outlineColor) {
    const ctx = this.ctx;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, this.w, this.h);
    if (outlineColor) {
      ctx.strokeStyle = outlineColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(0.5, 0.5, this.w - 1, this.h - 1);
    }
  }
  setPixel(x, y, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, 1, 1);
  }
  drawRect(x, y, w, h, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, w, h);
  }
  drawCircle(cx, cy, r, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
    this.ctx.fill();
  }
  drawTriangle(x1, y1, x2, y2, x3, y3, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.lineTo(x3, y3);
    this.ctx.closePath();
    this.ctx.fill();
  }
}

const SpriteAtlas = {
  _cache: {},
  get(key, w, h, drawFn) {
    if (!this._cache[key]) {
      const s = new Sprite(w, h);
      drawFn(s);
      this._cache[key] = s.canvas;
    }
    return this._cache[key];
  },
  clear() { this._cache = {}; }
};
