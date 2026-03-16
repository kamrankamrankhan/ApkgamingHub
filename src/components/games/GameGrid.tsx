'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Search, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import GameCard from './GameCard';
import { useGameStore, Game } from '@/lib/store';
import { cn } from '@/lib/utils';

interface GameGridProps {
  category?: string;
  filter?: 'all' | 'new' | 'popular' | 'featured';
  showSearch?: boolean;
  showFilters?: boolean;
  limit?: number;
  title?: string;
}

export default function GameGrid({
  category = 'all',
  filter = 'all',
  showSearch = true,
  showFilters = true,
  limit,
  title,
}: GameGridProps) {
  const { searchQuery, setSearchQuery, selectedFilter, setSelectedFilter } = useGameStore();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activeFilter = filter === 'all' ? selectedFilter : filter;

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams();
        if (category !== 'all') params.append('category', category);
        if (activeFilter !== 'all') params.append('filter', activeFilter);
        if (searchQuery) params.append('search', searchQuery);
        if (limit) params.append('limit', String(limit));

        const response = await fetch(`/api/games?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch games');
        
        const data = await response.json();
        setGames(data.games || []);
      } catch (err) {
        console.error('Error fetching games:', err);
        setError('Failed to load games. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [category, activeFilter, searchQuery, limit]);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'new', label: 'New' },
    { id: 'popular', label: 'Popular' },
    { id: 'featured', label: 'Featured' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      {(title || showSearch || showFilters) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {title && (
            <h2 className="text-2xl font-bold text-white">{title}</h2>
          )}
          
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Search */}
            {showSearch && (
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-64 bg-purple-900/30 border-purple-700/50 focus:border-purple-500"
                />
              </div>
            )}

            {/* Filters */}
            {showFilters && (
              <div className="flex items-center gap-2">
                {filters.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFilter(f.id as any)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      activeFilter === f.id
                        ? "bg-purple-600 text-white"
                        : "bg-purple-900/30 text-gray-400 hover:bg-purple-800/50 hover:text-white"
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          <span className="ml-3 text-gray-400">Loading games...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="flex items-center justify-center py-20 text-red-400">
          <AlertCircle className="h-6 w-6 mr-2" />
          <span>{error}</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && games.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No games found</p>
          <p className="text-gray-500 text-sm mt-2">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Games Grid */}
      {!loading && !error && games.length > 0 && (
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <AnimatePresence mode="popLayout">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.03 }}
              >
                <GameCard game={game} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Results count */}
      {!loading && !error && games.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          Showing {games.length} games
        </div>
      )}
    </div>
  );
}
