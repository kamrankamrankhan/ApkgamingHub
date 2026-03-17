import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { gamesData, Game } from './games-data';

export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  avatar: string;
  twists: number;
  level: number;
  xp: number;
  vipStatus: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  vipPoints: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'bonus' | 'win' | 'loss' | 'daily_bonus' | 'purchase';
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
}

export type ViewType = 'home' | 'slots' | 'casino' | 'skill' | 'poker' | 'bingo' | 'promotions' | 'vip' | 'profile' | 'game';

interface GameState {
  // User
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  
  // Games
  games: Game[];
  gamesLoaded: boolean;
  currentGame: Game | null;
  favorites: string[];
  
  // UI State
  currentView: ViewType;
  searchQuery: string;
  selectedCategory: string | null;
  filterNew: boolean;
  filterPopular: boolean;
  filterFeatured: boolean;
  
  // Transactions
  transactions: Transaction[];
  
  // Daily Bonus
  lastBonusClaim: string | null;
  canClaimBonus: boolean;
  
  // Actions
  setUser: (user: User) => void;
  logout: () => void;
  setAdmin: (isAdmin: boolean) => void;
  setCurrentView: (view: ViewType) => void;
  setCurrentGame: (game: Game | null) => void;
  toggleFavorite: (gameId: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  toggleFilter: (filter: 'new' | 'popular' | 'featured') => void;
  addTwists: (amount: number) => void;
  subtractTwists: (amount: number) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  claimDailyBonus: () => number;
  addXP: (amount: number) => void;
  levelUp: () => void;
  
  // Game Actions
  setGames: (games: Game[]) => void;
  fetchGames: () => Promise<void>;
  addGame: (game: Game) => void;
  updateGame: (game: Game) => void;
  deleteGame: (gameId: string) => void;
}

const initialTransactions: Transaction[] = [];

// Helper to convert database game to frontend format
function dbGameToGame(dbGame: Record<string, unknown>): Game {
  return {
    id: dbGame.id as string,
    name: dbGame.name as string,
    slug: dbGame.slug as string,
    description: (dbGame.description as string) || '',
    thumbnail: dbGame.thumbnail as string,
    bannerImage: (dbGame.bannerImage as string) || '',
    category: dbGame.category as Game['category'],
    provider: dbGame.provider as string,
    isFeatured: dbGame.isFeatured as boolean,
    isNew: dbGame.isNew as boolean,
    isPopular: dbGame.isPopular as boolean,
    minBet: dbGame.minBet as number,
    maxBet: dbGame.maxBet as number,
    jackpot: dbGame.jackpot as number | undefined,
    rtp: dbGame.rtp as number | undefined,
    volatility: dbGame.volatility as 'low' | 'medium' | 'high' | undefined,
    features: dbGame.features ? JSON.parse(dbGame.features as string) : [],
    paylines: dbGame.paylines as number | undefined,
    reels: dbGame.reels as number | undefined,
    downloadLink: (dbGame.downloadLink as string) || '',
    gameOverview: (dbGame.gameOverview as string) || '',
    howToPlay: (dbGame.howToPlay as string) || '',
    tipsAndStrategies: dbGame.tipsAndStrategies ? JSON.parse(dbGame.tipsAndStrategies as string) : [],
    gameHistory: (dbGame.gameHistory as string) || '',
    howToCreateAccount: (dbGame.howToCreateAccount as string) || '',
    conclusion: (dbGame.conclusion as string) || '',
    faqs: dbGame.faqs ? JSON.parse(dbGame.faqs as string) : [],
    howToDownloadAndInstall: (dbGame.howToDownloadAndInstall as string) || '',
  };
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      isLoggedIn: false,
      isAdmin: false,
      games: [], // Start empty, will be populated from database
      gamesLoaded: false,
      currentGame: null,
      favorites: [],
      currentView: 'home',
      searchQuery: '',
      selectedCategory: null,
      filterNew: false,
      filterPopular: false,
      filterFeatured: false,
      transactions: initialTransactions,
      lastBonusClaim: null,
      canClaimBonus: true,
      
      // Actions
      setUser: (user) => set({ user, isLoggedIn: true }),
      
      logout: () => set({ user: null, isLoggedIn: false, isAdmin: false }),
      
      setAdmin: (isAdmin) => set({ isAdmin }),
      
      setCurrentView: (view) => set({ currentView: view, currentGame: null }),
      
      setCurrentGame: (game) => {
        if (game) {
          set({ currentGame: game, currentView: 'game' });
        } else {
          // When closing game, navigate back to slots or the game's category
          const currentGame = get().currentGame;
          const targetView = currentGame?.category && currentGame.category !== 'slots' 
            ? currentGame.category as ViewType 
            : 'slots';
          set({ currentGame: null, currentView: targetView });
        }
      },
      
      toggleFavorite: (gameId) => set((state) => ({
        favorites: state.favorites.includes(gameId)
          ? state.favorites.filter(id => id !== gameId)
          : [...state.favorites, gameId]
      })),
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      
      toggleFilter: (filter) => set((state) => ({
        filterNew: filter === 'new' ? !state.filterNew : state.filterNew,
        filterPopular: filter === 'popular' ? !state.filterPopular : state.filterPopular,
        filterFeatured: filter === 'featured' ? !state.filterFeatured : state.filterFeatured
      })),
      
      addTwists: (amount) => set((state) => ({
        user: state.user ? { ...state.user, twists: state.user.twists + amount } : null
      })),
      
      subtractTwists: (amount) => set((state) => ({
        user: state.user ? { ...state.user, twists: Math.max(0, state.user.twists - amount) } : null
      })),
      
      addTransaction: (transaction) => set((state) => ({
        transactions: [
          {
            ...transaction,
            id: `trans-${Date.now()}`,
            createdAt: new Date().toISOString()
          },
          ...state.transactions
        ]
      })),
      
      claimDailyBonus: () => {
        const state = get();
        const now = new Date();
        const lastClaim = state.lastBonusClaim ? new Date(state.lastBonusClaim) : null;
        
        // Can claim if never claimed or if 24 hours have passed
        const canClaim = !lastClaim || (now.getTime() - lastClaim.getTime()) >= 86400000;
        
        if (!canClaim) return 0;
        
        const bonusAmount = 5000 + (state.user?.level || 1) * 500;
        
        set({
          lastBonusClaim: now.toISOString(),
          canClaimBonus: false,
          user: state.user ? { ...state.user, twists: state.user.twists + bonusAmount } : null
        });
        
        get().addTransaction({
          type: 'daily_bonus',
          amount: bonusAmount,
          description: `Daily Bonus (Level ${state.user?.level})`,
          status: 'completed'
        });
        
        return bonusAmount;
      },
      
      addXP: (amount) => set((state) => {
        if (!state.user) return state;
        const newXP = state.user.xp + amount;
        const xpNeeded = state.user.level * 1000;
        
        if (newXP >= xpNeeded) {
          return {
            user: {
              ...state.user,
              xp: newXP - xpNeeded,
              level: state.user.level + 1
            }
          };
        }
        
        return {
          user: { ...state.user, xp: newXP }
        };
      }),
      
      levelUp: () => set((state) => {
        if (!state.user) return state;
        return {
          user: {
            ...state.user,
            level: state.user.level + 1,
            vipPoints: state.user.vipPoints + 100
          }
        };
      }),
      
      // Game Actions - fetch from database
      setGames: (games) => set({ games, gamesLoaded: true }),
      
      fetchGames: async () => {
        try {
          const response = await fetch('/api/games');
          const data = await response.json();
          if (data.games && data.games.length > 0) {
            const games = data.games.map(dbGameToGame);
            set({ games, gamesLoaded: true });
          }
        } catch (error) {
          console.error('Error fetching games:', error);
          // Keep existing games if fetch fails
        }
      },
      
      addGame: (game) => set((state) => ({
        games: [...state.games, game]
      })),
      
      updateGame: (game) => set((state) => ({
        games: state.games.map(g => g.id === game.id ? game : g),
        currentGame: state.currentGame?.id === game.id ? game : state.currentGame
      })),
      
      deleteGame: (gameId) => set((state) => ({
        games: state.games.filter(g => g.id !== gameId),
        currentGame: state.currentGame?.id === gameId ? null : state.currentGame
      }))
    }),
    {
      name: 'gametwist-storage',
      partialize: (state) => ({
        user: state.user,
        favorites: state.favorites,
        transactions: state.transactions,
        lastBonusClaim: state.lastBonusClaim,
        canClaimBonus: state.canClaimBonus,
        isAdmin: state.isAdmin,
        // Don't persist games - always fetch from database
      })
    }
  )
);
