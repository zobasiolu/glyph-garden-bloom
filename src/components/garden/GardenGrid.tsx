
import { useState } from 'react';
import { useGarden } from '@/contexts/GardenContext';
import { Plant } from '@/types';
import PlantCell from './PlantCell';

interface GardenGridProps {
  gridSize: number;
}

const GardenGrid = ({ gridSize = 30 }: GardenGridProps) => {
  const { garden, plantNewPlant } = useGarden();
  
  // Create a 2D grid representation
  const grid: (Plant | null)[][] = Array(gridSize).fill(null)
    .map(() => Array(gridSize).fill(null));
  
  // Fill the grid with existing plants
  garden.plants.forEach(plant => {
    const { x, y } = plant.position;
    if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
      grid[y][x] = plant;
    }
  });
  
  // Handle cell click to plant a new plant
  const handleCellClick = (x: number, y: number) => {
    // Only plant if cell is empty
    if (!grid[y][x]) {
      plantNewPlant(x, y);
    }
  };
  
  return (
    <div className="overflow-auto p-4 border border-terminal-softGray rounded bg-terminal-bg">
      <div className="grid gap-0 w-fit mx-auto" 
           style={{ 
             gridTemplateColumns: `repeat(${gridSize}, 1.5rem)`,
             gridTemplateRows: `repeat(${gridSize}, 1.5rem)` 
           }}>
        {grid.map((row, y) => 
          row.map((cell, x) => (
            <div 
              key={`cell-${x}-${y}`}
              className="border border-terminal-bg hover:border-terminal-softGray cursor-pointer glyph-cell"
              onClick={() => handleCellClick(x, y)}
            >
              {cell ? (
                <PlantCell plant={cell} />
              ) : (
                <span className="text-gray-700">·</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GardenGrid;
