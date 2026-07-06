class SpikeBeast extends Enemy {
  constructor(x, y) {
    super(x, y, 28, 24, ENEMY.SPIKE_BEAST);
    this.speed = 1.2;
    this.health = 3;
    this.scoreValue = 200;
    this.stompable = false;
    this.dropChance = 0.3;
    this.patrolLeft = x - 80;
    this.patrolRight = x + 80;
    this.canDamagePlayer = true;
  }
  update(dt) {
    super.update(dt);
    if (this.isDead) return;
    if (!this.isPlayerNear(game ? game.player : null)) return;
    this.vx = this.direction * this.speed;
    if (this.x < this.patrolLeft) this.direction = 1;
    if (this.x > this.patrolRight) this.direction = -1;
  }
  takeDamage(amount, fromX) {
    if (this.invincibleTimer > 0) return;
    this.health -= amount;
    this.flickerTimer = 15;
    this.invincibleTimer = 30;
    if (game) {
      game.particles.emitBurst(this.centerX, this.centerY, {
        count: 5, speed: 2, color: '#ff4444', lifetime: 15
      });
    }
    if (this.health <= 0) {
      this.die();
    }
  }
  drawEnemySprite(ctx, sx, sy) {
    ctx.fillStyle = '#665544';
    ctx.fillRect(sx + 2, sy + 4, 24, 16);
    ctx.fillStyle = '#887766';
    ctx.fillRect(sx + 4, sy + 6, 20, 12);
    ctx.fillStyle = '#443322';
    ctx.fillRect(sx + 4, sy + 8, 8, 8);
    ctx.fillRect(sx + 16, sy + 8, 8, 8);
    ctx.fillStyle = '#ff4444';
    ctx.fillRect(sx + 8, sy + 7, 3, 3);
    ctx.fillRect(sx + 17, sy + 7, 3, 3);
    ctx.fillStyle = '#222';
    ctx.fillRect(sx + 9, sy + 8, 2, 2);
    ctx.fillRect(sx + 18, sy + 8, 2, 2);
    ctx.fillStyle = '#887766';
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(sx + 4 + i * 10, sy - 2, 4, 6);
      ctx.fillRect(sx + 4 + i * 10, sy + 18, 4, 6);
    }
    ctx.fillStyle = '#665544';
    ctx.fillRect(sx + 4, sy + 18, 5, 5);
    ctx.fillRect(sx + 19, sy + 18, 5, 5);
  }
}
