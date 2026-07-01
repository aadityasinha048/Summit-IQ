import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Wind, 
  Droplets, 
  Eye, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Zap,
  ShieldCheck,
  Map as MapIcon,
  Thermometer,
  Cloud,
  Activity,
  Home,
  Wifi
} from 'lucide-react';
import { Trek } from '../types';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// Custom interactive controllers used for maximum reliability and iframe rendering compatibility
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { getSafetyAnalysis } from '../services/gemini';
import { MapComponent } from './MapComponent';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  setDoc,
  doc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { MessageSquare, Send, Clock, Navigation, Share2, LocateFixed, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TrekDetailProps {
  trek: Trek;
  onBack: () => void;
}

export function TrekDetail({ trek, onBack }: TrekDetailProps) {
  const [routeType, setRouteType] = useState<'baseCamp' | 'summit'>('baseCamp');

  const activeRoute = trek.routes ? trek.routes[routeType] : {
    name: trek.name,
    difficulty: trek.difficulty,
    distance: trek.distance,
    duration: trek.duration,
    elevationGain: trek.elevationGain,
    maxAltitude: trek.maxAltitude,
    description: trek.description,
    checkpoints: trek.checkpoints,
    riskZones: trek.riskZones,
    path: trek.path
  };

  const [aiAnalysis, setAiAnalysis] = useState<{ 
    status: 'ready' | 'caution' | 'warning' | 'stop';
    recommendation: 'START' | 'DELAY' | 'ABORT';
    decisionBrief: string;
    precautions: string[];
  } | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [updates, setUpdates] = useState<any[]>([]);
  const [newUpdate, setNewUpdate] = useState('');
  const [updateType, setUpdateType] = useState('General');
  const [hoveredPoint, setHoveredPoint] = useState<[number, number] | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [shareEmails, setShareEmails] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadStep, setDownloadStep] = useState('');
  const [activeTab, setActiveTab] = useState('checkpoints');
  const [isOfflineCached, setIsOfflineCached] = useState(false);

  useEffect(() => {
    const cached = localStorage.getItem(`offline_trek_${trek.id}_${routeType}`) === 'true';
    setIsOfflineCached(cached);
  }, [trek.id, routeType]);

  const handleDownloadOfflineMap = () => {
    setDownloading(true);
    setDownloadProgress(0);
    setDownloadStep('Initializing satellite uplink and map pipeline...');

    const steps = [
      { prg: 15, msg: 'Resolving selected route tracking coordinates (GPS interchange)...' },
      { prg: 35, msg: 'Caching topographies & elevation grids for offline rendering...' },
      { prg: 55, msg: 'Encrypting trackside lodging databases & local homestays...' },
      { prg: 75, msg: 'Extracting safety protocols, weather intelligence & risk cards...' },
      { prg: 90, msg: 'Verifying package checksums & drafting GPX vector map...' },
      { prg: 100, msg: 'Offline bundle compiled! Transmitting raw assets to browser.' }
    ];

    let currentStepIdx = 0;
    const interval = setInterval(() => {
      if (currentStepIdx < steps.length) {
        setDownloadProgress(steps[currentStepIdx].prg);
        setDownloadStep(steps[currentStepIdx].msg);
        
        if (steps[currentStepIdx].prg === 100) {
          clearInterval(interval);
          
          try {
            // 1. Compile GPX file
            const gpxHeader = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="SummitIQ" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>${activeRoute.name}</name>
    <desc>Offline navigation pathway generated for ${trek.name} (${activeRoute.name}) on SummitIQ</desc>
    <time>${new Date().toISOString()}</time>
  </metadata>
`;
            
            const gpxWaypoints = (activeRoute.checkpoints || []).map(cp => `  <wpt lat="${trek.coordinates.lat + (cp.distance/100)}" lon="${trek.coordinates.lng + (cp.distance/100)}">
    <ele>${cp.altitude}</ele>
    <name>${cp.name}</name>
    <desc>${cp.description.replace(/[<>&'"]/g, '')}. Has Water: ${cp.hasWater ? 'Yes' : 'No'}. Has Lodging: ${cp.hasCampsite ? 'Yes' : 'No'}</desc>
  </wpt>`).join('\n');

            const gpxTrackPoints = (activeRoute.path || []).map(pt => `      <trkpt lat="${pt[0]}" lon="${pt[1]}" />`).join('\n');

            const gpxTrack = `  <trk>
    <name>${activeRoute.name} Trailpath</name>
    <desc>Coordinate trails for direct device compatibility with Garmin, Gaia GPS, or AllTrails</desc>
    <trkseg>
${gpxTrackPoints}
    </trkseg>
  </trk>
</gpx>`;

            const gpxFullContent = `${gpxHeader}\n${gpxWaypoints}\n${gpxTrack}`;
            const gpxBlob = new Blob([gpxFullContent], { type: 'application/gpx+xml;charset=utf-8;' });
            const gpxUrl = URL.createObjectURL(gpxBlob);
            const gpxLink = document.createElement('a');
            gpxLink.href = gpxUrl;
            gpxLink.setAttribute('download', `SummitIQ_${trek.name.replace(/\s+/g, '_')}_${routeType === 'summit' ? 'Summit_Climb' : 'Base_Camp'}_Track.gpx`);
            gpxLink.click();
            URL.revokeObjectURL(gpxUrl);

            // 2. Compile JSON offline package
            const jsonOfflineData = {
              trekId: trek.id,
              trekName: trek.name,
              selectedRoute: activeRoute.name,
              routeType: routeType,
              maxAltitude: activeRoute.maxAltitude,
              distance: activeRoute.distance,
              duration: activeRoute.duration,
              elevationGain: activeRoute.elevationGain,
              difficulty: activeRoute.difficulty,
              checkpoints: (activeRoute.checkpoints || []).map(cp => ({
                name: cp.name,
                altitude: cp.altitude,
                distance: cp.distance,
                description: cp.description,
                lodges: cp.accommodations || [],
                amenities: cp.amenities || []
              })),
              safetyRiskZones: activeRoute.riskZones || [],
              weatherCache: trek.weather,
              downloadedAt: new Date().toISOString()
            };
            const jsonBlob = new Blob([JSON.stringify(jsonOfflineData, null, 2)], { type: 'application/json;charset=utf-8;' });
            const jsonUrl = URL.createObjectURL(jsonBlob);
            const jsonLink = document.createElement('a');
            jsonLink.href = jsonUrl;
            jsonLink.setAttribute('download', `SummitIQ_${trek.name.replace(/\s+/g, '_')}_${routeType === 'summit' ? 'Summit_Climb' : 'Base_Camp'}_Intel.json`);
            jsonLink.click();
            URL.revokeObjectURL(jsonUrl);

            localStorage.setItem(`offline_trek_${trek.id}_${routeType}`, 'true');
            setIsOfflineCached(true);
          } catch (e) {
            console.error('Offline download failed:', e);
          }

          setTimeout(() => {
            setDownloading(false);
          }, 1500);
        }
        currentStepIdx++;
      }
    }, 600);
  };

  const images = (trek.images && trek.images.length > 0) 
    ? trek.images 
    : [trek.imageUrl || `https://picsum.photos/seed/${trek.id}/800/600`].filter(Boolean);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  useEffect(() => {
    let watchId: number | null = null;

    if (isTracking && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          
          if (isSharing && auth.currentUser) {
            setDoc(doc(db, 'locations', auth.currentUser.uid), {
              userId: auth.currentUser.uid,
              userName: auth.currentUser.displayName,
              trekId: trek.id,
              trekName: trek.name,
              latitude,
              longitude,
              timestamp: serverTimestamp(),
              sharingWith: shareEmails
            }).catch(err => handleFirestoreError(err, OperationType.WRITE, `locations/${auth.currentUser?.uid}`));
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsTracking(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }

    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    };
  }, [isTracking, isSharing, trek.id, trek.name, shareEmails]);

  const handleAddShareEmail = () => {
    if (shareEmail && !shareEmails.includes(shareEmail)) {
      setShareEmails([...shareEmails, shareEmail]);
      setShareEmail('');
    }
  };

  const handleChartHover = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const point = data.activePayload[0].payload;
      // Simple interpolation for demo: move along the path based on distance percentage
      const totalDist = activeRoute.distance;
      const ratio = point.distance / totalDist;
      const pathIndex = Math.min(activeRoute.path.length - 1, Math.floor(ratio * (activeRoute.path.length - 1)));
      setHoveredPoint(activeRoute.path[pathIndex]);
    } else {
      setHoveredPoint(null);
    }
  };

  useEffect(() => {
    const q = query(
      collection(db, 'treks', trek.id, 'updates'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUpdates(updatesData);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `treks/${trek.id}/updates`);
    });

    return () => unsubscribe();
  }, [trek.id]);

  const handleSubmitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUpdate.trim()) return;

    try {
      await addDoc(collection(db, 'treks', trek.id, 'updates'), {
        trekId: trek.id,
        authorUid: auth.currentUser?.uid,
        authorName: auth.currentUser?.displayName || 'Anonymous',
        content: newUpdate,
        type: updateType,
        timestamp: serverTimestamp()
      });
      setNewUpdate('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `treks/${trek.id}/updates`);
    }
  };

  useEffect(() => {
    async function fetchAnalysis() {
      setLoadingAi(true);
      const analysis = await getSafetyAnalysis(activeRoute.name, trek.weather);
      setAiAnalysis(analysis);
      setLoadingAi(false);
    }
    fetchAnalysis();
  }, [trek, routeType]);

  const elevationData = activeRoute.checkpoints.map(cp => ({
    name: cp.name,
    altitude: cp.altitude,
    distance: cp.distance
  }));

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-7xl mx-auto space-y-8"
    >
      {/* Hero Image Slideshow */}
      <div className="relative h-48 sm:h-64 lg:h-96 rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 group bg-[#0a0a0a]">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            loading={i === 0 ? "eager" : "lazy"}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              i === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            referrerPolicy="no-referrer"
            alt={`${trek.name} view ${i + 1}`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
        
        {/* Indicators */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-20">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentImageIndex(i)}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                i === currentImageIndex ? 'w-6 sm:w-8 bg-brand-primary' : 'w-1.5 sm:w-2 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Quick Labels */}
        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 flex flex-wrap gap-2 sm:gap-3 z-10">
          <Badge className="bg-brand-primary text-white border-0 py-1 px-3 sm:px-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-xl">
            {activeRoute.difficulty}
          </Badge>
          <Badge variant="outline" className="bg-black/40 backdrop-blur-md border-white/20 text-white py-1 px-3 sm:px-4 text-[10px] sm:text-xs font-mono">
            {activeRoute.maxAltitude}m Peak
          </Badge>
        </div>
      </div>

      {/* Route Level Selector Switch Widget */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 tech-border">
        <div>
          <span className="text-[10px] font-mono font-black text-brand-primary uppercase tracking-[0.2em] mb-1 block">Trek Route Selection</span>
          <h3 className="text-base sm:text-lg font-bold font-display uppercase tracking-tight">Set Altitude Segment Option</h3>
          <p className="text-xs text-brand-muted mt-1 leading-relaxed">
            Choose either the standard scenic trail up to the Base Camp level, or push yourself with the technical Peak Summit Ascent.
          </p>
        </div>
        <div className="flex bg-black/40 border border-white/10 rounded-xl p-1 shrink-0 w-full md:w-auto">
          <button
            onClick={() => setRouteType('baseCamp')}
            className={`flex-1 md:flex-none px-4 py-2.5 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-1.5 ${
              routeType === 'baseCamp'
                ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/10'
                : 'text-brand-muted hover:text-white'
            }`}
          >
            🏔️ Base Camp Route
          </button>
          <button
            onClick={() => setRouteType('summit')}
            className={`flex-1 md:flex-none px-4 py-2.5 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-1.5 ${
              routeType === 'summit'
                ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/10'
                : 'text-brand-muted hover:text-white'
            }`}
          >
            ⚡ Summit Peak Climb
          </button>
        </div>
      </div>

      {/* Back Button & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-white/5 shrink-0 h-10 w-10">
            <ArrowLeft size={20} />
          </Button>
          <div className="min-w-0">
            <h2 className="text-xl sm:text-3xl font-display font-bold truncate">{trek.name}</h2>
            <p className="text-[10px] sm:text-sm text-brand-muted uppercase tracking-wider">{trek.location} • {activeRoute.name}</p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto sm:ml-auto">
          <Button 
            onClick={() => setIsTracking(!isTracking)}
            className="flex-1 sm:flex-none bg-brand-primary hover:bg-brand-primary/90 text-xs sm:text-sm h-10 sm:px-6 rounded-xl font-bold"
          >
            {isTracking ? <><LocateFixed size={16} className="mr-2 animate-pulse" /> Stop</> : <><Navigation size={16} className="mr-2" /> Start</>}
          </Button>
          <Button 
            variant={isOfflineCached ? "secondary" : "outline"}
            className={`flex-1 sm:flex-none text-xs sm:text-sm h-10 sm:px-6 rounded-xl font-bold transition-all duration-300 ${
              isOfflineCached 
                ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10' 
                : 'border-white/10 hover:bg-white/5 text-white'
            }`}
            onClick={handleDownloadOfflineMap}
            disabled={downloading}
          >
            {isOfflineCached ? (
              <>
                <CheckCircle2 size={15} className="mr-2 text-emerald-400" />
                Offline Saved
              </>
            ) : (
              <>
                <MapIcon size={15} className="mr-2" />
                Download GPS
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column: Stats & Weather */}
        <div className="space-y-6">
          {/* Selected Route Parameters Card */}
          <Card className="bg-white/5 border-white/10 tech-border overflow-hidden shadow-2xl">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-xs font-mono uppercase tracking-widest text-[#f27d26] flex items-center gap-2">
                <Navigation size={14} />
                Selected Route Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="text-sm font-bold tracking-tight uppercase text-white font-display leading-tight">
                {activeRoute.name}
              </div>
              <p className="text-xs text-brand-muted leading-relaxed italic font-medium opacity-95">
                "{activeRoute.description}"
              </p>
              
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-brand-muted text-[9px] uppercase tracking-widest mb-1 font-mono">Distance</p>
                  <p className="font-mono text-xs sm:text-sm font-black text-white">{activeRoute.distance} km</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-brand-muted text-[9px] uppercase tracking-widest mb-1 font-mono">Duration</p>
                  <p className="font-mono text-xs sm:text-xs font-black text-white">{activeRoute.duration}</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-brand-muted text-[9px] uppercase tracking-widest mb-1 font-mono">Elevation</p>
                  <p className="font-mono text-xs sm:text-xs font-black text-white">+{activeRoute.elevationGain}m</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-brand-muted text-[9px] uppercase tracking-widest mb-1 font-mono">Max Alt</p>
                  <p className="font-mono text-xs sm:text-xs font-black text-white">{activeRoute.maxAltitude}m</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 mt-1 select-none">
                <span className="text-[10px] uppercase font-mono tracking-wider text-brand-muted">Climb Status</span>
                <Badge className={`border-0 text-[10px] uppercase font-black px-2.5 py-0.5 rounded-sm tracking-widest ${
                  activeRoute.difficulty === 'Easy' ? 'bg-green-500 text-white' :
                  activeRoute.difficulty === 'Moderate' ? 'bg-yellow-500 text-black' :
                  activeRoute.difficulty === 'Hard' ? 'bg-orange-500 text-white' :
                  'bg-red-500 text-white animate-pulse'
                }`}>
                  {activeRoute.difficulty}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Weather Widget */}
          <Card className="bg-white/5 border-white/10 tech-border overflow-hidden">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-xs font-mono uppercase tracking-widest text-brand-muted flex items-center gap-2">
                <Cloud size={14} className="text-brand-primary" />
                Weather Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="text-3xl sm:text-4xl font-display font-bold">{trek.weather.current.temp}°C</div>
                  <div>
                    <p className="text-sm sm:text-base font-medium">{trek.weather.current.condition}</p>
                    <p className="text-[10px] sm:text-xs text-brand-muted">Visibility: {trek.weather.current.visibility}km</p>
                  </div>
                </div>
                <Zap className="text-yellow-500 animate-pulse" size={20} />
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 text-brand-muted text-[10px] mb-1 uppercase tracking-wider">
                    <Wind size={10} />
                    <span>Wind Speed</span>
                  </div>
                  <p className="font-mono text-sm font-medium">{trek.weather.current.windSpeed} km/h</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 text-brand-muted text-[10px] mb-1 uppercase tracking-wider">
                    <Thermometer size={10} />
                    <span>Feels Like</span>
                  </div>
                  <p className="font-mono text-sm font-medium">{trek.weather.current.temp - 2}°C</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-mono text-brand-muted uppercase tracking-widest mb-3">5-Day Forecast</p>
                {trek.weather?.forecast?.map((f, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-2 border-b border-white/5 last:border-0 last:pb-0">
                    <span className="text-brand-muted min-w-[40px]">{f.day}</span>
                    <span className="flex-1 text-center font-medium">{f.temp}°C</span>
                    <span className="text-brand-muted">{f.condition}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Safety Alerts */}
          <Card className="bg-red-500/5 border-red-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-mono uppercase tracking-widest text-red-500 flex items-center gap-2">
                <AlertTriangle size={16} />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {trek.weather?.alerts?.map((alert, i) => (
                <div key={i} className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-200">
                  {alert}
                </div>
              ))}
              {activeRoute.riskZones?.map((risk, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${risk.severity === 'High' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                    <div>
                      <p className="text-sm font-medium">{risk.type}</p>
                      <p className="text-[10px] text-brand-muted">{risk.location}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] border-white/10 uppercase">{risk.severity}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Middle & Right Column: Elevation & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Map & Elevation Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
            {/* Map */}
            <div className="h-72 sm:h-96 xl:h-auto min-h-[300px] xl:min-h-[500px] rounded-2xl overflow-hidden border border-white/10 tech-border">
              <MapComponent 
                center={[trek.coordinates.lat, trek.coordinates.lng]} 
                zoom={10} 
                points={activeRoute.checkpoints?.map((cp, i) => ({ 
                  name: cp.name, 
                  position: [trek.coordinates.lat + (cp.distance/100), trek.coordinates.lng + (cp.distance/100)],
                  type: i === 0 ? 'start' : i === activeRoute.checkpoints.length - 1 ? 'end' : 'checkpoint'
                })) || []}
                path={activeRoute.path}
                hoveredPoint={hoveredPoint}
                userLocation={userLocation}
              />
            </div>

            {/* Elevation Profile */}
            <Card className="bg-white/5 border-white/10 overflow-hidden flex flex-col">
              <CardHeader className="pb-2 border-b border-white/5">
                <CardTitle className="text-xs font-mono uppercase tracking-widest text-brand-muted flex items-center gap-2">
                  <Activity size={14} className="text-brand-primary" />
                  Elevation Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="h-64 sm:h-80 xl:flex-1 pt-6 pb-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart 
                    data={elevationData}
                    onMouseMove={handleChartHover}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    <defs>
                      <linearGradient id="colorAlt" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f27d26" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f27d26" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis 
                      dataKey="distance" 
                      stroke="#8e9299" 
                      fontSize={9} 
                      tickFormatter={(val) => `${val}km`}
                      tick={{ fill: '#8e9299' }}
                    />
                    <YAxis 
                      stroke="#8e9299" 
                      fontSize={9} 
                      tickFormatter={(val) => `${val}m`}
                      tick={{ fill: '#8e9299' }}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#151619', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '11px' }}
                      itemStyle={{ color: '#f27d26' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="altitude" 
                      stroke="#f27d26" 
                      fillOpacity={1} 
                      fill="url(#colorAlt)" 
                      strokeWidth={2}
                      animationDuration={1000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* AI Intelligence Layer */}
          <Card className={`relative overflow-hidden border-2 transition-all duration-500 shadow-2xl ${
            aiAnalysis?.status === 'ready' ? 'bg-green-500/5 border-green-500/20' :
            aiAnalysis?.status === 'caution' ? 'bg-yellow-500/5 border-yellow-500/20' :
            aiAnalysis?.status === 'warning' ? 'bg-orange-500/5 border-orange-500/20' :
            'bg-red-500/5 border-red-500/20'
          }`}>
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <ShieldCheck size={80} className="text-white" />
            </div>
            <CardHeader className="pb-4 border-b border-white/5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-brand-primary flex items-center gap-2">
                  <Zap size={14} />
                  AI Mission Advisor
                </CardTitle>
                {aiAnalysis && (
                  <Badge className={`${
                    aiAnalysis.status === 'ready' ? 'bg-green-500' :
                    aiAnalysis.status === 'caution' ? 'bg-yellow-500' :
                    aiAnalysis.status === 'warning' ? 'bg-orange-500' :
                    'bg-red-500'
                  } text-white border-0 text-[10px] uppercase font-black px-2 py-0.5 rounded-sm`}>
                    {aiAnalysis.status}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-6 pb-6">
              {loadingAi ? (
                <div className="flex items-center gap-3 text-brand-muted animate-pulse py-6">
                  <div className="w-5 h-5 rounded-full bg-brand-primary" />
                  <span className="text-xs sm:text-sm font-mono uppercase tracking-widest">Syncing mission vectors...</span>
                </div>
              ) : aiAnalysis ? (
                <div className="space-y-6 sm:space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 p-5 bg-white/5 rounded-2xl border border-white/5">
                    <div className="text-center sm:text-left shrink-0">
                      <p className="text-[9px] font-mono text-brand-muted uppercase tracking-[0.2em] mb-1.5">Decision Matrix</p>
                      <div className={`text-2xl sm:text-4xl font-display font-black tracking-tighter ${
                        aiAnalysis.recommendation === 'START' ? 'text-green-400' :
                        aiAnalysis.recommendation === 'DELAY' ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {aiAnalysis.recommendation} MISSION
                      </div>
                    </div>
                    <div className="flex-1 border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-8">
                      <p className="text-[9px] font-mono text-brand-muted uppercase tracking-[0.2em] mb-1.5">Intelligence Briefing</p>
                      <p className="text-xs sm:text-sm text-brand-muted leading-relaxed italic font-medium">
                        "{aiAnalysis.decisionBrief}"
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[9px] font-mono text-brand-muted uppercase tracking-[0.2em] flex items-center gap-2">
                      <ShieldCheck size={12} className="text-brand-primary" />
                      Tactical Precautions & Protocols
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      {aiAnalysis.precautions?.map((precaution, i) => (
                        <div key={i} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all group">
                          <div className="mt-1 w-2 h-2 rounded-full bg-brand-primary shrink-0 group-hover:scale-125 transition-transform" />
                          <p className="text-xs text-brand-muted leading-relaxed font-medium">{precaution}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-red-400 text-sm py-4 bg-red-500/5 rounded-xl px-4 border border-red-500/10">
                  <AlertTriangle size={16} />
                  <span className="font-mono uppercase text-xs tracking-wider">Mission Intelligence Offline</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tabs for Details */}
          {/* Info Segments Button Grid */}
          <div className="w-full animate-fade-in text-white">
            {/* Unified Responsive Tabs List (Grid on mobile, flex bar on desktop) */}
            <div className="mb-8 w-full">
              <label className="sm:hidden text-[10px] font-mono font-black text-brand-primary uppercase tracking-[0.2em] mb-2.5 px-0.5 block select-none">
                Mission Intelligence Segment
              </label>
              
              <div className="grid grid-cols-2 sm:flex bg-transparent sm:bg-white/5 border-0 sm:border sm:border-white/10 p-0 sm:p-1.5 h-auto gap-2.5 sm:gap-2 rounded-none sm:rounded-2xl w-full">
                <button
                  type="button"
                  onClick={() => setActiveTab('checkpoints')}
                  className={`flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all duration-200 border w-full text-center hover:cursor-pointer sm:flex-1 h-11 sm:h-11 sm:py-3 sm:px-4 ${
                    activeTab === 'checkpoints'
                      ? 'bg-[#f27d26] text-white border-[#f27d26] shadow-lg shadow-[#f27d26]/10 font-bold'
                      : 'bg-white/5 border-white/5 text-brand-muted hover:text-white hover:bg-white/10'
                  }`}
                >
                  🏁 Checkpoints
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('landmarks')}
                  className={`flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all duration-200 border w-full text-center hover:cursor-pointer sm:flex-1 h-11 sm:h-11 sm:py-3 sm:px-4 ${
                    activeTab === 'landmarks'
                      ? 'bg-[#f27d26] text-white border-[#f27d26] shadow-lg shadow-[#f27d26]/10 font-bold'
                      : 'bg-white/5 border-white/5 text-brand-muted hover:text-white hover:bg-white/10'
                  }`}
                >
                  🗺️ Landmarks
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('community')}
                  className={`flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all duration-200 border w-full text-center hover:cursor-pointer sm:flex-1 h-11 sm:h-11 sm:py-3 sm:px-4 ${
                    activeTab === 'community'
                      ? 'bg-[#f27d26] text-white border-[#f27d26] shadow-lg shadow-[#f27d26]/10 font-bold'
                      : 'bg-white/5 border-white/5 text-brand-muted hover:text-white hover:bg-white/10'
                  }`}
                >
                  📡 Intel Feed
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('live')}
                  className={`flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all duration-200 border w-full text-center hover:cursor-pointer sm:flex-1 h-11 sm:h-11 sm:py-3 sm:px-4 ${
                    activeTab === 'live'
                      ? 'bg-[#f27d26] text-white border-[#f27d26] shadow-lg shadow-[#f27d26]/10 font-bold'
                      : 'bg-white/5 border-white/5 text-brand-muted hover:text-white hover:bg-white/10'
                  }`}
                >
                  🛰️ Live Share
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('packing')}
                  className={`col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all duration-200 border w-full text-center hover:cursor-pointer sm:flex-1 h-11 sm:h-11 sm:py-3 sm:px-4 ${
                    activeTab === 'packing'
                      ? 'bg-[#f27d26] text-white border-[#f27d26] shadow-lg shadow-[#f27d26]/10 font-bold'
                      : 'bg-white/5 border-white/5 text-brand-muted hover:text-white hover:bg-white/10'
                  }`}
                >
                  📋 Packing List
                </button>
              </div>
            </div>

            {/* 1. Checkpoints & Lodging Tab Content */}
            {activeTab === 'checkpoints' && (
              <div className="mt-6 space-y-6 w-full max-w-full overflow-hidden">
              {activeRoute.checkpoints?.map((cp, i) => (
                <div key={i} className="flex flex-col items-start gap-4 p-5 sm:p-6 bg-white/5 border border-white/5 rounded-2xl hover:border-brand-primary/20 transition-all group w-full tech-border">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full border-b border-white/5 pb-4">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-12 h-12 shrink-0 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary font-display font-black text-lg group-hover:bg-brand-primary group-hover:text-white transition-all shadow-lg shadow-brand-primary/10 select-none">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <div className="sm:hidden flex-1">
                        <h4 className="font-black text-sm uppercase tracking-tight">{cp.name}</h4>
                        <p className="text-[10px] text-brand-muted font-mono uppercase">{cp.altitude}m Elevation • {cp.distance}km Mark</p>
                      </div>
                    </div>
                    
                    <div className="flex-1 w-full hidden sm:flex justify-between items-center">
                      <h4 className="font-black uppercase tracking-tight text-lg">{cp.name}</h4>
                      <div className="text-right flex items-center gap-3">
                        <Badge variant="outline" className="text-[10px] font-mono border-white/10 text-white rounded-md px-2.5 py-0.5">{cp.altitude}m Alt</Badge>
                        <span className="text-[10px] text-[#f27d26] font-mono uppercase tracking-widest font-black">{cp.distance}km Mark</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full flex flex-col space-y-4">
                    <div>
                      <p className="text-xs sm:text-sm text-brand-muted leading-relaxed italic font-medium opacity-80 mb-3">{cp.description}</p>
                      <div className="flex flex-wrap gap-2 select-none">
                        {cp.hasWater && <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[9px] uppercase tracking-[0.1em] px-2.5 py-0.5 font-black">Potable Water</Badge>}
                        {cp.hasCampsite && <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[9px] uppercase tracking-[0.1em] px-2.5 py-0.5 font-black">Campsite Ground</Badge>}
                      </div>
                    </div>

                    {/* Check-In Lodges & Homestays nearby or in-between */}
                    {cp.accommodations && cp.accommodations.length > 0 && (
                      <div className="border-t border-white/5 pt-4 space-y-3 w-full">
                        <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#f27d26] font-black">
                          <Home size={12} />
                          <span>Check-In Lodging & Traditional Homestays</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                          {cp.accommodations.map((acc, accIdx) => (
                            <div key={acc.id || accIdx} className="bg-black/30 border border-white/5 hover:border-brand-primary/20 p-4 rounded-xl transition-all flex flex-col justify-between group/card w-full">
                              <div className="space-y-1.5">
                                <div className="flex justify-between items-start gap-2">
                                  <p className="font-bold text-xs sm:text-sm text-white group-hover/card:text-brand-primary transition-colors leading-tight">{acc.name}</p>
                                  <span className="text-yellow-400 font-mono text-[10px] font-black shrink-0">★ {acc.rating}</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5 items-center">
                                  <span className="text-[9px] text-[#f27d26] bg-[#f27d26]/10 font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm">{acc.type}</span>
                                  <span className="text-[9px] text-brand-muted font-mono font-bold uppercase">{acc.priceRange}</span>
                                </div>
                                <p className="text-xs text-brand-muted leading-relaxed pt-1 font-medium">{acc.description}</p>
                              </div>
                              {acc.amenities && acc.amenities.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-3 border-t border-white/5 pt-2">
                                  {acc.amenities.map((am, amIdx) => (
                                    <span key={amIdx} className="text-[9px] font-mono text-white/50 bg-white/5 px-2 py-0.5 rounded-sm border border-white/5">{am}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Integrated dynamic local Amenities presence */}
                    {cp.amenities && cp.amenities.length > 0 && (
                      <div className="border-t border-white/5 pt-4 space-y-2 w-full">
                        <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-emerald-400 font-black">
                          <Wifi size={12} />
                          <span>Trackside Amenities & Emergency Services</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 w-full">
                          {cp.amenities.map((am, amIdx) => (
                            <div key={amIdx} className="p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors flex items-start gap-2.5 w-full">
                              <span className="text-sm select-none pt-0.5 shrink-0">
                                {am.type === 'Power' ? '🔌' : am.type === 'Medical' ? '🚑' : am.type === 'Water' ? '💧' : am.type === 'Connectivity' ? '📡' : am.type === 'Safety' ? '🛡️' : '🛒'}
                              </span>
                              <div className="min-w-0">
                                <p className="font-bold text-xs text-white leading-tight">{am.name}</p>
                                <p className="text-[10px] text-brand-muted leading-relaxed mt-0.5">{am.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            )}

            {/* 2. Scenic Landmarks Tab Content */}
            {activeTab === 'landmarks' && (
              <div className="mt-6 space-y-6 w-full max-w-full overflow-hidden">
              <Card className="bg-white/5 border-white/10 tech-border overflow-hidden rounded-2xl">
                <CardHeader className="pb-3 border-b border-white/5 bg-white/5">
                  <CardTitle className="text-xs font-mono uppercase tracking-widest text-[#f27d26] flex items-center gap-2">
                    <MapIcon size={14} />
                    Scenic Landmarks & Natural Points of Interest
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {trek.landmarks?.map((lm, i) => (
                      <div key={i} className="p-5 bg-[#0a0a0a]/60 rounded-2xl border border-white/5 flex items-center gap-4 hover:border-brand-primary/20 transition-all group">
                        <div className="w-12 h-12 shrink-0 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary font-display font-black text-lg group-hover:bg-brand-primary group-hover:text-white transition-all shadow-lg shadow-brand-primary/10 select-none">
                          🏔️
                        </div>
                        <div>
                          <p className="font-bold text-sm sm:text-base text-white group-hover:text-brand-primary transition-colors">{lm.name}</p>
                          <p className="text-[10px] text-brand-muted font-mono uppercase tracking-widest mt-1">{lm.type} • {lm.distance}km Mark</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            )}

            {/* 3. Trail Intelligence Feed (Intel) Content */}
            {activeTab === 'community' && (
              <div className="mt-6 space-y-6 w-full max-w-full overflow-hidden">
              <Card className="bg-white/5 border-white/10 rounded-2xl overflow-hidden tech-border">
                <CardHeader className="pb-4 border-b border-white/5 bg-white/5">
                  <CardTitle className="text-xs font-mono uppercase tracking-widest text-[#f27d26] flex items-center gap-2">
                    <MessageSquare size={14} />
                    Submit Trail Intel
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmitUpdate} className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <select 
                        value={updateType}
                        onChange={(e) => setUpdateType(e.target.value)}
                        className="w-full sm:w-auto bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-primary h-11"
                      >
                        <option value="General">General</option>
                        <option value="Weather">Weather Alert</option>
                        <option value="Trail Blocked">Hazard Report</option>
                        <option value="Water Source">Resource Point</option>
                      </select>
                      <div className="flex flex-1 gap-2">
                        <input 
                          value={newUpdate}
                          onChange={(e) => setNewUpdate(e.target.value)}
                          placeholder="Broadcast live satellite update..."
                          className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-primary h-11"
                        />
                        <Button type="submit" size="icon" className="bg-brand-primary hover:bg-brand-primary/90 shrink-0 h-11 w-11 rounded-xl">
                          <Send size={18} />
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {updates.length === 0 ? (
                  <div className="text-center py-16 bg-white/5 rounded-2xl border border-dashed border-white/10 tech-border">
                    <MessageSquare size={32} className="text-brand-muted mx-auto mb-4 opacity-20" />
                    <p className="text-brand-muted text-xs uppercase tracking-widest">No intelligence shared yet</p>
                  </div>
                ) : (
                  updates.map((update) => (
                    <div key={update.id} className="p-5 bg-white/5 rounded-2xl border border-white/5 flex gap-4 hover:bg-white/10 transition-colors tech-border">
                      <div className="w-10 h-10 rounded-xl bg-brand-primary/10 shrink-0 flex items-center justify-center text-brand-primary">
                        <Activity size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2 w-full">
                          <div className="flex flex-col gap-1">
                            <span className="font-bold text-sm leading-none break-all sm:break-normal">{update.authorName}</span>
                            <Badge variant="outline" className="w-fit text-[9px] py-0 px-1.5 border-brand-primary/30 text-brand-primary font-mono uppercase tracking-wider h-4">
                              {update.type}
                            </Badge>
                          </div>
                          <span className="text-[9px] text-brand-muted flex items-center gap-1 font-mono uppercase shrink-0">
                            <Clock size={10} />
                            {update.timestamp instanceof Timestamp ? formatDistanceToNow(update.timestamp.toDate(), { addSuffix: true }) : 'Active Now'}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-brand-muted leading-relaxed break-words">{update.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            )}

            {/* 4. Live Share Broadcast (Share) Content */}
            {activeTab === 'live' && (
              <div className="mt-6 space-y-6 w-full max-w-full overflow-hidden">
              <Card className="bg-white/5 border-white/10 rounded-2xl overflow-hidden tech-border">
                <CardHeader className="pb-4 border-b border-white/5 bg-white/5">
                  <CardTitle className="text-xs font-mono uppercase tracking-widest text-[#f27d26] flex items-center gap-2">
                    <Share2 size={14} />
                    Live Location Sharing
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between p-5 bg-[#0a0a0a]/60 rounded-2xl border border-white/5 gap-4">
                    <div className="text-center sm:text-left">
                      <p className="font-bold text-sm sm:text-base">Satellite Uplink</p>
                      <p className="text-[10px] sm:text-xs text-brand-muted">Broadcast your mission coordinates.</p>
                    </div>
                    <Button 
                      variant={isSharing ? "destructive" : "outline"}
                      onClick={() => setIsSharing(!isSharing)}
                      disabled={!isTracking}
                      className="w-full sm:w-auto h-10 text-xs font-bold px-6"
                    >
                      {isSharing ? "TERMINATE" : "ACTIVATE"}
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[9px] font-mono text-brand-muted uppercase tracking-widest block px-1">Recipient Registry</label>
                    <div className="flex gap-2">
                      <input 
                        value={shareEmail}
                        onChange={(e) => setShareEmail(e.target.value)}
                        placeholder="Enter contact email..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-primary h-11"
                      />
                      <Button onClick={handleAddShareEmail} variant="secondary" className="h-11 px-6 rounded-xl font-bold">ADD</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {shareEmails.map(email => (
                        <Badge key={email} variant="secondary" className="flex items-center gap-2 py-1.5 px-3 bg-white/10 text-white border-0 rounded-lg">
                          {email}
                          <X size={12} className="cursor-pointer" onClick={() => setShareEmails(shareEmails.filter(e => e !== email))} />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {userLocation && (
                    <div className="p-5 bg-brand-primary/5 rounded-2xl border border-brand-primary/20">
                      <div className="flex items-center gap-3 mb-3">
                        <LocateFixed size={16} className="text-brand-primary" />
                        <span className="text-xs font-bold uppercase tracking-widest">GPS Coordinates</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-[9px] text-brand-muted uppercase mb-1">Latitude</p>
                          <p className="text-sm font-mono font-bold">{userLocation[0].toFixed(6)}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-brand-muted uppercase mb-1">Longitude</p>
                          <p className="text-sm font-mono font-bold">{userLocation[1].toFixed(6)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            )}

            {/* 5. Tailored Gear & Safety Packing (Packing) Tab Content */}
            {activeTab === 'packing' && (
              <div className="mt-6 space-y-6 w-full max-w-full overflow-hidden">
              <Card className="bg-white/5 border-white/10 tech-border overflow-hidden rounded-2xl">
                <CardHeader className="pb-3 border-b border-white/5 bg-white/5">
                  <CardTitle className="text-xs font-mono uppercase tracking-widest text-[#f27d26] flex items-center gap-2">
                    <ShieldCheck size={14} />
                    {routeType === 'summit' ? 'Extreme Altitude Expedition Packing Protocol' : 'Standard Base Camp Scenic Packing Checklist'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    <div className="space-y-4">
                      <div className="border-b border-white/5 pb-2">
                        <h5 className="text-xs sm:text-sm font-mono uppercase tracking-widest text-brand-primary font-bold">Recommended Body Gear & Clothing</h5>
                      </div>
                      <ul className="space-y-3">
                        {routeType === 'summit' ? (
                          <>
                            <li className="flex items-start gap-3 text-xs sm:text-sm text-brand-muted"><CheckCircle2 size={16} className="text-brand-primary shrink-0 mt-0.5" /> <strong>Technical Outer Parka</strong>: Sub-zero expedition down jacket rated to -25°C.</li>
                            <li className="flex items-start gap-3 text-xs sm:text-sm text-brand-muted"><CheckCircle2 size={16} className="text-brand-primary shrink-0 mt-0.5" /> <strong>Double Mountaineering Boots</strong>: Reinforced plastic/insulated boots with auto-crampon compatibility.</li>
                            <li className="flex items-start gap-3 text-xs sm:text-sm text-brand-muted"><CheckCircle2 size={16} className="text-brand-primary shrink-0 mt-0.5" /> <strong>Gore-Tex Shell Layers</strong>: 3-layer windproof and waterproof storm bib trousers and hooded jacket.</li>
                            <li className="flex items-start gap-3 text-xs sm:text-sm text-brand-muted"><CheckCircle2 size={16} className="text-brand-primary shrink-0 mt-0.5" /> <strong>High-Altitude Alpine Mitts</strong>: Heavily insulated leather gloves with windguards.</li>
                          </>
                        ) : (
                          <>
                            <li className="flex items-start gap-3 text-xs sm:text-sm text-brand-muted"><CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" /> <strong>Mid-Cut Hiking Boots</strong>: Standard broken-in leather boots with deep Vibram traction treads.</li>
                            <li className="flex items-start gap-3 text-xs sm:text-sm text-brand-muted"><CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" /> <strong>Thermal Fleece Jacket</strong>: Fleece or ultra-lightweight packable synthetic down layer.</li>
                            <li className="flex items-start gap-3 text-xs sm:text-sm text-brand-muted"><CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" /> <strong>Moisture-Wicking Tops</strong>: Breathable synthetic base layers (avoid cotton).</li>
                            <li className="flex items-start gap-3 text-xs sm:text-sm text-brand-muted"><CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" /> <strong>Convertible Trekking Pants</strong>: Ripstop nylon hiking pants with dirt-repellent weave.</li>
                          </>
                        )}
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <div className="border-b border-white/5 pb-2">
                        <h5 className="text-xs sm:text-sm font-mono uppercase tracking-widest text-[#f27d26] font-bold">Survival, Hardware & Medical Kits</h5>
                      </div>
                      <ul className="space-y-3">
                        {routeType === 'summit' ? (
                          <>
                            <li className="flex items-start gap-3 text-xs sm:text-sm text-brand-muted"><CheckCircle2 size={16} className="text-[#f27d26] shrink-0 mt-0.5" /> <strong>Technical Alpine Harness</strong>: Load-bearing security webbing with quick-release gear loops.</li>
                            <li className="flex items-start gap-3 text-xs sm:text-sm text-brand-muted"><CheckCircle2 size={16} className="text-[#f27d26] shrink-0 mt-0.5" /> <strong>Steel Ice Axe & Crampons</strong>: 12-point walking or climbing crampons with carry bag.</li>
                            <li className="flex items-start gap-3 text-xs sm:text-sm text-brand-muted"><CheckCircle2 size={16} className="text-[#f27d26] shrink-0 mt-0.5" /> <strong>Emergency Oxygen Regulator</strong>: Vital backup breathing flow apparatus with fully synced tank.</li>
                            <li className="flex items-start gap-3 text-xs sm:text-sm text-brand-muted"><CheckCircle2 size={16} className="text-[#f27d26] shrink-0 mt-0.5" /> <strong>Satellite Emergency Beacon</strong>: InReach or similar active beacon for SOS distress loops.</li>
                          </>
                        ) : (
                          <>
                            <li className="flex items-start gap-3 text-xs sm:text-sm text-brand-muted"><CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" /> <strong>Carbon Trekking Poles</strong>: Dual telescopic shock-absorbent trail poles.</li>
                            <li className="flex items-start gap-3 text-xs sm:text-sm text-brand-muted"><CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" /> <strong>Membrane Safety Water Bottle</strong>: 1L wide-mouthed bottle with chemical microfilters.</li>
                            <li className="flex items-start gap-3 text-xs sm:text-sm text-brand-muted"><CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" /> <strong>General Trail Medical Kit</strong>: Blister patches, altitude meds, rehydration salts.</li>
                            <li className="flex items-start gap-3 text-xs sm:text-sm text-brand-muted"><CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" /> <strong>Solar Device Charger</strong>: Packable solar grid backing to charge devices on-trail.</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Security Mapping Cache Uplink Modal Overlay */}
      <AnimatePresence>
        {downloading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#151619] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative overflow-hidden tech-border"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 overflow-hidden">
                <motion.div 
                  className="h-full bg-brand-primary" 
                  style={{ width: `${downloadProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <div className="flex flex-col items-center text-center space-y-6 pt-4">
                <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary animate-pulse border border-brand-primary/20">
                  <MapIcon className="w-8 h-8" />
                </div>

                <div className="space-y-1.5 w-full">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-black text-brand-primary">MAP OFFLINE COMPILING GRID</span>
                  <h3 className="text-lg sm:text-xl font-bold font-display uppercase tracking-tight text-white">Downloading Offline Intel</h3>
                  <p className="text-xs text-brand-muted font-medium italic mt-1 min-h-[40px] px-2 leading-relaxed">
                    "{downloadStep}"
                  </p>
                </div>

                {/* Progress gauge */}
                <div className="w-full space-y-2">
                  <div className="flex justify-between text-[10px] font-mono text-brand-muted uppercase tracking-widest px-1">
                    <span>COMPILE MATRIX</span>
                    <span className="text-white font-black">{downloadProgress}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      className="h-full bg-brand-primary rounded-full animate-pulse" 
                      style={{ width: `${downloadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                <div className="text-[9px] font-mono text-brand-muted uppercase tracking-wider text-white/40 pt-2 border-t border-white/5 w-full">
                   Generates physical track files (.GPX) + Lodges and Homestays directories (.JSON).
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
