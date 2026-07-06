class MiniBoss extends Enemy {
  constructor(x, y) {
    super(x, y, 48, 48, ENEMY.MINI_BOSS);
    this.health = 15;
    this.maxHealth = 15;
    this.scoreValue = 1000;
    this.stompable = true;
    this.boss = true;
    this.phase = 1;
    this.maxPhase = 2;
    this.attackCooldown = 0;
    this.attackPattern = 0;
    this.speed = 1.5;
    this.direction = -1;
    this.originalY = y;
    this.introTimer = 60;
    this.intro = true;
    this.spawnX = x;
    this.dropChance = 1;
    this.dropItems = [POWERUP.TREASURE_CHEST, POWERUP.KEY];
    this.canBeDamaged = true;
    this.jumpCooldown = 0;
    this.projectiles = [];
  }
  update(dt) {
    super.update(dt);
    if (this.isDead) return;
    if (this.intro) {
      this.introTimer--;
      this.y = this.originalY + Math.sin(this.introTimer * 0.2) * 3;
      if (this.introTimer <= 0) {
        this.intro = false;
        if (game) {
          game.camera.shake(8, 15);
          game.particles.emitBurst(this.centerX, this.bottom, {
            count: 20, speed: 4, color: '#ff8844', lifetime: 25
          });
        }
        audio.playBossRoar();
      }
      return;
    }
    const player = game ? game.player : null;
    if (!player) return;
    if (this.health < this.maxHealth * 0.5 && this.phase < 2) {
      this.phase = 2;
      this.speed = 2.5;
      this.attackCooldown = 0;
    }
    this.direction = player.x > this.x ? 1 : -1;
    if (this.attackCooldown > 0) this.attackCooldown--;
    if (this.jumpCooldown > 0) this.jumpCooldown--;
    if (this.attackCooldown <= 0) {
      this.attackPattern = (this.attackPattern + 1) % 3;
      this.attackCooldown = 60 + Math.random() * 60;
      switch (this.attackPattern) {
        case 0:
          this.vx = this.direction * this.speed * 3;
          break;
        case 1:
          this.jumpAttack();
          break;
        case 2:
          this.shootProjectile(player);
          break;
      }
    }
    const dist = Math.abs(player.x - this.x);
    if (dist > 150) {
      this.vx = this.direction * this.speed;
    } else {
      this.vx *= 0.9;
    }
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life <= 0) { this.projectiles.splice(i, 1); continue; }
      if (player && player.collidesWith({ x: p.x - 6, y: p.y - 6, w: 12, h: 12 })) {
        player.hit(1, p.x);
        this.projectiles.splice(i, 1);
      }
    }
  }
  jumpAttack() {
    if (!this.onGround || this.jumpCooldown > 0) return;
    this.vy = -8;
    this.vx = this.direction * this.speed * 2;
    this.jumpCooldown = 40;
  }
  shootProjectile(player) {
    const angle = Math.atan2(player.centerY - this.centerY, player.centerX - this.centerX);
    this.projectiles.push({
      x: this.centerX, y: this.centerY,
      vx: Math.cos(angle) * 3.5,
      vy: Math.sin(angle) * 3.5,
      life: 60
    });
    audio.playShoot();
  }
  takeDamage(amount, fromX) {
    if (this.intro || this.isDead) return;
    super.takeDamage(amount, fromX);
    if (this.health > 0 && game) game.camera.shake(4, 8);
  }
  die() {
    super.die();
    if (game) {
      game.camera.shake(12, 25);
      audio.playExplosion();
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          game.particles.emitBurst(
            this.x + Math.random() * this.w,
            this.y + Math.random() * this.h,
            { count: 15, speed: 5, color: '#ff8844', lifetime: 25 }
          );
        }, i * 200);
      }
    }
  }
  render(ctx, camX, camY) {
    if (!this.active) return;
    if (this.isDead) {
      ctx.globalAlpha = this.deathTimer / 30;
      ctx.fillStyle = '#ff8844';
      ctx.fillRect(Math.round(this.x - camX), Math.round(this.y - camY), this.w, this.h);
      ctx.globalAlpha = 1;
      return;
    }
    if (this.intro && this.introTimer > 30) {
      ctx.globalAlpha = 1 - (this.introTimer - 30) / 30;
    }
    const sx = Math.round(this.x - camX);
    const sy = Math.round(this.y - camY);
    ctx.save();
    if (this.flickerTimer > 0 && this.flickerTimer % 4 < 2) return;
    this.drawEnemySprite(ctx, sx, sy);
    ctx.restore();
    ctx.globalAlpha = 1;
    this.drawHealthBar(ctx);
    for (const p of this.projectiles) {
      ctx.fillStyle = '#ff4400';
      ctx.beginPath();
      ctx.arc(Math.round(p.x - camX), Math.round(p.y - camY), 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffaa00';
      ctx.beginPath();
      ctx.arc(Math.round(p.x - camX), Math.round(p.y - camY), 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  drawHealthBar(ctx) {
    const barW = 60;
    const barH = 6;
    const bx = this.x + this.w / 2 - barW / 2 - (game ? game.camera.getViewX() : 0);
    const by = this.y - 20 - (game ? game.camera.getViewY() : 0);
    ctx.fillStyle = '#333';
    ctx.fillRect(bx - 1, by - 1, barW + 2, barH + 2);
    ctx.fillStyle = '#ff4444';
    ctx.fillRect(bx, by, barW * (this.health / this.maxHealth), barH);
  }
  drawEnemySprite(ctx, sx, sy) {
    ctx.fillStyle = '#884422';
    ctx.fillRect(sx + 4, sy + 4, 40, 40);
    ctx.fillStyle = '#aa6633';
    ctx.fillRect(sx + 8, sy + 8, 32, 32);
    ctx.fillStyle = '#663311';
    ctx.fillRect(sx + 8, sy + 16, 32, 16);
    ctx.fillStyle = '#fff';
    ctx.fillRect(sx + 14, sy + 10, 6, 5);
    ctx.fillRect(sx + 26, sy + 10, 6, 5);
    ctx.fillStyle = '#222';
    ctx.fillRect(sx + 17, sy + 11, 3, 3);
    ctx.fillRect(sx + 28, sy + 11, 3, 3);
    ctx.fillStyle = '#ddaa00';
    ctx.fillRect(sx + 16, sy + 28, 4, 3);
    ctx.fillRect(sx + 28, sy + 28, 4, 3);
    ctx.fillStyle = '#884422';
    ctx.fillRect(sx + 4, sy + 36, 8, 8);
    ctx.fillRect(sx + 36, sy + 36, 8, 8);
    ctx.fillStyle = '#663311';
    ctx.fillRect(sx + 6, sy + 38, 4, 6);
    ctx.fillRect(sx + 38, sy + 38, 4, 6);
    ctx.fillStyle = '#ffcc00';
    ctx.fillRect(sx + 2, sy + 2, 6, 6);
    ctx.fillRect(sx + 40, sy + 2, 6, 6);
  }
  remove() {
    super.remove();
    this.projectiles.length = 0;
  }
}
