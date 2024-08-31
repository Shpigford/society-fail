import { UPGRADES, ACHIEVEMENTS } from './constants.js';

let gameState = {
  day: 1,
  hour: 1,
  party: [],
  food: 0,
  water: 0,
  wood: 0,
  upgrades: {},
  maxEnergy: 100,
  energyPerAction: 10,
  energyRecoveryPerHour: 5,
  selectedPerson: 0,
  busyUntil: {},
  farming: {
    grid: Array(5).fill().map(() => Array(5).fill(null)),
    maxCrops: 25,
    crops: {
      wheat: { growthTime: 24, waterNeeded: 5, yield: 20 },
      carrot: { growthTime: 48, waterNeeded: 10, yield: 40 },
      bean: { growthTime: 72, waterNeeded: 15, yield: 60 }
    }
  },
  plantingCrop: 'wheat',
  well: {
    capacity: 100,
    current: 0,
    fillRate: 1
  },
  totalResourcesGathered: {
    food: 0,
    water: 0,
    wood: 0
  },
  lastEventDay: 0,
  todaysEventHour: null,
  huntingTarget: null,
  huntingInterval: null,
  moveInterval: null,
  debug: false,
  achievements: {},
  totalActions: 0,
  totalPlayTime: 0,
  totalCropsHarvested: 0,
  totalAnimalsHunted: 0,
  totalWellWaterCollected: 0,
  logEntries: [],
  lumberMill: {
    trees: [],
    maxTrees: 5,
    baseGrowthTime: 24,
    growthTimeVariance: 12,
    baseHarvestAmount: 10,
    harvestAmountVariance: 5
  },
  rescueMissionAvailable: false,
  lastRescueMissionDay: 0,
  rescueMission: null,
  hunting: {
    active: false,
    animals: []
  }
};

export function initializeGameState(difficulty) {
  const initialState = { ...gameState };

  // Set initial resources based on difficulty
  switch (difficulty) {
    case 'easy':
      initialState.food = 50;
      initialState.water = 50;
      initialState.wood = 30;
      break;
    case 'medium':
      initialState.food = 30;
      initialState.water = 30;
      initialState.wood = 20;
      break;
    case 'hard':
      initialState.food = 10;
      initialState.water = 10;
      initialState.wood = 10;
      break;
  }

  // Initialize upgrades
  for (const upgradeId in UPGRADES) {
    initialState.upgrades[upgradeId] = UPGRADES[upgradeId].unlocked || false;
  }

  // Initialize achievements
  for (const achievement of ACHIEVEMENTS) {
    initialState.achievements[achievement.id] = false;
  }

  return initialState;
}

export function getGameState() {
  return gameState;
}

export function setGameState(newState) {
  gameState = { ...newState };
}

export function updateGameState(updates) {
  gameState = { ...gameState, ...updates };
}

export function getUpgrade(upgradeId) {
  return UPGRADES[upgradeId];
}

export function unlockUpgrade(upgradeId) {
  gameState.upgrades[upgradeId] = true;
}

export function isUpgradeUnlocked(upgradeId) {
  return gameState.upgrades[upgradeId];
}

export function addResource(resourceType, amount) {
  gameState[resourceType] += amount;
  gameState.totalResourcesGathered[resourceType] += amount;
}

export function consumeResource(resourceType, amount) {
  gameState[resourceType] = Math.max(0, gameState[resourceType] - amount);
}

export function addLogEntry(message, type = 'info') {
  const entryData = { message, type, day: gameState.day, hour: gameState.hour };
  gameState.logEntries.unshift(entryData);
  if (gameState.logEntries.length > 100) {
    gameState.logEntries.pop();
  }
}

export function incrementTotalActions() {
  gameState.totalActions++;
}

export function incrementTotalPlayTime() {
  gameState.totalPlayTime++;
}

export function incrementTotalCropsHarvested() {
  gameState.totalCropsHarvested++;
}

export function incrementTotalAnimalsHunted() {
  gameState.totalAnimalsHunted++;
}

export function incrementTotalWellWaterCollected(amount) {
  gameState.totalWellWaterCollected += amount;
}

export function setDebugMode(enabled) {
  gameState.debug = enabled;
}

export function isDebugMode() {
  return gameState.debug;
}

export { gameState };