/**
 * Manages the shortcuts help modal and shortcuts visibility toggle
 */

// Track if shortcuts are visible
let shortcutsVisible = true;

// Create and append modal HTML
const modalHTML = `
<div id="shortcuts-modal" class="modal hidden">
  <div class="modal-content">
    <header>
      <h2><i data-lucide="keyboard" class="icon"></i> Keyboard Shortcuts</h2>
      <button class="close-modal"><i data-lucide="x" class="icon"></i></button>
    </header>
    
    <div class="shortcuts-toggle">
      <label>
        <input type="checkbox" id="shortcuts-toggle" checked>
        Show shortcuts in game
      </label>
    </div>

    <div class="shortcuts-list">
      <h3>Game Controls</h3>
      <ul>
        <li><kbd>H</kbd> Toggle shortcuts help</li>
        <li><kbd>Q</kbd> Gather Food</li>
        <li><kbd>W</kbd> Collect Water</li>
        <li><kbd>E</kbd> Chop Wood</li>
      </ul>
      
      <h3>Difficulty Selection</h3>
      <ul>
        <li><kbd>A</kbd> Select Easy mode</li>
        <li><kbd>S</kbd> Select Medium mode</li>
        <li><kbd>D</kbd> Select Hard mode</li>
      </ul>
    </div>
  </div>
</div>
`;

export function initializeShortcutsModal() {
  // Append modal to body
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  const modal = document.getElementById('shortcuts-modal');
  const closeBtn = modal.querySelector('.close-modal');
  const toggleCheckbox = document.getElementById('shortcuts-toggle');
  const shortcutsBtn = document.getElementById('shortcuts-help');

  // Show modal when shortcuts button is clicked
  shortcutsBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
  });

  // Close modal when close button is clicked
  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });

  // Handle shortcuts visibility toggle
  toggleCheckbox.addEventListener('change', () => {
    shortcutsVisible = toggleCheckbox.checked;
    document.body.classList.toggle('hide-shortcuts', !shortcutsVisible);
  });
} 