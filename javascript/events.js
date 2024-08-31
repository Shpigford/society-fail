import { gameState, updateGameState } from './state.js';
import { addLogEntry } from './logging.js';
import { addResource, consumeResource } from './resources.js';

const EVENTS = [
  {
    name: 'Rainstorm',
    probability: 0.2,
    effect: () => {
      const waterGained = Math.floor(Math.random() * 20) + 10;
      addResource('water', waterGained);
      addLogEntry(`A rainstorm has filled your water reserves with ${waterGained} water!`);
    }
  },
  {
    name: 'Wild Animal Attack',
    probability: 0.15,
    effect: () => {
      const foodLost = Math.floor(Math.random() * 10) + 5;
      consumeResource('food', foodLost);
      addLogEntry(`Wild animals raided your camp and stole ${foodLost} food!`);
    }
  },
  {
    name: 'Windfall',
    probability: 0.1,
    effect: () => {
      const woodGained = Math.floor(Math.random() * 15) + 10;
      addResource('wood', woodGained);
      addLogEntry(`A strong wind has knocked down some trees, providing you with ${woodGained} wood!`);
    }
  }
];

export function checkForRandomEvent() {
  if (gameState.hour === gameState.todaysEventHour) {
    const randomValue = Math.random();
    let cumulativeProbability = 0;

    for (const event of EVENTS) {
      cumulativeProbability += event.probability;
      if (randomValue <= cumulativeProbability) {
        event.effect();
        break;
      }
    }

    gameState.todaysEventHour = null;
  }

  if (gameState.hour === 1) {
    gameState.todaysEventHour = Math.floor(Math.random() * 24) + 1;
  }
}