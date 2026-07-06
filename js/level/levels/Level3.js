class Level3 extends Level {
  constructor() {
    super(3);
    this.name = 'Ancient Desert';
    this.description = 'Brave the scorching heat of the ancient desert';
    this.width = 100;
    this.height = 16;
    this.bgTop = '#d4a060';
    this.bgBottom = '#8a6030';
    this.weather = 'none';
    this.weatherIntensity = 0;
    this.parallaxLayers = [
      { type: 'mountains', speed: 0.1, y: 50, color: '#c4a040', alpha: 0.3 },
      { type: 'hills', speed: 0.2, y: 120, color: '#b49050', alpha: 0.4 },
      { type: 'clouds', speed: 0.05, y: 30, color: '#ffeecc', alpha: 0.2 }
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
      [4, 12, 4], [13, 9, 4], [22, 11, 4], [31, 8, 4],
      [40, 11, 4], [49, 9, 4], [58, 12, 4], [67, 9, 4],
      [76, 11, 4], [85, 8, 4], [93, 10, 3]
    ];
    for (const [x, y, w] of platforms) {
      for (let i = 0; i < w; i++) {
        this.tileMap.setTile(x + i, y, TILE.SOLID);
      }
    }
    const coins = [
      [2, 12], [6, 11], [10, 8], [15, 12], [19, 10],
      [24, 12], [28, 7], [33, 12], [37, 10], [42, 12],
      [46, 8], [51, 12], [55, 11], [60, 12], [64, 8],
      [69, 12], [73, 10], [78, 12], [82, 7], [87, 12],
      [91, 10], [95, 9], [97, 12]
    ];
    for (const [x, y] of coins) {
      this.tileMap.setTile(x, y, TILE.COIN);
    }
    const gems = [[30, 7], [48, 8], [81, 7], [94, 9]];
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
