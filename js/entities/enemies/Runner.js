class Runner extends Enemy {
  constructor(x, y) {
    super(x, y, 28, 26, ENEMY.RUNNER);
    this.speed = 3.5;
    this.health = 2;
    this.scoreValue = 200;
    this.stompable = true;
    this.activationRange = 250;
    this.chaseSpeed = 4.5;
    this.dropChance = 0.3;
    this.canBeDamaged = true;
  }
  update(dt) {
    super.update(dt);
    if (this.isDead) return;
    const player = game ? game.player : null;
    if (!player || !this.isPlayerNear(player)) return;
    const dist = player.x - this.x;
    if (Math.abs(dist) < this.activationRange) {
      this.direction = dist > 0 ? 1 : -1;
      this.vx = this.direction * this.chaseSpeed;
    } else {
      this.vx = this.direction * this.speed;
      if (this.x < this.patrolLeft) this.direction = 1;
      if (this.x > this.patrolRight) this.direction = -1;
    }
  }
  drawEnemySprite(ctx, sx, sy) {
    ctx.fillStyle = '#dd6622';
    ctx.fillRect(sx + 2, sy + 2, 24, 22);
    ctx.fillStyle = '#cc4400';
    ctx.fillRect(sx + 2, sy + 8, 24, 8);
    ctx.fillStyle = '#fff';
    const eyeX = this.direction === 1 ? 16 : 6;
    ctx.fillRect(sx + eyeX, sy + 5, 5, 4);
    ctx.fillStyle = '#222';
    ctx.fillRect(sx + eyeX + 1, sy + 6, 2, 2);
    ctx.fillStyle = '#bb5522';
    ctx.fillRect(sx + 4, sy + 18, 8, 6);
    ctx.fillRect(sx + 16, sy + 18, 8, 6);
    ctx.fillStyle = '#882200';
    ctx.fillRect(sx + 6, sy + 20, 4, 4);
    ctx.fillRect(sx + 18, sy + 20, 4, 4);
  }
}
