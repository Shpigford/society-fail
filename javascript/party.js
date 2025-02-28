/*
  Party Module
  This module handles the creation and management of party members in the game.
  It includes functions for initializing the party, updating party stats,
  displaying party information, and performing actions for party members.
*/

import { gameState } from './settings.js';
import { gameOver, updateGameState } from './game.js';
import { addLogEntry } from './log.js';

// Move this outside the class to be accessible by all instances
const usedNames = new Set();

/**
 * Represents a party member in the game.
 */
export class PartyMember {
  /**
   * Creates a new party member.
   */
  constructor() {
    this.name = this.generateName();
    this.health = 100;
    this.hunger = 100;
    this.thirst = 100;
    this.energy = 100;
    this.traits = {
      hungerRate: Math.random() * 0.5 + 0.5,
      thirstRate: Math.random() * 0.75 + 0.75,
      energyRate: Math.random() * 0.4 + 0.3,
      maxEnergy: 100,
      energyRecoveryRate: Math.random() * 1.5 + 1
    };
  }

  generateName() {
    return getUniqueRandomName(usedNames);
  }

  /**
   * Updates the party member's stats based on their traits.
   */
  updateStats() {
    if (this.isDead) {
      this.hunger = 0;
      this.thirst = 0;
      this.energy = 0;
      return;
    }

    // Decrease hunger, thirst, and energy
    this.hunger = Math.max(0, this.hunger - this.traits.hungerRate);
    this.thirst = Math.max(0, this.thirst - this.traits.thirstRate);
    this.energy = Math.max(0, Math.min(100, this.energy - this.traits.energyRate)); // Ensure energy doesn't exceed 100

    // Calculate health loss
    const healthLoss = (this.hunger <= 0 || this.thirst <= 0 || this.energy <= 0) ? 2 : 0;
    this.health = Math.max(0, this.health - healthLoss);

    // Additional health loss for each stat at 0
    if (this.hunger <= 0) this.health = Math.max(0, this.health - 1);
    if (this.thirst <= 0) this.health = Math.max(0, this.health - 1);
    if (this.energy <= 0) this.health = Math.max(0, this.health - 1);

    // Check if person has died
    if (this.health <= 0) {
      this.isDead = true;
      this.health = 0;
      this.hunger = 0;
      this.thirst = 0;
      this.energy = 0;
    }

    // Recover health if all stats are above 50%
    if (this.hunger > 50 && this.thirst > 50 && this.energy > 50 && this.health < 100) {
      this.health = Math.min(100, this.health + 0.1);
    }
  }

  applyActionEffects(effects) {
    this.hunger = Math.max(0, Math.min(100, this.hunger + effects.hunger));
    this.thirst = Math.max(0, Math.min(100, this.thirst + effects.thirst));
    this.energy = Math.max(0, Math.min(100, this.energy + effects.energy)); // Ensure energy doesn't exceed 100

    // Check if the action caused any critical conditions
    if (this.hunger <= 0 || this.thirst <= 0 || this.energy <= 0) {
      this.health -= 5; // Lose health if any stat reaches 0
      if (this.health <= 0) {
        this.isDead = true;
        this.health = 0;
        addLogEntry(`${this.name} has died due to exhaustion.`, 'error');
      }
    }
  }
}

// Array of possible names for party members
const possibleNames = [
  "Alex", "Sam", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Avery",
  "Quinn", "Skyler", "Charlie", "Frankie", "Finley", "Sage", "Remy",
  "Addison", "Blake", "Cameron", "Dakota", "Emerson", "Finley",
  "Harper", "Jaden", "Kennedy", "London", "Micah", "Noel",
  "Oakley", "Parker", "Quinn", "Reese", "Sawyer", "Tatum", "Uriah",
  "Val", "Winter", "Xen", "Yael", "Zion", "Arden", "Bellamy", "Corey",
  "Drew", "Ellis", "Fallon", "Greer", "Hadley", "Ira", "Jules",
  "Kai", "Lennon", "Marlowe", "Nova", "Onyx", "Phoenix", "River",
  "Shiloh", "Tate", "Unity", "Vesper", "Wren", "Xander", "Yara", "Zephyr"
];

/**
 * Gets a unique random name from the list of possible names.
 * @param {Set} usedNames - Set of already used names.
 * @returns {string} A unique random name.
 */
function getUniqueRandomName(usedNames) {
  let name;
  do {
    name = possibleNames[Math.floor(Math.random() * possibleNames.length)];
  } while (usedNames.has(name));
  usedNames.add(name);
  return name;
}

/**
 * Initializes the party with three members if it doesn't exist.
 */
export function initializeParty() {
  if (!gameState.party || gameState.party.length === 0) {
    const usedNames = new Set();
    gameState.party = Array.from({ length: 3 }, () => new PartyMember(getUniqueRandomName(usedNames)));
    gameState.busyUntil = Array(3).fill(0);
  }
}

/**
 * Updates the stats of all party members.
 */
export function updatePartyStats() {
  const currentTime = gameState.hour + (gameState.day - 1) * 24;
  gameState.party.forEach((member, index) => {
    if (member.isDead) return;

    const isResting = gameState.busyUntil[index] === -1;
    const isBusy = gameState.busyUntil[index] > currentTime;

    if (!isResting && !isBusy) {
      member.updateStats();
    } else if (isResting) {
      // Increased energy recovery rate (approximately 16.67% per hour)
      const energyRecoveryRate = member.traits.maxEnergy / 4;
      member.energy = Math.min(100, member.energy + energyRecoveryRate); // Ensure energy doesn't exceed 100

      // Slower hunger and thirst decrease while resting
      member.hunger = Math.max(0, member.hunger - member.traits.hungerRate * 0.2);
      member.thirst = Math.max(0, member.thirst - member.traits.thirstRate * 0.2);

      // Increased health recovery if hunger and thirst are above 50%
      if (member.hunger > 50 && member.thirst > 50 && member.health < 100) {
        member.health = Math.min(100, member.health + 1);
      }

      if (member.energy >= 100) {
        gameState.busyUntil[index] = currentTime;
        member.energy = 100;
      }
    }
    // If busy, do nothing (stats remain unchanged)
  });

  updatePartyDisplay();
  checkPartyStatus();
}

