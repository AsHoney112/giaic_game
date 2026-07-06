class HUD {
  constructor() {
    this.visible = true;
    this.animTimer = 0;
    this.messageText = '';
    this.messageTimer = 0;
    this.messageColor = '#fff';
  }
  showMessage(text, duration = 90, color = '#fff') {
    this.messageText = text;
    this.messageTimer = duration;
    this.messageColor = color;
  }
  update(dt) {
    this.animTimer += dt;
    if (this.messageTimer > 0) this.messageTimer--;
  }
  render(ctx, player, level) {
    if (!this.visible) return;
    ctx.save();
    this.drawHealth(ctx, player);
    this.drawLives(ctx, player);
    this.drawCoins(ctx, player);
    this.drawScore(ctx, player);
    this.drawTimer(ctx, level);
    this.drawMiniMap(ctx, player, level);
    this.drawMessage(ctx);
    this.drawControls(ctx);
    ctx.restore();
  }
  drawHealth(ctx, player) {
    const x = 10, y = 10;
    ctx.fillStyle = '#333';
    ctx.fillRect(x - 1, y - 1, 106, 18);
    ctx.fillStyle = '#444';
    ctx.fillRect(x, y, 104, 16);
    ctx.fillStyle = '#ff4444';
    for (let i = 0; i < player.health; i++) {
      ctx.fillRect(x + 4 + i * 20, y + 3, 16, 10);
    }
    ctx.fillStyle = '#ff8888';
    for (let i = 0; i < player.health; i++) {
      ctx.fillRect(x + 5 + i * 20, y + 4, 6, 8);
    }
    ctx.fillStyle = '#fff';
    ctx.font = '10px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('HP', x + 90, y + 12);
    if (player.hasShield) {
      ctx.fillStyle = '#4488ff';
      ctx.fillRect(x + 106, y, 18, 16);
      ctx.fillStyle = '#fff';
      ctx.font = '8px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('S', x + 115, y + 12);
    }
  }
  drawLives(ctx, player) {
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Lives: ' + player.lives, 10, 44);
    ctx.fillStyle = '#ff4444';
    ctx.fillRect(55, 35, 8, 8);
  }
  drawCoins(ctx, player) {
    ctx.fillStyle = '#ffd700';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Coins: ' + player.coins, 10, 62);
    ctx.fillStyle = '#00ffff';
    ctx.fillText('Gems: ' + player.gems, 10, 80);
  }
  drawScore(ctx, player) {
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('Score: ' + player.score, CANVAS_WIDTH - 10, 16);
  }
  drawTimer(ctx, level) {
    ctx.fillStyle = '#ccc';
    ctx.font = '11px Arial';
    ctx.textAlign = 'right';
    const mins = Math.floor(level.timer / 60 / 60);
    const secs = Math.floor((level.timer / 60) % 60);
    ctx.fillText('TIME: ' + String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0'), CANVAS_WIDTH - 10, 34);
  }
  drawMiniMap(ctx, player, level) {
    const mmX = CANVAS_WIDTH - 110;
    const mmY = 44;
    const mmW = 100;
    const mmH = 40;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(mmX, mmY, mmW, mmH);
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1;
    ctx.strokeRect(mmX, mmY, mmW, mmH);
    if (level && level.tileMap) {
      const scaleX = mmW / (level.tileMap.width * TILE_SIZE);
      const scaleY = mmH / (level.tileMap.height * TILE_SIZE);
      ctx.fillStyle = '#666';
      const solids = level.tileMap.tiles;
      for (let ty = 0; ty < level.tileMap.height; ty++) {
        for (let tx = 0; tx < level.tileMap.width; tx++) {
          if (solids[ty][tx] !== TILE.AIR && !level.tileMap.tilePassable[solids[ty][tx]]) {
            ctx.fillRect(mmX + tx * TILE_SIZE * scaleX, mmY + ty * TILE_SIZE * scaleY,
              Math.max(1, TILE_SIZE * scaleX), Math.max(1, TILE_SIZE * scaleY));
          }
        }
      }
      if (level.checkpoints) {
        ctx.fillStyle = '#00ff88';
        for (const cp of level.checkpoints) {
          ctx.fillRect(mmX + cp.x * scaleX, mmY + cp.y * scaleY, 2, 2);
        }
      }
      ctx.fillStyle = '#44ff44';
      ctx.fillRect(mmX + level.exitX * scaleX, mmY + level.exitY * scaleY, 3, 3);
    }
    ctx.fillStyle = '#ff0';
    ctx.fillRect(mmX + player.x / (level.tileMap.width * TILE_SIZE) * mmW - 1,
      mmY + player.y / (level.tileMap.height * TILE_SIZE) * mmH - 1, 3, 3);
  }
  drawMessage(ctx) {
    if (this.messageTimer > 0) {
      ctx.fillStyle = this.messageColor;
      ctx.globalAlpha = Math.min(1, this.messageTimer / 30);
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(this.messageText, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);
      ctx.globalAlpha = 1;
    }
  }
  drawControls(ctx) {
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '9px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Arrow Keys/WASD: Move  Space: Jump  Shift: Dash  X: Pound  Esc: Pause', 10, CANVAS_HEIGHT - 10);
  }
}
