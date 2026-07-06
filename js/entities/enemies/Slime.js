class Slime extends Enemy {
  constructor(x, y) {
    super(x, y, 22, 18, ENEMY.SLIME);
    this.speed = 0.8;
    this.health = 1;
    this.scoreValue = 100;
    this.stompable = true;
    this.patrolLeft = x - 60;
    this.patrolRight = x + 60;
    this.dropChance = 0.15;
    this.jumpCooldown = 0;
    this.jumpForce = -6;
  }
  update(dt) {
    super.update(dt);
    if (this.isDead) return;
    if (!this.isPlayerNear(game ? game.player : null)) return;
    this.vx = this.direction * this.speed;
    if (this.jumpCooldown > 0) this.jumpCooldown--;
    if (this.onGround && this.jumpCooldown <= 0) {
      this.vy = this.jumpForce;
      this.jumpCooldown = 60 + Math.random() * 30;
    }
    if (this.x < this.patrolLeft) this.direction = 1;
    if (this.x > this.patrolRight) this.direction = -1;
  }
  drawEnemySprite(ctx, sx, sy) {
    const squish = this.vy < 0 ? 0.8 : 1.1;
    ctx.save();
    ctx.translate(sx + 11, sy + 18);
    ctx.scale(1, squish);
    ctx.fillStyle = '#44cc44';
    ctx.beginPath();
    ctx.arc(0, -9, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#33aa33';
    ctx.beginPath();
    ctx.arc(0, -5, 8, 0, Math.PI);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.fillRect(-4, -12, 3, 3);
    ctx.fillRect(2, -12, 3, 3);
    ctx.fillStyle = '#222';
    ctx.fillRect(-3, -11, 2, 2);
    ctx.fillRect(3, -11, 2, 2);
    ctx.restore();
  }
}
