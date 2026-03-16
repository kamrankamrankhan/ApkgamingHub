'use client';

import { motion } from 'framer-motion';
import { Flame, Star, TrendingUp, Filter } from 'lucide-react';
import { useGameStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface GameFiltersProps {
  onFilterChange?: (filter: string) => void;
}

export default function GameFilters({ onFilterChange }: GameFiltersProps) {
  const { selectedFilter, setSelectedFilter, selectedCategory, setSelectedCategory } = useGameStore();

  const categories = [
    { id: 'all', name: 'All Games', icon: '🎮' },
    { id: 'slots', name: 'Slots', icon: '🎰' },
    { id: 'casino', name: 'Casino', icon: '🎲' },
    { id: 'poker', name: 'Poker', icon: '🃏' },
    { id: 'skill', name: 'Skill', icon: '🎯' },
    { id: 'bingo', name: 'Bingo', icon: '🎱' },
  ];

  const filters = [
    { id: 'all', name: 'All', icon: Filter },
    { id: 'popular', name: 'Popular', icon: Flame },
    { id: 'new', name: 'New', icon: Star },
    { id: 'featured', name: 'Featured', icon: TrendingUp },
  ];

  return (
    <div className="space-y-4">
      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => {
              setSelectedCategory(category.id);
              onFilterChange?.(category.id);
            }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              selectedCategory === category.id
                ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg"
                : "bg-purple-900/30 text-gray-400 hover:bg-purple-800/50 hover:text-white border border-purple-700/30"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </motion.button>
        ))}
      </div>

      {/* Quick Filters */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Quick:</span>
        {filters.map((filter) => {
          const Icon = filter.icon;
          return (
            <motion.button
              key={filter.id}
              onClick={() => {
                setSelectedFilter(filter.id as any);
                onFilterChange?.(filter.id);
              }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                selectedFilter === filter.id
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : "bg-purple-900/20 text-gray-400 hover:bg-purple-800/30 hover:text-white border border-purple-700/20"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{filter.name}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
