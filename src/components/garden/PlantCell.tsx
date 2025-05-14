
import { useState, useEffect } from 'react';
import { Plant } from '@/types';
import { useGarden } from '@/contexts/GardenContext';

interface PlantCellProps {
  plant: Plant;
}

const PlantCell = ({ plant }: PlantCellProps) => {
  const { setSelectedPlant } = useGarden();
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Extract first character for the cell display
  const displayGlyph = plant.glyph.charAt(0);
  
  // Handle bloom animation
  useEffect(() => {
    // Animate when plant is updated (lastAction changes)
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 1000); // Animation duration
    
    return () => clearTimeout(timer);
  }, [plant.lastAction]);
  
  return (
    <div 
      className={`w-full h-full flex items-center justify-center 
                 ${isAnimating ? 'animate-bloom' : ''} 
                 plant-${plant.color} cursor-pointer`}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedPlant(plant);
      }}
      title={`${plant.glyph} - Click to interact`}
    >
      {displayGlyph}
    </div>
  );
};

export default PlantCell;
