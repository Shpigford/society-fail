import { gameState, updateGameState, addResource, consumeResource } from './state.js';
import { UPGRADES } from './constants.js';
import { addLogEntry } from './logging.js';
import { updateUI } from './ui.js';

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
      consumeResource(resource, amount);
    }
    updateGameState({ upgrades: { ...gameState.upgrades, [upgradeId]: true } });
    addLogEntry(`Unlocked upgrade: ${upgrade.name}`);
    applyUpgradeEffects(upgradeId);
    updateUI();
  } else {
    addLogEntry(`Cannot afford upgrade: ${upgrade.name}`, 'error');
  }
}

function applyUpgradeEffects(upgradeId) {
  switch (upgradeId) {
    case 'farming':
      // Implement farming effects
      break;
    case 'well':
      // Implement well effects
      break;
    case 'advancedFarming':
      // Implement advanced farming effects
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
    case 'huntingLodge':
      // Implement hunting lodge effects
      break;
    case 'lumberMill':
      // Implement lumber mill effects
      break;
    default:
      console.warn(`No effects implemented for upgrade: ${upgradeId}`);
  }
}

export function checkUpgradeAvailability() {
  for (const [upgradeId, upgrade] of Object.entries(UPGRADES)) {
    if (!gameState.upgrades[upgradeId] && upgrade.prerequisite) {
      const prerequisiteUpgrade = UPGRADES[upgrade.prerequisite];
      if (gameState.upgrades[upgrade.prerequisite] && !upgrade.unlocked) {
        upgrade.unlocked = true;
        addLogEntry(`New upgrade available: ${upgrade.name}`);
      }
    }
  }
}