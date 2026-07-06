class Bat extends Enemy {
  constructor(x, y) {
    super(x, y, 20, 20, ENEMY.BAT);
    this.speed = 1.0;
    this.health = 1;
    this.scoreValue = 150;
    this.stompable = true;
    this.activationRange = 200;
    this.startY = y;
    this.flyAngle = Math.random() * Math.PI * 2;
    this.patrolLeft = x - 80;
    this.patrolRight = x + 80;
    this.dropChance = 0.15;
    this.canDamagePlayer = true;
    this.gravity = 0;
  }
  update(dt) {
    super.update(dt);
    if (this.isDead) return;
    const player = game ? game.player : null;
    if (!this.isPlayerNear(player)) return;
    this.flyAngle += 0.04;
    this.y = this.startY + Math.sin(this.flyAngle) * 20;
    this.vx = this.direction * this.speed;
    if (this.x < this.patrolLeft) this.direction = 1;
    if (this.x > this.patrolRight) this.direction = -1;
  }
  applyGravity() {}
  drawEnemySprite(ctx, sx, sy) {
    ctx.fillStyle = '#5533aa';
    ctx.fillRect(sx + 2, sy + 6, 16, 8);
    ctx.fillStyle = '#4422aa';
    ctx.fillRect(sx + 2, sy + 8, 16, 4);
    ctx.fillStyle = '#fff';
    ctx.fillRect(sx + (this.direction === 1 ? 12 : 4), sy + 7, 4, 3);
    ctx.fillStyle = '#222';
    ctx.fillRect(sx + (this.direction === 1 ? 13 : 5), sy + 8, 2, 2);
    const wingY = this.animationFrame % 2 === 0 ? -2 : 2;
    ctx.fillStyle = '#7766cc';
    ctx.fillRect(sx - 4, sy + wingY, 8, 6);
    ctx.fillRect(sx + 16, sy + wingY, 8, 6);
  }
}
