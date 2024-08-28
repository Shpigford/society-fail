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
            well: false
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
        lastEventDay: 0
    };
}

// Initialize gameState at the beginning of the file
let gameState = initializeGameState();

const names = ["Alice", "Bob", "Charlie", "David", "Eva", "Frank", "Grace", "Henry", "Ivy", "Jack", "Kate", "Liam", "Mia", "Noah", "Olivia"];

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
    logEntry.className = `log-entry mb-1 p-1 rounded transition-colors duration-300 ${type === 'info' ? 'bg-blue-900 text-blue-200' : type === 'error' ? 'bg-red-900 text-red-200 font-bold' : type === 'success' ? 'bg-green-900 text-green-200' : 'bg-yellow-900 text-yellow-200'}`;
    logEntry.textContent = `Day ${gameState.day}, Hour ${gameState.hour}: ${message}`;
    logContent.insertBefore(logEntry, logContent.firstChild);

    // Limit log entries to 100
    while (logContent.children.length > 100) {
        logContent.removeChild(logContent.lastChild);
    }

    // Scroll to the top of the log
    logContent.scrollTop = 0;
}

// Add these functions at the beginning of the file
function saveGame() {
    // Get the last 25 log entries
    const logContent = document.getElementById('log-content');
    const logEntries = Array.from(logContent.children).slice(0, 25).map(entry => entry.textContent);

    // Create a save object
    const saveObject = {
        gameState: gameState,
        logEntries: logEntries
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
        loadActivityLog(saveObject.logEntries);
        startGameLoop();
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
}

// Add this new function
function loadActivityLog(logEntries) {
    const logContent = document.getElementById('log-content');
    logContent.innerHTML = ''; // Clear existing log entries

    logEntries.forEach(entry => {
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.textContent = entry;
        logContent.appendChild(logEntry);
    });
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

    // Only check for random events at the start of each day
    if (gameState.hour === 1) {
        checkForRandomEvent();
    }

    if (gameState.upgrades.well) {
        gameState.well.current = Math.min(gameState.well.capacity, gameState.well.current + gameState.well.fillRate);
    }

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
            state.food += 30;
            state.water += 30;
            return "You found a hidden cache of supplies! (+30 🍖, +30 💧)";
        }, type: "positive"
    },
    {
        name: "Windfall", effect: (state) => {
            state.wood += 15;
            return "A fallen tree provided extra wood! (+15 🪵)";
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
    }
];

// Replace the existing checkForRandomEvent function with this one
function checkForRandomEvent() {
    // Check if an event has already occurred today
    if (gameState.day <= gameState.lastEventDay) {
        return;
    }

    // 5% chance of a random event occurring each hour (adjusted for rarity)
    if (Math.random() < 0.05) {
        const event = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
        const message = event.effect(gameState);
        addLogEntry(`Random Event: ${event.name}. ${message}`, event.type === 'positive' ? 'success' : 'error');
        gameState.lastEventDay = gameState.day; // Update the last event day
        updateUI();
    }
}

// Update the addLogEntry function to handle different types of events
function addLogEntry(message, type = 'info') {
    const logContent = document.getElementById('log-content');
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry mb-1 p-1 rounded transition-colors duration-300 ${type === 'info' ? 'bg-blue-900 text-blue-200' :
        type === 'error' ? 'bg-red-900 text-red-200 font-bold' :
            type === 'success' ? 'bg-green-900 text-green-200' :
                'bg-yellow-900 text-yellow-200'
        }`;
    logEntry.textContent = `Day ${gameState.day}, Hour ${gameState.hour}: ${message}`;
    logContent.insertBefore(logEntry, logContent.firstChild);

    // Limit log entries to 100
    while (logContent.children.length > 100) {
        logContent.removeChild(logContent.lastChild);
    }

    // Scroll to the top of the log
    logContent.scrollTop = 0;
}

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

    // Update farming UI
    const farmingModule = document.getElementById('farming-module');
    if (gameState.upgrades.farming) {
        farmingModule.classList.remove('hidden');
        farmingModule.innerHTML = `
            <h2 class="text-2xl mb-4 font-black">Farming</h2>
            <div class="mb-4">
                Plant: 
                <button id="plantWheat" onclick="setPlantingCrop('wheat')" class="border border-yellow-600 bg-yellow-900/50 hover:bg-yellow-700 text-white py-1 px-2 rounded transition" title="Wheat (5 💧)">🌾 5💧</button>
                <button id="plantCorn" onclick="setPlantingCrop('corn')" class="border border-yellow-600 bg-yellow-900/50 hover:bg-yellow-700 text-white py-1 px-2 rounded transition" title="Corn (10 💧)">🌽 10💧</button>
                <button id="plantPotato" onclick="setPlantingCrop('potato')" class="border border-yellow-600 bg-yellow-900/50 hover:bg-yellow-700 text-white py-1 px-2 rounded transition" title="Potato (15 ���)">🥔 15💧</button>
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
        farmingModule.classList.add('hidden');
    }

    // Update well module
    const wellModule = document.getElementById('well-module');
    if (gameState.upgrades.well) {
        wellModule.classList.remove('hidden');
        wellModule.innerHTML = `
            <h2 class="text-2xl mb-4 font-black">Well</h2>
            <div class="mb-4">
                <div class="flex justify-between items-center">
                    <span>Water: ${Math.floor(gameState.well.current)}/${gameState.well.capacity}</span>
                    <button onclick="collectWellWater()" class="border border-blue-600 bg-blue-900/50 hover:bg-blue-700 text-white py-2 px-4 rounded transition">Collect Water</button>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                    <div class="bg-blue-600 h-2.5 rounded-full" style="width: ${(gameState.well.current / gameState.well.capacity) * 100}%"></div>
                </div>
            </div>
        `;
    } else {
        wellModule.classList.add('hidden');
    }

    updateUpgradeButtons();
    updateActionButtons();
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
        const amount = Math.max(1, baseAmount + randomAmount); // Ensure at least 1 food is gathered
        gameState.food += amount;
        gameState.totalResourcesGathered.food += amount;
        addLogEntry(`${gameState.party[gameState.selectedPerson].name} gathered ${amount} food.`);
    }, "gatherFood");
}

