import React, { useEffect, useMemo, useRef } from 'react';
import Map, { Marker, Popup, Source, Layer, NavigationControl, MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapPin, Flag, AlertTriangle, Info, Activity, Crosshair, Compass, Layers } from 'lucide-react';

interface MapComponentProps {
  center: [number, number];
  zoom: number;
  points?: Array<{ name: string; position: [number, number]; type?: 'start' | 'end' | 'checkpoint' | 'alert' }>;
  path?: Array<[number, number]>;
  hoveredPoint?: [number, number] | null;
  userLocation?: [number, number] | null;
}

export function MapComponent({ center, zoom, points, path, hoveredPoint, userLocation }: MapComponentProps) {
  const mapRef = useRef<MapRef>(null);

  const [isOrbiting, setIsOrbiting] = React.useState(false);
  const [mapStyle, setMapStyle] = React.useState<'dark' | 'satellite'>('dark');
  const [viewState, setViewState] = React.useState({
    longitude: center[1],
    latitude: center[0],
    zoom: zoom
  });

  // Update viewState when center/zoom props change
  useEffect(() => {
    setViewState({
      longitude: center[1],
      latitude: center[0],
      zoom: zoom
    });
  }, [center, zoom]);

  const centerOnUser = () => {
    if (mapRef.current && userLocation) {
      mapRef.current.flyTo({
        center: [userLocation[1], userLocation[0]],
        zoom: 14,
        duration: 2000
      });
    }
  };

  const toggleOrbit = () => {
    setIsOrbiting(!isOrbiting);
  };

  const toggleStyle = () => {
    setMapStyle(prev => prev === 'dark' ? 'satellite' : 'dark');
  };

  // Sync map view with center/zoom props
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [center[1], center[0]], // MapLibre uses [lng, lat]
        zoom: zoom,
        pitch: 65, // More dramatic pitch for mountains
        bearing: 0,
        duration: 3000,
        essential: true
      });
    }
  }, [center, zoom]);

  // Orbit Animation
  useEffect(() => {
    let animationId: number;
    const orbit = () => {
      if (isOrbiting && mapRef.current) {
        const map = mapRef.current.getMap();
        map.setBearing(map.getBearing() + 0.1);
        animationId = requestAnimationFrame(orbit);
      }
    };

    if (isOrbiting) {
      animationId = requestAnimationFrame(orbit);
    }

    return () => cancelAnimationFrame(animationId);
  }, [isOrbiting]);

  // Convert path to GeoJSON
  const pathData = useMemo(() => {
    if (!path) return null;
    return {
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'LineString' as const,
        coordinates: path.map(p => [p[1], p[0]]) // [lng, lat]
      }
    };
  }, [path]);

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden border border-white/10 relative group bg-[#050505]">
      {/* Tech Overlay */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 p-2 rounded-lg text-[10px] font-mono uppercase tracking-widest text-brand-muted">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isOrbiting ? 'bg-orange-500 animate-ping' : 'bg-brand-primary animate-pulse'}`} />
            <span>{isOrbiting ? '3D SCOUT MODE: ACTIVE' : '3D TERRAIN SYSTEM: STANDBY'}</span>
          </div>
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-12 z-10 flex flex-col gap-2">
        <button 
          onClick={toggleStyle}
          className={`p-2 backdrop-blur-md border border-white/10 rounded-lg transition-all ${mapStyle === 'satellite' ? 'bg-brand-primary text-white' : 'bg-[#0a0a0a]/80 text-brand-muted hover:text-brand-primary'}`}
          title="Toggle Satellite View"
        >
          <Layers size={18} />
        </button>
        <button 
          onClick={toggleOrbit}
          className={`p-2 backdrop-blur-md border border-white/10 rounded-lg transition-all ${isOrbiting ? 'bg-brand-primary text-white shadow-[0_0_15px_rgba(242,125,38,0.5)]' : 'bg-[#0a0a0a]/80 text-brand-muted hover:text-brand-primary'}`}
          title="Toggle 3D Orbit Scout"
        >
          <Compass size={18} className={isOrbiting ? 'animate-spin' : ''} />
        </button>
        {userLocation && (
          <button 
            onClick={centerOnUser}
            className="p-2 bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 rounded-lg text-brand-muted hover:text-brand-primary transition-colors"
            title="Center on My Location"
          >
            <Crosshair size={18} />
          </button>
        )}
      </div>

      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        terrain={{ source: 'terrain', exaggeration: 2.0 }}
        maxPitch={85}
        onLoad={(e) => {
          const map = e.target;
          // Add Hillshading for better depth perception
          if (!map.getSource('hillshade')) {
            map.addSource('hillshade', {
              type: 'raster-dem',
              url: 'https://demotiles.maplibre.org/terrain-tiles/tiles.json',
              tileSize: 256
            });
            map.addLayer({
              id: 'hills',
              type: 'hillshade',
              source: 'hillshade',
              paint: {
                'hillshade-shadow-color': '#000000',
                'hillshade-highlight-color': '#ffffff',
                'hillshade-accent-color': '#f27d26'
              }
            }, 'trail-line-glow');
          }
        }}
      >
        <Source
          id="satellite"
          type="raster"
          tiles={['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}']}
          tileSize={256}
          attribution="Tiles &copy; Esri"
        />
        
        <Layer
          id="satellite-sync"
          type="raster"
          source="satellite"
          paint={{
            'raster-opacity': mapStyle === 'satellite' ? 1 : 0,
            'raster-opacity-transition': { duration: 800 }
          }}
        />

        <Source
          id="terrain"
          type="raster-dem"
          url="https://demotiles.maplibre.org/terrain-tiles/tiles.json"
          tileSize={256}
        />

        <NavigationControl position="top-right" />

        {/* Trail Path */}
        {pathData && (
          <Source id="trail-path" type="geojson" data={pathData}>
            <Layer
              id="trail-line-glow"
              type="line"
              paint={{
                'line-color': '#f27d26',
                'line-width': 8,
                'line-opacity': 0.15,
                'line-blur': 4
              }}
            />
            <Layer
              id="trail-line"
              type="line"
              layout={{
                'line-join': 'round',
                'line-cap': 'round'
              }}
              paint={{
                'line-color': '#f27d26',
                'line-width': 3,
                'line-opacity': 0.8
              }}
            />
          </Source>
        )}

        {/* Points & Markers */}
        {points?.map((p, i) => (
          <Marker
            key={i}
            longitude={p.position[1]}
            latitude={p.position[0]}
            anchor="bottom"
          >
            <div className="cursor-pointer group/marker">
              <div className="transform transition-transform group-hover/marker:scale-125">
                {p.type === 'start' && <Flag size={24} className="text-green-500 drop-shadow-lg" fill="#10b98120" />}
                {p.type === 'end' && <MapPin size={24} className="text-brand-primary drop-shadow-lg" fill="#f27d2620" />}
                {p.type === 'alert' && <AlertTriangle size={24} className="text-red-500 drop-shadow-lg" fill="#ef444420" />}
                {(!p.type || p.type === 'checkpoint') && <Info size={20} className="text-blue-400 drop-shadow-lg" fill="#3b82f620" />}
              </div>
              
              {/* Custom Tooltip on Hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/marker:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-[#0a0a0a] border border-white/10 p-2 rounded-lg whitespace-nowrap shadow-2xl">
                  <p className="text-xs font-bold text-white">{p.name}</p>
                  <p className="text-[8px] text-brand-muted font-mono uppercase tracking-tighter">
                    {p.position[0].toFixed(4)}, {p.position[1].toFixed(4)}
                  </p>
                </div>
              </div>
            </div>
          </Marker>
        ))}

        {/* Elevation Focus Sync */}
        {hoveredPoint && (
          <Marker longitude={hoveredPoint[1]} latitude={hoveredPoint[0]} anchor="center">
            <div className="relative">
              <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20" />
              <Activity size={20} className="text-white relative z-10" />
            </div>
          </Marker>
        )}

        {/* User Live Location */}
        {userLocation && (
          <Marker longitude={userLocation[1]} latitude={userLocation[0]} anchor="center">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-primary rounded-full animate-ping opacity-40" />
              <div className="w-4 h-4 bg-brand-primary rounded-full border-2 border-white shadow-lg relative z-10" />
            </div>
          </Marker>
        )}
      </Map>

      {/* Grid Overlay for Tech Look */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Mission Metrics Overlay */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none bg-[#0a0a0a]/60 backdrop-blur-md border border-white/5 p-3 rounded-xl flex gap-6 items-center">
        <div className="flex flex-col gap-0.5">
          <p className="text-[8px] text-brand-muted uppercase tracking-widest font-mono font-bold">LATITUDE</p>
          <p className="text-[11px] text-white font-mono font-black">{viewState.latitude.toFixed(6)}°</p>
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="text-[8px] text-brand-muted uppercase tracking-widest font-mono font-bold">LONGITUDE</p>
          <p className="text-[11px] text-white font-mono font-black">{viewState.longitude.toFixed(6)}°</p>
        </div>
        <div className="h-6 w-[1px] bg-white/10" />
        <div className="flex flex-col gap-0.5">
          <p className="text-[8px] text-brand-muted uppercase tracking-widest font-mono font-bold">ZOOM</p>
          <p className="text-[11px] text-brand-primary font-mono font-black">{viewState.zoom.toFixed(1)}x</p>
        </div>
      </div>
    </div>
  );
}


