/**
 * Technologies Module
 * Handles the technology research tree system, which extends beyond the existing Upgrades system.
 * Technologies require knowledge points and time to research, unlike upgrades which apply immediately.
 */

import { gameState } from './settings.js';
import { updateGameState } from './game.js';
import { addLogEntry } from './log.js';
import { createLucideIcons, initializeCollapsibleForModule } from './utils.js';
import { saveGameState } from './storage.js';
import { unlockSecondaryModule } from './upgrades.js';

/**
 * Technology definitions with their costs, research times, effects, and prerequisites
 */
export const TECHNOLOGIES = {
  improvedTools: {
    id: "improvedTools",
    name: "Improved Tools",
    knowledgeCost: 10,
    researchTime: 4, // hours
    effect: "Increase resource gathering by 20%",
    prerequisites: [],
    unlocked: false,
    researched: false,
    category: "survival",
    icon: "anvil"
  },
  advancedFarming: {
    id: "advancedFarming",
    name: "Advanced Farming",
    knowledgeCost: 25,
    researchTime: 8,
    effect: "50% more food from crops",
    prerequisites: ["improvedTools"],
    unlocked: false,
    researched: false,
    category: "farming",
    icon: "sprout"
  },
  waterPurification: {
    id: "waterPurification",
    name: "Water Purification",
    knowledgeCost: 25,
    researchTime: 8,
    effect: "20% less water consumption",
    prerequisites: ["improvedTools"],
    unlocked: false,
    researched: false,
    category: "survival",
    icon: "droplets"
  },
  betterConstruction: {
    id: "betterConstruction",
    name: "Better Construction",
    knowledgeCost: 30,
    researchTime: 12,
    effect: "Buildings cost 25% less wood",
    prerequisites: ["improvedTools"],
    unlocked: false,
    researched: false,
    category: "building",
    icon: "hammer"
  },
  medicinalHerbs: {
    id: "medicinalHerbs",
    name: "Medicinal Herbs",
    knowledgeCost: 40,
    researchTime: 16,
    effect: "Party members heal 5% health per day",
    prerequisites: ["advancedFarming"],
    unlocked: false,
    researched: false,
    category: "medicine",
    icon: "leaf"
  }
};

/**
 * Initializes the technology system
 */
export function initializeTechnologies() {
  // Initialize technologies in gameState if not already present
  if (!gameState.technologies) {
    gameState.technologies = {};
  }

  // Initialize activeResearch if not already present
  if (!gameState.activeResearch) {
    gameState.activeResearch = null;
  }

  // Check which technologies should be unlocked based on prerequisites
  checkTechnologyAvailability();

  // Update the UI
  updateTechnologiesUI();
}

/**
 * Starts research on a technology
 * @param {string} techId - The ID of the technology to research
 */
export function startResearch(techId) {
  const tech = TECHNOLOGIES[techId];

  // Check if the technology exists and is not already researched
  if (!tech || gameState.technologies[techId]?.researched) {
    return;
  }

  // Check if another research is already in progress
  if (gameState.activeResearch) {
    addLogEntry(`Cannot start research on ${tech.name}. Another research is already in progress.`, 'error');
    return;
  }

  // Check if the player can afford the knowledge cost
  if (gameState.knowledgePoints < tech.knowledgeCost) {
    addLogEntry(`Not enough knowledge points to research ${tech.name}.`, 'error');
    return;
  }

  // Deduct the knowledge cost
  gameState.knowledgePoints -= tech.knowledgeCost;

  // Initialize the technology in gameState if not already present
  if (!gameState.technologies[techId]) {
    gameState.technologies[techId] = {
      progress: 0,
      researched: false
    };
  }

  // Set as active research
  gameState.activeResearch = {
    id: techId,
    startTime: gameState.day * 24 + gameState.hour,
    totalTime: tech.researchTime
  };

  addLogEntry(`Started research on ${tech.name}.`, 'success');
  updateGameState();
  updateTechnologiesUI();
  saveGameState();
}

/**
 * Updates research progress during game ticks
 */
export function updateResearchProgress() {
  if (!gameState.activeResearch) {
    return;
  }

  const techId = gameState.activeResearch.id;
  const tech = TECHNOLOGIES[techId];

  if (!tech) {
    gameState.activeResearch = null;
    return;
  }

  // Calculate current progress
  const currentTime = gameState.day * 24 + gameState.hour;
  const elapsedTime = currentTime - gameState.activeResearch.startTime;
  const progress = Math.min(elapsedTime / tech.researchTime, 1);

  // Update progress in gameState
  gameState.technologies[techId].progress = progress;

  // Check if research is complete
  if (progress >= 1) {
    completeResearch(techId);
  }
}

/**
 * Completes research on a technology and applies its effects
 * @param {string} techId - The ID of the technology to complete
 */
