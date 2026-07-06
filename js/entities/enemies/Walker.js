class Walker extends Enemy {
  constructor(x, y) {
    super(x, y, 24, 24, ENEMY.WALKER);
    this.speed = 1.2;
    this.health = 1;
    this.direction = -1;
    this.scoreValue = 100;
    this.patrolLeft = x - 64;
    this.patrolRight = x + 64;
    this.stompable = true;
    this.dropChance = 0.2;
  }
  update(dt) {
    super.update(dt);
    if (this.isDead) return;
    if (!this.isPlayerNear(game ? game.player : null)) return;
    this.vx = this.direction * this.speed;
    if (this.x < this.patrolLeft) this.direction = 1;
    if (this.x > this.patrolRight) this.direction = -1;
  }
  drawEnemySprite(ctx, sx, sy) {
    ctx.fillStyle = '#cc4444';
    ctx.fillRect(sx + 2, sy + 2, 20, 20);
    ctx.fillStyle = '#882222';
    ctx.fillRect(sx + 2, sy + 8, 20, 8);
    ctx.fillStyle = '#fff';
    const eyeX = this.direction === 1 ? 14 : 6;
    ctx.fillRect(sx + eyeX, sy + 5, 4, 4);
    ctx.fillStyle = '#222';
    ctx.fillRect(sx + eyeX + 1, sy + 6, 2, 2);
    ctx.fillStyle = '#aa3333';
    ctx.fillRect(sx + 4, sy + 18, 6, 6);
    ctx.fillRect(sx + 14, sy + 18, 6, 6);
  }
}
