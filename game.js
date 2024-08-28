let gameState = {
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
    autoGatherers: {
        food: 0,
        water: 0,
        wood: 0
    },
    prestige: 0,
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
            // Add personality traits
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

    document.getElementById('difficulty-selection').style.display = 'none';
    document.getElementById('game-ui').style.display = 'block';

    updateUI();
    setInterval(gameLoop, 1000);
}

function gameLoop() {
    gameState.hour++;
    if (gameState.hour > 24) {
        gameState.hour = 1;
        gameState.day++;
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
            alert(`${person.name} has died!`);
            gameState.party.splice(index, 1);
            delete gameState.busyUntil[index];
        }
    });

    // Auto-gathering
    gameState.food += gameState.autoGatherers.food;
    gameState.water += gameState.autoGatherers.water;
    gameState.wood += gameState.autoGatherers.wood;

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
        alert('Game Over! Everyone has died.');
        location.reload();
    }

    checkForRandomEvent();
    updateUI();
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
    alert(`Random Event: ${event.name}`);
    updateUI();
}

function updateUI() {
    document.getElementById('time').textContent = `Day ${gameState.day}, Hour ${gameState.hour}`;
    document.getElementById('food').textContent = Math.floor(gameState.food);
    document.getElementById('water').textContent = Math.floor(gameState.water);
    document.getElementById('wood').textContent = Math.floor(gameState.wood);

    const partyElement = document.getElementById('party');
    partyElement.innerHTML = '';
    gameState.party.forEach((person, index) => {
        const isBusy = isPersonBusy(index);
        const isResting = gameState.busyUntil[index] === -1;
        const busyTimeLeft = isBusy && !isResting ? 
            gameState.busyUntil[index] - (gameState.hour + (gameState.day - 1) * 24) : 0;
        
        partyElement.innerHTML += `
            <div class="person ${index === gameState.selectedPerson ? 'selected' : ''} ${isBusy ? 'busy' : ''}" onclick="selectPerson(${index})">
                <h3>${person.name} ${isResting ? '(Resting)' : isBusy ? `(Busy: ${busyTimeLeft}h)` : ''}</h3>
                ${isBusy ? `<div class="busy-label">${isResting ? 'RESTING' : 'BUSY'}</div>` : ''}
                <div class="stat">
                    <label>Health:</label>
                    <progress value="${person.health}" max="100"></progress>
                    <span>${Math.floor(person.health)}%</span>
                </div>
                <div class="stat">
                    <label>Hunger:</label>
                    <progress value="${100 - person.hunger}" max="100"></progress>
                    <span>${Math.floor(100 - person.hunger)}%</span>
                </div>
                <div class="stat">
                    <label>Thirst:</label>
                    <progress value="${100 - person.thirst}" max="100"></progress>
                    <span>${Math.floor(100 - person.thirst)}%</span>
                </div>
                <div class="stat">
                    <label>Energy:</label>
                    <progress value="${person.energy}" max="100"></progress>
                    <span>${Math.floor(person.energy)}%</span>
                </div>
                <div class="stat">
                    <label>Stamina:</label>
                    <progress value="${(person.stamina / person.traits.maxStamina) * 100}" max="100"></progress>
                    <span>${Math.floor(person.stamina)}/${person.traits.maxStamina}</span>
                </div>
                <div class="traits">
                    <strong>Traits:</strong>
                    <span title="Hunger Rate">🍽️: ${person.traits.hungerRate.toFixed(2)}</span>
                    <span title="Thirst Rate">💧: ${person.traits.thirstRate.toFixed(2)}</span>
                    <span title="Energy Rate">⚡: ${person.traits.energyRate.toFixed(2)}</span>
                    <span title="Max Stamina">💪: ${person.traits.maxStamina}</span>
                    <span title="Stamina Recovery Rate">🔄: ${person.traits.staminaRecoveryRate.toFixed(2)}</span>
                </div>
                <div class="person-actions">
                    <button onclick="eat(${index})" ${isBusy ? 'disabled' : ''} style="--cooldown-duration: ${ACTION_DURATIONS.eat}s;">Eat (10 🍖)</button>
                    <button onclick="drink(${index})" ${isBusy ? 'disabled' : ''} style="--cooldown-duration: ${ACTION_DURATIONS.drink}s;">Drink (5 💧)</button>
                    <button onclick="sleep(${index})" ${isBusy ? 'disabled' : ''} style="--cooldown-duration: ${ACTION_DURATIONS.sleep}s;">Rest</button>
                </div>
            </div>
        `;
    });

    // Update farming UI
    const farmingModule = document.getElementById('farming-module');
    if (gameState.upgrades.farming) {
        farmingModule.style.display = 'block';
        farmingModule.innerHTML = `
            <h2>Farming</h2>
            <div id="farming-grid"></div>
            <div>
                <button onclick="waterCrops()">Water All Crops (5 💧 each)</button>
            </div>
            <div>
                Plant: 
                <button onclick="setPlantingCrop('wheat')">Wheat (5 💧)</button>
                <button onclick="setPlantingCrop('corn')">Corn (10 💧)</button>
                <button onclick="setPlantingCrop('potato')">Potato (15 💧)</button>
            </div>
        `;

        const farmingGrid = document.getElementById('farming-grid');
        farmingGrid.style.display = 'grid';
        farmingGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
        farmingGrid.style.gap = '10px';

        gameState.farming.grid.forEach((row, rowIndex) => {
            row.forEach((plot, colIndex) => {
                const plotElement = document.createElement('div');
                plotElement.style.width = '50px';
                plotElement.style.height = '50px';
                plotElement.style.border = '1px solid white';
                plotElement.style.display = 'flex';
                plotElement.style.justifyContent = 'center';
                plotElement.style.alignItems = 'center';
                plotElement.style.fontSize = '24px';
                plotElement.style.cursor = 'pointer';

                if (plot) {
                    const now = gameState.hour + (gameState.day - 1) * 24;
                    const growthProgress = Math.min(100, ((now - plot.plantedAt) / CROP_TYPES[plot.type].growthTime) * 100);
                    const cropEmoji = CROP_TYPES[plot.type].emoji;
                    plotElement.textContent = cropEmoji;
                    plotElement.title = `${plot.type}: ${growthProgress.toFixed(0)}% grown, ${plot.watered ? 'Watered' : 'Needs Water'}`;
                    
                    if (!plot.watered) {
                        plotElement.style.opacity = '0.5';
                    }

                    if (growthProgress === 100) {
                        plotElement.onclick = () => harvestCrop(rowIndex, colIndex);
                        plotElement.style.backgroundColor = 'green';
                    }
                } else {
                    plotElement.textContent = '🟫';
                    plotElement.onclick = () => plantCrop(rowIndex, colIndex, gameState.plantingCrop);
                }

                farmingGrid.appendChild(plotElement);
            });
        });
    } else {
        farmingModule.style.display = 'none';
    }

    // Update progress bar colors
    gameState.party.forEach((person, index) => {
        const personElement = partyElement.children[index];
        if (!personElement) {
            console.warn(`Person element not found for index ${index}`);
            return;
        }
        
        const statElements = personElement.querySelectorAll('.stat');
        const expectedStatCount = 5; // Health, Hunger, Thirst, Energy, Stamina

        if (statElements.length < expectedStatCount) {
            console.warn(`Not enough stat elements found for person ${index}. Expected ${expectedStatCount}, found ${statElements.length}`);
            return;
        }

        const updateStat = (statIndex, value, max, reverse = false) => {
            if (statIndex > statElements.length) {
                console.warn(`Stat index ${statIndex} out of range for person ${index}`);
                return;
            }
            const progressBar = statElements[statIndex - 1].querySelector('progress');
            if (progressBar) {
                updateProgressBarColor(progressBar, value, max, reverse);
            } else {
                console.warn(`Progress bar not found for stat ${statIndex} of person ${index}`);
            }
        };

        updateStat(1, person.health, 100);
        updateStat(2, person.hunger, 100, true);
        updateStat(3, person.thirst, 100, true);
        updateStat(4, person.energy, 100);
        updateStat(5, person.stamina, person.traits.maxStamina);
    });
}

