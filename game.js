// Add this new function at the beginning of the file
function initializeGameState() {
    return {
        day: 1,
        hour: 1,
        party: [],
        food: 0,
        water: 0,
        wood: 0,
        upgrades: {
            farming: false,
            well: false,
            advancedFarming: false,
            waterPurification: false,
            toolWorkshop: false,
            medicalTent: false,
            huntingLodge: false
        },
        maxStamina: 100,
        staminaPerAction: 10,
        staminaRecoveryPerHour: 5,
        selectedPerson: 0,
        busyUntil: {},
        farming: {
            grid: Array(5).fill().map(() => Array(5).fill(null)),
            maxCrops: 25
        },
        plantingCrop: 'wheat', // Default to wheat
        well: {
            capacity: 100,
            current: 0,
            fillRate: 1
        },
        totalResourcesGathered: {
            food: 0,
            water: 0,
            wood: 0
        },
        lastEventDay: 0,
        todaysEventHour: null,
        huntingTarget: null,
        huntingInterval: null,
        moveInterval: null,
        debug: false, // Added debug flag
        achievements: {},
        totalActions: 0,
        totalPlayTime: 0,
        totalCropsHarvested: 0,
        totalAnimalsHunted: 0,
        totalWellWaterCollected: 0,
        logEntries: []
    };
}

// Initialize gameState at the beginning of the file
let gameState = initializeGameState();

const names = ["Alice", "Bob", "Charlie", "David", "Eva", "Frank", "Grace", "Henry", "Ivy", "Jack", "Kate", "Liam", "Mia", "Noah", "Olivia", "Penny", "Quinn", "Ryan", "Sophia", "Thomas", "Uma", "Victor", "Wendy", "Xavier", "Yara", "Zack", "Abby", "Ben", "Chloe", "Dylan", "Emma", "Finn", "Gina", "Hugo", "Isla"];

// Add this new object to define all upgrades
const UPGRADES = {
    farming: {
        id: 'farming',
        name: 'Farming',
        cost: { food: 100 },
        effect: 'Allows you to grow your own food',
        unlocked: true
    },
    well: {
        id: 'well',
        name: 'Well',
        cost: { wood: 200 },
        effect: 'Generates water over time',
        prerequisite: 'farming'
    },
    advancedFarming: {
        id: 'advancedFarming',
        name: 'Advanced Farming Techniques',
        cost: { food: 300 },
        effect: 'Increases crop yield by 50% and reduces growth time by 25%',
        prerequisite: 'farming'
    },
    waterPurification: {
        id: 'waterPurification',
        name: 'Water Purification System',
        cost: { water: 250, wood: 100 },
        effect: 'Reduces water consumption by 20% for all activities',
        prerequisite: 'well'
    },
    toolWorkshop: {
        id: 'toolWorkshop',
        name: 'Tool Workshop',
        cost: { wood: 400 },
        effect: 'Increases resource gathering efficiency by 25% (more resources per action)',
        unlocked: true
    },
    medicalTent: {
        id: 'medicalTent',
        name: 'Medical Tent',
        cost: { food: 200, wood: 150 },
        effect: 'Slowly heals injured party members over time and reduces the chance of illness',
        unlocked: true
    },
    huntingLodge: {
        id: 'huntingLodge',
        name: 'Hunting Lodge',
        cost: { wood: 300, food: 100 },
        effect: 'Unlocks a new "Hunt" action that has a chance to provide a large amount of food',
        unlocked: true
    }
};

const ACTION_DURATIONS = {
    gatherFood: 2,
    collectWater: 1,
    chopWood: 3,
    eat: 1,
    drink: 1,
    sleep: -1 // -1 indicates sleep until fully rested
};

const CROP_TYPES = {
    wheat: { emoji: '🌾', growthTime: 24, waterNeeded: 5, yield: 20 },
    corn: { emoji: '🌽', growthTime: 48, waterNeeded: 10, yield: 40 },
    potato: { emoji: '🥔', growthTime: 72, waterNeeded: 15, yield: 60 }
};

// Add this constant for trait ranges
const TRAIT_RANGES = {
    hungerRate: { min: 0.8, max: 1.2 },
    thirstRate: { min: 0.8, max: 1.2 },
    energyRate: { min: 0.8, max: 1.2 },
    maxStamina: { min: 80, max: 120 },
    staminaRecoveryRate: { min: 0.8, max: 1.2 }
};

// Add this helper function to generate a random trait value
function getRandomTrait(traitName) {
    const range = TRAIT_RANGES[traitName];
    return Math.random() * (range.max - range.min) + range.min;
}

// Add this function at the beginning of the file
function addLogEntry(message, type = 'info') {
    const logContent = document.getElementById('log-content');
    const logEntry = document.createElement('div');
    const entryData = { message, type, day: gameState.day, hour: gameState.hour };

    logEntry.className = getLogEntryClass(type);
    logEntry.textContent = `Day ${entryData.day}, Hour ${entryData.hour}: ${entryData.message}`;

    logContent.insertBefore(logEntry, logContent.firstChild);

    // Limit log entries to 100
    while (logContent.children.length > 100) {
        logContent.removeChild(logContent.lastChild);
    }

    // Store the log entry in the gameState
    if (!gameState.logEntries) {
        gameState.logEntries = [];
    }
    gameState.logEntries.unshift(entryData);
    if (gameState.logEntries.length > 100) {
        gameState.logEntries.pop();
    }

    // Scroll to the top of the log
    logContent.scrollTop = 0;
}

// Helper function to get the appropriate class for a log entry
function getLogEntryClass(type) {
    switch (type) {
        case 'info':
            return 'log-entry mb-1 p-1 rounded transition-colors duration-300 bg-blue-900 text-blue-200';
        case 'error':
            return 'log-entry mb-1 p-1 rounded transition-colors duration-300 bg-red-900 text-red-200 font-bold';
        case 'success':
            return 'log-entry mb-1 p-1 rounded transition-colors duration-300 bg-green-900 text-green-200';
        default:
            return 'log-entry mb-1 p-1 rounded transition-colors duration-300 bg-yellow-900 text-yellow-200';
    }
}

// Add these functions at the beginning of the file
function saveGame() {
    // Create a save object
    const saveObject = {
        gameState: gameState
    };

    localStorage.setItem('societyFailSave', JSON.stringify(saveObject));
}

function loadGame() {
    const savedGame = localStorage.getItem('societyFailSave');
    if (savedGame) {
        const saveObject = JSON.parse(savedGame);
        gameState = saveObject.gameState;
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-over-screen').classList.add('hidden');
        document.getElementById('game-ui').classList.remove('hidden');
        updateUI();
        loadActivityLog();
        startGameLoop();

        // Reinitialize hunting if the upgrade is unlocked
        if (gameState.upgrades.huntingLodge) {
            startHunting();
        }

        // Reapply debug mode if it was enabled
        if (gameState.debug) {
            setDebugMode(true);
        }

        // Ensure all achievement-related properties exist
        if (!gameState.achievements) gameState.achievements = {};
        if (!gameState.totalActions) gameState.totalActions = 0;
        if (!gameState.totalPlayTime) gameState.totalPlayTime = 0;
        if (!gameState.totalCropsHarvested) gameState.totalCropsHarvested = 0;
        if (!gameState.totalAnimalsHunted) gameState.totalAnimalsHunted = 0;
        if (!gameState.totalWellWaterCollected) gameState.totalWellWaterCollected = 0;
    } else {
        document.getElementById('start-screen').classList.remove('hidden');
        document.getElementById('game-ui').classList.add('hidden');
        document.getElementById('game-over-screen').classList.add('hidden');
    }
}

