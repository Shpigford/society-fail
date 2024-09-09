/**
 * Time Module
 * Handles game time progression and display updates.
 */

import { gameState, TICK_INTERVAL } from './settings.js';
import { updateGameState } from './game.js';

let isPaused = false;
let tickInterval = null;

/**
 * Starts the game time and initializes the tick interval.
 */
export function startTime() {
  updateTimeDisplay();
  tickInterval = setInterval(tick, TICK_INTERVAL);
}

/**
 * Progresses game time by one hour and updates the game state.
 */
function tick() {
  if (isPaused) return;

  gameState.hour = (gameState.hour % 24) + 1;
  if (gameState.hour === 1) {
    gameState.day++;
  }

  gameState.totalPlayTime += TICK_INTERVAL / 1000; // Convert milliseconds to seconds

  updateTimeDisplay();
  updateGameState();
}

/**
 * Updates the time display in the DOM.
 */
export function updateTimeDisplay() {
  const timeElement = document.getElementById('time');
  if (timeElement) {
    timeElement.textContent = `Day ${gameState.day}, Hour ${gameState.hour}`;
  }
}

/**
 * Toggles the paused state of the game time.
 */
export function togglePause() {
  isPaused = !isPaused;
}

/**
 * Resets the game time to the initial state and stops the timer.
 */
export function resetTime() {
  stopTime();
  gameState.day = 1;
  gameState.hour = 1;
  updateTimeDisplay();
}

/**
 * Stops the game time and clears the tick interval.
 */
export function stopTime() {
  clearInterval(tickInterval);
  tickInterval = null;
  isPaused = false;
}