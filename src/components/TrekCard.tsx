import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Clock, Mountain, ArrowUpRight } from 'lucide-react';
import { Trek } from '../types';
import { Badge } from './ui/badge';
import { Card, CardContent, CardFooter } from './ui/card';

interface TrekCardProps {
  trek: Trek;
  onClick: () => void;
  key?: string;
}

export function TrekCard({ trek, onClick }: TrekCardProps) {
  const difficultyColor = {
    Easy: 'bg-green-500/10 text-green-500 border-green-500/20',
    Moderate: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    Hard: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    Expert: 'bg-red-500/10 text-red-500 border-red-500/20',
  }[trek.difficulty];

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="cursor-pointer group"
    >
      <Card className="bg-white/5 border-white/10 overflow-hidden hover:border-brand-primary/50 transition-all duration-300">
        <div className="relative h-48 overflow-hidden bg-gray-900/20">
          <img 
            src={trek.images?.[0] || trek.imageUrl || `https://picsum.photos/seed/${trek.id}/800/600`} 
            alt={trek.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
          <Badge className={`absolute top-4 left-4 ${difficultyColor} border`}>
            {trek.difficulty}
          </Badge>
        </div>
        
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-display font-bold group-hover:text-brand-primary transition-colors">{trek.name}</h3>
            <ArrowUpRight size={20} className="text-brand-muted group-hover:text-brand-primary transition-all" />
          </div>
          
          <div className="flex items-center gap-2 text-brand-muted text-sm mb-4">
            <MapPin size={14} />
            <span>{trek.location}</span>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="space-y-1">
              <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-brand-muted font-mono">Distance</p>
              <div className="flex items-center gap-1">
                <Clock size={12} className="text-brand-primary" />
                <span className="text-xs sm:text-sm font-bold">{trek.distance}km</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-brand-muted font-mono">Gain</p>
              <div className="flex items-center gap-1">
                <Mountain size={12} className="text-brand-primary" />
                <span className="text-xs sm:text-sm font-bold">+{trek.elevationGain}m</span>
              </div>
            </div>
            <div className="space-y-1 col-span-2 lg:col-span-1">
              <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-brand-muted font-mono">Duration</p>
              <span className="text-xs sm:text-sm font-bold">{trek.duration}</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="px-5 pb-5 pt-0">
          <div className="flex flex-wrap gap-2">
            {trek.terrain?.map((t, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 bg-white/5 rounded-full text-brand-muted border border-white/5">
                {t}
              </span>
            ))}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
