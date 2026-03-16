'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Sparkles, Star, Gift, Crown, Trophy, 
  Zap, ChevronRight, Play, X, Volume2, VolumeX, 
  Heart, Share2, Maximize, Settings, Clock, Coins,
  TrendingUp, Users, Target, Award, Check, Download,
  ThumbsUp, MessageCircle, Bookmark, Eye, Calendar,
  Info, AlertCircle, Gamepad2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { GameCard } from '@/components/games/GameCard';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AdminPanel, AdminLogin } from '@/components/admin/AdminPanel';
import { useGameStore } from '@/lib/store';
import { gamesData, gameCategories, featuredGames, popularGames, newGames, Game } from '@/lib/games-data';

// Game Blog Content Generator
function getGameBlogContent(game: Game) {
  const categoryContent: Record<string, { overview: string; howToPlay: string; tips: string[]; history: string }> = {
    slots: {
      overview: `${game.name} is an exciting slot machine game that brings the thrill of Vegas right to your screen. With ${game.reels || 5} reels and ${game.paylines || 'multiple'} paylines, this game offers endless entertainment and the chance to win big!`,
      howToPlay: `Playing ${game.name} is simple and straightforward. First, set your bet amount using the controls at the bottom of the screen. You can adjust your bet from ${game.minBet} to ${game.maxBet.toLocaleString()} Twists. Once you've set your bet, hit the spin button and watch the reels come to life! Match symbols across the paylines to win prizes.`,
      tips: [
        'Start with smaller bets to understand the game mechanics',
        'Look out for special symbols like Wilds and Scatters',
        game.features?.includes('Free Spins') ? 'Free Spins can significantly boost your winnings!' : 'Bonus rounds offer extra winning opportunities',
        'Set a budget before playing and stick to it',
        'Higher volatility means bigger but less frequent wins'
      ],
      history: `Slot machines have a rich history dating back to the late 19th century. ${game.name} continues this tradition while incorporating modern graphics and gameplay features that make it a favorite among players worldwide.`
    },
    casino: {
      overview: `${game.name} brings the authentic casino experience to your fingertips. Whether you're a seasoned player or new to casino games, this classic offers excitement and strategy in equal measure.`,
      howToPlay: `Master ${game.name} by understanding the rules and developing your strategy. Place your bets wisely and make decisions based on probability and intuition. The game offers various betting options to suit different playing styles.`,
      tips: [
        'Learn the basic rules before placing large bets',
        'Understand the odds and payouts for each bet type',
        'Practice with smaller bets first',
        'Set win and loss limits for each session',
        'Take breaks to maintain focus'
      ],
      history: `${game.name} has been a staple in casinos around the world for decades. Its enduring popularity speaks to the perfect blend of luck and skill required to play.`
    },
    poker: {
      overview: `${game.name} is one of the most popular poker variants in the world. Test your skills against other players and see if you have what it takes to win the pot!`,
      howToPlay: `In ${game.name}, each player receives their cards and must make the best possible hand. Use your knowledge of poker hand rankings and betting strategies to outplay your opponents. Bluffing, reading opponents, and knowing when to fold are key skills.`,
      tips: [
        'Learn the hand rankings thoroughly',
        'Position is crucial - play tighter from early positions',
        'Don\'t bluff too often, especially against beginners',
        'Manage your bankroll carefully',
        'Practice reading your opponents\' behavior'
      ],
      history: `Poker has evolved over centuries, and ${game.name} has become one of the most beloved variants, played in casinos and homes around the world.`
    },
    skill: {
      overview: `${game.name} combines strategy and skill for a uniquely engaging experience. Unlike pure chance games, your decisions directly influence the outcome!`,
      howToPlay: `Success in ${game.name} requires careful planning and strategic thinking. Study the rules, practice regularly, and develop your own winning strategies. Each game presents new challenges and opportunities.`,
      tips: [
        'Practice regularly to improve your skills',
        'Study different strategies and techniques',
        'Learn from your mistakes',
        'Play against different opponents to gain experience',
        'Stay patient and focused during matches'
      ],
      history: `${game.name} has a long tradition as a game of skill and strategy, enjoyed by players who appreciate mental challenges.`
    },
    bingo: {
      overview: `${game.name} offers fast-paced bingo action with multiple ways to win! Mark off your numbers and shout BINGO to claim your prize!`,
      howToPlay: `Playing ${game.name} is easy - just watch as numbers are called and mark them off your card. Complete a line, pattern, or full house to win! Different patterns offer different payouts.`,
      tips: [
        'Play multiple cards to increase your chances',
        'Pay attention to the numbers being called',
        'Look for games with fewer players for better odds',
        'Set a budget and stick to it',
        'Have fun and enjoy the social aspect!'
      ],
      history: `Bingo has been bringing people together for generations, and ${game.name} continues that tradition in the digital age.`
    }
  };

  return categoryContent[game.category] || categoryContent.slots;
}

