import { gameState } from './settings.js';
import { updateGameState } from './game.js';
import { addLogEntry } from './log.js';
import { createLucideIcons } from './utils.js';

/**
 * Lumber Mill Module
 * This module manages the lumber mill functionality in the game.
 */

/**
 * Initializes the lumber mill in the game state.
 * Sets up initial trees if not already present.
 */
export function initializeLumberMill() {
  if (!gameState.lumberMill) {
    gameState.lumberMill = {
      trees: [],
      maxTrees: 5,
      baseGrowthTime: 24,
      growthTimeVariance: 12,
      baseHarvestAmount: 10,
      harvestAmountVariance: 5
    };
  }

  if (!gameState.lumberMill.trees || gameState.lumberMill.trees.length === 0) {
    gameState.lumberMill.trees = Array(gameState.lumberMill.maxTrees).fill().map(createTree);
  }

  updateLumberMillUI();
}

/**
 * Creates a new tree object with randomized properties.
 * @returns {Object} A new tree object
 */
function createTree() {
  const { baseGrowthTime, growthTimeVariance, baseHarvestAmount, harvestAmountVariance } = gameState.lumberMill;
  return {
    growth: 0,
    growthTime: baseGrowthTime + (Math.random() * 2 - 1) * growthTimeVariance,
    harvestAmount: Math.round(baseHarvestAmount + (Math.random() * 2 - 1) * harvestAmountVariance)
  };
}

/**
 * Harvests a tree at the specified index.
 * @param {number} index - The index of the tree to harvest
 */
export function harvestTree(index) {
  const tree = gameState.lumberMill.trees[index];
  if (tree.growth >= 1) {
    gameState.wood += tree.harvestAmount;
    addLogEntry(`Harvested a tree from the Lumber Mill, gaining ${tree.harvestAmount} wood.`, 'success');

    // Reset the tree
    gameState.lumberMill.trees[index] = createTree();

    updateLumberMillUI();
    updateGameState();
  }
}

/**
 * Grows trees in the lumber mill and adds new trees if needed.
 */
export function growLumberMillTrees() {
  if (gameState.upgrades.lumberMill) {
    gameState.lumberMill.trees = gameState.lumberMill.trees.map(growTree);

    // Add new trees if needed
    while (gameState.lumberMill.trees.length < gameState.lumberMill.maxTrees) {
      gameState.lumberMill.trees.push(createTree());
    }

    // Trim excess trees
    gameState.lumberMill.trees = gameState.lumberMill.trees.slice(0, gameState.lumberMill.maxTrees);
    updateLumberMillUI();
  }
}

/**
 * Grows a single tree.
 * @param {Object} tree - The tree to grow
 * @returns {Object} The updated tree
 */
function growTree(tree) {
  return {
    ...tree,
    growth: Math.min(1, tree.growth + (1 / tree.growthTime))
  };
}

/**
 * Updates the lumber mill state.
 */
export function updateLumberMill() {
  if (gameState.upgrades.lumberMill) {
    gameState.lumberMill.trees = gameState.lumberMill.trees.map(growTree);
    updateLumberMillUI();
  }
}

/**
 * Updates the lumber mill UI.
 */
function updateLumberMillUI() {
  const lumberMillModule = document.getElementById('lumber-mill-module');
  if (!lumberMillModule) return;

  lumberMillModule.innerHTML = `
    <h2><i data-lucide="axe" class="icon-dark"></i> Lumber Mill</h2>
    <div id="lumber-mill-grid">
      ${gameState.lumberMill.trees.map(renderTreeCell).join('')}
    </div>
  `;

  createLucideIcons();
}

/**
 * Renders a single tree cell.
 * @param {Object} tree - The tree to render
 * @param {number} index - The index of the tree
 * @returns {string} HTML string for the tree cell
 */
function renderTreeCell(tree, index) {
  const isReadyToHarvest = tree.growth >= 1;
  return `
    <div class="tree-cell ${isReadyToHarvest ? 'ready-to-harvest' : ''}" 
         onclick="${isReadyToHarvest ? `window.harvestTree(${index})` : ''}">
      <i data-lucide="tree-pine" class="icon"></i>
      <div class="growth-indicator" style="height: ${tree.growth * 100}%"></div>
    </div>
  `;
}

// Expose functions to the global scope for onclick events
window.harvestTree = harvestTree;