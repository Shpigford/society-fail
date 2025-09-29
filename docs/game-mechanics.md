# Society Fail - Game Mechanics Document

## Core Game Philosophy

Society Fail is a post-apocalyptic incremental game focused on survival, community building, and confronting the mysterious force that caused civilization's collapse. The game should maintain a balance between active and idle mechanics, with a dark, mysterious atmosphere that gradually reveals a deeper narrative.

### The Three Ages of Gameplay

The game progresses through three distinct phases, each with unique mechanics and challenges:

#### Age 1: Survival (Days 1-30)
- **Focus**: Basic resource gathering, immediate survival needs
- **Key Systems**: Core resources (food, water, wood), basic party management
- **Atmosphere**: Desperate, uncertain, focused on day-to-day survival
- **Challenge Scale**: Local and immediate (hunger, thirst, shelter)

#### Age 2: Community (Days 31-100)
- **Focus**: Building a sustainable settlement, specialization, exploration
- **Key Systems**: Settlement building, technologies, expeditions, factions
- **Atmosphere**: Cautiously hopeful but discovering darker threats
- **Challenge Scale**: Regional (territory control, faction relations, The Darkness)

#### Age 3: Reclamation (Days 101+)
- **Focus**: Advanced technology, understanding The Darkness, legacy
- **Key Systems**: Advanced research, artifacts, corruption manipulation
- **Atmosphere**: Revelation, confrontation with the truth
- **Challenge Scale**: Global (confronting The Darkness, determining the future)

### Core Loops

1. **Short Loop (minutes)**: Gather resources → Manage party needs → Assign tasks
2. **Medium Loop (hours)**: Build structures → Research technology → Conduct expeditions
3. **Long Loop (days)**: Expand territory → Develop faction relations → Confront The Darkness
4. **Meta Loop (full playthrough)**: Complete a cycle → Reset with memory fragments → Start new cycle with bonuses

## Resource Systems

### Primary Resources (Tier 1)

| Resource | Gathering Method | Primary Use | Storage |
|----------|------------------|-------------|---------|
| Food | Gather, Farm, Hunt | Party hunger, Crafting | Spoils over time |
| Water | Collect, Well | Party thirst, Farming | Limited base capacity |
| Wood | Chop, Lumber Mill | Buildings, Tools | Standard storage |

### Secondary Resources (Tier 2)

| Resource | Acquisition | Primary Use | Notes |
|----------|-------------|-------------|-------|
| Knowledge Points | Research, Expeditions, Actions | Technology, Special abilities | Non-physical, doesn't spoil |
| Medicine | Crafting, Expeditions | Healing, Disease prevention | Crafted from herbs and food |
| Electricity | Power generators | Advanced buildings | Cannot be stored long-term |
| Scrap Metal | Expeditions, Ruins | Advanced tools, Buildings | Found in ruins and city expeditions |
| Fuel | Expeditions, Refining | Generators, Special equipment | Limited uses, high value |

### Advanced Resources (Tier 3)

| Resource | Acquisition | Primary Use | Notes |
|----------|-------------|-------------|-------|
| Artifacts | Rare expedition finds | Unique abilities, Research | One-of-a-kind items with special powers |
| Corruption Essence | Darkness events, Rituals | Corruption manipulation, Dark technologies | Dangerous to accumulate |
| Memory Fragments | Cycle completion | Permanent upgrades | Meta-currency for prestige system |

### Resource Conversion

Resources should have conversion paths but with inefficiency to prevent trivial solutions:
- Food → Medicine (2:1 ratio)
- Wood → Fuel (3:1 ratio)
- Corruption → Knowledge (5:1 ratio, with risk)

### Resource Consumption Rates

Default consumption rates (per party member, per day):
- Food: 8 units
- Water: 6 units
- Wood (for heating/cooking): 2 units

These rates are affected by:
- Seasons (winter increases consumption)
- Technologies (efficiency upgrades reduce consumption)
- Party member traits (some consume more/less)
- Building types (better shelters reduce consumption)

