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
            huntingLodge: false,
            lumberMill: false,
            watchtower: false
        },
        maxEnergy: 100,
        energyPerAction: 10,
        energyRecoveryPerHour: 5,
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
        logEntries: [],
        lumberMill: {
            trees: [],
            maxTrees: 5,
            baseGrowthTime: 24, // 24 hours base growth time
            growthTimeVariance: 12, // +/- 12 hours variance
            baseHarvestAmount: 10,
            harvestAmountVariance: 5 // +/- 5 wood variance
        },
        rescueMissionAvailable: false,
        lastRescueMissionDay: 0,
        rescueMission: null
    };
}

// Initialize gameState at the beginning of the file
let gameState = initializeGameState();

const names = ["Alice", "Bob", "Charlie", "David", "Eva", "Frank", "Grace", "Henry", "Ivy", "Jack", "Kate", "Liam", "Mia", "Noah", "Olivia", "Penny", "Quinn", "Ryan", "Sophia", "Thomas", "Uma", "Victor", "Wendy", "Xavier", "Yara", "Zack", "Abby", "Ben", "Chloe", "Dylan", "Emma", "Finn", "Gina", "Hugo", "Isla", "Adam", "Bella", "Caleb", "Daisy", "Ethan", "Fiona", "George", "Hannah", "Isaac", "Julia", "Kyle", "Luna", "Max", "Nora", "Oscar", "Poppy", "Quentin", "Rose", "Sam", "Tessa"];

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
        cost: { wood: 100 },
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
    },
    lumberMill: {
        id: 'lumberMill',
        name: 'Lumber Mill',
        cost: { wood: 300, food: 100 },
        effect: 'Increases wood gathering efficiency by 50% and generates 1 wood per hour',
        prerequisite: 'toolWorkshop'
    },
    watchtower: {
        id: 'watchtower',
        name: 'Watchtower',
        cost: { wood: 500, food: 200 },
        effect: 'Allows you to spot and rescue potential survivors',
        prerequisite: 'huntingLodge'
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
    wheat: { growthTime: 24, waterNeeded: 5, yield: 20 },
    carrot: { growthTime: 48, waterNeeded: 10, yield: 40 },
    bean: { growthTime: 72, waterNeeded: 15, yield: 60 }
};

