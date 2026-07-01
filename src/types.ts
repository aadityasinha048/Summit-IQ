export interface Trek {
  id: string;
  name: string;
  location: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard' | 'Expert';
  distance: number; // in km
  duration: string;
  elevationGain: number; // in meters
  maxAltitude: number; // in meters
  description: string;
  terrain: string[];
  checkpoints: Checkpoint[];
  weather: WeatherInfo;
  riskZones: RiskZone[];
  landmarks: Landmark[];
  bestTime: string;
  fitnessRequirement: string;
  coordinates: { lat: number; lng: number };
  path: Array<[number, number]>;
  imageUrl?: string;
  images: string[];
  routes?: {
    baseCamp: RouteOption;
    summit: RouteOption;
  };
}

export interface RouteOption {
  name: string; // "Base Camp Trail" | "Summit Climb / Peak Ascent"
  difficulty: 'Easy' | 'Moderate' | 'Hard' | 'Expert';
  distance: number;
  duration: string;
  elevationGain: number;
  maxAltitude: number;
  description: string;
  checkpoints: Checkpoint[];
  riskZones: RiskZone[];
  path: Array<[number, number]>;
}

export interface Accommodation {
  id: string;
  name: string;
  type: 'Lodge' | 'Homestay' | 'Tea House' | 'Refugio' | 'Campsite' | 'Alpine Hut';
  priceRange: string; // e.g. "$10 - $25", "Free"
  description: string;
  amenities: string[]; // e.g. ["Solar Charging", "Satellite Wi-Fi", "Hot Food", "Heated Beds"]
  rating: number; // e.g. 4.8
}

export interface Amenity {
  name: string; // e.g. "Community Medical Station", "Helipad Evacuation", "Municipal Cold Water Tap"
  type: 'Medical' | 'Power' | 'Food' | 'Water' | 'Safety' | 'Connectivity';
  description: string;
}

export interface Checkpoint {
  id: string;
  name: string;
  distance: number;
  altitude: number;
  description: string;
  hasWater: boolean;
  hasCampsite: boolean;
  accommodations?: Accommodation[];
  amenities?: Amenity[];
}

export interface WeatherInfo {
  current: {
    temp: number;
    condition: string;
    windSpeed: number;
    visibility: number;
  };
  forecast: Array<{
    day: string;
    temp: number;
    condition: string;
  }>;
  alerts: string[];
}

export interface RiskZone {
  type: 'Landslide' | 'Avalanche' | 'Slippery' | 'Steep';
  severity: 'Low' | 'Medium' | 'High';
  location: string;
}

export interface Landmark {
  name: string;
  type: 'Water' | 'Campsite' | 'Viewpoint' | 'Rest';
  distance: number;
}

export interface UserProfile {
  uid: string;
  name: string;
  experience: string;
  fitnessLevel: string;
}
