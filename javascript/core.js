import { initializeGameState, gameState, setGameState } from './state.js';
import { updateUI, updateLucideIcons } from './ui.js';
import { checkForRandomEvent } from './events.js';
import { generateLumberMillWood, growLumberMillTrees } from './resources.js';
import { createParty, updatePartyStats } from './party.js';
import { checkAchievements } from './achievements.js';

export let gameInterval;

export function startGame(difficulty) {
  const gameState = initializeGameState(difficulty);
  const partySize = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 3 : 5;

  gameState.party = createParty(partySize);
  gameState.selectedPerson = 0;

  setGameState(gameState);
  document.getElementById('start-screen').classList.add('hidden');
  document.getElementById('game-over-screen').classList.add('hidden');
  document.getElementById('game-ui').classList.remove('hidden');
  updateUI();
  startGameLoop();
}

window.startGame = startGame;
window.pauseGame = pauseGame;

export function startGameLoop() {
  if (gameInterval) {
    clearInterval(gameInterval);
  }
  gameInterval = setInterval(gameLoop, 1000);
}

export function pauseGame() {
  if (gameInterval) {
    clearInterval(gameInterval);
    gameInterval = null;
    document.getElementById('pause-game').innerHTML = '<i data-lucide="play" class=""></i>';
    document.getElementById('time-display').classList.add('paused');
  } else {
    startGameLoop();
    document.getElementById('pause-game').innerHTML = '<i data-lucide="pause" class=""></i>';
    document.getElementById('time-display').classList.remove('paused');
  }
  updateLucideIcons();
}

function gameLoop() {
  gameState.hour++;
  if (gameState.hour > 24) {
    gameState.hour = 1;
    gameState.day++;
  }

  if (gameState.hour === 1) {
    addLogEntry(`Day ${gameState.day} has begun.`);
  }

  checkForRandomEvent();
  updatePartyStats();
  generateLumberMillWood();
  growLumberMillTrees();

  gameState.totalPlayTime++;
  checkAchievements();
  updateUI();
}

export function saveGame() {
  localStorage.setItem('societyFailSave', JSON.stringify(gameState));
}

export function loadGame() {
  const savedGame = localStorage.getItem('societyFailSave');
  if (savedGame) {
    const loadedState = JSON.parse(savedGame);
    if (checkSaveCompatibility(loadedState)) {
      setGameState(loadedState);
      updateUI();
      startGameLoop();
    } else {
      alert("Your saved game is incompatible with the current version. The apocalypse has no mercy. Please start a new game.");
      resetGame(true);
    }
  }
}

function checkSaveCompatibility(savedState) {
  // Implement version checking logic here
  return true; // Placeholder
}

export function resetGame(showConfirmation = true) {
  if (showConfirmation && !confirm("Are you sure you want to reset the game? All progress will be lost.")) {
    return;
  }
  localStorage.removeItem('societyFailSave');
  setGameState(initializeGameState('medium')); // Default to medium difficulty
  updateUI();
  startGameLoop();
}

export function setDebugMode(enabled) {
  gameState.debug = enabled;
  if (enabled) {
    // Enable all upgrades
    for (const upgradeId in gameState.upgrades) {
      gameState.upgrades[upgradeId] = true;
    }
    // Add resources
    gameState.food = 1000;
    gameState.water = 1000;
    gameState.wood = 1000;
    // Ensure there's at least one person in the party
    if (gameState.party.length === 0) {
      gameState.party.push({
        name: "Debug Person",
        health: 100,
        hunger: 0,
        thirst: 0,
        energy: 100,
        traits: {
          hungerRate: 1,
          thirstRate: 1,
          energyRate: 1,
          maxEnergy: 100,
          energyRecoveryRate: 1
        }
      });
    }
    // Initialize well if it's not already initialized
    if (!gameState.well) {
      gameState.well = {
        capacity: 100,
        current: 50,
        fillRate: 1
      };
    }
    // Initialize Lumber Mill trees
    if (!gameState.lumberMill.trees || gameState.lumberMill.trees.length === 0) {
      gameState.lumberMill.trees = [];
      for (let i = 0; i < gameState.lumberMill.maxTrees; i++) {
        gameState.lumberMill.trees.push({
          growth: Math.random(),
          growthTime: gameState.lumberMill.baseGrowthTime +
            (Math.random() * 2 - 1) * gameState.lumberMill.growthTimeVariance,
          harvestAmount: Math.round(gameState.lumberMill.baseHarvestAmount +
            (Math.random() * 2 - 1) * gameState.lumberMill.harvestAmountVariance)
        });
      }
    }
  }
  updateUI();
}
