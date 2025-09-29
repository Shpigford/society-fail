# Implementation Todo List for Society Fail

### 1. Add Knowledge Points Resource ✅
```
Add a new resource called "knowledge points" to the game by:
1. Modify settings.js: Add knowledgePoints: 0 to initialGameState object
2. Add totalKnowledgePointsGained: 0 for statistics tracking
3. Modify header in index.html: Add new resource div with data-lucide="book" icon and blue-purple color class
4. Update updateResourceDisplay() in game.js to include knowledge points
5. Modify all resource actions in actions.js: Add 5% chance to gain 1 knowledge point on successful resource gathering
6. Update resource actions to include: gameState.knowledgePoints += 1; gameState.totalKnowledgePointsGained += 1;
7. Add notification in log.js when knowledge points are gained
```

### 2. Implement Contentment System ✅
```
Create a contentment system that affects gameplay:
1. Create new file javascript/contentment.js with functions: initializeContentment(), increaseContentment(), decreaseContentment(), getContentmentEffects()
2. Add contentmentLevel: 50 and maxContentment: 100 to initialGameState in settings.js
3. Add contentment UI in index.html next to the day/hour/time block that makes use of lucide emoji icons with green-yellow-red color scheme
4. Update game.js to call checkContentmentEffects() in updateGameState()
5. Add logic to decrease contentment by 0.5 every 24 hours when resources fall below 10% of capacity, and increase by 0.5 when resources are above 50% capacity
6. Apply contentment effects: For each 10 points below 50 contentment, reduce resource gathering efficiency by 3%
7. Create contentmentEffects in settings.js to track specific effects
8. Add contentment messages to randomevents.js when contentment reaches certain thresholds (75, 50, 25, 0)
```

### 3. Implement Party Member Specialization System ✅
```
Add role specializations for party members:
1. Create new file javascript/specializations.js with specializationTypes object containing:
   - Gatherer: {resourceBonus: 0.25, name: "Gatherer", icon: "axe", description: "25% more resources from gathering actions"}
   - Builder: {woodCostReduction: 0.2, name: "Builder", icon: "hammer", description: "20% reduced wood cost for buildings"}
   - Researcher: {knowledgeGeneration: 0.5, name: "Researcher", icon: "book", description: "Generates 0.5 knowledge points per hour"}
2. Modify PartyMember class in party.js to add specialization: null property
3. Add setSpecialization(type) method to PartyMember class
4. Update updatePartyDisplay() in party.js to show specialization icon and name
5. Add specialization selection UI to party member display with buttons for each type
6. Modify performResourceAction() in actions.js to apply gatherer bonus
7. Modify building costs in upgrades.js to apply builder discount
8. Update updateGameState() to generate knowledge from researchers
```

### 4. Create Technology Research Tree System ✅
```
Implement a knowledge-based technology tree that extends beyond the existing Upgrades system:
1. Create new file javascript/technologies.js with TECHNOLOGIES object containing:
   - improvedTools: {id: "improvedTools", name: "Improved Tools", knowledgeCost: 10, researchTime: 4, effect: "Increase resource gathering by 20%", prerequisites: [], unlocked: false, researched: false, category: "survival"}
   - advancedFarming: {id: "advancedFarming", name: "Advanced Farming", knowledgeCost: 25, researchTime: 8, effect: "50% more food from crops", prerequisites: ["improvedTools"], unlocked: false, researched: false, category: "farming"}
   - waterPurification: {id: "waterPurification", name: "Water Purification", knowledgeCost: 25, researchTime: 8, effect: "20% less water consumption", prerequisites: ["improvedTools"], unlocked: false, researched: false, category: "survival"}
   - betterConstruction: {id: "betterConstruction", name: "Better Construction", knowledgeCost: 30, researchTime: 12, effect: "Buildings cost 25% less wood", prerequisites: ["improvedTools"], unlocked: false, researched: false, category: "building"}
   - medicinalHerbs: {id: "medicinalHerbs", name: "Medicinal Herbs", knowledgeCost: 40, researchTime: 16, effect: "Party members heal 5% health per day", prerequisites: ["advancedFarming"], unlocked: false, researched: false, category: "medicine"}
2. Add technologies: {} to initialGameState in settings.js
3. Create technology tree UI in a new section in index.html with id="technology-module"
   - Design visually distinct from Upgrades panel with connecting lines showing prerequisites
   - Include category filtering tabs
   - Show research progress for technologies being researched
4. Add functions:
   - initializeTechnologies() - Set up technology system separately from upgrades
   - startResearch(techId) - Begin research process (unlike upgrades which apply immediately)
   - updateResearchProgress() - Progress active research during tick updates
   - completeResearch(techId) - Apply effects when research time is complete
   - checkTechnologyAvailability() - Update which technologies are available based on prerequisites
   - applyTechnologyEffects() - Similar to applyUpgradeEffects() but for technologies
5. Update game.js to conditionally show the Technology module after a specific game milestone (e.g., day 10 or when player reaches certain knowledge points)
6. Connect to the time.js tick system to advance research over game time
7. Add gameState.technologies to save/load in storage.js
8. Integrate with the existing upgrade system:
   - Some technologies can unlock new upgrades
   - Some upgrades can reduce research time or costs
   - Keep both systems visible simultaneously in late game
9. Add tutorial message explaining the difference between immediate upgrades and time-based research
```