export function completeResearch(techId) {
  const tech = TECHNOLOGIES[techId];

  if (!tech) {
    return;
  }

  // Mark as researched
  gameState.technologies[techId].researched = true;
  gameState.technologies[techId].progress = 1;

  // Clear active research
  gameState.activeResearch = null;

  // Apply technology effects
  applyTechnologyEffects(techId);

  // Check for newly available technologies
  checkTechnologyAvailability();

  addLogEntry(`Research complete: ${tech.name}`, 'success');
  updateGameState();
  updateTechnologiesUI();
  saveGameState();
}

/**
 * Checks which technologies should be available based on prerequisites
 */
export function checkTechnologyAvailability() {
  for (const techId in TECHNOLOGIES) {
    const tech = TECHNOLOGIES[techId];

    // Skip if already unlocked
    if (tech.unlocked) {
      continue;
    }

    // Check prerequisites
    let allPrerequisitesMet = true;
    for (const prereqId of tech.prerequisites) {
      if (!gameState.technologies[prereqId]?.researched) {
        allPrerequisitesMet = false;
        break;
      }
    }

    // Unlock if all prerequisites are met
    if (allPrerequisitesMet) {
      tech.unlocked = true;
    }
  }
}

/**
 * Applies the effects of a researched technology
 * @param {string} techId - The ID of the technology to apply
 */
export function applyTechnologyEffects(techId) {
  switch (techId) {
    case 'improvedTools':
      // Increase resource gathering efficiency by 20%
      gameState.resourceEfficiency *= 1.2;
      break;
    case 'advancedFarming':
      // 50% more food from crops - will be handled in farming.js
      break;
    case 'waterPurification':
      // 20% less water consumption
      gameState.waterPurificationActive = true;
      break;
    case 'betterConstruction':
      // 25% less wood cost for buildings - will be applied when calculating costs
      break;
    case 'medicinalHerbs':
      // Party members heal 5% health per day - will be applied in updatePartyStats
      break;
  }
}

/**
 * Updates the technologies UI
 */
