import { gameState } from './settings.js';
import { addLogEntry } from './log.js';
import { updateGameState } from './game.js';
import { getIllnessChanceReduction } from './medicaltent.js';

const WHISPERS = [
  "The shadows grow longer...",
  "They're watching...",
  "The ground hungers...",
  "The air carries whispers of forgotten names...",
  "The trees remember...",
  "The water reflects faces that aren't there...",
  "Time is running out...",
  "The old ones stir in their slumber...",
  "The moon weeps blood...",
  "Forgotten rituals yearn to be performed...",
  "The wind carries the scent of decay...",
  "Shadows dance without light...",
  "The earth trembles with anticipation...",
  "Whispers of madness grow louder...",
  "The veil between worlds thins...",
  "Ancient symbols appear in the dust...",
  "The silence screams...",
  "Time flows backwards...",
  "Reality bends and warps...",
  "The abyss gazes back...",
  "Nightmares seep into waking hours...",
  "The boundaries of sanity blur...",
  "Forgotten gods demand tribute...",
  "The air grows thick with dread...",
  "Unseen eyes watch from every corner...",
  "The fabric of existence unravels...",
  "Echoes of unspoken words resonate...",
  "The stars align in impossible patterns...",
  "Memories of places never visited surface...",
  "The void between thoughts expands...",
  "Reflections move independently...",
  "Time becomes a tangible substance...",
  "The world breathes with malevolent intent...",
  "Shadows cast by nothing multiply...",
  "Reality's seams become visible...",
  "The weight of eternity presses down..."
];

