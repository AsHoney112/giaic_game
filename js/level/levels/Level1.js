class Level1 extends Level {
  constructor() {
    super(1);
    this.name = 'Sunny Grasslands';
    this.description = 'Begin your journey through the sunny grasslands';
    this.width = 100;
    this.height = 16;
    this.background = '#4a8fcc';
    this.bgTop = '#5599dd';
    this.bgBottom = '#336699';
    this.weather = 'none';
    this.weatherIntensity = 0;
    this.parallaxLayers = [
      { type: 'clouds', speed: 0.1, y: 40, color: '#fff', alpha: 0.5 },
      { type: 'mountains', speed: 0.15, y: 100, color: '#3a6a3a', alpha: 0.3 },
      { type: 'hills', speed: 0.3, y: 200, color: '#4a8a4a', alpha: 0.4 }
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
      [6, 12, 3], [14, 10, 3], [22, 11, 3], [30, 9, 3],
      [38, 11, 3], [46, 10, 3], [54, 12, 3], [62, 10, 3],
      [70, 11, 3], [78, 9, 3], [86, 11, 3]
    ];
    for (const [x, y, w] of platforms) {
      for (let i = 0; i < w; i++) {
        this.tileMap.setTile(x + i, y, TILE.SOLID);
      }
    }
    const coins = [
      [3, 12], [8, 11], [12, 12], [16, 9], [20, 12],
      [24, 10], [28, 12], [32, 8], [36, 12], [40, 10],
      [44, 12], [48, 9], [52, 12], [56, 11], [60, 12],
      [64, 9], [68, 12], [72, 10], [76, 12], [80, 8],
      [84, 12], [88, 10], [92, 12]
    ];
    for (const [x, y] of coins) {
      this.tileMap.setTile(x, y, TILE.COIN);
    }
    const gems = [[35, 8], [50, 9], [75, 10], [89, 9]];
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