## Party Member System

### Core Attributes

Each party member has the following attributes:
- Health (0-100): Physical wellbeing
- Hunger (0-100): Food satiation
- Thirst (0-100): Water satiation
- Energy (0-100): Action capacity
- Morale (0-100): Mental wellbeing
- Corruption (0-100): Influence of The Darkness

### Specializations

Party members can specialize in one of the following roles:

| Specialization | Primary Bonus | Secondary Effect | Special Ability |
|----------------|---------------|------------------|-----------------|
| Gatherer | +25% resource collection | +10% expedition loot | Quick Gathering (1-hour action for resources) |
| Builder | -20% wood cost for buildings | +10% building quality | Rapid Construction (speed up current building) |
| Researcher | +0.5 knowledge points/hour | +15% research speed | Insight (reveal random technology) |
| Fighter | +25% combat effectiveness | -10% expedition risk | Protect (reduce party damage in combat) |
| Medic | +30% medicine effectiveness | +2 health regen/day | Emergency Treatment (instant partial heal) |

### Traits System

Each party member has 1-2 traits randomly assigned at creation:

**Positive Traits:**
- Strong Back: +20% wood gathering
- Quick Learner: +30% knowledge gain
- Green Thumb: +25% farming yield
- Cautious: -15% expedition risk
- Resourceful: -10% resource consumption
- Hardy: +10% health regeneration
- Night Owl: +25% efficiency at night
- Survivor: +20% corruption resistance
- Fast Learner: +15% skill gain rate
- Leader: +5% efficiency to all party members

**Negative Traits:**
- Heavy Sleeper: +25% energy recovery time
- Big Appetite: +20% food consumption
- Pessimist: -10% morale for nearby members
- Weak Immune System: +25% illness chance
- Nervous: +15% corruption gain
- Clumsy: 5% chance to break tools
- Night Blind: -30% efficiency at night
- Wasteful: +15% resource consumption

Traits can evolve based on actions performed:
- Performing an action 50+ times can gain related positive traits
- Severe negative events can cause new negative traits
- Some technologies can remove negative traits

### Morale System

Morale affects overall efficiency:
- 76-100: +15% all actions, +5% corruption resistance
- 51-75: No modifier
- 26-50: -10% all actions, -5% corruption resistance
- 0-25: -25% all actions, -15% corruption resistance, 5% chance to refuse actions

Morale is affected by:
- Food quality and variety
- Shelter comfort
- Social activities
- Party member deaths
- Successful/failed expeditions
- Corruption level
- Season and weather

## Building and Settlement System

### Settlement Grid

The settlement exists on an expandable grid system:
- Initial grid is 5x5
- Can expand to 10x10 with appropriate technologies
- Different terrain types provide bonuses to certain buildings
- Adjacent buildings can provide synergy bonuses

### Building Categories

| Category | Function | Examples | Notes |
|----------|----------|----------|-------|
| Resource Production | Generate resources | Farm, Lumber Mill, Well | Core economy buildings |
| Storage | Increase resource capacity | Warehouse, Water Tower, Silo | Protect from spoilage/loss |
| Research | Knowledge generation | Library, Laboratory, Observatory | Enable technology advancement |
| Crafting | Create items | Workshop, Forge, Herbalist | Tool and equipment production |
| Living | Party member buffs | Dormitory, Kitchen, Recreation Room | Improve morale and recovery |
| Defense | Protection from threats | Wall, Tower, Traps | Reduce attack damage |
| Special | Unique functions | Ritual Circle, Radio Tower, Artifact Shrine | Unlock special abilities |

### Building Quality

Buildings have quality levels (1-3) that affect their efficiency:
- Level 1: Base functionality
- Level 2: +25% efficiency, +durability
- Level 3: +50% efficiency, +special ability

Quality is determined by:
- Builder specialization
- Tools used in construction
- Materials quality (standard vs. premium)

### Building Maintenance

