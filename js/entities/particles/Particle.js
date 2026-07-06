class Particle extends Entity {
  constructor(x, y) {
    super(x, y, 4, 4);
    this.type = 'particle';
    this.lifetime = 30;
    this.maxLife = 30;
    this.color = '#fff';
    this.gravity = 0.05;
    this.fadeOut = true;
    this.shrink = true;
    this.startSize = 4;
    this.rotation = 0;
    this.rotSpeed = 0;
  }
  update(dt) {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.lifetime--;
    if (this.fadeOut) this.vx *= 0.98;
    this.rotation += this.rotSpeed;
    if (this.lifetime <= 0) this.remove();
  }
  render(ctx, camX, camY) {
    const sx = Math.round(this.x - camX);
    const sy = Math.round(this.y - camY);
    const alpha = this.fadeOut ? Math.max(0, this.lifetime / this.maxLife) : 1;
    const size = this.shrink ? this.startSize * alpha : this.startSize;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(sx, sy);
    ctx.rotate(this.rotation);
    ctx.fillStyle = this.color;
    ctx.fillRect(-size / 2, -size / 2, size, size);
    ctx.restore();
    ctx.globalAlpha = 1;
  }
}
