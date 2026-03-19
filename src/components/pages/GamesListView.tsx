'use client';

import { motion } from 'framer-motion';
import { Search, Sparkles, Star, TrendingUp, Zap } from 'lucide-react';
import { useGameStore } from '@/lib/store';
import { gameCategories } from '@/lib/games-data';
import { GameCard } from '@/components/games/GameCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function GamesListView({ category }: { category: string }) {
  const {
    games,
    searchQuery,
    setSearchQuery,
    filterNew,
    filterPopular,
    filterFeatured,
    toggleFilter,
    gamesLoaded,
  } = useGameStore();

  // Show loading state while fetching games
  if (!gamesLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full"
        />
        <p className="text-purple-300">Loading games...</p>
      </div>
    );
  }

  const filteredGames = games.filter((game) => {
    // Category filter
    if (category !== 'slots' && game.category !== category) return false;

    // Search filter
    if (searchQuery && !game.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;

    // Toggle filters
    if (filterNew && !game.isNew) return false;
    if (filterPopular && !game.isPopular) return false;
    if (filterFeatured && !game.isFeatured) return false;

    return true;
  });

  const categoryInfo = gameCategories.find((c) => c.id === category);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{categoryInfo?.icon}</span>
          <div>
            <h1 className="text-3xl font-bold text-white">{categoryInfo?.name || 'All Games'}</h1>
            <p className="text-purple-300">{filteredGames.length} games available</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" />
          <Input
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-purple-900/50 border-purple-700/50 text-white placeholder:text-purple-400"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filterFeatured ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleFilter('featured')}
          className={
            filterFeatured
              ? 'bg-yellow-500 text-black hover:bg-yellow-400'
              : 'border-purple-600 text-purple-300'
          }
        >
          <Sparkles className="h-4 w-4 mr-1" />
          Featured
        </Button>

        <Button
          variant={filterPopular ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleFilter('popular')}
          className={
            filterPopular
              ? 'bg-pink-500 text-white hover:bg-pink-400'
              : 'border-purple-600 text-purple-300'
          }
        >
          <TrendingUp className="h-4 w-4 mr-1" />
          Popular
        </Button>

        <Button
          variant={filterNew ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleFilter('new')}
          className={
            filterNew ? 'bg-green-500 text-white hover:bg-green-400' : 'border-purple-600 text-purple-300'
          }
        >
          <Zap className="h-4 w-4 mr-1" />
          New
        </Button>
      </div>

      {/* Games Grid */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredGames.map((game, i) => (
            <GameCard key={game.id} game={game} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-purple-400">No games found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}

