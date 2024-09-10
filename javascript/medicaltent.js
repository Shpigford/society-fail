import { gameState } from './settings.js';
import { addLogEntry } from './log.js';

export function initializeMedicalTent() {
  if (!gameState.medicalTent) {
    gameState.medicalTent = {
      active: true,
      healingRate: 1, // Health points restored per hour
      illnessReductionFactor: 0.5 // Reduces chance of illness by 50%
    };
  }
  addLogEntry('Medical Tent is now operational. It will slowly heal injured party members and reduce the chance of illness.');
}

export function applyMedicalTentEffects() {
  if (gameState.medicalTent && gameState.medicalTent.active) {
    gameState.party.forEach(member => {
      if (member.health < 100) {
        member.health = Math.min(100, member.health + gameState.medicalTent.healingRate);
      }
    });
  }
}

export function getIllnessChanceReduction() {
  return gameState.medicalTent && gameState.medicalTent.active ? gameState.medicalTent.illnessReductionFactor : 0;
}