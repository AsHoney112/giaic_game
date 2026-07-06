class RollingRock extends Enemy {
  constructor(x, y) {
    super(x, y, 28, 28, ENEMY.ROLLING_ROCK);
    this.speed = 2.5;
    this.health = 3;
    this.scoreValue = 250;
    this.stompable = false;
    this.dropChance = 0.2;
    this.activationRange = 300;
    this.canDamagePlayer = true;
    this.rolling = false;
    this.originalX = x;
    this.originalY = y;
    this.activeRange = 200;
  }
  update(dt) {
    super.update(dt);
    if (this.isDead) return;
    const player = game ? game.player : null;
    if (!player) return;
    const dist = player.x - this.x;
    if (!this.rolling && Math.abs(dist) < this.activeRange && player.y > this.y - 10) {
      this.rolling = true;
      this.direction = dist > 0 ? 1 : -1;
    }
    if (this.rolling) {
      this.vx = this.direction * this.speed;
      this.vy += GRAVITY;
      if (this.vy > MAX_FALL_SPEED) this.vy = MAX_FALL_SPEED;
    } else {
      this.vx = 0;
      this.vy = 0;
    }
    if (this.onGround && this.rolling) {
      this.vx *= 0.98;
      if (Math.abs(this.vx) < 0.5) this.rolling = false;
    }
  }
  drawEnemySprite(ctx, sx, sy) {
    const rot = this.vx * this.animationTimer;
    ctx.save();
    ctx.translate(sx + 14, sy + 14);
    ctx.rotate(rot);
    ctx.fillStyle = '#888';
    ctx.beginPath();
    ctx.arc(0, 0, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#666';
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#999';
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#555';
    ctx.fillRect(-2, -13, 4, 5);
    ctx.fillRect(-2, 8, 4, 5);
    ctx.fillRect(-13, -2, 5, 4);
    ctx.fillRect(8, -2, 5, 4);
    ctx.restore();
  }
}