// Modify the resetGame function
function resetGame(fromGameOver = false) {
    if (!fromGameOver && !confirm("Are you sure you want to reset the game? All progress will be lost.")) {
        return;
    }

    // Completely remove the save from localStorage
    localStorage.removeItem('societyFailSave');

    // Reset the game state
    gameState = initializeGameState();

    // Ensure selectedPerson is set to 0 (or -1 if there are no party members)
    gameState.selectedPerson = gameState.party.length > 0 ? 0 : -1;

    // Clear the log content
    const logContent = document.getElementById('log-content');
    if (logContent) {
        logContent.innerHTML = '';
    }

    // Hide game over and game UI, show start screen
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('game-ui').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');

    // Update the UI
    updateUI();

    // Clear any existing game interval
    if (window.gameInterval) {
        clearInterval(window.gameInterval);
    }

    // Add a log entry about the game reset
    addLogEntry("Game has been reset. All progress has been cleared.");

    // Reset debug mode
    gameState.debug = false;
}

// Add this new function
function loadActivityLog() {
    const logContent = document.getElementById('log-content');
    logContent.innerHTML = ''; // Clear existing log entries

    if (gameState.logEntries && gameState.logEntries.length > 0) {
        gameState.logEntries.forEach(entry => {
            const logEntry = document.createElement('div');
            logEntry.className = getLogEntryClass(entry.type);
            logEntry.textContent = `Day ${entry.day}, Hour ${entry.hour}: ${entry.message}`;
            logContent.appendChild(logEntry);
        });
    }
}

// Modify the startGame function
function startGame(difficulty) {
    const partySize = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 3 : 5;

    let availableNames = [...names];

    gameState.party = Array(partySize).fill().map(() => {
        const randomIndex = Math.floor(Math.random() * availableNames.length);
        const name = availableNames[randomIndex];
        availableNames.splice(randomIndex, 1);

        return {
            name: name,
            health: 100,
            hunger: 0,
            thirst: 0,
            energy: 100,
            stamina: gameState.maxStamina,
            traits: {
                hungerRate: getRandomTrait('hungerRate'),
                thirstRate: getRandomTrait('thirstRate'),
                energyRate: getRandomTrait('energyRate'),
                maxStamina: Math.round(getRandomTrait('maxStamina')),
                staminaRecoveryRate: getRandomTrait('staminaRecoveryRate')
            }
        };
    });

    // Set the selected person to the first party member
    gameState.selectedPerson = 0;

    gameState.busyUntil = {};
    gameState.party.forEach((person, index) => {
        gameState.busyUntil[index] = 0;
    });

    // Set initial resources based on difficulty
    if (difficulty === 'easy') {
        gameState.food = 50;
        gameState.water = 50;
        gameState.wood = 30;
    } else if (difficulty === 'medium') {
        gameState.food = 30;
        gameState.water = 30;
        gameState.wood = 20;
    } else {
        // Hard difficulty starts with no resources
        gameState.food = 0;
        gameState.water = 0;
        gameState.wood = 0;
    }

    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('game-ui').classList.remove('hidden');

    updateUI();
    startGameLoop();

    addLogEntry(`Game started on ${difficulty} difficulty with ${partySize} people.`);
    if (difficulty !== 'hard') {
        addLogEntry(`Starting resources: ${gameState.food} food, ${gameState.water} water, ${gameState.wood} wood.`);
    }

    updateActionButtons();

    gameState.achievements = {};
    gameState.totalActions = 0;
    gameState.totalPlayTime = 0;
    gameState.totalCropsHarvested = 0;
    gameState.totalAnimalsHunted = 0;
    gameState.totalWellWaterCollected = 0;
}

// Add this new function
function startGameLoop() {
    if (window.gameInterval) {
        clearInterval(window.gameInterval);
    }
    window.gameInterval = setInterval(gameLoop, 2000); // Change this to 2000 milliseconds (2 seconds)
}

// Add this new function
function showGameOverScreen() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-ui').classList.add('hidden');
    document.getElementById('game-over-screen').classList.remove('hidden');

    const gameStats = document.getElementById('game-stats');
    const timePlayed = (gameState.day - 1) * 24 + gameState.hour;
    const hoursPlayed = Math.floor(timePlayed);
    const daysPlayed = Math.floor(hoursPlayed / 24);

    gameStats.innerHTML = `
        <p>Time Survived: ${daysPlayed} days, ${hoursPlayed % 24} hours</p>
        <p>Total Resources Gathered:</p>
        <ul class="list-none">
            <li>🍖 Food: ${Math.floor(gameState.totalResourcesGathered.food)}</li>
            <li>💧 Water: ${Math.floor(gameState.totalResourcesGathered.water)}</li>
            <li>🪵 Wood: ${Math.floor(gameState.totalResourcesGathered.wood)}</li>
        </ul>
    `;
}

// Modify the gameLoop function
function gameLoop() {
    gameState.hour++;
    if (gameState.hour > 24) {
        gameState.hour = 1;
        gameState.day++;
    }

    if (gameState.hour === 1) {
        addLogEntry(`Day ${gameState.day} has begun.`);
    }

    // Check for random events every hour
    checkForRandomEvent();

    gameState.party.forEach((person, index) => {
        person.hunger = Math.min(100, person.hunger + 1 * person.traits.hungerRate);
        person.thirst = Math.min(100, person.thirst + 1.5 * person.traits.thirstRate);

        if (gameState.busyUntil[index] === -1) {
            // Person is resting
            person.energy = Math.min(100, person.energy + 10);
            person.stamina = Math.min(person.traits.maxStamina, person.stamina + 10 * person.traits.staminaRecoveryRate);

            // Check if rest is complete
            if (person.energy === 100 && person.stamina === person.traits.maxStamina) {
                gameState.busyUntil[index] = 0;
            }
        } else {
            person.energy = Math.max(0, Math.min(100, person.energy - 0.5 * person.traits.energyRate));
            person.stamina = Math.min(person.traits.maxStamina, person.stamina + gameState.staminaRecoveryPerHour * person.traits.staminaRecoveryRate);
        }

        if (person.hunger >= 100 || person.thirst >= 100 || person.energy <= 0) {
            person.health = Math.max(0, person.health - 5);
        }

        // Ensure all values are capped at their maximum
        person.health = Math.min(100, person.health);
        person.hunger = Math.min(100, person.hunger);
        person.thirst = Math.min(100, person.thirst);
        person.energy = Math.min(100, person.energy);
        person.stamina = Math.min(person.traits.maxStamina, person.stamina);

        // Check if person has died
        if (person.health <= 0) {
            addLogEntry(`${person.name} has died!`, 'error');
            gameState.party.splice(index, 1);
            delete gameState.busyUntil[index];
        }

        if (gameState.upgrades.medicalTent) {
            person.health = Math.min(100, person.health + 1); // Heal 1 health per hour
        }
    });

    // Update busy status
    for (let index in gameState.busyUntil) {
        if (gameState.busyUntil[index] > 0 && gameState.busyUntil[index] <= gameState.hour + (gameState.day - 1) * 24) {
            gameState.busyUntil[index] = 0;
        }
    }

    // Handle crop watering
    gameState.farming.grid.forEach((row, rowIndex) => {
        row.forEach((crop, colIndex) => {
            if (crop && !crop.watered) {
                crop.plantedAt++; // Delay growth if not watered
            }
        });
    });

    if (gameState.party.length === 0) {
        addLogEntry('Game Over! Everyone has died.', 'error');
        clearInterval(window.gameInterval);
        showGameOverScreen();
        return; // Exit the game loop
    }

    if (gameState.upgrades.well) {
        gameState.well.current = Math.min(gameState.well.capacity, gameState.well.current + gameState.well.fillRate);
    }

    gameState.totalPlayTime += 2; // 2 seconds per game loop iteration
    checkAchievements();

    updateUI();
    saveGame();
}