### 5. Add Expedition System for Resource Gathering
```
Create an expedition system for resource gathering:
1. Create new file javascript/expeditions.js with expedition locations:
   - nearbyForest: {id: "nearbyForest", name: "Nearby Forest", icon: "tree", resourceTypes: ["wood", "food"], baseAmount: [10, 5], riskLevel: 0.1, duration: 4, minDay: 1}
   - abandonedShop: {id: "abandonedShop", name: "Abandoned Shop", icon: "store", resourceTypes: ["food", "wood"], baseAmount: [15, 3], riskLevel: 0.2, duration: 6, minDay: 3}
   - cityRuins: {id: "cityRuins", name: "City Ruins", icon: "building", resourceTypes: ["wood", "water", "knowledgePoints"], baseAmount: [20, 15, 2], riskLevel: 0.4, duration: 12, minDay: 7}
2. Add expeditions: {activeExpeditions: [], discoveredLocations: [], completedExpeditions: 0} to initialGameState in settings.js
3. Add functions: initializeExpeditions(), startExpedition(locationId, partyMemberIndex), completeExpedition(expeditionId), calculateExpeditionOutcome(expedition)
4. Create UI for expeditions in a new section in index.html with id="expeditions-module"
5. Add UI to display available locations, send party members, and show active expeditions
6. Add logic to make party members unavailable during expeditions
7. Implement risk system: higher risk gives chance of injury/death but better rewards
8. Connect to time.js to advance expedition progress
```

### 6. Implement Settlement Building System
```
Create a settlement building system:
1. Create new file javascript/settlement.js with BUILDINGS object:
   - improvedShelter: {id: "improvedShelter", name: "Improved Shelter", icon: "home", cost: {wood: 50}, effect: "Party members recover energy 20% faster", limit: 1}
   - storageHut: {id: "storageHut", name: "Storage Hut", icon: "box", cost: {wood: 30}, effect: "Increase max resource storage by 100", limit: 3}
   - researchHut: {id: "researchHut", name: "Research Hut", icon: "book", cost: {wood: 40}, effect: "Generate 1 knowledge point per hour", limit: 1}
   - waterCollector: {id: "waterCollector", name: "Water Collector", icon: "droplet", cost: {wood: 35}, effect: "Generate 2 water per hour", limit: 2}
   - gardensPlot: {id: "gardensPlot", name: "Gardens Plot", icon: "sprout", cost: {wood: 25, water: 10}, effect: "Generate 1 food per hour", limit: 3}
2. Add settlement: {buildings: [], grid: Array(5).fill().map(() => Array(5).fill(null)), unlocked: false} to initialGameState
3. Create new UI section in index.html with id="settlement-module" with 5x5 grid
4. Add functions: initializeSettlement(), buildBuilding(id, x, y), demolishBuilding(x, y), applyBuildingEffects()
5. Add building selection UI and grid clicking mechanics
6. Connect resources to building costs
7. Implement building effects providing passive resource generation
8. Add "Settlement" tab to game modules with grid layout
```

### 7. Add Inventory and Equipment System
```
Create an inventory and equipment system:
1. Create new file javascript/inventory.js with EQUIPMENT_TYPES:
   - weapon: {slots: ["primitive", "standard", "advanced"], effectType: "gatheringBonus"}
   - tool: {slots: ["primitive", "standard", "advanced"], effectType: "resourceSpecific"}
   - clothing: {slots: ["primitive", "standard", "advanced"], effectType: "protection"}
2. Create ITEMS object:
   - primitiveAxe: {id: "primitiveAxe", name: "Primitive Axe", type: "tool", slot: "primitive", cost: {wood: 10}, effect: {wood: 0.15}, description: "+15% wood gathering"}
   - reinforcedAxe: {id: "reinforcedAxe", name: "Reinforced Axe", type: "tool", slot: "standard", cost: {wood: 30}, effect: {wood: 0.3}, description: "+30% wood gathering"}
   - huntingSpear: {id: "huntingSpear", name: "Hunting Spear", type: "weapon", slot: "primitive", cost: {wood: 15}, effect: {food: 0.2}, description: "+20% food from hunting"}
   - leatherJacket: {id: "leatherJacket", name: "Leather Jacket", type: "clothing", slot: "standard", cost: {food: 40}, effect: {protection: 0.1}, description: "10% damage reduction"}
3. Add inventory: {items: {}, equipped: {}} to each party member in PartyMember class
4. Add crafting function for items in inventory.js
5. Create inventory UI tab in party member display
6. Add equipment slots to party member display
7. Modify resource gathering to apply equipment bonuses
8. Add craftItem(itemId, partyMemberIndex) and equipItem(itemId, partyMemberIndex) functions
```

