/**
 * Watchtower Module
 * Handles rescue missions and related functionality in the game.
 */

import { gameState } from './settings.js';
import { updateGameState } from './game.js';
import { addLogEntry } from './log.js';
import { createLucideIcons } from './utils.js';
import { PartyMember } from './party.js';

// Constants for rescue mission configuration
const RESCUE_MISSION_INTERVAL = 1; // Days between rescue missions
const RESCUE_MISSION_TYPES = {
  easy: { risk: 0.1, resourceCost: { food: 20, water: 20 }, duration: 24 },
  medium: { risk: 0.3, resourceCost: { food: 40, water: 40 }, duration: 48 },
  hard: { risk: 0.5, resourceCost: { food: 60, water: 60 }, duration: 72 }
};

/**
 * Initializes the watchtower module in the game state.
 */
export function initializeWatchtower() {
  if (!gameState.watchtower) {
    gameState.watchtower = {
      lastRescueMissionDay: 0,
      rescueMissionAvailable: true,
      rescueMission: null
    };
  }
  updateWatchtowerUI();
}

/**
 * Initiates a rescue mission with the specified difficulty.
 * @param {string} difficulty - The difficulty level of the mission ('easy', 'medium', or 'hard').
 */
export function initiateRescueMission(difficulty) {
  const mission = RESCUE_MISSION_TYPES[difficulty];

  if (gameState.food < mission.resourceCost.food || gameState.water < mission.resourceCost.water) {
    addLogEntry("Not enough resources for this rescue mission.", 'error');
    return;
  }

  // Deduct resources and set up the mission
  gameState.food -= mission.resourceCost.food;
  gameState.water -= mission.resourceCost.water;
  const currentTime = gameState.hour + (gameState.day - 1) * 24;
  gameState.watchtower.rescueMission = {
    difficulty,
    startTime: currentTime,
    endTime: currentTime + mission.duration
  };

  addLogEntry(`A ${difficulty} rescue mission has been initiated. It will take ${mission.duration} hours.`, 'info');
  gameState.watchtower.rescueMissionAvailable = false;
  updateWatchtowerUI();
  updateGameState();
}

/**
 * Checks if an ongoing rescue mission has completed.
 */
export function checkRescueMission() {
  if (gameState.watchtower.rescueMission) {
    const currentTime = gameState.hour + (gameState.day - 1) * 24;
    if (currentTime >= gameState.watchtower.rescueMission.endTime) {
      completeRescueMission();
    }
  }
}

/**
 * Completes the current rescue mission and processes its outcome.
 */
function completeRescueMission() {
  const { difficulty } = gameState.watchtower.rescueMission;
  const missionType = RESCUE_MISSION_TYPES[difficulty];
  const success = Math.random() > missionType.risk;

  success ? handleSuccessfulRescue(difficulty) : handleFailedRescue();

  // Reset mission state
  gameState.watchtower.rescueMission = null;
  gameState.watchtower.rescueMissionAvailable = false;
  gameState.watchtower.lastRescueMissionDay = gameState.day;

  updateWatchtowerUI();
  updateGameState();
}

/**
 * Handles the outcome of a successful rescue mission.
 * @param {string} difficulty - The difficulty of the completed mission.
 */
function handleSuccessfulRescue(difficulty) {
  const bonusResources = {
    food: Math.floor(Math.random() * 50) + 10,
    water: Math.floor(Math.random() * 50) + 10,
    wood: Math.floor(Math.random() * 30) + 5
  };

  // Add bonus resources to game state
  Object.entries(bonusResources).forEach(([resource, amount]) => {
    gameState[resource] += amount;
    gameState.totalResourcesGathered[resource] += amount;
  });

  // Chance to add a new survivor
  if (Math.random() > 0.5) {
    const newSurvivor = new PartyMember();
    gameState.party.push(newSurvivor);
    addLogEntry(`Rescue mission successful! ${newSurvivor.name} has joined your party. They brought some supplies: ${bonusResources.food} food, ${bonusResources.water} water, and ${bonusResources.wood} wood.`, 'success');
  } else {
    addLogEntry(`Rescue mission successful! No survivors found, but the team recovered some supplies: ${bonusResources.food} food, ${bonusResources.water} water, and ${bonusResources.wood} wood.`, 'success');
  }
}

