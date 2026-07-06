class MenuManager {
  constructor() {
    this.mainMenu = document.getElementById('mainMenu');
    this.pauseMenu = document.getElementById('pauseMenu');
    this.settingsMenu = document.getElementById('settingsMenu');
    this.levelSelect = document.getElementById('levelSelect');
    this.gameOverScreen = document.getElementById('gameOverScreen');
    this.victoryScreen = document.getElementById('victoryScreen');
    this.gameCompleteScreen = document.getElementById('gameCompleteScreen');
  }
  hideAll() {
    this.mainMenu.classList.add('hidden');
    this.pauseMenu.classList.add('hidden');
    this.settingsMenu.classList.add('hidden');
    this.levelSelect.classList.add('hidden');
    this.gameOverScreen.classList.add('hidden');
    this.victoryScreen.classList.add('hidden');
    this.gameCompleteScreen.classList.add('hidden');
  }
  showMainMenu() {
    this.hideAll();
    this.mainMenu.classList.remove('hidden');
  }
  showPauseMenu() {
    this.hideAll();
    this.pauseMenu.classList.remove('hidden');
  }
  showSettings() {
    this.hideAll();
    document.getElementById('musicVolume').value = audio.musicVolume * 100;
    document.getElementById('sfxVolume').value = audio.sfxVolume * 100;
    document.getElementById('screenShake').checked = saveSystem.data.settings.screenShake;
    document.getElementById('particles').checked = saveSystem.data.settings.particles;
    this.buildKeyBindingsUI();
    this.settingsMenu.classList.remove('hidden');
  }
  buildKeyBindingsUI() {
    const container = document.getElementById('keyBindingsGroup');
    const existing = container.querySelector('.keybindings-list');
    if (existing) existing.remove();
    const list = document.createElement('div');
    list.className = 'keybindings-list';
    list.style.cssText = 'display:flex;flex-direction:column;gap:4px;';
    const actions = [
      ['moveLeft', 'Move Left'], ['moveRight', 'Move Right'],
      ['moveUp', 'Move Up'], ['moveDown', 'Move Down'],
      ['jump', 'Jump'], ['dash', 'Dash'],
      ['crouch', 'Crouch'], ['pound', 'Ground Pound'],
      ['pause', 'Pause']
    ];
    for (const [action, label] of actions) {
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:8px;';
      const nameSpan = document.createElement('span');
      nameSpan.textContent = label + ':';
      nameSpan.style.cssText = 'color:#ccc;font-size:12px;min-width:100px;';
      const keyBtn = document.createElement('button');
      const currentKey = game && game.input ? game.input.bindings[action][0] : '';
      keyBtn.textContent = currentKey || '...';
      keyBtn.style.cssText = 'background:#333;color:#fff;border:1px solid #666;padding:3px 10px;font-size:12px;border-radius:3px;cursor:pointer;min-width:70px;text-align:center;';
      keyBtn.onclick = () => {
        keyBtn.textContent = '...';
        keyBtn.style.borderColor = '#ffd700';
        keyBtn.style.background = '#554400';
        if (game && game.input) {
          game.input.startCapture(action, (act, key) => {
            if (key === null) {
              const currentKey = game.input.bindings[action][0];
              keyBtn.textContent = currentKey;
            } else {
              keyBtn.textContent = key;
            }
            keyBtn.style.borderColor = '#666';
            keyBtn.style.background = '#333';
            game.updateSettings();
          });
        }
      };
      row.appendChild(nameSpan);
      row.appendChild(keyBtn);
      list.appendChild(row);
    }
    container.appendChild(list);
  }
  showLevelSelect() {
    this.hideAll();
    const list = document.getElementById('levelList');
    list.innerHTML = '';
    for (let i = 1; i <= WORLD_COUNT; i++) {
      const btn = document.createElement('button');
      btn.className = 'level-btn';
      const names = ['Sunny Grasslands', 'Deep Forest', 'Ancient Desert'];
      if (saveSystem.isLevelUnlocked(i)) {
        btn.classList.add('unlocked');
        if (saveSystem.isLevelCompleted(i)) {
          btn.classList.add('completed');
        }
        btn.onclick = () => game.loadLevel(i);
      }
      btn.textContent = `Level ${i}\n${names[i-1]}`;
      list.appendChild(btn);
    }
    this.levelSelect.classList.remove('hidden');
  }
  showGameOver(score) {
    this.hideAll();
    document.getElementById('gameOverScore').textContent = 'Score: ' + score;
    this.gameOverScreen.classList.remove('hidden');
  }
  showVictory(time, score, coins, gems, nextLevel) {
    this.hideAll();
    const mins = Math.floor(time / 60 / 60);
    const secs = Math.floor((time / 60) % 60);
    document.getElementById('victoryTime').textContent =
      `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    document.getElementById('victoryScore').textContent = score;
    document.getElementById('victoryCoins').textContent = coins;
    document.getElementById('victoryGems').textContent = gems;
    if (nextLevel > WORLD_COUNT) {
      document.getElementById('victoryButtons').innerHTML =
        '<button class="menu-btn" onclick="game.showGameComplete()">See Results</button>' +
        '<button class="menu-btn" onclick="game.quitToMenu()">Main Menu</button>';
      document.getElementById('victoryMessage').textContent = 'You cleared all levels, MOHSIN!';
    } else {
      document.getElementById('victoryButtons').innerHTML =
        '<button class="menu-btn" onclick="game.nextLevel()">Next Level</button>' +
        '<button class="menu-btn" onclick="game.quitToMenu()">Main Menu</button>';
      document.getElementById('victoryMessage').textContent = 'Great job, MOHSIN!';
    }
    this.victoryScreen.classList.remove('hidden');
  }
  showGameComplete(score, coins, gems) {
    this.hideAll();
    document.getElementById('finalScore').textContent = score || '0';
    document.getElementById('finalCoins').textContent = coins || '0';
    document.getElementById('finalGems').textContent = gems || '0';
    this.gameCompleteScreen.classList.remove('hidden');
  }
}