function performAction(personIndex, action, actionName) {
    const person = gameState.party[personIndex];
    if (isPersonBusy(personIndex)) {
        alert(`${person.name} is busy and can't ${actionName} right now!`);
    } else if (person.stamina >= gameState.staminaPerAction) {
        action();
        person.stamina -= gameState.staminaPerAction;
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
        alert(`${person.name} doesn't have enough stamina to ${actionName}!`);
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
    }, "gatherFood");
}

function collectWater() {
    performAction(gameState.selectedPerson, () => {
        gameState.water += 10 * (1 + gameState.upgrades.waterCollection * 0.5);
    }, "collectWater");
}

function chopWood() {
    performAction(gameState.selectedPerson, () => {
        gameState.wood += 3 * (1 + gameState.upgrades.woodChopping * 0.5);
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
        } else {
            alert("Not enough food!");
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
        } else {
            alert("Not enough water!");
        }
    }, "drink");
}

function sleep(personIndex) {
    performAction(personIndex, () => {
        // Sleep logic is handled in the gameLoop function
    }, "sleep");
}

function unlockFarming() {
    const cost = 100;
    if (gameState.food >= cost) {
        gameState.food -= cost;
        gameState.upgrades.farming = true;
        initializeFarmingGrid();
        updateUI();
        alert("Farming unlocked! You can now plant and harvest crops.");
    } else {
        alert("Not enough food to unlock farming!");
    }
}

