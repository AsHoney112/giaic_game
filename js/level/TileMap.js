class TileMap {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.tiles = [];
    this.tileColors = {
      [TILE.AIR]: null,
      [TILE.SOLID]: '#8B4513',
      [TILE.BRICK]: '#c84c09',
      [TILE.QUESTION]: '#ddaa00',
      [TILE.SPIKE]: '#ff4444',
      [TILE.WATER]: '#2244aa',
      [TILE.LAVA]: '#ff4400',
      [TILE.LADDER]: '#d4a574',
      [TILE.COIN]: '#ffd700',
      [TILE.GEM]: '#00ffff',
      [TILE.CHECKPOINT]: '#00ff88',
      [TILE.EXIT]: '#44ff44',
      [TILE.PLATFORM_MOVE_X]: '#88aaff',
      [TILE.PLATFORM_MOVE_Y]: '#88aaff',
      [TILE.PLATFORM_FALL]: '#ffaa88',
      [TILE.PLATFORM_SWING]: '#ff88aa',
      [TILE.BREAKABLE]: '#c84c09',
      [TILE.ICE]: '#aaddff',
      [TILE.SAND]: '#d4a574',
      [TILE.SNOW]: '#eeeeff',
      [TILE.SECRET]: '#886644',
      [TILE.ROPE_BRIDGE]: '#8B4513',
      [TILE.ELEVATOR]: '#88aacc',
      [TILE.BOUNCE]: '#ff88ff',
      [TILE.CONVEYOR_LEFT]: '#888',
      [TILE.CONVEYOR_RIGHT]: '#888'
    };
    this.tilePassable = {
      [TILE.AIR]: true,
      [TILE.SOLID]: false,
      [TILE.BRICK]: false,
      [TILE.QUESTION]: false,
      [TILE.SPIKE]: true,
      [TILE.WATER]: true,
      [TILE.LAVA]: true,
      [TILE.LADDER]: true,
      [TILE.COIN]: true,
      [TILE.GEM]: true,
      [TILE.CHECKPOINT]: true,
      [TILE.EXIT]: true,
      [TILE.PLATFORM_MOVE_X]: false,
      [TILE.PLATFORM_MOVE_Y]: false,
      [TILE.PLATFORM_FALL]: false,
      [TILE.PLATFORM_SWING]: false,
      [TILE.BREAKABLE]: false,
      [TILE.ICE]: false,
      [TILE.SAND]: false,
      [TILE.SNOW]: false,
      [TILE.SECRET]: false,
      [TILE.ROPE_BRIDGE]: true,
      [TILE.ELEVATOR]: false,
      [TILE.BOUNCE]: false,
      [TILE.CONVEYOR_LEFT]: false,
      [TILE.CONVEYOR_RIGHT]: false
    };
    this.animatedTiles = new Set([TILE.WATER, TILE.LAVA, TILE.QUESTION, TILE.COIN, TILE.GEM]);
  }
  initEmpty() {
    this.tiles = [];
    for (let y = 0; y < this.height; y++) {
      this.tiles[y] = [];
      for (let x = 0; x < this.width; x++) {
        this.tiles[y][x] = TILE.AIR;
      }
    }
  }
  setTile(x, y, type) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.tiles[y][x] = type;
    }
  }
  getTile(x, y) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      return this.tiles[y][x];
    }
    return TILE.SOLID;
  }
  isSolid(x, y) {
    const tile = this.getTile(x, y);
    return !this.tilePassable[tile] && tile !== undefined;
  }
  isPassable(x, y) {
    const tile = this.getTile(x, y);
    return this.tilePassable[tile] !== false;
  }
  isWater(x, y) { return this.getTile(x, y) === TILE.WATER; }
  isLava(x, y) { return this.getTile(x, y) === TILE.LAVA; }
  isLadder(x, y) { return this.getTile(x, y) === TILE.LADDER; }
  isSpike(x, y) { return this.getTile(x, y) === TILE.SPIKE; }
  isBreakable(x, y) { return this.getTile(x, y) === TILE.BREAKABLE; }
  isIce(x, y) { return this.getTile(x, y) === TILE.ICE; }
  isBounce(x, y) { return this.getTile(x, y) === TILE.BOUNCE; }
  isConveyor(x, y) {
    const t = this.getTile(x, y);
    return t === TILE.CONVEYOR_LEFT || t === TILE.CONVEYOR_RIGHT;
  }
  getConveyorDir(x, y) {
    const t = this.getTile(x, y);
    if (t === TILE.CONVEYOR_LEFT) return -1;
    if (t === TILE.CONVEYOR_RIGHT) return 1;
    return 0;
  }
  isSecret(x, y) { return this.getTile(x, y) === TILE.SECRET; }
  breakTile(x, y) {
    if (this.isBreakable(x, y)) {
      this.setTile(x, y, TILE.AIR);
      if (game) {
        game.particles.emitBurst(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2, {
          count: 8, speed: 3, color: '#c84c09', lifetime: 15
        });
      }
      return true;
    }
    return false;
  }
  solidAt(x, y) {
    const tx = Math.floor(x / TILE_SIZE);
    const ty = Math.floor(y / TILE_SIZE);
    return this.isSolid(tx, ty);
  }
  getTileAt(x, y) {
    const tx = Math.floor(x / TILE_SIZE);
    const ty = Math.floor(y / TILE_SIZE);
    return this.getTile(tx, ty);
  }
  render(ctx, camX, camY, animTimer) {
    const startX = Math.max(0, Math.floor(camX / TILE_SIZE));
    const startY = Math.max(0, Math.floor(camY / TILE_SIZE));
    const endX = Math.min(this.width, Math.ceil((camX + CANVAS_WIDTH) / TILE_SIZE) + 1);
    const endY = Math.min(this.height, Math.ceil((camY + CANVAS_HEIGHT) / TILE_SIZE) + 1);
    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        const tile = this.tiles[y][x];
        if (tile === TILE.AIR) continue;
        const px = Math.round(x * TILE_SIZE - camX);
        const py = Math.round(y * TILE_SIZE - camY);
        this.renderTile(ctx, tile, px, py, animTimer);
      }
    }
  }
  renderTile(ctx, tile, x, y, animTimer) {
    const color = this.tileColors[tile];
    if (!color) return;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    if (tile === TILE.SOLID) {
      ctx.fillStyle = '#6B3410';
      ctx.fillRect(x, y, TILE_SIZE, 2);
      ctx.fillRect(x, y, 2, TILE_SIZE);
    } else if (tile === TILE.BRICK) {
      ctx.fillStyle = '#6B4226';
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = '#8B5E3C';
      ctx.fillRect(x + 1, y + 1, TILE_SIZE / 2 - 2, TILE_SIZE / 2 - 2);
      ctx.fillRect(x + TILE_SIZE / 2, y + 1, TILE_SIZE / 2 - 2, TILE_SIZE / 2 - 2);
      ctx.fillRect(x + 1, y + TILE_SIZE / 2, TILE_SIZE / 2 - 2, TILE_SIZE / 2 - 2);
      ctx.fillRect(x + TILE_SIZE / 2, y + TILE_SIZE / 2, TILE_SIZE / 2 - 2, TILE_SIZE / 2 - 2);
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(x, y, TILE_SIZE, 1);
      ctx.fillRect(x, y, 1, TILE_SIZE);
    } else if (tile === TILE.QUESTION) {
      const bounce = Math.sin(animTimer * 0.1) * 1;
      ctx.fillStyle = '#ddaa00';
      ctx.fillRect(x + 2, y + 2 + bounce, TILE_SIZE - 4, TILE_SIZE - 4);
      ctx.fillStyle = '#fff';
      ctx.fillRect(x + 13, y + 12 + bounce, 6, 2);
      ctx.fillRect(x + 15, y + 14 + bounce, 2, 4);
    } else if (tile === TILE.SPIKE) {
      ctx.fillStyle = '#ff4444';
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(x + i * 8, y + TILE_SIZE);
        ctx.lineTo(x + i * 8 + 4, y);
        ctx.lineTo(x + i * 8 + 8, y + TILE_SIZE);
        ctx.fill();
      }
    } else if (tile === TILE.WATER) {
      const wave = Math.sin(animTimer * 0.05 + x * 0.3) * 2;
      ctx.fillStyle = '#2244aa';
      ctx.globalAlpha = 0.6;
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = '#4466cc';
      ctx.fillRect(x, y + 5 + wave, TILE_SIZE, 2);
      ctx.globalAlpha = 1;
    } else if (tile === TILE.LAVA) {
      const glow = Math.sin(animTimer * 0.08 + x * 0.5) * 3;
      ctx.fillStyle = '#ff4400';
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = '#ffaa00';
      ctx.fillRect(x + 2, y + 4 + glow, TILE_SIZE - 4, 3);
      ctx.fillStyle = '#ffcc00';
      ctx.fillRect(x + 4, y + 3 + glow, TILE_SIZE - 8, 2);
    } else if (tile === TILE.LADDER) {
      ctx.fillStyle = '#d4a574';
      ctx.fillRect(x + 8, y, 4, TILE_SIZE);
      ctx.fillRect(x + 4, y + 8, 16, 2);
      ctx.fillRect(x + 4, y + 20, 16, 2);
    } else if (tile === TILE.COIN) {
      const bob = Math.sin(animTimer * 0.08 + x + y) * 2;
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2 + bob, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffec80';
      ctx.beginPath();
      ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2 + bob, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (tile === TILE.GEM) {
      const bob = Math.sin(animTimer * 0.06 + x * 1.5) * 2;
      ctx.fillStyle = '#00ffff';
      ctx.beginPath();
      ctx.moveTo(x + 8, y + 4 + bob);
      ctx.lineTo(x + 24, y + 4 + bob);
      ctx.lineTo(x + 28, y + 16 + bob);
      ctx.lineTo(x + 16, y + 28 + bob);
      ctx.lineTo(x + 4, y + 16 + bob);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#88ffff';
      ctx.beginPath();
      ctx.moveTo(x + 12, y + 10 + bob);
      ctx.lineTo(x + 20, y + 10 + bob);
      ctx.lineTo(x + 22, y + 16 + bob);
      ctx.lineTo(x + 16, y + 22 + bob);
      ctx.lineTo(x + 10, y + 16 + bob);
      ctx.closePath();
      ctx.fill();
    } else if (tile === TILE.CHECKPOINT) {
      const glow = Math.sin(animTimer * 0.05) * 0.3 + 0.7;
      ctx.fillStyle = '#00ff88';
      ctx.globalAlpha = glow;
      ctx.fillRect(x + 4, y, 4, TILE_SIZE);
      ctx.fillRect(x + 12, y, 4, TILE_SIZE);
      ctx.fillRect(x + 4, y, 12, 4);
      ctx.fillRect(x + 4, y + TILE_SIZE - 4, 12, 4);
      ctx.fillStyle = '#00ff88';
      ctx.fillRect(x + 8, y + 4, 4, 4);
      ctx.globalAlpha = 1;
    } else if (tile === TILE.EXIT) {
      const glow = Math.sin(animTimer * 0.06) * 0.3 + 0.7;
      ctx.fillStyle = '#1a0033';
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      ctx.globalAlpha = glow;
      ctx.fillStyle = '#8844ff';
      ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
      ctx.fillStyle = '#aa66ff';
      ctx.fillRect(x + 6, y + 6, TILE_SIZE - 12, TILE_SIZE - 12);
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(x + 10, y + 10, TILE_SIZE - 20, TILE_SIZE - 20);
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('▶', x + TILE_SIZE / 2, y + TILE_SIZE - 8);
    } else if (tile === TILE.ICE) {
      ctx.fillStyle = '#aaddff';
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = '#cceeFF';
      ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, 2);
    } else if (tile === TILE.SAND) {
      ctx.fillStyle = '#d4a574';
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = '#c49464';
      ctx.fillRect(x, y, TILE_SIZE, 1);
    } else if (tile === TILE.SNOW) {
      ctx.fillStyle = '#eeeeff';
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = '#ddddee';
      ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, 2);
    } else if (tile === TILE.BOUNCE) {
      ctx.fillStyle = '#ff88ff';
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = '#ffaaff';
      ctx.fillRect(x + 4, y + 4, TILE_SIZE - 8, TILE_SIZE - 8);
      ctx.fillStyle = '#fff';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('^', x + TILE_SIZE / 2, y + TILE_SIZE - 6);
    } else if (tile === TILE.CONVEYOR_LEFT || tile === TILE.CONVEYOR_RIGHT) {
      ctx.fillStyle = '#888';
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = '#aaa';
      for (let i = 0; i < 4; i++) {
        const off = (animTimer * 2 + i * TILE_SIZE / 4) % TILE_SIZE;
        ctx.fillRect(x + off, y + 6, 4, 2);
        ctx.fillRect(x + off, y + 14, 4, 2);
        ctx.fillRect(x + off, y + 22, 4, 2);
      }
    }
  }
}
