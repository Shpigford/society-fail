/*
  Core Module
  This module serves as the entry point for the game application.
  It initializes the game and sets up necessary components when the DOM is fully loaded.
*/

import { createLucideIcons } from './utils.js';
import { initializeGame } from './game.js';

/**
 * Event listener for DOMContentLoaded event.
 * This function is executed when the initial HTML document has been completely loaded and parsed.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Log the start of initialization process
  console.log('DOM content loaded, starting initialization');

  // Create Lucide icons for the UI
  createLucideIcons();

  // Initialize the game
  initializeGame();

  // Log successful initialization
  console.log('Game initialization complete');
});