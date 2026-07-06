class ArcherGoblin extends Enemy {
  constructor(x, y) {
    super(x, y, 24, 28, ENEMY.ARCHER_GOBLIN);
    this.speed = 0.5;
    this.health = 2;
    this.scoreValue = 250;
    this.stompable = true;
    this.patrolLeft = x - 80;
    this.patrolRight = x + 80;
    this.dropChance = 0.3;
    this.shootCooldown = 0;
    this.arrows = [];
    this.activationRange = 300;
  }
  update(dt) {
    super.update(dt);
    if (this.isDead) return;
    const player = game ? game.player : null;
    if (!this.isPlayerNear(player)) return;
    this.vx = this.direction * this.speed;
    if (this.x < this.patrolLeft) this.direction = 1;
    if (this.x > this.patrolRight) this.direction = -1;
    if (this.shootCooldown > 0) this.shootCooldown--;
    if (this.shootCooldown <= 0 && player && Math.abs(player.x - this.x) < 300) {
      this.shootArrow(player);
      this.shootCooldown = 100 + Math.random() * 40;
    }
    for (let i = this.arrows.length - 1; i >= 0; i--) {
      const a = this.arrows[i];
      a.x += a.vx;
      a.y += a.vy;
      a.vy += 0.15;
      a.life--;
      if (a.life <= 0) { this.arrows.splice(i, 1); continue; }
      if (player && player.collidesWith({ x: a.x - 3, y: a.y - 3, w: 6, h: 6 })) {
        player.hit(1, a.x);
        this.arrows.splice(i, 1);
      }
    }
  }
  shootArrow(player) {
    const dx = player.centerX - this.centerX;
    const dy = player.centerY - this.centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    this.direction = dx > 0 ? 1 : -1;
    const arrow = {
      x: this.centerX + this.direction * 15,
      y: this.centerY - 4,
      vx: (dx / dist) * 4,
      vy: (dy / dist) * 4,
      life: 90
    };
    this.arrows.push(arrow);
    audio.playShoot();
  }
  render(ctx, camX, camY) {
    super.render(ctx, camX, camY);
    for (const a of this.arrows) {
      const ax = Math.round(a.x - camX);
      const ay = Math.round(a.y - camY);
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(ax - 1, ay - 1, 8, 3);
      ctx.fillStyle = '#aaa';
      ctx.fillRect(ax + 5, ay - 3, 2, 7);
    }
  }
  drawEnemySprite(ctx, sx, sy) {
    ctx.fillStyle = '#6b8e23';
    ctx.fillRect(sx + 2, sy + 2, 20, 24);
    ctx.fillStyle = '#556b2f';
    ctx.fillRect(sx + 2, sy + 8, 20, 10);
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(sx + 4, sy + 0, 4, 4);
    ctx.fillStyle = '#fff';
    const eyeX = this.direction === 1 ? 14 : 6;
    ctx.fillRect(sx + eyeX, sy + 5, 4, 3);
    ctx.fillStyle = '#222';
    ctx.fillRect(sx + eyeX + 1, sy + 6, 2, 2);
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(sx + 4, sy + 20, 4, 6);
    ctx.fillRect(sx + 16, sy + 20, 4, 6);
    ctx.fillStyle = '#556b2f';
    ctx.fillRect(sx + 18, sy + 6, 6, 12);
  }
  remove() {
    super.remove();
    this.arrows.length = 0;
  }
}
