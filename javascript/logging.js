import { getGameState } from './state.js';

export function addLogEntry(message, type = 'info') {
  const gameState = getGameState();
  const entryData = {
    message,
    type,
    day: gameState.day,
    hour: gameState.hour
  };

  gameState.logEntries.unshift(entryData);

  if (gameState.logEntries.length > 100) {
    gameState.logEntries.pop();
  }

  updateLogUI();
}

function updateLogUI() {
  const logContent = document.getElementById('log-content');
  if (!logContent) return;

  const gameState = getGameState();
  logContent.innerHTML = gameState.logEntries.map(entry => `
    <div class="log-entry ${entry.type}">
      <b>Day ${entry.day}, Hour ${entry.hour}</b>
      <span>${entry.message}</span>
    </div>
  `).join('');
}

export function clearLog() {
  const gameState = getGameState();
  gameState.logEntries = [];
  updateLogUI();
}