### 8. Implement Party Member Traits System
```
Develop traits system for party members:
1. Create new file javascript/traits.js with TRAITS object:
   - strongBack: {id: "strongBack", name: "Strong Back", effect: {woodGathering: 0.2}, description: "+20% wood gathering"}
   - quickLearner: {id: "quickLearner", name: "Quick Learner", effect: {knowledgeGain: 0.3}, description: "+30% knowledge gain"}
   - greenThumb: {id: "greenThumb", name: "Green Thumb", effect: {farmingYield: 0.25}, description: "+25% farming yield"}
   - cautious: {id: "cautious", name: "Cautious", effect: {expeditionRisk: -0.15}, description: "-15% expedition risk"}
   - resourceful: {id: "resourceful", name: "Resourceful", effect: {resourceConsumption: -0.1}, description: "-10% resource consumption"}
   - hardy: {id: "hardy", name: "Hardy", effect: {healthRegen: 0.1}, description: "+10% health regeneration"}
   - nightOwl: {id: "nightOwl", name: "Night Owl", effect: {nightEfficiency: 0.25}, description: "+25% efficiency at night"}
   - survivor: {id: "survivor", name: "Survivor", effect: {corruptionResistance: 0.2}, description: "+20% corruption resistance"}
   - fastLearner: {id: "fastLearner", name: "Fast Learner", effect: {skillGain: 0.15}, description: "+15% skill gain rate"}
   - leader: {id: "leader", name: "Leader", effect: {partyBonus: 0.05}, description: "+5% efficiency to all party members"}
2. Modify PartyMember constructor to randomly assign 1-2 traits from TRAITS
3. Add traits display to party member UI
4. Implement trait effects in relevant functions (resource gathering, expeditions, etc.)
5. Add functions to gain traits based on actions: gainTrait(partyMemberIndex, traitId), checkTraitTriggers()
6. Add trait evolution - traits can improve or change based on actions performed
7. Update party.js to apply trait effects to all actions
```

### 9. Create Anti-Corruption Ritual System
```
Implement rituals to counter corruption:
1. Create new file javascript/rituals.js with RITUALS object:
   - purification: {id: "purification", name: "Purification Ritual", cost: {water: 30, food: 10}, effect: {corruptionReduction: 5}, duration: 2, minMembers: 1}
   - feast: {id: "feast", name: "Community Feast", cost: {food: 50}, effect: {corruptionReduction: 8, moraleBoost: 20}, duration: 3, minMembers: 2}
   - meditation: {id: "meditation", name: "Group Meditation", cost: {}, effect: {corruptionReduction: 3, knowledgeGain: 2}, duration: 1, minMembers: 3}
   - offering: {id: "offering", name: "Resource Offering", cost: {food: 20, water: 20, wood: 20}, effect: {corruptionReduction: 12}, duration: 2, minMembers: 1}
   - ancientRite: {id: "ancientRite", name: "Ancient Rite", cost: {knowledgePoints: 10}, effect: {corruptionReduction: 15, specialReward: true}, duration: 4, minMembers: 2}
2. Add rituals: {available: [], performed: [], lastRitual: 0} to initialGameState in settings.js
3. Create ritual UI in a new section in index.html with id="rituals-module"
4. Add functions: initializeRituals(), performRitual(ritualId), completeRitual(ritualId), checkRitualAvailability()
5. Connect to corruption.js to apply corruption reduction effects
6. Make rituals require specific party members to perform
7. Add UI to show active rituals and cooldowns
8. Implement special rewards for ritual completion
```

### 10. Add Exploration Events System for Expeditions
```
Create event system for expeditions:
1. Create new file javascript/explorationEvents.js with EXPLORATION_EVENTS array containing 20+ event objects:
   - {id: "abandonedCamp", title: "Abandoned Camp", description: "You find an abandoned camp with some supplies.", choices: [{text: "Search thoroughly", outcome: {resources: {food: 5, water: 5}, risk: 0.2}}, {text: "Take what's visible and leave", outcome: {resources: {food: 2, water: 2}, risk: 0}}]}
   - {id: "strangeArtifact", title: "Strange Artifact", description: "You discover a strange glowing artifact.", choices: [{text: "Take it", outcome: {knowledgePoints: 5, corruption: 2}}, {text: "Leave it alone", outcome: {}}]}
   - {id: "injuredSurvivor", title: "Injured Survivor", description: "You find an injured person.", choices: [{text: "Help them", outcome: {newPartyMember: 0.5, resources: {food: -5}}}, {text: "Leave them", outcome: {corruption: 3}}]}
   Plus 17 more detailed events with various choices and outcomes
2. Add exploration events to expedition outcomes in expeditions.js
3. Create event resolution UI overlay for expedition system
4. Add functions: triggerExplorationEvent(expeditionId), resolveExplorationEvent(expeditionId, choiceIndex)
5. Implement choice resolution logic and outcome application
6. Create event log entries for expedition events
7. Add special rewards like unique items from certain event choices
8. Connect event outcomes to corruption, resources, and party members
```