// Add this constant near the top of the file
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
        name: "Illness", effect: (state) => {
            const victim = state.party[Math.floor(Math.random() * state.party.length)];
            victim.health -= 10;
            victim.stamina = Math.max(0, victim.stamina - 30);
            return `${victim.name} has fallen ill! (-10 health, -30 stamina)`;
        }, type: "negative"
    },
    {
        name: "Morale Boost", effect: (state) => {
            state.party.forEach(person => {
                person.stamina = Math.min(person.traits.maxStamina, person.stamina + 20);
                person.energy = Math.min(100, person.energy + 20);
            });
            return "A surge of hope boosts everyone's morale! (+20 stamina, +20 energy for all)";
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
                person.traits.maxStamina += 10;
            });
            return "You've found ways to improve your tools! (+10 max stamina for all)";
        }, type: "positive"
    },
    {
        name: "Harsh Weather", effect: (state) => {
            state.party.forEach(person => {
                person.stamina = Math.max(0, person.stamina - 15);
            });
            return "A spell of harsh weather has drained everyone's energy! (-15 stamina for all)";
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
            const staminaGain = 25;
            state.party.forEach(person => {
                person.stamina = Math.min(person.traits.maxStamina, person.stamina + staminaGain);
            });
            return `A wave of community spirit energizes everyone! (+${staminaGain} stamina for all)`;
        }, type: "positive"
    },
    {
        name: "Tool Innovation", effect: (state) => {
            state.staminaPerAction = Math.max(5, state.staminaPerAction - 2);
            return "You've found a way to make your tools more efficient! (-2 stamina cost per action)";
        }, type: "positive"
    },
    {
        name: "Mysterious Illness", effect: (state) => {
            state.party.forEach(person => {
                person.health = Math.max(0, person.health - 5);
                person.stamina = Math.max(0, person.stamina - 10);
            });
            return "A mysterious illness affects everyone in the group! (-5 health, -10 stamina for all)";
        }, type: "negative"
    }
];

// Replace the existing checkForRandomEvent function with this one
function checkForRandomEvent() {
    // If it's a new day, schedule today's event
    if (gameState.day > gameState.lastEventDay) {
        gameState.lastEventDay = gameState.day;
        gameState.todaysEventHour = Math.floor(Math.random() * 24) + 1; // Random hour between 1 and 24
    }

    // If it's time for today's event, trigger it
    if (gameState.hour === gameState.todaysEventHour) {
        const event = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
        const message = event.effect(gameState);
        addLogEntry(`Random Event: ${event.name}. ${message}`, event.type === 'positive' ? 'success' : 'error');
        gameState.todaysEventHour = null; // Reset for the next day
        updateUI();
    }
}

// Update the addLogEntry function to handle different types of events
function addLogEntry(message, type = 'info') {
    const logContent = document.getElementById('log-content');
    const logEntry = document.createElement('div');
    const entryData = { message, type, day: gameState.day, hour: gameState.hour };

    logEntry.className = getLogEntryClass(type);
    logEntry.textContent = `Day ${entryData.day}, Hour ${entryData.hour}: ${entryData.message}`;

    logContent.insertBefore(logEntry, logContent.firstChild);

    // Limit log entries to 100
    while (logContent.children.length > 100) {
        logContent.removeChild(logContent.lastChild);
    }

    // Store the log entry in the gameState
    if (!gameState.logEntries) {
        gameState.logEntries = [];
    }
    gameState.logEntries.unshift(entryData);
    if (gameState.logEntries.length > 100) {
        gameState.logEntries.pop();
    }

    // Scroll to the top of the log
    logContent.scrollTop = 0;
}

// Helper function to get the appropriate class for a log entry
function getLogEntryClass(type) {
    switch (type) {
        case 'info':
            return 'log-entry mb-1 p-1 rounded transition-colors duration-300 bg-blue-900 text-blue-200';
        case 'error':
            return 'log-entry mb-1 p-1 rounded transition-colors duration-300 bg-red-900 text-red-200 font-bold';
        case 'success':
            return 'log-entry mb-1 p-1 rounded transition-colors duration-300 bg-green-900 text-green-200';
        default:
            return 'log-entry mb-1 p-1 rounded transition-colors duration-300 bg-yellow-900 text-yellow-200';
    }
}

// Add these constants at the top of the file
const WILDLIFE = ['🦌', '🐗', '🐇', '🦃', '🦆'];
const HUNT_INTERVAL = 5000; // 5 seconds
const MOVE_INTERVAL = 300; // Reduced from 500 (0.3 seconds instead of 0.5)

// Add this constant at the top of the file with other constants
const ACHIEVEMENTS = [
    { id: 'survivor', name: 'Survivor', description: 'Survive for 7 days', condition: () => gameState.day >= 7 },
    { id: 'wellFed', name: 'Well Fed', description: 'Accumulate 1000 food', condition: () => gameState.totalResourcesGathered.food >= 1000 },
    { id: 'hydrated', name: 'Hydrated', description: 'Accumulate 1000 water', condition: () => gameState.totalResourcesGathered.water >= 1000 },
    { id: 'lumberjack', name: 'Lumberjack', description: 'Accumulate 1000 wood', condition: () => gameState.totalResourcesGathered.wood >= 1000 },
    { id: 'farmer', name: 'Farmer', description: 'Plant your first crop', condition: () => gameState.upgrades.farming },
    { id: 'hunter', name: 'Hunter', description: 'Build the Hunting Lodge', condition: () => gameState.upgrades.huntingLodge },
    { id: 'wellDriller', name: 'Well Driller', description: 'Build the Well', condition: () => gameState.upgrades.well },
    { id: 'doctor', name: 'Doctor', description: 'Build the Medical Tent', condition: () => gameState.upgrades.medicalTent },
    { id: 'toolMaker', name: 'Tool Maker', description: 'Build the Tool Workshop', condition: () => gameState.upgrades.toolWorkshop },
    { id: 'waterPurifier', name: 'Water Purifier', description: 'Build the Water Purification System', condition: () => gameState.upgrades.waterPurification },
    { id: 'masterFarmer', name: 'Master Farmer', description: 'Unlock Advanced Farming Techniques', condition: () => gameState.upgrades.advancedFarming },
    { id: 'bigFamily', name: 'Big Family', description: 'Have 10 people in your party', condition: () => gameState.party.length >= 10 },
    { id: 'efficient', name: 'Efficient', description: 'Perform 100 actions', condition: () => gameState.totalActions >= 100 },
    { id: 'wellStocked', name: 'Well Stocked', description: 'Have 500 of each resource at once', condition: () => gameState.food >= 500 && gameState.water >= 500 && gameState.wood >= 500 },
    { id: 'marathon', name: 'Marathon', description: 'Play for 24 hours', condition: () => gameState.totalPlayTime >= 24 * 60 * 60 },
    { id: 'cropMaster', name: 'Crop Master', description: 'Harvest 100 crops', condition: () => gameState.totalCropsHarvested >= 100 },
    { id: 'bigGame', name: 'Big Game Hunter', description: 'Successfully hunt 50 animals', condition: () => gameState.totalAnimalsHunted >= 50 },
    { id: 'waterWizard', name: 'Water Wizard', description: 'Collect 1000 water from the well', condition: () => gameState.totalWellWaterCollected >= 1000 },
    { id: 'survivor30', name: 'Long-term Survivor', description: 'Survive for 30 days', condition: () => gameState.day >= 30 },
    { id: 'jackOfAllTrades', name: 'Jack of All Trades', description: 'Unlock all upgrades', condition: () => Object.values(gameState.upgrades).every(upgrade => upgrade) },
];

