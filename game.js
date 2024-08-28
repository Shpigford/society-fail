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
            waterCollection: 0,
            woodChopping: 0
        },
        maxStamina: 100,
        staminaPerAction: 10,
        staminaRecoveryPerHour: 5,
        selectedPerson: 0,
        busyUntil: {},
        farming: {
            grid: Array(3).fill().map(() => Array(3).fill(null)),
            maxCrops: 9
        }
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
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('game-ui').style.display = 'block';
        updateUI();
        loadActivityLog(saveObject.logEntries);
        startGameLoop();
    } else {
        document.getElementById('start-screen').style.display = 'block';
        document.getElementById('game-ui').style.display = 'none';
    }
}

// Modify the resetGame function
function resetGame() {
    console.log("resetGame function called");
    if (confirm("Are you sure you want to reset the game? All progress will be lost.")) {
        console.log("Reset confirmed");
        localStorage.removeItem('societyFailSave');
        console.log("localStorage cleared");
        location.reload();
        console.log("Page should have reloaded");
    } else {
        console.log("Reset cancelled");
    }
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

    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-ui').style.display = 'block';

    updateUI();
    startGameLoop();

    addLogEntry(`Game started on ${difficulty} difficulty with ${partySize} people.`);
    if (difficulty !== 'hard') {
        addLogEntry(`Starting resources: ${gameState.food} food, ${gameState.water} water, ${gameState.wood} wood.`);
    }
}

// Add this new function
function startGameLoop() {
    if (window.gameInterval) {
        clearInterval(window.gameInterval);
    }
    window.gameInterval = setInterval(gameLoop, 1000);
}

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
        location.reload();
    }

    // Comment out or remove this line to disable random events
    // checkForRandomEvent();

    updateUI();
    saveGame();
}

function checkForRandomEvent() {
    // 5% chance of a random event occurring each hour
    if (Math.random() < 0.05) {
        randomEvent();
    }
}

