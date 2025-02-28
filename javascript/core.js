/*
  Core Module
  This module serves as the entry point for the game application.
  It initializes the game and sets up necessary components when the DOM is fully loaded.
*/

import { createLucideIcons } from './utils.js';
import { initializeGame } from './game.js';
import { initializeShortcuts } from './shortcuts.js';
import { initializeShortcutsModal } from './shortcuts-modal.js';

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

  // Initialize shortcuts and modal
  initializeShortcuts();
  initializeShortcutsModal();

  // Log successful initialization
  console.log('Game initialization complete');
});