'use client';

import { motion } from 'framer-motion';
import { Heart, Star, Users, Sparkles, Play, Download, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Game } from '@/lib/games-data';
import { useGameStore } from '@/lib/store';

interface GameCardProps {
  game: Game;
  index?: number;
}

export function GameCard({ game, index = 0 }: GameCardProps) {
  const { setCurrentGame, toggleFavorite, favorites, user } = useGameStore();
  const isFavorite = favorites.includes(game.id);

  const handleClick = () => {
    setCurrentGame(game);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(game.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card 
        className="relative overflow-hidden bg-gradient-to-br from-purple-900/80 to-purple-950/80 border-purple-700/50 hover:border-yellow-500/50 transition-all duration-300 cursor-pointer"
        onClick={handleClick}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={game.thumbnail}
            alt={game.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Read More Button */}
          <motion.div
            initial={false}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClick}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30"
            >
              <Eye className="h-7 w-7 text-black" />
            </motion.button>
          </motion.div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {game.isNew && (
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-[10px] px-2 py-0.5">
                NEW
              </Badge>
            )}
            {game.isFeatured && (
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black border-0 text-[10px] px-2 py-0.5">
                <Sparkles className="h-3 w-3 mr-0.5" />
                HOT
              </Badge>
            )}
            {game.isPopular && (
              <Badge className="bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0 text-[10px] px-2 py-0.5">
                <Users className="h-3 w-3 mr-0.5" />
                POPULAR
              </Badge>
            )}
          </div>

          {/* Favorite Button */}
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleFavorite}
            className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isFavorite
                ? 'bg-red-500 text-white'
                : 'bg-black/50 text-white hover:bg-red-500/50'
            }`}
          >
            <Heart className="h-4 w-4" fill={isFavorite ? 'currentColor' : 'none'} />
          </motion.button>

          {/* Jackpot Badge */}
          {game.jackpot && (
            <div className="absolute bottom-2 left-2 right-2">
              <div className="bg-gradient-to-r from-yellow-500/90 to-orange-500/90 rounded-lg px-2 py-1 text-center backdrop-blur-sm">
                <p className="text-[10px] text-black/70">JACKPOT</p>
                <p className="text-sm font-bold text-black">{game.jackpot.toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-3">
          <h3 className="font-bold text-white text-sm truncate group-hover:text-yellow-400 transition-colors">
            {game.name}
          </h3>
          
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-purple-300">{game.provider}</p>
            {game.rtp && (
              <p className="text-xs text-green-400">RTP: {game.rtp}%</p>
            )}
          </div>

          {/* Bet Range */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-purple-700/30">
            <div className="text-xs text-purple-400">
              Min: <span className="text-white">{game.minBet}</span>
            </div>
            <div className="text-xs text-purple-400">
              Max: <span className="text-white">{game.maxBet.toLocaleString()}</span>
            </div>
          </div>

          {/* Read More Button */}
          <Button
            size="sm"
            className="w-full mt-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white text-xs"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            <Eye className="h-3 w-3 mr-1" />
            Read More
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
