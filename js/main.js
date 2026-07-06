const audio = new AudioManager();
const saveSystem = new SaveSystem();
let game = null;

document.addEventListener('DOMContentLoaded', () => {
  game = new Game();
  document.getElementById('mainMenu').classList.remove('hidden');
  document.getElementById('pauseMenu').classList.add('hidden');
  document.getElementById('settingsMenu').classList.add('hidden');
  document.getElementById('levelSelect').classList.add('hidden');
  document.getElementById('gameOverScreen').classList.add('hidden');
  document.getElementById('victoryScreen').classList.add('hidden');
  document.getElementById('gameCompleteScreen').classList.add('hidden');
  game.audio.init();
  requestAnimationFrame((t) => game.gameLoop(t));
});


