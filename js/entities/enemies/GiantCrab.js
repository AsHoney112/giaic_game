class GiantCrab extends Enemy {
  constructor(x, y) {
    super(x, y, 36, 24, ENEMY.GIANT_CRAB);
    this.speed = 1.5;
    this.health = 3;
    this.scoreValue = 300;
    this.stompable = true;
    this.patrolLeft = x - 80;
    this.patrolRight = x + 80;
    this.dropChance = 0.35;
    this.activationRange = 200;
    this.originalY = y;
  }
  update(dt) {
    super.update(dt);
    if (this.isDead) return;
    if (!this.isPlayerNear(game ? game.player : null)) return;
    this.vx = this.direction * this.speed;
    if (this.x < this.patrolLeft) this.direction = 1;
    if (this.x > this.patrolRight) this.direction = -1;
    if (this.onGround) {
      this.originalY = this.y;
    }
  }
  drawEnemySprite(ctx, sx, sy) {
    ctx.fillStyle = '#aa4444';
    ctx.fillRect(sx + 2, sy + 4, 32, 16);
    ctx.fillStyle = '#cc6666';
    ctx.fillRect(sx + 4, sy + 6, 28, 12);
    ctx.fillStyle = '#882222';
    ctx.fillRect(sx + 6, sy + 8, 8, 8);
    ctx.fillRect(sx + 22, sy + 8, 8, 8);
    ctx.fillStyle = '#fff';
    ctx.fillRect(sx + 12, sy + 8, 4, 3);
    ctx.fillRect(sx + 22, sy + 8, 4, 3);
    ctx.fillStyle = '#222';
    ctx.fillRect(sx + 13, sy + 9, 2, 2);
    ctx.fillRect(sx + 23, sy + 9, 2, 2);
    ctx.fillStyle = '#882222';
    ctx.fillRect(sx - 4, sy + 6, 8, 6);
    ctx.fillRect(sx + 32, sy + 6, 8, 6);
    ctx.fillStyle = '#aa4444';
    ctx.fillRect(sx - 2, sy + 8, 6, 4);
    ctx.fillRect(sx + 32, sy + 8, 6, 4);
    ctx.fillStyle = '#aa4444';
    ctx.fillRect(sx + 2, sy + 20, 6, 4);
    ctx.fillRect(sx + 10, sy + 20, 6, 4);
    ctx.fillRect(sx + 20, sy + 20, 6, 4);
    ctx.fillRect(sx + 28, sy + 20, 6, 4);
  }
}
