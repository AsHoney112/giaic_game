class Game {
  constructor() {
    this.canvas = new CanvasRenderer('gameCanvas');
    this.ctx = this.canvas.getCtx();
    this.input = new InputManager();
    this.camera = new Camera();
    this.particles = new ParticleSystem();
    this.audio = audio;
    this.save = saveSystem;
    this.menu = new MenuManager();
    this.hud = new HUD();
    this.running = false;
    this.paused = false;
    this.state = 'menu';
    this.player = null;
    this.level = null;
    this.enemies = [];
    this.powerups = [];
    this.platforms = [];
    this.tileMap = null;
    this.currentLevel = 1;
    this.animTimer = 0;
    this.dt = 0;
    this.lastTime = 0;
    this.transitionAlpha = 0;
    this.transitionDirection = 0;
    this.transitionCallback = null;
  }
  startGame() {
    this.audio.init();
    this.audio.resume();
    this.save.reset();
    this.currentLevel = 1;
    this.loadLevel(1);
  }
  loadLevel(num) {
    this.audio.resume();
    this.currentLevel = num;
    this.enemies = [];
    this.powerups = [];
    this.platforms = [];
    this.particles.clear();
    this.camera.reset();
    switch (num) {
      case 1: this.level = new Level1(); break;
      case 2: this.level = new Level2(); break;
      case 3: this.level = new Level3(); break;
      default: this.level = new Level1(); break;
    }
    this.level.init();
    this.tileMap = this.level.tileMap;
    this.platforms = this.level.platforms;
    const start = this.level.playerStart;
    this.player = new Player(start.x, start.y);
    this.player.checkpointX = start.x;
    this.player.checkpointY = start.y;
    for (const e of this.level.enemies) {
      this.enemies.push(e);
    }
    for (const p of this.level.powerups) {
      this.powerups.push(p);
    }
    this.camera.follow(this.player);
    this.camera.setBounds(0, 0, this.level.width * TILE_SIZE, this.level.height * TILE_SIZE);
    this.menu.hideAll();
    this.state = 'playing';
    this.paused = false;
    this.running = true;
    this.audio.playMusic();
    this.hud.showMessage(this.level.name, 120, '#ffd700');
  }
  startTransition(callback) {
    this.transitionDirection = 1;
    this.transitionAlpha = 0;
    this.transitionCallback = callback;
  }
  restartLevel() {
    this.audio.resume();
    this.loadLevel(this.currentLevel);
  }
  nextLevel() {
    if (this.currentLevel < WORLD_COUNT) {
      this.loadLevel(this.currentLevel + 1);
    } else {
      this.showGameComplete();
    }
  }
  resumeGame() {
    this.paused = false;
    this.menu.hideAll();
    this.audio.resume();
  }
  quitToMenu() {
    this.audio.stopMusic();
    this.running = false;
    this.state = 'menu';
    this.menu.showMainMenu();
    this.menu.hideAll();
    document.getElementById('mainMenu').classList.remove('hidden');
  }
  showLevelSelect() {
    this.menu.showLevelSelect();
  }
  showSettings() {
    this.menu.showSettings();
  }
  closeSettings() {
    if (this.state === 'playing') {
      this.menu.hideAll();
    } else {
      this.menu.showMainMenu();
    }
  }
  updateSettings() {
    this.audio.setMusicVolume(document.getElementById('musicVolume').value / 100);
    this.audio.setSfxVolume(document.getElementById('sfxVolume').value / 100);
    this.save.data.settings.musicVolume = parseInt(document.getElementById('musicVolume').value);
    this.save.data.settings.sfxVolume = parseInt(document.getElementById('sfxVolume').value);
    this.save.data.settings.screenShake = document.getElementById('screenShake').checked;
    this.save.data.settings.particles = document.getElementById('particles').checked;
    this.input.saveBindings();
    this.save.save();
  }
  resetControls() {
    this.input.resetBindings();
    this.menu.buildKeyBindingsUI();
  }
  gameOver() {
    this.audio.stopMusic();
    this.state = 'gameover';
    this.menu.showGameOver(this.player.score);
  }
  levelComplete() {
    this.audio.stopMusic();
    this.audio.playVictory();
    this.save.data.lives = this.player.lives;
    this.save.data.health = this.player.health;
    this.save.data.coins = this.player.coins;
    this.save.data.gems = this.player.gems;
    this.save.updateScore(this.player.score);
    this.save.completeLevel(this.currentLevel);
    this.state = 'victory';
    this.menu.showVictory(this.level.timer, this.player.score, this.player.coins, this.player.gems, this.currentLevel + 1);
  }
  showGameComplete() {
    this.state = 'complete';
    this.menu.showGameComplete(this.player.score, this.player.coins, this.player.gems);
  }
  handlePause() {
    if (this.state !== 'playing') return;
    this.paused = !this.paused;
    if (this.paused) {
      this.menu.showPauseMenu();
    } else {
      this.menu.hideAll();
    }
  }
  update() {
    if (!this.running || this.state !== 'playing') return;
    if (this.paused) return;
    this.animTimer += this.dt;
    if (this.input.getPause()) {
      this.handlePause();
      return;
    }
    this.player.update(this.dt);
    this.camera.update();
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      e.update(this.dt);
      if (e.removed) {
        this.enemies.splice(i, 1);
        continue;
      }
      if (e.isPlayerNear && !e.isPlayerNear(this.player)) continue;
      if (e.playerCollision) e.playerCollision(this.player);
    }
    for (let i = this.powerups.length - 1; i >= 0; i--) {
      const p = this.powerups[i];
      p.update(this.dt);
      if (p.collected || p.removed) {
        this.powerups.splice(i, 1);
        continue;
      }
      if (this.player.collidesWith(p.getRect())) {
        p.collected = true;
        this.player.addPowerUp(p.powerUpType);
        this.powerups.splice(i, 1);
      }
    }
    this.level.update(this.dt);
    this.player.x += this.player.vx;
    this.player.y += this.player.vy;
    for (const e of this.enemies) {
      e.x += e.vx;
      e.y += e.vy;
    }
    this.handleCollisions();
    this.handleTileInteractions();
    this.particles.update();
    this.hud.update(this.dt);
    if (this.transitionDirection > 0) {
      this.transitionAlpha += 0.05;
      if (this.transitionAlpha >= 1) {
        this.transitionDirection = -1;
        if (this.transitionCallback) {
          this.transitionCallback();
          this.transitionCallback = null;
        }
      }
    } else if (this.transitionDirection < 0) {
      this.transitionAlpha -= 0.05;
      if (this.transitionAlpha <= 0) {
        this.transitionDirection = 0;
      }
    }
    this.input.update();
  }
  handleCollisions() {
    const solids = this.tileMap;
    const p = this.player;
    p.onGround = false;
    p.onWall = false;
    p.wallDir = 0;
    p.inWater = false;
    p.onLadder = false;
    const tiles = solids.tiles;
    const tw = TILE_SIZE;
    const ty = Math.floor;
    const checkCollision = (entity) => {
      const tLeft = ty(entity.x / tw);
      const tRight = ty((entity.x + entity.w - 1) / tw);
      const tTop = ty(entity.y / tw);
      const tBottom = ty((entity.y + entity.h - 1) / tw);
      entity.onLadder = false;
      for (let tx = tLeft; tx <= tRight; tx++) {
        for (let ty2 = tTop; ty2 <= tBottom; ty2++) {
          const tile = solids.getTile(tx, ty2);
          if (tile === TILE.AIR || solids.tilePassable[tile]) {
            if (tile === TILE.WATER) entity.inWater = true;
            if (tile === TILE.LADDER) entity.onLadder = true;
            continue;
          }
          const tileRect = { x: tx * tw, y: ty2 * tw, w: tw, h: tw };
          if (entity.collidesWith(tileRect)) {
            const overlapLeft = (entity.x + entity.w) - tileRect.x;
            const overlapRight = (tileRect.x + tw) - entity.x;
            const overlapTop = (entity.y + entity.h) - tileRect.y;
            const overlapBottom = (tileRect.y + tw) - entity.y;
            const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
            if (minOverlap === overlapTop && entity.vy >= 0) {
              entity.y = tileRect.y - entity.h;
              entity.vy = 0;
              entity.onGround = true;
            } else if (minOverlap === overlapBottom && entity.vy < 0) {
              entity.y = tileRect.y + tw;
              entity.vy = 0;
            } else if (minOverlap === overlapLeft && entity.vx > 0) {
              entity.x = tileRect.x - entity.w;
              entity.vx = 0;
              entity.onWall = true;
              entity.wallDir = 1;
            } else if (minOverlap === overlapRight && entity.vx < 0) {
              entity.x = tileRect.x + tw;
              entity.vx = 0;
              entity.onWall = true;
              entity.wallDir = -1;
            }
          }
        }
      }
    };
    checkCollision(p);
    for (const e of this.enemies) {
      if (e.isDead) continue;
      checkCollision(e);
    }
    for (const plat of this.platforms) {
      if (plat.fallen) continue;
      const pr = plat.rect;
      if (p.collidesWith(pr)) {
        if (p.vy >= 0 && p.y + p.h - pr.y < 12) {
          p.y = pr.y - p.h;
          p.vy = 0;
          p.onGround = true;
          if (plat.vx) p.x += plat.vx;
          if (plat.vy) p.y += plat.vy;
          if (plat.type === 'falling') plat.startFalling();
        } else if (p.vy < 0 && p.y - (pr.y + pr.h) < 8) {
          p.y = pr.y + pr.h;
          p.vy = 0;
        }
      }
    }
    if (p.y > this.level.height * TILE_SIZE + 100) {
      p.hit(MAX_HEALTH);
    }
  }
  handleTileInteractions() {
    const p = this.player;
    const solids = this.tileMap;
    const cx = Math.floor((p.x + p.w / 2) / TILE_SIZE);
    const cy = Math.floor((p.y + p.h / 2) / TILE_SIZE);
    const checkTile = (tx, ty) => {
      const tile = solids.getTile(tx, ty);
      if (tile === TILE.SPIKE && !p.isInvinciblePower && !p.invincibleTimer) {
        p.hit(1, p.x);
      }
      if (tile === TILE.LAVA && !p.isInvinciblePower) {
        p.hit(2, p.x);
      }
      if (tile === TILE.COIN) {
        solids.setTile(tx, ty, TILE.AIR);
        p.addPowerUp(POWERUP.COIN);
        this.particles.emitBurst(tx * TILE_SIZE + TILE_SIZE / 2, ty * TILE_SIZE + TILE_SIZE / 2, {
          count: 5, speed: 2, color: '#ffd700', lifetime: 15
        });
      }
      if (tile === TILE.GEM) {
        solids.setTile(tx, ty, TILE.AIR);
        p.addPowerUp(POWERUP.GEM);
        this.particles.emitBurst(tx * TILE_SIZE + TILE_SIZE / 2, ty * TILE_SIZE + TILE_SIZE / 2, {
          count: 5, speed: 2, color: '#00ffff', lifetime: 15
        });
      }
      if (tile === TILE.QUESTION) {
        solids.setTile(tx, ty, TILE.AIR);
        p.addPowerUp(POWERUP.COIN);
        this.particles.emitBurst(tx * TILE_SIZE + TILE_SIZE / 2, ty * TILE_SIZE + TILE_SIZE / 2, {
          count: 8, speed: 3, color: '#ffd700', lifetime: 20
        });
      }
      if (tile === TILE.SECRET) {
        solids.setTile(tx, ty, TILE.AIR);
        this.particles.emitBurst(tx * TILE_SIZE + TILE_SIZE / 2, ty * TILE_SIZE + TILE_SIZE / 2, {
          count: 10, speed: 3, color: '#ffd700', lifetime: 20
        });
        this.hud.showMessage('Secret Found!', 90, '#ffd700');
        if (Math.random() > 0.5) {
          p.addPowerUp(POWERUP.COIN);
        } else {
          p.addPowerUp(POWERUP.GEM);
        }
      }
      if (tile === TILE.BOUNCE && p.vy > 0) {
        p.vy = -14;
        this.camera.shake(3, 6);
        this.particles.emitBurst(tx * TILE_SIZE + TILE_SIZE / 2, ty * TILE_SIZE, {
          count: 6, speed: 2, color: '#ff88ff', lifetime: 15, angle: -Math.PI / 2, angleSpread: 1
        });
      }
    };
    for (const cp of this.level.checkpoints) {
      if (!cp.activated && Math.abs(p.centerX - cp.x - 16) < 16 && Math.abs(p.centerY - cp.y - 16) < 24) {
        cp.activated = true;
        p.activateCheckpoint(cp);
      }
    }
    if (Math.abs(p.centerX - this.level.exitX) < 30 && Math.abs(p.centerY - this.level.exitY) < 30) {
      this.levelComplete();
    }
    checkTile(cx, cy);
    checkTile(cx - 1, cy);
    checkTile(cx + 1, cy);
    checkTile(cx, cy - 1);
    checkTile(cx, cy + 1);
    if (p.vy > 0) {
      const below = Math.floor((p.y + p.h) / TILE_SIZE);
      checkTile(cx, below);
    }
    if (p.vx !== 0) {
      const sideX = p.vx > 0 ? Math.floor((p.x + p.w) / TILE_SIZE) : Math.floor(p.x / TILE_SIZE);
      checkTile(sideX, cy);
    }
  }
  render() {
    const ctx = this.ctx;
    const camX = this.camera.getViewX();
    const camY = this.camera.getViewY();
    if (this.state === 'playing' && this.level) {
      this.level.renderBackground(ctx, camX, camY, this.animTimer * 30);
      this.level.renderWeather(ctx, this.animTimer * 30);
    } else {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
    if (this.tileMap && this.level) {
      ctx.save();
      ctx.translate(-camX, -camY);
      this.level.tileMap.render(ctx, 0, 0, this.animTimer * 30);
      this.level.renderPlatforms(ctx, 0, 0);
      for (const p of this.powerups) {
        p.render(ctx, 0, 0);
      }
      for (const e of this.enemies) {
        e.render(ctx, 0, 0);
      }
      if (this.player && this.state === 'playing') {
        this.player.render(ctx, 0, 0);
      }
      this.particles.draw(ctx, 0, 0);
      ctx.restore();
    }
    if (this.state === 'playing') {
      this.camera.draw(ctx);
      this.hud.render(ctx, this.player, this.level);
    }
    if (this.transitionAlpha > 0) {
      ctx.fillStyle = '#000';
      ctx.globalAlpha = this.transitionAlpha;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.globalAlpha = 1;
    }
  }
  gameLoop(timestamp) {
    this.dt = Math.min((timestamp - this.lastTime) / 1000, 0.05);
    this.lastTime = timestamp;
    this.canvas.clear();
    this.update();
    this.render();
    requestAnimationFrame((t) => this.gameLoop(t));
  }
}