### 11. Add Medicine Resource and Healing System
```
Implement medicine resource:
1. Modify settings.js: Add medicine: 0 to initialGameState
2. Add totalMedicineProduced: 0 for statistics tracking
3. Add new resource to header in index.html with data-lucide="pill" icon and green color class
4. Add craftMedicine() function to actions.js requiring 5 food to produce 1 medicine
5. Create healPartyMember(partyMemberIndex) function that consumes 1 medicine to restore 20 health
6. Add "Craft Medicine" button to actions panel when appropriate technology is researched
7. Add "Heal" button to party member interface when medicine is available
8. Create medicine icon and display in resources bar
9. Modify illness mechanics in randomevents.js to be treatable with medicine
10. Add medicine to storage.js for saving/loading
```

### 12. Add Dream System for Story Progression
```
Implement dream whispers system:
1. Create new file javascript/dreams.js with DREAM_FRAGMENTS array containing 30+ story elements:
   - {id: "fragment1", title: "The Beginning", content: "In your dream, you see the world before it fell...", requiresCorruption: 0}
   - {id: "fragment2", title: "The Darkness Rises", content: "Shadows moving with purpose, consuming everything...", requiresCorruption: 10}
   - {id: "fragment3", title: "The First Resistance", content: "People gathering, fighting against the inevitable...", requiresCorruption: 20}
   - Plus 27 more narrative fragments revealing game backstory
2. Add dreams: {received: []} to initialGameState
3. Create receiveDream(fragmentId) function to display dream overlay
4. Add triggers in time.js to occasionally give dreams during sleep
5. Create UI overlay for displaying dream text with atmospheric styling
6. Add dream journal UI to record discovered fragments
7. Connect corruption level to dream fragment availability
8. Make certain dreams provide gameplay hints or temporary buffs
```

### 13. Implement Seasonal Change System
```
Create seasonal system affecting gameplay:
1. Create new file javascript/seasons.js with SEASONS object:
   - spring: {id: "spring", name: "Spring", modifiers: {foodGathering: 0.2, waterGathering: 0.3, woodGathering: 0}, description: "Food and water are more plentiful.", color: "#84cf9e"}
   - summer: {id: "summer", name: "Summer", modifiers: {foodGathering: 0.3, waterGathering: -0.2, woodGathering: 0.1}, description: "Food is abundant but water is scarcer.", color: "#f7d154"}
   - fall: {id: "fall", name: "Fall", modifiers: {foodGathering: 0.1, waterGathering: 0.1, woodGathering: 0.3}, description: "Balance of resources, good for wood gathering.", color: "#d27c4a"}
   - winter: {id: "winter", name: "Winter", modifiers: {foodGathering: -0.3, waterGathering: 0, woodGathering: -0.1}, description: "Resources are scarce. Survival is harder.", color: "#9bb8ea"}
2. Add currentSeason: "spring", seasonDay: 1, seasonLength: 20 to initialGameState
3. Update time.js to advance seasons every 20 days
4. Create seasonal transition notifications and visual indicators
5. Add season display to the time module
6. Modify resource gathering functions to apply seasonal modifiers
7. Create seasonal events triggered only during specific seasons
8. Update UI colors or themes based on current season
```

### 14. Add Electricity as Power Resource
```
Implement electricity system:
1. Modify settings.js: Add electricity: 0, maxElectricity: 50 to initialGameState
2. Add electricityGeneration: 0, electricityConsumption: 0 for tracking
3. Create new file javascript/power.js with POWER_BUILDINGS:
   - windmill: {id: "windmill", name: "Windmill", cost: {wood: 100, knowledgePoints: 15}, output: 5, description: "Generates 5 electricity per hour"}
   - waterWheel: {id: "waterWheel", name: "Water Wheel", cost: {wood: 80, water: 20, knowledgePoints: 10}, output: 3, description: "Generates 3 electricity per hour"}
   - generator: {id: "generator", name: "Fuel Generator", cost: {wood: 50, knowledgePoints: 20}, output: 10, fuelCost: {wood: 2}, description: "Generates 10 electricity per hour, consumes 2 wood"}
4. Add POWER_CONSUMERS defining buildings that use electricity
5. Add electricity UI to resources display with battery icon
6. Create electricity management UI panel
7. Update time.js to generate and consume electricity each hour
8. Make advanced buildings require power to function
9. Add building status indicators for powered/unpowered
```

### 15. Create Trading Post System
```
Implement trading post:
1. Create new file javascript/trading.js with functions:
   - initializeTrading(), updateTrading(), generateTradingRates(), executeTrade(sellResource, buyResource, amount)
2. Add trading: {unlocked: false, lastUpdated: 0, currentRates: {}, specialItems: []} to initialGameState
3. Create new upgradeable building: tradingPost in settlement.js
4. Create trading UI in a new section in index.html with id="trading-module"
5. Implement resource exchange rates that update daily:
   - Base rates: 1 food = 0.8 water, 1 wood = 1.2 food, etc.
   - Daily fluctuation: Random ±20% to each rate
6. Add UI for converting between resource types
7. Create special items section for rare purchases:
   - {id: "weatherRadio", name: "Weather Radio", cost: {food: 100, electricity: 20}, effect: "Predicts weather patterns"}
   - {id: "scoutingMap", name: "Scouting Map", cost: {wood: 150}, effect: "Reveals 3 new expedition locations"}
   - {id: "medicalTextbook", name: "Medical Textbook", cost: {knowledgePoints: 40}, effect: "Improves medicine effectiveness by 25%"}
8. Make special items appear randomly every 3-5 days
```

