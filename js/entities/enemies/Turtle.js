class Turtle extends Enemy {
  constructor(x, y) {
    super(x, y, 26, 28, ENEMY.TURTLE);
    this.speed = 1.0;
    this.health = 1;
    this.scoreValue = 200;
    this.stompable = true;
    this.patrolLeft = x - 80;
    this.patrolRight = x + 80;
    this.dropChance = 0.25;
    this.inShell = false;
    this.shellSpeed = 6;
    this.shellTimer = 0;
    this.canBeDamagedInShell = false;
  }
  update(dt) {
    super.update(dt);
    if (this.isDead) return;
    if (!this.isPlayerNear(game ? game.player : null)) return;
    if (this.inShell) {
      if (this.shellTimer > 0) {
        this.shellTimer--;
        this.vx = this.direction * this.shellSpeed;
      } else {
        this.inShell = false;
        this.vx = 0;
        this.direction = this.direction || -1;
      }
      return;
    }
    this.vx = this.direction * this.speed;
    if (this.x < this.patrolLeft) this.direction = 1;
    if (this.x > this.patrolRight) this.direction = -1;
  }
  stomp() {
    if (this.isDead) return;
    if (!this.inShell) {
      this.inShell = true;
      this.shellTimer = 120;
      this.h = 16;
      this.y += 12;
      audio.playStomp();
      game.particles.emitBurst(this.centerX, this.y, {
        count: 5, speed: 2, color: '#44aa44', lifetime: 15
      });
    } else {
      this.shellTimer = 120;
      this.direction = this.direction * -1;
    }
  }
  playerCollision(player) {
    if (this.isDead) return;
    if (this.damageCooldown > 0) return;
    if (this.inShell) {
      if (Math.abs(this.vx) > 1) {
        player.hit(this.damage, this.centerX);
        this.damageCooldown = 30;
      }
      return;
    }
    if (player.stompTimer > 0 && player.vy > 0) {
      player.stomp(this);
      this.stomp();
      return;
    }
    if (this.damageCooldown <= 0) {
      player.hit(this.damage, this.centerX);
      this.damageCooldown = 30;
    }
  }
  drawEnemySprite(ctx, sx, sy) {
    if (this.inShell) {
      ctx.fillStyle = '#44aa44';
      ctx.fillRect(sx + 2, sy + 1, 22, 14);
      ctx.fillStyle = '#338833';
      ctx.fillRect(sx + 4, sy + 2, 18, 12);
      ctx.fillStyle = '#55bb55';
      ctx.fillRect(sx + 6, sy + 4, 14, 8);
      return;
    }
    ctx.fillStyle = '#44aa44';
    ctx.fillRect(sx + 2, sy + 2, 22, 24);
    ctx.fillStyle = '#338833';
    ctx.fillRect(sx + 4, sy + 6, 18, 12);
    ctx.fillStyle = '#fff';
    const eyeX = this.direction === 1 ? 16 : 6;
    ctx.fillRect(sx + eyeX, sy + 4, 5, 4);
    ctx.fillStyle = '#222';
    ctx.fillRect(sx + eyeX + 1, sy + 5, 2, 2);
    ctx.fillStyle = '#44aa44';
    ctx.fillRect(sx + 4, sy + 20, 6, 6);
    ctx.fillRect(sx + 16, sy + 20, 6, 6);
    ctx.fillStyle = '#338833';
    ctx.fillRect(sx + 5, sy + 21, 3, 4);
    ctx.fillRect(sx + 17, sy + 21, 3, 4);
  }
}
