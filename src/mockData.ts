import { Trek, Accommodation, Amenity, Checkpoint, RouteOption } from './types';

const RAW_MOCK_TREKS: Trek[] = [
  {
    id: '1',
    name: 'Everest Base Camp',
    location: 'Nepal',
    difficulty: 'Hard',
    distance: 130,
    duration: '14 Days',
    elevationGain: 5364,
    maxAltitude: 5545,
    description: 'The ultimate trek to the base of the world\'s highest peak. Experience legendary Sherpa hospitality and breathtaking views of the Himalayas.',
    terrain: ['Rocky', 'Snow', 'Glacier'],
    bestTime: 'March-May, Sept-Nov',
    fitnessRequirement: 'High cardiovascular endurance',
    checkpoints: [
      { id: 'c1', name: 'Lukla', distance: 0, altitude: 2860, description: 'Starting point of the trek', hasWater: true, hasCampsite: true },
      { id: 'c2', name: 'Namche Bazaar', distance: 18, altitude: 3440, description: 'Economic hub of the Khumbu region', hasWater: true, hasCampsite: true },
      { id: 'c3', name: 'Tengboche', distance: 28, altitude: 3860, description: 'Home to the famous Tengboche Monastery', hasWater: true, hasCampsite: true },
      { id: 'c4', name: 'Dingboche', distance: 38, altitude: 4410, description: 'Summer settlement and acclimitization stop', hasWater: true, hasCampsite: true },
      { id: 'c5', name: 'Lobuche', distance: 48, altitude: 4940, description: 'Gateway to the Khumbu glacier', hasWater: true, hasCampsite: true },
    ],
    weather: {
      current: { temp: -5, condition: 'Clear', windSpeed: 15, visibility: 10 },
      forecast: [
        { day: 'Mon', temp: -6, condition: 'Clear' },
        { day: 'Tue', temp: -8, condition: 'Snow' },
        { day: 'Wed', temp: -4, condition: 'Cloudy' },
        { day: 'Thu', temp: -2, condition: 'Clear' },
      ],
      alerts: ['High wind warning above 4000m'],
    },
    riskZones: [
      { type: 'Avalanche', severity: 'High', location: 'Khumbu Icefall' },
      { type: 'Steep', severity: 'Medium', location: 'Namche Hill' },
    ],
    landmarks: [
      { name: 'Khumbu Glacier', type: 'Viewpoint', distance: 120 },
      { name: 'Gorak Shep', type: 'Rest', distance: 125 },
      { name: 'Kala Patthar', type: 'Viewpoint', distance: 128 },
    ],
    coordinates: { lat: 27.9881, lng: 86.9250 },
    path: [
      [27.6881, 86.7250],
      [27.8000, 86.8000],
      [27.9881, 86.9250]
    ],
    imageUrl: 'https://picsum.photos/seed/everest1/1200/800',
    images: [
      'https://picsum.photos/seed/everest1/1200/800',
      'https://picsum.photos/seed/everest2/1200/800',
      'https://picsum.photos/seed/everest3/1200/800'
    ]
  },
  {
    id: '2',
    name: 'Roopkund Trek',
    location: 'Uttarakhand, India',
    difficulty: 'Expert',
    distance: 53,
    duration: '8 Days',
    elevationGain: 3200,
    maxAltitude: 5029,
    description: 'The Mystery Lake trek. Famous for hundreds of ancient skeletons visible at the lake bed when the snow melts.',
    terrain: ['Forest', 'Meadows', 'Snow'],
    bestTime: 'May-June, Sept-Oct',
    fitnessRequirement: 'Moderate endurance',
    checkpoints: [
      { id: 'r1', name: 'Lohajung', distance: 0, altitude: 2300, description: 'Base camp and trek trailhead', hasWater: true, hasCampsite: true },
      { id: 'r2', name: 'Didna Village', distance: 8, altitude: 2450, description: 'Picturesque homestay village', hasWater: true, hasCampsite: true },
      { id: 'r3', name: 'Ali Bugyal', distance: 15, altitude: 3400, description: 'Vast alpine meadows', hasWater: true, hasCampsite: true },
      { id: 'r4', name: 'Bedni Bugyal', distance: 18, altitude: 3350, description: 'Holy lake and campsite', hasWater: true, hasCampsite: true },
      { id: 'r5', name: 'Bhagwabasa', distance: 28, altitude: 4100, description: 'Stone huts and final high camp', hasWater: true, hasCampsite: true },
    ],
    weather: {
      current: { temp: 12, condition: 'Sunny', windSpeed: 5, visibility: 20 },
      forecast: [
        { day: 'Mon', temp: 10, condition: 'Sunny' },
        { day: 'Tue', temp: 8, condition: 'Cloudy' },
        { day: 'Wed', temp: 5, condition: 'Snow' },
      ],
      alerts: [],
    },
    riskZones: [
      { type: 'Slippery', severity: 'Medium', location: 'Junargali' },
      { type: 'Steep', severity: 'High', location: 'Kelva Vinayak' },
    ],
    landmarks: [
      { name: 'Ali Bugyal', type: 'Viewpoint', distance: 15 },
      { name: 'Kalu Vinayak', type: 'Rest', distance: 26 },
    ],
    coordinates: { lat: 30.2633, lng: 79.7314 },
    path: [
      [30.2000, 79.6000],
      [30.2633, 79.7314]
    ],
    imageUrl: 'https://picsum.photos/seed/roopkund1/1200/800',
    images: [
      'https://picsum.photos/seed/roopkund1/1200/800',
      'https://picsum.photos/seed/roopkund2/1200/800',
      'https://picsum.photos/seed/roopkund3/1200/800'
    ]
  },
  {
    id: '3',
    name: 'Kilimanjaro',
    location: 'Tanzania',
    difficulty: 'Hard',
    distance: 70,
    duration: '7 Days',
    elevationGain: 4900,
    maxAltitude: 5895,
    description: 'The Roof of Africa. A trek through five distinct climatic zones, from rainforest to arctic summit.',
    terrain: ['Rainforest', 'Moorland', 'Alpine Desert', 'Ice Cap'],
    bestTime: 'Jan-March, June-Oct',
    fitnessRequirement: 'Very high endurance and altitude readiness',
    checkpoints: [
      { id: 'k1', name: 'Machame Gate', distance: 0, altitude: 1800, description: 'Park entrance and registration', hasWater: true, hasCampsite: false },
      { id: 'k2', name: 'Machame Camp', distance: 11, altitude: 2835, description: 'First overnight camp in rainforest', hasWater: true, hasCampsite: true },
      { id: 'k3', name: 'Shira Camp', distance: 18, altitude: 3840, description: 'Volcanic plateau camp', hasWater: true, hasCampsite: true },
      { id: 'k4', name: 'Barranco Camp', distance: 28, altitude: 3950, description: 'Dramatic camp near the Wall', hasWater: true, hasCampsite: true },
      { id: 'k5', name: 'Barafu Camp', distance: 45, altitude: 4680, description: 'High camp before summit push', hasWater: true, hasCampsite: true },
    ],
    weather: {
      current: { temp: -15, condition: 'Clear', windSpeed: 25, visibility: 12 },
      forecast: [
        { day: 'Mon', temp: -12, condition: 'Clear' },
        { day: 'Tue', temp: -18, condition: 'Snow' },
        { day: 'Wed', temp: -10, condition: 'Cloudy' },
      ],
      alerts: ['Significant temperature drop expected at summit'],
    },
    riskZones: [
      { type: 'Slippery', severity: 'Medium', location: 'Barranco Wall' },
      { type: 'Steep', severity: 'High', location: 'Stella Point Push' },
    ],
    landmarks: [
      { name: 'Lava Tower', type: 'Viewpoint', distance: 25 },
      { name: 'Stella Point', type: 'Rest', distance: 68 },
      { name: 'Uhuru Peak', type: 'Viewpoint', distance: 70 },
    ],
    coordinates: { lat: -3.0674, lng: 37.3556 },
    path: [[-3.1, 37.3], [-3.0674, 37.3556]],
    imageUrl: 'https://picsum.photos/seed/kili1/1200/800',
    images: [
      'https://picsum.photos/seed/kili1/1200/800',
      'https://picsum.photos/seed/kili2/1200/800',
      'https://picsum.photos/seed/kili3/1200/800'
    ]
  },
  {
    id: '4',
    name: 'Annapurna Circuit',
    location: 'Nepal',
    difficulty: 'Moderate',
    distance: 160,
    duration: '18 Days',
    elevationGain: 6000,
    maxAltitude: 5416,
    description: 'One of the world\'s most diverse long-distance treks, crossing Thorong La Pass.',
    terrain: ['Subtropical', 'Pine Forest', 'Arid Steppe', 'Thorong La Pass'],
    bestTime: 'Oct-Nov, March-April',
    fitnessRequirement: 'High endurance for long daily walks',
    checkpoints: [
      { id: 'a1', name: 'Besisahar', distance: 0, altitude: 760, description: 'Traditional start of the circuit', hasWater: true, hasCampsite: true },
      { id: 'a2', name: 'Chame', distance: 45, altitude: 2670, description: 'District headquarters of Manang', hasWater: true, hasCampsite: true },
      { id: 'a3', name: 'Manang', distance: 80, altitude: 3519, description: 'Acclimatization center', hasWater: true, hasCampsite: true },
      { id: 'a4', name: 'Thorong Phedi', distance: 110, altitude: 4450, description: 'Base of the high pass', hasWater: true, hasCampsite: true },
      { id: 'a5', name: 'Muktinath', distance: 130, altitude: 3800, description: 'Sacred pilgrimage site', hasWater: true, hasCampsite: true },
    ],
    weather: {
      current: { temp: 8, condition: 'Cloudy', windSpeed: 10, visibility: 15 },
      forecast: [
        { day: 'Mon', temp: 5, condition: 'Cloudy' },
        { day: 'Tue', temp: 2, condition: 'Snow' },
        { day: 'Wed', temp: 7, condition: 'Clear' },
      ],
      alerts: ['Heavy snow predicted at Thorong La Pass'],
    },
    riskZones: [
      { type: 'Steep', severity: 'High', location: 'Thorong La Descent' },
      { type: 'Avalanche', severity: 'Medium', location: 'Manang to Phedi' },
    ],
    landmarks: [
      { name: 'Tilicho Lake', type: 'Viewpoint', distance: 95 },
      { name: 'Thorong La Pass', type: 'Viewpoint', distance: 120 },
    ],
    coordinates: { lat: 28.5961, lng: 83.8203 },
    path: [[28.5, 83.7], [28.5961, 83.8203]],
    imageUrl: 'https://picsum.photos/seed/annapurna1/1200/800',
    images: [
      'https://picsum.photos/seed/annapurna1/1200/800',
      'https://picsum.photos/seed/annapurna2/1200/800',
      'https://picsum.photos/seed/annapurna3/1200/800'
    ]
  },
  {
    id: '5',
    name: 'Inca Trail',
    location: 'Peru',
    difficulty: 'Moderate',
    distance: 42,
    duration: '4 Days',
    elevationGain: 2000,
    maxAltitude: 4215,
    description: 'Legendary path to Machu Picchu. Every step reveals ancient Incan ruins and cloud forest beauty.',
    terrain: ['Cloud Forest', 'Stone Steps', 'Tunnels'],
    bestTime: 'May-Sept',
    fitnessRequirement: 'Moderate fitness; ability to climb many steps',
    checkpoints: [
      { id: 'i1', name: 'Km 82', distance: 0, altitude: 2600, description: 'Official starting point near Ollantaytambo', hasWater: true, hasCampsite: false },
      { id: 'i2', name: 'Wayllabamba', distance: 12, altitude: 3000, description: 'First night campsite', hasWater: true, hasCampsite: true },
      { id: 'i3', name: 'Pacaymayo', distance: 24, altitude: 3500, description: 'After Dead Woman\'s Pass', hasWater: true, hasCampsite: true },
      { id: 'i4', name: 'Wiñay Wayna', distance: 38, altitude: 2650, description: 'Beautiful ruins campsite', hasWater: true, hasCampsite: true },
      { id: 'i5', name: 'Sun Gate', distance: 41, altitude: 2720, description: 'First view of Machu Picchu', hasWater: false, hasCampsite: false },
    ],
    weather: {
      current: { temp: 15, condition: 'Sunny', windSpeed: 8, visibility: 25 },
      forecast: [
        { day: 'Mon', temp: 16, condition: 'Sunny' },
        { day: 'Tue', temp: 14, condition: 'Rain' },
        { day: 'Wed', temp: 15, condition: 'Cloudy' },
      ],
      alerts: [],
    },
    riskZones: [
      { type: 'Slippery', severity: 'Medium', location: 'Pacaymayo Steps' },
      { type: 'Steep', severity: 'Medium', location: 'Dead Woman\'s Pass' },
    ],
    landmarks: [
      { name: 'Dead Woman\'s Pass', type: 'Viewpoint', distance: 18 },
      { name: 'Sayacmarca', type: 'Rest', distance: 28 },
      { name: 'Machu Picchu', type: 'Viewpoint', distance: 42 },
    ],
    coordinates: { lat: -13.2433, lng: -72.4833 },
    path: [[-13.2, -72.4], [-13.2433, -72.4833]],
    imageUrl: 'https://picsum.photos/seed/inca1/1200/800',
    images: [
      'https://picsum.photos/seed/inca1/1200/800',
      'https://picsum.photos/seed/inca2/1200/800',
      'https://picsum.photos/seed/inca3/1200/800'
    ]
  },
  {
    id: '6',
    name: 'Tour du Mont Blanc',
    location: 'France/Italy/Switzerland',
    difficulty: 'Hard',
    distance: 170,
    duration: '11 Days',
    elevationGain: 10000,
    maxAltitude: 2665,
    description: 'The quintessential alpine experience, circumnavigating the Mont Blanc massif through three countries.',
    terrain: ['High Passes', 'Lush Valleys', 'Glacier Streams'],
    bestTime: 'July-August',
    fitnessRequirement: 'High endurance for repetitive climbs',
    checkpoints: [
      { id: 'm1', name: 'Les Houches', distance: 0, altitude: 1000, description: 'Traditional start near Chamonix', hasWater: true, hasCampsite: true },
      { id: 'm2', name: 'Les Contamines', distance: 16, altitude: 1167, description: 'Charming village stop', hasWater: true, hasCampsite: true },
      { id: 'm3', name: 'Courmayeur', distance: 60, altitude: 1224, description: 'Italian town on the flip side', hasWater: true, hasCampsite: true },
      { id: 'm4', name: 'Champex-Lac', distance: 110, altitude: 1466, description: 'Swiss lake village', hasWater: true, hasCampsite: true },
      { id: 'm5', name: 'Le Brévent', distance: 165, altitude: 2525, description: 'Final ridge overlooking Chamonix', hasWater: true, hasCampsite: false },
    ],
    weather: {
      current: { temp: 12, condition: 'Sunny', windSpeed: 12, visibility: 30 },
      forecast: [
        { day: 'Mon', temp: 10, condition: 'Clear' },
        { day: 'Tue', temp: 7, condition: 'Rain' },
        { day: 'Wed', temp: 9, condition: 'Clear' },
      ],
      alerts: [],
    },
    riskZones: [
      { type: 'Slippery', severity: 'Low', location: 'Grand Col Ferret' },
      { type: 'Steep', severity: 'Medium', location: 'Flegere decent' },
    ],
    landmarks: [
      { name: 'Col de la Seigne', type: 'Viewpoint', distance: 45 },
      { name: 'Grand Col Ferret', type: 'Viewpoint', distance: 95 },
    ],
    coordinates: { lat: 45.8326, lng: 6.8651 },
    path: [[45.8, 6.8], [45.8326, 6.8651]],
    imageUrl: 'https://picsum.photos/seed/montblanc1/1200/800',
    images: [
      'https://picsum.photos/seed/montblanc1/1200/800',
      'https://picsum.photos/seed/montblanc2/1200/800',
      'https://picsum.photos/seed/montblanc3/1200/800'
    ]
  },
  {
    id: '7',
    name: 'W Trek',
    location: 'Patagonia, Chile',
    difficulty: 'Moderate',
    distance: 80,
    duration: '5 Days',
    elevationGain: 3500,
    maxAltitude: 1200,
    description: 'Dramatic granite towers, turquoise lakes, and calving glaciers in the heart of Patagonia.',
    terrain: ['Glaciers', 'Southern Beech Forests', 'Moraines'],
    bestTime: 'Dec-March',
    fitnessRequirement: 'Moderate endurance; ability to carry gear',
    checkpoints: [
      { id: 't1', name: 'Refugio Las Torres', distance: 0, altitude: 150, description: 'Eastern entry point', hasWater: true, hasCampsite: true },
      { id: 't2', name: 'Base Torres', distance: 10, altitude: 900, description: 'Iconic viewpoints of the towers', hasWater: true, hasCampsite: false },
      { id: 't3', name: 'Refugio Los Cuernos', distance: 25, altitude: 200, description: 'Lakeside base', hasWater: true, hasCampsite: true },
      { id: 't4', name: 'French Valley', distance: 45, altitude: 600, description: 'Glacier amphitheater', hasWater: true, hasCampsite: false },
      { id: 't5', name: 'Grey Glacier', distance: 75, altitude: 250, description: 'Massive ice field viewpoint', hasWater: true, hasCampsite: true },
    ],
    weather: {
      current: { temp: 10, condition: 'Windy', windSpeed: 40, visibility: 20 },
      forecast: [
        { day: 'Mon', temp: 8, condition: 'Rain' },
        { day: 'Tue', temp: 5, condition: 'Snow' },
        { day: 'Wed', temp: 12, condition: 'Windy' },
      ],
      alerts: ['Severe wind gusts in French Valley'],
    },
    riskZones: [
      { type: 'Slippery', severity: 'High', location: 'Base Torres Moraine' },
      { type: 'Slippery', severity: 'Medium', location: 'French Valley Pass' },
    ],
    landmarks: [
      { name: 'Las Torres', type: 'Viewpoint', distance: 10 },
      { name: 'Nordenskjöld Lake', type: 'Viewpoint', distance: 30 },
    ],
    coordinates: { lat: -51.0, lng: -73.0 },
    path: [[-51.1, -73.1], [-51.0, -73.0]],
    imageUrl: 'https://picsum.photos/seed/patagonia1/1200/800',
    images: [
      'https://picsum.photos/seed/patagonia1/1200/800',
      'https://picsum.photos/seed/patagonia2/1200/800',
      'https://picsum.photos/seed/patagonia3/1200/800'
    ]
  },
  {
    id: '8',
    name: 'Milford Track',
    location: 'New Zealand',
    difficulty: 'Easy',
    distance: 53,
    duration: '4 Days',
    elevationGain: 1200,
    maxAltitude: 1154,
    description: 'The finest walk in the world. Experience lush rainforests, towering waterfalls, and spectacular alpine views in Fiordland.',
    terrain: ['Rainforest', 'Wetlands', 'Alpine Pass'],
    bestTime: 'Oct-April',
    fitnessRequirement: 'Low-Moderate; stable footing required',
    checkpoints: [
      { id: 'mf1', name: 'Glade Wharf', distance: 0, altitude: 200, description: 'Boat landing start', hasWater: true, hasCampsite: false },
      { id: 'mf2', name: 'Clinton Hut', distance: 5, altitude: 240, description: 'First night alpine hut', hasWater: true, hasCampsite: true },
      { id: 'mf3', name: 'Mintaro Hut', distance: 21, altitude: 600, description: 'Base of Mackinnon Pass', hasWater: true, hasCampsite: true },
      { id: 'mf4', name: 'Dumpling Hut', distance: 35, altitude: 300, description: 'Near Sutherland Falls', hasWater: true, hasCampsite: true },
      { id: 'mf5', name: 'Sandfly Point', distance: 53, altitude: 10, description: 'The official end at Milford Sound', hasWater: true, hasCampsite: false },
    ],
    weather: {
      current: { temp: 18, condition: 'Rainy', windSpeed: 15, visibility: 12 },
      forecast: [
        { day: 'Mon', temp: 15, condition: 'Rain' },
        { day: 'Tue', temp: 12, condition: 'Heavy Rain' },
        { day: 'Wed', temp: 14, condition: 'Cloudy' },
      ],
      alerts: ['Heavy rainfall may cause track flooding'],
    },
    riskZones: [
      { type: 'Slippery', severity: 'Medium', location: 'Mackinnon Pass descent' },
      { type: 'Landslide', severity: 'Low', location: 'Arthur River' },
    ],
    landmarks: [
      { name: 'Sutherland Falls', type: 'Viewpoint', distance: 38 },
      { name: 'Mackinnon Pass', type: 'Viewpoint', distance: 28 },
    ],
    coordinates: { lat: -44.8, lng: 167.8 },
    path: [[-44.9, 167.7], [-44.8, 167.8]],
    imageUrl: 'https://picsum.photos/seed/milford1/1200/800',
    images: [
      'https://picsum.photos/seed/milford1/1200/800',
      'https://picsum.photos/seed/milford2/1200/800',
      'https://picsum.photos/seed/milford3/1200/800'
    ]
  },
  {
    id: '9',
    name: 'West Highland Way',
    location: 'Scotland, UK',
    difficulty: 'Moderate',
    distance: 154,
    duration: '7 Days',
    elevationGain: 4000,
    maxAltitude: 550,
    description: 'Scotland\'s first designated long distance trail. Through the iconic Highlands, along Loch Lomond, and over the Devil\'s Staircase.',
    terrain: ['Moors', 'Lochside', 'Mountain Tracks'],
    bestTime: 'May-Sept',
    fitnessRequirement: 'Moderate; endurance for multi-day walking',
    checkpoints: [
      { id: 'w1', name: 'Milngavie', distance: 0, altitude: 50, description: 'Starting point near Glasgow', hasWater: true, hasCampsite: false },
      { id: 'w2', name: 'Drymen', distance: 19, altitude: 100, description: 'Village gateway to the hills', hasWater: true, hasCampsite: true },
      { id: 'w3', name: 'Balmaha', distance: 30, altitude: 20, description: 'Loch Lomond lakeside', hasWater: true, hasCampsite: true },
      { id: 'w4', name: 'Rowardennan', distance: 44, altitude: 25, description: 'Base of Ben Lomond', hasWater: true, hasCampsite: true },
      { id: 'w5', name: 'Fort William', distance: 154, altitude: 10, description: 'The finish line in the Highlands', hasWater: true, hasCampsite: false },
    ],
    weather: {
      current: { temp: 14, condition: 'Overcast', windSpeed: 20, visibility: 8 },
      forecast: [
        { day: 'Mon', temp: 12, condition: 'Rain' },
        { day: 'Tue', temp: 10, condition: 'Overcast' },
        { day: 'Wed', temp: 13, condition: 'Clear' },
      ],
      alerts: [],
    },
    riskZones: [
      { type: 'Slippery', severity: 'Low', location: 'Loch Lomond side' },
      { type: 'Steep', severity: 'Medium', location: 'Devil\'s Staircase' },
    ],
    landmarks: [
      { name: 'Conic Hill', type: 'Viewpoint', distance: 32 },
      { name: 'Ben Lomond', type: 'Viewpoint', distance: 48 },
      { name: 'Glencoe', type: 'Viewpoint', distance: 135 },
    ],
    coordinates: { lat: 56.4, lng: -4.7 },
    path: [[55.9, -4.3], [56.4, -4.7]],
    imageUrl: 'https://picsum.photos/seed/scotland1/1200/800',
    images: [
      'https://picsum.photos/seed/scotland1/1200/800',
      'https://picsum.photos/seed/scotland2/1200/800',
      'https://picsum.photos/seed/scotland3/1200/800'
    ]
  }
];

