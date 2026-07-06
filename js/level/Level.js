class Level {
  constructor(num) {
    this.num = num;
    this.name = '';
    this.description = '';
    this.width = 100;
    this.height = 15;
    this.tileMap = null;
    this.playerStart = { x: 64, y: 300 };
    this.enemies = [];
    this.powerups = [];
    this.platforms = [];
    this.checkpoints = [];
    this.exitX = 0;
    this.exitY = 0;
    this.background = '#1a1a2e';
    this.parallaxLayers = [];
    this.weather = 'none';
    this.weatherIntensity = 0;
    this.timer = 0;
    this.completed = false;
    this.secretCoins = 0;
    this.secretRooms = [];
    this.bossType = null;
    this.bossX = 0;
    this.bossY = 0;
  }
  init() {
    this.buildLevel();
  }
  buildLevel() {}
  getTileMap() { return this.tileMap; }
  update(dt) {
    this.timer += dt;
    for (const p of this.platforms) {
      p.update();
    }
  }
  renderBackground(ctx, camX, camY, animTimer) {
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, this.bgTop || '#4488cc');
    gradient.addColorStop(1, this.bgBottom || '#224488');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    for (const layer of this.parallaxLayers) {
      this.renderParallaxLayer(ctx, layer, camX, camY, animTimer);
    }
  }
  renderParallaxLayer(ctx, layer, camX, camY, animTimer) {
    const speed = layer.speed || 0.2;
    const px = (-camX * speed) % CANVAS_WIDTH;
    const py = layer.y || 0;
    ctx.fillStyle = layer.color || '#fff';
    ctx.globalAlpha = layer.alpha || 0.3;
    if (layer.type === 'mountains') {
      for (let i = -1; i < 3; i++) {
        const mx = px + i * CANVAS_WIDTH;
        ctx.beginPath();
        ctx.moveTo(mx, CANVAS_HEIGHT);
        for (let x = 0; x <= CANVAS_WIDTH; x += 40) {
          const h = Math.sin((x + px) * 0.005) * 40 + Math.sin((x + px) * 0.01) * 20 + 50;
          ctx.lineTo(mx + x, CANVAS_HEIGHT - h - py);
        }
        ctx.lineTo(mx + CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.closePath();
        ctx.fill();
      }
    } else if (layer.type === 'hills') {
      for (let i = -1; i < 3; i++) {
        const mx = px + i * CANVAS_WIDTH;
        ctx.beginPath();
        ctx.moveTo(mx, CANVAS_HEIGHT);
        for (let x = 0; x <= CANVAS_WIDTH; x += 20) {
          const h = Math.sin((x + mx) * 0.008) * 30 + 20;
          ctx.lineTo(mx + x, CANVAS_HEIGHT - h - py);
        }
        ctx.lineTo(mx + CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.closePath();
        ctx.fill();
      }
    } else if (layer.type === 'clouds') {
      for (let i = 0; i < 6; i++) {
        const cx = (px + i * 150 + animTimer * layer.speed * 0.5) % (CANVAS_WIDTH + 200) - 100;
        const cy = py + Math.sin(i * 2) * 20;
        ctx.fillStyle = layer.color || '#fff';
        ctx.beginPath();
        ctx.arc(cx, cy, 20 + i * 3, 0, Math.PI * 2);
        ctx.arc(cx + 25, cy - 5, 15 + i * 2, 0, Math.PI * 2);
        ctx.arc(cx + 45, cy, 18 + i * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (layer.type === 'trees') {
      for (let i = 0; i < 5; i++) {
        const tx = (px + i * 200) % (CANVAS_WIDTH + 100) - 50;
        ctx.fillStyle = layer.color || '#2a5a2a';
        ctx.fillRect(tx + 8, CANVAS_HEIGHT - py - 60, 8, 60);
        ctx.beginPath();
        ctx.moveTo(tx, CANVAS_HEIGHT - py - 60);
        ctx.lineTo(tx + 12, CANVAS_HEIGHT - py - 100);
        ctx.lineTo(tx + 24, CANVAS_HEIGHT - py - 60);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }
  renderWeather(ctx, animTimer) {
    if (this.weather === 'rain') {
      ctx.strokeStyle = '#4488ff';
      ctx.globalAlpha = 0.3;
      ctx.lineWidth = 1;
      for (let i = 0; i < this.weatherIntensity; i++) {
        const rx = (i * 137 + animTimer * 3) % CANVAS_WIDTH;
        const ry = (i * 97 + animTimer * 6) % CANVAS_HEIGHT;
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx - 2, ry + 12);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    } else if (this.weather === 'snow') {
      for (let i = 0; i < this.weatherIntensity; i++) {
        const rx = (i * 157 + animTimer * 1.5) % CANVAS_WIDTH;
        const ry = (i * 113 + animTimer * 2) % CANVAS_HEIGHT;
        ctx.fillStyle = '#fff';
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(rx, ry, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
  }
  renderPlatforms(ctx, camX, camY) {
    for (const p of this.platforms) {
      p.render(ctx, camX, camY);
    }
  }
  getSolidTiles() {
    const solids = [];
    if (!this.tileMap) return solids;
    for (let y = 0; y < this.tileMap.height; y++) {
      for (let x = 0; x < this.tileMap.width; x++) {
        const tile = this.tileMap.tiles[y][x];
        if (tile !== TILE.AIR && !this.tileMap.tilePassable[tile]) {
          solids.push({ x: x * TILE_SIZE, y: y * TILE_SIZE, w: TILE_SIZE, h: TILE_SIZE, tile });
        }
      }
    }
    return solids;
  }
}
