import { gameState } from './settings.js';

/**
 * Log Module
 * Handles game log functionality including adding entries, updating UI, and initialization.
 */

const MAX_LOG_ENTRIES = 100;

/**
 * Adds a new log entry to the game state and updates the UI.
 * @param {string} message - The message to be logged.
 * @param {string} [type='info'] - The type of log entry (info, warning, error, success, whisper).
 */
export function addLogEntry(message, type = 'info') {
  const entryData = {
    message,
    type,
    day: gameState.day,
    hour: gameState.hour
  };

  // Initialize logEntries if it doesn't exist
  gameState.logEntries = gameState.logEntries || [];

  // Add new entry to the beginning of the array
  gameState.logEntries.unshift(entryData);

  // Limit the number of log entries
  if (gameState.logEntries.length > MAX_LOG_ENTRIES) {
    gameState.logEntries.pop();
  }

  updateLogUI();
}

/**
 * Updates the log UI with the current log entries.
 */
export function updateLogUI() {
  const logContent = document.getElementById('log-content');
  if (!logContent) return;

  logContent.innerHTML = gameState.logEntries.map(entry =>
    `<div class="log-entry ${entry.type}">
      <b>${entry.day}.${entry.hour}</b>
      <span>${entry.message}</span>
    </div>`
  ).join('');
}

/**
 * Clears all log entries and updates the UI.
 */
export function clearLog() {
  gameState.logEntries = [];
  updateLogUI();
}