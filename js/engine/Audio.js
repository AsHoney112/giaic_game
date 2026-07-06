class AudioManager {
  constructor() {
    this.ctx = null;
    this.musicVolume = 0.7;
    this.sfxVolume = 0.8;
    this.musicGain = null;
    this.sfxGain = null;
    this.musicPlaying = false;
    this.musicOsc = null;
    this.musicGainNode = null;
    this.initialized = false;
  }
  init() {
    if (this.initialized) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = this.musicVolume * 0.3;
    this.musicGain.connect(this.ctx.destination);
    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = this.sfxVolume;
    this.sfxGain.connect(this.ctx.destination);
    this.initialized = true;
  }
  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }
  setMusicVolume(v) {
    this.musicVolume = v;
    if (this.musicGain) this.musicGain.gain.value = v * 0.3;
  }
  setSfxVolume(v) {
    this.sfxVolume = v;
    if (this.sfxGain) this.sfxGain.gain.value = v;
  }
  playTone(freq, duration, type = 'square', volume = 0.3) {
    if (!this.initialized) return;
    this.resume();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = volume * this.sfxVolume;
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }
  playJump() {
    this.playTone(300, 0.1, 'square', 0.2);
    setTimeout(() => this.playTone(500, 0.1, 'square', 0.2), 50);
  }
  playDoubleJump() {
    this.playTone(400, 0.08, 'square', 0.2);
    setTimeout(() => this.playTone(600, 0.08, 'square', 0.2), 40);
    setTimeout(() => this.playTone(800, 0.1, 'square', 0.2), 80);
  }
  playCoin() {
    this.playTone(800, 0.05, 'square', 0.2);
    setTimeout(() => this.playTone(1200, 0.1, 'square', 0.2), 60);
  }
  playGem() {
    this.playTone(1000, 0.05, 'sine', 0.25);
    setTimeout(() => this.playTone(1400, 0.05, 'sine', 0.25), 60);
    setTimeout(() => this.playTone(1800, 0.1, 'sine', 0.25), 120);
  }
  playHit() {
    this.playTone(150, 0.15, 'sawtooth', 0.3);
    setTimeout(() => this.playTone(100, 0.1, 'sawtooth', 0.2), 80);
  }
  playDamage() {
    this.playTone(200, 0.1, 'square', 0.3);
    setTimeout(() => this.playTone(100, 0.15, 'square', 0.3), 100);
  }
  playStomp() {
    this.playTone(400, 0.05, 'square', 0.25);
    setTimeout(() => this.playTone(200, 0.1, 'square', 0.25), 30);
  }
  playDash() {
    this.playTone(600, 0.05, 'sine', 0.15);
    setTimeout(() => this.playTone(800, 0.08, 'sine', 0.15), 30);
  }
  playWallJump() {
    this.playTone(250, 0.06, 'square', 0.2);
    setTimeout(() => this.playTone(450, 0.1, 'square', 0.2), 40);
  }
  playExplosion() {
    this.playNoise(0.2, 0.4);
    this.playTone(80, 0.3, 'sawtooth', 0.3);
  }
  playPowerUp() {
    this.playTone(500, 0.06, 'sine', 0.2);
    setTimeout(() => this.playTone(700, 0.06, 'sine', 0.2), 70);
    setTimeout(() => this.playTone(900, 0.06, 'sine', 0.2), 140);
    setTimeout(() => this.playTone(1200, 0.12, 'sine', 0.25), 210);
  }
  playCheckpoint() {
    this.playTone(600, 0.1, 'sine', 0.25);
    setTimeout(() => this.playTone(800, 0.1, 'sine', 0.25), 100);
    setTimeout(() => this.playTone(1000, 0.1, 'sine', 0.25), 200);
    setTimeout(() => this.playTone(1200, 0.2, 'sine', 0.3), 300);
  }
  playMenuClick() {
    this.playTone(600, 0.05, 'square', 0.15);
  }
  playBossRoar() {
    this.playTone(80, 0.3, 'sawtooth', 0.3);
    setTimeout(() => this.playTone(60, 0.4, 'sawtooth', 0.25), 150);
    this.playNoise(0.1, 0.3);
  }
  playVictory() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((f, i) => {
      setTimeout(() => this.playTone(f, 0.2, 'sine', 0.25), i * 120);
    });
  }
  playDeath() {
    const notes = [400, 350, 300, 200, 100];
    notes.forEach((f, i) => {
      setTimeout(() => this.playTone(f, 0.15, 'square', 0.25), i * 100);
    });
  }
  playShoot() {
    this.playTone(300, 0.05, 'square', 0.15);
    this.playNoise(0.03, 0.1);
  }
  playSwim() {
    this.playTone(200, 0.05, 'sine', 0.1);
  }
  playClimb() {
    this.playTone(300, 0.03, 'sine', 0.08);
  }
  playPound() {
    this.playTone(100, 0.15, 'square', 0.3);
    this.playNoise(0.05, 0.15);
  }
  playSplash() {
    this.playNoise(0.05, 0.15);
    this.playTone(200, 0.08, 'sine', 0.12);
  }
  playNoise(duration, volume = 0.2) {
    if (!this.initialized) return;
    this.resume();
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
    }
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    const gain = this.ctx.createGain();
    gain.gain.value = volume * this.sfxVolume;
    source.connect(gain);
    gain.connect(this.sfxGain);
    source.start();
  }
  playMusic() {
    if (!this.initialized || this.musicPlaying) return;
    this.resume();
    this.musicPlaying = true;
    this._playMusicLoop();
  }
  _playMusicLoop() {
    if (!this.musicPlaying) return;
    const now = this.ctx.currentTime;
    const bpm = 120;
    const beatDuration = 60 / bpm;
    const melody = [
      262, 294, 330, 349, 392, 349, 330, 294,
      262, 330, 392, 523, 392, 330, 294, 262
    ];
    melody.forEach((freq, i) => {
      const start = now + i * beatDuration * 0.5;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = freq;
      gain.gain.value = 0.08 * this.musicVolume;
      gain.gain.setValueAtTime(0.08 * this.musicVolume, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + beatDuration * 0.4);
      osc.connect(gain);
      gain.connect(this.musicGain);
      osc.start(start);
      osc.stop(start + beatDuration * 0.45);
    });
    const loopDuration = melody.length * beatDuration * 0.5;
    setTimeout(() => this._playMusicLoop(), loopDuration * 1000);
  }
  stopMusic() {
    this.musicPlaying = false;
  }
}