// Add this function to check and update achievements
function checkAchievements() {
    ACHIEVEMENTS.forEach(achievement => {
        if (!gameState.achievements[achievement.id] && achievement.condition()) {
            gameState.achievements[achievement.id] = true;
            addLogEntry(`Achievement Unlocked: ${achievement.name}!`, 'success');
            updateAchievementsUI();
        }
    });
}

// Add this function to update the achievements UI
function updateAchievementsUI() {
    const achievementsContainer = document.getElementById('achievements');
    achievementsContainer.innerHTML = '';

    ACHIEVEMENTS.forEach(achievement => {
        const achievementElement = document.createElement('div');
        achievementElement.className = `achievement p-2 rounded ${gameState.achievements[achievement.id] ? 'bg-green-900' : 'bg-neutral-800'} transition-colors duration-300`;
        achievementElement.innerHTML = `
            <div class="font-bold ${gameState.achievements[achievement.id] ? 'text-green-300' : 'text-neutral-400'}">${achievement.name}</div>
            <div class="text-xs ${gameState.achievements[achievement.id] ? 'text-green-200' : 'text-neutral-500'}">${achievement.description}</div>
        `;
        achievementsContainer.appendChild(achievementElement);
    });
}

// Modify the performAction function to update total actions
function performAction(personIndex, action, actionName) {
    // ... existing code ...

    if (!['eat', 'drink', 'sleep'].includes(actionName)) {
        gameState.totalActions++;
    }

    // ... rest of the existing code ...
}

// Modify the harvestCrop function to update total crops harvested
function harvestCrop(row, col) {
    // ... existing code ...

    if (now - plot.plantedAt >= CROP_TYPES[plot.type].growthTime && plot.watered) {
        // ... existing code ...

        gameState.totalCropsHarvested++;
        checkAchievements();
    }

    // ... rest of the existing code ...
}

// Modify the huntAnimal function to update total animals hunted
function huntAnimal(animal) {
    // ... existing code ...

    gameState.totalAnimalsHunted++;
    checkAchievements();

    // ... rest of the existing code ...
}

// Modify the collectWellWater function to update total well water collected
function collectWellWater() {
    // ... existing code ...

    gameState.totalWellWaterCollected += collected;
    checkAchievements();

    // ... rest of the existing code ...
}

// Modify the updateUI function to include updating achievements
function updateUI() {
    // ... existing code ...

    updateAchievementsUI();

    // ... rest of the existing code ...
}

