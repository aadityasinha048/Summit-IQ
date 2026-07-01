import React, { useState } from 'react';
import { 
  Mountain, 
  Map as MapIcon, 
  Cloud, 
  Shield, 
  Settings, 
  Search, 
  Navigation,
  Activity,
  Package,
  AlertTriangle,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Trek } from './types';
import { MOCK_TREKS } from './mockData';
import { TrekCard } from './components/TrekCard';
import { TrekDetail } from './components/TrekDetail';
import { WeatherModule, HealthModule, PackingModule, SafetyModule } from './components/Modules';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useAuth } from './AuthContext';

export default function App() {
  const { user, loading, login, logout } = useAuth();
  const [selectedTrek, setSelectedTrek] = useState<Trek | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Closed by default on mobile
  const [activeModule, setActiveModule] = useState('Explore Treks');

  const filteredTreks = MOCK_TREKS.filter(trek => 
    trek.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trek.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Mountain className="text-brand-primary animate-pulse" size={48} />
          <p className="text-brand-muted font-mono text-sm tracking-widest">INITIALIZING SUMMIT IQ...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen bg-[#050505] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-brand-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-brand-primary/20">
              <Mountain className="text-white" size={40} />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-display font-bold tracking-tight">SUMMIT<span className="text-brand-primary">IQ</span></h1>
            <p className="text-brand-muted">Global Pre-Trek Intelligence Platform</p>
          </div>
          <Button 
            onClick={login} 
            className="w-full bg-white text-black hover:bg-white/90 h-12 text-lg font-medium rounded-xl"
          >
            Authenticate with Google
          </Button>
          <p className="text-xs text-brand-muted font-mono uppercase tracking-tighter">Secure Access Required for Mission Data</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (selectedTrek) {
      return (
        <TrekDetail 
          trek={selectedTrek} 
          onBack={() => setSelectedTrek(null)} 
        />
      );
    }

    switch (activeModule) {
      case 'Explore Treks':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-7xl mx-auto"
          >
            <div className="mb-10">
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-2">Pre-Trek Intelligence</h2>
              <p className="text-sm sm:text-base text-brand-muted">Select a mission to begin your intelligence briefing.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTreks.map((trek) => (
                <TrekCard 
                  key={trek.id} 
                  trek={trek} 
                  onClick={() => setSelectedTrek(trek)} 
                />
              ))}
            </div>
          </motion.div>
        );
      case 'Weather Intel':
        return <WeatherModule />;
      case 'Health Monitor':
        return <HealthModule />;
      case 'Packing Assistant':
        return <PackingModule />;
      case 'Safety & SOS':
        return <SafetyModule />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      {/* Sidebar Overlay for mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 1024) && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-72 bg-[#0a0a0a] border-r border-white/5 flex flex-col fixed lg:relative h-full z-[70] lg:z-50"
          >
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center">
                  <Mountain className="text-white" size={24} />
                </div>
                <h1 className="text-xl font-display font-bold tracking-tight">SUMMIT<span className="text-brand-primary">IQ</span></h1>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden text-brand-muted hover:bg-white/5"
              >
                <X size={20} />
              </Button>
            </div>

            <nav className="flex-1 px-4 mt-2 space-y-1">
              <SidebarItem 
                icon={<MapIcon size={18} />} 
                label="Explore Treks" 
                active={activeModule === 'Explore Treks'} 
                onClick={() => { setActiveModule('Explore Treks'); setSelectedTrek(null); setIsSidebarOpen(false); }}
              />
              <SidebarItem 
                icon={<Cloud size={18} />} 
                label="Weather Intel" 
                active={activeModule === 'Weather Intel'} 
                onClick={() => { setActiveModule('Weather Intel'); setSelectedTrek(null); setIsSidebarOpen(false); }}
              />
              <SidebarItem 
                icon={<Activity size={18} />} 
                label="Health Monitor" 
                active={activeModule === 'Health Monitor'} 
                onClick={() => { setActiveModule('Health Monitor'); setSelectedTrek(null); setIsSidebarOpen(false); }}
              />
              <SidebarItem 
                icon={<Package size={18} />} 
                label="Packing Assistant" 
                active={activeModule === 'Packing Assistant'} 
                onClick={() => { setActiveModule('Packing Assistant'); setSelectedTrek(null); setIsSidebarOpen(false); }}
              />
              <SidebarItem 
                icon={<Shield size={18} />} 
                label="Safety & SOS" 
                active={activeModule === 'Safety & SOS'} 
                onClick={() => { setActiveModule('Safety & SOS'); setSelectedTrek(null); setIsSidebarOpen(false); }}
              />
            </nav>

            <div className="p-4 border-t border-white/5">
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                <img 
                  src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
                  className="w-10 h-10 rounded-full border border-white/10" 
                  alt="Avatar"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.displayName}</p>
                  <p className="text-xs text-brand-muted truncate">{user.email}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={logout}
                  className="text-brand-muted hover:text-red-500 opacity-60 group-hover:opacity-100 transition-opacity ml-1"
                >
                  <X size={16} />
                </Button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-4 lg:px-6 bg-[#050505]/90 backdrop-blur-md z-40 sticky top-0">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-brand-muted hover:text-white shrink-0"
            >
              <Menu size={22} />
            </Button>
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={14} />
              <Input 
                placeholder="Search intel..." 
                className="pl-9 bg-white/5 border-white/10 focus:border-brand-primary h-9 transition-all text-sm rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 ml-4">
            <div className="hidden xs:flex items-center gap-2 px-2.5 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 text-[10px] font-bold uppercase tracking-wider">
              <AlertTriangle size={10} className="shrink-0" />
              <span className="hidden sm:inline">2 High Risk Alerts</span>
              <span className="sm:hidden">Alerts</span>
            </div>
            <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5 hidden sm:flex h-9 text-xs px-3">
              <Navigation size={14} className="mr-2" />
              Live Nav
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <ErrorBoundary>
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer group
        ${active ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-brand-muted hover:bg-white/5 hover:text-white'}
      `}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
      {active && <ChevronRight size={16} className="ml-auto" />}
    </div>
  );
}

