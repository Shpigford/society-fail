import { gameState, UPGRADES } from './settings.js';
import { updateGameState } from './game.js';
import { addLogEntry } from './log.js';
import { createLucideIcons } from './utils.js';
import { saveGameState } from './storage.js';
import { initializeFarming } from './farming.js';
import { initializeHunting } from './hunting.js';
import { initializeAutomatedFeeding, initializeWaterPurificationSystem, initializeComfortableSleepingQuarters, initializeFoodGatheringDrone, initializeWaterGatheringDrone, initializeWoodGatheringDrone } from './automation.js';
import { initializeWell } from './well.js';
import { initializeLumberMill } from './lumbermill.js';
import { initializeWatchtower } from './watchtower.js';
import { applyAdvancedFarmingEffects } from './farming.js';

/**
 * Buys an upgrade if the player can afford it.
 * @param {string} upgradeId - The ID of the upgrade to buy.
 */
export function buyUpgrade(upgradeId) {
  const upgrade = UPGRADES[upgradeId];
  if (!upgrade || gameState.upgrades[upgradeId]) return;

  let canAfford = true;
  for (const [resource, amount] of Object.entries(upgrade.cost)) {
    if (gameState[resource] < amount) {
      canAfford = false;
      break;
    }
  }

  if (canAfford) {
    for (const [resource, amount] of Object.entries(upgrade.cost)) {
      gameState[resource] -= amount;
    }
    gameState.upgrades[upgradeId] = true;
    addLogEntry(`Unlocked upgrade: ${upgrade.name}`, 'success');
    applyUpgradeEffects(upgradeId);
    checkPrerequisites(upgradeId);
    updateGameState();
    updateUpgradesUI();
    saveGameState(); // Add this line to save the game state after buying an upgrade
  } else {
    addLogEntry(`Cannot afford upgrade: ${upgrade.name}`, 'error');
  }
}

/**
 * Applies the effects of an upgrade.
 * @param {string} upgradeId - The ID of the upgrade to apply.
 */
export function applyUpgradeEffects(upgradeId) {
  switch (upgradeId) {
    case 'farming':
      unlockSecondaryModule('farming-module');
      initializeFarming();
      break;
    case 'well':
      unlockSecondaryModule('well-module');
      initializeWell();
      break;
    case 'huntingLodge':
      unlockSecondaryModule('hunting-module');
      initializeHunting();
      break;
    case 'advancedFarming':
      applyAdvancedFarmingEffects();
      break;
    case 'waterPurification':
      // Implement water purification effects
      break;
    case 'toolWorkshop':
      // Implement tool workshop effects
      break;
    case 'medicalTent':
      // Implement medical tent effects
      break;
    case 'lumberMill':
      unlockSecondaryModule('lumber-mill-module');
      initializeLumberMill();
      break;
    case 'watchtower':
      unlockSecondaryModule('watchtower-module');
      initializeWatchtower();
      break;
    case 'automatedFeeding':
      initializeAutomatedFeeding();
      break;
    case 'waterPurificationSystem':
      initializeWaterPurificationSystem();
      break;
    case 'comfortableSleepingQuarters':
      initializeComfortableSleepingQuarters();
      break;
    case 'foodGatheringDrone':
      initializeFoodGatheringDrone();
      break;
    case 'waterGatheringDrone':
      initializeWaterGatheringDrone();
      break;
    case 'woodGatheringDrone':
      initializeWoodGatheringDrone();
      break;
    default:
      console.warn(`No effects implemented for upgrade: ${upgradeId}`);
  }
}

/**
 * Checks and updates the availability of upgrades.
 */
export function checkUpgradeAvailability() {
  if (!gameState.upgrades) {
    gameState.upgrades = {};
  }

  for (const [upgradeId, upgrade] of Object.entries(UPGRADES)) {
    if (!gameState.upgrades[upgradeId]) {
      let canAfford = true;
      for (const [resource, amount] of Object.entries(upgrade.cost)) {
        if (gameState[resource] < amount) {
          canAfford = false;
          break;
        }
      }

      if (!upgrade.available) {
        if ((upgrade.prerequisite && gameState.upgrades[upgrade.prerequisite]) || !upgrade.prerequisite) {
          upgrade.available = canAfford;
          if (canAfford) {
            addLogEntry(`New upgrade available: ${upgrade.name}`, 'info');
          }
        }
      }
    } else {
      upgrade.available = false; // Set to false if already purchased
    }
  }
  updateUpgradesUI();
}

