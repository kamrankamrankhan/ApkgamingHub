'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
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
import { GameBlogView } from '@/components/games/GameBlogView';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/DynamicSEO';

import { useGameStore } from '@/lib/store';
import { gamesData, gameCategories, featuredGames, popularGames, newGames } from '@/lib/games-data';

// Home View Component
function HomeView() {
  const { games, gamesLoaded } = useGameStore();
  
  const [currentBanner, setCurrentBanner] = useState(0);

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % heroBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroBanners.length]);

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
  
  // Compute featured, popular, and new games from store
  const featuredGames = games.filter(g => g.isFeatured);
  const popularGames = games.filter(g => g.isPopular);
  const newGames = games.filter(g => g.isNew);
  
  // Compute category counts
  const categoryCounts = gameCategories.map(cat => ({
    ...cat,
    count: games.filter(g => g.category === cat.id).length
  }));

  const categoryToHref: Record<string, string> = {
    slots: '/slots',
    casino: '/casino',
    poker: '/poker',
    skill: '/skill-games',
    bingo: '/bingo',
    // Not routed explicitly; default to slots.
    novoline: '/slots',
  };

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
                  asChild
                  size="lg"
                  className="bg-white text-black hover:bg-white/90 font-bold px-8"
                >
                  <Link href="/slots">
                    {heroBanners[currentBanner].cta}
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
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
          <Button asChild variant="link" className="text-yellow-400">
            <Link href="/slots">
            View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {categoryCounts.map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={categoryToHref[category.id] || '/slots'}
                className="p-4 rounded-xl bg-gradient-to-br from-purple-800/50 to-purple-900/50 border border-purple-700/30 hover:border-yellow-500/50 transition-all block"
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <p className="text-sm font-medium text-white">{category.name}</p>
                <p className="text-xs text-purple-400">{category.count} games</p>
              </Link>
            </motion.div>
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
          <Button asChild variant="link" className="text-yellow-400">
            <Link href="/slots">
            See All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
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
          <Button asChild variant="link" className="text-yellow-400">
            <Link href="/slots">
            See All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
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
          <Button asChild variant="link" className="text-yellow-400">
            <Link href="/slots">
            See All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
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
  const { games, searchQuery, setSearchQuery, filterNew, filterPopular, filterFeatured, toggleFilter, gamesLoaded } = useGameStore();
  
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
  const { currentView, fetchGames, gamesLoaded, currentGame, games } = useGameStore();

  // Fetch games from database on mount (for all views)
  useEffect(() => {
    if (!gamesLoaded) {
      fetchGames();
    }
  }, [gamesLoaded, fetchGames]);

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
        if (!currentGame) {
          return (
            <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
              <p className="text-purple-300">Open a game from the catalog for a direct link.</p>
              <Button asChild>
                <Link href="/slots">Browse games</Link>
              </Button>
            </div>
          );
        }
        return <GameBlogView game={currentGame} games={games} />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-950 via-purple-900 to-purple-950">
      {/* Dynamic SEO Meta Tags */}
      <SEOHead game={currentGame} view={currentView !== 'home' && currentView !== 'game' ? currentView : undefined} />
      
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
