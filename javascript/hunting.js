import { gameState } from './settings.js';
import { updateGameState } from './game.js';
import { addLogEntry } from './log.js';
import { createLucideIcons } from './utils.js';

/**
 * Defines the types of animals and their properties.
 * @typedef {Object} AnimalType
 * @property {number} foodYield - Amount of food yielded when hunted
 * @property {string} icon - Lucide icon name for the animal
 */

/**
 * @type {Object.<string, AnimalType>}
 */
const ANIMAL_TYPES = {
  rabbit: { foodYield: 5, icon: 'rabbit' },
  bird: { foodYield: 3, icon: 'bird' },
  rat: { foodYield: 2, icon: 'rat' },
  snail: { foodYield: 1, icon: 'snail' },
  squirrel: { foodYield: 4, icon: 'squirrel' },
  turtle: { foodYield: 6, icon: 'turtle' }
};

/**
 * Initializes the hunting module.
 */
export function initializeHunting() {
  if (!gameState.hunting) {
    gameState.hunting = { animals: [] };
  }
  resetHuntingArea();
  addLogEntry('Hunting Lodge is now operational.');
}

/**
 * Resets the hunting area with new animals and movement interval.
 */
function resetHuntingArea() {
  gameState.hunting.animals = generateAnimals();
  clearInterval(gameState.moveInterval);
  gameState.moveInterval = setInterval(moveAnimals, 500);
  updateHuntingUI();
}

/**
 * Generates a random set of animals.
 * @returns {Array} Array of animal objects.
 */
function generateAnimals() {
  const numAnimals = Math.floor(Math.random() * 3) + 1;
  const animalTypes = Object.keys(ANIMAL_TYPES);
  return Array.from({ length: numAnimals }, () => ({
    type: animalTypes[Math.floor(Math.random() * animalTypes.length)],
    x: Math.random() * 100,
    y: Math.random() * 100
  }));
}

/**
 * Moves the animals randomly within the hunting area.
 */
function moveAnimals() {
  gameState.hunting.animals = gameState.hunting.animals.map(animal => ({
    ...animal,
    x: Math.max(0, Math.min(100, animal.x + (Math.random() - 0.5) * 10)),
    y: Math.max(0, Math.min(100, animal.y + (Math.random() - 0.5) * 10))
  }));
  updateHuntingUI();
}

/**
 * Updates the hunting UI.
 */
function updateHuntingUI() {
  const huntingModule = document.getElementById('hunting-module');
  if (!huntingModule) return;

  huntingModule.classList.toggle('hidden', !gameState.upgrades.huntingLodge);

  if (gameState.upgrades.huntingLodge) {
    huntingModule.innerHTML = `
      <h2><i data-lucide="target" class="icon-dark"></i> Hunting Lodge</h2>
      <div id="hunting-area">
        ${gameState.hunting.animals.map(renderAnimal).join('')}
      </div>
    `;
    createLucideIcons();
  }
}

/**
 * Renders an individual animal for the hunting UI.
 * @param {Object} animal - The animal object to render
 * @returns {string} HTML string for the animal
 */
function renderAnimal(animal) {
  return `
    <div class="wildlife" style="left: ${animal.x}%; top: ${animal.y}%;" onclick="window.shootAnimal(${animal.x}, ${animal.y})">
      <i data-lucide="${ANIMAL_TYPES[animal.type].icon}" class="icon-dark"></i>
    </div>
  `;
}

/**
 * Shoots an animal at the given coordinates.
 * @param {number} x - The x-coordinate of the animal.
 * @param {number} y - The y-coordinate of the animal.
 */
export function shootAnimal(x, y) {
  const animalIndex = gameState.hunting.animals.findIndex(animal =>
    Math.abs(animal.x - x) < 5 && Math.abs(animal.y - y) < 5
  );

  if (animalIndex !== -1) {
    const animal = gameState.hunting.animals[animalIndex];
    const foodGained = ANIMAL_TYPES[animal.type].foodYield;
    gameState.food += foodGained;
    gameState.totalAnimalsHunted = (gameState.totalAnimalsHunted || 0) + 1;
    addLogEntry(`Shot a ${animal.type}! Gained ${foodGained} food.`);
    gameState.hunting.animals.splice(animalIndex, 1);

    // Reset hunting area if no animals remain
    if (gameState.hunting.animals.length === 0) {
      resetHuntingArea();
    } else {
      updateHuntingUI();
    }

    updateGameState();
  }
}

// Expose function to the global scope for onclick events
window.shootAnimal = shootAnimal;