// Home View Component
function HomeView() {
  const { setCurrentView, setCurrentGame, user, claimDailyBonus, canClaimBonus, games } = useGameStore();
  
  // Compute featured, popular, and new games from store
  const featuredGames = games.filter(g => g.isFeatured);
  const popularGames = games.filter(g => g.isPopular);
  const newGames = games.filter(g => g.isNew);
  
  // Compute category counts
  const categoryCounts = gameCategories.map(cat => ({
    ...cat,
    count: games.filter(g => g.category === cat.id).length
  }));

  const heroBanners = [
    {
      title: 'Welcome Bonus',
      subtitle: 'Get 10,000 FREE Twists to start playing!',
      cta: 'Explore Games',
      gradient: 'from-yellow-500 via-orange-500 to-red-500'
    },
    {
      title: 'New: Gates of Olympus',
      subtitle: 'Discover the divine world of Zeus!',
      cta: 'Read More',
      gradient: 'from-purple-500 via-pink-500 to-rose-500'
    },
    {
      title: 'VIP Rewards',
      subtitle: 'Level up and unlock exclusive benefits!',
      cta: 'Learn More',
      gradient: 'from-cyan-500 via-blue-500 to-purple-500'
    }
  ];

  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % heroBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBanner}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className={`relative h-64 md:h-80 bg-gradient-to-r ${heroBanners[currentBanner].gradient} rounded-2xl overflow-hidden`}
          >
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-5xl font-bold text-white mb-3"
              >
                {heroBanners[currentBanner].title}
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-lg md:text-xl text-white/90 mb-6"
              >
                {heroBanners[currentBanner].subtitle}
              </motion.p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button 
                  size="lg" 
                  className="bg-white text-black hover:bg-white/90 font-bold px-8"
                  onClick={() => setCurrentView('slots')}
                >
                  {heroBanners[currentBanner].cta}
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-4 left-4 text-6xl opacity-20">🎰</div>
            <div className="absolute bottom-4 right-4 text-6xl opacity-20">🎲</div>
          </motion.div>
        </AnimatePresence>
        
        {/* Banner Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {heroBanners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentBanner(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentBanner ? 'w-6 bg-yellow-500' : 'bg-purple-600'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Game Categories */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Game Categories</h2>
          <Button variant="link" className="text-yellow-400" onClick={() => setCurrentView('slots')}>
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {categoryCounts.map((category, i) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentView(category.id as any)}
              className="p-4 rounded-xl bg-gradient-to-br from-purple-800/50 to-purple-900/50 border border-purple-700/30 hover:border-yellow-500/50 transition-all"
            >
              <div className="text-3xl mb-2">{category.icon}</div>
              <p className="text-sm font-medium text-white">{category.name}</p>
              <p className="text-xs text-purple-400">{category.count} games</p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Most Popular Games */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-pink-400" />
            <h2 className="text-2xl font-bold text-white">Most Popular</h2>
          </div>
          <Button variant="link" className="text-yellow-400" onClick={() => setCurrentView('slots')}>
            See All <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {popularGames.slice(0, 6).map((game, i) => (
            <GameCard key={game.id} game={game} index={i} />
          ))}
        </div>
      </section>

      {/* Featured Games */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">Featured Games</h2>
          </div>
          <Button variant="link" className="text-yellow-400" onClick={() => setCurrentView('slots')}>
            See All <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {featuredGames.slice(0, 6).map((game, i) => (
            <GameCard key={game.id} game={game} index={i} />
          ))}
        </div>
      </section>

      {/* New Games */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-green-400" />
            <h2 className="text-2xl font-bold text-white">New Releases</h2>
          </div>
          <Button variant="link" className="text-yellow-400" onClick={() => setCurrentView('slots')}>
            See All <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {newGames.slice(0, 6).map((game, i) => (
            <GameCard key={game.id} game={game} index={i} />
          ))}
        </div>
      </section>

      {/* Promotions Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Gift className="h-6 w-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Promotions</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              title: 'Daily Bonus',
              description: 'Log in every day to claim your free Twists!',
              icon: Gift,
              color: 'from-green-500 to-emerald-500'
            },
            {
              title: 'VIP Program',
              description: 'Level up and unlock exclusive rewards and benefits.',
              icon: Crown,
              color: 'from-yellow-500 to-orange-500'
            },
            {
              title: 'Tournaments',
              description: 'Compete with other players for big prizes.',
              icon: Trophy,
              color: 'from-purple-500 to-pink-500'
            }
          ].map((promo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="bg-gradient-to-br from-purple-900/50 to-purple-950/50 border-purple-700/30 hover:border-yellow-500/30 transition-all cursor-pointer overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${promo.color}`} />
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${promo.color} flex items-center justify-center`}>
                      <promo.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1">{promo.title}</h3>
                      <p className="text-sm text-purple-300">{promo.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

// Games List View Component
function GamesListView({ category }: { category: string }) {
  const { games, searchQuery, setSearchQuery, filterNew, filterPopular, filterFeatured, toggleFilter } = useGameStore();
  
  const filteredGames = games.filter(game => {
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

  const categoryInfo = gameCategories.find(c => c.id === category);

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
          className={filterFeatured ? 'bg-yellow-500 text-black hover:bg-yellow-400' : 'border-purple-600 text-purple-300'}
        >
          <Sparkles className="h-4 w-4 mr-1" />
          Featured
        </Button>
        <Button
          variant={filterPopular ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleFilter('popular')}
          className={filterPopular ? 'bg-pink-500 text-white hover:bg-pink-400' : 'border-purple-600 text-purple-300'}
        >
          <TrendingUp className="h-4 w-4 mr-1" />
          Popular
        </Button>
        <Button
          variant={filterNew ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleFilter('new')}
          className={filterNew ? 'bg-green-500 text-white hover:bg-green-400' : 'border-purple-600 text-purple-300'}
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

// Game Blog View Component
function GameBlogView() {
  const { currentGame, setCurrentGame, favorites, toggleFavorite, user, games } = useGameStore();
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!currentGame) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-purple-400">No game selected</p>
      </div>
    );
  }

  const blogContent = getGameBlogContent(currentGame);
  const isFavorite = favorites.includes(currentGame.id);

  const handleDownload = () => {
    setDownloading(true);
    // Simulate download
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
    }, 2000);
  };

  // Get related games (same category, excluding current)
  const relatedGames = games
    .filter(g => g.category === currentGame.category && g.id !== currentGame.id)
    .slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="text-purple-300 hover:text-white"
        onClick={() => setCurrentGame(null)}
      >
        <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
        Back to Games
      </Button>

      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden"
      >
        <div className="aspect-[21/9] relative">
          <img
            src={currentGame.bannerImage || currentGame.thumbnail}
            alt={currentGame.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-950 via-purple-950/50 to-transparent" />
        </div>
        
        {/* Game Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {currentGame.isNew && (
                  <Badge className="bg-green-500 text-white">NEW</Badge>
                )}
                {currentGame.isFeatured && (
                  <Badge className="bg-yellow-500 text-black">FEATURED</Badge>
                )}
                {currentGame.isPopular && (
                  <Badge className="bg-pink-500 text-white">POPULAR</Badge>
                )}
                <Badge variant="outline" className="border-purple-500 text-purple-300">
                  {currentGame.provider}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{currentGame.name}</h1>
              <p className="text-purple-300 text-lg">{currentGame.description}</p>
            </div>
            
            {/* Download Button */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                size="lg"
                onClick={handleDownload}
                disabled={downloading}
                className={`font-bold px-8 py-6 text-lg ${
                  downloaded 
                    ? 'bg-green-500 hover:bg-green-500 text-white' 
                    : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black'
                }`}
              >
                {downloading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Settings className="h-6 w-6 mr-2" />
                    </motion.div>
                    Downloading...
                  </>
                ) : downloaded ? (
                  <>
                    <Check className="h-6 w-6 mr-2" />
                    Downloaded
                  </>
                ) : (
                  <>
                    <Download className="h-6 w-6 mr-2" />
                    Download Game
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Game Stats */}
          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-950/50 border-purple-700/30">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {currentGame.rtp && (
                  <div className="text-center p-4 bg-purple-800/30 rounded-lg">
                    <p className="text-2xl font-bold text-green-400">{currentGame.rtp}%</p>
                    <p className="text-sm text-purple-400">RTP</p>
                  </div>
                )}
                <div className="text-center p-4 bg-purple-800/30 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-400">{currentGame.minBet}</p>
                  <p className="text-sm text-purple-400">Min Bet</p>
                </div>
                <div className="text-center p-4 bg-purple-800/30 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-400">{currentGame.maxBet.toLocaleString()}</p>
                  <p className="text-sm text-purple-400">Max Bet</p>
                </div>
                {currentGame.volatility && (
                  <div className="text-center p-4 bg-purple-800/30 rounded-lg">
                    <p className="text-2xl font-bold text-white capitalize">{currentGame.volatility}</p>
                    <p className="text-sm text-purple-400">Volatility</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Overview Section */}
          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-950/50 border-purple-700/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Info className="h-5 w-5 text-yellow-400" />
                Game Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-200 leading-relaxed text-lg">
                {blogContent.overview}
              </p>
            </CardContent>
          </Card>

          {/* How to Play Section */}
          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-950/50 border-purple-700/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Gamepad2 className="h-5 w-5 text-yellow-400" />
                How to Play
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-200 leading-relaxed">
                {blogContent.howToPlay}
              </p>
            </CardContent>
          </Card>

          {/* Tips Section */}
          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-950/50 border-purple-700/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-yellow-400" />
                Tips & Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {blogContent.tips.map((tip, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-4 w-4 text-yellow-400" />
                    </div>
                    <span className="text-purple-200">{tip}</span>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* History Section */}
          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-950/50 border-purple-700/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-400" />
                Game History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-200 leading-relaxed">
                {blogContent.history}
              </p>
            </CardContent>
          </Card>

          {/* Features Section */}
          {currentGame.features && currentGame.features.length > 0 && (
            <Card className="bg-gradient-to-br from-purple-900/50 to-purple-950/50 border-purple-700/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-400" />
                  Game Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {currentGame.features.map((feature, i) => (
                    <Badge 
                      key={i} 
                      className="px-4 py-2 bg-gradient-to-r from-purple-600/50 to-purple-800/50 border border-purple-500/30 text-white text-sm"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Game Specifications */}
          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-950/50 border-purple-700/30">
            <CardHeader>
              <CardTitle className="text-white">Game Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {currentGame.reels && (
                  <div className="flex justify-between py-2 border-b border-purple-700/30">
                    <span className="text-purple-400">Reels</span>
                    <span className="text-white font-medium">{currentGame.reels}</span>
                  </div>
                )}
                {currentGame.paylines && (
                  <div className="flex justify-between py-2 border-b border-purple-700/30">
                    <span className="text-purple-400">Paylines</span>
                    <span className="text-white font-medium">{currentGame.paylines}</span>
                  </div>
                )}
                {currentGame.jackpot && (
                  <div className="flex justify-between py-2 border-b border-purple-700/30">
                    <span className="text-purple-400">Max Jackpot</span>
                    <span className="text-yellow-400 font-medium">{currentGame.jackpot.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-purple-700/30">
                  <span className="text-purple-400">Category</span>
                  <span className="text-white font-medium capitalize">{currentGame.category}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-purple-700/30">
                  <span className="text-purple-400">Provider</span>
                  <span className="text-white font-medium">{currentGame.provider}</span>
                </div>
                {currentGame.volatility && (
                  <div className="flex justify-between py-2 border-b border-purple-700/30">
                    <span className="text-purple-400">Volatility</span>
                    <span className="text-white font-medium capitalize">{currentGame.volatility}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-950/50 border-purple-700/30 sticky top-24">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold"
                onClick={handleDownload}
                disabled={downloading}
              >
                {downloading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="mr-2"
                    >
                      <Settings className="h-5 w-5" />
                    </motion.div>
                    Downloading...
                  </>
                ) : downloaded ? (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    Downloaded
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5 mr-2" />
                    Download Now
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                className={`w-full ${isFavorite ? 'border-red-500 text-red-400' : 'border-purple-600 text-purple-300'}`}
                onClick={() => toggleFavorite(currentGame.id)}
              >
                <Heart className="h-5 w-5 mr-2" fill={isFavorite ? 'currentColor' : 'none'} />
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
              
              <Button
                variant="outline"
                className="w-full border-purple-600 text-purple-300"
              >
                <Share2 className="h-5 w-5 mr-2" />
                Share Game
              </Button>
            </CardContent>
          </Card>

          {/* Game Info Card */}
          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-950/50 border-purple-700/30">
            <CardHeader>
              <CardTitle className="text-white text-sm">Game Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-purple-300">
                <Eye className="h-4 w-4" />
                <span>Views: {Math.floor(Math.random() * 10000).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-purple-300">
                <ThumbsUp className="h-4 w-4" />
                <span>Likes: {Math.floor(Math.random() * 1000).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-purple-300">
                <Calendar className="h-4 w-4" />
                <span>Added: {new Date().toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Related Games */}
          {relatedGames.length > 0 && (
            <Card className="bg-gradient-to-br from-purple-900/50 to-purple-950/50 border-purple-700/30">
              <CardHeader>
                <CardTitle className="text-white">Related Games</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {relatedGames.map((game) => (
                  <motion.div
                    key={game.id}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3 p-2 rounded-lg bg-purple-800/20 hover:bg-purple-800/40 cursor-pointer transition-colors"
                    onClick={() => {
                      setCurrentGame(game);
                      setDownloaded(false);
                    }}
                  >
                    <img
                      src={game.thumbnail}
                      alt={game.name}
                      className="w-16 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="text-white font-medium text-sm">{game.name}</p>
                      <p className="text-purple-400 text-xs">{game.provider}</p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// Promotions View Component
function PromotionsView() {
  const { user, claimDailyBonus, canClaimBonus } = useGameStore();

  const promotions = [
    {
      id: 1,
      title: 'Daily Login Bonus',
      description: 'Log in every day and claim your free Twists! Bonus increases with your level.',
      bonus: `${5000 + (user?.level || 1) * 500} Twists`,
      icon: Gift,
      color: 'from-green-500 to-emerald-500',
      canClaim: canClaimBonus
    },
    {
      id: 2,
      title: 'Welcome Package',
      description: 'New players get 10,000 Twists to start their gaming journey!',
      bonus: '10,000 Twists',
      icon: Sparkles,
      color: 'from-yellow-500 to-orange-500',
      canClaim: true
    },
    {
      id: 3,
      title: 'VIP Cashback',
      description: 'Get up to 15% cashback on your weekly losses as a VIP member.',
      bonus: 'Up to 15%',
      icon: Crown,
      color: 'from-purple-500 to-pink-500',
      canClaim: user?.vipStatus !== 'Bronze'
    },
    {
      id: 4,
      title: 'Weekly Tournament',
      description: 'Compete in our weekly slots tournament for a share of 100,000 Twists!',
      bonus: '100,000 Twists',
      icon: Trophy,
      color: 'from-cyan-500 to-blue-500',
      canClaim: true
    },
    {
      id: 5,
      title: 'Refer a Friend',
      description: 'Invite friends and earn 1,000 Twists for each friend who joins!',
      bonus: '1,000 Twists',
      icon: Users,
      color: 'from-rose-500 to-pink-500',
      canClaim: true
    },
    {
      id: 6,
      title: 'Hourly Bonus',
      description: 'Claim free Twists every hour! Maximum 500 Twists per claim.',
      bonus: 'Up to 500',
      icon: Clock,
      color: 'from-amber-500 to-yellow-500',
      canClaim: true
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Gift className="h-8 w-8 text-yellow-400" />
        <div>
          <h1 className="text-3xl font-bold text-white">Promotions</h1>
          <p className="text-purple-300">Claim your bonuses and rewards</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promo, i) => (
          <motion.div
            key={promo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Card className="bg-gradient-to-br from-purple-900/50 to-purple-950/50 border-purple-700/30 hover:border-yellow-500/30 transition-all overflow-hidden h-full">
              <div className={`h-2 bg-gradient-to-r ${promo.color}`} />
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${promo.color} flex items-center justify-center`}>
                    <promo.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{promo.title}</h3>
                    <p className="text-sm text-purple-300">{promo.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-purple-400">Bonus</p>
                    <p className="font-bold text-yellow-400">{promo.bonus}</p>
                  </div>
                  <Button
                    className={`bg-gradient-to-r ${promo.color} text-white`}
                    disabled={!promo.canClaim}
                    onClick={() => {
                      if (promo.id === 1) {
                        claimDailyBonus();
                      }
                    }}
                  >
                    {promo.canClaim ? 'Claim' : 'Locked'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// VIP View Component
function VIPView() {
  const { user } = useGameStore();

  const vipTiers = [
    { name: 'Bronze', color: 'from-amber-700 to-amber-900', minPoints: 0, benefits: ['Daily Bonus', 'Basic Support'] },
    { name: 'Silver', color: 'from-gray-400 to-gray-600', minPoints: 1000, benefits: ['+10% Daily Bonus', 'Priority Support', 'Weekly Bonus'] },
    { name: 'Gold', color: 'from-yellow-500 to-yellow-700', minPoints: 5000, benefits: ['+20% Daily Bonus', 'VIP Support', 'Exclusive Games', 'Monthly Bonus'] },
    { name: 'Platinum', color: 'from-cyan-400 to-cyan-600', minPoints: 15000, benefits: ['+30% Daily Bonus', 'Personal Manager', 'All Games Unlocked', 'Exclusive Promotions'] },
    { name: 'Diamond', color: 'from-purple-400 to-purple-600', minPoints: 50000, benefits: ['+50% Daily Bonus', 'Dedicated Support', 'Highest Limits', 'VIP Events', 'Special Gifts'] }
  ];

  const currentTierIndex = vipTiers.findIndex(t => t.name === user?.vipStatus);
  const nextTier = currentTierIndex < vipTiers.length - 1 ? vipTiers[currentTierIndex + 1] : null;
  const progressToNext = nextTier ? (user?.vipPoints || 0) / nextTier.minPoints * 100 : 100;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Crown className="h-8 w-8 text-yellow-400" />
        <div>
          <h1 className="text-3xl font-bold text-white">VIP Program</h1>
          <p className="text-purple-300">Level up and unlock exclusive benefits</p>
        </div>
      </div>

      {/* Current Status */}
      <Card className="bg-gradient-to-br from-purple-900/50 to-purple-950/50 border-purple-700/30 overflow-hidden">
        <div className={`h-2 bg-gradient-to-r ${vipTiers[currentTierIndex].color}`} />
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${vipTiers[currentTierIndex].color} flex items-center justify-center`}>
                <Crown className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-400">Your VIP Status</p>
                <h2 className="text-2xl font-bold text-white">{user?.vipStatus}</h2>
                <p className="text-purple-300">{user?.vipPoints?.toLocaleString()} VIP Points</p>
              </div>
            </div>

            {nextTier && (
              <div className="w-full md:w-64">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-purple-300">Progress to {nextTier.name}</span>
                  <span className="text-yellow-400">{Math.round(progressToNext)}%</span>
                </div>
                <Progress value={progressToNext} className="h-2 bg-purple-800" />
                <p className="text-xs text-purple-400 mt-1">
                  {nextTier.minPoints - (user?.vipPoints || 0)} points to next tier
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* VIP Tiers */}
      <div className="grid md:grid-cols-5 gap-4">
        {vipTiers.map((tier, i) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={`bg-gradient-to-br from-purple-900/50 to-purple-950/50 border-purple-700/30 ${
              tier.name === user?.vipStatus ? 'ring-2 ring-yellow-500' : ''
            } h-full`}>
              <div className={`h-2 bg-gradient-to-r ${tier.color}`} />
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${tier.color} flex items-center justify-center`}>
                    <Crown className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-bold text-white">{tier.name}</h3>
                </div>
                <p className="text-xs text-purple-400 mb-3">
                  {tier.minPoints.toLocaleString()}+ Points
                </p>
                <ul className="space-y-1">
                  {tier.benefits.map((benefit, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs text-purple-300">
                      <Check className="h-3 w-3 text-green-400" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* How to Earn Points */}
      <Card className="bg-gradient-to-br from-purple-900/50 to-purple-950/50 border-purple-700/30">
        <CardHeader>
          <CardTitle className="text-white">How to Earn VIP Points</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { action: 'Play Games', points: '1 point per 100 Twists bet' },
              { action: 'Level Up', points: '100 points per level' },
              { action: 'Daily Login', points: '10 points per day' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-purple-800/30 rounded-lg">
                <Target className="h-6 w-6 text-yellow-400" />
                <div>
                  <p className="font-medium text-white">{item.action}</p>
                  <p className="text-sm text-purple-300">{item.points}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Profile View Component
function ProfileView() {
  const { user, transactions } = useGameStore();

  const stats = [
    { label: 'Total Games Played', value: transactions.length },
    { label: 'Total Wins', value: transactions.filter(t => t.type === 'win').length },
    { label: 'Total Losses', value: transactions.filter(t => t.type === 'loss').length },
    { label: 'Biggest Win', value: Math.max(0, ...transactions.filter(t => t.type === 'win').map(t => t.amount)) }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-500">
          <img src={user?.avatar} alt={user?.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">{user?.name}</h1>
          <p className="text-purple-300">@{user?.username}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-gradient-to-br from-purple-900/50 to-purple-950/50 border-purple-700/30">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-white">{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}</p>
              <p className="text-sm text-purple-300">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Transaction History */}
      <Card className="bg-gradient-to-br from-purple-900/50 to-purple-950/50 border-purple-700/30">
        <CardHeader>
          <CardTitle className="text-white">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {transactions.slice(0, 10).map((transaction, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-purple-800/20 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    transaction.amount > 0 ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}>
                    {transaction.amount > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-red-400 rotate-180" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{transaction.description}</p>
                    <p className="text-xs text-purple-400">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`font-bold ${transaction.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Main Page Component
export default function Page() {
  const { currentView } = useGameStore();

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'slots':
        return <GamesListView category="slots" />;
      case 'casino':
        return <GamesListView category="casino" />;
      case 'poker':
        return <GamesListView category="poker" />;
      case 'skill':
        return <GamesListView category="skill" />;
      case 'bingo':
        return <GamesListView category="bingo" />;
      case 'promotions':
        return <PromotionsView />;
      case 'vip':
        return <VIPView />;
      case 'profile':
        return <ProfileView />;
      case 'game':
        return <GameBlogView />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-950 via-purple-900 to-purple-950">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