/**
 * Gets the appropriate CSS class for a progress bar based on its value.
 * @param {number} value - The current value of the stat.
 * @returns {string} The CSS class for the progress bar.
 */
function getProgressBarClass(value) {
  if (value > 66) return 'high';
  if (value > 33) return 'medium';
  return 'low';
}

/**
 * Updates the party display in the UI.
 */
export function updatePartyDisplay() {
  const partyContainer = document.getElementById('party-display');
  partyContainer.innerHTML = '';

  gameState.party.forEach((person, index) => {
    const personElement = document.createElement('div');
    personElement.className = 'person';
    const currentTime = gameState.hour + (gameState.day - 1) * 24;
    const isBusy = gameState.busyUntil[index] > currentTime;
    const isResting = gameState.busyUntil[index] === -1;
    const busyTimeLeft = isBusy ? gameState.busyUntil[index] - currentTime : 0;

    personElement.innerHTML = `
      <div class="person-header">
        <h3><i data-lucide="person-standing" class="icon-gutter-grey"></i> ${person.name}</h3>
        <div class="busy-label ${person.isDead ? 'dead' : (isBusy ? 'busy' : (isResting ? 'resting' : 'idle'))}">${person.isDead ? 'DEAD' : (isBusy ? `BUSY [${busyTimeLeft}h]` : (isResting ? 'RESTING' : 'IDLE'))}</div>
      </div>
      <div class="stats-container">
        <table class="stats">
          ${['health', 'hunger', 'thirst', 'energy'].map(stat => `
            <tr>
              <td>${stat.charAt(0).toUpperCase() + stat.slice(1)}</td>
              <td><div class="progress-bar"><div class="progress ${stat}-bar ${getProgressBarClass(person[stat])}" style="width: ${person[stat]}%;"></div></div></td>
              <td>${Math.floor(person[stat])}%</td>
            </tr>
          `).join('')}
        </table>
      </div>
      <div class="person-actions">
        <button data-action="eat" data-person="${index}" ${(person.isDead || isBusy || isResting || gameState.food < 5) ? 'disabled' : ''}>
          ${index === 0 ? '<span class="shortcut">u</span>' : index === 1 ? '<span class="shortcut">j</span>' : '<span class="shortcut">m</span>'}
          Eat <span>[5 <i data-lucide="beef" class="icon dark-yellow"></i>]</span>
        </button>
        <button data-action="drink" data-person="${index}" ${(person.isDead || isBusy || isResting || gameState.water < 3) ? 'disabled' : ''}>
          ${index === 0 ? '<span class="shortcut">i</span>' : index === 1 ? '<span class="shortcut">k</span>' : '<span class="shortcut">,</span>'}
          Drink <span>[3 <i data-lucide="droplet" class="icon blue"></i>]</span>
        </button>
        <button data-action="sleep" data-person="${index}" ${(person.isDead || isBusy || isResting) ? 'disabled' : ''}>
          ${index === 0 ? '<span class="shortcut">o</span>' : index === 1 ? '<span class="shortcut">l</span>' : '<span class="shortcut">.</span>'}
          <i data-lucide="bed-single" class="icon magenta"></i> Rest
        </button>
      </div>
    `;
    partyContainer.appendChild(personElement);
  });

  // Refresh Lucide icons
  if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

/**
 * Performs an action for a party member.
 * @param {number} personIndex - The index of the party member.
 * @param {string} action - The action to perform ('eat', 'drink', or 'sleep').
 */
export function performAction(personIndex, action) {
  const person = gameState.party[personIndex];
  const currentTime = gameState.hour + (gameState.day - 1) * 24;
  const isBusy = gameState.busyUntil[personIndex] > currentTime;
  const isResting = gameState.busyUntil[personIndex] === -1;

  if (isBusy || isResting) {
    console.log("This person is busy or resting and cannot perform actions.");
    return;
  }

  const actions = {
    eat: () => {
      if (gameState.food >= 5) {
        person.hunger = Math.min(100, person.hunger + 25);
        gameState.food -= 5;
        gameState.busyUntil[personIndex] = currentTime + 1;
        addLogEntry(`${person.name} ate some food.`, 'info');
      }
    },
    drink: () => {
      if (gameState.water >= 3) {
        person.thirst = Math.min(100, person.thirst + 25);
        gameState.water -= 3;
        gameState.busyUntil[personIndex] = currentTime + 1;
        addLogEntry(`${person.name} drank some water.`, 'info');
      }
    },
    sleep: () => {
      gameState.busyUntil[personIndex] = -1;
      addLogEntry(`${person.name} started resting.`, 'info');
    }
  };

  if (action in actions) {
    actions[action]();
    updatePartyDisplay();
    updateGameState();
  } else {
    console.log(`Unknown action: ${action}`);
  }
}

/**
 * Checks the status of all party members and triggers game over if all are dead.
 */
export function checkPartyStatus() {
  const allDead = gameState.party.every(member => {
    if (member.health <= 0) {
      member.isDead = true;
      return true;
    }
    return false;
  });

  if (allDead) {
    gameOver();
  }
}

export function isBusy(personIndex, currentTime) {
  return gameState.busyUntil[personIndex] > currentTime || gameState.busyUntil[personIndex] === -1;
}
