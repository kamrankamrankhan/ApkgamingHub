'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, User, Gift, Crown, ChevronDown, Bell, 
  Search, Star, Heart, Settings, LogOut, Coins, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useGameStore, ViewType } from '@/lib/store';

const navItems: { label: string; view: ViewType; icon: string }[] = [
  { label: 'Home', view: 'home', icon: '🏠' },
  { label: 'Slots', view: 'slots', icon: '🎰' },
  { label: 'Casino', view: 'casino', icon: '🎲' },
  { label: 'Poker', view: 'poker', icon: '🃏' },
  { label: 'Skill Games', view: 'skill', icon: '🎯' },
  { label: 'Bingo', view: 'bingo', icon: '🎱' },
];

const vipTiers = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'] as const;
const vipColors = {
  Bronze: 'from-amber-700 to-amber-900',
  Silver: 'from-gray-400 to-gray-600',
  Gold: 'from-yellow-500 to-yellow-700',
  Platinum: 'from-cyan-400 to-cyan-600',
  Diamond: 'from-purple-400 to-purple-600'
};

export function Header() {
  const { user, currentView, setCurrentView, searchQuery, setSearchQuery, claimDailyBonus, canClaimBonus, isAdmin } = useGameStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const handleNavClick = (view: ViewType) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  const handleClaimBonus = () => {
    const amount = claimDailyBonus();
    if (amount > 0) {
      // Could show toast here
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    // Navigate to slots when searching to show results
    if (value && currentView === 'home') {
      setCurrentView('slots');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-purple-950/95 via-purple-900/95 to-purple-950/95 backdrop-blur-md border-b border-purple-700/50">
      {/* Top Bar */}
      <div className="hidden md:flex items-center justify-between px-4 py-1 bg-purple-950/50 text-xs text-purple-200">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 text-yellow-400" />
            Welcome to APKgaminghub - Download Free Games!
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setCurrentView('admin')}
            className="flex items-center gap-1 hover:text-yellow-400 transition-colors"
          >
            <Shield className="h-3 w-3" />
            Admin
          </button>
          <Link href="#" className="hover:text-yellow-400 transition-colors">Help</Link>
          <Link href="#" className="hover:text-yellow-400 transition-colors">Contact</Link>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-2 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={() => handleNavClick('home')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
              <span className="text-xl">🎰</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent">
                APKgaminghub
              </h1>
              <p className="text-[10px] text-purple-300 -mt-1">Free Game Downloads</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <motion.button
                key={item.view}
                onClick={() => handleNavClick(item.view)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  currentView === item.view
                    ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/30'
                    : 'text-purple-200 hover:text-white hover:bg-white/5'
                }`}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{item.icon}</span>
                {item.label}
              </motion.button>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Desktop Search */}
            <AnimatePresence>
              {showSearch && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 'auto', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="hidden sm:block overflow-hidden"
                >
                  <Input
                    type="text"
                    placeholder="Search games..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-48 bg-white/10 border-purple-500/50 text-white placeholder:text-purple-300"
                    autoFocus
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-purple-200 hover:text-white hover:bg-white/10 hidden sm:flex"
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-purple-200 hover:text-white hover:bg-white/10 sm:hidden"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Admin Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setCurrentView('admin')}
                variant={isAdmin ? 'default' : 'outline'}
                className={isAdmin 
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black' 
                  : 'border-purple-600 text-purple-300 hover:text-white'
                }
              >
                <Shield className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
            </motion.div>

            {/* User Menu (if logged in) */}
            {user ? (
              <>
                {/* Daily Bonus */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleClaimBonus}
                    disabled={!canClaimBonus}
                    className={`relative overflow-hidden ${
                      canClaimBonus
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Gift className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Bonus</span>
                    {canClaimBonus && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    )}
                  </Button>
                </motion.div>

                {/* Balance */}
                <motion.div
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-800/50 to-purple-900/50 rounded-xl border border-purple-600/30"
                  whileHover={{ scale: 1.02 }}
                >
                  <Coins className="h-5 w-5 text-yellow-400" />
                  <span className="font-bold text-yellow-400">
                    {user?.twists.toLocaleString()}
                  </span>
                  <span className="text-xs text-purple-300">Twists</span>
                </motion.div>

                {/* User Avatar */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 hover:bg-white/10 px-2">
                      <div className="relative">
                        <Avatar className="h-8 w-8 border-2 border-yellow-500/50">
                          <AvatarImage src={user?.avatar} alt={user?.name} />
                          <AvatarFallback className="bg-purple-700 text-white">
                            {user?.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r ${vipColors[user?.vipStatus || 'Bronze']} border border-purple-900 flex items-center justify-center`}>
                          <Crown className="h-2.5 w-2.5 text-white" />
                        </div>
                      </div>
                      <div className="hidden md:block text-left">
                        <p className="text-sm font-medium text-white">{user?.name}</p>
                        <p className="text-xs text-purple-300">Level {user?.level}</p>
                      </div>
                      <ChevronDown className="h-4 w-4 text-purple-300" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-purple-900 border-purple-700">
                    <DropdownMenuLabel className="text-purple-200">
                      <div className="flex flex-col space-y-1">
                        <p className="text-white font-bold">{user?.name}</p>
                        <p className="text-xs text-purple-400">@{user?.username}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={`bg-gradient-to-r ${vipColors[user?.vipStatus || 'Bronze']} text-white border-0`}>
                            <Crown className="h-3 w-3 mr-1" />
                            {user?.vipStatus}
                          </Badge>
                          <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
                            Level {user?.level}
                          </Badge>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-purple-700" />
                    <DropdownMenuItem 
                      className="text-purple-200 hover:text-white hover:bg-purple-800 cursor-pointer"
                      onClick={() => setCurrentView('profile')}
                    >
                      <User className="mr-2 h-4 w-4" />
                      My Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-purple-200 hover:text-white hover:bg-purple-800 cursor-pointer"
                      onClick={() => setCurrentView('vip')}
                    >
                      <Crown className="mr-2 h-4 w-4" />
                      VIP Status
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-purple-200 hover:text-white hover:bg-purple-800 cursor-pointer">
                      <Heart className="mr-2 h-4 w-4" />
                      Favorites
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-purple-200 hover:text-white hover:bg-purple-800 cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : null}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-purple-200 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden bg-purple-950 border-t border-purple-700/50"
          >
            <div className="container mx-auto px-4 py-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" />
                <Input
                  type="text"
                  placeholder="Search games..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 bg-white/10 border-purple-500/50 text-white placeholder:text-purple-300"
                  autoFocus
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-purple-400 hover:text-white"
                    onClick={() => {
                      setSearchQuery('');
                      setMobileSearchOpen(false);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-purple-950 border-t border-purple-700/50"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.view}
                  onClick={() => handleNavClick(item.view)}
                  className={`w-full px-4 py-3 rounded-lg text-left flex items-center gap-3 ${
                    currentView === item.view
                      ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400'
                      : 'text-purple-200 hover:bg-white/5'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {item.label}
                </button>
              ))}
              
              <button
                onClick={() => handleNavClick('admin')}
                className={`w-full px-4 py-3 rounded-lg text-left flex items-center gap-3 ${
                  currentView === 'admin'
                    ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400'
                    : 'text-purple-200 hover:bg-white/5'
                }`}
              >
                <Shield className="text-xl" />
                Admin Panel
              </button>
              
              {/* Mobile Balance */}
              {user && (
                <div className="mt-4 p-4 bg-gradient-to-r from-purple-800/50 to-purple-900/50 rounded-xl border border-purple-600/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coins className="h-5 w-5 text-yellow-400" />
                      <span className="text-purple-200">Balance:</span>
                    </div>
                    <span className="font-bold text-yellow-400">
                      {user?.twists.toLocaleString()} Twists
                    </span>
                  </div>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
