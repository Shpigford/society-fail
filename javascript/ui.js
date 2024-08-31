import { gameState } from './state.js';
import { gameInterval } from './core.js';
import { UPGRADES, ACHIEVEMENTS } from './constants.js';
import { addLogEntry } from './logging.js';
import { buyUpgrade } from './upgrades.js';
import { performAction } from './party.js';
import { harvestCrop, waterAllCrops } from './farming.js';
import { collectWellWater } from './resources.js';
import { startHunting, stopHunting } from './hunting.js';
import { harvestTree } from './resources.js';

export function updateUI() {
  updateResourcesUI();
  updateTimeUI();
  updatePartyUI();
  updateUpgradesUI();
  updateAchievementsUI();
  updateFarmingUI();
  updateWellUI();
  updateHuntingUI();
  updateLumberMillUI();
  updateActionButtons();
  updateLucideIcons();
}

function updateResourcesUI() {
  document.getElementById('food').textContent = Math.floor(gameState.food);
  document.getElementById('water').textContent = Math.floor(gameState.water);
  document.getElementById('wood').textContent = Math.floor(gameState.wood);
}

function updateTimeUI() {
  const timeDisplay = document.getElementById('time');
  timeDisplay.textContent = `Day ${gameState.day}, Hour ${gameState.hour}`;
  if (!gameInterval) {
    timeDisplay.textContent += ' (Paused)';
  }
  updateDayNightIndicator();
}

function updatePartyUI() {
  const partyContainer = document.getElementById('party');
  partyContainer.innerHTML = '';

  gameState.party.forEach((person, index) => {
    const personElement = createPersonElement(person, index);
    partyContainer.appendChild(personElement);
  });
}

function getProgressBarClass(value) {
  if (value > 66) return 'high';
  if (value > 33) return 'medium';
  return 'low';
}

function createPersonElement(person, index) {
  const personElement = document.createElement('div');
  personElement.className = 'person';
  const isBusy = gameState.busyUntil[index] > gameState.hour + (gameState.day - 1) * 24;
  const isResting = gameState.busyUntil[index] === -1;
  const busyTimeLeft = isBusy ? gameState.busyUntil[index] - (gameState.hour + (gameState.day - 1) * 24) : 0;

  personElement.innerHTML = `
    <div class="person-header">
      <h3><i data-lucide="person-standing" class="icon-gutter-grey"></i> ${person.name}</h3>
      <div class="busy-label ${isBusy ? (isResting ? 'resting' : 'busy') : 'idle'}">${isBusy ? `${isResting ? 'RESTING' : `BUSY [${busyTimeLeft}h]`}` : 'IDLE'}</div>
    </div>
    <div class="stats-container">
      <table class="stats">
        <tr>
          <td>Health</td>
          <td><div class="progress-bar"><div class="progress health-bar ${getProgressBarClass(person.health)}" style="width: ${person.health}%;"></div></div></td>
          <td>${Math.floor(person.health)}%</td>
        </tr>
        <tr>
          <td>Hunger</td>
          <td><div class="progress-bar"><div class="progress hunger-bar ${getProgressBarClass(100 - person.hunger)}" style="width: ${100 - person.hunger}%;"></div></div></td>
          <td>${Math.floor(100 - person.hunger)}%</td>
        </tr>
        <tr>
          <td>Thirst</td>
          <td><div class="progress-bar"><div class="progress thirst-bar ${getProgressBarClass(100 - person.thirst)}" style="width: ${100 - person.thirst}%;"></div></div></td>
          <td>${Math.floor(100 - person.thirst)}%</td>
        </tr>
        <tr>
          <td>Energy</td>
          <td><div class="progress-bar"><div class="progress energy-bar ${getProgressBarClass(person.energy)}" style="width: ${person.energy}%;"></div></div></td>
          <td>${Math.floor(person.energy)}%</td>
        </tr>
      </table>
    </div>
    <div class="traits">
      <span title="Hunger Rate">🍽️: ${person.traits.hungerRate.toFixed(2)}</span>
      <span title="Thirst Rate">💧: ${person.traits.thirstRate.toFixed(2)}</span>
      <span title="Energy Rate">⚡: ${person.traits.energyRate.toFixed(2)}</span>
      <span title="Max Energy">💪: ${person.traits.maxEnergy}</span>
      <span title="Energy Recovery Rate">🔄: ${person.traits.energyRecoveryRate.toFixed(2)}</span>
    </div>
    <div class="person-actions">
      <button onclick="performAction(${index}, 'eat')" ${isBusy || gameState.food < 10 ? 'disabled' : ''}>Eat <span>[10 <i data-lucide="beef" class="icon-dark-yellow"></i>]</span></button>
      <button onclick="performAction(${index}, 'drink')" ${isBusy || gameState.water < 5 ? 'disabled' : ''}> Drink <span>[5 <i data-lucide="droplet" class="icon-blue"></i>]</span></button>
      <button onclick="performAction(${index}, 'sleep')" ${isBusy ? 'disabled' : ''}><i data-lucide="bed-single"></i> Rest</button>
    </div>
  `;
  return personElement;
}