// Helper functions to enrich mock treks with dual routes (Base Camp vs Summit Ascent)
// and key lodging/amenities inside the checkpoints
function enrichCheckpoints(trekName: string, checkpoints: Checkpoint[], trekId: string): Checkpoint[] {
  return checkpoints.map((cp, idx) => {
    const accommodations: Accommodation[] = [];
    const amenities: Amenity[] = [];

    // Realistic accommodation details
    if (cp.hasCampsite || idx === 0 || idx === checkpoints.length - 1) {
      accommodations.push({
        id: `${cp.id}_lodge_1`,
        name: idx === 0 ? `${cp.name} Gateway Expedition Lodge` : `${cp.name} Heights Alpine Lodge`,
        type: idx === 0 ? 'Lodge' : cp.name.includes('Village') || cp.name.includes('Bazaar') ? 'Homestay' : 'Tea House',
        priceRange: idx === 0 ? '$35 - $65' : '$15 - $30',
        description: `Comfortable, fully insulated community rooms with wood stoves, locally sourced hot meals, and secure luggage depots.`,
        amenities: ['Solar Charging', 'Hot Food', 'Double-insulation Sleeper Bags', 'Satellite Wi-Fi'],
        rating: 4.8
      });
      accommodations.push({
        id: `${cp.id}_homestay_2`,
        name: `${cp.name} Local Sherpa Homestay`,
        type: 'Homestay',
        priceRange: '$12 - $22',
        description: `Authentic cultural stays featuring warm organic tea, personal trail recommendations from veteran high-altitude guides, and local family hospitality.`,
        amenities: ['Home-cooked Stew', 'Emergency Oxygen Canisters', 'Hot Water Tubs', 'Solar Lanterns'],
        rating: 4.9
      });
    } else {
      accommodations.push({
        id: `${cp.id}_refugio`,
        name: `${cp.name} Shelter Station`,
        type: 'Refugio',
        priceRange: '$8 - $15',
        description: `Secure heavy-weather trail capsule with drying racks for wet hiking gear and fresh water points.`,
        amenities: ['Emergency Comms', 'Boiled Water Flasks', 'Alpine Bunks'],
        rating: 4.5
      });
    }

    // Advanced safety & medical amenities
    amenities.push({
      name: cp.hasWater ? 'Potable Pure Glacier Water Well' : 'Gravity Membrane Water Tap',
      type: 'Water',
      description: 'Tested extensively for biological purity with dual sediment filters.'
    });

    if (idx % 2 === 0) {
      amenities.push({
        name: 'Solar Grid Micro-Power & USB Station',
        type: 'Power',
        description: 'Sustainable solar cell panels storing high-capacity battery power for essential electronics.'
      });
    } else {
      amenities.push({
        name: 'Trauma & Altitude Sickness Response Kit',
        type: 'Medical',
        description: 'Stocked with oxygen tanks, pulse oximeters, splints, and emergency VHF radios.'
      });
    }

    if (cp.hasCampsite) {
      amenities.push({
        name: 'Helipad Landing Area & Beacon',
        type: 'Safety',
        description: 'Approved clearance area for high-velocity helicopter rescue with emergency smoke canisters.'
      });
    }

    return {
      ...cp,
      accommodations,
      amenities
    };
  });
}