export function updateTechnologiesUI() {
  const techModule = document.getElementById('technology-module');
  if (!techModule) return;

  // Clear existing content
  const moduleContent = techModule.querySelector('.module-content');
  if (!moduleContent) return;
  moduleContent.innerHTML = '';

  // Create category filters
  const categories = [...new Set(Object.values(TECHNOLOGIES).map(tech => tech.category))];
  const filterContainer = document.createElement('div');
  filterContainer.className = 'tech-category-filters';

  // Add "All" filter
  const allFilter = document.createElement('button');
  allFilter.textContent = 'All';
  allFilter.className = 'active';
  allFilter.dataset.category = 'all';
  filterContainer.appendChild(allFilter);

  // Add category filters
  categories.forEach(category => {
    const filter = document.createElement('button');
    filter.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    filter.dataset.category = category;
    filterContainer.appendChild(filter);
  });

  moduleContent.appendChild(filterContainer);

  // Add active research section if there is one
  if (gameState.activeResearch) {
    const activeResearchId = gameState.activeResearch.id;
    const activeTech = TECHNOLOGIES[activeResearchId];

    if (activeTech) {
      const activeResearchSection = document.createElement('div');
      activeResearchSection.className = 'active-research';

      const progress = gameState.technologies[activeResearchId]?.progress || 0;
      const progressPercent = Math.round(progress * 100);
      const timeRemaining = Math.ceil(activeTech.researchTime * (1 - progress));

      activeResearchSection.innerHTML = `
        <h3><i data-lucide="flask-conical" class="lucide"></i> Currently Researching</h3>
        <div class="research-details">
          <strong>${activeTech.name}:</strong> ${activeTech.effect}
        </div>
        <div class="progress-bar">
          <div class="progress" style="width: ${progressPercent}%"></div>
        </div>
        <div class="progress-text">
          <span>${progressPercent}% complete</span>
          <span>${timeRemaining} hours remaining</span>
        </div>
      `;

      moduleContent.appendChild(activeResearchSection);
    }
  }

  // Create technologies container
  const techContainer = document.createElement('div');
  techContainer.className = 'technologies-container';

  // Create technology categories
  const availableTechSection = document.createElement('div');
  availableTechSection.className = 'tech-category available-technologies';
  availableTechSection.innerHTML = '<h3>Available Technologies</h3>';
  const availableTechItems = document.createElement('div');
  availableTechItems.className = 'tech-items';
  availableTechSection.appendChild(availableTechItems);

  const researchedTechSection = document.createElement('div');
  researchedTechSection.className = 'tech-category researched-technologies';
  researchedTechSection.innerHTML = '<h3>Researched Technologies</h3>';
  const researchedTechItems = document.createElement('div');
  researchedTechItems.className = 'tech-items';
  researchedTechSection.appendChild(researchedTechItems);

  const lockedTechSection = document.createElement('div');
  lockedTechSection.className = 'tech-category locked-technologies';
  lockedTechSection.innerHTML = '<h3>Locked Technologies</h3>';
  const lockedTechItems = document.createElement('div');
  lockedTechItems.className = 'tech-items';
  lockedTechSection.appendChild(lockedTechItems);

  // Add technologies to their respective sections
  for (const techId in TECHNOLOGIES) {
    const tech = TECHNOLOGIES[techId];
    const isResearched = gameState.technologies[techId]?.researched;
    const isActiveResearch = gameState.activeResearch?.id === techId;

    // Skip if it's the active research (already displayed)
    if (isActiveResearch) {
      continue;
    }

    const techElement = document.createElement('div');
    techElement.className = `tech-item ${isResearched ? 'researched' : tech.unlocked ? 'available' : 'locked'}`;
    techElement.dataset.techId = techId;
    techElement.dataset.category = tech.category;

    // Create tech header
    const techHeader = document.createElement('div');
    techHeader.className = 'tech-header';

    techHeader.innerHTML = `
      <div class="tech-icon"><i data-lucide="${tech.icon}" class="lucide"></i></div>
      <div class="tech-name">${tech.name}</div>
      <div class="tech-status ${isResearched ? 'researched' : tech.unlocked ? 'available' : 'locked'}">
        ${isResearched ? 'Researched' : tech.unlocked ? 'Available' : 'Locked'}
      </div>
    `;

    techElement.appendChild(techHeader);

    // Create tech content
    const techContent = document.createElement('div');
    techContent.className = 'tech-content';

    let contentHTML = `<div class="tech-effect">${tech.effect}</div>`;

    if (isResearched) {
      // No additional content needed for researched technologies
    } else if (tech.unlocked) {
      contentHTML += `
        <div class="tech-cost">
          <span class="knowledge"><i data-lucide="book" class="lucide"></i> ${tech.knowledgeCost}</span>
          <span class="time"><i data-lucide="clock" class="lucide"></i> ${tech.researchTime} hours</span>
        </div>
        <button class="research-button" data-tech-id="${techId}">Research</button>
      `;
    } else {
      // Show prerequisites for locked technologies
      const prereqNames = tech.prerequisites.map(prereqId => TECHNOLOGIES[prereqId]?.name || prereqId).join(', ');
      contentHTML += `<div class="tech-prerequisites">Requires: ${prereqNames}</div>`;
    }

    techContent.innerHTML = contentHTML;
    techElement.appendChild(techContent);

    // Add to appropriate section
    if (isResearched) {
      researchedTechItems.appendChild(techElement);
    } else if (tech.unlocked) {
      availableTechItems.appendChild(techElement);
    } else {
      lockedTechItems.appendChild(techElement);
    }
  }

  // Add sections to container if they have children beyond the header
  if (availableTechItems.childElementCount > 0) {
    techContainer.appendChild(availableTechSection);
  }

  if (researchedTechItems.childElementCount > 0) {
    techContainer.appendChild(researchedTechSection);
  }

  if (lockedTechItems.childElementCount > 0) {
    techContainer.appendChild(lockedTechSection);
  }

  // If no technologies are available, show a message
  if (techContainer.childElementCount === 0) {
    const noTechMessage = document.createElement('div');
    noTechMessage.className = 'no-technologies';
    noTechMessage.textContent = 'No technologies available yet. Gather more knowledge to unlock technologies.';
    techContainer.appendChild(noTechMessage);
  }

  moduleContent.appendChild(techContainer);

  // Add event listeners
  const researchButtons = techModule.querySelectorAll('.research-button');
  researchButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const techId = event.target.dataset.techId;
      startResearch(techId);
    });
  });

  // Add category filter functionality
  const categoryFilters = techModule.querySelectorAll('.tech-category-filters button');
  categoryFilters.forEach(filter => {
    filter.addEventListener('click', (event) => {
      // Remove active class from all filters
      categoryFilters.forEach(f => f.classList.remove('active'));

      // Add active class to clicked filter
      event.target.classList.add('active');

      const category = event.target.dataset.category;
      const techItems = techModule.querySelectorAll('.tech-item');

      techItems.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Initialize Lucide icons
  createLucideIcons();
}

/**
 * Shows the technology module after a specific game milestone
 * @param {boolean} show - Whether to show the module
 */
export function showTechnologyModule(show = true) {
  const techModule = document.getElementById('technology-module');
  if (!techModule) return;

  if (show) {
    techModule.classList.remove('mystery');
    techModule.innerHTML = `
      <h2 class="collapsible"><i data-lucide="microscope" class="icon-dark"></i> Technologies <i data-lucide="chevron-up" class="toggle-icon"></i></h2>
      <div class="module-content"></div>
    `;
    updateTechnologiesUI();

    // Initialize collapsible functionality for the newly created header
    initializeCollapsibleForModule('technology-module');
  } else {
    techModule.classList.add('mystery');
    techModule.innerHTML = `
      <div class="mystery-content">
        <div class="icon"><i data-lucide="circle-help" class="icon gutter-grey"></i></div>
        <div class="title">Ancient Knowledge</div>
        <div class="description">What secrets await those who seek to understand?</div>
      </div>
    `;
  }

  createLucideIcons();
} 