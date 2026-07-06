class PowerUp extends Entity {
  constructor(x, y, type) {
    super(x, y, 24, 24);
    this.type = type;
    this.powerUpType = type;
    this.collected = false;
    this.bobTimer = 0;
    this.spawnTime = 0;
    this.glowAlpha = 0;
  }
  update(dt) {
    if (this.collected) return;
    this.bobTimer += 0.05;
    this.spawnTime += dt;
    this.glowAlpha = 0.3 + Math.sin(this.spawnTime * 3) * 0.15;
  }
  render(ctx, camX, camY) {
    if (this.collected) return;
    const sx = Math.round(this.x - camX);
    const sy = Math.round(this.y - camY + Math.sin(this.bobTimer) * 3);
    const s = MathUtils.clamp(1 + Math.sin(this.bobTimer * 2) * 0.05, 0.8, 1.2);
    ctx.save();
    ctx.translate(sx + 12, sy + 12);
    ctx.scale(s, s);
    ctx.globalAlpha = this.glowAlpha * 0.5;
    ctx.fillStyle = this._getColor();
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    this._drawIcon(ctx);
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  _getColor() {
    const colors = {
      coin: '#ffd700', gem: '#00ffff', heart: '#ff4444',
      shield: '#4488ff', speedBoots: '#44ff44', doubleDamage: '#ff8800',
      invincibility: '#ffff00', extraLife: '#ff44ff', key: '#ffaa00',
      treasureChest: '#8B4513'
    };
    return colors[this.powerUpType] || '#fff';
  }
  _drawIcon(ctx) {
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const icons = {
      coin: 'C', gem: 'G', heart: 'H', shield: 'S',
      speedBoots: '>', doubleDamage: 'D', invincibility: '*',
      extraLife: '+', key: 'K', treasureChest: 'T'
    };
    ctx.fillText(icons[this.powerUpType] || '?', 0, 1);
  }
  getRect() { return { x: this.x - 4, y: this.y - 4, w: this.w + 8, h: this.h + 8 }; }
}
