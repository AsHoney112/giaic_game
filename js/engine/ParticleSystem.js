class ParticleSystem {
  constructor() {
    this.particles = [];
    this.emitters = [];
  }
  emit(x, y, count, config = {}) {
    const {
      speed = 2, spread = 1, lifetime = 30, size = 3,
      color = '#fff', colors = null, gravity = 0.05,
      fadeOut = true, shrink = true, angle = 0, angleSpread = Math.PI * 2,
      onUpdate = null
    } = config;
    for (let i = 0; i < count; i++) {
      const a = angle + (Math.random() - 0.5) * angleSpread;
      const spd = Math.random() * speed;
      const p = {
        x, y,
        vx: Math.cos(a) * spd,
        vy: Math.sin(a) * spd,
        life: Math.floor(Math.random() * lifetime * 0.5 + lifetime * 0.5),
        maxLife: lifetime,
        size: Math.random() * size + 1,
        startSize: Math.random() * size + 1,
        color: colors ? colors[Math.floor(Math.random() * colors.length)] : color,
        gravity,
        fadeOut,
        shrink,
        onUpdate,
        alpha: 1,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.1
      };
      this.particles.push(p);
    }
  }
  emitBurst(x, y, config = {}) {
    this.emit(x, y, config.count || 10, { angleSpread: Math.PI * 2, ...config });
  }
  emitLine(x1, y1, x2, y2, config = {}) {
    const count = config.count || 5;
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const x = MathUtils.lerp(x1, x2, t);
      const y = MathUtils.lerp(y1, y2, t);
      this.emit(x, y, 1, config);
    }
  }
  addEmitter(emitter) {
    this.emitters.push(emitter);
  }
  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.99;
      p.vy *= 0.99;
      p.life--;
      if (p.fadeOut) p.alpha = p.life / p.maxLife;
      if (p.shrink) p.size = p.startSize * (p.life / p.maxLife);
      p.rotation += p.rotSpeed;
      if (p.onUpdate) p.onUpdate(p);
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
    for (let i = this.emitters.length - 1; i >= 0; i--) {
      const e = this.emitters[i];
      e.timer--;
      if (e.timer <= 0) { this.emitters.splice(i, 1); continue; }
      this.emit(e.x, e.y, e.count || 1, e.config);
    }
  }
  draw(ctx, camX, camY) {
    for (const p of this.particles) {
      const sx = Math.round(p.x - camX);
      const sy = Math.round(p.y - camY);
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(sx, sy);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    }
  }
  clear() {
    this.particles.length = 0;
    this.emitters.length = 0;
  }
}
