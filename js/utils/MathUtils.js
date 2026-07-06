const MathUtils = {
  lerp(a, b, t) { return a + (b - a) * t; },
  clamp(v, min, max) { return Math.max(min, Math.min(max, v)); },
  dist(x1, y1, x2, y2) { return Math.hypot(x2 - x1, y2 - y1); },
  distSq(x1, y1, x2, y2) { const dx = x2 - x1; const dy = y2 - y1; return dx * dx + dy * dy; },
  rectOverlap(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x &&
           a.y < b.y + b.h && a.y + a.h > b.y;
  },
  pointInRect(px, py, r) {
    return px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;
  },
  rand(min, max) { return Math.random() * (max - min) + min; },
  randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; },
  randSign() { return Math.random() < 0.5 ? -1 : 1; },
  choose(arr) { return arr[Math.floor(Math.random() * arr.length)]; },
  approach(current, target, maxDelta) {
    if (Math.abs(target - current) <= maxDelta) return target;
    return current + Math.sign(target - current) * maxDelta;
  },
  angle(x1, y1, x2, y2) { return Math.atan2(y2 - y1, x2 - x1); }
};
