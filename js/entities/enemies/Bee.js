class Bee extends Enemy {
  constructor(x, y) {
    super(x, y, 18, 18, ENEMY.BEE);
    this.speed = 1.5;
    this.health = 1;
    this.scoreValue = 150;
    this.stompable = true;
    this.startY = y;
    this.flyAngle = Math.random() * Math.PI * 2;
    this.patrolLeft = x - 60;
    this.patrolRight = x + 60;
    this.dropChance = 0.1;
    this.canDamagePlayer = true;
    this.gravity = 0;
  }
  update(dt) {
    super.update(dt);
    if (this.isDead) return;
    this.flyAngle += 0.06;
    this.y = this.startY + Math.sin(this.flyAngle) * 15;
    this.vx = this.direction * this.speed;
    if (this.x < this.patrolLeft) this.direction = 1;
    if (this.x > this.patrolRight) this.direction = -1;
  }
  applyGravity() {}
  drawEnemySprite(ctx, sx, sy) {
    ctx.fillStyle = '#f5c842';
    ctx.fillRect(sx + 3, sy + 4, 12, 10);
    ctx.fillStyle = '#222';
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(sx + 5 + i * 4, sy + 5, 2, 8);
    }
    ctx.fillStyle = '#fff';
    ctx.fillRect(sx + 6, sy + 6, 3, 3);
    ctx.fillRect(sx + 11, sy + 6, 3, 3);
    ctx.fillStyle = '#222';
    ctx.fillRect(sx + 7, sy + 7, 2, 2);
    ctx.fillRect(sx + 12, sy + 7, 2, 2);
    const wingFlap = this.animationFrame % 2 === 0 ? 4 : 6;
    ctx.fillStyle = '#aaeeff';
    ctx.globalAlpha = 0.6;
    ctx.fillRect(sx - 2, sy - wingFlap + 4, 6, wingFlap);
    ctx.fillRect(sx + 14, sy - wingFlap + 4, 6, wingFlap);
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#222';
    ctx.fillRect(sx + 14, sy + 10, 3, 2);
  }
}
