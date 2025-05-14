
import { useState } from 'react';
import GardenGrid from './GardenGrid';
import UserDashboard from './UserDashboard';
import PlantDetails from './PlantDetails';
import GardenInfo from './GardenInfo';
import CodeRain from './CodeRain';
import { useGarden } from '@/contexts/GardenContext';

const Garden = () => {
  const { selectedPlant, isCollectingRain } = useGarden();
  
  return (
    <div className="min-h-screen bg-terminal-bg p-4 font-mono">
      <header className="mb-6 text-center">
        <h1 className="text-3xl text-terminal-softGreen">Glyph Garden</h1>
        <p className="text-terminal-softGray">A cooperative ASCII plant terrarium</p>
      </header>
      
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Left sidebar */}
        <div className="md:col-span-1 space-y-4">
          <UserDashboard />
          <GardenInfo />
        </div>
        
        {/* Main garden grid */}
        <div className="md:col-span-2">
          <GardenGrid gridSize={30} />
        </div>
        
        {/* Right sidebar - Plant details */}
        <div className="md:col-span-1">
          {selectedPlant && <PlantDetails />}
        </div>
      </div>
      
      {/* Overlay code rain animation when collecting */}
      <CodeRain isActive={isCollectingRain} />
    </div>
  );
};

export default Garden;
