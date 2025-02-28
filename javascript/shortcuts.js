/**
 * Handles keyboard shortcuts for selecting game difficulty and game actions
 * Shortcuts:
 * - 'a' for Easy
 * - 's' for Medium
 * - 'd' for Hard
 * - 'h' to open shortcuts help
 * - 'q' to gather food
 * - 'w' to collect water
 * - 'e' to chop wood
 * - Party member 1: 'u'=eat, 'i'=drink, 'o'=sleep
 * - Party member 2: 'j'=eat, 'k'=drink, 'l'=sleep
 * - Party member 3: 'm'=eat, ','=drink, '.'=sleep
 */
export function initializeShortcuts() {
  // Map keys to difficulty levels
  const DIFFICULTY_SHORTCUTS = {
    'a': 'easy',
    's': 'medium',
    'd': 'hard'
  };

  // Map keys to action buttons
  const ACTION_SHORTCUTS = {
    'q': 'gatherFoodBtn',
    'w': 'collectWaterBtn',
    'e': 'chopWoodBtn'
  };

  // Map keys to party member actions
  const PARTY_SHORTCUTS = {
    'u': { index: 0, action: 'eat' },
    'i': { index: 0, action: 'drink' },
    'o': { index: 0, action: 'sleep' },
    'j': { index: 1, action: 'eat' },
    'k': { index: 1, action: 'drink' },
    'l': { index: 1, action: 'sleep' },
    'm': { index: 2, action: 'eat' },
    ',': { index: 2, action: 'drink' },
    '.': { index: 2, action: 'sleep' }
  };

  // Event listener for keydown events
  document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();

    // Handle help shortcut (works on any screen)
    if (key === 'h') {
      const modal = document.getElementById('shortcuts-modal');
      const shortcutsBtn = document.getElementById('shortcuts-help');
      
      if (modal && !modal.classList.contains('hidden')) {
        modal.classList.add('hidden');
      } else if (shortcutsBtn) {
        shortcutsBtn.click();
      }
      return;
    }

    // Handle party member shortcuts if we're on the game screen
    if (PARTY_SHORTCUTS[key]) {
      const gameScreen = document.getElementById('game_screen');
      if (!gameScreen?.classList.contains('hidden')) {
        const { index, action } = PARTY_SHORTCUTS[key];
        const button = document.querySelector(`button[data-action="${action}"][data-person="${index}"]:not([disabled])`);
        if (button) {
          button.click();
        }
      }
      return;
    }

    // Handle action shortcuts if we're on the game screen
    if (ACTION_SHORTCUTS[key]) {
      const gameScreen = document.getElementById('game_screen');
      if (!gameScreen?.classList.contains('hidden')) {
        const button = document.getElementById(ACTION_SHORTCUTS[key]);
        if (button) {
          button.click();
        }
      }
      return;
    }

    // Only process difficulty shortcuts if we're on the start screen
    const startScreen = document.getElementById('game_start_screen');
    if (startScreen?.classList.contains('hidden')) return;
    
    // Check if the pressed key matches any of our shortcuts
    if (DIFFICULTY_SHORTCUTS[key]) {
      // Find and click the corresponding difficulty button
      const button = document.querySelector(`button[data-difficulty="${DIFFICULTY_SHORTCUTS[key]}"]`);
      if (button) {
        button.click();
      }
    }
  });
} 