function updateUpgradesUI() {
  const upgradesContainer = document.getElementById('upgrades');
  upgradesContainer.innerHTML = '';

  Object.entries(UPGRADES).forEach(([upgradeId, upgrade]) => {
    if (upgrade.unlocked || gameState.upgrades[upgradeId]) {
      const upgradeElement = createUpgradeElement(upgradeId, upgrade);
      upgradesContainer.appendChild(upgradeElement);
    }
  });
}

function createUpgradeElement(upgradeId, upgrade) {
  const upgradeElement = document.createElement('button');
  upgradeElement.className = `upgrade-button ${gameState.upgrades[upgradeId] ? 'unlocked' : ''}`;
  upgradeElement.onclick = () => buyUpgrade(upgradeId);
  upgradeElement.innerHTML = `
    <div class="upgrade-name">${upgrade.name}</div>
    <div class="upgrade-effect">${upgrade.effect}</div>
    <div class="upgrade-cost">
      ${Object.entries(upgrade.cost).map(([resource, amount]) => `${amount} ${resource}`).join(', ')}
    </div>
  `;
  return upgradeElement;
}

function updateAchievementsUI() {
  const achievementsContainer = document.getElementById('achievements');
  achievementsContainer.innerHTML = '';

  ACHIEVEMENTS.forEach(achievement => {
    const achievementElement = createAchievementElement(achievement);
    achievementsContainer.appendChild(achievementElement);
  });
}

function createAchievementElement(achievement) {
  const achievementElement = document.createElement('div');
  achievementElement.className = `achievement-item ${gameState.achievements[achievement.id] ? 'achievement-unlocked' : 'achievement-locked'}`;
  achievementElement.innerHTML = `
    <div class="achievement-name">${achievement.name}</div>
    <div class="achievement-description">${achievement.description}</div>
  `;
  return achievementElement;
}

function updateFarmingUI() {
  if (!gameState.upgrades.farming) return;

  const farmingModule = document.getElementById('farming-module');
  farmingModule.innerHTML = `
    <h2><i data-lucide="sprout" class="icon-dark"></i> Farming</h2>
    <div class="crop-picker">
      ${Object.keys(gameState.farming.crops).map(cropType => `
        <button onclick="setPlantingCrop('${cropType}')" class="${gameState.plantingCrop === cropType ? 'active' : ''}">
          <i data-lucide="${getCropIcon(cropType)}" class="icon-${getCropColor(cropType)}"></i>
          ${cropType}
        </button>
      `).join('')}
    </div>
    <div class="water-all-button">
      <button onclick="waterAllCrops()">
        <div><i data-lucide="droplets" class="icon-blue"></i> Water All</div>
        <span>Cost: ${gameState.farming.waterAllCost} water</span>
      </button>
    </div>
    <div id="farming-grid">
      ${gameState.farming.grid.map((row, rowIndex) =>
    row.map((plot, colIndex) => createPlotElement(plot, rowIndex, colIndex)).join('')
  ).join('')}
    </div>
  `;
}

function createPlotElement(plot, row, col) {
  if (!plot) {
    return `<div class="plot-cell empty-plot" onclick="plantCrop(${row}, ${col})"></div>`;
  }

  const now = gameState.hour + (gameState.day - 1) * 24;
  const growthTime = gameState.farming.crops[plot.type].growthTime;
  const growthProgress = (now - plot.plantedAt) / growthTime;
  const isReady = growthProgress >= 1 && plot.watered;

  return `
    <div class="plot-cell ${isReady ? 'ready-to-harvest' : ''} ${!plot.watered ? 'needs-water' : ''}"
         onclick="${isReady ? `harvestCrop(${row}, ${col})` : `waterCrop(${row}, ${col})`}">
      <i data-lucide="${getCropIcon(plot.type)}" class="icon-${getCropColor(plot.type)}"></i>
    </div>
  `;
}

function updateWellUI() {
  if (!gameState.upgrades.well) return;

  const wellModule = document.getElementById('well-module');
  const percentage = (gameState.well.current / gameState.well.capacity) * 100;

  wellModule.innerHTML = `
    <h2><i data-lucide="glass-water" class="icon-dark"></i> Well</h2>
    <div class="well-container">
      <div id="well-progress">
        <span id="well-level">${Math.floor(gameState.well.current)}/${gameState.well.capacity}</span>
        <div id="well-water" style="width: ${percentage}%;"></div>
      </div>
      <button onclick="collectWellWater()">Collect Water</button>
    </div>
  `;
}