function generateRouteOptions(trek: Trek): { baseCamp: RouteOption; summit: RouteOption } {
  const checkpoints = enrichCheckpoints(trek.name, trek.checkpoints, trek.id);
  const midPointIdx = Math.max(1, Math.floor(checkpoints.length * 0.6));
  
  // Base camp stops: first N checkpoints
  const baseCampCheckpoints = checkpoints.slice(0, midPointIdx + 1);
  const baseCampPath = trek.path.slice(0, Math.max(2, Math.floor(trek.path.length * 0.6) + 1));
  
  // Summit checkpoints: append high altitude camps extending above basecamp
  const summitCheckpoints = [...checkpoints];
  const summitPath = [...trek.path];

  // Specific high camps depending on mountain types
  if (trek.name.includes("Everest")) {
    summitCheckpoints.push(
      {
        id: `${trek.id}_camp_3`,
        name: 'Lhotse Face - Camp III',
        distance: 55,
        altitude: 7200,
        description: 'Severe technical ice wall ledge. High-grade double-walled dome tents with safety anchor networks.',
        hasWater: false,
        hasCampsite: true,
        accommodations: [{
          id: `${trek.id}_esc_3`,
          name: 'Camp III Extreme Geodesic Hex-Dome',
          type: 'Campsite',
          priceRange: 'Permit Protected',
          description: 'Top-tier severe weather domes loaded with continuous oxygen tanks and satellite uplinks.',
          amenities: ['Oxygen Regulator Support', 'Thermal Sleep Mats', 'Continuous Radio Feedback'],
          rating: 4.8
        }],
        amenities: [{
          name: 'VHF Heavy Weather Transmitter',
          type: 'Connectivity',
          description: 'Live base station meteorological feedback and emergency distress loops.'
        }]
      },
      {
        id: `${trek.id}_camp_summit`,
        name: 'Everest Summit (Peak Ascent)',
        distance: 65,
        altitude: 8848,
        description: 'The supreme highest point on planet Earth. Extreme oxygen deprivation zone. Highly critical descent times apply.',
        hasWater: false,
        hasCampsite: false,
        accommodations: [],
        amenities: [{
          name: 'Active GPS Sat Transceiver beacon',
          type: 'Safety',
          description: 'Precision geolocation tracking for elite mountain rescues.'
        }]
      }
    );
    if (summitPath.length > 0) {
      const lastPoint = summitPath[summitPath.length - 1];
      summitPath.push([lastPoint[0] + 0.04, lastPoint[1] + 0.04]);
    }
  } else if (trek.name.includes("Kilimanjaro")) {
    summitCheckpoints.push(
      {
        id: `${trek.id}_kcamp_stella`,
        name: 'Stella Point Peak Girdle',
        distance: 58,
        altitude: 5756,
        description: 'Caldera rim staging ground. Freezing winds with stunning pre-dawn sight horizons.',
        hasWater: false,
        hasCampsite: false,
        accommodations: [],
        amenities: [{
          name: 'Glacial Wind Shield Capsule',
          type: 'Safety',
          description: 'Reinforced metallic wind barrier for temporary hydration breaks.'
        }]
      },
      {
        id: `${trek.id}_kcamp_summit`,
        name: 'Uhuru Summit Ascent',
        distance: 70,
        altitude: 5895,
        description: 'The official Roof of Africa. Majestic terrain surrounded by ancient tropical ice-caps.',
        hasWater: false,
        hasCampsite: false,
        accommodations: [],
        amenities: [{
          name: 'Summit Registry Dome',
          type: 'Safety',
          description: 'Climber validation check book and telemetry tracking solar marker.'
        }]
      }
    );
    if (summitPath.length > 0) {
      const lastPoint = summitPath[summitPath.length - 1];
      summitPath.push([lastPoint[0] + 0.05, lastPoint[1] + 0.05]);
    }
  } else {
    // Elegant programmatical fallback logic for all remaining mountains
    const altFactor = trek.name.includes("Mont Blanc") || trek.name.includes("Milford") || trek.name.includes("W Trek") ? 1.4 : 1.15;
    summitCheckpoints.push(
      {
        id: `${trek.id}_hcamp_staging`,
        name: 'High Shoulder Summit Staging',
        distance: Math.round(trek.distance * 1.08),
        altitude: Math.round(trek.maxAltitude * altFactor),
        description: 'Exposed alpine high camp. The final launching pad for pristine morning attempts to the top.',
        hasWater: true,
        hasCampsite: true,
        accommodations: [{
          id: `${trek.id}_staging_dome`,
          name: 'Summit-Bound High Huts',
          type: 'Alpine Hut',
          priceRange: '$30 - $45',
          description: 'Highly insulated wooden cabin with gas burners, emergency provisions, and avalanche-resistant structures.',
          amenities: ['Gas Stoves', 'Survival Food', 'Blanket Caches', 'VHF Comms'],
          rating: 4.7
        }],
        amenities: [{
          name: 'Emergency Crampon & Rope Reserve',
          type: 'Safety',
          description: 'Self-arrest pickaxes, anchors, extra climbing ropes, and backup harnesses.'
        }]
      },
      {
        id: `${trek.id}_peak_summit`,
        name: `${trek.name.replace(" Trek", "").replace(" Circuit", "")} Summit / Peak`,
        distance: Math.round(trek.distance * 1.16),
        altitude: Math.round(trek.maxAltitude * (altFactor + 0.08)),
        description: 'The spectacular culminating apex. Unobstructed vertical visual landscape.',
        hasWater: false,
        hasCampsite: false,
        accommodations: [],
        amenities: [{
          name: 'Scientific Telemetry Station',
          type: 'Connectivity',
          description: 'Atmospheric pressure monitors and global rescue emergency beacons.'
        }]
      }
    );
    if (summitPath.length > 0) {
      const lastPoint = summitPath[summitPath.length - 1];
      summitPath.push([lastPoint[0] + 0.03, lastPoint[1] + 0.03]);
    }
  }

  // Dual metrics calculations
  const bcAltitude = Math.round(trek.maxAltitude * 0.85);
  const bcElevation = Math.round(trek.elevationGain * 0.7);
  const bcDistance = Math.round(trek.distance * 0.75);
  const bcDuration = `${Math.ceil(parseFloat(trek.duration) * 0.7)} Days`;

  const sumAltitude = Math.max(...summitCheckpoints.map(c => c.altitude));
  const sumElevation = Math.round(trek.elevationGain * 1.25);
  const sumDistance = Math.round(trek.distance * 1.15);
  const sumDuration = `${Math.ceil(parseFloat(trek.duration) * 1.15)} Days`;

  return {
    baseCamp: {
      name: `${trek.name} Base Camp Trek`,
      difficulty: trek.difficulty === 'Expert' ? 'Hard' : trek.difficulty === 'Hard' ? 'Moderate' : 'Easy',
      distance: bcDistance,
      duration: bcDuration,
      elevationGain: bcElevation,
      maxAltitude: bcAltitude,
      description: `A scenic, non-technical trail segment targeting the base/mid-camps. Features beautiful panoramas, cozy community homestays, comfortable lodges, and minimizes exposure to severe climbing hazards. Perfect for most high-fitness hikers.`,
      checkpoints: baseCampCheckpoints,
      riskZones: trek.riskZones.filter(rz => rz.severity !== 'High'),
      path: baseCampPath
    },
    summit: {
      name: `${trek.name} Summit Ascent`,
      difficulty: 'Expert',
      distance: sumDistance,
      duration: sumDuration,
      elevationGain: sumElevation,
      maxAltitude: sumAltitude,
      description: `The complete extreme ascent extending beyond basecamp up to the ultimate summit peak. Features intense high-exposition ridges, sub-zero cold fronts, steep snow/rock slopes, and requires specific gears, medical protocols, and professional guide oversight.`,
      checkpoints: summitCheckpoints,
      riskZones: trek.riskZones.map(rz => rz.severity === 'Medium' ? { ...rz, severity: 'High' } : rz),
      path: summitPath
    }
  };
}

export const MOCK_TREKS: Trek[] = RAW_MOCK_TREKS.map(trek => {
  const routes = generateRouteOptions(trek);
  return {
    ...trek,
    checkpoints: routes.baseCamp.checkpoints, // default representation
    routes
  };
});
