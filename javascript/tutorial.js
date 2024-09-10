import { gameState, UPGRADES } from './settings.js';
import { addLogEntry } from './log.js';

const TUTORIAL_MESSAGES = [
  {
    id: 'welcome',
    message: "Welcome to the game! Start by gathering resources using the buttons in the Actions panel.",
    trigger: state => state.day === 1 && state.hour === 2
  },
  {
    id: 'first_upgrade',
    message: "You can now afford your first upgrade! Check the Upgrades panel to see what's available.",
    trigger: state => {
      return Object.values(UPGRADES).some(upgrade =>
        upgrade.available &&
        Object.entries(upgrade.cost).every(([resource, amount]) => state[resource] >= amount) &&
        !state.upgrades[upgrade.id]
      );
    }
  },
  {
    id: 'low_resources',
    message: "Your resources are running low. Remember to balance resource gathering with other activities!",
    trigger: state => state.food < 10 || state.water < 10 || state.wood < 10
  },
  {
    id: 'first_module',
    message: "You've unlocked a new module! Explore its features to expand your survival options.",
    trigger: state => Object.keys(state.upgrades).length === 1
  },
  {
    id: 'party_management',
    message: "As your party grows, manage their energy and health carefully. Assign tasks wisely!",
    trigger: state => state.party.length > 3
  }
];

let shownTutorials = new Set();

export function checkTutorials() {
  TUTORIAL_MESSAGES.forEach(tutorial => {
    if (!shownTutorials.has(tutorial.id) && tutorial.trigger(gameState)) {
      addLogEntry(tutorial.message, 'tutorial');
      shownTutorials.add(tutorial.id);
    }
  });
}

export function initializeTutorials() {
  if (!gameState.shownTutorials) {
    gameState.shownTutorials = [];
  }
  shownTutorials = new Set();
}

export function saveTutorialState() {
  gameState.shownTutorials = Array.from(shownTutorials);
}