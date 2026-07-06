class Level2 extends Level {
  constructor() {
    super(2);
    this.name = 'Deep Forest';
    this.description = 'Navigate through the ancient, mysterious forest';
    this.width = 100;
    this.height = 16;
    this.bgTop = '#1a3a2a';
    this.bgBottom = '#0a1a15';
    this.weather = 'none';
    this.weatherIntensity = 0;
    this.parallaxLayers = [
      { type: 'trees', speed: 0.1, y: 100, color: '#1a3a1a', alpha: 0.4 },
      { type: 'trees', speed: 0.2, y: 150, color: '#2a4a2a', alpha: 0.3 },
      { type: 'hills', speed: 0.3, y: 200, color: '#2a5a2a', alpha: 0.2 }
    ];
    this.playerStart = { x: 96, y: 320 };
    this.bossType = null;
  }
  buildLevel() {
    this.tileMap = new TileMap(this.width, this.height);
    this.tileMap.initEmpty();
    for (let x = 0; x < this.width; x++) {
      this.tileMap.setTile(x, 14, TILE.SOLID);
      this.tileMap.setTile(x, 15, TILE.SOLID);
    }
    for (let y = 0; y < this.height; y++) {
      this.tileMap.setTile(0, y, TILE.SOLID);
      this.tileMap.setTile(99, y, TILE.SOLID);
    }
    const platforms = [
      [5, 12, 3], [12, 9, 4], [20, 11, 3], [28, 8, 4],
      [36, 11, 3], [44, 9, 4], [52, 12, 3], [60, 9, 4],
      [68, 11, 3], [76, 8, 4], [84, 11, 3], [91, 9, 3]
    ];
    for (const [x, y, w] of platforms) {
      for (let i = 0; i < w; i++) {
        this.tileMap.setTile(x + i, y, TILE.SOLID);
      }
    }
    const coins = [
      [3, 12], [7, 11], [10, 8], [14, 12], [18, 10],
      [22, 12], [26, 7], [30, 12], [34, 10], [38, 12],
      [42, 8], [46, 12], [50, 11], [54, 12], [58, 8],
      [62, 12], [66, 10], [70, 12], [74, 7], [78, 12],
      [82, 10], [86, 12], [90, 10], [93, 8], [96, 12]
    ];
    for (const [x, y] of coins) {
      this.tileMap.setTile(x, y, TILE.COIN);
    }
    const gems = [[27, 7], [45, 8], [75, 7], [92, 9]];
    for (const [x, y] of gems) {
      this.tileMap.setTile(x, y, TILE.GEM);
    }
    this.checkpoints.push({ x: 33 * TILE_SIZE, y: 13 * TILE_SIZE, activated: false });
    this.checkpoints.push({ x: 66 * TILE_SIZE, y: 13 * TILE_SIZE, activated: false });
    const gx = 96;
    this.tileMap.setTile(gx, 13, TILE.EXIT);
    this.tileMap.setTile(gx + 1, 13, TILE.EXIT);
    this.tileMap.setTile(gx + 2, 13, TILE.EXIT);
    for (let i = 4; i <= 12; i++) {
      this.tileMap.setTile(gx - 1, i, TILE.BRICK);
      this.tileMap.setTile(gx, i, TILE.SOLID);
      this.tileMap.setTile(gx + 1, i, TILE.SOLID);
      this.tileMap.setTile(gx + 2, i, TILE.SOLID);
    }
    this.tileMap.setTile(gx - 1, 3, TILE.BRICK);
    this.tileMap.setTile(gx, 3, TILE.BRICK);
    this.tileMap.setTile(gx + 1, 3, TILE.BRICK);
    this.tileMap.setTile(gx + 2, 3, TILE.BRICK);
    this.tileMap.setTile(gx + 3, 3, TILE.BRICK);
    for (let i = 4; i <= 12; i++) {
      this.tileMap.setTile(gx + 3, i, TILE.BRICK);
    }
    this.exitX = gx * TILE_SIZE + TILE_SIZE + 16;
    this.exitY = 13 * TILE_SIZE;
  }
}