// Add this constant for trait ranges
const TRAIT_RANGES = {
    hungerRate: { min: 0.8, max: 1.2 },
    thirstRate: { min: 0.8, max: 1.2 },
    energyRate: { min: 0.8, max: 1.2 },
    maxEnergy: { min: 80, max: 120 },
    energyRecoveryRate: { min: 0.8, max: 1.2 }
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

    logEntry.className = `log-entry ${type}`;
    logEntry.innerHTML = `<b>${entryData.day}.${entryData.hour}</b> <span>${entryData.message}</span>`;

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

// Add these functions at the beginning of the file
function saveGame() {
    // Create a save object
    const saveObject = {
        gameState: gameState
    };

    localStorage.setItem('societyFailSave', JSON.stringify(saveObject));
}

// Add this function near the top of the file, after the constants
function checkSaveCompatibility(savedGame) {
    const requiredKeys = [
        'day', 'hour', 'party', 'food', 'water', 'wood', 'upgrades',
        'farming', 'well', 'totalResourcesGathered', 'achievements',
        'totalActions', 'totalPlayTime', 'totalCropsHarvested',
        'totalAnimalsHunted', 'totalWellWaterCollected', 'logEntries',
        'lumberMill', 'rescueMissionAvailable', 'lastRescueMissionDay'
    ];

    for (const key of requiredKeys) {
        if (!(key in savedGame)) {
            return false;
        }
    }

    // Add more specific checks if needed, e.g.:
    if (!Array.isArray(savedGame.party) || !savedGame.party.every(person => 'traits' in person)) {
        return false;
    }

    return true;
}

// Modify the loadGame function
function loadGame() {
    const savedGame = localStorage.getItem('societyFailSave');
    if (savedGame) {
        const saveObject = JSON.parse(savedGame);

        if (!checkSaveCompatibility(saveObject.gameState)) {
            // Save is incompatible, show message and return
            alert("Your saved game is incompatible with the current version. The apocalypse has no mercy. Please start a new game.");
            resetGame(true);
            return;
        }

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
            logEntry.className = `log-entry ${entry.type}`;
            logEntry.innerHTML = `<b>${entry.day}.${entry.hour}</b> <span>${entry.message}</span>`;
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
            traits: {
                hungerRate: getRandomTrait('hungerRate'),
                thirstRate: getRandomTrait('thirstRate'),
                energyRate: getRandomTrait('energyRate'),
                maxEnergy: Math.round(getRandomTrait('maxEnergy')),
                energyRecoveryRate: getRandomTrait('energyRecoveryRate')
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

    // Get achieved achievements
    const achievedAchievements = ACHIEVEMENTS.filter(achievement => gameState.achievements[achievement.id]);

    gameStats.innerHTML = `
        <p>Time Survived: ${daysPlayed} days, ${hoursPlayed % 24} hours</p>
        <p>Total Resources Gathered:</p>
        <ul class="list-none">
            <li>🍖 Food: ${Math.floor(gameState.totalResourcesGathered.food)}</li>
            <li>💧 Water: ${Math.floor(gameState.totalResourcesGathered.water)}</li>
            <li>🪵 Wood: ${Math.floor(gameState.totalResourcesGathered.wood)}</li>
        </ul>
        <p class="mt-4 font-bold">Achievements Unlocked:</p>
        <ul class="list-none">
            ${achievedAchievements.map(achievement => `
                <li class="mb-1">
                    <span class="text-green-400">✅ ${achievement.name}</span>: ${achievement.description}
                </li>
            `).join('')}
        </ul>
        ${achievedAchievements.length === 0 ? '<p class="text-yellow-400">No achievements unlocked</p>' : ''}
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
            person.energy = Math.min(100, person.energy + 10 * person.traits.energyRecoveryRate);

            // Check if rest is complete
            if (person.energy === 100) {
                gameState.busyUntil[index] = 0;
            }
        } else {
            person.energy = Math.max(0, Math.min(100, person.energy - 0.5 * person.traits.energyRate));
        }

        if (person.hunger >= 100 || person.thirst >= 100 || person.energy <= 0) {
            person.health = Math.max(0, person.health - 5);
        }

        // Ensure all values are capped at their maximum
        person.health = Math.min(100, person.health);
        person.hunger = Math.min(100, person.hunger);
        person.thirst = Math.min(100, person.thirst);
        person.energy = Math.min(100, person.energy);

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

    if (gameState.upgrades.lumberMill) {
        generateLumberMillWood();
        growLumberMillTrees();
    }

    if (gameState.upgrades.watchtower &&
        gameState.day - gameState.lastRescueMissionDay >= RESCUE_MISSION_INTERVAL) {
        gameState.rescueMissionAvailable = true;
    }

    checkRescueMission();
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
            return `${victim.name} has fallen ill! (-10 health)`;
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
        name: "Mysterious Illness", effect: (state) => {
            state.party.forEach(person => {
                person.health = Math.max(0, person.health - 5);
                person.energy = Math.max(0, person.energy - 10);
            });
            return "A mysterious illness affects everyone in the group! (-5 health, -10 energy for all)";
        }, type: "negative"
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

// Replace the existing checkForRandomEvent function with this one
function checkForRandomEvent() {
    // If it's a new day, schedule today's event
    if (gameState.day > gameState.lastEventDay) {
        gameState.lastEventDay = gameState.day;
        gameState.todaysEventHour = Math.floor(Math.random() * 24) + 1; // Random hour between 1 and 24
    }

    // If it's time for today's event, trigger it
    if (gameState.hour === gameState.todaysEventHour) {
        // 10% chance for a whisper instead of a regular event
        if (Math.random() < 0.25) {
            const whisper = WHISPERS[Math.floor(Math.random() * WHISPERS.length)];
            addLogEntry(`The Whispers: "${whisper}"`, 'whisper');
        } else {
            const event = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
            const message = event.effect(gameState);
            addLogEntry(`Random Event: ${event.name}. ${message}`, event.type === 'positive' ? 'success' : 'error');
        }
        gameState.todaysEventHour = null; // Reset for the next day
        updateUI();
    }
}

const WILDLIFE = ['bird', 'rabbit', 'rat', 'snail', 'squirrel', 'turtle'];
const HUNT_INTERVAL = 5000; // 5 seconds
const MOVE_INTERVAL = 500;

// Add this constant at the top of the file with other constants
const RESCUE_MISSION_INTERVAL = 3; // Days between rescue missions
const RESCUE_MISSION_TYPES = {
    easy: { risk: 0.1, resourceCost: { food: 20, water: 20 }, duration: 24 }, // 1 day
    medium: { risk: 0.3, resourceCost: { food: 40, water: 40 }, duration: 48 }, // 2 days
    hard: { risk: 0.5, resourceCost: { food: 60, water: 60 }, duration: 72 } // 3 days
};

function initiateRescueMission(difficulty) {
    const mission = RESCUE_MISSION_TYPES[difficulty];

    // Check if player has enough resources
    if (gameState.food < mission.resourceCost.food || gameState.water < mission.resourceCost.water) {
        addLogEntry("Not enough resources for this rescue mission.", 'error');
        return;
    }

    // Deduct resources
    gameState.food -= mission.resourceCost.food;
    gameState.water -= mission.resourceCost.water;

    // Set up the rescue mission
    gameState.rescueMission = {
        difficulty: difficulty,
        startTime: gameState.hour + (gameState.day - 1) * 24,
        endTime: gameState.hour + (gameState.day - 1) * 24 + mission.duration
    };

    addLogEntry(`A ${difficulty} rescue mission has been initiated. It will take ${mission.duration} hours.`, 'info');
    gameState.rescueMissionAvailable = false;
    updateUI();
}

function checkRescueMission() {
    if (gameState.rescueMission) {
        const currentTime = gameState.hour + (gameState.day - 1) * 24;
        if (currentTime >= gameState.rescueMission.endTime) {
            completeRescueMission();
        }
    }
}

function completeRescueMission() {
    const mission = gameState.rescueMission;
    const missionType = RESCUE_MISSION_TYPES[mission.difficulty];
    const success = Math.random() > missionType.risk;

    if (success) {
        handleSuccessfulRescue();
    } else {
        handleFailedRescue();
    }

    // Reset rescue mission state
    gameState.rescueMission = null;
    gameState.rescueMissionAvailable = false;
    gameState.lastRescueMissionDay = gameState.day;

    updateUI();
}

function handleSuccessfulRescue() {
    const bonusResources = {
        food: Math.floor(Math.random() * 50) + 10,
        water: Math.floor(Math.random() * 50) + 10,
        wood: Math.floor(Math.random() * 30) + 5
    };

    Object.entries(bonusResources).forEach(([resource, amount]) => {
        gameState[resource] += amount;
        gameState.totalResourcesGathered[resource] += amount;
    });

    const newSurvivorChance = Math.random();
    if (newSurvivorChance > 0.5) {
        const newSurvivor = generateSurvivor();
        gameState.party.push(newSurvivor);
        addLogEntry(`Rescue mission successful! ${newSurvivor.name} has joined your party. They brought some supplies: ${bonusResources.food} food, ${bonusResources.water} water, and ${bonusResources.wood} wood.`, 'success');
    } else {
        addLogEntry(`Rescue mission successful! No survivors found, but the team recovered some supplies: ${bonusResources.food} food, ${bonusResources.water} water, and ${bonusResources.wood} wood.`, 'success');
    }
}

function handleFailedRescue() {
    if (Math.random() < 0.5) {
        const injuredPerson = gameState.party[Math.floor(Math.random() * gameState.party.length)];
        injuredPerson.health = Math.max(10, injuredPerson.health - 40);
        addLogEntry(`Rescue mission failed. ${injuredPerson.name} was injured during the attempt.`, 'error');
    } else {
        addLogEntry("Rescue mission failed. The team returned empty-handed.", 'error');
    }
}

function updateWatchtowerModule() {
    const watchtowerModule = document.getElementById('watchtower-module');
    if (!watchtowerModule) return;

    if (gameState.upgrades.watchtower) {
        watchtowerModule.classList.remove('hidden');

        if (gameState.rescueMission) {
            const currentTime = gameState.hour + (gameState.day - 1) * 24;
            const remainingTime = gameState.rescueMission.endTime - currentTime;
            const remainingHours = remainingTime % 24;
            const remainingDays = Math.floor(remainingTime / 24);

            watchtowerModule.innerHTML = `
                <h2 class="text-2xl mb-4 font-black">Watchtower</h2>
                <p class="mb-4">Rescue mission in progress:</p>
                <p class="text-xl mb-2">${gameState.rescueMission.difficulty.charAt(0).toUpperCase() + gameState.rescueMission.difficulty.slice(1)} Mission</p>
                <p>Time remaining: ${remainingDays}d ${remainingHours}h</p>
            `;
        } else if (gameState.rescueMissionAvailable) {
            watchtowerModule.innerHTML = `
                <h2 class="text-2xl mb-4 font-black">Watchtower</h2>
                <p class="mb-4">A rescue mission is available!</p>
                <div class="flex flex-col gap-2">
                    <button onclick="initiateRescueMission('easy')" class="border border-green-600 bg-green-900/50 hover:bg-green-700 text-white py-2 px-4 rounded transition">Easy Mission (1d, Low Risk, Cost: 20 🍖, 20 💧)</button>
                    <button onclick="initiateRescueMission('medium')" class="border border-yellow-600 bg-yellow-900/50 hover:bg-yellow-700 text-white py-2 px-4 rounded transition">Medium Mission (2d, Moderate Risk, Cost: 40 🍖, 40 💧)</button>
                    <button onclick="initiateRescueMission('hard')" class="border border-red-600 bg-red-900/50 hover:bg-red-700 text-white py-2 px-4 rounded transition">Hard Mission (3d, High Risk, Cost: 60 🍖, 60 💧)</button>
                </div>
            `;
        } else {
            const daysUntilNextMission = RESCUE_MISSION_INTERVAL - (gameState.day - gameState.lastRescueMissionDay);
            const hoursUntilNextMission = 24 - gameState.hour;
            watchtowerModule.innerHTML = `
                <h2 class="text-2xl mb-4 font-black">Watchtower</h2>
                <p>Next rescue mission available in ${daysUntilNextMission} ${daysUntilNextMission === 1 ? 'day' : 'days'} and ${hoursUntilNextMission} ${hoursUntilNextMission === 1 ? 'hour' : 'hours'}.</p>
            `;
        }
    } else {
        watchtowerModule.classList.remove('hidden');
        watchtowerModule.innerHTML = `
            <div class="mystery mysterious-tower">
                <div class="icon"><i data-lucide="circle-help" class="icon-gutter-grey"></i></div>
                <div class="title">Mysterious Tower</div>
                <div class="description">What could we see from up there?</div>
            </div>
        `;
    }
}

// Add this function to check and complete rescue missions
function checkRescueMission() {
    if (gameState.rescueMission) {
        const currentTime = gameState.hour + (gameState.day - 1) * 24;
        if (currentTime >= gameState.rescueMission.endTime) {
            completeRescueMission();
        }
    }
}

function completeRescueMission() {
    const mission = gameState.rescueMission;
    const missionType = RESCUE_MISSION_TYPES[mission.difficulty];
    const success = Math.random() > missionType.risk;

    if (success) {
        handleSuccessfulRescue();
    } else {
        handleFailedRescue();
    }

    // Reset rescue mission state
    gameState.rescueMission = null;
    gameState.rescueMissionAvailable = false;
    gameState.lastRescueMissionDay = gameState.day;

    updateUI();
}

function handleSuccessfulRescue() {
    const newSurvivor = generateSurvivor();
    gameState.party.push(newSurvivor);

    const bonusResources = {
        food: Math.floor(Math.random() * 50) + 10,
        water: Math.floor(Math.random() * 50) + 10,
        wood: Math.floor(Math.random() * 30) + 5
    };

    Object.entries(bonusResources).forEach(([resource, amount]) => {
        gameState[resource] += amount;
        gameState.totalResourcesGathered[resource] += amount;
    });

    addLogEntry(`Rescue mission successful! ${newSurvivor.name} has joined your party. They brought some supplies: ${bonusResources.food} food, ${bonusResources.water} water, and ${bonusResources.wood} wood.`, 'success');
}

function handleFailedRescue() {
    if (Math.random() < 0.5) {
        const injuredPerson = gameState.party[Math.floor(Math.random() * gameState.party.length)];
        injuredPerson.health = Math.max(10, injuredPerson.health - 40);
        addLogEntry(`Rescue mission failed. ${injuredPerson.name} was injured during the attempt.`, 'error');
    } else {
        addLogEntry("Rescue mission failed. The team returned empty-handed.", 'error');
    }
}

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

function generateLumberMillWood() {
    if (gameState.upgrades.lumberMill) {
        gameState.wood += 1;
        gameState.totalResourcesGathered.wood += 1;
    }
}

// Add this function to update the achievements UI
function updateAchievementsUI() {
    const achievementsContainer = document.getElementById('achievements');
    achievementsContainer.innerHTML = '';

    ACHIEVEMENTS.forEach(achievement => {
        const achievementElement = document.createElement('div');
        achievementElement.className = `achievement-item ${gameState.achievements[achievement.id] ? 'achievement-unlocked' : 'achievement-locked'}`;
        achievementElement.innerHTML = `
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-description">${achievement.description}</div>
        `;
        achievementsContainer.appendChild(achievementElement);
    });
}

// Merge the two updateUI functions
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

        const personElement = document.createElement('div');
        personElement.className = `person ${index === gameState.selectedPerson ? 'selected' : ''} ${isBusy ? 'busy' : ''}`;
        personElement.onclick = () => selectPerson(index);

        personElement.innerHTML = `
            <div class="person-header">
                <h3><i data-lucide="person-standing" class="icon-gutter-grey"></i> ${person.name}</h3>
                <div class="busy-label ${isBusy ? (isResting ? 'resting' : 'busy') : 'idle'}">${isBusy ? `${isResting ? 'RESTING' : `BUSY [${busyTimeLeft}h]`}` : 'IDLE'}</div>
            </div>
            <div class="stats-container">
            <table class="stats">
                <tr>
                    <td>Health</td>
                    <td><div class="progress-bar"><div class="progress health-bar ${getProgressBarClass(person.health)}" style="width: ${person.health}%;"></div></div></td>
                    <td>${Math.floor(person.health)}%</td>
                </tr>
                <tr>
                    <td>Hunger</td>
                    <td><div class="progress-bar"><div class="progress hunger-bar ${getProgressBarClass(100 - person.hunger)}" style="width: ${100 - person.hunger}%;"></div></div></td>
                    <td>${Math.floor(100 - person.hunger)}%</td>
                </tr>
                <tr>
                    <td>Thirst</td>
                    <td><div class="progress-bar"><div class="progress thirst-bar ${getProgressBarClass(100 - person.thirst)}" style="width: ${100 - person.thirst}%;"></div></div></td>
                    <td>${Math.floor(100 - person.thirst)}%</td>
                </tr>
                <tr>
                    <td>Energy</td>
                    <td><div class="progress-bar"><div class="progress energy-bar ${getProgressBarClass(person.energy)}" style="width: ${person.energy}%;"></div></div></td>
                    <td>${Math.floor(person.energy)}%</td>
                </tr>
            </table>
            </div>
            <div class="traits">
                <span title="Hunger Rate">🍽️: ${person.traits.hungerRate.toFixed(2)}</span>
                <span title="Thirst Rate">💧: ${person.traits.thirstRate.toFixed(2)}</span>
                <span title="Energy Rate">⚡: ${person.traits.energyRate.toFixed(2)}</span>
                <span title="Max Energy">💪: ${person.traits.maxEnergy}</span>
                <span title="Energy Recovery Rate">🔄: ${person.traits.energyRecoveryRate.toFixed(2)}</span>
            </div>
            <div class="person-actions">
                <button onclick="eat(${index})" ${isBusy || gameState.food < 10 ? 'disabled' : ''}>Eat <span>[10 <i data-lucide="beef" class="icon-dark-yellow"></i>]</span></button>
                <button onclick="drink(${index})" ${isBusy || gameState.water < 5 ? 'disabled' : ''}> Drink <span>[5 <i data-lucide="droplet" class="icon-blue"></i>]</span></button>
                <button onclick="sleep(${index})" ${isBusy ? 'disabled' : ''}><i data-lucide="bed-single"></i> Rest</button>
            </div>
        `;

        partyElement.appendChild(personElement);
    });

    // Update farming module
    const farmingModule = document.getElementById('farming-module');
    if (gameState.upgrades.farming) {
        farmingModule.classList.remove('hidden');
        farmingModule.innerHTML = `
            <h2><i data-lucide="tractor" class="icon-dark"></i> Farming</h2>
            <div class="crop-picker">
                <button id="plantWheat" onclick="setPlantingCrop('wheat')" class="inactive"><i data-lucide="wheat" class="icon-wheat"></i> [5 <i data-lucide="droplet" class="icon-blue"></i>]</button>
                <button id="plantCarrot" onclick="setPlantingCrop('carrot')" class="inactive"><i data-lucide="carrot" class="icon-carrot"></i> [10 <i data-lucide="droplet" class="icon-blue"></i>]</button>
                <button id="plantBean" onclick="setPlantingCrop('bean')" class="inactive"><i data-lucide="bean" class="icon-bean"></i> [15 <i data-lucide="droplet" class="icon-blue"></i>]</button>
            </div>
            <div class="water-all-button">
                <button onclick="waterCrops()">
                    <div>Water all crops [5 <i data-lucide="droplet" class="icon-blue"></i>]</div>
                    <span>Reduces crop growth time by 20%</span>
                </button>
            </div>
            <div id="farming-grid"></div>
        `;

        // Update active state for planting buttons
        const plantButtons = {
            wheat: document.getElementById('plantWheat'),
            carrot: document.getElementById('plantCarrot'),
            bean: document.getElementById('plantBean')
        };

        for (const [crop, button] of Object.entries(plantButtons)) {
            if (gameState.plantingCrop === crop) {
                button.classList.add('active');
                button.classList.remove('inactive');
            } else {
                button.classList.remove('active');
                button.classList.add('inactive');
            }
        }

        const farmingGrid = document.getElementById('farming-grid');
        gameState.farming.grid.forEach((row, rowIndex) => {
            row.forEach((plot, colIndex) => {
                const plotElement = document.createElement('div');
                plotElement.className = 'plot-cell';

                if (plot) {
                    const now = gameState.hour + (gameState.day - 1) * 24;
                    const growthProgress = Math.min(100, ((now - plot.plantedAt) / CROP_TYPES[plot.type].growthTime) * 100);
                    plotElement.classList.add(`crop-${plot.type}`);
                    plotElement.title = `${plot.type}: ${growthProgress.toFixed(0)}% grown, ${plot.watered ? 'Watered' : 'Needs Water'}`;

                    // Add Lucide icon based on crop type with specific color
                    const iconElement = document.createElement('i');
                    iconElement.setAttribute('data-lucide', plot.type);
                    iconElement.classList.add(`icon-${plot.type}`);
                    plotElement.appendChild(iconElement);

                    if (!plot.watered) {
                        plotElement.classList.add('needs-water');
                    }

                    if (growthProgress === 100) {
                        plotElement.onclick = () => harvestCrop(rowIndex, colIndex);
                        plotElement.classList.add('ready-to-harvest');
                    } else {
                        plotElement.classList.add('growing');
                    }
                } else {
                    plotElement.classList.add('empty-plot');
                    plotElement.onclick = () => plantCrop(rowIndex, colIndex, gameState.plantingCrop);
                }

                farmingGrid.appendChild(plotElement);
            });
        });
    } else {
        farmingModule.classList.remove('hidden');
        farmingModule.innerHTML = `
            <div class="mystery mysterious-plot">
                <div class="icon"><i data-lucide="circle-help" class="icon-gutter-grey"></i></div>
                <div class="title">Mysterious Plot of Land</div>
                <div class="description">What could grow here?</div>
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
            <div class="mystery mysterious-hole">
                <div class="icon"><i data-lucide="circle-help" class="icon-gutter-grey"></i></div>
                <div class="title">Mysterious Hole</div>
                <div class="description">Could this provide water?</div>
            </div>
        `;
    }

    // Update hunting module
    const huntingModule = document.getElementById('hunting-module');
    if (gameState.upgrades.huntingLodge) {
        huntingModule.classList.remove('hidden');
        huntingModule.innerHTML = `
            <h2><i data-lucide="trees" class="icon-dark"></i> Hunting Lodge</h2>
            <div id="hunting-area"></div>
            <p class="instruction">Hunt the animal before it escapes!</p>
        `;
        if (!gameState.huntingInterval) {
            startHunting();
        }
    } else {
        huntingModule.classList.remove('hidden');
        huntingModule.innerHTML = `
            <div class="mystery mysterious-tracks">
                <div class="icon"><i data-lucide="circle-help" class="icon-gutter-grey"></i></div>
                <div class="title">Mysterious Tracks</div>
                <div class="description">What creatures roam these lands?</div>
            </div>
        `;
    }

    updateUpgradeButtons();
    updateActionButtons();
    updateAchievementsUI();
    updateLumberMillModule();
    updateWatchtowerModule();

    lucide.createIcons();
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
    target.innerHTML = `<i data-lucide="${animal}" class="icon-dark"></i>`;
    target.className = 'wildlife';
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
    lucide.createIcons();
}

function moveWildlife() {
    if (gameState.huntingTarget) {
        const currentLeft = parseFloat(gameState.huntingTarget.style.left);
        const currentTop = parseFloat(gameState.huntingTarget.style.top);

        // Increase movement range
        const moveRange = Math.floor(Math.random() * 26) + 25; // Random value between 25 and 50
        // Increase movement speed by reducing the divisor
        const newLeft = Math.max(0, Math.min(80, currentLeft + (Math.random() - 0.5) * moveRange / 2));
        const newTop = Math.max(0, Math.min(80, currentTop + (Math.random() - 0.5) * moveRange / 2));

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
        case 'bird': foodGained = 20; break;
        case 'rabbit': foodGained = 25; break;
        case 'rat': foodGained = 15; break;
        case 'snail': foodGained = 5; break;
        case 'squirrel': foodGained = 20; break;
        case 'turtle': foodGained = 30; break;
        default: foodGained = 10;
    }

    gameState.food += foodGained;
    gameState.totalResourcesGathered.food += foodGained;
    gameState.totalAnimalsHunted++;
    checkAchievements();
    addLogEntry(`Successfully hunted a ${animal}! Gained ${foodGained} food.`, 'success');
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
    } else {
        action();
        // Increase energy drain for gather, collect, and chop actions
        const energyDrain = ['gatherFood', 'collectWater', 'chopWood'].includes(actionName) ? 15 : 5;
        if (!['eat', 'drink', 'sleep'].includes(actionName)) {
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
        gameState.totalWellWaterCollected += amount; // Add this line to track well water collection
        checkAchievements(); // Check achievements after collecting water
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

        if (gameState.upgrades.lumberMill) {
            amount = Math.floor(amount * 1.5); // Additional 50% increase from Lumber Mill
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
            person.energy = Math.min(100, person.energy + 20);
            addLogEntry(`${person.name} ate food, reducing hunger by 30 and recovering 5 health and 20 energy.`, 'success');
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
            person.energy = Math.min(100, person.energy + 10);
            addLogEntry(`${person.name} drank water, reducing thirst by 25 and recovering 10 energy.`);
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
        button.className = 'upgrade-button';

        let costText = Object.entries(upgrade.cost).map(([resource, amount]) => `${amount} ${getResourceEmoji(resource)}`).join(', ');

        button.innerHTML = `
            <div class="upgrade-name">
                <span class="name">${gameState.upgrades[upgradeId] ? ' <i data-lucide="book-check" class="icon-green"></i> ' : ''}${upgrade.name}</span>
                <span class="cost">${costText}</span>
            </div>
            <div class="upgrade-effect">${upgrade.effect}</div>
        `;

        if (gameState.upgrades[upgradeId]) {
            button.disabled = true;
            button.classList.add('unlocked');
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
                button.classList.add('cannot-afford');
            }
        }

        upgradesContainer.appendChild(button);
    }
}

// Helper function to get resource emoji
function getResourceEmoji(resource) {
    switch (resource) {
        case 'food': return '<i data-lucide="beef" class="icon-dark-yellow"></i>';
        case 'water': return '<i data-lucide="droplet" class="icon-blue"></i>';
        case 'wood': return '<i data-lucide="tree-pine" class="icon-green"></i>';
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
    const cost = 100;
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
    const hasEnoughEnergy = selectedPerson.energy > 0;

    const actions = [
        { id: 'gatherFoodBtn', resource: 'food', amount: '4-6' },
        { id: 'collectWaterBtn', resource: 'water', amount: '8-12' },
        { id: 'chopWoodBtn', resource: 'wood', amount: '2-4' }
    ];

    actions.forEach(action => {
        const button = document.getElementById(action.id);
        if (button) {
            const isDisabled = isBusy || !hasEnoughEnergy;
            button.disabled = isDisabled;
            button.classList.toggle('opacity-50', isDisabled);
            button.classList.toggle('cursor-not-allowed', isDisabled);

            let tooltip = '';
            if (isBusy) tooltip = `${selectedPerson.name} is busy`;
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

function generateLumberMillWood() {
    if (gameState.upgrades.lumberMill) {
        gameState.wood += 1;
        gameState.totalResourcesGathered.wood += 1;
    }
}

function growLumberMillTrees() {
    if (gameState.upgrades.lumberMill) {
        // Grow existing trees
        gameState.lumberMill.trees = gameState.lumberMill.trees.map(tree => ({
            ...tree,
            growth: Math.min(1, tree.growth + (1 / tree.growthTime))
        }));

        // Ensure we always have 5 trees
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

        // Trim excess trees if any
        gameState.lumberMill.trees = gameState.lumberMill.trees.slice(0, gameState.lumberMill.maxTrees);
    }
}

function updateLumberMillModule() {
    const lumberMillModule = document.getElementById('lumber-mill-module');
    if (!lumberMillModule) return;

    if (gameState.upgrades.lumberMill) {
        lumberMillModule.classList.remove('hidden');
        let treesHTML = '';

        for (let i = 0; i < gameState.lumberMill.maxTrees; i++) {
            const tree = gameState.lumberMill.trees[i] || { growth: 0 };
            const growthPercentage = tree.growth * 100;
            const isFullyGrown = growthPercentage === 100;

            treesHTML += `
                <div class="tree-cell ${isFullyGrown ? 'ready-to-harvest' : ''}" 
                     onclick="${isFullyGrown ? `harvestTree(${i})` : ''}"
                     title="${isFullyGrown ? 'Click to harvest' : `Growth: ${growthPercentage.toFixed(0)}%`}">
                    <div class="growth-indicator" style="height: ${growthPercentage}%;"></div>
                    <i data-lucide="${isFullyGrown ? 'tree-pine' : 'sprout'}" 
                       class="icon-${isFullyGrown ? 'dark-green' : 'light-green'}"></i>
                </div>
            `;
        }

        lumberMillModule.innerHTML = `
            <h2><i data-lucide="tree-pine" class="icon-dark"></i> Lumber Mill</h2>
            <div id="lumber-mill-grid">
                ${treesHTML}
            </div>
        `;
    } else {
        lumberMillModule.classList.remove('hidden');
        lumberMillModule.innerHTML = `
            <div class="mystery mysterious-machinery">
                <div class="icon"><i data-lucide="circle-help" class="icon-gutter-grey"></i></div>
                <div class="title">Mysterious Machinery</div>
                <div class="description">Could this help with wood production?</div>
            </div>
        `;
    }

    lucide.createIcons();
}

function harvestTree(index) {
    const tree = gameState.lumberMill.trees[index];
    if (tree && tree.growth === 1) {
        const woodGained = tree.harvestAmount;
        gameState.wood += woodGained;
        gameState.totalResourcesGathered.wood += woodGained;
        gameState.lumberMill.trees[index] = {
            growth: 0,
            growthTime: gameState.lumberMill.baseGrowthTime +
                (Math.random() * 2 - 1) * gameState.lumberMill.growthTimeVariance,
            harvestAmount: Math.round(gameState.lumberMill.baseHarvestAmount +
                (Math.random() * 2 - 1) * gameState.lumberMill.harvestAmountVariance)
        };
        addLogEntry(`Harvested a fully grown tree for ${woodGained} wood.`);
        updateUI();
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
                traits: {
                    hungerRate: 1,
                    thirstRate: 1,
                    energyRate: 1,
                    maxEnergy: 100,
                    energyRecoveryRate: 1
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
        // Initialize Lumber Mill trees
        if (!gameState.lumberMill.trees || gameState.lumberMill.trees.length === 0) {
            gameState.lumberMill.trees = [];
            for (let i = 0; i < gameState.lumberMill.maxTrees; i++) {
                gameState.lumberMill.trees.push({
                    growth: Math.random(),
                    growthTime: gameState.lumberMill.baseGrowthTime +
                        (Math.random() * 2 - 1) * gameState.lumberMill.growthTimeVariance,
                    harvestAmount: Math.round(gameState.lumberMill.baseHarvestAmount +
                        (Math.random() * 2 - 1) * gameState.lumberMill.harvestAmountVariance)
                });
            }
        }
        // Initialize hunting if it's not already started
        if (!gameState.huntingInterval) {
            startHunting();
        }
    }
    updateUI();
    addLogEntry(`Debug mode ${gameState.debug ? 'enabled' : 'disabled'}.`, 'info');
}

function updateWellVisual() {
    const wellModule = document.getElementById('well-module');
    if (!wellModule) return;

    if (gameState.upgrades.well) {
        wellModule.classList.remove('hidden');
        const percentage = (gameState.well.current / gameState.well.capacity) * 100;

        wellModule.innerHTML = `
            <h2><i data-lucide="glass-water" class="icon-dark"></i> Well</h2>
            <div class="well-container">
                <div id="well-progress">
                    <span id="well-level">${Math.floor(gameState.well.current)}/${gameState.well.capacity}</span>
                    <div id="well-water" style="width: ${percentage}%;">
                    </div>
                </div>
                <button onclick="collectWellWater()">Collect Water</button>
            </div>
        `;
    }
}

// Add this helper function to determine the class based on the progress value
function getProgressBarClass(value) {
    if (value > 66) return 'high';
    if (value > 33) return 'medium';
    return 'low';
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