function collectWater() {
    performAction(gameState.selectedPerson, () => {
        const baseAmount = 10;
        const randomAmount = Math.floor(Math.random() * 5) - 2; // -2, -1, 0, 1, or 2
        const amount = Math.max(1, baseAmount + randomAmount); // Ensure at least 1 water is collected
        gameState.water += amount;
        gameState.totalResourcesGathered.water += amount;
        addLogEntry(`${gameState.party[gameState.selectedPerson].name} collected ${amount} water.`);
    }, "collectWater");
}

function chopWood() {
    performAction(gameState.selectedPerson, () => {
        const baseAmount = 3;
        const randomAmount = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        const amount = Math.max(1, baseAmount + randomAmount); // Ensure at least 1 wood is chopped
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
    const upgrades = [
        { id: 'farming', cost: 100, resource: 'food', unlocked: true },
        { id: 'well', cost: 200, resource: 'wood', unlocked: gameState.upgrades.farming }
    ];

    upgrades.forEach(upgrade => {
        const button = document.querySelector(`button[onclick="buyUpgrade('${upgrade.id}')"]`);
        if (button) {
            if (gameState.upgrades[upgrade.id]) {
                button.innerHTML = `${upgrade.id} ✅`;
                button.disabled = true;
                button.classList.add('bg-green-800', 'cursor-default');
                button.classList.remove('hover:bg-green-700');
            } else if (!upgrade.unlocked) {
                button.disabled = true;
                button.classList.add('opacity-30', 'cursor-not-allowed');
            } else {
                const canAfford = gameState[upgrade.resource] >= upgrade.cost;
                button.disabled = !canAfford;
                button.classList.toggle('opacity-50', !canAfford);
                button.classList.toggle('cursor-not-allowed', !canAfford);
                button.classList.toggle('hover:bg-green-700', canAfford);
            }
        }
    });

    // Update farming button separately
    const farmingButton = document.querySelector('button[onclick="unlockFarming()"]');
    if (farmingButton) {
        if (gameState.upgrades.farming) {
            farmingButton.innerHTML = 'Farming Unlocked ✅';
            farmingButton.disabled = true;
            farmingButton.classList.add('bg-green-800', 'cursor-default');
            farmingButton.classList.remove('hover:bg-green-700');
        } else {
            const canAfford = gameState.food >= 100;
            farmingButton.disabled = !canAfford;
            farmingButton.classList.toggle('opacity-50', !canAfford);
            farmingButton.classList.toggle('cursor-not-allowed', !canAfford);
            farmingButton.classList.toggle('hover:bg-green-700', canAfford);
        }
    }

    // Update well upgrade button
    const wellUpgradeButton = document.querySelector('button[onclick="buyWellUpgrade()"]');
    if (wellUpgradeButton) {
        if (gameState.upgrades.well) {
            wellUpgradeButton.innerHTML = 'Well Built ✅';
            wellUpgradeButton.disabled = true;
            wellUpgradeButton.classList.add('bg-green-800', 'cursor-default');
            wellUpgradeButton.classList.remove('hover:bg-green-700');
        } else {
            const canAfford = gameState.wood >= 200;
            wellUpgradeButton.disabled = !canAfford;
            wellUpgradeButton.classList.toggle('opacity-50', !canAfford);
            wellUpgradeButton.classList.toggle('cursor-not-allowed', !canAfford);
            wellUpgradeButton.classList.toggle('hover:bg-green-700', canAfford);
        }
    }
}

function collectWellWater() {
    const collected = gameState.well.current;
    gameState.water += collected;
    gameState.totalResourcesGathered.water += collected;
    gameState.well.current = 0;
    addLogEntry(`Collected ${collected} water from the well.`);
    updateUI();
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

function collectWellWater() {
    const collected = gameState.well.current;
    gameState.water += collected;
    gameState.totalResourcesGathered.water += collected;
    gameState.well.current = 0;
    addLogEntry(`Collected ${collected} water from the well.`);
    updateUI();
}

function updateActionButtons() {
    const selectedPerson = gameState.party[gameState.selectedPerson];
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
}

// Add these event listeners at the end of the file
window.addEventListener('load', loadGame);

window.addEventListener('focus', function () {
    if (gameState.party.length > 0) {
        startGameLoop();
    }
});

window.addEventListener('blur', function () {
    if (window.gameInterval) {
        clearInterval(window.gameInterval);
    }
});