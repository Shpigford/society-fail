import { gameState } from './settings.js';
import { updateGameState } from './game.js';
import { addLogEntry } from './log.js';
import { createLucideIcons } from './utils.js';

/**
 * Defines the types of crops and their properties.
 * @typedef {Object} CropType
 * @property {number} growthTime - Time in hours for the crop to grow
 * @property {number} waterNeeded - Amount of water needed to plant the crop
 * @property {number} yield - Amount of food yielded when harvested
 */

/**
 * @type {Object.<string, CropType>}
 */
const CROP_TYPES = {
  wheat: { growthTime: 24, waterNeeded: 5, yield: 20 },
  carrot: { growthTime: 48, waterNeeded: 10, yield: 50 },
  bean: { growthTime: 72, waterNeeded: 15, yield: 80 }
};

/**
 * Initializes the farming module in the game state.
 */
export function initializeFarming() {
  if (!gameState.farming) {
    gameState.farming = {
      grid: Array(5).fill().map(() => Array(5).fill(null)),
      maxCrops: 25,
      crops: CROP_TYPES,
      plantingCrop: 'wheat'
    };
  }
  updateFarmingUI();
}

/**
 * Plants a crop in the specified plot.
 * @param {number} row - The row index of the plot
 * @param {number} col - The column index of the plot
 */
export function plantCrop(row, col) {
  if (gameState.farming.grid[row][col] !== null) {
    addLogEntry("This plot is already occupied!", 'warning');
    return;
  }

  const cropType = gameState.farming.plantingCrop;
  const waterCost = CROP_TYPES[cropType].waterNeeded;

  if (gameState.water >= waterCost) {
    gameState.water -= waterCost;
    gameState.farming.grid[row][col] = {
      type: cropType,
      plantedAt: gameState.hour + (gameState.day - 1) * 24
    };
    addLogEntry(`Planted ${cropType} at row ${row + 1}, column ${col + 1}.`);
    updateFarmingUI();
    updateGameState();
  } else {
    addLogEntry("Not enough water to plant this crop!", 'error');
  }
}

/**
 * Harvests a crop from the specified plot.
 * @param {number} row - The row index of the plot
 * @param {number} col - The column index of the plot
 */
export function harvestCrop(row, col) {
  const plot = gameState.farming.grid[row][col];
  if (!plot) {
    addLogEntry("No crop to harvest here!", 'warning');
    return;
  }

  const now = gameState.hour + (gameState.day - 1) * 24;
  if (now - plot.plantedAt >= CROP_TYPES[plot.type].growthTime) {
    const cropYield = CROP_TYPES[plot.type].yield;
    gameState.food += cropYield;
    gameState.farming.grid[row][col] = null;
    addLogEntry(`Harvested ${plot.type} at row ${row + 1}, column ${col + 1}, yielding ${cropYield} food.`);
    updateFarmingUI();
    updateGameState();
  } else {
    addLogEntry("This crop is not ready for harvest yet!", 'warning');
  }
}

/**
 * Sets the current crop type for planting.
 * @param {string} cropType - The type of crop to set for planting
 */
export function setPlantingCrop(cropType) {
  gameState.farming.plantingCrop = cropType;
  updateFarmingUI();
}

/**
 * Updates the farming UI.
 */
function updateFarmingUI() {
  const farmingModule = document.getElementById('farming-module');
  if (!farmingModule) return;

  farmingModule.innerHTML = `
    <h2><i data-lucide="sprout" class="icon-dark"></i> Farming</h2>
    <div class="crop-picker">
      ${Object.keys(CROP_TYPES).map(cropType => createCropButton(cropType)).join('')}
    </div>
    <div id="farming-grid">
      ${gameState.farming.grid.map((row, rowIndex) =>
    row.map((plot, colIndex) => createPlotElement(plot, rowIndex, colIndex)).join('')
  ).join('')}
    </div>
  `;

  createLucideIcons();
}

/**
 * Creates a button element for a crop type.
 * @param {string} cropType - The type of crop
 * @returns {string} HTML string for the crop button
 */
function createCropButton(cropType) {
  return `
    <button onclick="window.setPlantingCrop('${cropType}')" class="${gameState.farming.plantingCrop === cropType ? 'active' : ''}">
      <i data-lucide="${getCropIcon(cropType)}" class="icon ${getCropColor(cropType)}"></i>
      ${cropType} [${CROP_TYPES[cropType].waterNeeded} <i data-lucide="droplet" class="icon blue"></i>]
    </button>
  `;
}

/**
 * Creates an HTML element for a plot.
 * @param {Object|null} plot - The plot object or null if empty
 * @param {number} row - The row index of the plot
 * @param {number} col - The column index of the plot
 * @returns {string} HTML string for the plot element
 */
function createPlotElement(plot, row, col) {
  if (!plot) {
    return `<div class="plot-cell empty-plot" onclick="window.plantCrop(${row}, ${col})"></div>`;
  }

  const now = gameState.hour + (gameState.day - 1) * 24;
  const growthTime = CROP_TYPES[plot.type].growthTime;
  const growthProgress = (now - plot.plantedAt) / growthTime;
  const isReady = growthProgress >= 1;

  return `
    <div class="plot-cell ${isReady ? 'ready-to-harvest' : ''}"
         onclick="${isReady ? `window.harvestCrop(${row}, ${col})` : ''}">
      <i data-lucide="${getCropIcon(plot.type)}" class="icon ${getCropColor(plot.type)}"></i>
    </div>
  `;
}

/**
 * Gets the icon name for a crop type.
 * @param {string} cropType - The type of crop
 * @returns {string} The icon name
 */
function getCropIcon(cropType) {
  const icons = {
    wheat: 'wheat',
    carrot: 'carrot',
    bean: 'bean'
  };
  return icons[cropType] || 'sprout';
}

/**
 * Gets the color class for a crop type.
 * @param {string} cropType - The type of crop
 * @returns {string} The color class
 */
function getCropColor(cropType) {
  const colors = {
    wheat: 'light-yellow',
    carrot: 'dark-yellow',
    bean: 'dark-red'
  };
  return colors[cropType] || 'green';
}

// Expose functions to the global scope for onclick events
window.setPlantingCrop = setPlantingCrop;
window.plantCrop = plantCrop;
window.harvestCrop = harvestCrop;