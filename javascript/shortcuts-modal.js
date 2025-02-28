/**
 * Manages the shortcuts help modal and shortcuts visibility toggle
 */

// Track if shortcuts are visible - default to false on mobile
let shortcutsVisible = window.innerWidth > 800;

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
        <input type="checkbox" id="shortcuts-toggle" ${window.innerWidth > 800 ? 'checked' : ''}>
        Show shortcuts in game
      </label>
    </div>

    <div class="shortcuts-list">
      <ul>
        <li><kbd>H</kbd> Toggle shortcuts help</li>
      </ul>

      <h3>Game Controls</h3>
      <ul>
        <li><kbd>Q</kbd> Gather Food</li>
        <li><kbd>W</kbd> Collect Water</li>
        <li><kbd>E</kbd> Chop Wood</li>
      </ul>
      
      <h3>Party Members</h3>
      <table>
        <tr>
          <th>Member 1</th>
          <th>Member 2</th>
          <th>Member 3</th>
        </tr>
        <tr>
          <td><kbd>U</kbd> Eat</td>
          <td><kbd>J</kbd> Eat</td>
          <td><kbd>M</kbd> Eat</td>
        </tr>
        <tr>
          <td><kbd>I</kbd> Drink</td>
          <td><kbd>K</kbd> Drink</td>
          <td><kbd>,</kbd> Drink</td>
        </tr>
        <tr>
          <td><kbd>O</kbd> Rest</td>
          <td><kbd>L</kbd> Rest</td>
          <td><kbd>.</kbd> Rest</td>
        </tr>
      </table>
    </div>
  </div>
</div>
`;

export function initializeShortcutsModal() {
  // Append modal to body
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Set initial state for shortcuts visibility
  document.body.classList.toggle('hide-shortcuts', !shortcutsVisible);
  
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