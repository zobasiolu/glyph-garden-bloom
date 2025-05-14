
import { GardenProvider } from '@/contexts/GardenContext';
import Garden from '@/components/garden/Garden';

const Index = () => {
  return (
    <GardenProvider>
      <Garden />
    </GardenProvider>
  );
};

export default Index;
