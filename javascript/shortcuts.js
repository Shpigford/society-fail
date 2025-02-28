/**
 * Handles keyboard shortcuts for selecting game difficulty
 * Shortcuts:
 * - 'a' for Easy
 * - 's' for Medium
 * - 'd' for Hard
 * - 'h' to open shortcuts help
 */
export function initializeShortcuts() {
  // Map keys to difficulty levels
  const DIFFICULTY_SHORTCUTS = {
    'a': 'easy',
    's': 'medium',
    'd': 'hard'
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