Buildings require maintenance or they degrade:
- Wood buildings: 5% durability loss per day
- Stone buildings: 2% durability loss per day
- Metal buildings: 1% durability loss per day
- Degraded buildings operate at reduced efficiency
- Fully degraded buildings become unusable until repaired

## Research and Technology System

### Knowledge Points

Knowledge Points (KP) are gained through:
- Research actions (dedicated study)
- Expedition discoveries
- Random chance during resource gathering (5%)
- Reading recovered books
- Analyzing artifacts

### Technology Categories

| Category | Focus | Example Technologies | Unlock Potential |
|----------|-------|----------------------|------------------|
| Survival | Resource efficiency | Water Purification, Food Preservation | Reduced consumption |
| Construction | Building improvements | Better Construction, Reinforcement | Stronger, more efficient buildings |
| Medicine | Health and healing | Herbal Medicine, First Aid | Improved healing, disease prevention |
| Exploration | Expedition improvements | Mapping, Scouting Techniques | Safer, more rewarding expeditions |
| Power | Energy generation | Windmill, Water Wheel, Generator | Electricity for advanced buildings |
| Defense | Protection | Traps, Watchtower, Reinforced Walls | Reduced threat damage |
| Darkness | Corruption interaction | Corruption Containment, Dark Energy | Manipulation of The Darkness |

### Research Process

Technologies require:
- Prerequisite technologies (tech tree structure)
- Knowledge Point cost
- Sometimes physical resources
- Research time (hours/days)

Research can be accelerated by:
- Multiple researchers working together
- Reference materials from expeditions
- Specialized research buildings

## Expedition System

### Expedition Locations

Locations are discovered through:
- Exploration actions
- Scout tower detection
- Information from factions
- Story progression

Each location has:
- Distance (affecting time required)
- Difficulty rating (affecting risk)
- Resource types available
- Special discovery chance
- Encounter probability

### Expedition Process

1. **Planning Phase**
   - Select location
   - Assign party members
   - Allocate supplies (food, water, medicine)
   - Select equipment

2. **Journey Phase**
   - Automatic progression
   - Random encounters based on location
   - Resource consumption during travel

3. **Exploration Phase**
   - Resource gathering
   - Special discoveries
   - Location-specific events

4. **Return Phase**
   - Return journey (can have its own encounters)
   - Delivery of gathered resources

### Expedition Outcomes

Successful expeditions provide:
- Base resources determined by location
- Bonus resources based on party skills and equipment
- Chance for special discoveries:
  - New locations
  - Artifacts
  - Technology insights
  - New party members
  - Faction encounters

Failed expeditions result in:
- Party member injuries or death
- Loss of supplied resources
- Possible corruption increase
- Morale penalty

## The Darkness and Corruption

### The Darkness

The Darkness is the central antagonistic force:
- Caused the apocalypse (revealed through story)
- Gradually encroaches on the settlement
- Manifests through corruption and events
- Has physical presence in later game stages
- Can be understood and potentially harnessed

### Corruption Mechanics

Corruption accumulates from:
- Time passing (background rate)
- Proximity to corrupted areas
- Using certain technologies
- Failed rituals
- Some expedition encounters

Corruption effects:
- 0-25: Minor resource penalties (-5% efficiency)
- 26-50: Moderate penalties (-15% efficiency, +10% consumption)
- 51-75: Severe penalties (-30% efficiency, +25% consumption, occasional whispers)
- 76-100: Critical (random party member corruption, building degradation, The Darkness manifestations)

### Corruption Resistance

Corruption can be resisted/reduced through:
- Rituals (temporary reduction)
- Purification technologies (ongoing reduction)
- Artifacts (corruption shielding)
- Party member traits (individual resistance)
- Special buildings (area protection)

### The Whispers

The Whispers are communications from The Darkness:
- Appear more frequently at higher corruption
- Provide cryptic story information
- Sometimes offer corrupted "deals" (benefits with hidden costs)
- Can influence party member behavior
- Eventually form a coherent narrative about The Darkness

## Combat and Defense System

### Threat Types

