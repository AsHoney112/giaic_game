class Camera {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.shakeX = 0;
    this.shakeY = 0;
    this.shakeIntensity = 0;
    this.shakeDecay = 0.9;
    this.followTarget = null;
    this.bounds = null;
    this.smoothing = 0.08;
    this.offsetX = 0;
    this.offsetY = 0;
    this.flashTimer = 0;
    this.flashColor = '#fff';
    this.flashAlpha = 0;
  }
  follow(entity, offsetX = 200, offsetY = 0) {
    this.followTarget = entity;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }
  setBounds(x, y, w, h) {
    this.bounds = { x, y, w, h };
  }
  shake(intensity = 5, duration = 10) {
    this.shakeIntensity = intensity;
  }
  flash(color = '#fff', duration = 10) {
    this.flashColor = color;
    this.flashTimer = duration;
    this.flashAlpha = 0.5;
  }
  update() {
    if (this.followTarget) {
      const targetScreenX = this.followTarget.x + this.followTarget.w / 2 - this.offsetX;
      const targetScreenY = this.followTarget.y + this.followTarget.h / 2 - CANVAS_HEIGHT / 2;
      this.targetX = targetScreenX;
      this.targetY = targetScreenY;
    }
    this.x = MathUtils.lerp(this.x, this.targetX, this.smoothing);
    this.y = MathUtils.lerp(this.y, this.targetY, this.smoothing);
    if (this.bounds) {
      this.x = MathUtils.clamp(this.x, this.bounds.x, this.bounds.x + this.bounds.w - CANVAS_WIDTH);
      this.y = MathUtils.clamp(this.y, this.bounds.y, this.bounds.y + this.bounds.h - CANVAS_HEIGHT);
    }
    if (this.shakeIntensity > 0.5) {
      this.shakeX = (Math.random() * 2 - 1) * this.shakeIntensity;
      this.shakeY = (Math.random() * 2 - 1) * this.shakeIntensity;
      this.shakeIntensity *= this.shakeDecay;
    } else {
      this.shakeX = 0;
      this.shakeY = 0;
      this.shakeIntensity = 0;
    }
    if (this.flashTimer > 0) {
      this.flashTimer--;
      this.flashAlpha = 0.5 * (this.flashTimer / 10);
    } else {
      this.flashAlpha = 0;
    }
  }
  getViewX() { return Math.round(this.x + this.shakeX); }
  getViewY() { return Math.round(this.y + this.shakeY); }
  draw(ctx) {
    if (this.flashAlpha > 0) {
      ctx.fillStyle = this.flashColor;
      ctx.globalAlpha = this.flashAlpha;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.globalAlpha = 1;
    }
  }
  reset() {
    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.shakeX = 0;
    this.shakeY = 0;
    this.shakeIntensity = 0;
    this.flashTimer = 0;
    this.flashAlpha = 0;
  }
}
