import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Cloud, 
  Wind, 
  Droplets, 
  Thermometer, 
  Zap, 
  Activity, 
  Heart, 
  Scale, 
  Package, 
  CheckCircle2, 
  AlertTriangle, 
  Phone, 
  ShieldAlert,
  Navigation,
  MapPin
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// --- Weather Intelligence Module ---
export function WeatherModule() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h2 className="text-2xl sm:text-4xl font-display font-bold">Weather Intelligence</h2>
          <p className="text-xs sm:text-sm text-brand-muted">Global Satellite Data • {time.toLocaleTimeString()}</p>
        </div>
        <Badge className="w-fit bg-brand-primary/10 text-brand-primary border-brand-primary/20">Live Sync</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/5 border-white/10 tech-border md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xs sm:text-sm font-mono uppercase tracking-widest text-brand-muted flex items-center gap-2">
              <Cloud size={16} className="text-brand-primary" />
              Precipitation Radar
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64 sm:h-80 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,#f27d26_0%,transparent_70%)] animate-pulse" />
            <div className="text-center z-10">
              <Zap size={48} className="text-brand-primary mx-auto mb-4" />
              <p className="text-brand-muted font-mono text-xs">SCANNING ATMOSPHERIC LAYERS...</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-brand-muted text-sm">Wind Velocity</span>
                <Wind size={20} className="text-brand-primary" />
              </div>
              <div className="text-3xl font-display font-bold">24 <span className="text-sm text-brand-muted">km/h</span></div>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className="bg-brand-primary h-full w-[40%]" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-brand-muted text-sm">Humidity Index</span>
                <Droplets size={20} className="text-blue-400" />
              </div>
              <div className="text-3xl font-display font-bold">68 <span className="text-sm text-brand-muted">%</span></div>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className="bg-blue-400 h-full w-[68%]" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-brand-muted text-sm">UV Exposure</span>
                <Zap size={20} className="text-yellow-500" />
              </div>
              <div className="text-3xl font-display font-bold">High <span className="text-sm text-brand-muted">Level 7</span></div>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className="bg-yellow-500 h-full w-[70%]" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

// --- Health Monitor Module ---
export function HealthModule() {
  const heartRateData = Array.from({ length: 20 }, (_, i) => ({
    time: i,
    bpm: 70 + Math.floor(Math.random() * 40)
  }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl sm:text-4xl font-display font-bold">Biometric Intelligence</h2>
        <p className="text-xs sm:text-sm text-brand-muted">Real-time Vitals & Altitude Adaptation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/5 border-white/10 md:col-span-3 order-2 md:order-1">
          <CardHeader>
            <CardTitle className="text-xs sm:text-sm font-mono uppercase tracking-widest text-brand-muted flex items-center gap-2">
              <Activity size={16} className="text-brand-primary" />
              Heart Rate Analysis (BPM)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={heartRateData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis stroke="#8e9299" fontSize={10} domain={[60, 120]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#151619', border: '1px solid #ffffff10', borderRadius: '8px' }}
                  itemStyle={{ color: '#f27d26' }}
                />
                <Line type="monotone" dataKey="bpm" stroke="#f27d26" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6 text-center">
              <Heart className="text-red-500 mx-auto mb-2 animate-pulse" size={32} />
              <p className="text-xs text-brand-muted uppercase font-mono mb-1">Current BPM</p>
              <p className="text-3xl font-display font-bold">84</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6 text-center">
              <Activity className="text-blue-400 mx-auto mb-2" size={32} />
              <p className="text-xs text-brand-muted uppercase font-mono mb-1">SpO2 Level</p>
              <p className="text-3xl font-display font-bold">98%</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

// --- Packing Assistant Module ---
export function PackingModule() {
  const [items, setItems] = useState([
    { id: 1, name: 'Trekking Boots', category: 'Gear', checked: true },
    { id: 2, name: 'Waterproof Jacket', category: 'Clothing', checked: false },
    { id: 3, name: 'First Aid Kit', category: 'Safety', checked: true },
    { id: 4, name: 'Headlamp', category: 'Gear', checked: false },
    { id: 5, name: 'Altitude Meds', category: 'Health', checked: false },
  ]);

  const toggleItem = (id: number) => {
    setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h2 className="text-2xl sm:text-4xl font-display font-bold">Packing Assistant</h2>
          <p className="text-xs sm:text-sm text-brand-muted">Mission Readiness Checklist</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-2xl sm:text-3xl font-display font-bold text-brand-primary">
            {Math.round((items.filter(i => i.checked).length / items.length) * 100)}%
          </p>
          <p className="text-[8px] sm:text-[10px] text-brand-muted uppercase font-mono tracking-widest">Readiness Score</p>
        </div>
      </div>

      <div className="space-y-4">
        {items.map(item => (
          <div 
            key={item.id} 
            onClick={() => toggleItem(item.id)}
            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
              item.checked ? 'bg-brand-primary/10 border-brand-primary/30' : 'bg-white/5 border-white/10 hover:border-white/20'
            }`}
          >
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              item.checked ? 'bg-brand-primary border-brand-primary' : 'border-white/20'
            }`}>
              {item.checked && <CheckCircle2 size={14} className="text-white" />}
            </div>
            <div className="flex-1">
              <p className={`font-medium ${item.checked ? 'text-white' : 'text-brand-muted'}`}>{item.name}</p>
              <p className="text-[10px] text-brand-muted uppercase font-mono">{item.category}</p>
            </div>
            <Badge variant="outline" className="opacity-50">{item.category}</Badge>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// --- Safety & SOS Module ---
export function SafetyModule() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
          <ShieldAlert size={32} className="text-red-500" />
        </div>
        <h2 className="text-2xl sm:text-4xl font-display font-bold">Safety & SOS</h2>
        <p className="text-xs sm:text-sm text-brand-muted">Emergency Response Protocol • Global Active</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-red-500/5 border-red-500/20 tech-border">
          <CardHeader>
            <CardTitle className="text-xs sm:text-sm font-mono uppercase tracking-widest text-red-500 flex items-center gap-2">
              <AlertTriangle size={16} />
              Emergency SOS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-xs sm:text-sm text-brand-muted">Pressing the button below will broadcast your GPS coordinates to local rescue teams and your emergency contacts.</p>
            <Button className="w-full bg-red-500 hover:bg-red-600 h-16 sm:h-20 text-lg sm:text-xl font-bold rounded-2xl shadow-2xl shadow-red-500/20">
              ACTIVATE SOS
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-sm font-mono uppercase tracking-widest text-brand-muted">Emergency Contacts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <div>
                  <p className="text-sm font-bold">Local Rescue (Nepal)</p>
                  <p className="text-xs text-brand-muted">+977 1-4410000</p>
                </div>
                <Button variant="ghost" size="icon"><Phone size={16} className="text-brand-primary" /></Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <div>
                  <p className="text-sm font-bold">Emergency Contact 1</p>
                  <p className="text-xs text-brand-muted">+1 555-0123</p>
                </div>
                <Button variant="ghost" size="icon"><Phone size={16} className="text-brand-primary" /></Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
