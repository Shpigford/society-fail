/**
 * Handles keyboard shortcuts for selecting game difficulty
 * Shortcuts:
 * - 'a' for Easy
 * - 's' for Medium
 * - 'd' for Hard
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
    // Only process shortcuts if we're on the start screen
    const startScreen = document.getElementById('game_start_screen');
    if (startScreen.classList.contains('hidden')) return;

    const key = event.key.toLowerCase();
    
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