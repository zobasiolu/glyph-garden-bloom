
import { Plant, User, GardenState } from '@/types';

// English words list (shortened for mock)
export const wordsList = [
  "apple", "beach", "cloud", "dream", "earth", 
  "flower", "garden", "heart", "island", "jungle",
  "kindness", "light", "mountain", "nature", "ocean",
  "peace", "quiet", "river", "sunshine", "tree",
  "universe", "valley", "water", "xylophone", "yellow",
  "zephyr", "bloom", "grow", "plant", "seed"
];

// Unicode symbols that could represent plant parts
const plantSymbols = [
  '✿', '❀', '❁', '✾', '✽', '✼', '✻', '✺', '✹', '✸', '✷', 
  '✶', '✵', '✴', '✳', '✲', '✱', '✰', '✯', '✮', '✭', '✬',
  '✫', '✪', '✩', '✧', '✦', '✥', '✤', '✣', '✢', '✡', '❋', 
  '❊', '❉', '❈', '❇', '❆', '❅', '❄', '❃', '❂', '❁', '❀',
  '⚘', '⚜', '☘', '♠', '♣', '♧', '♤', '♧', '♣', '|', '/'
];

const colors: Array<'green' | 'purple' | 'pink' | 'blue'> = ['green', 'purple', 'pink', 'blue'];

// Generate a random plant glyph of length between 3-8
export function generateRandomPlantGlyph(): string {
  const length = Math.floor(Math.random() * 6) + 3; // 3-8 characters
  let glyph = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * plantSymbols.length);
    glyph += plantSymbols[randomIndex];
  }
  
  return glyph;
}

// Initial mock data
let gardenState: GardenState = {
  plants: [],
  rainPool: 100,
  users: []
};

// Mock functions
export const mockDataService = {
  // Get current garden state
  getGardenState: (): GardenState => {
    return gardenState;
  },

  // Add a new user
  addUser: (username: string): User => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      username,
      rainDrops: 10, // Start with 10 raindrops
      lastCollected: Date.now()
    };
    
    gardenState.users.push(newUser);
    return newUser;
  },

  // Collect rain drops (called periodically)
  collectRainDrops: (userId: string): number | null => {
    const user = gardenState.users.find(u => u.id === userId);
    if (!user) return null;
    
    const now = Date.now();
    // Can collect once every minute (60000 ms)
    if (now - user.lastCollected > 60000) {
      const rainCollected = Math.floor(Math.random() * 5) + 1; // 1-5 raindrops
      user.rainDrops += rainCollected;
      user.lastCollected = now;
      return rainCollected;
    }
    
    return 0; // No raindrops collected (too soon)
  },

  // Plant a new plant
  plantNewPlant: (userId: string, x: number, y: number): Plant | null => {
    const user = gardenState.users.find(u => u.id === userId);
    if (!user || user.rainDrops < 5) return null; // Need at least 5 raindrops to plant
    
    // Check if position is already occupied
    const positionOccupied = gardenState.plants.some(p => p.position.x === x && p.position.y === y);
    if (positionOccupied) return null;
    
    // Create new plant
    const newPlant: Plant = {
      id: `plant-${Date.now()}`,
      glyph: generateRandomPlantGlyph(),
      ownerId: userId,
      position: { x, y },
      lastAction: Date.now(),
      color: colors[Math.floor(Math.random() * colors.length)]
    };
    
    // Update user's raindrops
    user.rainDrops -= 5;
    
    // Add plant to garden
    gardenState.plants.push(newPlant);
    
    return newPlant;
  },

  // Water/prune plant (mutate the glyph)
  carePlant: (plantId: string, userId: string, careString: string): Plant | null => {
    if (careString.length > 5) return null; // Max 5 characters for care
    
    const plant = gardenState.plants.find(p => p.id === plantId);
    if (!plant) return null;
    
    const user = gardenState.users.find(u => u.id === userId);
    if (!user || user.rainDrops < 1) return null; // Need at least 1 raindrop
    
    // Update the plant glyph by inserting or replacing characters
    let newGlyph = plant.glyph;
    const insertPosition = Math.floor(Math.random() * newGlyph.length);
    
    // Randomly decide to insert or replace
    if (Math.random() > 0.5 && newGlyph.length < 8) {
      // Insert
      newGlyph = newGlyph.substring(0, insertPosition) + 
                  careString + 
                  newGlyph.substring(insertPosition);
                  
      // Limit to max length of 8
      if (newGlyph.length > 8) {
        newGlyph = newGlyph.substring(0, 8);
      }
    } else {
      // Replace (if there's enough characters to replace)
      if (insertPosition + careString.length <= newGlyph.length) {
        newGlyph = newGlyph.substring(0, insertPosition) + 
                    careString + 
                    newGlyph.substring(insertPosition + careString.length);
      } else {
        // Not enough characters to replace, so just append and cut
        newGlyph = (newGlyph + careString).substring(0, 8);
      }
    }
    
    // Update plant
    plant.glyph = newGlyph;
    plant.lastAction = Date.now();
    
    // Update user's raindrops
    user.rainDrops -= 1;
    
    return plant;
  },
  
  // Check if plants form words and trigger bloom
  checkForWords: (plantId: string): string[] => {
    const plant = gardenState.plants.find(p => p.id === plantId);
    if (!plant) return [];
    
    const formedWords: string[] = [];
    const { x, y } = plant.position;
    
    // Check horizontal words
    const horizontalPlants = gardenState.plants.filter(p => p.position.y === y)
                                               .sort((a, b) => a.position.x - b.position.x);
    
    // Check vertical words
    const verticalPlants = gardenState.plants.filter(p => p.position.x === x)
                                             .sort((a, b) => a.position.y - b.position.y);
    
    // Helper function to check if a sequence forms a word
    const checkWordFormation = (plantSeq: Plant[]): string | null => {
      // Join the glyphs to form a string
      const glyphStr = plantSeq.map(p => p.glyph).join('');
      
      // Check if this matches any word in our word list
      return wordsList.find(word => glyphStr.includes(word)) || null;
    };
    
    // Check sequences around the current plant
    for (let i = 0; i < horizontalPlants.length; i++) {
      for (let j = i; j < horizontalPlants.length; j++) {
        const sequence = horizontalPlants.slice(i, j + 1);
        const word = checkWordFormation(sequence);
        if (word) formedWords.push(word);
      }
    }
    
    for (let i = 0; i < verticalPlants.length; i++) {
      for (let j = i; j < verticalPlants.length; j++) {
        const sequence = verticalPlants.slice(i, j + 1);
        const word = checkWordFormation(sequence);
        if (word) formedWords.push(word);
      }
    }
    
    return [...new Set(formedWords)]; // Remove duplicates
  },
  
  // Get AI fertilizer suggestion
  getFertilizerSuggestion: (plantId: string): string => {
    // This is a simplified version that would normally use more complex logic
    // or an actual AI endpoint to suggest glyphs that might form words
    const randomSuggestions = ['✿❀', '❁✾', '✽✼', '✻✺', '✹✸'];
    return randomSuggestions[Math.floor(Math.random() * randomSuggestions.length)];
  }
};
