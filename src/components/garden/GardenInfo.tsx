
import { useGarden } from '@/contexts/GardenContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const GardenInfo = () => {
  const { garden } = useGarden();
  
  return (
    <Card className="w-full bg-terminal-bg border-terminal-softGray text-white">
      <CardHeader>
        <CardTitle className="text-terminal-softPink">
          Glyph Garden Stats
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-terminal-softGray">Plants:</span>
            <span className="text-terminal-softPink">{garden.plants.length}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-terminal-softGray">Gardeners:</span>
            <span className="text-terminal-softPink">{garden.users.length}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-terminal-softGray">Global Rain Pool:</span>
            <span className="text-terminal-softPink">{garden.rainPool}</span>
          </div>
          
          <div className="mt-4 text-xs text-terminal-softGray">
            <p>Click on any cell to plant a new glyph organism.</p>
            <p>Click on a plant to care for it and help it grow.</p>
            <p>Forming words between plants creates bloom effects!</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GardenInfo;