function updateHuntingUI() {
  const huntingModule = document.getElementById('hunting-module');
  if (!huntingModule) return;

  if (gameState.upgrades.huntingLodge) {
    huntingModule.classList.remove('hidden');
    huntingModule.innerHTML = `
      <h2><i data-lucide="target" class="icon-dark"></i> Hunting Lodge</h2>
      <div id="hunting-area">
        ${gameState.hunting.animals.map(animal => `
          <div class="wildlife" style="left: ${animal.x}%; top: ${animal.y}%;">
            <i data-lucide="${animal.type === 'deer' ? 'deer' : 'rabbit'}" class="icon-dark"></i>
          </div>
        `).join('')}
      </div>
      <button onclick="${gameState.hunting.active ? 'stopHunting()' : 'startHunting()'}">
        ${gameState.hunting.active ? 'Stop Hunting' : 'Start Hunting'}
      </button>
    `;
  } else {
    huntingModule.classList.remove('hidden');
    huntingModule.innerHTML = `
      <div class="mystery mysterious-tracks">
        <div class="icon"><i data-lucide="circle-help" class="icon-gutter-grey"></i></div>
        <div class="title">Mysterious Tracks</div>
        <div class="description">What creatures roam these lands?</div>
      </div>
    `;
  }
}

function updateLumberMillUI() {
  if (!gameState.upgrades.lumberMill) return;

  const lumberMillModule = document.getElementById('lumber-mill-module');
  lumberMillModule.innerHTML = `
    <h2><i data-lucide="tree-pine" class="icon-dark"></i> Lumber Mill</h2>
    <div id="lumber-mill-grid">
      ${gameState.lumberMill.trees.map((tree, index) => `
        <div class="tree-cell ${tree.growth >= 1 ? 'ready-to-harvest' : ''}" 
             onclick="${tree.growth >= 1 ? `harvestTree(${index})` : ''}"
             title="${tree.growth >= 1 ? 'Click to harvest' : `Growth: ${(tree.growth * 100).toFixed(0)}%`}">
          <div class="growth-indicator" style="height: ${tree.growth * 100}%;"></div>
          <i data-lucide="${tree.growth >= 1 ? 'tree-pine' : 'sprout'}" 
             class="icon-${tree.growth >= 1 ? 'dark-green' : 'light-green'}"></i>
        </div>
      `).join('')}
    </div>
  `;
}

function updateActionButtons() {
  document.getElementById('gatherFoodBtn').disabled = !canPerformAction('gatherFood');
  document.getElementById('collectWaterBtn').disabled = !canPerformAction('collectWater');
  document.getElementById('chopWoodBtn').disabled = !canPerformAction('chopWood');
}

function updateDayNightIndicator() {
  const indicator = document.getElementById('day-night-indicator');
  const hour = gameState.hour;

  if (hour >= 6 && hour < 18) {
    indicator.style.backgroundColor = '#FFD700';
    indicator.title = 'Day';
  } else {
    indicator.style.backgroundColor = '#87CEEB';
    indicator.title = 'Night';
  }

  const brightness = hour >= 6 && hour < 18
    ? Math.sin((hour - 6) / 12 * Math.PI) * 50 + 50
    : Math.sin((hour - 18) / 12 * Math.PI) * 25 + 25;

  indicator.style.filter = `brightness(${brightness}%)`;
}

export function updateLucideIcons() {
  lucide.createIcons();
}

// Helper functions
function getCropIcon(cropType) {
  switch (cropType) {
    case 'wheat': return 'wheat';
    case 'carrot': return 'carrot';
    case 'bean': return 'bean';
    default: return 'sprout';
  }
}

function getCropColor(cropType) {
  switch (cropType) {
    case 'wheat': return 'light-yellow';
    case 'carrot': return 'dark-yellow';
    case 'bean': return 'dark-red';
    default: return 'green';
  }
}

function canPerformAction(action) {
  return gameState.party.some(person => person.energy > 0 && !isPersonBusy(person));
}

function isPersonBusy(person) {
  return person.busyUntil > gameState.hour + (gameState.day - 1) * 24;
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  const collapsibles = document.querySelectorAll('.collapsible');
  collapsibles.forEach(collapsible => {
    collapsible.addEventListener('click', () => {
      collapsible.classList.toggle('collapsed');
      const content = collapsible.nextElementSibling;
      content.style.maxHeight = content.style.maxHeight ? null : content.scrollHeight + 'px';
    });
  });
});