### 16. Implement Artifact Discovery System
```
Create artifact system with special abilities:
1. Create new file javascript/artifacts.js with ARTIFACTS array:
   - {id: "ancientCompass", name: "Ancient Compass", description: "Reduces expedition time by 25%", effect: {expeditionTimeFactor: 0.75}}
   - {id: "mysteriousAmulet", name: "Mysterious Amulet", description: "Reduces corruption gain by 15%", effect: {corruptionFactor: 0.85}}
   - {id: "crystalLens", name: "Crystal Lens", description: "Increases knowledge gain by 30%", effect: {knowledgeFactor: 1.3}}
   - {id: "ancientSeedPouch", name: "Ancient Seed Pouch", description: "Farming yields 40% more food", effect: {farmingFactor: 1.4}}
   - {id: "waterPendant", name: "Water Pendant", description: "Water collection improved by 35%", effect: {waterFactor: 1.35}}
   - {id: "woodcarverTools", name: "Woodcarver's Tools", description: "Wood gathering improved by 35%", effect: {woodFactor: 1.35}}
   - {id: "healingChalice", name: "Healing Chalice", description: "Medicine effectiveness improved by 50%", effect: {medicineFactor: 1.5}}
   - {id: "darknessVessel", name: "Darkness Vessel", description: "Converts corruption into knowledge", effect: {specialAbility: "convertCorruption"}}
   - {id: "ancientTablet", name: "Ancient Tablet", description: "Reveals all technologies", effect: {specialAbility: "revealTech"}}
   - {id: "timepiece", name: "Mysterious Timepiece", description: "Occasionally freezes time for free actions", effect: {specialAbility: "freezeTime"}}
2. Add artifacts: {discovered: []} to initialGameState
3. Create artifact collection UI in a new section
4. Add artifact discovery to expedition events with 5% chance
5. Create discoverArtifact(artifactId) and useArtifactAbility(artifactId) functions
6. Add artifact effects to appropriate game systems
7. Create special UI for artifacts with unique abilities
8. Implement artifacts as modifiers to existing mechanics
```

### 17. Create Emergency Resource Management System
```
Implement emergency resource protocols:
1. Create new file javascript/emergency.js with functions:
   - activateRationing(resourceType), deactivateRationing(resourceType)
   - initiateEmergencyGathering(resourceType), endEmergencyGathering(resourceType)
   - implementDesperateMeasures(measureType)
2. Add emergency: {rationing: {food: false, water: false}, emergencyGathering: {}, desperateMeasuresUsed: []} to initialGameState
3. Create UI for emergency protocols in a dropdown menu from resources display
4. Implement rationing system:
   - Reduces resource consumption by 30%
   - Causes 2 morale loss per hour to all party members
   - Slows energy recovery by 25%
5. Add "Emergency Gathering" option:
   - Doubles resource gain rate for 12 hours
   - Causes permanent 5% efficiency loss afterward
   - Depletes party member energy at triple rate
6. Add "Desperate Measures" actions:
   - "Sacrifice Health": Convert party member health to energy
   - "Burn Supplies": Convert wood to warmth (useful in winter)
   - "Dark Pact": Convert health to corruption reduction
7. Create confirmation dialogs for emergency actions
```

### 18. Add Faction Relationship System
```
Implement faction system:
1. Create new file javascript/factions.js with FACTIONS object:
   - survivors: {id: "survivors", name: "The Survivors", description: "Pragmatic group focused on day-to-day survival", baseAttitude: 0, reputation: 0, tradeBonuses: {food: 0.1}}
   - scientists: {id: "scientists", name: "The Scientists", description: "Knowledge-focused faction studying the apocalypse", baseAttitude: -10, reputation: 0, tradeBonuses: {knowledgePoints: 0.2}}
   - spiritualists: {id: "spiritualists", name: "The Spiritualists", description: "Believe the apocalypse has mystical significance", baseAttitude: 10, reputation: 0, tradeBonuses: {corruption: -0.05}}
2. Add factions: {discovered: [], interactions: {}} to initialGameState
3. Create factions UI in a new section in index.html with id="factions-module"
4. Implement reputation system with 5 levels: Hostile, Wary, Neutral, Friendly, Allied
5. Add functions: discoverFaction(factionId), changeFactionReputation(factionId, amount)
6. Create faction-specific trading bonuses based on reputation
7. Implement faction discovery through expeditions with 10% chance
8. Add faction-specific quests and requests
```

