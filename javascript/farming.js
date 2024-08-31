import { gameState, updateGameState } from './state.js';
import { addLogEntry } from './logging.js';
import { CROP_TYPES } from './constants.js';
import { consumeResource, addResource } from './resources.js';
import { checkAchievements } from './achievements.js';

export function initializeFarmingGrid() {
  gameState.farming.grid = Array(5).fill().map(() => Array(5).fill(null));
}

export function plantCrop(row, col, cropType) {
  if (gameState.farming.grid[row][col] !== null) {
    addLogEntry("This plot is already occupied!", 'warning');
    return;
  }

  const waterCost = CROP_TYPES[cropType].waterNeeded;
  if (gameState.water >= waterCost) {
    consumeResource('water', waterCost);
    gameState.farming.grid[row][col] = {
      type: cropType,
      plantedAt: gameState.hour + (gameState.day - 1) * 24,
      watered: true
    };
    addLogEntry(`Planted ${cropType} at row ${row + 1}, column ${col + 1}.`);
  } else {
    addLogEntry("Not enough water to plant this crop!", 'error');
  }
}

export function waterCrop(row, col) {
  const plot = gameState.farming.grid[row][col];
  if (plot && !plot.watered && gameState.water >= 5) {
    consumeResource('water', 5);
    plot.watered = true;
    addLogEntry(`Watered crop at row ${row + 1}, column ${col + 1}.`);
  } else if (!plot) {
    addLogEntry("No crop to water here!", 'warning');
  } else if (plot.watered) {
    addLogEntry("This crop is already watered!", 'info');
  } else {
    addLogEntry("Not enough water to water this crop!", 'error');
  }
}

export function waterAllCrops() {
  let waterNeeded = 0;
  gameState.farming.grid.forEach(row => {
    row.forEach(plot => {
      if (plot && !plot.watered) waterNeeded += 5;
    });
  });

  if (waterNeeded === 0) {
    addLogEntry("All crops are already watered!", 'info');
    return;
  }

  if (gameState.water >= waterNeeded) {
    consumeResource('water', waterNeeded);
    gameState.farming.grid.forEach(row => {
      row.forEach(plot => {
        if (plot) plot.watered = true;
      });
    });
    addLogEntry(`Watered all crops, using ${waterNeeded} water.`, 'success');
  } else {
    addLogEntry(`Not enough water to water all crops! Need ${waterNeeded} water, but only have ${Math.floor(gameState.water)}.`, 'error');
  }
}

export function harvestCrop(row, col) {
  const plot = gameState.farming.grid[row][col];
  if (!plot) {
    addLogEntry("No crop to harvest here!", 'warning');
    return;
  }

  const now = gameState.hour + (gameState.day - 1) * 24;
  if (now - plot.plantedAt >= CROP_TYPES[plot.type].growthTime && plot.watered) {
    const cropYield = CROP_TYPES[plot.type].yield;
    addResource('food', cropYield);
    gameState.farming.grid[row][col] = null;
    gameState.totalCropsHarvested++;
    addLogEntry(`Harvested ${plot.type} at row ${row + 1}, column ${col + 1}, yielding ${cropYield} food.`);
    checkAchievements();
  } else {
    addLogEntry("This crop is not ready for harvest yet!", 'warning');
  }
}

export function setPlantingCrop(cropType) {
  updateGameState({ plantingCrop: cropType });
}

export function updateFarmingGrid() {
  gameState.farming.grid.forEach((row, rowIndex) => {
    row.forEach((crop, colIndex) => {
      if (crop && !crop.watered) {
        crop.plantedAt++; // Delay growth if not watered
      }
    });
  });
}