const RANDOM_EVENTS = [
  { name: "Rainstorm", effect: (state) => { state.water += 50; return "A sudden rainstorm replenished your water supply! (+50 💧)"; }, type: "positive" },
  {
    name: "Wild Animal Attack", effect: (state) => {
      const victim = state.party[Math.floor(Math.random() * state.party.length)];
      victim.health -= 20;
      return `${victim.name} was attacked by a wild animal! (-20 health)`;
    }, type: "negative"
  },
  {
    name: "Food Spoilage", effect: (state) => {
      const spoiled = Math.floor(state.food * 0.2);
      state.food -= spoiled;
      return `Some of your food has spoiled! (-${spoiled} 🍖)`;
    }, type: "negative"
  },
  {
    name: "Lucky Find", effect: (state) => {
      const amount = Math.floor(Math.random() * 46) + 5; // Random number between 5 and 50
      state.food += amount;
      state.water += amount;
      return `You found a hidden cache of supplies! (+${amount} 🍖, +${amount} 💧)`;
    }, type: "positive"
  },
  {
    name: "Windfall", effect: (state) => {
      const woodAmount = Math.floor(Math.random() * 16) + 10; // Random amount between 10 and 25
      state.wood += woodAmount;
      return `A fallen tree provided extra wood! (+${woodAmount} 🪵)`;
    }, type: "positive"
  },
  {
    name: "Mysterious Illness", effect: (state) => {
      const illnessChanceReduction = getIllnessChanceReduction();
      if (Math.random() > illnessChanceReduction) {
        state.party.forEach(person => {
          person.health = Math.max(0, person.health - 5);
          person.energy = Math.max(0, person.energy - 10);
        });
        return "A mysterious illness affects everyone in the group! (-5 health, -10 energy for all)";
      }
      return "A mysterious illness threatens the group, but the Medical Tent helps prevent its spread!";
    }, type: "negative"
  },
  {
    name: "Morale Boost", effect: (state) => {
      state.party.forEach(person => {
        person.energy = Math.min(person.traits.maxEnergy, person.energy + 20);
      });
      return "A surge of hope boosts everyone's morale! (+20 energy for all)";
    }, type: "positive"
  },
  {
    name: "Tool Breaking", effect: (state) => {
      state.wood -= 10;
      return "One of your tools broke! (-10 🪵)";
    }, type: "negative"
  },
  {
    name: "Bountiful Harvest", effect: (state) => {
      if (state.upgrades.farming) {
        const bonus = Math.floor(Math.random() * 30) + 20;
        state.food += bonus;
        return `Your crops yielded an exceptional harvest! (+${bonus} 🍖)`;
      }
      return "Your crops look healthy!";
    }, type: "positive"
  },
  {
    name: "Water Contamination", effect: (state) => {
      const lost = Math.floor(state.water * 0.3);
      state.water -= lost;
      return `Some of your water got contaminated! (-${lost} 💧)`;
    }, type: "negative"
  },
  {
    name: "Unexpected Visitor", effect: (state) => {
      const foodGain = Math.floor(Math.random() * 20) + 10;
      state.food += foodGain;
      return `A friendly traveler shared some food with your group! (+${foodGain} 🍖)`;
    }, type: "positive"
  },
  {
    name: "Tool Upgrade", effect: (state) => {
      state.party.forEach(person => {
        person.traits.maxEnergy += 10;
      });
      return "You've found ways to improve your tools! (+10 max energy for all)";
    }, type: "positive"
  },
  {
    name: "Harsh Weather", effect: (state) => {
      state.party.forEach(person => {
        person.energy = Math.max(0, person.energy - 15);
      });
      return "A spell of harsh weather has drained everyone's energy! (-15 energy for all)";
    }, type: "negative"
  },
  {
    name: "Natural Spring", effect: (state) => {
      const waterGain = Math.floor(Math.random() * 40) + 20;
      state.water += waterGain;
      return `You've discovered a natural spring! (+${waterGain} 💧)`;
    }, type: "positive"
  },
  {
    name: "Wildlife Stampede", effect: (state) => {
      const foodLoss = Math.floor(state.food * 0.15);
      state.food -= foodLoss;
      return `A stampede of animals trampled some of your food stores! (-${foodLoss} 🍖)`;
    }, type: "negative"
  },
  {
    name: "Ancient Knowledge", effect: (state) => {
      if (state.upgrades.farming) {
        state.farming.maxCrops += 5;
        return "You've uncovered ancient farming techniques! (+5 max crop capacity)";
      }
      return "You've found some interesting old documents.";
    }, type: "positive"
  },
  {
    name: "Unexpected Frost", effect: (state) => {
      if (state.upgrades.farming) {
        state.farming.grid.forEach(row => {
          row.forEach(crop => {
            if (crop) crop.plantedAt += 12; // Delay growth
          });
        });
        return "An unexpected frost has slowed the growth of your crops! (12 hour delay)";
      }
      return "There was an unexpected frost last night.";
    }, type: "negative"
  },
  {
    name: "Community Spirit", effect: (state) => {
      const energyGain = 25;
      state.party.forEach(person => {
        person.energy = Math.min(person.traits.maxEnergy, person.energy + energyGain);
      });
      return `A wave of community spirit energizes everyone! (+${energyGain} energy for all)`;
    }, type: "positive"
  },
  {
    name: "Tool Innovation", effect: (state) => {
      state.staminaPerAction = Math.max(5, state.staminaPerAction - 2);
      return "You've found a way to make your tools more efficient! (-2 stamina cost per action)";
    }, type: "positive"
  },
  {
    name: "Solar Flare", effect: (state) => {
      state.party.forEach(person => {
        person.energy = Math.max(0, person.energy - 20);
      });
      return "A solar flare disrupts sleep patterns! (-20 energy for all)";
    }, type: "negative"
  },
  {
    name: "Meteor Shower", effect: (state) => {
      const resourceGain = Math.floor(Math.random() * 20) + 10;
      state.wood += resourceGain;
      state.food += resourceGain;
      return `A meteor shower brings rare minerals! (+${resourceGain} 🪵, +${resourceGain} 🍖)`;
    }, type: "positive"
  },
  {
    name: "Locust Swarm", effect: (state) => {
      if (state.upgrades.farming) {
        const foodLoss = Math.floor(state.food * 0.25);
        state.food -= foodLoss;
        return `A locust swarm devours your crops! (-${foodLoss} 🍖)`;
      }
      return "A locust swarm passes through the area.";
    }, type: "negative"
  },
  {
    name: "Inspiring Dream", effect: (state) => {
      const luckyPerson = state.party[Math.floor(Math.random() * state.party.length)];
      luckyPerson.traits.maxEnergy += 20;
      return `${luckyPerson.name} had an inspiring dream! (+20 max energy)`;
    }, type: "positive"
  },
  {
    name: "Earthquake", effect: (state) => {
      const woodLoss = Math.floor(state.wood * 0.2);
      state.wood -= woodLoss;
      return `An earthquake damages some structures! (-${woodLoss} 🪵)`;
    }, type: "negative"
  },
  {
    name: "Shooting Star", effect: (state) => {
      state.party.forEach(person => {
        person.health = Math.min(100, person.health + 10);
      });
      return "A shooting star boosts everyone's spirits! (+10 health for all)";
    }, type: "positive"
  },
  {
    name: "Time Anomaly", effect: (state) => {
      const timeJump = Math.floor(Math.random() * 12) + 1;
      state.hour = (state.hour + timeJump) % 24;
      return `A strange time anomaly occurs! (${timeJump} hours pass instantly)`;
    }, type: "neutral"
  },
  {
    name: "Alien Artifact", effect: (state) => {
      const randomPerson = state.party[Math.floor(Math.random() * state.party.length)];
      randomPerson.traits.maxEnergy += 30;
      randomPerson.health = 100;
      return `${randomPerson.name} found an alien artifact! (+30 max energy, full health)`;
    }, type: "positive"
  },
  {
    name: "Cosmic Ray", effect: (state) => {
      const unluckyPerson = state.party[Math.floor(Math.random() * state.party.length)];
      unluckyPerson.health = Math.max(1, unluckyPerson.health - 30);
      return `${unluckyPerson.name} was hit by a cosmic ray! (-30 health)`;
    }, type: "negative"
  },
  {
    name: "Quantum Fluctuation", effect: (state) => {
      const resourceChange = Math.floor(Math.random() * 50) - 25; // -25 to +25
      state.food += resourceChange;
      state.water += resourceChange;
      state.wood += resourceChange;
      return `A quantum fluctuation alters reality! (${resourceChange > 0 ? '+' : ''}${resourceChange} to all resources)`;
    }, type: "neutral"
  }
];