/**
 * Updates the upgrades UI.
 */
export function updateUpgradesUI() {
  const upgradesContainer = document.getElementById('upgrades');
  if (!upgradesContainer) return;

  upgradesContainer.innerHTML = '';

  for (const [upgradeId, upgrade] of Object.entries(UPGRADES)) {
    if (upgrade.available || gameState.upgrades[upgradeId]) {
      const upgradeButton = document.createElement('button');
      upgradeButton.className = 'upgrade-button';
      upgradeButton.dataset.upgradeId = upgradeId;

      let canAfford = true;
      for (const [resource, amount] of Object.entries(upgrade.cost)) {
        if (gameState[resource] < amount) {
          canAfford = false;
          break;
        }
      }

      if (gameState.upgrades[upgradeId]) {
        upgradeButton.classList.add('purchased');
      } else if (!canAfford) {
        upgradeButton.classList.add('cannot-afford');
      } else {
        upgradeButton.classList.add('available');
      }

      upgradeButton.innerHTML = `
        <div class="upgrade-name">
          <span class="name">${upgrade.name}</span>
          <span class="cost">
            ${Object.entries(upgrade.cost).map(([resource, amount]) => `
              ${amount} <i data-lucide="${getResourceIcon(resource)}" class="icon ${getResourceColor(resource)}"></i>
            `).join('')}
          </span>
        </div>
        <div class="upgrade-effect">${upgrade.effect}</div>
      `;

      if (!gameState.upgrades[upgradeId]) {
        upgradeButton.addEventListener('click', () => buyUpgrade(upgradeId));
      }

      upgradesContainer.appendChild(upgradeButton);
    }
  }

  createLucideIcons();
}

/**
 * Gets the appropriate icon for a resource.
 * @param {string} resource - The resource type.
 * @returns {string} The icon name for the resource.
 */
function getResourceIcon(resource) {
  switch (resource) {
    case 'food': return 'beef';
    case 'water': return 'droplet';
    case 'wood': return 'tree-pine';
    default: return 'circle';
  }
}

/**
 * Gets the appropriate color class for a resource icon.
 * @param {string} resource - The resource type.
 * @returns {string} The color class for the resource icon.
 */
function getResourceColor(resource) {
  switch (resource) {
    case 'food': return 'dark-yellow';
    case 'water': return 'blue';
    case 'wood': return 'green';
    default: return '';
  }
}

/**
 * Initializes the upgrades module.
 */
export function initializeUpgrades() {
  if (!gameState.upgrades) {
    gameState.upgrades = {};
  }

  // Check and update the availability of upgrades based on the saved state
  for (const [upgradeId, upgrade] of Object.entries(UPGRADES)) {
    if (gameState.upgrades[upgradeId]) {
      upgrade.available = false; // Set to false if already purchased
    } else if (upgrade.prerequisite) {
      upgrade.available = gameState.upgrades[upgrade.prerequisite] || false;
    } else {
      upgrade.available = true; // Set to true for upgrades without prerequisites
    }
  }

  updateUpgradesUI();
}

function checkPrerequisites(purchasedUpgradeId) {
  for (const [upgradeId, upgrade] of Object.entries(UPGRADES)) {
    if (!gameState.upgrades[upgradeId] && upgrade.prerequisite === purchasedUpgradeId) {
      upgrade.available = true;
      addLogEntry(`New upgrade available: ${upgrade.name}`, 'info');
    }
  }
}

/**
 * Unlocks a secondary module by removing its mystery state.
 * @param {string} moduleId - The ID of the module to unlock.
 */
export function unlockSecondaryModule(moduleId) {
  const module = document.getElementById(moduleId);
  if (module && module.classList.contains('mystery')) {
    module.classList.remove('mystery');
    module.innerHTML = `
      <h2><i data-lucide="${getModuleIcon(moduleId)}" class="icon-dark"></i> ${getModuleTitle(moduleId)}</h2>
      <section class="module-content"></section>
    `;
    createLucideIcons();
    addLogEntry(`Unlocked new module: ${getModuleTitle(moduleId)}`, 'success');
  }
}

function getModuleIcon(moduleId) {
  switch (moduleId) {
    case 'farming-module': return 'sprout';
    case 'well-module': return 'droplet';
    case 'hunting-module': return 'target';
    case 'lumber-mill-module': return 'axe';
    case 'watchtower-module': return 'eye';
    default: return 'circle-help';
  }
}

function getModuleTitle(moduleId) {
  return moduleId.replace('-module', '').split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}