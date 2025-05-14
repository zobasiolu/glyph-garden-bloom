
export interface Plant {
  id: string;
  glyph: string;
  ownerId: string;
  position: { x: number; y: number };
  lastAction: number; // timestamp
  color: 'green' | 'purple' | 'pink' | 'blue';
}

export interface User {
  id: string;
  username: string;
  rainDrops: number;
  lastCollected: number; // timestamp for code rain collection
}

export interface GardenState {
  plants: Plant[];
  rainPool: number;
  users: User[];
}
