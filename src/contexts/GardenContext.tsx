
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Plant, User, GardenState } from '@/types';
import { mockDataService } from '@/services/mockDataService';
import { useToast } from '@/components/ui/use-toast';

interface GardenContextValue {
  garden: GardenState;
  currentUser: User | null;
  login: (username: string) => void;
  plantNewPlant: (x: number, y: number) => void;
  carePlant: (plantId: string, careString: string) => void;
  collectRain: () => void;
  isCollectingRain: boolean;
  fertilizePlant: (plantId: string) => string;
  selectedPlant: Plant | null;
  setSelectedPlant: (plant: Plant | null) => void;
}

const GardenContext = createContext<GardenContextValue | undefined>(undefined);

export function GardenProvider({ children }: { children: ReactNode }) {
  const [garden, setGarden] = useState<GardenState>({ plants: [], rainPool: 100, users: [] });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [isCollectingRain, setIsCollectingRain] = useState(false);
  const { toast } = useToast();

  // Initial fetch of garden data
  useEffect(() => {
    const gardenData = mockDataService.getGardenState();
    setGarden(gardenData);
  }, []);

  // Set up interval for rain collection
  useEffect(() => {
    if (!currentUser) return;
    
    const interval = setInterval(() => {
      collectRain();
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [currentUser]);

  // Login function
  const login = (username: string) => {
    const user = mockDataService.addUser(username);
    setCurrentUser(user);
    
    // Update the garden state to include the new user
    setGarden(prev => ({
      ...prev,
      users: [...prev.users, user]
    }));
    
    toast({
      title: "Welcome to Glyph Garden!",
      description: `You've started with ${user.rainDrops} raindrops.`,
    });
  };

  // Plant a new plant
  const plantNewPlant = (x: number, y: number) => {
    if (!currentUser) {
      toast({
        title: "Cannot plant",
        description: "Please log in first.",
        variant: "destructive"
      });
      return;
    }
    
    const newPlant = mockDataService.plantNewPlant(currentUser.id, x, y);
    
    if (newPlant) {
      setGarden(prev => ({
        ...prev,
        plants: [...prev.plants, newPlant]
      }));
      
      // Update current user's raindrops
      setCurrentUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          rainDrops: prev.rainDrops - 5
        };
      });
      
      toast({
        title: "Plant created!",
        description: "You've planted a new glyph organism.",
      });
    } else {
      toast({
        title: "Cannot plant",
        description: "Not enough raindrops or position is occupied.",
        variant: "destructive"
      });
    }
  };

  // Care for a plant (water/prune)
  const carePlant = (plantId: string, careString: string) => {
    if (!currentUser || careString.length > 5) {
      toast({
        title: "Cannot care for plant",
        description: "Please log in and use 5 characters or less.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedPlant = mockDataService.carePlant(plantId, currentUser.id, careString);
    
    if (updatedPlant) {
      // Update garden plants
      setGarden(prev => ({
        ...prev,
        plants: prev.plants.map(p => p.id === updatedPlant.id ? updatedPlant : p)
      }));
      
      // Update current user's raindrops
      setCurrentUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          rainDrops: prev.rainDrops - 1
        };
      });
      
      // Check if this forms any words
      const formedWords = mockDataService.checkForWords(updatedPlant.id);
      
      if (formedWords.length > 0) {
        // Apply bloom animation via CSS (handled in component)
        toast({
          title: "Word Formed!",
          description: `You've created the word: ${formedWords[0]}! Bonus raindrops awarded.`,
        });
        
        // Give bonus raindrops
        setCurrentUser(prev => {
          if (!prev) return null;
          return {
            ...prev,
            rainDrops: prev.rainDrops + formedWords.length * 3
          };
        });
      }
    } else {
      toast({
        title: "Cannot care for plant",
        description: "Not enough raindrops.",
        variant: "destructive"
      });
    }
  };

  // Collect rain
  const collectRain = () => {
    if (!currentUser) return;
    
    setIsCollectingRain(true);
    
    // Simulate a delay for the collection animation
    setTimeout(() => {
      const collected = mockDataService.collectRainDrops(currentUser.id);
      setIsCollectingRain(false);
      
      if (collected && collected > 0) {
        setCurrentUser(prev => {
          if (!prev) return null;
          return {
            ...prev,
            rainDrops: prev.rainDrops + collected,
            lastCollected: Date.now()
          };
        });
        
        toast({
          title: "Rain Collected!",
          description: `You've collected ${collected} raindrops.`,
        });
      }
    }, 1500);
  };

  // Get fertilizer suggestion
  const fertilizePlant = (plantId: string) => {
    return mockDataService.getFertilizerSuggestion(plantId);
  };

  return (
    <GardenContext.Provider
      value={{
        garden,
        currentUser,
        login,
        plantNewPlant,
        carePlant,
        collectRain,
        isCollectingRain,
        fertilizePlant,
        selectedPlant,
        setSelectedPlant
      }}
    >
      {children}
    </GardenContext.Provider>
  );
}

export function useGarden() {
  const context = useContext(GardenContext);
  if (context === undefined) {
    throw new Error('useGarden must be used within a GardenProvider');
  }
  return context;
}
