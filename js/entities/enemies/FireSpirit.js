class FireSpirit extends Enemy {
  constructor(x, y) {
    super(x, y, 24, 28, ENEMY.FIRE_SPIRIT);
    this.speed = 1.0;
    this.health = 3;
    this.scoreValue = 300;
    this.stompable = true;
    this.patrolLeft = x - 100;
    this.patrolRight = x + 100;
    this.dropChance = 0.4;
    this.shootCooldown = 0;
    this.fireballs = [];
    this.activationRange = 250;
    this.boss = false;
  }
  update(dt) {
    super.update(dt);
    if (this.isDead) return;
    const player = game ? game.player : null;
    if (!this.isPlayerNear(player)) return;
    this.flyAngle = (this.flyAngle || 0) + 0.03;
    this.y += Math.sin(this.flyAngle) * 0.5;
    this.vx = this.direction * this.speed;
    if (this.x < this.patrolLeft) this.direction = 1;
    if (this.x > this.patrolRight) this.direction = -1;
    if (this.shootCooldown > 0) this.shootCooldown--;
    if (this.shootCooldown <= 0 && player && Math.abs(player.x - this.x) < 250) {
      this.shootFireball(player);
      this.shootCooldown = 90;
    }
    for (let i = this.fireballs.length - 1; i >= 0; i--) {
      const fb = this.fireballs[i];
      fb.x += fb.vx;
      fb.y += fb.vy;
      fb.vy += 0.1;
      fb.life--;
      if (fb.life <= 0) { this.fireballs.splice(i, 1); continue; }
      if (player && player.collidesWith(fb.getRect())) {
        player.hit(1, fb.x);
        this.fireballs.splice(i, 1);
      }
    }
  }
  shootFireball(player) {
    const angle = Math.atan2(player.centerY - this.centerY, player.centerX - this.centerX);
    const fb = {
      x: this.centerX, y: this.centerY,
      vx: Math.cos(angle) * 3, vy: Math.sin(angle) * 3,
      life: 60,
      getRect() { return { x: this.x - 5, y: this.y - 5, w: 10, h: 10 }; }
    };
    this.fireballs.push(fb);
    audio.playShoot();
  }
  render(ctx, camX, camY) {
    super.render(ctx, camX, camY);
    for (const fb of this.fireballs) {
      ctx.fillStyle = '#ff4400';
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(Math.round(fb.x - camX), Math.round(fb.y - camY), 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#ffaa00';
      ctx.beginPath();
      ctx.arc(Math.round(fb.x - camX), Math.round(fb.y - camY), 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  drawEnemySprite(ctx, sx, sy) {
    const glow = Math.sin(this.animationTimer * 4) * 0.2 + 1;
    ctx.save();
    ctx.translate(sx + 12, sy + 14);
    ctx.scale(glow, glow);
    ctx.fillStyle = '#ff4400';
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ff8800';
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffcc00';
    ctx.beginPath();
    ctx.arc(0, -2, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.fillRect(-3, -4, 2, 2);
    ctx.fillRect(1, -4, 2, 2);
    ctx.restore();
  }
  remove() {
    super.remove();
    this.fireballs.length = 0;
  }
}
