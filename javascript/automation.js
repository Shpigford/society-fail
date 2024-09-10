import { gameState } from './settings.js';
import { updateGameState } from './game.js';
import { addLogEntry } from './log.js';
import { performAction } from './party.js';

export function initializeAutomatedFeeding() {
  gameState.automations = gameState.automations || {};
  gameState.automations.feeding = true;
}

export function initializeWaterPurificationSystem() {
  gameState.automations = gameState.automations || {};
  gameState.automations.watering = true;
}

export function initializeComfortableSleepingQuarters() {
  gameState.automations = gameState.automations || {};
  gameState.automations.resting = true;
}

export function initializeFoodGatheringDrone() {
  gameState.automations = gameState.automations || {};
  gameState.automations.foodGathering = true;
}

export function initializeWaterGatheringDrone() {
  gameState.automations = gameState.automations || {};
  gameState.automations.waterGathering = true;
}

export function initializeWoodGatheringDrone() {
  gameState.automations = gameState.automations || {};
  gameState.automations.woodGathering = true;
}

export function runAutomations() {
  if (gameState.automations) {
    if (gameState.automations.feeding) {
      automatedFeeding();
    }
    if (gameState.automations.watering) {
      automatedWatering();
    }
    if (gameState.automations.resting) {
      automatedResting();
    }
    if (gameState.automations.foodGathering) {
      automatedFoodGathering();
    }
    if (gameState.automations.waterGathering) {
      automatedWaterGathering();
    }
    if (gameState.automations.woodGathering) {
      automatedWoodGathering();
    }
  }
}

function automatedFeeding() {
  gameState.party.forEach(member => {
    if (member.hunger <= 20 && gameState.food >= 5) {
      performAction('eat', gameState.party.indexOf(member));
      addLogEntry(`Automated Feeding System fed ${member.name}`);
    }
  });
}

function automatedWatering() {
  gameState.party.forEach(member => {
    if (member.thirst <= 20 && gameState.water >= 3) {
      performAction('drink', gameState.party.indexOf(member));
      addLogEntry(`Water Purification System provided water to ${member.name}`);
    }
  });
}

function automatedResting() {
  gameState.party.forEach((member, index) => {
    if (member.energy <= 20 && !member.isResting) {
      performAction('sleep', index);
      addLogEntry(`Comfortable Sleeping Quarters initiated rest for ${member.name}`);
    }
  });
}

function automatedFoodGathering() {
  const gatherAmount = 2; // Adjust this value for balance
  gameState.food += gatherAmount;
  gameState.totalResourcesGathered.food += gatherAmount;
  addLogEntry(`Food Gathering Drone collected ${gatherAmount} food`);
}

function automatedWaterGathering() {
  const gatherAmount = 2; // Adjust this value for balance
  gameState.water += gatherAmount;
  gameState.totalResourcesGathered.water += gatherAmount;
  addLogEntry(`Water Gathering Drone collected ${gatherAmount} water`);
}

function automatedWoodGathering() {
  const gatherAmount = 2; // Adjust this value for balance
  gameState.wood += gatherAmount;
  gameState.totalResourcesGathered.wood += gatherAmount;
  addLogEntry(`Wood Gathering Drone collected ${gatherAmount} wood`);
}