function randomEvent() {
    const events = [
        { name: "Rainstorm", effect: () => { gameState.water += 50; } },
        { name: "Wild Animal Attack", effect: () => { gameState.party[0].health -= 20; } },
        { name: "Food Spoilage", effect: () => { gameState.food = Math.max(0, gameState.food - 20); } },
        { name: "Lucky Find", effect: () => { gameState.food += 30; gameState.water += 30; } },
        { name: "Windfall", effect: () => { gameState.wood += 15; } }
    ];

    const event = events[Math.floor(Math.random() * events.length)];
    event.effect();
    addLogEntry(`Random Event: ${event.name}`, 'event');
    updateUI();
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

        partyElement.innerHTML += `
            <div class="person flex-1 min-w-[250px] max-w-[400px] border border-white rounded-lg p-4 m-1 bg-neutral-800 cursor-pointer transition-all duration-300 relative ${index === gameState.selectedPerson ? 'border-2 border-green-500 bg-green-900/20 ring-4 ring-green-500/20' : ''} ${isBusy ? 'opacity-70' : ''}" onclick="selectPerson(${index})">
                <h3 class="text-lg border-b border-neutral-600 pb-2 mb-2">${person.name} ${isResting ? '(Resting)' : isBusy ? `(Busy: ${busyTimeLeft}h)` : ''}</h3>
                ${isBusy ? `<div class="busy-label absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-30 text-2xl text-red-500 border-2 border-red-500 p-2 pointer-events-none bg-black bg-opacity-70">${isResting ? 'RESTING' : 'BUSY'}</div>` : ''}
                <div class="stat flex items-center mb-2">
                    <label class="w-16 text-right mr-2">Health:</label>
                    <progress value="${person.health}" max="100" class="flex-grow h-5 [&::-webkit-progress-bar]:bg-neutral-700 [&::-webkit-progress-value]:bg-green-500 [&::-moz-progress-bar]:bg-green-500"></progress>
                    <span class="w-10 text-left ml-2">${Math.floor(person.health)}%</span>
                </div>
                <div class="stat flex items-center mb-2">
                    <label class="w-16 text-right mr-2">Hunger:</label>
                    <progress value="${100 - person.hunger}" max="100" class="flex-grow h-5 [&::-webkit-progress-bar]:bg-neutral-700 [&::-webkit-progress-value]:bg-yellow-500 [&::-moz-progress-bar]:bg-yellow-500"></progress>
                    <span class="w-10 text-left ml-2">${Math.floor(100 - person.hunger)}%</span>
                </div>
                <div class="stat flex items-center mb-2">
                    <label class="w-16 text-right mr-2">Thirst:</label>
                    <progress value="${100 - person.thirst}" max="100" class="flex-grow h-5 [&::-webkit-progress-bar]:bg-neutral-700 [&::-webkit-progress-value]:bg-blue-500 [&::-moz-progress-bar]:bg-blue-500"></progress>
                    <span class="w-10 text-left ml-2">${Math.floor(100 - person.thirst)}%</span>
                </div>
                <div class="stat flex items-center mb-2">
                    <label class="w-16 text-right mr-2">Energy:</label>
                    <progress value="${person.energy}" max="100" class="flex-grow h-5 [&::-webkit-progress-bar]:bg-neutral-700 [&::-webkit-progress-value]:bg-purple-500 [&::-moz-progress-bar]:bg-purple-500"></progress>
                    <span class="w-10 text-left ml-2">${Math.floor(person.energy)}%</span>
                </div>
                <div class="stat flex items-center mb-2">
                    <label class="w-16 text-right mr-2">Stamina:</label>
                    <progress value="${(person.stamina / person.traits.maxStamina) * 100}" max="100" class="flex-grow h-5 [&::-webkit-progress-bar]:bg-neutral-700 [&::-webkit-progress-value]:bg-orange-500 [&::-moz-progress-bar]:bg-orange-500"></progress>
                    <span class="w-10 text-left ml-2">${Math.floor(person.stamina)}/${person.traits.maxStamina}</span>
                </div>
                <div class="traits flex flex-wrap justify-around text-sm mt-4">
                    <strong class="w-full mb-2">Traits:</strong>
                    <span title="Hunger Rate" class="cursor-help">🍽️: ${person.traits.hungerRate.toFixed(2)}</span>
                    <span title="Thirst Rate" class="cursor-help">💧: ${person.traits.thirstRate.toFixed(2)}</span>
                    <span title="Energy Rate" class="cursor-help">⚡: ${person.traits.energyRate.toFixed(2)}</span>
                    <span title="Max Stamina" class="cursor-help">💪: ${person.traits.maxStamina}</span>
                    <span title="Stamina Recovery Rate" class="cursor-help">🔄: ${person.traits.staminaRecoveryRate.toFixed(2)}</span>
                </div>
                <div class="person-actions flex flex-wrap justify-around mt-4">
                    <button onclick="eat(${index})" ${isBusy ? 'disabled' : ''} class="border border-green-600 bg-green-900/50 hover:bg-green-700 text-white py-1 px-2 rounded transition ${isBusy ? 'opacity-50 cursor-not-allowed' : ''}" style="--cooldown-duration: ${ACTION_DURATIONS.eat}s;">Eat (10 🍖)</button>
                    <button onclick="drink(${index})" ${isBusy ? 'disabled' : ''} class="border border-blue-600 bg-blue-900/50 hover:bg-blue-700 text-white py-1 px-2 rounded transition ${isBusy ? 'opacity-50 cursor-not-allowed' : ''}" style="--cooldown-duration: ${ACTION_DURATIONS.drink}s;">Drink (5 💧)</button>
                    <button onclick="sleep(${index})" ${isBusy ? 'disabled' : ''} class="border border-purple-600 bg-purple-900/50 hover:bg-purple-700 text-white py-1 px-2 rounded transition ${isBusy ? 'opacity-50 cursor-not-allowed' : ''}" style="--cooldown-duration: ${ACTION_DURATIONS.sleep}s;">Rest 💤</button>
                </div>
            </div>
        `;
    });

    // Update farming UI
    const farmingModule = document.getElementById('farming-module');
    if (gameState.upgrades.farming) {
        farmingModule.classList.remove('hidden');
        farmingModule.innerHTML = `
            <h2 class="text-xl mb-4">Farming</h2>
            <div id="farming-grid" class="grid grid-cols-3 gap-2 mb-4"></div>
            <div class="mb-4">
                <button onclick="waterCrops()" class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition">Water All Crops (5 💧 each)</button>
            </div>
            <div>
                Plant: 
                <button onclick="setPlantingCrop('wheat')" class="bg-yellow-600 hover:bg-yellow-700 text-white py-1 px-2 rounded transition">Wheat (5 💧)</button>
                <button onclick="setPlantingCrop('corn')" class="bg-yellow-600 hover:bg-yellow-700 text-white py-1 px-2 rounded transition">Corn (10 💧)</button>
                <button onclick="setPlantingCrop('potato')" class="bg-yellow-600 hover:bg-yellow-700 text-white py-1 px-2 rounded transition">Potato (15 💧)</button>
            </div>
        `;

        const farmingGrid = document.getElementById('farming-grid');
        gameState.farming.grid.forEach((row, rowIndex) => {
            row.forEach((plot, colIndex) => {
                const plotElement = document.createElement('div');
                plotElement.className = 'w-16 h-16 border border-white flex justify-center items-center text-3xl cursor-pointer';

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
                        plotElement.classList.add('bg-green-600');
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

    updateUpgradeButtons();
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
        gameState.food += 5;
        addLogEntry(`${gameState.party[gameState.selectedPerson].name} gathered 5 food.`);
    }, "gatherFood");
}

function collectWater() {
    performAction(gameState.selectedPerson, () => {
        const amount = 10 * (1 + gameState.upgrades.waterCollection * 0.5);
        gameState.water += amount;
        addLogEntry(`${gameState.party[gameState.selectedPerson].name} collected ${amount} water.`);
    }, "collectWater");
}

function chopWood() {
    performAction(gameState.selectedPerson, () => {
        const amount = 3 * (1 + gameState.upgrades.woodChopping * 0.5);
        gameState.wood += amount;
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
    gameState.farming.grid = Array(3).fill().map(() => Array(3).fill(null));
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

    if (gameState.water >= waterNeeded) {
        gameState.water -= waterNeeded;
        gameState.farming.grid.forEach(row => {
            row.forEach(plot => {
                if (plot) plot.watered = true;
            });
        });
        updateUI();
        addLogEntry(`Watered all crops, using ${waterNeeded} water.`);
    } else {
        addLogEntry("Not enough water to water all crops!", 'error');
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
        gameState.food += CROP_TYPES[plot.type].yield;
        gameState.farming.grid[row][col] = null;
        updateUI();
        addLogEntry(`Harvested ${plot.type} at row ${row + 1}, column ${col + 1}, yielding ${CROP_TYPES[plot.type].yield} food.`);
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
        { id: 'waterCollection', cost: 50, resource: 'water', unlocked: gameState.upgrades.farming },
        { id: 'woodChopping', cost: 50, resource: 'wood', unlocked: gameState.upgrades.farming }
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
                button.disabled = gameState[upgrade.resource] < upgrade.cost;
                button.classList.remove('opacity-30', 'cursor-not-allowed');
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
            farmingButton.disabled = gameState.food < 100;
        }
    }
}

function buyUpgrade(upgradeType) {
    const upgradeCosts = {
        waterCollection: 50,
        woodChopping: 50
    };

    const cost = upgradeCosts[upgradeType];
    const resource = upgradeType === 'waterCollection' ? 'water' : 'wood';

    if (gameState[resource] >= cost) {
        gameState[resource] -= cost;
        gameState.upgrades[upgradeType]++;
        updateUI();
        addLogEntry(`${upgradeType} upgrade purchased!`, 'success');
    } else {
        addLogEntry(`Not enough ${resource} to purchase ${upgradeType} upgrade.`, 'error');
    }
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

// Add this at the end of your game.js file
window.addEventListener('load', function () {
    const resetButton = document.querySelector('#prestige-module button:nth-child(2)');
    if (resetButton) {
        resetButton.addEventListener('click', resetGame);
        console.log("Reset button listener added");
    } else {
        console.log("Reset button not found");
    }
});