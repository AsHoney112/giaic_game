class PlantMonster extends Enemy {
  constructor(x, y) {
    super(x, y, 24, 24, ENEMY.PLANT_MONSTER);
    this.speed = 0.3;
    this.health = 2;
    this.scoreValue = 250;
    this.stompable = true;
    this.dropChance = 0.3;
    this.shootCooldown = 0;
    this.poisonBalls = [];
    this.activationRange = 250;
    this.originalY = y;
    this.extended = false;
    this.extendTimer = 0;
  }
  update(dt) {
    super.update(dt);
    if (this.isDead) return;
    const player = game ? game.player : null;
    if (!this.isPlayerNear(player)) return;
    this.extendTimer += 0.02;
    this.y = this.originalY + Math.sin(this.extendTimer) * 5;
    if (this.shootCooldown > 0) this.shootCooldown--;
    if (this.shootCooldown <= 0 && player && Math.abs(player.x - this.x) < 250) {
      this.shootPoison(player);
      this.shootCooldown = 120;
    }
    for (let i = this.poisonBalls.length - 1; i >= 0; i--) {
      const pb = this.poisonBalls[i];
      pb.x += pb.vx;
      pb.y += pb.vy;
      pb.vy += 0.08;
      pb.life--;
      if (pb.life <= 0) { this.poisonBalls.splice(i, 1); continue; }
      pb.animTimer = (pb.animTimer || 0) + 1;
      if (player && player.collidesWith({ x: pb.x - 4, y: pb.y - 4, w: 8, h: 8 })) {
        player.hit(1, pb.x);
        this.poisonBalls.splice(i, 1);
      }
    }
  }
  shootPoison(player) {
    const angle = Math.atan2(player.centerY - this.centerY, player.centerX - this.centerX);
    const spd = 2.5;
    this.poisonBalls.push({
      x: this.centerX, y: this.centerY,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd,
      life: 80, animTimer: 0
    });
    audio.playShoot();
  }
  render(ctx, camX, camY) {
    super.render(ctx, camX, camY);
    for (const pb of this.poisonBalls) {
      const px = Math.round(pb.x - camX);
      const py = Math.round(pb.y - camY);
      const pulse = Math.sin(pb.animTimer * 0.2) * 0.2 + 0.8;
      ctx.save();
      ctx.translate(px, py);
      ctx.scale(pulse, pulse);
      ctx.fillStyle = '#44ff44';
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#88ff88';
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.globalAlpha = 1;
    }
  }
  drawEnemySprite(ctx, sx, sy) {
    ctx.fillStyle = '#5a8a3a';
    ctx.fillRect(sx + 2, sy + 8, 20, 14);
    ctx.fillStyle = '#4a7a2a';
    ctx.fillRect(sx + 4, sy + 10, 16, 10);
    ctx.fillStyle = '#3a6a1a';
    ctx.fillRect(sx + 2, sy + 4, 6, 8);
    ctx.fillRect(sx + 16, sy + 4, 6, 8);
    ctx.fillStyle = '#6a9a4a';
    ctx.fillRect(sx + 6, sy + 2, 4, 6);
    ctx.fillRect(sx + 14, sy + 2, 4, 6);
    ctx.fillStyle = '#ff4444';
    ctx.fillRect(sx + 8, sy + 12, 3, 3);
    ctx.fillRect(sx + 13, sy + 12, 3, 3);
    ctx.fillStyle = '#222';
    ctx.fillRect(sx + 9, sy + 13, 2, 2);
    ctx.fillRect(sx + 14, sy + 13, 2, 2);
    ctx.fillStyle = '#ff4444';
    ctx.fillRect(sx + 10, sy + 18, 4, 3);
  }
  remove() {
    super.remove();
    this.poisonBalls.length = 0;
  }
}
