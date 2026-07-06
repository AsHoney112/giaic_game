class Entity {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.vx = 0;
    this.vy = 0;
    this.onGround = false;
    this.onWall = false;
    this.wallDir = 0;
    this.inWater = false;
    this.onLadder = false;
    this.facing = 1;
    this.active = true;
    this.alive = true;
    this.type = 'entity';
    this.id = Entity._nextId++;
    this.removed = false;
  }
  get left() { return this.x; }
  get right() { return this.x + this.w; }
  get top() { return this.y; }
  get bottom() { return this.y + this.h; }
  get centerX() { return this.x + this.w / 2; }
  get centerY() { return this.y + this.h / 2; }
  get rect() { return { x: this.x, y: this.y, w: this.w, h: this.h }; }
  collidesWith(other) {
    return this.x < other.x + other.w &&
           this.x + this.w > other.x &&
           this.y < other.y + other.h &&
           this.y + this.h > other.y;
  }
  overlaps(ox, oy, ow, oh) {
    return this.x < ox + ow && this.x + this.w > ox &&
           this.y < oy + oh && this.y + this.h > oy;
  }
  distanceTo(other) {
    return MathUtils.dist(this.centerX, this.centerY, other.centerX, other.centerY);
  }
  applyGravity() {
    if (!this.inWater && !this.onLadder) {
      this.vy += GRAVITY;
      if (this.vy > MAX_FALL_SPEED) this.vy = MAX_FALL_SPEED;
    } else if (this.inWater) {
      this.vy += GRAVITY * 0.3;
      if (this.vy > MAX_FALL_SPEED * 0.5) this.vy = MAX_FALL_SPEED * 0.5;
    }
  }
  update(dt) {}
  render(ctx, camX, camY) {
    if (!this.active) return;
    ctx.fillStyle = '#f0f';
    ctx.fillRect(Math.round(this.x - camX), Math.round(this.y - camY), this.w, this.h);
  }
  remove() { this.removed = true; this.active = false; }
}
Entity._nextId = 0;
