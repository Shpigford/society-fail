import { gameState } from './settings.js';
import { addLogEntry } from './log.js';
import { createLucideIcons } from './utils.js';
import { UPGRADES } from './settings.js';

/**
 * Defines the list of achievements in the game.
 * Each achievement has an id, name, description, and a condition function.
 * @type {Array<Object>}
 */
export const ACHIEVEMENTS = [
  { id: 'survivor', name: 'Survivor', description: 'Survive for 7 days', condition: state => state.day >= 7 },
  { id: 'wellFed', name: 'Well Fed', description: 'Accumulate 1000 food', condition: state => state.totalResourcesGathered.food >= 1000 },
  { id: 'hydrated', name: 'Hydrated', description: 'Accumulate 1000 water', condition: state => state.totalResourcesGathered.water >= 1000 },
  { id: 'lumberjack', name: 'Lumberjack', description: 'Accumulate 1000 wood', condition: state => state.totalResourcesGathered.wood >= 1000 },
  { id: 'farmer', name: 'Farmer', description: 'Plant your first crop', condition: state => state.upgrades.farming },
  { id: 'hunter', name: 'Hunter', description: 'Build the Hunting Lodge', condition: state => state.upgrades.huntingLodge },
  { id: 'wellDriller', name: 'Well Driller', description: 'Build the Well', condition: state => state.upgrades.well },
  { id: 'doctor', name: 'Doctor', description: 'Build the Medical Tent', condition: state => state.upgrades.medicalTent },
  { id: 'toolMaker', name: 'Tool Maker', description: 'Build the Tool Workshop', condition: state => state.upgrades.toolWorkshop },
  { id: 'waterPurifier', name: 'Water Purifier', description: 'Build the Water Purification System', condition: state => state.upgrades.waterPurification },
  { id: 'masterFarmer', name: 'Master Farmer', description: 'Unlock Advanced Farming Techniques', condition: state => state.upgrades.advancedFarming },
  { id: 'bigFamily', name: 'Big Family', description: 'Have 10 people in your party', condition: state => state.party.length >= 10 },
  { id: 'efficient', name: 'Efficient', description: 'Perform 100 actions', condition: state => state.totalActions >= 100 },
  { id: 'wellStocked', name: 'Well Stocked', description: 'Have 500 of each resource at once', condition: state => state.food >= 500 && state.water >= 500 && state.wood >= 500 },
  { id: 'marathon', name: 'Marathon', description: 'Play for 24 hours', condition: state => state.totalPlayTime >= 24 * 60 * 60 },
  { id: 'cropMaster', name: 'Crop Master', description: 'Harvest 100 crops', condition: state => state.totalCropsHarvested >= 100 },
  { id: 'bigGame', name: 'Big Game Hunter', description: 'Successfully hunt 50 animals', condition: state => state.totalAnimalsHunted >= 50 },
  { id: 'waterWizard', name: 'Water Wizard', description: 'Collect 1000 water from the well', condition: state => state.totalWellWaterCollected >= 1000 },
  { id: 'survivor30', name: 'Long-term Survivor', description: 'Survive for 30 days', condition: state => state.day >= 30 },
  { id: 'jackOfAllTrades', name: 'Jack of All Trades', description: 'Unlock all upgrades', condition: state => Object.keys(UPGRADES).every(upgradeId => state.upgrades[upgradeId]) },
];

/**
 * Checks for newly unlocked achievements and unlocks them if conditions are met.
 */
export function checkAchievements() {
  ACHIEVEMENTS.forEach(achievement => {
    if (!gameState.achievements[achievement.id] && achievement.condition(gameState)) {
      unlockAchievement(achievement.id);
    }
  });
}

/**
 * Unlocks an achievement by its ID.
 * @param {string} achievementId - The ID of the achievement to unlock.
 */
function unlockAchievement(achievementId) {
  const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
  if (achievement) {
    gameState.achievements[achievementId] = true;
    addLogEntry(`Achievement Unlocked: ${achievement.name}!`, 'success');
    updateAchievementsUI();
  }
}

/**
 * Returns an array of unlocked achievements.
 * @returns {Array<Object>} An array of unlocked achievement objects.
 */
export function getUnlockedAchievements() {
  return ACHIEVEMENTS.filter(achievement => gameState.achievements[achievement.id]);
}

/**
 * Initializes the achievements in the game state.
 */
export function initializeAchievements() {
  gameState.achievements = gameState.achievements || {};
  ACHIEVEMENTS.forEach(achievement => {
    gameState.achievements[achievement.id] = gameState.achievements[achievement.id] || false;
  });
  updateAchievementsUI();
}

/**
 * Updates the achievements UI.
 */
export function updateAchievementsUI() {
  const achievementsContainer = document.getElementById('achievements');
  if (!achievementsContainer) return;

  achievementsContainer.innerHTML = ACHIEVEMENTS.map(createAchievementElement).join('');
  createLucideIcons();
}

/**
 * Creates an HTML element for an achievement.
 * @param {Object} achievement - The achievement object.
 * @returns {string} HTML string for the achievement element.
 */
function createAchievementElement(achievement) {
  const isUnlocked = gameState.achievements[achievement.id];
  return `
    <div class="achievement-item ${isUnlocked ? 'achievement-unlocked' : 'achievement-locked'}">
      <div class="achievement-icon">
        <i data-lucide="${isUnlocked ? 'check-circle' : 'circle'}" class="icon"></i>
      </div>
      <div class="achievement-info">
        <div class="achievement-name">${achievement.name}</div>
        <div class="achievement-description">${achievement.description}</div>
      </div>
    </div>
  `;
}