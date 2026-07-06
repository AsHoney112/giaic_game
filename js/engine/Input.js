class InputManager {
  constructor() {
    this.keys = {};
    this.keysJustPressed = {};
    this.keysJustReleased = {};
    this.touches = {};
    this.gamepads = [];
    this.gamepadConnected = false;
    this.capturingKey = null;
    this.captureCallback = null;
    this.defaultBindings = {
      moveLeft: ['a', 'A', 'ArrowLeft'],
      moveRight: ['d', 'D', 'ArrowRight'],
      moveUp: ['w', 'W', 'ArrowUp'],
      moveDown: ['s', 'S', 'ArrowDown'],
      jump: [' '],
      dash: ['e', 'E'],
      crouch: ['Shift'],
      pound: ['q', 'Q'],
      pause: ['Escape', 'p', 'P']
    };
    this.bindings = {};
    this.loadBindings();
    this.setupKeyboard();
    this.setupTouch();
    this.setupGamepad();
  }
  loadBindings() {
    const saved = saveSystem ? saveSystem.data.controls : null;
    if (saved) {
      for (const action of Object.keys(this.defaultBindings)) {
        this.bindings[action] = saved[action] || [...this.defaultBindings[action]];
      }
    } else {
      for (const [action, keys] of Object.entries(this.defaultBindings)) {
        this.bindings[action] = [...keys];
      }
    }
  }
  saveBindings() {
    if (saveSystem) {
      saveSystem.data.controls = {};
      for (const [action, keys] of Object.entries(this.bindings)) {
        saveSystem.data.controls[action] = [...keys];
      }
      saveSystem.save();
    }
  }
  resetBindings() {
    for (const [action, keys] of Object.entries(this.defaultBindings)) {
      this.bindings[action] = [...keys];
    }
    this.saveBindings();
  }
  startCapture(action, callback) {
    this.capturingKey = action;
    this.captureCallback = callback;
  }
  setupKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (this.capturingKey) {
        e.preventDefault();
        if (e.key === 'Escape') {
          this.capturingKey = null;
          if (this.captureCallback) {
            this.captureCallback(null, null);
            this.captureCallback = null;
          }
          return;
        }
        const action = this.capturingKey;
        const key = e.key === ' ' ? 'Space' : e.key;
        this.bindings[action] = [key];
        this.capturingKey = null;
        this.saveBindings();
        if (this.captureCallback) {
          this.captureCallback(action, key);
          this.captureCallback = null;
        }
        return;
      }
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) {
        e.preventDefault();
      }
      if (!this.keys[e.key]) {
        this.keysJustPressed[e.key] = true;
      }
      this.keys[e.key] = true;
    });
    document.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
      this.keysJustReleased[e.key] = true;
    });
    window.addEventListener('blur', () => {
      this.keys = {};
    });
  }
  setupTouch() {
    const canvas = document.getElementById('gameCanvas');
    const container = document.getElementById('gameContainer');
    const btnConfig = [
      { id: 'touchLeft', x: 10, y: 380, w: 60, h: 50, action: 'left' },
      { id: 'touchRight', x: 80, y: 380, w: 60, h: 50, action: 'right' },
      { id: 'touchUp', x: 45, y: 340, w: 50, h: 40, action: 'up' },
      { id: 'touchDown', x: 45, y: 420, w: 50, h: 40, action: 'down' },
      { id: 'touchJump', x: 650, y: 370, w: 70, h: 60, action: 'jump' },
      { id: 'touchDash', x: 730, y: 410, w: 60, h: 50, action: 'dash' },
      { id: 'touchPound', x: 730, y: 350, w: 60, h: 40, action: 'pound' },
      { id: 'touchPause', x: 750, y: 10, w: 40, h: 30, action: 'pause' }
    ];
    const touchStartHandler = (e) => {
      e.preventDefault();
      for (const touch of e.changedTouches) {
        const rect = container.getBoundingClientRect();
        const tx = touch.clientX - rect.left;
        const ty = touch.clientY - rect.top;
        const scaleX = 800 / rect.width;
        const scaleY = 480 / rect.height;
        const cx = tx * scaleX;
        const cy = ty * scaleY;
        for (const btn of btnConfig) {
          if (cx >= btn.x && cx <= btn.x + btn.w && cy >= btn.y && cy <= btn.y + btn.h) {
            this.touches[touch.identifier] = btn.action;
            if (btn.action === 'pause') {
              this.keysJustPressed['Escape'] = true;
            } else if (btn.action === 'jump') {
              this.keysJustPressed[this.bindings.jump[0]] = true;
              this.keys[this.bindings.jump[0]] = true;
            } else if (btn.action === 'dash') {
              this.keysJustPressed[this.bindings.dash[0]] = true;
              this.keys[this.bindings.dash[0]] = true;
            } else if (btn.action === 'pound') {
              this.keysJustPressed['q'] = true;
            } else if (btn.action === 'left') {
              this.keys[this.bindings.moveLeft[0]] = true;
            } else if (btn.action === 'right') {
              this.keys[this.bindings.moveRight[0]] = true;
            } else if (btn.action === 'up') {
              this.keys[this.bindings.moveUp[0]] = true;
            } else if (btn.action === 'down') {
              this.keys[this.bindings.moveDown[0]] = true;
            }
            break;
          }
        }
      }
    };
    const touchEndHandler = (e) => {
      e.preventDefault();
      for (const touch of e.changedTouches) {
        const action = this.touches[touch.identifier];
        if (action === 'left') this.keys[this.bindings.moveLeft[0]] = false;
        else if (action === 'right') this.keys[this.bindings.moveRight[0]] = false;
        else if (action === 'up') this.keys[this.bindings.moveUp[0]] = false;
        else if (action === 'down') this.keys[this.bindings.moveDown[0]] = false;
        else if (action === 'jump') { this.keys[this.bindings.jump[0]] = false; }
        else if (action === 'dash') { this.keys[this.bindings.dash[0]] = false; }
        delete this.touches[touch.identifier];
      }
    };
    canvas.addEventListener('touchstart', touchStartHandler, { passive: false });
    canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
    canvas.addEventListener('touchend', touchEndHandler, { passive: false });
    canvas.addEventListener('touchcancel', touchEndHandler, { passive: false });
  }
  setupGamepad() {
    window.addEventListener('gamepadconnected', () => {
      this.gamepadConnected = true;
    });
    window.addEventListener('gamepaddisconnected', () => {
      this.gamepadConnected = false;
    });
  }
  isDown(key) {
    return this.keys[key] === true;
  }
  justPressed(key) {
    return this.keysJustPressed[key] === true;
  }
  justReleased(key) {
    return this.keysJustReleased[key] === true;
  }
  actionDown(action) {
    const keys = this.bindings[action];
    if (!keys) return false;
    for (const k of keys) {
      if (this.keys[k]) return true;
    }
    return false;
  }
  actionJustPressed(action) {
    const keys = this.bindings[action];
    if (!keys) return false;
    for (const k of keys) {
      if (this.keysJustPressed[k]) return true;
    }
    return false;
  }
  getLeft()   { return this.actionDown('moveLeft'); }
  getRight()  { return this.actionDown('moveRight'); }
  getUp()     { return this.actionDown('moveUp'); }
  getDown()   { return this.actionDown('moveDown'); }
  getJump() {
    return this.actionJustPressed('jump') || this.checkGamepadButton(0);
  }
  getDash()   { return this.actionJustPressed('dash'); }
  getCrouch() { return this.actionDown('crouch'); }
  getPound()  { return this.actionJustPressed('pound'); }
  getPause()  { return this.actionJustPressed('pause'); }
  checkGamepadButton(btnIndex) {
    if (!this.gamepadConnected) return false;
    const gamepads = navigator.getGamepads();
    for (const gp of gamepads) {
      if (gp && gp.buttons[btnIndex] && gp.buttons[btnIndex].pressed) {
        return true;
      }
    }
    return false;
  }
  update() {
    this.keysJustPressed = {};
    this.keysJustReleased = {};
  }
  reset() {
    this.keys = {};
    this.keysJustPressed = {};
    this.keysJustReleased = {};
  }
}