function initializeFarmingGrid() {
    gameState.farming.grid = Array(3).fill().map(() => Array(3).fill(null));
}

function plantCrop(row, col, cropType) {
    if (gameState.farming.grid[row][col] !== null) {
        alert("This plot is already occupied!");
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
    } else {
        alert("Not enough water to plant this crop!");
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
    } else {
        alert("Not enough water to water all crops!");
    }
}

function harvestCrop(row, col) {
    const plot = gameState.farming.grid[row][col];
    if (!plot) {
        alert("No crop to harvest here!");
        return;
    }

    const now = gameState.hour + (gameState.day - 1) * 24;
    if (now - plot.plantedAt >= CROP_TYPES[plot.type].growthTime && plot.watered) {
        gameState.food += CROP_TYPES[plot.type].yield;
        gameState.farming.grid[row][col] = null;
        updateUI();
    } else {
        alert("This crop is not ready for harvest yet!");
    }
}

function prestige() {
    if (confirm("Are you sure you want to restart? You'll gain prestige points based on your progress.")) {
        gameState.prestige += Math.floor(Math.log(gameState.day));
        resetGame();
    }
}

function resetGame() {
    // Reset game state but keep prestige
    gameState = {
        day: 1,
        hour: 1,
        party: [],
        food: 10 * gameState.prestige,
        water: 10 * gameState.prestige,
        wood: 5 * gameState.prestige,
        prestige: gameState.prestige
    };
    startGame('medium'); // Or let player choose difficulty again
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

// Add this new function
function updateProgressBarColor(progressBar, value, max, reverse = false) {
    if (!progressBar) {
        console.warn('Progress bar element not found');
        return;
    }

    const percentage = reverse ? (1 - value / max) * 100 : (value / max) * 100;
    let color;

    if (percentage >= 75) {
        color = '#00ff00'; // Green
    } else if (percentage >= 50) {
        color = '#ffff00'; // Yellow
    } else if (percentage >= 25) {
        color = '#ff8000'; // Orange
    } else {
        color = '#ff0000'; // Red
    }

    progressBar.style.setProperty('--progress-color', color);
}