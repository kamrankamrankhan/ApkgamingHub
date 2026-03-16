'use client';

import { motion } from 'framer-motion';
import { 
  Gamepad2, 
  Coins, 
  Dice5, 
  Club, 
  Target, 
  Grid3x3, 
  Sparkles,
  Heart,
  TrendingUp,
  Star,
  Flame
} from 'lucide-react';
import { useGameStore, ViewType } from '@/lib/store';
import { cn } from '@/lib/utils';

const categories = [
  { id: 'home' as ViewType, name: 'Home', icon: Gamepad2, color: 'from-purple-500 to-purple-600' },
  { id: 'slots' as ViewType, name: 'Slots', icon: Coins, color: 'from-amber-500 to-amber-600' },
  { id: 'casino' as ViewType, name: 'Casino', icon: Dice5, color: 'from-red-500 to-red-600' },
  { id: 'poker' as ViewType, name: 'Poker', icon: Club, color: 'from-green-500 to-green-600' },
  { id: 'skill' as ViewType, name: 'Skill Games', icon: Target, color: 'from-blue-500 to-blue-600' },
  { id: 'bingo' as ViewType, name: 'Bingo', icon: Grid3x3, color: 'from-pink-500 to-pink-600' },
];

const quickFilters = [
  { id: 'all' as const, name: 'All Games', icon: Gamepad2 },
  { id: 'popular' as const, name: 'Popular', icon: Flame },
  { id: 'new' as const, name: 'New', icon: Star },
  { id: 'featured' as const, name: 'Featured', icon: TrendingUp },
  { id: 'favorites' as ViewType, name: 'Favorites', icon: Heart },
];

export default function Sidebar() {
  const { activeView, setActiveView, selectedFilter, setSelectedFilter } = useGameStore();

  return (
    <aside className="hidden lg:block w-64 min-h-[calc(100vh-4rem)] border-r border-purple-900/50 bg-[#0F0A1A]/50">
      <div className="p-4 space-y-6">
        {/* Main Navigation */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
            Categories
          </h3>
          <nav className="space-y-1">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeView === category.id;
              
              return (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveView(category.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                    isActive
                      ? "bg-gradient-to-r " + category.color + " text-white shadow-lg"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{category.name}</span>
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* Quick Filters */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
            Quick Filters
          </h3>
          <nav className="space-y-1">
            {quickFilters.map((filter) => {
              const Icon = filter.icon;
              const isActive = filter.id === 'favorites' 
                ? activeView === 'favorites'
                : selectedFilter === filter.id;
              
              return (
                <motion.button
                  key={filter.id}
                  onClick={() => {
                    if (filter.id === 'favorites') {
                      setActiveView('favorites');
                    } else {
                      setSelectedFilter(filter.id);
                      if (activeView !== 'home') {
                        // Stay on current category view
                      }
                    }
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm",
                    isActive
                      ? "bg-purple-600/30 text-purple-300 border border-purple-500/30"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="h-4 w-4" />
                  <span>{filter.name}</span>
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* VIP Banner */}
        <motion.div
          className="p-4 rounded-xl bg-gradient-to-br from-amber-900/30 to-purple-900/30 border border-amber-700/30"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            <span className="font-semibold text-amber-400">VIP Program</span>
          </div>
          <p className="text-xs text-gray-400 mb-3">
            Join our exclusive VIP club for premium rewards and bonuses!
          </p>
          <button
            onClick={() => setActiveView('vip')}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-sm hover:from-amber-600 hover:to-amber-700 transition-all"
          >
            Learn More
          </button>
        </motion.div>

        {/* Stats Card */}
        <div className="p-4 rounded-xl bg-purple-900/20 border border-purple-700/30">
          <h4 className="text-sm font-semibold text-gray-300 mb-3">Your Stats</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Games Played</span>
              <span className="text-purple-300">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total Wins</span>
              <span className="text-green-400">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Favorite Games</span>
              <span className="text-amber-400">0</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
