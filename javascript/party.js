import { gameState } from './state.js';
import { addLogEntry } from './logging.js';
import { updateUI } from './ui.js';

export function createPartyMember(name) {
  return {
    name: name,
    health: 100,
    hunger: 0,
    thirst: 0,
    energy: 100,
    traits: {
      hungerRate: getRandomTrait('hungerRate'),
      thirstRate: getRandomTrait('thirstRate'),
      energyRate: getRandomTrait('energyRate'),
      maxEnergy: Math.round(getRandomTrait('maxEnergy')),
      energyRecoveryRate: getRandomTrait('energyRecoveryRate')
    }
  };
}

export function updatePartyStats() {
  gameState.party.forEach((person, index) => {
    person.hunger = Math.min(100, person.hunger + 1 * person.traits.hungerRate);
    person.thirst = Math.min(100, person.thirst + 1.5 * person.traits.thirstRate);

    if (gameState.busyUntil[index] === -1) {
      // Person is resting
      person.energy = Math.min(100, person.energy + 10 * person.traits.energyRecoveryRate);

      // Check if rest is complete
      if (person.energy === 100) {
        gameState.busyUntil[index] = 0;
      }
    } else {
      person.energy = Math.max(0, Math.min(100, person.energy - 0.5 * person.traits.energyRate));
    }

    if (person.hunger >= 100 || person.thirst >= 100 || person.energy <= 0) {
      person.health = Math.max(0, person.health - 5);
    }

    // Ensure all values are capped at their maximum
    person.health = Math.min(100, person.health);
    person.hunger = Math.min(100, person.hunger);
    person.thirst = Math.min(100, person.thirst);
    person.energy = Math.min(100, person.energy);

    // Check if person has died
    if (person.health <= 0) {
      addLogEntry(`${person.name} has died!`, 'error');
      gameState.party.splice(index, 1);
      delete gameState.busyUntil[index];
    }

    if (gameState.upgrades.medicalTent) {
      person.health = Math.min(100, person.health + 1); // Heal 1 health per hour
    }
  });

  // Update busy status
  for (let index in gameState.busyUntil) {
    if (gameState.busyUntil[index] > 0 && gameState.busyUntil[index] <= gameState.hour + (gameState.day - 1) * 24) {
      gameState.busyUntil[index] = 0;
    }
  }
}

export function performAction(personIndex, action) {
  const person = gameState.party[personIndex];
  if (isPersonBusy(personIndex)) {
    addLogEntry(`${person.name} is busy and can't ${action} right now!`, 'warning');
  } else if (person.energy <= 0 && !['eat', 'drink', 'sleep'].includes(action)) {
    addLogEntry(`${person.name} is too exhausted to ${action}!`, 'warning');
  } else {
    switch (action) {
      case 'eat':
        eat(personIndex);
        break;
      case 'drink':
        drink(personIndex);
        break;
      case 'sleep':
        sleep(personIndex);
        break;
      default:
        console.error(`Unknown action: ${action}`);
    }
    updateUI();
  }
}

function eat(personIndex) {
  const person = gameState.party[personIndex];
  if (gameState.food >= 10) {
    gameState.food -= 10;
    person.hunger = Math.max(0, person.hunger - 30);
    person.health = Math.min(100, person.health + 5);
    person.energy = Math.min(100, person.energy + 20);
    addLogEntry(`${person.name} ate food, reducing hunger by 30 and recovering 5 health and 20 energy.`, 'success');
  } else {
    addLogEntry(`${person.name} tried to eat, but there wasn't enough food.`, 'error');
  }
}

function drink(personIndex) {
  const person = gameState.party[personIndex];
  if (gameState.water >= 5) {
    gameState.water -= 5;
    person.thirst = Math.max(0, person.thirst - 25);
    person.energy = Math.min(100, person.energy + 10);
    addLogEntry(`${person.name} drank water, reducing thirst by 25 and recovering 10 energy.`);
  } else {
    addLogEntry(`${person.name} tried to drink, but there wasn't enough water.`, 'error');
  }
}

function sleep(personIndex) {
  addLogEntry(`${gameState.party[personIndex].name} went to sleep.`);
  gameState.busyUntil[personIndex] = -1; // Set to -1 to indicate sleeping
}

function isPersonBusy(personIndex) {
  return gameState.busyUntil[personIndex] > gameState.hour + (gameState.day - 1) * 24 || gameState.busyUntil[personIndex] === -1;
}

function getRandomTrait(traitName) {
  const traitRanges = {
    hungerRate: { min: 0.8, max: 1.2 },
    thirstRate: { min: 0.8, max: 1.2 },
    energyRate: { min: 0.8, max: 1.2 },
    maxEnergy: { min: 90, max: 110 },
    energyRecoveryRate: { min: 0.8, max: 1.2 }
  };

  const range = traitRanges[traitName];
  return Math.random() * (range.max - range.min) + range.min;
}