### 19. Create Achievement System with Permanent Benefits
```
Expand achievements system with permanent benefits:
1. Modify achievements.js to update ACHIEVEMENTS array with new achievements:
   - longTermSurvivor: {id: "longTermSurvivor", name: "Century Survivor", description: "Survive for 100 days", condition: state => state.day >= 100, reward: {resourceGatheringBonus: 0.05}}
   - masterCrafter: {id: "masterCrafter", name: "Master Crafter", description: "Craft 50 tools", condition: state => state.totalItemsCrafted >= 50, reward: {craftingCostReduction: 0.1}}
   - darkExplorer: {id: "darkExplorer", name: "Dark Explorer", description: "Complete 30 expeditions", condition: state => state.expeditions.completedExpeditions >= 30, reward: {expeditionTimeReduction: 0.1}}
   - knowledgeSeeker: {id: "knowledgeSeeker", name: "Knowledge Seeker", description: "Research 15 technologies", condition: state => Object.values(state.technologies).filter(t => t.researched).length >= 15, reward: {knowledgeGainBonus: 0.15}}
   - masterFarmer: {id: "masterFarmer", name: "Master Farmer", description: "Harvest 500 food from farming", condition: state => state.totalFoodFromFarming >= 500, reward: {farmingYieldBonus: 0.1}}
   Add 15 more achievements with specific conditions and rewards
2. Modify unlockAchievement() to apply permanent bonuses in achievements.js
3. Add achievement progress tracking to relevant game actions
4. Create new UI panel showing achievement progress and rewards
5. Add achievement notification with reward details
6. Implement persistent achievement bonuses affecting gameplay
7. Add achievement reset options with memory fragment compensation
```

### 20. Create Memory Fragment Prestige System
```
Implement memory fragment prestige system:
1. Create new file javascript/prestige.js with functions:
   - calculateMemoryFragments(), resetWithMemoryFragments(), applyMemoryFragmentUpgrades()
2. Add prestige: {memoryFragments: 0, totalReset: 0, upgrades: {}} to initialGameState
3. Create MEMORY_UPGRADES object:
   - startingResources: {id: "startingResources", name: "Resource Memory", cost: 10, levels: 5, effect: level => ({startingResourceBonus: level * 0.2})}
   - efficientGathering: {id: "efficientGathering", name: "Gathering Techniques", cost: 15, levels: 5, effect: level => ({gatheringEfficiency: level * 0.1})}
   - expeditionExperience: {id: "expeditionExperience", name: "Expedition Experience", cost: 20, levels: 3, effect: level => ({expeditionRewards: level * 0.15})}
   - corruptionResistance: {id: "corruptionResistance", name: "Corruption Resistance", cost: 25, levels: 3, effect: level => ({corruptionGainReduction: level * 0.1})}
   - knowledgeRetention: {id: "knowledgeRetention", name: "Knowledge Retention", cost: 30, levels: 3, effect: level => ({startingKnowledge: level * 5})}
   Plus 5 more upgrades
4. Create prestige UI in a new section accessed via a special button
5. Make reset available after day 100 with confirmation dialog
6. Calculate fragments based on: days survived (0.5 per day), knowledge gained (0.2 per point), corruption resisted (0.1 per point)
7. Create "New Game+" system with special options for subsequent playthroughs
8. Add permanent upgrade system purchasable with fragments
```

### 21. Implement Resource Storage Building System
```
Create storage buildings for resources:
1. Add to the BUILDINGS object in settlement.js:
   - foodStorage: {id: "foodStorage", name: "Food Storage", icon: "package", cost: {wood: 80}, effect: {foodCapacity: 500}, description: "Store up to 500 additional food"}
   - waterReservoir: {id: "waterReservoir", name: "Water Reservoir", icon: "container", cost: {wood: 70, knowledgePoints: 5}, effect: {waterCapacity: 500}, description: "Store up to 500 additional water"}
   - woodshed: {id: "woodshed", name: "Woodshed", icon: "logs", cost: {wood: 50}, effect: {woodCapacity: 400}, description: "Store up to 400 additional wood"}
   - libraryShelf: {id: "libraryShelf", name: "Library Shelf", icon: "book", cost: {wood: 60, knowledgePoints: 10}, effect: {knowledgeCapacity: 100}, description: "Store up to 100 additional knowledge points"}
2. Add storage capacity tracking to gameState: {maxFood: 100, maxWater: 100, maxWood: 100, maxKnowledge: 50}
3. Update resource limits in all resource-related functions
4. Create resource warning notifications when approaching capacity
5. Add storage tab to building interface
6. Implement storage efficiency upgrades research options
7. Add visuals showing current/max resource capacity in UI
8. Update storage in storage.js for save/load
```

### 22. Add Weather System Affecting Gameplay
```
Implement weather system:
1. Create new file javascript/weather.js with WEATHER_TYPES:
   - clear: {id: "clear", name: "Clear", icon: "sun", modifiers: {}, description: "Perfect weather for all activities"}
   - rainy: {id: "rainy", name: "Rainy", icon: "cloud-rain", modifiers: {woodGathering: -0.2, waterGathering: 0.3, farmingSpeed: 0.2}, description: "Good for water collection, bad for wood gathering"}
   - windy: {id: "windy", name: "Windy", icon: "wind", modifiers: {foodGathering: -0.1, electricityGeneration: 0.3}, description: "Windmills generate more electricity"}
   - foggy: {id: "foggy", name: "Foggy", icon: "cloud-fog", modifiers: {expeditionRisk: 0.1, foodGathering: -0.15}, description: "Increased expedition risk"}
   - stormy: {id: "stormy", name: "Stormy", icon: "cloud-lightning", modifiers: {allGathering: -0.25, waterGathering: 0.5, expeditionRisk: 0.2}, description: "Dangerous for expeditions, good for water"}
2. Add weather: {current: "clear", forecast: [], lastChange: 0} to initialGameState
3. Create functions: updateWeather(), forecastWeather(), getWeatherEffects()
4. Add weather icon and display to the time module
5. Implement weather changes every 6-12 hours with weighted probabilities
6. Create seasonal weather patterns (more rain in spring, etc.)
7. Add weather forecast research technology
8. Modify resource gathering and expeditions to account for weather
```

