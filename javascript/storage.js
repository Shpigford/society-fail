/**
 * Storage Module
 * Handles saving, loading, and clearing game state using localStorage.
 */

import { TICK_INTERVAL, gameState, initialGameState } from './settings.js';

const STORAGE_KEY = 'societyFail';

/**
 * Saves the current game state to localStorage.
 */
export function saveGameState() {
  const saveData = {
    ...gameState,
    lastSaved: Date.now(),
    collapseState: gameState.collapseState || {}
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
}

/**
 * Loads the saved game state from localStorage and updates it based on elapsed time.
 * @returns {Object|null} The loaded and updated game state or null if no save exists.
 */
export function loadGameState() {
  const savedData = localStorage.getItem(STORAGE_KEY);
  if (!savedData) return null;

  const loadedState = JSON.parse(savedData);

  // Check if the saved version is compatible with the current version
  if (loadedState.version !== initialGameState.version) {
    return 'incompatible';
  }

  // Calculate elapsed time and update game state
  const elapsedTime = Date.now() - loadedState.lastSaved;
  const elapsedTicks = Math.floor(elapsedTime / TICK_INTERVAL);

  loadedState.hour += elapsedTicks;
  loadedState.day += Math.floor(loadedState.hour / 24);
  loadedState.hour %= 24;

  // Ensure collapseState exists
  loadedState.collapseState = loadedState.collapseState || {};

  return loadedState;
}

/**
 * Removes the saved game state from localStorage.
 */
export function clearGameState() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Saves the collapse state of a module.
 * @param {string} moduleId - The ID of the module.
 * @param {boolean} isCollapsed - Whether the module is collapsed.
 */
export function saveCollapseState(moduleId, isCollapsed) {
  gameState.collapseState = gameState.collapseState || {};
  gameState.collapseState[moduleId] = isCollapsed;
  saveGameState();
}

/**
 * Loads the collapse state of a module.
 * @param {string} moduleId - The ID of the module.
 * @returns {boolean|null} The collapse state of the module or null if not found.
 */
export function loadCollapseState(moduleId) {
  return gameState.collapseState && gameState.collapseState[moduleId] !== undefined
    ? gameState.collapseState[moduleId]
    : null;
}