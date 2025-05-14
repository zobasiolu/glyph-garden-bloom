
import { useState } from 'react';
import { useGarden } from '@/contexts/GardenContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

const PlantDetails = () => {
  const { selectedPlant, setSelectedPlant, carePlant, fertilizePlant, garden } = useGarden();
  const [careInput, setCareInput] = useState('');
  const [fertilizeHint, setFertilizeHint] = useState('');
  
  if (!selectedPlant) return null;
  
  // Find the owner details
  const owner = garden.users.find(user => user.id === selectedPlant.ownerId);
  
  const handleCarePlant = () => {
    if (careInput.trim()) {
      carePlant(selectedPlant.id, careInput);
      setCareInput('');
    }
  };
  
  const handleGetHint = () => {
    const hint = fertilizePlant(selectedPlant.id);
    setFertilizeHint(hint);
  };
  
  return (
    <Card className="w-full bg-terminal-bg border-terminal-softGray text-white">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className={`text-terminal-${selectedPlant.color}`}>
            Plant Details
          </span>
          <Button 
            variant="ghost" 
            className="text-terminal-softGray"
            onClick={() => setSelectedPlant(null)}
          >
            Close
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-center text-2xl plant-${selectedPlant.color}">
          {selectedPlant.glyph}
        </div>
        
        <div className="text-sm text-terminal-softGray">
          <p>Owner: {owner?.username || 'Unknown'}</p>
          <p>Last Tended: {new Date(selectedPlant.lastAction).toLocaleString()}</p>
        </div>
        
        <div className="flex space-x-2">
          <Input
            placeholder="Care string (max 5 chars)"
            maxLength={5}
            value={careInput}
            onChange={(e) => setCareInput(e.target.value)}
            className="bg-terminal-bg border-terminal-softGray text-white"
          />
          <Button 
            onClick={handleCarePlant}
            className="bg-terminal-softGreen text-terminal-bg hover:bg-terminal-softGreen/80"
          >
            Tend
          </Button>
        </div>
        
        <div>
          <Button 
            variant="outline"
            onClick={handleGetHint}
            className="w-full border-terminal-softPurple text-terminal-softPurple hover:bg-terminal-softPurple/20"
          >
            Get Fertilizer Suggestion
          </Button>
          
          {fertilizeHint && (
            <div className="mt-2 p-2 bg-terminal-bg border border-terminal-softPurple rounded">
              <p className="text-terminal-softPurple">Suggested: {fertilizeHint}</p>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="text-xs text-terminal-softGray">
        <p>Forming words with adjacent plants triggers bloom animations and rewards!</p>
      </CardFooter>
    </Card>
  );
};

export default PlantDetails;