| Threat Type | Primary Danger | Defense Type | Reward |
|-------------|----------------|--------------|--------|
| Hostile Survivors | Resource theft | Walls, Traps | Captured supplies |
| Corrupted Animals | Party injury | Hunting defenses | Food, rare materials |
| The Corrupted | Corruption increase | Purification defenses | Corruption essence |
| Dark Entities | Multiple effects | Specialized barriers | Artifacts, knowledge |

### Defense Mechanics

Defense consists of:
- Passive defenses (walls, traps)
- Active defense (party members assigned to defense)
- Special defenses (technological or artifact-based)

Defense effectiveness determined by:
- Defense structure quality and maintenance
- Defender combat abilities
- Equipment quality
- Preparation time (if threat was detected in advance)

### Combat Resolution

Combat occurs in phases:
1. **Preparation** - Assign defenders, activate defenses
2. **Engagement** - Automatic resolution with some interactive choices
3. **Resolution** - Determine outcomes, injuries, rewards

Combat factors:
- Party member combat stats
- Equipment bonuses
- Terrain advantages
- Special abilities

## Faction System

### Faction Types

The game features several distinct survivor groups:
- **The Survivors**: Pragmatic group focused on day-to-day survival (trade focus)
- **The Scientists**: Knowledge-focused faction studying the apocalypse (technology focus)
- **The Spiritualists**: Believe the apocalypse has mystical significance (ritual focus)
- **The Militarists**: Security-focused group prioritizing defense (combat focus)
- **The Reclamationists**: Focused on rebuilding civilization (building focus)

### Reputation System

Reputation levels with each faction:
- Hostile (-100 to -51): Attack on sight, no interaction
- Wary (-50 to -1): Limited trade, high prices, no cooperation
- Neutral (0 to 50): Standard trade, occasional information sharing
- Friendly (51 to 100): Favorable trade rates, cooperation, aid
- Allied (101+): Shared resources, defense pacts, special technologies

### Faction Interactions

Interactions available based on reputation:
- Trade (different specialties per faction)
- Information exchange (location discovery)
- Joint expeditions (shared risk/reward)
- Resource assistance during crises
- Technology exchange
- Defense cooperation against The Darkness

## Weather and Season System

### Seasons

Four seasons, each lasting 20 game days:
- **Spring**: +20% food/water gathering, -10% wood gathering, occasional rain
- **Summer**: +30% food gathering, -20% water gathering, heat waves
- **Fall**: +10% all resource gathering, lower corruption growth, occasional storms
- **Winter**: -30% food gathering, -10% water gathering, +30% wood consumption, cold snaps

### Weather Types

Weather changes every 6-12 hours with seasonal weighting:
- **Clear**: No modifiers (default)
- **Rainy**: +30% water gathering, -20% wood gathering, +20% farming speed
- **Windy**: -10% food gathering, +30% electricity from windmills
- **Foggy**: -15% food gathering, +10% expedition risk
- **Stormy**: -25% all gathering, +50% water gathering, +20% expedition risk

### Environmental Effects

Special environmental conditions:
- **Heat Wave**: +50% water consumption, -10% energy recovery
- **Cold Snap**: +50% wood consumption, -20% food production
- **Drought**: -50% water gathering, -30% farming speed
- **Flood**: +100% water gathering, -50% food gathering, damage to some buildings
- **Radiation Storm**: +5 corruption, party members must shelter or take damage

## Cycles and Prestige System

### Cycle Completion

A cycle can be completed through:
- Reaching day 100+ and choosing to reset
- Achieving one of the victory conditions
- Total party death (partial rewards only)

### Memory Fragments

Memory Fragments (MF) are earned based on:
- Days survived (0.5 MF per day)
- Knowledge gained (0.2 MF per point)
- Corruption resisted (0.1 MF per point)
- Technologies researched (2 MF per technology)
- Artifacts discovered (5 MF per artifact)
- Victory condition achieved (25-100 MF based on type)

### Permanent Upgrades

