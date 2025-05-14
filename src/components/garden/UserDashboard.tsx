
import { useState } from 'react';
import { useGarden } from '@/contexts/GardenContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const UserDashboard = () => {
  const { currentUser, login, collectRain, isCollectingRain } = useGarden();
  const [usernameInput, setUsernameInput] = useState('');
  
  const handleLogin = () => {
    if (usernameInput.trim()) {
      login(usernameInput);
      setUsernameInput('');
    }
  };
  
  // Calculate time until next collection
  const getNextCollectionTime = () => {
    if (!currentUser) return null;
    
    const lastCollected = currentUser.lastCollected;
    const now = Date.now();
    const timeSinceCollection = now - lastCollected;
    const collectionInterval = 60000; // 1 minute in milliseconds
    
    if (timeSinceCollection >= collectionInterval) {
      return 'Available now';
    }
    
    const timeRemaining = collectionInterval - timeSinceCollection;
    const seconds = Math.ceil(timeRemaining / 1000);
    return `${seconds} seconds`;
  };
  
  return (
    <Card className="w-full bg-terminal-bg border-terminal-softGray text-white">
      <CardHeader>
        <CardTitle className="text-terminal-softBlue">
          {currentUser ? `Welcome, ${currentUser.username}!` : 'Login to Glyph Garden'}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {!currentUser ? (
          <div className="flex space-x-2">
            <Input
              placeholder="Enter username"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="bg-terminal-bg border-terminal-softGray text-white"
            />
            <Button 
              onClick={handleLogin}
              className="bg-terminal-softBlue text-terminal-bg hover:bg-terminal-softBlue/80"
            >
              Login
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-terminal-softBlue">Raindrops:</span>
              <span className="text-terminal-softBlue text-xl font-bold">
                {currentUser.rainDrops}
              </span>
            </div>
            
            <Button 
              onClick={collectRain}
              disabled={isCollectingRain || getNextCollectionTime() !== 'Available now'}
              className="w-full bg-terminal-softBlue text-terminal-bg hover:bg-terminal-softBlue/80 disabled:bg-gray-700"
            >
              {isCollectingRain ? 'Collecting...' : `Collect Rain (${getNextCollectionTime()})`}
            </Button>
            
            <div className="text-xs text-terminal-softGray">
              <p>• Plant a new glyph: 5 raindrops</p>
              <p>• Care for a plant: 1 raindrop</p>
              <p>• Form words for bonus raindrops!</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserDashboard;