// Replace the existing updateUI function with this updated version
function updateUI() {
    document.getElementById('time').textContent = `Day ${gameState.day}, Hour ${gameState.hour}`;
    document.getElementById('food').textContent = Math.floor(gameState.food);
    document.getElementById('water').textContent = Math.floor(gameState.water);
    document.getElementById('wood').textContent = Math.floor(gameState.wood);

    updateDayNightIndicator();

    const partyElement = document.getElementById('party');
    partyElement.innerHTML = '';
    gameState.party.forEach((person, index) => {
        const isBusy = isPersonBusy(index);
        const isResting = gameState.busyUntil[index] === -1;
        const busyTimeLeft = isBusy && !isResting ?
            gameState.busyUntil[index] - (gameState.hour + (gameState.day - 1) * 24) : 0;

        const getProgressBarColor = (value) => {
            if (value > 75) return 'bg-green-500';
            if (value > 50) return 'bg-yellow-500';
            if (value > 25) return 'bg-orange-500';
            return 'bg-red-500';
        };

        const getCriticalClass = (value) => {
            return value === 0 ? 'text-red-500 animate-pulse font-bold' : '';
        };

        partyElement.innerHTML += `
            <div class="person rounded-lg p-2 bg-neutral-800 cursor-pointer transition-all duration-300 relative text-xs ${index === gameState.selectedPerson ? 'border-2 border-green-500 bg-green-900/20 ring-2 ring-green-500/20' : 'border border-white'} ${isBusy ? 'opacity-70' : ''}" onclick="selectPerson(${index})">
                <h3 class="text-sm border-b border-neutral-600 pb-1 mb-1">${person.name} ${isResting ? '(Resting)' : isBusy ? `(Busy: ${busyTimeLeft}h)` : ''}</h3>
                ${isBusy ? `<div class="busy-label absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-30 text-sm rounded-md text-red-500 border border-red-500 py-1 px-2 pointer-events-none bg-black font-bold">${isResting ? 'RESTING' : 'BUSY'}</div>` : ''}
                <div class="stat flex items-center mb-1 ${getCriticalClass(person.health)}">
                    <label class="w-12 text-right mr-1">Health:</label>
                    <div class="flex-grow h-3 bg-neutral-700 rounded-full overflow-hidden">
                        <div class="h-full ${getProgressBarColor(person.health)}" style="width: ${person.health}%"></div>
                    </div>
                    <span class="w-8 text-left ml-1">${Math.floor(person.health)}%</span>
                </div>
                <div class="stat flex items-center mb-1 ${getCriticalClass(100 - person.hunger)}">
                    <label class="w-12 text-right mr-1">Hunger:</label>
                    <div class="flex-grow h-3 bg-neutral-700 rounded-full overflow-hidden">
                        <div class="h-full ${getProgressBarColor(100 - person.hunger)}" style="width: ${100 - person.hunger}%"></div>
                    </div>
                    <span class="w-8 text-left ml-1">${Math.floor(100 - person.hunger)}%</span>
                </div>
                <div class="stat flex items-center mb-1 ${getCriticalClass(100 - person.thirst)}">
                    <label class="w-12 text-right mr-1">Thirst:</label>
                    <div class="flex-grow h-3 bg-neutral-700 rounded-full overflow-hidden">
                        <div class="h-full ${getProgressBarColor(100 - person.thirst)}" style="width: ${100 - person.thirst}%"></div>
                    </div>
                    <span class="w-8 text-left ml-1">${Math.floor(100 - person.thirst)}%</span>
                </div>
                <div class="stat flex items-center mb-1 ${getCriticalClass(person.energy)}">
                    <label class="w-12 text-right mr-1">Energy:</label>
                    <div class="flex-grow h-3 bg-neutral-700 rounded-full overflow-hidden">
                        <div class="h-full ${getProgressBarColor(person.energy)}" style="width: ${person.energy}%"></div>
                    </div>
                    <span class="w-8 text-left ml-1">${Math.floor(person.energy)}%</span>
                </div>
                <div class="stat flex items-center mb-1 ${getCriticalClass((person.stamina / person.traits.maxStamina) * 100)}">
                    <label class="w-12 text-right mr-1">Stamina:</label>
                    <div class="flex-grow h-3 bg-neutral-700 rounded-full overflow-hidden">
                        <div class="h-full ${getProgressBarColor((person.stamina / person.traits.maxStamina) * 100)}" style="width: ${(person.stamina / person.traits.maxStamina) * 100}%"></div>
                    </div>
                    <span class="w-8 text-left ml-1">${Math.floor((person.stamina / person.traits.maxStamina) * 100)}%</span>
                </div>
                <div class="traits flex flex-wrap justify-around text-xs mt-2">
                    <span title="Hunger Rate" class="cursor-help">🍽️: ${person.traits.hungerRate.toFixed(2)}</span>
                    <span title="Thirst Rate" class="cursor-help">💧: ${person.traits.thirstRate.toFixed(2)}</span>
                    <span title="Energy Rate" class="cursor-help">⚡: ${person.traits.energyRate.toFixed(2)}</span>
                    <span title="Max Stamina" class="cursor-help">💪: ${person.traits.maxStamina}</span>
                    <span title="Stamina Recovery Rate" class="cursor-help">🔄: ${person.traits.staminaRecoveryRate.toFixed(2)}</span>
                </div>
                <div class="person-actions flex flex-wrap justify-around mt-2 gap-1">
                    <button onclick="eat(${index})" ${isBusy || gameState.food < 10 ? 'disabled' : ''} class="border border-green-600 bg-green-900/50 hover:bg-green-700 text-white py-1 px-2 rounded text-xs transition ${isBusy || gameState.food < 10 ? 'opacity-50 cursor-not-allowed' : ''}" style="--cooldown-duration: ${ACTION_DURATIONS.eat}s;">Eat (10 🍖)</button>
                    <button onclick="drink(${index})" ${isBusy || gameState.water < 5 ? 'disabled' : ''} class="border border-blue-600 bg-blue-900/50 hover:bg-blue-700 text-white py-1 px-2 rounded text-xs transition ${isBusy || gameState.water < 5 ? 'opacity-50 cursor-not-allowed' : ''}" style="--cooldown-duration: ${ACTION_DURATIONS.drink}s;">Drink (5 💧)</button>
                    <button onclick="sleep(${index})" ${isBusy ? 'disabled' : ''} class="border border-purple-600 bg-purple-900/50 hover:bg-purple-700 text-white py-1 px-2 rounded text-xs transition ${isBusy ? 'opacity-50 cursor-not-allowed' : ''}" style="--cooldown-duration: ${ACTION_DURATIONS.sleep}s;">Rest 💤</button>
                </div>
            </div>
        `;
    });

    // Update farming module
    const farmingModule = document.getElementById('farming-module');
    if (gameState.upgrades.farming) {
        farmingModule.classList.remove('hidden');
        farmingModule.innerHTML = `
            <h2 class="text-2xl mb-4 font-black">Farming</h2>
            <div class="mb-4">
                Plant: 
                <button id="plantWheat" onclick="setPlantingCrop('wheat')" class="border border-yellow-600 bg-yellow-900/50 hover:bg-yellow-700 text-white py-1 px-2 rounded transition" title="Wheat (5 💧)">🌾 5💧</button>
                <button id="plantCorn" onclick="setPlantingCrop('corn')" class="border border-yellow-600 bg-yellow-900/50 hover:bg-yellow-700 text-white py-1 px-2 rounded transition" title="Corn (10 💧)">🌽 10💧</button>
                <button id="plantPotato" onclick="setPlantingCrop('potato')" class="border border-yellow-600 bg-yellow-900/50 hover:bg-yellow-700 text-white py-1 px-2 rounded transition" title="Potato (15 💧)">🥔 15💧</button>
            </div>
            <div id="farming-grid" class="grid grid-cols-5 gap-2 mb-4"></div>
            <div class="mt-4">
                <button onclick="waterCrops()" class="border border-blue-600 bg-blue-900/50 hover:bg-blue-700 text-white py-2 px-4 rounded transition">Water All Crops (5 💧 each)</button>
            </div>
        `;

        // Update active state for planting buttons
        const plantButtons = {
            wheat: document.getElementById('plantWheat'),
            corn: document.getElementById('plantCorn'),
            potato: document.getElementById('plantPotato')
        };

        for (const [crop, button] of Object.entries(plantButtons)) {
            if (gameState.plantingCrop === crop) {
                button.classList.add('bg-yellow-700', 'border-yellow-400');
                button.classList.remove('bg-yellow-900/50', 'hover:bg-yellow-700');
            } else {
                button.classList.remove('bg-yellow-700', 'border-yellow-400');
                button.classList.add('bg-yellow-900/50', 'hover:bg-yellow-700');
            }
        }

        const farmingGrid = document.getElementById('farming-grid');
        gameState.farming.grid.forEach((row, rowIndex) => {
            row.forEach((plot, colIndex) => {
                const plotElement = document.createElement('div');
                plotElement.className = 'w-12 h-12 border border-neutral-600 flex justify-center items-center text-2xl cursor-pointer bg-neutral-800 rounded';

                if (plot) {
                    const now = gameState.hour + (gameState.day - 1) * 24;
                    const growthProgress = Math.min(100, ((now - plot.plantedAt) / CROP_TYPES[plot.type].growthTime) * 100);
                    const cropEmoji = CROP_TYPES[plot.type].emoji;
                    plotElement.textContent = cropEmoji;
                    plotElement.title = `${plot.type}: ${growthProgress.toFixed(0)}% grown, ${plot.watered ? 'Watered' : 'Needs Water'}`;

                    if (!plot.watered) {
                        plotElement.classList.add('opacity-50');
                    }

                    if (growthProgress === 100) {
                        plotElement.onclick = () => harvestCrop(rowIndex, colIndex);
                        plotElement.classList.add('bg-green-900/50', 'border-green-600');
                    }
                } else {
                    plotElement.textContent = '🟫';
                    plotElement.onclick = () => plantCrop(rowIndex, colIndex, gameState.plantingCrop);
                }

                farmingGrid.appendChild(plotElement);
            });
        });
    } else {
        farmingModule.classList.remove('hidden');
        farmingModule.innerHTML = `
            <div class="p-4 border border-neutral-800 bg-neutral-900 rounded-lg text-center">
                <div class="text-6xl mb-2">❓</div>
                <div class="text-xl">Mysterious Plot of Land</div>
                <div class="text-sm text-neutral-400">What could grow here?</div>
            </div>
        `;
    }

    // Update well module
    const wellModule = document.getElementById('well-module');
    if (gameState.upgrades.well) {
        wellModule.classList.remove('hidden');
        updateWellVisual();
    } else {
        wellModule.classList.remove('hidden');
        wellModule.innerHTML = `
            <div class="p-4 border border-neutral-800 bg-neutral-900 rounded-lg text-center">
                <div class="text-6xl mb-2">❓</div>
                <div class="text-xl">Mysterious Hole</div>
                <div class="text-sm text-neutral-400">Could this provide water?</div>
            </div>
        `;
    }

    // Update hunting module
    const huntingModule = document.getElementById('hunting-module');
    if (gameState.upgrades.huntingLodge) {
        huntingModule.classList.remove('hidden');
        huntingModule.innerHTML = `
            <h2 class="text-2xl mb-4 font-black">Hunting Lodge</h2>
            <div id="hunting-area" class="w-full h-64 bg-green-900/30 relative overflow-hidden rounded-lg"></div>
            <p class="mt-2 text-sm">Click on the animal to hunt it before it escapes!</p>
        `;
        if (!gameState.huntingInterval) {
            startHunting();
        }
    } else {
        huntingModule.classList.remove('hidden');
        huntingModule.innerHTML = `
            <div class="p-4 border border-neutral-800 bg-neutral-900 rounded-lg text-center">
                <div class="text-6xl mb-2">❓</div>
                <div class="text-xl">Mysterious Tracks</div>
                <div class="text-sm text-neutral-400">What creatures roam these lands?</div>
            </div>
        `;
    }

    updateUpgradeButtons();
    updateActionButtons();
    updateAchievementsUI();

    // Show/hide debug button
    // const debugButton = document.getElementById('debug-toggle');
    // if (debugButton) {
    //     debugButton.style.display = gameState.party.length > 0 ? 'inline-block' : 'none';
    // }
}

