import { gameState, updateGameState } from './state.js';
import { addResource } from './resources.js';
import { addLogEntry } from './logging.js';
import { checkAchievements } from './achievements.js';

export function startHunting() {
  if (gameState.huntingInterval) {
    clearInterval(gameState.huntingInterval);
  }
  if (gameState.moveInterval) {
    clearInterval(gameState.moveInterval);
  }

  gameState.hunting = {
    active: true,
    animals: generateAnimals()
  };

  gameState.huntingInterval = setInterval(updateHunting, 1000);
  gameState.moveInterval = setInterval(moveAnimals, 500);

  addLogEntry('Hunting started.');
}

export function stopHunting() {
  if (gameState.huntingInterval) {
    clearInterval(gameState.huntingInterval);
  }
  if (gameState.moveInterval) {
    clearInterval(gameState.moveInterval);
  }

  gameState.hunting.active = false;
  gameState.huntingInterval = null;
  gameState.moveInterval = null;

  addLogEntry('Hunting stopped.');
}

function generateAnimals() {
  const animals = [];
  const numAnimals = Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < numAnimals; i++) {
    animals.push({
      type: Math.random() < 0.7 ? 'rabbit' : 'deer',
      x: Math.random() * 100,
      y: Math.random() * 100
    });
  }
  return animals;
}

function updateHunting() {
  if (!gameState.hunting.active) return;

  gameState.hunting.animals.forEach((animal, index) => {
    if (Math.random() < 0.1) {
      const foodGained = animal.type === 'rabbit' ? 5 : 20;
      addResource('food', foodGained);
      gameState.totalAnimalsHunted++;
      addLogEntry(`Caught a ${animal.type}! Gained ${foodGained} food.`);
      gameState.hunting.animals.splice(index, 1);
      checkAchievements();
    }
  });

  if (gameState.hunting.animals.length === 0) {
    gameState.hunting.animals = generateAnimals();
  }
}

function moveAnimals() {
  if (!gameState.hunting.active) return;

  gameState.hunting.animals = gameState.hunting.animals.map(animal => ({
    ...animal,
    x: Math.max(0, Math.min(100, animal.x + (Math.random() - 0.5) * 10)),
    y: Math.max(0, Math.min(100, animal.y + (Math.random() - 0.5) * 10))
  }));
}

export function getHuntingStatus() {
  return {
    active: gameState.hunting.active,
    animals: gameState.hunting.animals
  };
}