Memory Fragments can purchase permanent upgrades:
- **Resource Memory**: +20% starting resources per level
- **Gathering Techniques**: +10% gathering efficiency per level
- **Expedition Experience**: +15% expedition rewards per level
- **Corruption Resistance**: -10% corruption gain per level
- **Knowledge Retention**: Start with +5 knowledge per level
- **Settlement Planning**: Start with a basic building
- **Party Leadership**: Start with an additional party member
- **Technology Insight**: Start with a random technology
- **Artifact Resonance**: +10% chance to find artifacts
- **Whisper Comprehension**: More informative whispers

### Subsequent Playthroughs

Each new cycle can feature:
- Different starting conditions
- Alternative party compositions
- Unique challenges based on previous choices
- Advanced starting point (skip early game after multiple completions)
- Progressive narrative elements

## Victory Conditions

Multiple distinct paths to "winning" a cycle:

### Unity Path
- **Goal**: Unite all factions against The Darkness
- **Requirements**: Allied status with all factions, build Unity Complex
- **Challenge**: Balancing competing faction interests
- **Reward**: Maximum Memory Fragments, unique "Diplomat" bonus

### Technology Path
- **Goal**: Develop technology to counter The Darkness
- **Requirements**: Research all Darkness technologies, build Purification Array
- **Challenge**: Managing corruption while researching dark technologies
- **Reward**: High Memory Fragments, unique "Scientist" bonus

### Transcendence Path
- **Goal**: Understand and transform The Darkness
- **Requirements**: Collect all artifacts, perform the Final Ritual
- **Challenge**: Very high corruption risk, difficult artifact collection
- **Reward**: High Memory Fragments, unique "Enlightened" bonus

### Exodus Path
- **Goal**: Escape to a new, uncorrupted region
- **Requirements**: Build Expedition Vehicle, gather significant supplies
- **Challenge**: Resource-intensive, requires extensive exploration
- **Reward**: Medium Memory Fragments, unique "Pioneer" bonus

## Game Balance Principles

### Resource Equilibrium
- Resources should maintain value throughout all game phases
- New resources introduced as player masters current systems
- Conversion inefficiencies prevent trivial solutions
- Multiple paths to acquire each resource type

### Risk vs. Reward
- Higher risk activities yield better rewards
- Safety mechanisms available at efficiency cost
- Emergency measures for critical situations
- Strategic sacrifice opportunities

### Meaningful Decisions
- Choices with both benefits and drawbacks
- Mutually exclusive options that define playstyle
- Long-term consequences for short-term decisions
- Hidden information requiring exploration to discover optimal strategies

### Pacing Guidelines
- Early game (days 1-10): 5-10 minutes real time
- Mid game (days 11-50): 1-2 hours real time
- Late game (days 51-100): 3-5 hours real time
- End game (days 100+): 5+ hours real time
- Full cycle completion: 8-12 hours for experienced players

### Scaling Formulas

**Resource Gathering Base Rates**:
- Food: 5 + (day / 10) per action
- Water: 4 + (day / 12) per action
- Wood: 3 + (day / 15) per action

**Resource Consumption Base Rates**:
- Food: 2 + (party_size * 0.8) per hour
- Water: 1.5 + (party_size * 0.6) per hour
- Wood: 1 + (party_size * 0.3) per hour

**Corruption Growth**:
- Base rate: 0.1 per hour
- Modified by: party_size * 0.02 + buildings * 0.01
- Seasonal modifiers: Winter (+25%), Summer (+10%), Fall (-10%), Spring (0%)

**Expedition Rewards**:
- Base resources: location_base * (1 + (day / 100))
- Special find chance: location_chance * (1 + (knowledge / 500))

## Technical Implementation Guidelines

### State Management