/**
 * Handles the outcome of a failed rescue mission.
 */
function handleFailedRescue() {
  if (Math.random() < 0.5 && gameState.party.length > 0) {
    const injuredPerson = gameState.party[Math.floor(Math.random() * gameState.party.length)];
    injuredPerson.health = Math.max(10, injuredPerson.health - 40);
    addLogEntry(`Rescue mission failed. ${injuredPerson.name} was injured during the attempt.`, 'error');
  } else {
    addLogEntry("Rescue mission failed. The team returned empty-handed.", 'error');
  }
}

/**
 * Updates the Watchtower UI based on the current game state.
 */
export function updateWatchtowerUI() {
  const watchtowerModule = document.getElementById('watchtower-module');
  if (!watchtowerModule || !gameState.upgrades.watchtower) return;

  watchtowerModule.classList.remove('hidden');
  const currentTime = gameState.hour + (gameState.day - 1) * 24;

  let content = '';
  if (gameState.watchtower.rescueMission) {
    content = generateMissionProgressUI(currentTime);
  } else if (gameState.watchtower.rescueMissionAvailable) {
    content = generateMissionOptionsUI();
  } else {
    content = generateCountdownUI(currentTime);
  }

  watchtowerModule.innerHTML = `
    <h2><i data-lucide="binoculars" class="icon-dark"></i> Watchtower</h2>
    ${content}
  `;

  createLucideIcons();
}

/**
 * Generates UI for ongoing mission progress.
 * @param {number} currentTime - The current game time.
 * @returns {string} HTML string for mission progress UI.
 */
function generateMissionProgressUI(currentTime) {
  const { difficulty, endTime } = gameState.watchtower.rescueMission;
  const remainingTime = endTime - currentTime;
  const remainingDays = Math.floor(remainingTime / 24);
  const remainingHours = remainingTime % 24;

  return `
    <div class="mission-progress">
      <p class="mission-status">Rescue mission in progress:</p>
      <p class="mission-difficulty">${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Mission</p>
      <p class="time-remaining">Time remaining: <span>${remainingDays}d ${remainingHours}h</span></p>
    </div>
  `;
}

/**
 * Generates UI for available mission options.
 * @returns {string} HTML string for mission options UI.
 */
function generateMissionOptionsUI() {
  return `
    <p class="mission-available">A rescue mission is available!</p>
    <div class="mission-options">
      ${Object.entries(RESCUE_MISSION_TYPES).map(([difficulty, { duration, risk, resourceCost }]) => `
        <button onclick="window.initiateRescueMission('${difficulty}')" class="${difficulty}-mission">
          <div>${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</div>
          <span>(${duration / 24}d, ${risk < 0.3 ? 'Low' : risk < 0.5 ? 'Moderate' : 'High'} Risk, Cost: ${resourceCost.food} <i data-lucide="beef"></i>, ${resourceCost.water} <i data-lucide="droplet"></i>)</span>
        </button>
      `).join('')}
    </div>
  `;
}

/**
 * Generates UI for countdown to next available mission.
 * @param {number} currentTime - The current game time.
 * @returns {string} HTML string for countdown UI.
 */
function generateCountdownUI(currentTime) {
  const lastMissionTime = gameState.watchtower.lastRescueMissionDay * 24;
  const timeSinceLastMission = currentTime - lastMissionTime;
  const missionInterval = RESCUE_MISSION_INTERVAL * 24;
  const timeUntilNextMission = Math.max(
    0,
    missionInterval - timeSinceLastMission
  );
  const daysUntilNextMission = Math.floor(timeUntilNextMission / 24);
  const hoursUntilNextMission = Math.floor(timeUntilNextMission % 24);

  if (timeUntilNextMission === 0) {
    gameState.watchtower.rescueMissionAvailable = true;
    return generateMissionOptionsUI();
  }

  return `<p class="countdown">Next mission in: ${daysUntilNextMission}d ${hoursUntilNextMission}h</p>`;
}

// Expose the initiateRescueMission function to the global scope
window.initiateRescueMission = initiateRescueMission;