// Add these new functions for hunting mechanics
function startHunting() {
    if (gameState.huntingInterval) {
        clearInterval(gameState.huntingInterval);
    }
    gameState.huntingInterval = setInterval(spawnWildlife, HUNT_INTERVAL);
}

function stopHunting() {
    clearInterval(gameState.huntingInterval);
    clearInterval(gameState.moveInterval);
    gameState.huntingInterval = null;
    gameState.moveInterval = null;
    const huntingArea = document.getElementById('hunting-area');
    if (huntingArea) {
        huntingArea.innerHTML = '';
    }
}

function spawnWildlife() {
    const huntingArea = document.getElementById('hunting-area');
    if (!huntingArea) return; // Exit the function if hunting area doesn't exist

    huntingArea.innerHTML = '';

    const animal = WILDLIFE[Math.floor(Math.random() * WILDLIFE.length)];
    const target = document.createElement('div');
    target.textContent = animal;
    target.className = 'absolute text-4xl cursor-pointer transition-all duration-200';
    target.style.left = `${Math.random() * 80}%`;
    target.style.top = `${Math.random() * 80}%`;

    target.onclick = () => huntAnimal(animal);

    huntingArea.appendChild(target);
    gameState.huntingTarget = target;

    clearInterval(gameState.moveInterval);
    gameState.moveInterval = setInterval(moveWildlife, MOVE_INTERVAL);

    // Animal escapes after 4 seconds
    setTimeout(() => {
        if (gameState.huntingTarget === target && huntingArea) {
            huntingArea.innerHTML = '';
            clearInterval(gameState.moveInterval);
        }
    }, 4000);
}

function moveWildlife() {
    if (gameState.huntingTarget) {
        const currentLeft = parseFloat(gameState.huntingTarget.style.left);
        const currentTop = parseFloat(gameState.huntingTarget.style.top);

        // Increase movement range
        const moveRange = Math.floor(Math.random() * 51) + 25; // Random value between 25 and 75
        // Increase movement speed by reducing the divisor
        const newLeft = Math.max(0, Math.min(80, currentLeft + (Math.random() - 0.5) * moveRange));
        const newTop = Math.max(0, Math.min(80, currentTop + (Math.random() - 0.5) * moveRange));

        gameState.huntingTarget.style.left = `${newLeft}%`;
        gameState.huntingTarget.style.top = `${newTop}%`;

        // Add a smoother transition for faster movement
        gameState.huntingTarget.style.transition = 'left 0.2s, top 0.2s';
    }
}

function huntAnimal(animal) {
    const huntingArea = document.getElementById('hunting-area');
    huntingArea.innerHTML = '';
    clearInterval(gameState.moveInterval);

    let foodGained;
    switch (animal) {
        case '🦌': foodGained = 50; break;
        case '🐗': foodGained = 40; break;
        case '🐇': foodGained = 15; break;
        case '🦃': foodGained = 25; break;
        case '🦆': foodGained = 20; break;
        default: foodGained = 30;
    }

    gameState.food += foodGained;
    gameState.totalResourcesGathered.food += foodGained;
    gameState.totalAnimalsHunted++;
    checkAchievements();
    addLogEntry(`Successfully hunted ${animal}! Gained ${foodGained} food.`, 'success');
    updateUI();
}

// Modify the buyUpgrade function to start hunting when the lodge is built
function buyUpgrade(upgradeId) {
    const upgrade = UPGRADES[upgradeId];
    let canAfford = true;
    for (const [resource, amount] of Object.entries(upgrade.cost)) {
        if (gameState[resource] < amount) {
            canAfford = false;
            break;
        }
    }

    if (canAfford) {
        for (const [resource, amount] of Object.entries(upgrade.cost)) {
            gameState[resource] -= amount;
        }
        gameState.upgrades[upgradeId] = true;
        addLogEntry(`Unlocked ${upgrade.name}!`, 'success');

        if (upgradeId === 'huntingLodge') {
            startHunting();
        }

        updateUI();
    } else {
        addLogEntry("Not enough resources for this upgrade.", 'error');
    }
}

function performAction(personIndex, action, actionName) {
    const person = gameState.party[personIndex];
    if (isPersonBusy(personIndex)) {
        addLogEntry(`${person.name} is busy and can't ${actionName} right now!`, 'warning');
    } else if (person.energy <= 0 && !['eat', 'drink', 'sleep'].includes(actionName)) {
        addLogEntry(`${person.name} is too exhausted to ${actionName}!`, 'warning');
    } else if (person.stamina >= gameState.staminaPerAction || ['eat', 'drink', 'sleep'].includes(actionName)) {
        action();
        // Increase energy drain for gather, collect, and chop actions
        const energyDrain = ['gatherFood', 'collectWater', 'chopWood'].includes(actionName) ? 15 : 5;
        if (!['eat', 'drink', 'sleep'].includes(actionName)) {
            person.stamina -= gameState.staminaPerAction;
            person.energy = Math.max(0, person.energy - energyDrain);
            gameState.totalActions++;
        }
        setBusy(personIndex, ACTION_DURATIONS[actionName]);
        updateUI();

        // Add cooldown animation
        const button = document.querySelector(`#party .person:nth-child(${personIndex + 1}) button[onclick^="${actionName}"]`);
        if (button) {
            button.classList.add('cooldown');
            button.style.setProperty('--cooldown-duration', `${ACTION_DURATIONS[actionName]}s`);
            button.addEventListener('animationend', () => {
                button.classList.remove('cooldown');
            }, { once: true });
        }
    } else {
        addLogEntry(`${person.name} doesn't have enough stamina to ${actionName}!`, 'warning');
    }
}

function setBusy(personIndex, duration) {
    if (duration === -1) {
        gameState.busyUntil[personIndex] = -1; // Sleeping
    } else {
        gameState.busyUntil[personIndex] = gameState.hour + (gameState.day - 1) * 24 + duration;
    }
}

function gatherFood() {
    performAction(gameState.selectedPerson, () => {
        const baseAmount = 5;
        const randomAmount = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        let amount = Math.max(1, baseAmount + randomAmount); // Ensure at least 1 food is gathered

        if (gameState.upgrades.toolWorkshop) {
            amount = Math.floor(amount * 1.25); // 25% increase from Tool Workshop
        }

        gameState.food += amount;
        gameState.totalResourcesGathered.food += amount;
        addLogEntry(`${gameState.party[gameState.selectedPerson].name} gathered ${amount} food.`);
    }, "gatherFood");
}

