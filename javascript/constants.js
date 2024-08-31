export const UPGRADES = {
  farming: {
    id: 'farming',
    name: 'Farming',
    cost: { food: 100 },
    effect: 'Allows you to grow your own food',
    unlocked: true
  },
  well: {
    id: 'well',
    name: 'Well',
    cost: { wood: 100 },
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
    unlocked: true
  },
  medicalTent: {
    id: 'medicalTent',
    name: 'Medical Tent',
    cost: { food: 200, wood: 150 },
    effect: 'Slowly heals injured party members over time and reduces the chance of illness',
    unlocked: true
  },
  huntingLodge: {
    id: 'huntingLodge',
    name: 'Hunting Lodge',
    cost: { wood: 300, food: 100 },
    effect: 'Unlocks a new "Hunt" action that has a chance to provide a large amount of food',
    unlocked: true
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

export const ACHIEVEMENTS = [
  { id: 'survivor', name: 'Survivor', description: 'Survive for 7 days', condition: (state) => state.day >= 7 },
  { id: 'wellFed', name: 'Well Fed', description: 'Accumulate 1000 food', condition: (state) => state.totalResourcesGathered.food >= 1000 },
  { id: 'hydrated', name: 'Hydrated', description: 'Accumulate 1000 water', condition: (state) => state.totalResourcesGathered.water >= 1000 },
  { id: 'lumberjack', name: 'Lumberjack', description: 'Accumulate 1000 wood', condition: (state) => state.totalResourcesGathered.wood >= 1000 },
  { id: 'farmer', name: 'Farmer', description: 'Plant your first crop', condition: (state) => state.upgrades.farming },
  { id: 'hunter', name: 'Hunter', description: 'Build the Hunting Lodge', condition: (state) => state.upgrades.huntingLodge },
  { id: 'wellDriller', name: 'Well Driller', description: 'Build the Well', condition: (state) => state.upgrades.well },
  { id: 'doctor', name: 'Doctor', description: 'Build the Medical Tent', condition: (state) => state.upgrades.medicalTent },
  { id: 'toolMaker', name: 'Tool Maker', description: 'Build the Tool Workshop', condition: (state) => state.upgrades.toolWorkshop },
  { id: 'waterPurifier', name: 'Water Purifier', description: 'Build the Water Purification System', condition: (state) => state.upgrades.waterPurification },
  { id: 'masterFarmer', name: 'Master Farmer', description: 'Unlock Advanced Farming Techniques', condition: (state) => state.upgrades.advancedFarming },
  { id: 'bigFamily', name: 'Big Family', description: 'Have 10 people in your party', condition: (state) => state.party.length >= 10 },
  { id: 'efficient', name: 'Efficient', description: 'Perform 100 actions', condition: (state) => state.totalActions >= 100 },
  { id: 'wellStocked', name: 'Well Stocked', description: 'Have 500 of each resource at once', condition: (state) => state.food >= 500 && state.water >= 500 && state.wood >= 500 },
  { id: 'marathon', name: 'Marathon', description: 'Play for 24 hours', condition: (state) => state.totalPlayTime >= 24 * 60 * 60 },
  { id: 'cropMaster', name: 'Crop Master', description: 'Harvest 100 crops', condition: (state) => state.totalCropsHarvested >= 100 },
  { id: 'bigGame', name: 'Big Game Hunter', description: 'Successfully hunt 50 animals', condition: (state) => state.totalAnimalsHunted >= 50 },
  { id: 'waterWizard', name: 'Water Wizard', description: 'Collect 1000 water from the well', condition: (state) => state.totalWellWaterCollected >= 1000 },
  { id: 'survivor30', name: 'Long-term Survivor', description: 'Survive for 30 days', condition: (state) => state.day >= 30 },
  { id: 'jackOfAllTrades', name: 'Jack of All Trades', description: 'Unlock all upgrades', condition: (state) => Object.values(state.upgrades).every(upgrade => upgrade) },
];

export const ACTION_DURATIONS = {
  gatherFood: 2,
  collectWater: 1,
  chopWood: 3,
  eat: 1,
  drink: 1,
  sleep: -1 // -1 indicates sleep until fully rested
};

export const CROP_TYPES = {
  wheat: { growthTime: 24, waterNeeded: 5, yield: 20 },
  carrot: { growthTime: 48, waterNeeded: 10, yield: 40 },
  bean: { growthTime: 72, waterNeeded: 15, yield: 60 }
};

export const TRAIT_RANGES = {
  hungerRate: { min: 0.8, max: 1.2 },
  thirstRate: { min: 0.8, max: 1.2 },
  energyRate: { min: 0.8, max: 1.2 },
  maxEnergy: { min: 80, max: 120 },
  energyRecoveryRate: { min: 0.8, max: 1.2 }
};

export const WILDLIFE = ['bird', 'rabbit', 'rat', 'snail', 'squirrel', 'turtle'];

export const HUNT_INTERVAL = 5000; // 5 seconds
export const MOVE_INTERVAL = 500; // 0.5 seconds

export const RESCUE_MISSION_INTERVAL = 1; // 1 day

export const NAMES = [
  "Alice", "Bob", "Charlie", "David", "Eva", "Frank", "Grace", "Henry", "Ivy", "Jack",
  "Kate", "Liam", "Mia", "Noah", "Olivia", "Penny", "Quinn", "Ryan", "Sophia", "Thomas",
  "Uma", "Victor", "Wendy", "Xavier", "Yara", "Zack", "Abby", "Ben", "Chloe", "Dylan",
  "Emma", "Finn", "Gina", "Hugo", "Isla", "Adam", "Bella", "Caleb", "Daisy", "Ethan",
  "Fiona", "George", "Hannah", "Isaac", "Julia", "Kyle", "Luna", "Max", "Nora", "Oscar",
  "Poppy", "Quentin", "Rose", "Sam", "Tessa"
];