### 23. Implement Tool Crafting System
```
Create tool crafting system:
1. Create new file javascript/crafting.js with TOOLS object:
   - basicAxe: {id: "basicAxe", name: "Basic Axe", type: "wood", cost: {wood: 15}, durability: 20, bonus: 0.2, description: "+20% wood gathering, 20 uses"}
   - sturdyAxe: {id: "sturdyAxe", name: "Sturdy Axe", type: "wood", cost: {wood: 30}, durability: 40, bonus: 0.4, description: "+40% wood gathering, 40 uses"}
   - fishingSpear: {id: "fishingSpear", name: "Fishing Spear", type: "food", cost: {wood: 20}, durability: 15, bonus: 0.3, description: "+30% food gathering, 15 uses"}
   - waterFilter: {id: "waterFilter", name: "Water Filter", type: "water", cost: {wood: 10, knowledgePoints: 5}, durability: 25, bonus: 0.25, description: "+25% water gathering, 25 uses"}
   - researchJournal: {id: "researchJournal", name: "Research Journal", type: "knowledge", cost: {wood: 20}, durability: 10, bonus: 0.5, description: "+50% knowledge gain, 10 uses"}
2. Add tools: {crafted: [], active: {}} to gameState
3. Create crafting UI in a new section in index.html
4. Add functions: craftTool(toolId), useTool(toolId, resourceType), checkToolDurability()
5. Implement tool degradation system
6. Update resource gathering to check for and use appropriate tools
7. Add crafting tab to main UI
8. Implement technology to improve tool durability and effectiveness
```

### 24. Add Party Member Morale System
```
Implement morale system for party members:
1. Modify PartyMember class in party.js to add morale: 100 property
2. Add moraleEffects tracking impact on actions
3. Create functions in party.js: updateMorale(), getMoraleEffects(), adjustMorale(partyMemberIndex, amount)
4. Add morale display bar to party member UI
5. Implement morale effects:
   - >75 morale: +15% all resource gathering
   - 50-75 morale: No modifier
   - 25-50 morale: -10% all resource gathering
   - <25 morale: -25% all resource gathering, 5% chance to refuse actions
6. Add morale-impacting events:
   - Good meals: +5 morale
   - Resource scarcity: -3 morale per day
   - Successful expeditions: +10 morale
   - Party member death: -20 morale to all
   - Comfortable shelter: +2 morale per day
7. Create morale-boosting actions (games, celebration, etc.)
8. Add morale threshold system for more varied effects
```

### 25. Implement Day/Night Cycle System
```
Create day/night cycle system:
1. Modify time.js to track day/night:
   - Hours 6-18 are day
   - Hours 19-5 are night
2. Add visual indicator in UI for day/night
3. Add isNight() function to time.js
4. Update core.css to add night-time styling
5. Implement activity modifiers based on time:
   - Night: -20% food/wood gathering, +10% water gathering
   - Night: +25% corruption growth rate
   - Night: -10% energy consumption while resting
   - Day: Normal resource gathering rates
6. Add day/night-specific random events
7. Create upgrades that reduce night penalties
8. Implement special night exploration events with higher risks/rewards
9. Add lighting buildings to reduce night penalties
10. Create specialized night vision equipment
```

### 26. Add Herb Garden for Medicine Production
```
Implement herb garden for medicine:
1. Create new file javascript/herbs.js with HERBS object:
   - healroot: {id: "healroot", name: "Healroot", growthTime: 12, yield: 2, effect: {medicineValue: 1}}
   - feverfew: {id: "feverfew", name: "Feverfew", growthTime: 18, yield: 3, effect: {medicineValue: 1.5}}
   - bloodleaf: {id: "bloodleaf", name: "Bloodleaf", growthTime: 24, yield: 4, effect: {medicineValue: 2}}
2. Add herbs: {available: {}, growing: [], harvested: {}} to initialGameState
3. Create herb garden UI in a new section or tab in the farming module
4. Add functions: plantHerb(herbId, plotIndex), harvestHerb(plotIndex), processHerbs(herbId, amount)
5. Implement herb garden building in settlement.js
6. Connect herbs to medicine crafting in a 2:1 ratio (2 herbs = 1 medicine)
7. Add herb discovery from expeditions
8. Implement herb seeds as tradable items
9. Create herb garden upgrade to increase yield
10. Add herb garden plot system similar to farming
```