function collectWater() {
    performAction(gameState.selectedPerson, () => {
        const baseAmount = 10;
        const randomAmount = Math.floor(Math.random() * 5) - 2; // -2, -1, 0, 1, or 2
        let amount = Math.max(1, baseAmount + randomAmount); // Ensure at least 1 water is collected

        if (gameState.upgrades.toolWorkshop) {
            amount = Math.floor(amount * 1.25); // 25% increase from Tool Workshop
        }

        if (gameState.upgrades.waterPurification) {
            amount = Math.floor(amount * 1.2); // 20% more efficient water collection
        }

        gameState.water += amount;
        gameState.totalResourcesGathered.water += amount;
        addLogEntry(`${gameState.party[gameState.selectedPerson].name} collected ${amount} water.`);
    }, "collectWater");
}

function chopWood() {
    performAction(gameState.selectedPerson, () => {
        const baseAmount = 3;
        const randomAmount = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        let amount = Math.max(1, baseAmount + randomAmount); // Ensure at least 1 wood is chopped

        if (gameState.upgrades.toolWorkshop) {
            amount = Math.floor(amount * 1.25); // 25% increase from Tool Workshop
        }

        gameState.wood += amount;
        gameState.totalResourcesGathered.wood += amount;
        addLogEntry(`${gameState.party[gameState.selectedPerson].name} chopped ${amount} wood.`);
    }, "chopWood");
}

function eat(personIndex) {
    performAction(personIndex, () => {
        const person = gameState.party[personIndex];
        if (gameState.food >= 10) {
            gameState.food -= 10;
            person.hunger = Math.max(0, person.hunger - 30);
            person.health = Math.min(100, person.health + 5);
            person.stamina = Math.min(person.traits.maxStamina, person.stamina + 20);
            addLogEntry(`${person.name} ate food, reducing hunger by 30 and recovering 5 health and 20 stamina.`, 'success');
        } else {
            addLogEntry(`${person.name} tried to eat, but there wasn't enough food.`, 'error');
        }
    }, "eat");
}

function drink(personIndex) {
    performAction(personIndex, () => {
        const person = gameState.party[personIndex];
        if (gameState.water >= 5) {
            gameState.water -= 5;
            person.thirst = Math.max(0, person.thirst - 25);
            person.stamina = Math.min(person.traits.maxStamina, person.stamina + 10);
            addLogEntry(`${person.name} drank water, reducing thirst by 25 and recovering 10 stamina.`);
        } else {
            addLogEntry(`${person.name} tried to drink, but there wasn't enough water.`, 'error');
        }
    }, "drink");
}

function sleep(personIndex) {
    performAction(personIndex, () => {
        addLogEntry(`${gameState.party[personIndex].name} went to sleep.`);
    }, "sleep");
}

function unlockFarming() {
    const cost = 100;
    if (gameState.food >= cost) {
        gameState.food -= cost;
        gameState.upgrades.farming = true;
        initializeFarmingGrid();
        updateUI();
        addLogEntry("Farming has been unlocked! You can now plant and harvest crops.", 'success');
    } else {
        addLogEntry("Failed to unlock farming due to insufficient food.", 'error');
    }
}

function initializeFarmingGrid() {
    gameState.farming.grid = Array(5).fill().map(() => Array(5).fill(null));
}

function plantCrop(row, col, cropType) {
    if (gameState.farming.grid[row][col] !== null) {
        addLogEntry("This plot is already occupied!", 'warning');
        return;
    }

    const waterCost = CROP_TYPES[cropType].waterNeeded;
    if (gameState.water >= waterCost) {
        gameState.water -= waterCost;
        gameState.farming.grid[row][col] = {
            type: cropType,
            plantedAt: gameState.hour + (gameState.day - 1) * 24,
            watered: true
        };
        updateUI();
        addLogEntry(`Planted ${cropType} at row ${row + 1}, column ${col + 1}.`);
    } else {
        addLogEntry("Not enough water to plant this crop!", 'error');
    }
}

function waterCrops() {
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
        gameState.water -= waterNeeded;
        gameState.farming.grid.forEach(row => {
            row.forEach(plot => {
                if (plot) plot.watered = true;
            });
        });
        updateUI();
        addLogEntry(`Watered all crops, using ${waterNeeded} water.`, 'success');
    } else {
        addLogEntry(`Not enough water to water all crops! Need ${waterNeeded} water, but only have ${Math.floor(gameState.water)}.`, 'error');
    }
}

function harvestCrop(row, col) {
    const plot = gameState.farming.grid[row][col];
    if (!plot) {
        addLogEntry("No crop to harvest here!", 'warning');
        return;
    }

    const now = gameState.hour + (gameState.day - 1) * 24;
    if (now - plot.plantedAt >= CROP_TYPES[plot.type].growthTime && plot.watered) {
        const yield = CROP_TYPES[plot.type].yield;
        gameState.food += yield;
        gameState.totalResourcesGathered.food += yield;
        gameState.farming.grid[row][col] = null;
        gameState.totalCropsHarvested++;
        checkAchievements();
        updateUI();
        addLogEntry(`Harvested ${plot.type} at row ${row + 1}, column ${col + 1}, yielding ${yield} food.`);
    } else {
        addLogEntry("This crop is not ready for harvest yet!", 'warning');
    }
}

function selectPerson(index) {
    gameState.selectedPerson = index;
    updateUI();
}

function isPersonBusy(personIndex) {
    return gameState.busyUntil[personIndex] === -1 || gameState.busyUntil[personIndex] > gameState.hour + (gameState.day - 1) * 24;
}

function setPlantingCrop(cropType) {
    gameState.plantingCrop = cropType;
    updateUI();
}

function updateDayNightIndicator() {
    const indicator = document.getElementById('day-night-indicator');
    const hour = gameState.hour;

    if (hour >= 6 && hour < 18) {
        // Daytime
        indicator.style.backgroundColor = '#FFD700'; // Gold for sun
        indicator.title = 'Day';
    } else {
        // Nighttime
        indicator.style.backgroundColor = '#87CEEB'; // Sky blue for moon
        indicator.title = 'Night';
    }

    // Adjust brightness based on time of day
    const brightness = hour >= 6 && hour < 18
        ? Math.sin((hour - 6) / 12 * Math.PI) * 50 + 50
        : Math.sin((hour - 18) / 12 * Math.PI) * 25 + 25;

    indicator.style.filter = `brightness(${brightness}%)`;
}

function updateUpgradeButtons() {
    const upgradesContainer = document.getElementById('upgrades');
    upgradesContainer.innerHTML = ''; // Clear existing buttons

    for (const [upgradeId, upgrade] of Object.entries(UPGRADES)) {
        if (!upgrade.unlocked && !gameState.upgrades[upgrade.prerequisite]) continue;

        const button = document.createElement('button');
        button.className = 'bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition mb-2 w-full text-left';

        let costText = Object.entries(upgrade.cost).map(([resource, amount]) => `${amount} ${getResourceEmoji(resource)}`).join(', ');

        button.innerHTML = `
            <div class="font-bold">${upgrade.name} (${costText})</div>
            <div class="text-xs">${upgrade.effect}</div>
        `;

        if (gameState.upgrades[upgradeId]) {
            button.disabled = true;
            button.classList.add('bg-green-800', 'cursor-default');
            button.classList.remove('hover:bg-green-700');
            button.innerHTML += '<div class="text-xs font-bold mt-1">Unlocked ✅</div>';
        } else {
            button.onclick = () => buyUpgrade(upgradeId);
            let canAfford = true;
            for (const [resource, amount] of Object.entries(upgrade.cost)) {
                if (gameState[resource] < amount) {
                    canAfford = false;
                    break;
                }
            }
            if (!canAfford) {
                button.disabled = true;
                button.classList.add('opacity-50', 'cursor-not-allowed');
            }
        }

        upgradesContainer.appendChild(button);
    }
}

