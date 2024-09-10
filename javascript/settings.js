/**
 * Game Settings Module
 * This module defines constant values and initial game state used throughout the game.
 */

// Time interval (in milliseconds) between game ticks
export const TICK_INTERVAL = 1500;

/**
 * Starting resources for each difficulty level
 * @type {Object.<string, {food: number, water: number, wood: number}>}
 */
export const STARTING_RESOURCES = {
  easy: { food: 50, water: 50, wood: 50 },
  medium: { food: 25, water: 25, wood: 25 },
  hard: { food: 0, water: 0, wood: 0 }
};

/**
 * Initial game state object
 * @type {Object}
 */
export const initialGameState = {
  version: 2,
  day: 1,
  hour: 1,
  difficulty: null,
  food: 0,
  water: 0,
  wood: 0,
  party: [],
  upgrades: {},
  lumberMill: {
    trees: [],
    maxTrees: 5,
    baseGrowthTime: 24,
    growthTimeVariance: 12,
    baseHarvestAmount: 10,
    harvestAmountVariance: 5
  },
  achievements: {},
  totalResourcesGathered: { food: 0, water: 0, wood: 0 },
  totalActions: 0,
  totalPlayTime: 0,
  totalCropsHarvested: 0,
  totalAnimalsHunted: 0,
  totalWellWaterCollected: 0,
  watchtower: {
    lastRescueMissionDay: 0,
    rescueMissionAvailable: true,
    rescueMission: null
  },
  hunting: {
    animals: []
  }
};

// Current game state, initialized with the initial game state
export let gameState = { ...initialGameState };

/**
 * Resets the game state to its initial values
 */
export function resetGameState() {
  gameState = { ...initialGameState };
}

/**
 * Upgrades object
 * @type {Object.<string, {id: string, name: string, cost: Object.<string, number>, effect: string, prerequisite: string, available: boolean}>}
 */
export const UPGRADES = {
  farming: {
    id: 'farming',
    name: 'Farming',
    cost: { food: 80 },
    effect: 'Allows you to grow your own food',
    available: true
  },
  well: {
    id: 'well',
    name: 'Well',
    cost: { wood: 80 },
    effect: 'Generates water over time',
    prerequisite: 'farming'
  },
  advancedFarming: {
    id: 'advancedFarming',
    name: 'Advanced Farming Techniques',
    cost: { food: 300 },
    effect: 'Increases crop yield by 50% and reduces growth time by 25%',
    prerequisite: 'farming'
  },
  waterPurification: {
    id: 'waterPurification',
    name: 'Water Purification System',
    cost: { water: 250, wood: 100 },
    effect: 'Reduces water consumption by 20% for all activities',
    prerequisite: 'well'
  },
  toolWorkshop: {
    id: 'toolWorkshop',
    name: 'Tool Workshop',
    cost: { wood: 400 },
    effect: 'Increases resource gathering efficiency by 25% (more resources per action)',
    available: true
  },
  medicalTent: {
    id: 'medicalTent',
    name: 'Medical Tent',
    cost: { food: 200, wood: 150 },
    effect: 'Slowly heals injured party members over time and reduces the chance of illness',
    available: true
  },
  huntingLodge: {
    id: 'huntingLodge',
    name: 'Hunting Lodge',
    cost: { wood: 300, food: 100 },
    effect: 'Unlocks a new "Hunt" action that has a chance to provide a large amount of food',
    available: true
  },
  lumberMill: {
    id: 'lumberMill',
    name: 'Lumber Mill',
    cost: { wood: 300, food: 100 },
    effect: 'Increases wood gathering efficiency by 50% and generates 1 wood per hour',
    prerequisite: 'toolWorkshop'
  },
  watchtower: {
    id: 'watchtower',
    name: 'Watchtower',
    cost: { wood: 500, food: 200 },
    effect: 'Allows you to spot and rescue potential survivors',
    prerequisite: 'huntingLodge'
  }
};

// Add this function to scale upgrade costs
export function getScaledUpgradeCost(baseUpgradeCost) {
  const scaleFactor = 1 + (gameState.day / 20); // Costs increase by 5% every 20 days
  return Math.floor(baseUpgradeCost * scaleFactor);
}