The game state should be stored in a structured object:
```javascript
gameState = {
  // Core game state
  version: 5,
  day: 1,
  hour: 1,
  difficulty: "medium",

  // Resources
  resources: {
    food: 50,
    water: 50,
    wood: 50,
    knowledgePoints: 0,
    medicine: 0,
    electricity: 0,
    scrapMetal: 0,
    fuel: 0
  },

  // Resource caps
  resourceCaps: {
    food: 100,
    water: 100,
    wood: 100,
    knowledgePoints: 50,
    medicine: 20,
    electricity: 10,
    scrapMetal: 50,
    fuel: 10
  },

  // Advanced resources
  advancedResources: {
    artifacts: [],
    corruptionEssence: 0,
    memoryFragments: 0
  },

  // Party
  party: [], // Array of PartyMember objects

  // Settlement
  settlement: {
    buildings: [], // Array of Building objects
    grid: [], // 2D array representing the settlement layout
    unlocked: false
  },

  // Systems
  corruption: {
    level: 0,
    maxLevel: 100,
    rate: 0.1,
    resistance: 0
  },

  weather: {
    current: "clear",
    forecast: [],
    season: "spring",
    seasonDay: 1
  },

  expeditions: {
    active: [],
    available: [],
    completed: 0,
    discoveredLocations: []
  },

  research: {
    technologies: {},
    inProgress: null
  },

  factions: {
    discovered: [],
    reputations: {}
  },

  // Game progression
  gameAge: 1, // 1, 2, or 3
  prestige: {
    cyclesCompleted: 0,
    totalMemoryFragments: 0,
    permanentUpgrades: {}
  },

  // Statistics tracking
  stats: {
    totalResourcesGathered: {},
    totalActionsPerformed: {},
    totalBuildingsBuilt: 0,
    totalExpeditionsSent: 0,
    totalCorruptionResisted: 0,
    // etc.
  }
};
```

### Module Structure

Organize code into focused modules:
- `core.js` - Main game loop and initialization
- `resources.js` - Resource management functions
- `party.js` - Party member management
- `settlement.js` - Building and territory systems
- `research.js` - Technology and knowledge systems
- `expeditions.js` - Expedition and exploration mechanics
- `darkness.js` - Corruption and The Darkness mechanics
- `weather.js` - Season and weather systems
- `factions.js` - Faction relationships and interactions
- `combat.js` - Threat and defense systems
- `events.js` - Random and story events
- `prestige.js` - Cycle completion and Memory Fragments
- `storage.js` - Save/load functionality
- `ui.js` - User interface rendering and updates

### Scaling Considerations

As the game progresses:
- Use exponential or polynomial scaling for costs
- Apply diminishing returns to efficiency upgrades
- Ensure late-game activities remain meaningful
- Balance active and idle gameplay throughout progression
- Introduce higher tiers of content at appropriate intervals

### User Interface Guidelines

- Early-game UI should be simple and focused on basic needs
- New UI elements should be introduced gradually as systems unlock
- Critical information should always be visible
- Use consistent color coding:
  - Food: Yellow/Orange
  - Water: Blue
  - Wood: Brown/Green
  - Knowledge: Purple
  - Corruption: Dark Purple/Black
  - Positive effects: Green
  - Negative effects: Red
- Provide tooltips for all gameplay elements
- Design for both short and long play sessions

## Narrative Development

### Story Progression

The narrative unfolds through:
- The Whispers (corrupted messages)
- Dream sequences
- Expedition discoveries
- Artifact analysis
- Faction information
- Research breakthroughs

### Core Narrative Themes

- The nature of civilization and its fragility
- Humanity's relationship with knowledge and technology
- The balance between survival and progress
- The corruption of power and its consequences
- Memory and identity across time

### Story Pacing

- Early revelations should be cryptic and mysterious
- Mid-game should clarify the apocalypse's immediate causes
- Late-game reveals the true nature of The Darkness
- Final revelations depend on the player's chosen victory path
- Each cycle adds depth to the meta-narrative

## Implementation Priority

When implementing new features, follow this priority order:

1. Core mechanics that enhance the fundamental gameplay loop
2. Systems that extend game longevity and replayability
3. Features that improve strategic depth and player choice
4. Content that enriches the narrative and atmosphere
5. Quality-of-life improvements and UI enhancements
