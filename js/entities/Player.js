class Player extends Entity {
  constructor(x, y) {
    super(x, y, 24, 32);
    this.type = 'player';
    this.startX = x;
    this.startY = y;
    this.health = MAX_HEALTH;
    this.maxHealth = MAX_HEALTH;
    this.lives = START_LIVES;
    this.coins = 0;
    this.gems = 0;
    this.score = 0;
    this.speed = PLAYER_MAX_SPEED;
    this.canDoubleJump = true;
    this.hasDoubleJumped = false;
    this.canDash = true;
    this.isDashing = false;
    this.dashTimer = 0;
    this.dashCooldown = 0;
    this.isWallSliding = false;
    this.wallSlideDir = 0;
    this.wallJumpTimer = 0;
    this.isCrouching = false;
    this.isPounding = false;
    this.poundTimer = 0;
    this.isClimbing = false;
    this.isSwimming = false;
    this.invincibleTimer = 0;
    this.invincibleFlicker = 0;
    this.stompTimer = 0;
    this.knockbackTimer = 0;
    this.knockbackVx = 0;
    this.knockbackVy = 0;
    this.hasShield = false;
    this.hasSpeedBoots = false;
    this.hasDoubleDamage = false;
    this.isInvinciblePower = false;
    this.invinciblePowerTimer = 0;
    this.hasKey = false;
    this.nearLadder = false;
    this.ladderX = 0;
    this.ladderY = 0;
    this.breathTimer = 0;
    this.underwaterTimer = 0;
    this.animationTimer = 0;
    this.animationFrame = 0;
    this.trailTimer = 0;
    this.currentCheckpoint = null;
    this.checkpointX = x;
    this.checkpointY = y;
    this.facing = 1;
    this.walkCycle = 0;
    this.inputJumpHeld = false;
    this.jumpBufferTimer = 0;
    this.coyoteTimer = 0;
    this.variableJumpHeld = false;
  }
  reset(x, y) {
    this.x = x || this.startX;
    this.y = y || this.startY;
    this.vx = 0;
    this.vy = 0;
    this.health = MAX_HEALTH;
    this.canDoubleJump = true;
    this.hasDoubleJumped = false;
    this.canDash = true;
    this.isDashing = false;
    this.dashTimer = 0;
    this.dashCooldown = 0;
    this.isWallSliding = false;
    this.wallSlideDir = 0;
    this.wallJumpTimer = 0;
    this.isCrouching = false;
    this.isPounding = false;
    this.poundTimer = 0;
    this.isClimbing = false;
    this.isSwimming = false;
    this.invincibleTimer = 0;
    this.stompTimer = 0;
    this.knockbackTimer = 0;
    this.onGround = false;
    this.onWall = false;
    this.inWater = false;
    this.onLadder = false;
    this.nearLadder = false;
    this.hasDoubleDamage = false;
    this.isInvinciblePower = false;
    this.invinciblePowerTimer = 0;
    this.inputJumpHeld = false;
  }
  hit(damage = 1, sourceX = 0) {
    if (this.invincibleTimer > 0 || this.isInvinciblePower) return;
    if (this.hasShield) {
      this.hasShield = false;
      this.invincibleTimer = INVINCIBILITY_DURATION * 0.5;
      audio.playHit();
      return;
    }
    this.health -= damage;
    this.invincibleTimer = INVINCIBILITY_DURATION;
    this.knockbackTimer = 15;
    this.knockbackVx = this.x > sourceX ? 5 : -5;
    this.knockbackVy = -4;
    audio.playDamage();
    if (game) game.camera.shake(6, 12);
    if (game) game.particles.emitBurst(this.centerX, this.centerY, {
      count: 10, speed: 3, color: '#ff4444', lifetime: 20
    });
    if (this.health <= 0) {
      this.die();
    }
  }
  die() {
    this.lives--;
    audio.playDeath();
    if (game) game.camera.shake(10, 20);
    if (game) game.particles.emitBurst(this.centerX, this.centerY, {
      count: 20, speed: 4, color: '#ff4444', lifetime: 30
    });
    if (this.lives <= 0) {
      if (game) game.gameOver();
    } else {
      this.respawn();
    }
  }
  respawn() {
    this.reset(this.checkpointX, this.checkpointY);
    this.health = MAX_HEALTH;
    this.invincibleTimer = 90;
    this.canDash = true;
  }
  stomp(enemy) {
    this.vy = STOMP_BOUNCE;
    this.stompTimer = 10;
    audio.playStomp();
    if (game) game.particles.emitBurst(this.x + this.w / 2, this.bottom, {
      count: 6, speed: 2, color: '#ffd700', lifetime: 15,
      angle: -Math.PI / 2, angleSpread: Math.PI
    });
  }
  activateCheckpoint(cp) {
    this.checkpointX = cp.x + 16;
    this.checkpointY = cp.y - this.h;
    this.currentCheckpoint = cp;
    if (game) {
      audio.playCheckpoint();
      game.particles.emitBurst(cp.x + 16, cp.y, {
        count: 12, speed: 3, color: '#00ff88', lifetime: 25
      });
    }
  }
  addPowerUp(type) {
    switch (type) {
      case POWERUP.COIN:
        this.coins++;
        this.score += COIN_VALUE;
        audio.playCoin();
        break;
      case POWERUP.GEM:
        this.gems++;
        this.score += GEM_VALUE;
        audio.playGem();
        break;
      case POWERUP.HEART:
        this.health = Math.min(this.maxHealth, this.health + 1);
        audio.playPowerUp();
        break;
      case POWERUP.SHIELD:
        this.hasShield = true;
        audio.playPowerUp();
        break;
      case POWERUP.SPEED_BOOTS:
        this.hasSpeedBoots = true;
        this.speed = PLAYER_RUN_SPEED;
        audio.playPowerUp();
        break;
      case POWERUP.DOUBLE_DAMAGE:
        this.hasDoubleDamage = true;
        audio.playPowerUp();
        break;
      case POWERUP.INVINCIBILITY:
        this.isInvinciblePower = true;
        this.invinciblePowerTimer = 600;
        audio.playPowerUp();
        break;
      case POWERUP.EXTRA_LIFE:
        this.lives = Math.min(MAX_LIVES, this.lives + 1);
        audio.playPowerUp();
        break;
      case POWERUP.KEY:
        this.hasKey = true;
        audio.playPowerUp();
        break;
      case POWERUP.TREASURE_CHEST:
        this.score += 1000;
        this.coins += 5;
        audio.playPowerUp();
        break;
    }
    if (game) {
      game.particles.emitBurst(this.centerX, this.centerY, {
        count: 8, speed: 2, color: '#ffd700', lifetime: 20
      });
    }
  }
  update(dt) {
    if (this.removed) return;
    const input = game ? game.input : null;
    this.walkCycle += Math.abs(this.vx) * 0.1;
    this.animationTimer += dt;
    if (this.animationTimer > 0.15) {
      this.animationTimer = 0;
      this.animationFrame = (this.animationFrame + 1) % 4;
    }
    this.invincibleFlicker++;
    if (this.invincibleTimer > 0) this.invincibleTimer--;
    if (this.knockbackTimer > 0) this.knockbackTimer--;
    if (this.stompTimer > 0) this.stompTimer--;
    if (this.dashCooldown > 0) this.dashCooldown--;
    if (this.isInvinciblePower) {
      this.invinciblePowerTimer--;
      if (this.invinciblePowerTimer <= 0) this.isInvinciblePower = false;
    }
    if (this.jumpBufferTimer > 0) this.jumpBufferTimer--;
    this.coyoteTimer = this.onGround ? 8 : this.coyoteTimer - 1;
    if (this.coyoteTimer < 0) this.coyoteTimer = 0;
    if (this.inWater) {
      this.underwaterTimer++;
      if (this.underwaterTimer > 300 && this.underwaterTimer % 60 === 0) {
        this.hit(1);
      }
    } else {
      this.underwaterTimer = 0;
    }
    if (this.knockbackTimer > 0) {
      this.vx = this.knockbackVx;
      this.vy = this.knockbackVy;
      this.knockbackVy += 0.5;
      return;
    }
    this.handleInput(input);
    this.applyGravity();
    this.handleWallSlide();
    if (this.isDashing) {
      if (this.dashTimer > 0) {
        this.dashTimer--;
        this.vy = 0;
        if (game && this.trailTimer++ % 2 === 0) {
          game.particles.emit(this.x + this.w / 2, this.y + this.h / 2, 1, {
            speed: 0.5, color: '#88ccff', lifetime: 10, size: 3, gravity: 0, angleSpread: 0.5
          });
        }
      } else {
        this.isDashing = false;
        this.dashCooldown = 30;
      }
    }
    if (this.isPounding) {
      this.vy = 10;
      this.vx = 0;
      this.poundTimer--;
      if (this.onGround || this.inWater) {
        this.isPounding = false;
        if (this.onGround && game) {
          game.camera.shake(4, 8);
          game.particles.emitBurst(this.x + this.w / 2, this.bottom, {
            count: 8, speed: 3, color: '#aa8844', lifetime: 15,
            angle: -Math.PI / 2, angleSpread: Math.PI
          });
          audio.playPound();
        }
      }
      if (this.inWater) this.isPounding = false;
    }
    if (this.wallJumpTimer > 0) this.wallJumpTimer--;
    if (this.inWater) {
      this.vy *= 0.85;
      this.vx *= 0.9;
    }
    if (this.variableJumpHeld && this.vy < -3 && !this.onGround) {
      this.vy *= 0.92;
    }
    if (this.onGround) {
      this.hasDoubleJumped = false;
      this.canDoubleJump = true;
      this.canDash = true;
      this.isWallSliding = false;
    }
    if (game && this.trailTimer++ % 3 === 0 && Math.abs(this.vx) > 2 && this.onGround) {
      game.particles.emit(this.x + this.w / 2, this.bottom, 1, {
        speed: 0.3, color: '#aa8844', lifetime: 15, size: 2, gravity: 0,
        angle: Math.PI, angleSpread: 0.5
      });
    }
  }
  handleInput(input) {
    if (!input) return;
    const left = input.getLeft();
    const right = input.getRight();
    const up = input.getUp();
    const down = input.getDown();
    const jump = input.getJump();
    const dash = input.getDash();
    const pound = input.getPound();
    const crouch = input.getCrouch();
    if (input.actionJustPressed('jump')) {
      this.inputJumpHeld = true;
      this.jumpBufferTimer = 6;
    }
    if (input.actionDown('jump') || input.actionDown('moveUp')) {
      this.variableJumpHeld = true;
    } else {
      this.variableJumpHeld = false;
    }
    if (this.onLadder || this.nearLadder) {
      this.isClimbing = true;
    } else {
      this.isClimbing = false;
    }
    if (this.isClimbing) {
      this.vy = 0;
      this.vx = 0;
      if (up) { this.vy = -PLAYER_CLIMB_SPEED; if (audio) audio.playClimb(); }
      if (down) { this.vy = PLAYER_CLIMB_SPEED; if (audio) audio.playClimb(); }
      if (jump && !this.onGround) {
        this.isClimbing = false;
        this.vy = PLAYER_JUMP_FORCE;
        this.vx = this.facing * 3;
      }
      return;
    }
    if (this.isPounding || this.isDashing) return;
    if (this.knockbackTimer > 0) return;
    if ((down || crouch) && !this.isSwimming && !this.inWater) {
      this.isCrouching = true;
      this.h = 20;
      this.y = this.y + 12;
    } else {
      if (this.isCrouching) {
        this.y = this.y - 12;
      }
      this.isCrouching = false;
      this.h = 32;
    }
    if (this.isCrouching) {
      this.vx *= 0.85;
      return;
    }
    if (left) {
      this.vx -= this.hasSpeedBoots ? PLAYER_ACCELERATION * 1.4 : PLAYER_ACCELERATION;
      this.facing = -1;
    }
    if (right) {
      this.vx += this.hasSpeedBoots ? PLAYER_ACCELERATION * 1.4 : PLAYER_ACCELERATION;
      this.facing = 1;
    }
    if (!left && !right) {
      this.vx *= this.onGround ? FRICTION : 0.95;
    }
    const maxSpeed = this.hasSpeedBoots ? PLAYER_RUN_SPEED + 3 : PLAYER_RUN_SPEED;
    this.vx = MathUtils.clamp(this.vx, -maxSpeed, maxSpeed);
    if (this.inWater) {
      if (jump) {
        if (this.onGround || this.vy > -1) {
          this.vy = PLAYER_JUMP_FORCE * 0.7;
          audio.playSwim();
        }
      }
    } else {
      if (this.jumpBufferTimer > 0 && (this.coyoteTimer > 0 || this.onGround)) {
        this.vy = PLAYER_JUMP_FORCE;
        this.jumpBufferTimer = 0;
        this.coyoteTimer = 0;
        this.onGround = false;
        audio.playJump();
      } else if (this.jumpBufferTimer > 0 && !this.hasDoubleJumped && this.canDoubleJump && !this.onGround && !this.isWallSliding) {
        this.vy = PLAYER_DOUBLE_JUMP_FORCE;
        this.hasDoubleJumped = true;
        this.canDoubleJump = false;
        this.jumpBufferTimer = 0;
        if (game) {
          game.particles.emitBurst(this.x + this.w / 2, this.bottom, {
            count: 6, speed: 2, color: '#88ccff', lifetime: 15
          });
        }
        audio.playDoubleJump();
      } else if (this.jumpBufferTimer > 0 && this.isWallSliding && this.wallJumpTimer <= 0) {
        this.vy = PLAYER_WALL_JUMP_Y;
        this.vx = -this.wallSlideDir * PLAYER_WALL_JUMP_X;
        this.facing = -this.wallSlideDir;
        this.isWallSliding = false;
        this.wallJumpTimer = 12;
        this.jumpBufferTimer = 0;
        if (game) {
          game.particles.emit(this.x + this.w / 2, this.y + this.h / 2, 5, {
            speed: 2, color: '#88ccff', lifetime: 12,
            angle: this.wallSlideDir > 0 ? 0 : Math.PI, angleSpread: 1
          });
        }
        audio.playWallJump();
      }
    }
    if (dash && this.canDash && !this.isDashing && !this.onGround && !this.inWater) {
      this.isDashing = true;
      this.dashTimer = PLAYER_DASH_DURATION;
      this.canDash = false;
      this.vx = this.facing * PLAYER_DASH_SPEED;
      this.vy = 0;
      audio.playDash();
    }
    if (pound && !this.isPounding && !this.onGround) {
      this.isPounding = true;
      this.poundTimer = 20;
      this.vy = 5;
    }
    if (this.inWater) {
      if (up) { this.vy = -PLAYER_SWIM_SPEED * 0.7; }
      if (down) { this.vy = PLAYER_SWIM_SPEED * 0.5; }
    }
    if (this.inWater) {
      this.isSwimming = true;
    } else {
      this.isSwimming = false;
    }
  }
  handleWallSlide() {
    if (this.onGround || this.onLadder || this.inWater) {
      this.isWallSliding = false;
      return;
    }
    if (this.onWall && this.vy >= 0) {
      if (!this.isWallSliding) {
        this.wallSlideDir = this.wallDir;
      }
      this.isWallSliding = true;
      this.vy = Math.min(this.vy, 2);
      if (game && Math.abs(this.vy) > 0.5) {
        game.particles.emit(this.x + (this.wallDir > 0 ? this.w : 0), this.y + this.h / 2, 1, {
          speed: 0.5, color: '#aaa', lifetime: 12, size: 2, gravity: 0.01,
          angle: this.wallDir > 0 ? 0 : Math.PI, angleSpread: 0.5
        });
      }
    } else {
      this.isWallSliding = false;
    }
  }
  render(ctx, camX, camY) {
    if (this.removed || !this.active) return;
    if (this.invincibleTimer > 0 && this.invincibleFlicker % 6 < 3) return;
    const sx = Math.round(this.x - camX);
    const sy = Math.round(this.y - camY);
    ctx.save();
    if (this.isInvinciblePower) {
      ctx.globalAlpha = 0.7 + Math.sin(this.invincibleFlicker * 0.3) * 0.3;
    }
    if (this.isDashing) {
      ctx.globalAlpha = 0.6;
    }
    this.drawPlayerSprite(ctx, sx, sy);
    ctx.font = 'bold 8px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeText('MOHSIN', sx + this.w / 2, sy - 4);
    ctx.fillStyle = '#ffd700';
    ctx.fillText('MOHSIN', sx + this.w / 2, sy - 4);
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  drawPlayerSprite(ctx, sx, sy) {
    const w = this.w, h = this.h;
    if (this.isSwimming || this.inWater) {
      ctx.fillStyle = '#2244aa';
      ctx.fillRect(sx + 2, sy, w - 4, h);
      ctx.fillStyle = '#4466cc';
      ctx.fillRect(sx + 4, sy + 2, w - 8, 6);
      ctx.fillStyle = '#e8c478';
      ctx.fillRect(sx + (this.facing > 0 ? 14 : 4), sy + 4, 4, 3);
      ctx.fillRect(sx + (this.facing > 0 ? 4 : 14), sy + 4, 4, 3);
      ctx.fillStyle = '#cc2222';
      ctx.fillRect(sx + 8, sy + h - 6, w - 16, 6);
      return;
    }
    if (this.isClimbing) {
      ctx.fillStyle = '#2244aa';
      ctx.fillRect(sx + 4, sy, w - 8, h);
      ctx.fillStyle = '#e8c478';
      ctx.fillRect(sx + 6, sy + 4, 4, 4);
      ctx.fillRect(sx + 12, sy + 4, 4, 4);
      ctx.fillStyle = '#cc2222';
      ctx.fillRect(sx + 6, sy + h - 12, w - 12, 4);
      ctx.fillRect(sx + 6, sy + h - 6, w - 12, 4);
      return;
    }
    const cape = '#cc2222';
    const suit = '#2244aa';
    const suitLight = '#3366cc';
    const skin = '#e8c478';
    const belt = '#ffd700';
    const trunks = '#cc2222';
    const boots = '#cc2222';
    const sColor = '#ffd700';
    const dark = '#1a3366';
    ctx.fillStyle = cape;
    ctx.fillRect(sx, sy + 6, w, 2);
    ctx.fillRect(sx, sy + 8, 4, 18);
    ctx.fillRect(sx + w - 4, sy + 8, 4, 18);
    ctx.fillStyle = suit;
    ctx.fillRect(sx + 4, sy + 6, w - 8, h - 8);
    ctx.fillStyle = suitLight;
    ctx.fillRect(sx + 6, sy + 8, w - 12, 4);
    ctx.fillStyle = skin;
    ctx.fillRect(sx + 6, sy + 2, w - 12, 6);
    ctx.fillRect(sx + 6, sy + 2, 4, 4);
    ctx.fillRect(sx + 14, sy + 2, 4, 4);
    ctx.fillStyle = '#fff';
    ctx.fillRect(sx + 8, sy + 3, 3, 2);
    ctx.fillRect(sx + 13, sy + 3, 3, 2);
    ctx.fillStyle = '#222';
    ctx.fillRect(sx + 9, sy + 4, 2, 1);
    ctx.fillRect(sx + 13, sy + 4, 2, 1);
    ctx.fillStyle = skin;
    ctx.fillRect(sx + 4, sy + 8, 3, 3);
    ctx.fillRect(sx + 17, sy + 8, 3, 3);
    ctx.fillStyle = sColor;
    ctx.beginPath();
    ctx.moveTo(sx + 8, sy + 12);
    ctx.lineTo(sx + 12, sy + 10);
    ctx.lineTo(sx + 16, sy + 12);
    ctx.lineTo(sx + 16, sy + 16);
    ctx.lineTo(sx + 12, sy + 18);
    ctx.lineTo(sx + 8, sy + 16);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 6px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('S', sx + w / 2, sy + 16);
    ctx.fillStyle = belt;
    ctx.fillRect(sx + 4, sy + 18, w - 8, 2);
    ctx.fillRect(sx + 10, sy + 18, 4, 3);
    ctx.fillStyle = trunks;
    ctx.fillRect(sx + 6, sy + 20, w - 12, 4);
    ctx.fillStyle = suit;
    ctx.fillRect(sx + 6, sy + 24, w - 12, 4);
    ctx.fillStyle = dark;
    ctx.fillRect(sx + 6, sy + 24, 3, 4);
    ctx.fillRect(sx + 15, sy + 24, 3, 4);
    ctx.fillStyle = boots;
    ctx.fillRect(sx + 4, sy + 28, 6, 4);
    ctx.fillRect(sx + 14, sy + 28, 6, 4);
    if (this.hasShield) {
      ctx.strokeStyle = '#88ccff';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.strokeRect(sx + 1, sy + 1, w - 2, h - 2);
      ctx.setLineDash([]);
    }
    if (this.isInvinciblePower) {
      ctx.strokeStyle = '#ffff00';
      ctx.lineWidth = 2;
      ctx.strokeRect(sx - 1, sy - 1, w + 2, h + 2);
    }
  }
  getRect() { return this.rect; }
}
