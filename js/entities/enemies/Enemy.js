class Enemy extends Entity {
  constructor(x, y, w, h, type) {
    super(x, y, w, h);
    this.enemyType = type;
    this.health = 1;
    this.maxHealth = 1;
    this.damage = 1;
    this.speed = 1;
    this.direction = -1;
    this.patrolLeft = x - 100;
    this.patrolRight = x + 100;
    this.activationRange = 300;
    this.deactivationRange = 500;
    this.stompable = true;
    this.canDamagePlayer = true;
    this.canBeDamaged = true;
    this.damageCooldown = 0;
    this.animationTimer = 0;
    this.animationFrame = 0;
    this.spawnX = x;
    this.spawnY = y;
    this.flickerTimer = 0;
    this.invincibleTimer = 0;
    this.deathTimer = 0;
    this.isDead = false;
    this.dropChance = 0;
    this.dropItems = [POWERUP.COIN];
    this.scoreValue = 100;
    this.boss = false;
  }
  update(dt) {
    if (this.isDead) {
      this.deathTimer--;
      if (this.deathTimer <= 0) this.remove();
      return;
    }
    this.animationTimer += dt;
    if (this.animationTimer > 0.2) {
      this.animationTimer = 0;
      this.animationFrame = (this.animationFrame + 1) % 4;
    }
    if (this.damageCooldown > 0) this.damageCooldown--;
    if (this.flickerTimer > 0) this.flickerTimer--;
    if (this.invincibleTimer > 0) this.invincibleTimer--;
    this.applyGravity();
  }
  takeDamage(amount = 1, fromX = 0) {
    if (!this.canBeDamaged || this.isDead) return;
    this.health -= amount;
    this.flickerTimer = 15;
    if (game) {
      game.particles.emitBurst(this.centerX, this.centerY, {
        count: 5, speed: 2, color: '#ff4444', lifetime: 15
      });
    }
    if (this.health <= 0) {
      this.die();
    } else {
      this.knockback(fromX);
    }
  }
  knockback(fromX) {
    this.vx = (this.x < fromX ? -1 : 1) * 4;
    this.vy = -3;
  }
  die() {
    this.isDead = true;
    this.deathTimer = 30;
    this.vy = -5;
    this.vx = 0;
    if (game) {
      game.particles.emitBurst(this.centerX, this.centerY, {
        count: 10, speed: 3, color: '#ff8844', lifetime: 20
      });
      game.player.score += this.scoreValue;
      this.tryDrop();
    }
  }
  tryDrop() {
    if (!game) return;
    if (Math.random() < this.dropChance) {
      const item = this.dropItems[Math.floor(Math.random() * this.dropItems.length)];
      const pw = new PowerUp(this.x + this.w / 2 - 12, this.y - 10, item);
      game.powerups.push(pw);
    }
  }
  stomp() {
    if (!this.stompable || this.isDead) return;
    this.die();
  }
  playerCollision(player) {
    if (!this.canDamagePlayer || this.isDead) return;
    if (this.damageCooldown > 0) return;
    if (player.stompTimer > 0 && this.stompable && player.vy > 0) {
      player.stomp(this);
      this.stomp();
      return;
    }
    if (this.boss) {
      if (!player.invincibleTimer) player.hit(this.damage, this.centerX);
      return;
    }
    if (this.damageCooldown <= 0) {
      player.hit(this.damage, this.centerX);
      this.damageCooldown = 30;
    }
  }
  isPlayerNear(player) {
    if (!player) return true;
    return Math.abs(this.x - player.x) < this.activationRange;
  }
  render(ctx, camX, camY) {
    if (!this.active || this.isDead) {
      if (this.isDead) {
        const sx = Math.round(this.x - camX);
        const sy = Math.round(this.y - camY);
        ctx.globalAlpha = this.deathTimer / 30;
        ctx.fillStyle = '#ff6644';
        ctx.fillRect(sx, sy, this.w, this.h);
        ctx.globalAlpha = 1;
      }
      return;
    }
    if (this.flickerTimer > 0 && this.flickerTimer % 4 < 2) return;
    const sx = Math.round(this.x - camX);
    const sy = Math.round(this.y - camY);
    ctx.save();
    if (this.direction < 0) {
      ctx.translate(sx + this.w, sy);
      ctx.scale(-1, 1);
    } else {
      ctx.translate(sx, sy);
    }
    this.drawEnemySprite(ctx, 0, 0);
    ctx.restore();
  }
  drawEnemySprite(ctx, sx, sy) {
    ctx.fillStyle = '#f0f';
    ctx.fillRect(sx, sy, this.w, this.h);
  }
}
