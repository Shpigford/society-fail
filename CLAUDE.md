# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Society Fail is a browser-based post-apocalyptic survival incremental game built with pure HTML/CSS/JavaScript. The project intentionally avoids build tools and frameworks to maintain simplicity.

## Development Commands

### Running the Game Locally
```bash
# The game requires a local server due to ES6 modules. Use any static server:
# Option 1: Python (if installed)
python3 -m http.server 8000

# Option 2: Node.js http-server (if installed)
npx http-server

# Option 3: VS Code/Cursor Live Server extension
# Right-click index.html and select "Open with Live Server"
```

### Git Commands
```bash
# The main branch is 'main'
git checkout main
git pull origin main
```

## Architecture & Code Organization

### Module Structure
The codebase uses ES6 modules with a clear separation of concerns:

- **`javascript/core.js`** - Entry point that initializes all game systems
- **`javascript/game.js`** - Core game loop, state management, and save/load system
- **`javascript/settings.js`** - Centralized game state and configuration constants
- **`javascript/party.js`** - Party member management and PartyMember class
- **`javascript/technologies.js`** - Research system and tech tree
- **`javascript/upgrades.js`** - Upgrade system and progression
- **`javascript/contentment.js`** - Mood/happiness mechanics

### State Management Pattern
All game state is centralized in `settings.js` and state updates flow through `game.js`:
```javascript
// Import pattern used throughout:
import { gameState, CONSTANTS } from './settings.js';
import { updateGameState, saveGame } from './game.js';
```

### UI Update Pattern
The game uses a tick-based system (1500ms intervals) with manual DOM updates:
```javascript
// UI updates happen in respective modules
document.getElementById('elementId').textContent = value;
document.getElementById('elementId').classList.add/remove('class');
```

### Adding New Features
1. Create a new module in `javascript/` (e.g., `javascript/newfeature.js`)
2. Create matching stylesheet in `stylesheets/` (e.g., `stylesheets/newfeature.css`)
3. Import and initialize in `javascript/core.js`
4. Add necessary HTML structure to `index.html`
5. Update game state structure in `javascript/settings.js` if needed

## Important Development Notes

### No Build Process
- This project has no package.json, no npm scripts, no webpack/vite
- JavaScript files are loaded directly as ES6 modules
- CSS files are linked directly in index.html
- Changes are immediately reflected on page refresh

### Game Systems Integration Points
- **Resource Management**: Resources (scrap, food, water, medicine) are tracked in `gameState.resources`
- **Party Members**: Managed through `PartyMember` class with specializations and skills
- **Technologies**: Research unlocks new features, tracked in `gameState.technologies`
- **Upgrades**: Progressive improvements, stored in `gameState.upgrades`
- **Contentment**: Affects resource generation and party member efficiency

### Save System
The game auto-saves to localStorage every 10 seconds. Save data structure:
- Uses `localStorage.setItem('societyFailSave', JSON.stringify(gameState))`
- Handles migration for save compatibility
- Export/import functionality available for backup

### CSS Organization
Stylesheets mirror the JavaScript module structure:
- `stylesheets/base.css` - Core layout and typography
- `stylesheets/resources.css` - Resource display styling
- `stylesheets/party.css` - Party member UI
- Each feature module has a corresponding stylesheet

## Code Style Guidelines

### JavaScript Patterns
- Use ES6 module imports/exports
- Maintain consistent JSDoc comments for functions
- Keep functions focused and modular
- State modifications should go through proper update functions

### Common Patterns in Codebase
```javascript
// Module export pattern
export function initializeFeature() {
    // Setup code
}

// Event listener pattern
document.getElementById('button').addEventListener('click', () => {
    // Handle click
    updateGameState();
    saveGame();
});

// Resource check pattern
if (gameState.resources.scrap >= cost) {
    gameState.resources.scrap -= cost;
    // Apply effect
}
```

## Testing Approach
The project has no automated tests. Manual testing involves:
1. Loading the game in browser
2. Using browser DevTools console for debugging
3. Testing save/load functionality
4. Verifying resource calculations
5. Checking UI updates on state changes

## CSS Development Guidelines

### File Organization
- Each component or module has its own CSS file (e.g., `farming.css`, `party.css`)
- Core styles split across: `reset.css`, `base.css`, `typography.css`, `buttons.css`, `shell.css`, `modules.css`, `utils.css`

### Modern CSS Practices
- Use CSS nesting for component structure (use `&` only when necessary)
- Utilize logical properties (e.g., margin-block, padding-inline)
- Employ CSS variables for theming and recurring values
- Use modern selectors like :is() and :where()

### Naming Conventions
- Kebab-case for class names: `.resource-container`, `.party-member`
- Component-based naming: `.module-name__element--modifier`
- Avoid unnecessary abbreviations

### Color System
- Dark backgrounds for main UI
- Red/dark yellow for food
- Blue for water
- Green for wood/nature
- Purple/dark purple for knowledge and corruption
- Status colors: Green (positive/high), Yellow/orange (medium), Red (negative/low)

### Dark Theme Considerations
- Ensure sufficient contrast for readability
- Use subtle gradients for depth
- Maintain the post-apocalyptic atmosphere through styling

## JavaScript Development Guidelines

### Module Structure
- Use ES6 modules exclusively with `import` and `export`
- Each file handles a specific game system
- Export only public API functions
- Follow the existing module pattern in the codebase

### State Management
- Access game state through `gameState` from `settings.js`
- Use `updateGameState()` to sync UI after changes
- Call `saveGameState()` after significant changes
- Never modify state directly without proper update functions

### Documentation Requirements
- Use JSDoc comment blocks for all exported functions
- Add single-line comments for complex logic
- Document all state properties and their purpose

### Naming Conventions
- camelCase for variables/functions: `resourceAmount`, `updatePartyStats()`
- PascalCase for classes: `PartyMember`
- UPPER_SNAKE_CASE for constants: `TICK_INTERVAL`, `MAX_PARTY_SIZE`
- Boolean variables prefix: `isDisabled`, `hasMember`

### UI Interaction
- Add event listeners in dedicated setup functions
- Update UI with dedicated `updateXXXUI()` functions
- Use template literals for HTML generation
- Call `createLucideIcons()` after adding new icons

### Performance
- Cache DOM selections when used repeatedly
- Batch DOM updates when possible
- Avoid unnecessary recalculations in update loops

## General Development Rules

### Code Comments
- Use JSDoc for JavaScript documentation
- Single-line comments within functions to explain logic
- CSS comments use /* */ syntax
- Be thorough in commenting to help future AI understand the code

### Feature Implementation
- Always write correct, bug-free, fully functional code
- Fully implement all requested functionality
- Leave NO todos, placeholders or missing pieces
- Focus on readability over performance
- Consider new technologies and contrarian ideas

### State Persistence
- Any new feature affecting game state must be saved properly
- Use the existing save/load system in `storage.js`
- Handle save migration for compatibility

### Icons
- Use Lucide icons throughout the project
- Add icons with `data-lucide` attributes
- Call icon creation function after DOM updates