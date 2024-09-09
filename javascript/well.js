/**
 * Well Module
 * Handles the functionality of the well in the game, including water generation and collection.
 */

import { gameState } from './settings.js';
import { updateGameState } from './game.js';
import { addLogEntry } from './log.js';
import { createLucideIcons } from './utils.js';

/**
 * Initializes the well in the game state and updates the UI.
 */
export function initializeWell() {
  if (!gameState.well) {
    gameState.well = {
      capacity: 100,
      current: 50,
      fillRate: 1
    };
  }
  updateWellUI();
}

/**
 * Collects water from the well, updates game state, and logs the action.
 */
export function collectWellWater() {
  const amountCollected = Math.min(gameState.well.current, gameState.well.capacity);
  gameState.water += amountCollected;
  gameState.well.current = 0;
  gameState.totalWellWaterCollected += amountCollected;
  gameState.totalActions++;

  addLogEntry(`Collected ${amountCollected} water from the well.`, 'success');
  updateWellUI();
  updateGameState();
}

/**
 * Generates water in the well based on the fill rate and available capacity.
 */
export function generateWellWater() {
  if (gameState.upgrades.well) {
    const generated = Math.min(gameState.well.fillRate, gameState.well.capacity - gameState.well.current);
    gameState.well.current += generated;
    updateWellUI();
  }
}

/**
 * Updates the well UI with current water levels and collection button.
 */
function updateWellUI() {
  const wellModule = document.getElementById('well-module');
  if (!wellModule) return;

  const percentage = (gameState.well.current / gameState.well.capacity) * 100;

  wellModule.innerHTML = `
    <h2><i data-lucide="glass-water" class="icon-dark"></i> Well</h2>
    <div class="well-container">
      <div id="well-progress">
        <span id="well-level">${Math.floor(gameState.well.current)}/${gameState.well.capacity}</span>
        <div id="well-water" style="width: ${percentage}%;"></div>
      </div>
      <button id="collect-water-btn">Collect Water</button>
    </div>
  `;

  // Add event listener to the button
  document.getElementById('collect-water-btn').addEventListener('click', collectWellWater);

  createLucideIcons();
}

// No need to expose collectWellWater to the global scope anymore