### 27. Create Scout Tower Defense System
```
Implement scout tower for threat detection:
1. Create new file javascript/defense.js with THREAT_TYPES:
   - hostileSurvivors: {id: "hostileSurvivors", name: "Hostile Survivors", risk: 0.3, damage: {resources: 0.1, health: 20}, difficulty: 1}
   - corruptedAnimals: {id: "corruptedAnimals", name: "Corrupted Animals", risk: 0.4, damage: {health: 30}, difficulty: 2}
   - darkEntities: {id: "darkEntities", name: "Dark Entities", risk: 0.6, damage: {corruption: 5, health: 15}, difficulty: 3}
2. Add defense: {towers: [], detectedThreats: [], lastThreat: 0} to initialGameState
3. Add scout tower building to BUILDINGS in settlement.js
4. Create defense UI in a new section showing potential threats
5. Add functions: detectThreats(), handleThreat(threatId), prepareDefense()
6. Implement threat warning system with 6-hour advance notice
7. Create defense mechanics for each threat type
8. Add defensive equipment types to inventory.js
9. Implement tower upgrades for better detection
10. Add party member assignment to defense duties
```

### 28. Add Basic Combat System
```
Implement simple combat system:
1. Create new file javascript/combat.js with functions:
   - initiateCombat(threatType, partyMembers), resolveCombatRound(), endCombat()
2. Add combat: {inProgress: false, currentThreat: null, assignedDefenders: []} to initialGameState
3. Create combat UI overlay for threat defense
4. Update PartyMember class to add combat stats:
   - attackPower: 10 + random(5)
   - defense: 5 + random(5)
   - accuracy: 0.7 + random(0.2)
5. Add combat equipment types to affect stats
6. Implement combat resolution with 3 phases:
   - Preparation (assign members, use items)
   - Combat (automatic calculation with some randomness)
   - Aftermath (injuries, rewards)
7. Add resource rewards for successful defense
8. Create injury system with medicine healing
9. Implement weapon and armor crafting
10. Add combat training to improve stats
```

### 29. Add Resource Consumption Optimization System
```
Create resource optimization system:
1. Create new file javascript/optimization.js with OPTIMIZATION_UPGRADES:
   - efficientCooking: {id: "efficientCooking", name: "Efficient Cooking", cost: {food: 100, knowledgePoints: 15}, effect: {foodConsumptionReduction: 0.15}}
   - waterRecycling: {id: "waterRecycling", name: "Water Recycling", cost: {water: 100, knowledgePoints: 15}, effect: {waterConsumptionReduction: 0.15}}
   - insulatedShelter: {id: "insulatedShelter", name: "Insulated Shelter", cost: {wood: 120, knowledgePoints: 10}, effect: {energyConsumptionReduction: 0.1}}
   - preservationTechniques: {id: "preservationTechniques", name: "Preservation Techniques", cost: {food: 80, knowledgePoints: 20}, effect: {foodSpoilageReduction: 0.5}}
2. Add optimization: {upgrades: {}, efficiency: {food: 1, water: 1, energy: 1}} to initialGameState
3. Create optimization UI in upgrades panel
4. Add functions: purchaseOptimization(upgradeId), applyOptimizationEffects()
5. Create efficiency display showing current consumption rates
6. Update resource consumption to apply optimization effects
7. Add technology prerequisites for optimization upgrades
8. Implement cumulative optimization effects
9. Create resource consumption breakdown statistics
10. Add resource usage analytics display
```

### 30. Implement Story-Based Special Events
```
Create major story events system:
1. Create new file javascript/storyEvents.js with STORY_EVENTS array:
   - {id: "firstContact", title: "First Contact", trigger: state => state.factions.discovered.length > 0, content: "A faction has noticed your settlement...", choices: [{text: "Approach cautiously", outcome: {reputation: 5}}, {text: "Prepare defenses", outcome: {reputation: -5, corruptionReduction: 2}}]}
   - {id: "darkWhispers", title: "Dark Whispers", trigger: state => state.corruptionLevel >= 25, content: "The darkness is starting to manifest physically...", choices: [{text: "Study it", outcome: {knowledgePoints: 10, corruption: 5}}, {text: "Perform cleansing ritual", outcome: {corruption: -10, resources: {food: -20, water: -20}}}]}
   - {id: "ancientLibrary", title: "Ancient Library", trigger: state => state.expeditions.completedExpeditions >= 10, content: "You've discovered an intact pre-apocalypse library...", choices: [{text: "Recover knowledge", outcome: {knowledgePoints: 30, specialTech: 'preservation'}}, {text: "Search for survival guides", outcome: {resourceGatheringBonus: 0.1}}]}
   - Add 7 more detailed story events with choices and outcomes
2. Add storyEvents: {completed: [], available: []} to initialGameState
3. Create story event UI overlay with atmospheric styling
4. Add functions: checkStoryEvents(), triggerStoryEvent(eventId), resolveStoryEvent(eventId, choiceIndex)
5. Implement story event triggers based on game progress
6. Create meaningful choice outcomes affecting gameplay
7. Add special rewards unique to story events
8. Implement consecutive story chains requiring specific choices
9. Create visual indicators for available story events
10. Add story recap section in game UI
```
