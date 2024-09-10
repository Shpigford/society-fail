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
  },
  {
    id: 'farming_intro',
    message: "You've unlocked Farming! Plant crops to secure a sustainable food source.",
    trigger: state => state.upgrades.farming && !state.shownTutorials.includes('farming_intro')
  },
  {
    id: 'well_intro',
    message: "The Well is now available! It provides a steady source of water over time.",
    trigger: state => state.upgrades.well && !state.shownTutorials.includes('well_intro')
  },
  {
    id: 'hunting_intro',
    message: "You've built the Hunting Lodge! Hunt animals for food and other resources.",
    trigger: state => state.upgrades.huntingLodge && !state.shownTutorials.includes('hunting_intro')
  },
  {
    id: 'lumber_mill_intro',
    message: "The Lumber Mill is operational! Manage tree growth for a steady wood supply.",
    trigger: state => state.upgrades.lumberMill && !state.shownTutorials.includes('lumber_mill_intro')
  },
  {
    id: 'watchtower_intro',
    message: "The Watchtower is built! Use it to send rescue missions and potentially find new survivors.",
    trigger: state => state.upgrades.watchtower && !state.shownTutorials.includes('watchtower_intro')
  },
  {
    id: 'resource_balance',
    message: "Maintaining a balance of resources is crucial. Don't focus too much on one resource!",
    trigger: state => {
      const total = state.food + state.water + state.wood;
      return total > 300 && (state.food < 50 || state.water < 50 || state.wood < 50);
    }
  },
  {
    id: 'first_achievement',
    message: "You've earned your first achievement! Check the Achievements panel to see your progress.",
    trigger: state => Object.values(state.achievements).some(achieved => achieved)
  },
  {
    id: 'energy_management',
    message: "Keep an eye on your party's energy levels. Resting is important for maintaining productivity!",
    trigger: state => state.party.some(member => member.energy < 30)
  },
  {
    id: 'upgrade_strategy',
    message: "Consider your upgrade choices carefully. Some upgrades unlock new features, while others improve existing ones.",
    trigger: state => Object.keys(state.upgrades).length === 3
  },
  {
    id: 'random_events',
    message: "Random events can occur at any time. Be prepared to adapt your strategy!",
    trigger: state => state.day >= 5 && !state.shownTutorials.includes('random_events')
  },
  {
    id: 'long_term_planning',
    message: "As you progress, think about long-term sustainability. Invest in upgrades that provide passive benefits.",
    trigger: state => state.day >= 10 && !state.shownTutorials.includes('long_term_planning')
  },
  {
    id: 'automation_hint',
    message: "Look for ways to automate resource gathering. This will free up time for more strategic decisions.",
    trigger: state => Object.keys(state.upgrades).length >= 5 && !state.shownTutorials.includes('automation_hint')
  },
  {
    id: 'party_size_management',
    message: "A larger party can gather more resources, but also consumes more. Find the right balance for your strategy.",
    trigger: state => state.party.length >= 7 && !state.shownTutorials.includes('party_size_management')
  },
  {
    id: 'advanced_upgrades',
    message: "Advanced upgrades are now available! These can significantly boost your efficiency and survival chances.",
    trigger: state => state.upgrades.advancedFarming || state.upgrades.waterPurification
  },
  {
    id: 'crisis_management',
    message: "In times of crisis, prioritize immediate survival needs. You can always rebuild once the situation stabilizes.",
    trigger: state => (state.food < 5 || state.water < 5) && state.day > 15
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