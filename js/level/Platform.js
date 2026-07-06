class MovingPlatform {
  constructor(x, y, w, h, type) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.type = type;
    this.startX = x;
    this.startY = y;
    this.vx = 0;
    this.vy = 0;
    this.moveSpeed = 1.5;
    this.moveRange = 80;
    this.moveDir = 1;
    this.angle = 0;
    this.swingSpeed = 0.02;
    this.swingRadius = 60;
    this.active = true;
    this.fallTimer = 0;
    this.isFalling = false;
    this.fallen = false;
    this.passengers = [];
  }
  update() {
    switch (this.type) {
      case 'horizontal':
        if (this.x > this.startX + this.moveRange) this.moveDir = -1;
        if (this.x < this.startX - this.moveRange) this.moveDir = 1;
        this.vx = this.moveSpeed * this.moveDir;
        this.x += this.vx;
        break;
      case 'vertical':
        if (this.y > this.startY + this.moveRange) this.moveDir = -1;
        if (this.y < this.startY - this.moveRange) this.moveDir = 1;
        this.vy = this.moveSpeed * this.moveDir;
        this.y += this.vy;
        break;
      case 'falling':
        if (this.isFalling && !this.fallen) {
          this.fallTimer++;
          if (this.fallTimer > 30) {
            this.vy += 0.3;
            this.y += this.vy;
            if (this.vy > 8) this.fallen = true;
          }
        }
        break;
      case 'swing':
        this.angle += this.swingSpeed;
        this.x = this.startX + Math.sin(this.angle) * this.swingRadius;
        this.y = this.startY + Math.cos(this.angle) * this.swingRadius * 0.3;
        this.vx = Math.cos(this.angle) * this.swingRadius * this.swingSpeed;
        this.vy = -Math.sin(this.angle) * this.swingRadius * 0.3 * this.swingSpeed;
        break;
    }
  }
  startFalling() {
    if (this.type === 'falling' && !this.isFalling && !this.fallen) {
      this.isFalling = true;
    }
  }
  reset() {
    this.x = this.startX;
    this.y = this.startY;
    this.vx = 0;
    this.vy = 0;
    this.fallTimer = 0;
    this.isFalling = false;
    this.fallen = false;
    this.angle = 0;
    this.passengers = [];
  }
  get rect() { return { x: this.x, y: this.y, w: this.w, h: this.h }; }
  render(ctx, camX, camY) {
    if (this.fallen) return;
    const sx = Math.round(this.x - camX);
    const sy = Math.round(this.y - camY);
    if (this.type === 'falling') {
      ctx.fillStyle = '#ffaa88';
    } else if (this.type === 'swing') {
      ctx.fillStyle = '#ff88aa';
      ctx.strokeStyle = '#885566';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(Math.round(this.startX - camX), Math.round(this.startY - camY));
      ctx.lineTo(sx + this.w / 2, sy);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#88aaff';
    }
    ctx.fillRect(sx, sy, this.w, this.h);
    ctx.fillStyle = '#fff';
    ctx.fillRect(sx + 2, sy + 2, this.w - 4, 2);
  }
}
