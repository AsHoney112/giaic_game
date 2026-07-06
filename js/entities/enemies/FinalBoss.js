class FinalBoss extends Enemy {
  constructor(x, y) {
    super(x, y, 64, 64, ENEMY.FINAL_BOSS);
    this.health = 50;
    this.maxHealth = 50;
    this.scoreValue = 5000;
    this.stompable = false;
    this.boss = true;
    this.phase = 1;
    this.maxPhase = 3;
    this.attackCooldown = 0;
    this.attackPattern = 0;
    this.speed = 1.0;
    this.direction = -1;
    this.originalY = y;
    this.introTimer = 90;
    this.intro = true;
    this.canBeDamaged = true;
    this.canDamagePlayer = true;
    this.damage = 2;
    this.projectiles = [];
    this.summonTimer = 0;
    this.teleportCooldown = 0;
    this.weakPointVisible = false;
    this.weakPointTimer = 0;
    this.weakPoints = [];
    this.vulnerable = false;
  }
  update(dt) {
    super.update(dt);
    if (this.isDead) return;
    if (this.intro) {
      this.introTimer--;
      this.y = this.originalY + Math.sin(this.introTimer * 0.15) * 5;
      if (this.introTimer <= 0) {
        this.intro = false;
        if (game) {
          game.camera.shake(15, 30);
          game.particles.emitBurst(this.centerX, this.bottom, {
            count: 30, speed: 5, color: '#ff0000', lifetime: 30
          });
          game.particles.emitBurst(this.centerX, this.y, {
            count: 20, speed: 4, color: '#ffaa00', lifetime: 25
          });
        }
        audio.playBossRoar();
        audio.playBossRoar();
      }
      return;
    }
    const player = game ? game.player : null;
    if (!player) return;
    if (this.health < this.maxHealth * 0.66 && this.phase < 2) {
      this.phase = 2;
      this.speed = 1.5;
      this.attackCooldown = 0;
      audio.playBossRoar();
    }
    if (this.health < this.maxHealth * 0.33 && this.phase < 3) {
      this.phase = 3;
      this.speed = 2.0;
      this.attackCooldown = 0;
      this.damage = 3;
      audio.playBossRoar();
    }
    this.direction = player.x > this.x ? 1 : -1;
    if (this.attackCooldown > 0) this.attackCooldown--;
    if (this.weakPointTimer > 0) {
      this.weakPointTimer--;
      this.vulnerable = true;
    } else {
      this.vulnerable = false;
    }
    if (this.teleportCooldown > 0) this.teleportCooldown--;
    if (this.attackCooldown <= 0) {
      this.attackPattern = (this.attackPattern + 1) % 4;
      this.attackCooldown = 80 + Math.random() * 40;
      switch (this.attackPattern) {
        case 0:
          this.chargeAttack(player);
          break;
        case 1:
          this.spreadShot(player);
          break;
        case 2:
          this.teleport(player);
          break;
        case 3:
          this.summonMinions();
          break;
      }
    }
    const dist = Math.abs(player.x - this.x);
    if (dist > 200) {
      this.vx = this.direction * this.speed;
    } else {
      this.vx *= 0.95;
    }
    this.weakPointVisible = this.vulnerable;
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life <= 0) { this.projectiles.splice(i, 1); continue; }
      if (player && player.collidesWith({ x: p.x - 8, y: p.y - 8, w: 16, h: 16 })) {
        player.hit(this.phase, p.x);
        this.projectiles.splice(i, 1);
      }
    }
  }
  chargeAttack(player) {
    this.vx = this.direction * this.speed * 4;
    if (game) {
      game.camera.shake(4, 10);
      game.particles.emitLine(this.x, this.bottom, this.x + this.direction * 60, this.bottom, {
        count: 8, speed: 1, color: '#ff4444', lifetime: 15
      });
    }
  }
  spreadShot(player) {
    const baseAngle = Math.atan2(player.centerY - this.centerY, player.centerX - this.centerX);
    for (let i = -2; i <= 2; i++) {
      const angle = baseAngle + i * 0.25;
      this.projectiles.push({
        x: this.centerX, y: this.centerY,
        vx: Math.cos(angle) * (3 + this.phase * 0.5),
        vy: Math.sin(angle) * (3 + this.phase * 0.5),
        life: 60
      });
    }
    audio.playShoot();
  }
  teleport(player) {
    if (this.teleportCooldown > 0) return;
    if (game) {
      game.particles.emitBurst(this.centerX, this.centerY, {
        count: 15, speed: 4, color: '#aa44ff', lifetime: 20
      });
    }
    const newX = player.x + (Math.random() > 0.5 ? 100 : -100);
    const newY = player.y - 80;
    this.x = MathUtils.clamp(newX, 50, 2000);
    this.y = MathUtils.clamp(newY, 50, 300);
    this.vx = 0;
    this.vy = 0;
    this.teleportCooldown = 120;
    if (game) {
      game.camera.shake(6, 12);
      game.particles.emitBurst(this.centerX, this.centerY, {
        count: 15, speed: 4, color: '#aa44ff', lifetime: 20
      });
    }
  }
  summonMinions() {
    if (!game) return;
    for (let i = 0; i < 2 + this.phase; i++) {
      const ex = this.x + (Math.random() - 0.5) * 100;
      const ey = this.y + 50;
      const walker = new Walker(ex, ey);
      walker.activationRange = 400;
      game.enemies.push(walker);
    }
    game.particles.emitBurst(this.centerX, this.bottom, {
      count: 10, speed: 3, color: '#ff66aa', lifetime: 20
    });
  }
  takeDamage(amount, fromX) {
    if (this.intro || this.isDead) return;
    if (!this.vulnerable && this.phase < 3) {
      return;
    }
    super.takeDamage(amount, fromX);
    if (this.health > 0 && game) game.camera.shake(6, 12);
    this.vulnerable = false;
    this.weakPointTimer = 0;
  }
  die() {
    super.die();
    if (game) {
      game.camera.shake(20, 40);
      audio.playExplosion();
      audio.playVictory();
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          game.particles.emitBurst(
            this.x + Math.random() * this.w, this.y + Math.random() * this.h,
            { count: 20, speed: 6, color: '#ff4444', lifetime: 30 }
          );
          game.particles.emitBurst(
            this.x + Math.random() * this.w, this.y + Math.random() * this.h,
            { count: 15, speed: 5, color: '#ffaa00', lifetime: 25 }
          );
        }, i * 300);
      }
      setTimeout(() => {
        game.particles.emitBurst(this.centerX, this.centerY, {
          count: 40, speed: 8, color: '#ffd700', lifetime: 40
        });
      }, 1500);
      if (game.player) game.player.score += this.scoreValue;
    }
  }
  render(ctx, camX, camY) {
    if (!this.active) return;
    if (this.isDead) {
      ctx.globalAlpha = this.deathTimer / 30;
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(Math.round(this.x - camX), Math.round(this.y - camY), this.w, this.h);
      ctx.globalAlpha = 1;
      return;
    }
    if (this.intro && this.introTimer > 45) {
      ctx.globalAlpha = 1 - (this.introTimer - 45) / 45;
    }
    const sx = Math.round(this.x - camX);
    const sy = Math.round(this.y - camY);
    ctx.save();
    this.drawEnemySprite(ctx, sx, sy);
    ctx.restore();
    ctx.globalAlpha = 1;
    this.drawHealthBar(ctx);
    for (const p of this.projectiles) {
      ctx.fillStyle = '#ff0044';
      ctx.beginPath();
      ctx.arc(Math.round(p.x - camX), Math.round(p.y - camY), 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ff4488';
      ctx.beginPath();
      ctx.arc(Math.round(p.x - camX), Math.round(p.y - camY), 4, 0, Math.PI * 2);
      ctx.fill();
    }
    if (this.weakPointVisible) {
      const wpx = Math.round(this.x + this.w / 2 - camX);
      const wpy = Math.round(this.y - camY);
      ctx.fillStyle = '#00ff00';
      ctx.globalAlpha = 0.5 + Math.sin(Date.now() * 0.01) * 0.3;
      ctx.beginPath();
      ctx.arc(wpx, wpy, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#00ff00';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('WEAK POINT', wpx, wpy - 20);
    }
  }
  drawHealthBar(ctx) {
    const barW = 120;
    const barH = 8;
    const camX = game ? game.camera.getViewX() : 0;
    const camY = game ? game.camera.getViewY() : 0;
    const bx = this.x + this.w / 2 - barW / 2 - camX;
    const by = this.y - 24 - camY;
    ctx.fillStyle = '#333';
    ctx.fillRect(bx - 1, by - 1, barW + 2, barH + 2);
    const colors = ['#ff4444', '#ff8800', '#ffcc00'];
    const color = this.phase <= 3 ? colors[this.phase - 1] : '#ff4444';
    ctx.fillStyle = color;
    ctx.fillRect(bx, by, barW * (this.health / this.maxHealth), barH);
    ctx.fillStyle = '#fff';
    ctx.font = '8px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('BOSS', this.x + this.w / 2 - camX, by - 4);
  }
  drawEnemySprite(ctx, sx, sy) {
    const glow = this.vulnerable ? 1 + Math.sin(Date.now() * 0.01) * 0.1 : 1;
    ctx.save();
    ctx.translate(sx + 32, sy + 32);
    ctx.scale(glow, glow);
    ctx.fillStyle = '#220011';
    ctx.fillRect(-32, -32, 64, 64);
    ctx.fillStyle = '#440022';
    ctx.fillRect(-28, -28, 56, 56);
    ctx.fillStyle = '#660033';
    ctx.fillRect(-24, -24, 48, 48);
    ctx.fillStyle = '#880044';
    ctx.fillRect(-20, -8, 40, 24);
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(-18, -12, 8, 4);
    ctx.fillRect(10, -12, 8, 4);
    ctx.fillStyle = '#fff';
    ctx.fillRect(-18, -16, 8, 6);
    ctx.fillRect(10, -16, 8, 6);
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(-17, -15, 6, 4);
    ctx.fillRect(11, -15, 6, 4);
    ctx.fillStyle = '#ffcc00';
    ctx.fillRect(-4, -24, 8, 6);
    ctx.fillStyle = '#fff';
    ctx.fillRect(-2, -23, 4, 4);
    ctx.fillStyle = '#ff4400';
    ctx.fillRect(-14, 18, 8, 8);
    ctx.fillRect(6, 18, 8, 8);
    ctx.fillStyle = '#000';
    ctx.fillRect(-12, 20, 4, 4);
    ctx.fillRect(8, 20, 4, 4);
    ctx.fillStyle = '#ff0044';
    ctx.fillRect(-4, 24, 8, 4);
    ctx.fillStyle = '#ddaa00';
    ctx.fillRect(-6, -28, 4, 8);
    ctx.fillRect(2, -28, 4, 8);
    ctx.fillStyle = '#220011';
    ctx.fillRect(-28, 28, 8, 8);
    ctx.fillRect(20, 28, 8, 8);
    ctx.restore();
  }
  remove() {
    super.remove();
    this.projectiles.length = 0;
  }
}
