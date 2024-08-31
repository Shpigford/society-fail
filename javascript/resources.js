import { gameState, addResource, consumeResource } from './state.js';
import { addLogEntry } from './logging.js';
import { checkAchievements } from './achievements.js';

export { addResource, consumeResource };

export function gatherFood() {
  const amount = Math.floor(Math.random() * 5) + 1;
  addResource('food', amount);
  addLogEntry(`Gathered ${amount} food.`);
  checkAchievements();
}

export function collectWater() {
  const amount = Math.floor(Math.random() * 5) + 1;
  addResource('water', amount);
  addLogEntry(`Collected ${amount} water.`);
  checkAchievements();
}

export function chopWood() {
  const amount = Math.floor(Math.random() * 5) + 1;
  addResource('wood', amount);
  addLogEntry(`Chopped ${amount} wood.`);
  checkAchievements();
}

export function collectWellWater() {
  const collected = gameState.well.current;
  addResource('water', collected);
  gameState.well.current = 0;
  gameState.totalWellWaterCollected += collected;
  addLogEntry(`Collected ${collected} water from the well.`);
  checkAchievements();
}

export function generateWellWater() {
  if (gameState.upgrades.well) {
    const generated = Math.min(gameState.well.fillRate, gameState.well.capacity - gameState.well.current);
    gameState.well.current += generated;
  }
}

export function harvestTree(index) {
  const tree = gameState.lumberMill.trees[index];
  if (tree.growth >= 1) {
    const woodGained = tree.harvestAmount;
    addResource('wood', woodGained);
    addLogEntry(`Harvested a tree from the Lumber Mill, gaining ${woodGained} wood.`);

    // Reset the tree
    const growthTime = gameState.lumberMill.baseGrowthTime +
      (Math.random() * 2 - 1) * gameState.lumberMill.growthTimeVariance;
    gameState.lumberMill.trees[index] = {
      growth: 0,
      growthTime: growthTime,
      harvestAmount: Math.round(gameState.lumberMill.baseHarvestAmount +
        (Math.random() * 2 - 1) * gameState.lumberMill.harvestAmountVariance)
    };

    checkAchievements();
  }
}

export function generateLumberMillWood() {
  if (gameState.upgrades.lumberMill) {
    addResource('wood', 1);
  }
}

export function growLumberMillTrees() {
  if (gameState.upgrades.lumberMill) {
    gameState.lumberMill.trees = gameState.lumberMill.trees.map(tree => ({
      ...tree,
      growth: Math.min(1, tree.growth + (1 / tree.growthTime))
    }));

    while (gameState.lumberMill.trees.length < gameState.lumberMill.maxTrees) {
      const growthTime = gameState.lumberMill.baseGrowthTime +
        (Math.random() * 2 - 1) * gameState.lumberMill.growthTimeVariance;
      gameState.lumberMill.trees.push({
        growth: 0,
        growthTime: growthTime,
        harvestAmount: Math.round(gameState.lumberMill.baseHarvestAmount +
          (Math.random() * 2 - 1) * gameState.lumberMill.harvestAmountVariance)
      });
    }

    gameState.lumberMill.trees = gameState.lumberMill.trees.slice(0, gameState.lumberMill.maxTrees);
  }
}