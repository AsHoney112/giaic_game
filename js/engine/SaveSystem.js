class SaveSystem {
  constructor() {
    this.saveKey = 'lostRealmSave';
    this.data = this.load();
  }
  getDefaults() {
    return {
      currentLevel: 1,
      lives: START_LIVES,
      health: MAX_HEALTH,
      coins: 0,
      gems: 0,
      unlockedLevels: 1,
      bestScore: 0,
      completedLevels: [],
      settings: {
        musicVolume: 70,
        sfxVolume: 80,
        screenShake: true,
        particles: true
      },
      controls: null
    };
  }
  load() {
    try {
      const raw = localStorage.getItem(this.saveKey);
      if (raw) {
        const data = JSON.parse(raw);
        return { ...this.getDefaults(), ...data };
      }
    } catch (e) {}
    return this.getDefaults();
  }
  save() {
    try {
      localStorage.setItem(this.saveKey, JSON.stringify(this.data));
    } catch (e) {}
  }
  reset() {
    this.data = this.getDefaults();
    this.save();
  }
  completeLevel(levelNum) {
    if (!this.data.completedLevels.includes(levelNum)) {
      this.data.completedLevels.push(levelNum);
    }
    if (levelNum >= this.data.unlockedLevels && levelNum < WORLD_COUNT) {
      this.data.unlockedLevels = levelNum + 1;
    }
    this.save();
  }
  updateScore(score) {
    if (score > this.data.bestScore) {
      this.data.bestScore = score;
    }
    this.save();
  }
  isLevelUnlocked(levelNum) {
    return levelNum <= this.data.unlockedLevels;
  }
  isLevelCompleted(levelNum) {
    return this.data.completedLevels.includes(levelNum);
  }
}
