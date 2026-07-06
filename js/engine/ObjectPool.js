class ObjectPool {
  constructor(factoryFn, resetFn, initialSize = 0) {
    this.factory = factoryFn;
    this.reset = resetFn;
    this.pool = [];
    this.active = [];
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.factory());
    }
  }
  get() {
    let obj;
    if (this.pool.length > 0) {
      obj = this.pool.pop();
    } else {
      obj = this.factory();
    }
    this.active.push(obj);
    return obj;
  }
  release(obj) {
    const idx = this.active.indexOf(obj);
    if (idx !== -1) {
      this.active.splice(idx, 1);
      if (this.reset) this.reset(obj);
      this.pool.push(obj);
    }
  }
  releaseAll() {
    for (const obj of this.active) {
      if (this.reset) this.reset(obj);
      this.pool.push(obj);
    }
    this.active.length = 0;
  }
  getActiveCount() { return this.active.length; }
  getPoolSize() { return this.pool.length; }
  forEach(fn) {
    for (let i = this.active.length - 1; i >= 0; i--) {
      fn(this.active[i], i);
    }
  }
}
