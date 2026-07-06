class Ghost extends Enemy {
  constructor(x, y) {
    super(x, y, 22, 28, ENEMY.GHOST);
    this.speed = 1.0;
    this.health = 2;
    this.scoreValue = 300;
    this.stompable = true;
    this.dropChance = 0.3;
    this.activationRange = 120;
    this.deactivationRange = 250;
    this.visible = false;
    this.fadeAlpha = 0;
    this.patrolLeft = x - 60;
    this.patrolRight = x + 60;
    this.chaseSpeed = 2.0;
    this.gravity = 0;
  }
  update(dt) {
    super.update(dt);
    if (this.isDead) return;
    const player = game ? game.player : null;
    if (!player) return;
    const dist = Math.abs(player.x - this.x);
    this.visible = dist < this.activationRange;
    if (this.visible) {
      this.fadeAlpha = Math.min(1, this.fadeAlpha + 0.05);
      this.direction = player.x > this.x ? 1 : -1;
      this.vx = this.direction * this.chaseSpeed;
      const baseY = this.spawnY + Math.sin(this.animationTimer * 3) * 15;
      this.y += (baseY - this.y) * 0.05;
    } else {
      this.fadeAlpha = Math.max(0, this.fadeAlpha - 0.03);
      this.vx = this.direction * this.speed * 0.3;
      if (this.x < this.patrolLeft) this.direction = 1;
      if (this.x > this.patrolRight) this.direction = -1;
    }
  }
  applyGravity() {}
  render(ctx, camX, camY) {
    if (!this.active) return;
    if (this.isDead) {
      ctx.globalAlpha = this.deathTimer / 30;
      ctx.fillStyle = '#aa88ff';
      ctx.fillRect(Math.round(this.x - camX), Math.round(this.y - camY), this.w, this.h);
      ctx.globalAlpha = 1;
      return;
    }
    if (this.fadeAlpha <= 0 && !this.visible) return;
    if (this.flickerTimer > 0 && this.flickerTimer % 4 < 2) return;
    ctx.save();
    ctx.globalAlpha = this.fadeAlpha * 0.7;
    const sx = Math.round(this.x - camX);
    const sy = Math.round(this.y - camY);
    ctx.fillStyle = '#aa88ff';
    ctx.beginPath();
    ctx.arc(sx + 11, sy + 10, 11, Math.PI, 0);
    ctx.lineTo(sx + 22, sy + 28);
    ctx.lineTo(sx + 16, sy + 24);
    ctx.lineTo(sx + 11, sy + 28);
    ctx.lineTo(sx + 6, sy + 24);
    ctx.lineTo(sx, sy + 28);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ccc';
    ctx.globalAlpha = this.fadeAlpha;
    ctx.fillRect(sx + 7, sy + 8, 4, 4);
    ctx.fillRect(sx + 13, sy + 8, 4, 4);
    ctx.fillStyle = '#222';
    ctx.fillRect(sx + 8, sy + 9, 2, 2);
    ctx.fillRect(sx + 14, sy + 9, 2, 2);
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  drawEnemySprite(ctx, sx, sy) {}
}