// Helper function to get resource emoji
function getResourceEmoji(resource) {
    switch (resource) {
        case 'food': return '🍖';
        case 'water': return '💧';
        case 'wood': return '🪵';
        default: return '';
    }
}

function collectWellWater() {
    const collected = gameState.well.current;
    gameState.water += collected;
    gameState.totalResourcesGathered.water += collected;
    gameState.well.current = 0;
    gameState.totalWellWaterCollected += collected;
    checkAchievements();
    addLogEntry(`Collected ${collected} water from the well.`);
    updateUI();
    updateWellVisual();
}

function buyWellUpgrade() {
    const cost = 200;
    if (gameState.wood >= cost) {
        gameState.wood -= cost;
        gameState.upgrades.well = true;
        addLogEntry("You've built a well! It will collect water hourly.", 'success');
        updateUI();
    } else {
        addLogEntry("Not enough wood to build a well.", 'error');
    }
}

function updateActionButtons() {
    const selectedPerson = gameState.party[gameState.selectedPerson];

    // Check if selectedPerson exists
    if (!selectedPerson) {
        // If no person is selected, disable all action buttons
        const actions = ['gatherFoodBtn', 'collectWaterBtn', 'chopWoodBtn'];
        actions.forEach(actionId => {
            const button = document.getElementById(actionId);
            if (button) {
                button.disabled = true;
                button.classList.add('opacity-50', 'cursor-not-allowed');
                button.title = 'No person selected';
            }
        });
        return;
    }

    const isBusy = isPersonBusy(gameState.selectedPerson);
    const hasEnoughStamina = selectedPerson.stamina >= gameState.staminaPerAction;
    const hasEnoughEnergy = selectedPerson.energy > 0;

    const actions = [
        { id: 'gatherFoodBtn', resource: 'food', amount: '4-6' },
        { id: 'collectWaterBtn', resource: 'water', amount: '8-12' },
        { id: 'chopWoodBtn', resource: 'wood', amount: '2-4' }
    ];

    actions.forEach(action => {
        const button = document.getElementById(action.id);
        if (button) {
            const isDisabled = isBusy || !hasEnoughStamina || !hasEnoughEnergy;
            button.disabled = isDisabled;
            button.classList.toggle('opacity-50', isDisabled);
            button.classList.toggle('cursor-not-allowed', isDisabled);

            let tooltip = '';
            if (isBusy) tooltip = `${selectedPerson.name} is busy`;
            else if (!hasEnoughStamina) tooltip = `Not enough stamina`;
            else if (!hasEnoughEnergy) tooltip = `Not enough energy`;
            else tooltip = `Gather ${action.amount} ${action.resource}`;

            button.title = tooltip;
        }
    });

    const huntButton = document.getElementById('huntBtn');
    if (huntButton) {
        if (gameState.upgrades.huntingLodge) {
            huntButton.classList.remove('hidden');
        } else {
            huntButton.classList.add('hidden');
        }
    }
}

function setDebugMode(enabled) {
    gameState.debug = enabled;
    if (gameState.debug) {
        // Enable all upgrades
        for (const upgradeId in UPGRADES) {
            gameState.upgrades[upgradeId] = true;
        }
        // Add resources
        gameState.food = 1000;
        gameState.water = 1000;
        gameState.wood = 1000;
        // Ensure there's at least one person in the party
        if (gameState.party.length === 0) {
            gameState.party.push({
                name: "Debug Person",
                health: 100,
                hunger: 0,
                thirst: 0,
                energy: 100,
                stamina: 100,
                traits: {
                    hungerRate: 1,
                    thirstRate: 1,
                    energyRate: 1,
                    maxStamina: 100,
                    staminaRecoveryRate: 1
                }
            });
        }
        // Initialize well if it's not already initialized
        if (!gameState.well) {
            gameState.well = {
                capacity: 100,
                current: 50,
                fillRate: 1
            };
        }
        // Initialize hunting if it's not already started
        if (gameState.upgrades.huntingLodge && !gameState.huntingInterval) {
            startHunting();
        }
    }
    updateUI();
    addLogEntry(`Debug mode ${gameState.debug ? 'enabled' : 'disabled'}.`, 'info');
}

// Add these event listeners at the end of the file
window.addEventListener('load', () => {
    loadGame();
    if (gameState.upgrades.huntingLodge) {
        startHunting();
    }
});

window.addEventListener('focus', function () {
    if (gameState.party.length > 0) {
        startGameLoop();
        if (gameState.upgrades.huntingLodge) {
            startHunting();
        }
    }
});

window.addEventListener('blur', function () {
    if (window.gameInterval) {
        clearInterval(window.gameInterval);
    }
    stopHunting();
});

// Add this new function to update the well visual
function updateWellVisual() {
    const wellWater = document.getElementById('well-water');
    const wellLevel = document.getElementById('well-level');

    if (!wellWater || !wellLevel) {
        // If the well elements don't exist, update the well module HTML
        const wellModule = document.getElementById('well-module');
        if (wellModule) {
            wellModule.innerHTML = `
                <h2 class="text-2xl mb-4 font-black">Well</h2>
                <div class="flex items-center justify-between">
                    <div id="well-container"
                        class="w-32 h-64 bg-neutral-800 rounded-lg relative overflow-hidden">
                        <div id="well-water"
                            class="absolute bottom-0 left-0 right-0 bg-blue-500 transition-all duration-500">
                        </div>
                    </div>
                    <div class="ml-4 flex flex-col items-start">
                        <span id="well-level" class="text-xl mb-2">0/100</span>
                        <button onclick="collectWellWater()"
                            class="border border-blue-600 bg-blue-900/50 hover:bg-blue-700 text-white py-2 px-4 rounded transition">Collect
                            Water</button>
                    </div>
                </div>
            `;
        }
        // Try to get the elements again after updating the HTML
        wellWater = document.getElementById('well-water');
        wellLevel = document.getElementById('well-level');

        // If they still don't exist, exit the function
        if (!wellWater || !wellLevel) return;
    }

    const percentage = (gameState.well.current / gameState.well.capacity) * 100;

    wellWater.style.height = `${percentage}%`;
    wellLevel.textContent = `${Math.floor(gameState.well.current)}/${gameState.well.capacity}`;

    // Update water color based on level
    if (percentage > 75) {
        wellWater.classList.remove('bg-blue-300', 'bg-blue-400');
        wellWater.classList.add('bg-blue-500');
    } else if (percentage > 25) {
        wellWater.classList.remove('bg-blue-300', 'bg-blue-500');
        wellWater.classList.add('bg-blue-400');
    } else {
        wellWater.classList.remove('bg-blue-400', 'bg-blue-500');
        wellWater.classList.add('bg-blue-300');
    }
}