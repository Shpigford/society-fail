import { gameState, updateGameState } from './state.js';
import { ACHIEVEMENTS } from './constants.js';
import { addLogEntry } from './logging.js';

export function checkAchievements() {
  const state = gameState;
  ACHIEVEMENTS.forEach(achievement => {
    if (!state.achievements[achievement.id] && achievement.condition(state)) {
      unlockAchievement(achievement.id);
    }
  });
}

function unlockAchievement(achievementId) {
  const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
  if (achievement) {
    updateGameState({
      achievements: {
        ...gameState.achievements,
        [achievementId]: true
      }
    });
    addLogEntry(`Achievement Unlocked: ${achievement.name}!`, 'success');
  }
}

export function getUnlockedAchievements() {
  return ACHIEVEMENTS.filter(achievement => gameState.achievements[achievement.id]);
}

export function getAchievementProgress(achievementId) {
  const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
  if (achievement && achievement.progress) {
    return achievement.progress();
  }
  return null;
}