export function checkForRandomEvent() {
  const currentTime = gameState.hour + (gameState.day - 1) * 24;

  // Check if it's time for a new event (every 12 hours)
  if (currentTime >= gameState.nextEventTime) {
    // 25% chance for a whisper instead of a regular event
    if (Math.random() < 0.25) {
      const whisper = WHISPERS[Math.floor(Math.random() * WHISPERS.length)];
      addLogEntry(`The Whispers: "${whisper}"`, 'whisper');
    } else {
      // Select a single random event with higher chance for positive events
      const eventTypeRoll = Math.random();
      let event;
      if (eventTypeRoll < 0.6) { // 60% chance for positive event
        event = RANDOM_EVENTS.filter(e => e.type === 'positive')[Math.floor(Math.random() * RANDOM_EVENTS.filter(e => e.type === 'positive').length)];
      } else if (eventTypeRoll < 0.8) { // 20% chance for neutral event
        event = RANDOM_EVENTS.filter(e => e.type === 'neutral')[Math.floor(Math.random() * RANDOM_EVENTS.filter(e => e.type === 'neutral').length)];
      } else { // 20% chance for negative event
        event = RANDOM_EVENTS.filter(e => e.type === 'negative')[Math.floor(Math.random() * RANDOM_EVENTS.filter(e => e.type === 'negative').length)];
      }
      const message = event.effect(gameState);
      addLogEntry(`Random Event: ${event.name}. ${message}`, event.type);
    }

    // Set the next event time (between 12 and 24 hours from now)
    gameState.nextEventTime = currentTime + 12 + Math.floor(Math.random() * 12);

    // Update game state after the event
    updateGameState();
  }
}

export function initializeRandomEvents() {
  if (!gameState.nextEventTime) {
    const currentTime = gameState.hour + (gameState.day - 1) * 24;
    gameState.nextEventTime = currentTime + Math.floor(Math.random() * 12); // First event within 12 hours
  }
}