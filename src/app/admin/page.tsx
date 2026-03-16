'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit, Trash2, Save, X, Search, Upload, 
  Image, Gamepad2, Settings, AlertCircle, Check,
  ChevronLeft, ChevronRight, Eye, Loader2, FileText,
  HelpCircle, BookOpen, Download, RefreshCw, ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useGameStore } from '@/lib/store';
import { Game } from '@/lib/games-data';
import { gameCategories } from '@/lib/games-data';
import Link from 'next/link';

// Admin Login Component
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (password === 'admin123') {
      onLogin();
      setError('');
    } else {
      setError('Invalid password. Try: admin123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-950 via-purple-900 to-purple-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-6"
      >
        <Card className="bg-gradient-to-br from-purple-900/80 to-purple-950/80 border-purple-700/50">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Settings className="h-8 w-8 text-black" />
            </div>
            <CardTitle className="text-2xl text-white">Admin Panel</CardTitle>
            <CardDescription className="text-purple-300">
              Enter admin password to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="bg-purple-800/50 border-purple-600/50 text-white placeholder:text-purple-400"
              />
              {error && (
                <p className="text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </p>
              )}
            </div>
            <Button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold"
            >
              Login
            </Button>
            <Link href="/">
              <Button
                variant="ghost"
                className="w-full text-purple-300 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// Game type from database
interface DbGame {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  thumbnail: string;
  bannerImage: string | null;
  category: string;
  provider: string;
  isFeatured: boolean;
  isNew: boolean;
  isPopular: boolean;
  minBet: number;
  maxBet: number;
  jackpot: number | null;
  rtp: number | null;
  volatility: string | null;
  features: string | null;
  paylines: number | null;
  reels: number | null;
  downloadLink: string | null;
  gameOverview: string | null;
  howToPlay: string | null;
  tipsAndStrategies: string | null;
  gameHistory: string | null;
  howToCreateAccount: string | null;
  conclusion: string | null;
  faqs: string | null;
  howToDownloadAndInstall: string | null;
  createdAt: string;
  updatedAt: string;
}

// Convert database game to frontend Game format
function dbGameToGame(dbGame: DbGame): Game {
  return {
    id: dbGame.id,
    name: dbGame.name,
    slug: dbGame.slug,
    description: dbGame.description || '',
    thumbnail: dbGame.thumbnail,
    bannerImage: dbGame.bannerImage || '',
    category: dbGame.category as Game['category'],
    provider: dbGame.provider,
    isFeatured: dbGame.isFeatured,
    isNew: dbGame.isNew,
    isPopular: dbGame.isPopular,
    minBet: dbGame.minBet,
    maxBet: dbGame.maxBet,
    jackpot: dbGame.jackpot || undefined,
    rtp: dbGame.rtp || undefined,
    volatility: dbGame.volatility as 'low' | 'medium' | 'high' | undefined,
    features: dbGame.features ? JSON.parse(dbGame.features) : [],
    paylines: dbGame.paylines || undefined,
    reels: dbGame.reels || undefined,
    downloadLink: dbGame.downloadLink || '',
    gameOverview: dbGame.gameOverview || '',
    howToPlay: dbGame.howToPlay || '',
    tipsAndStrategies: dbGame.tipsAndStrategies ? JSON.parse(dbGame.tipsAndStrategies) : [],
    gameHistory: dbGame.gameHistory || '',
    howToCreateAccount: dbGame.howToCreateAccount || '',
    conclusion: dbGame.conclusion || '',
    faqs: dbGame.faqs ? JSON.parse(dbGame.faqs) : [],
    howToDownloadAndInstall: dbGame.howToDownloadAndInstall || '',
  };
}

// Admin Panel Component
function AdminPanel() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Form state
  const emptyGame: Game = {
    id: '',
    name: '',
    slug: '',
    description: '',
    thumbnail: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=400&h=300&fit=crop',
    bannerImage: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=1200&h=400&fit=crop',
    category: 'slots',
    provider: 'APKgaminghub',
    isFeatured: false,
    isNew: false,
    isPopular: false,
    minBet: 10,
    maxBet: 5000,
    jackpot: undefined,
    rtp: undefined,
    volatility: 'medium',
    features: [],
    paylines: undefined,
    reels: undefined,
    downloadLink: '',
    gameOverview: '',
    howToPlay: '',
    tipsAndStrategies: [],
    gameHistory: '',
    howToCreateAccount: '',
    conclusion: '',
    faqs: [],
    howToDownloadAndInstall: ''
  };

  const [formData, setFormData] = useState<Game>(emptyGame);
  const [featureInput, setFeatureInput] = useState('');
  const [tipInput, setTipInput] = useState('');
  const [faqInput, setFaqInput] = useState({ question: '', answer: '' });
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Fetch games from database
  const fetchGames = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/games');
      const data = await response.json();
      if (data.games) {
        setGames(data.games.map(dbGameToGame));
      }
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleFileUpload = async (
    file: File,
    type: 'thumbnail' | 'banner'
  ): Promise<string | null> => {
    const setUploading = type === 'thumbnail' ? setUploadingThumbnail : setUploadingBanner;
    
    try {
      setUploading(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append('file', file);
      formDataToSend.append('bucket', type === 'thumbnail' ? 'game-thumbnails' : 'game-banners');
      formDataToSend.append('folder', 'games');
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataToSend,
      });
      
      const data = await response.json();
      
      if (!response.ok || data.error) {
        alert(data.error || 'Failed to upload file');
        return null;
      }
      
      return data.url;
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await handleFileUpload(file, 'thumbnail');
      if (url) {
        setFormData({ ...formData, thumbnail: url });
      }
    }
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = '';
    }
  };

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await handleFileUpload(file, 'banner');
      if (url) {
        setFormData({ ...formData, bannerImage: url });
      }
    }
    if (bannerInputRef.current) {
      bannerInputRef.current.value = '';
    }
  };

  // Filter games
  const filteredGames = games.filter(game => {
    if (searchQuery && !game.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterCategory !== 'all' && game.category !== filterCategory) return false;
    return true;
  });

  const handleSave = async () => {
    if (!formData.name || !formData.slug) {
      alert('Please fill in required fields: Name and Slug');
      return;
    }

    setSaving(true);
    try {
      if (isAdding) {
        // Create new game
        const response = await fetch('/api/games', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          alert(data.error || 'Failed to create game');
          return;
        }
        
        setGames([...games, dbGameToGame(data.game)]);
      } else if (editingGame) {
        // Update existing game
        const response = await fetch('/api/games', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          alert(data.error || 'Failed to update game');
          return;
        }
        
        setGames(games.map(g => g.id === formData.id ? dbGameToGame(data.game) : g));
      }

      setEditingGame(null);
      setIsAdding(false);
      setFormData(emptyGame);
    } catch (error) {
      console.error('Error saving game:', error);
      alert('Failed to save game');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (game: Game) => {
    setEditingGame(game);
    setFormData({
      ...emptyGame,
      ...game,
      features: game.features || [],
      tipsAndStrategies: game.tipsAndStrategies || [],
      faqs: game.faqs || []
    });
    setIsAdding(false);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingGame(null);
    setFormData({
      ...emptyGame,
      id: `game-${Date.now()}`,
      slug: `new-game-${Date.now()}`
    });
  };

  const handleDelete = async (gameId: string) => {
    try {
      const response = await fetch(`/api/games?id=${gameId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        alert(data.error || 'Failed to delete game');
        return;
      }
      
      setGames(games.filter(g => g.id !== gameId));
    } catch (error) {
      console.error('Error deleting game:', error);
      alert('Failed to delete game');
    }
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...(formData.features || []), featureInput.trim()]
      });
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features?.filter((_, i) => i !== index)
    });
  };

  const addTip = () => {
    if (tipInput.trim()) {
      setFormData({
        ...formData,
        tipsAndStrategies: [...(formData.tipsAndStrategies || []), tipInput.trim()]
      });
      setTipInput('');
    }
  };

  const removeTip = (index: number) => {
    setFormData({
      ...formData,
      tipsAndStrategies: formData.tipsAndStrategies?.filter((_, i) => i !== index)
    });
  };

  const addFaq = () => {
    if (faqInput.question.trim() && faqInput.answer.trim()) {
      setFormData({
        ...formData,
        faqs: [...(formData.faqs || []), { ...faqInput }]
      });
      setFaqInput({ question: '', answer: '' });
    }
  };

  const removeFaq = (index: number) => {
    setFormData({
      ...formData,
      faqs: formData.faqs?.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-purple-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Settings className="h-6 w-6 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
              <p className="text-purple-300">Manage your games and content</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/">
              <Button
                variant="outline"
                className="border-purple-600 text-purple-300 hover:bg-purple-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Site
              </Button>
            </Link>
            <Button
              onClick={handleAdd}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Game
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Games', value: games.length, color: 'text-yellow-400' },
            { label: 'Slots', value: games.filter(g => g.category === 'slots').length, color: 'text-purple-400' },
            { label: 'Casino', value: games.filter(g => g.category === 'casino').length, color: 'text-green-400' },
            { label: 'Featured', value: games.filter(g => g.isFeatured).length, color: 'text-pink-400' }
          ].map((stat, i) => (
            <Card key={i} className="bg-gradient-to-br from-purple-900/50 to-purple-950/50 border-purple-700/30">
              <CardContent className="p-4">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-purple-400">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="bg-gradient-to-br from-purple-900/50 to-purple-950/50 border-purple-700/30 mb-8">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" />
                <Input
                  placeholder="Search games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-purple-800/30 border-purple-600/50 text-white placeholder:text-purple-400"
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full md:w-48 bg-purple-800/30 border-purple-600/50 text-white">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-purple-900 border-purple-700">
                  <SelectItem value="all">All Categories</SelectItem>
                  {gameCategories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.icon} {cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Form */}
        <AnimatePresence>
          {(isAdding || editingGame) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <Card className="bg-gradient-to-br from-purple-900/50 to-purple-950/50 border-yellow-500/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">
                      {isAdding ? 'Add New Game' : `Edit: ${editingGame?.name}`}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingGame(null);
                        setIsAdding(false);
                        setFormData(emptyGame);
                      }}
                      className="text-purple-300 hover:text-white"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid grid-cols-4 mb-6 bg-purple-800/30">
                      <TabsTrigger value="basic" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
                        <Gamepad2 className="h-4 w-4 mr-2" />
                        Basic Info
                      </TabsTrigger>
                      <TabsTrigger value="details" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
                        <Settings className="h-4 w-4 mr-2" />
                        Game Details
                      </TabsTrigger>
                      <TabsTrigger value="blog" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
                        <FileText className="h-4 w-4 mr-2" />
                        Blog Content
                      </TabsTrigger>
                      <TabsTrigger value="faqs" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
                        <HelpCircle className="h-4 w-4 mr-2" />
                        FAQs
                      </TabsTrigger>
                    </TabsList>

                    <ScrollArea className="h-[60vh]">
                      {/* Basic Info Tab */}
                      <TabsContent value="basic" className="space-y-6 mt-0">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-purple-300">Game Name *</Label>
                            <Input
                              value={formData.name}
                              onChange={(e) => setFormData({
                                ...formData,
                                name: e.target.value,
                                slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                              })}
                              className="bg-purple-800/30 border-purple-600/50 text-white"
                              placeholder="e.g., Book of Ra"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-purple-300">URL Slug *</Label>
                            <Input
                              value={formData.slug}
                              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                              className="bg-purple-800/30 border-purple-600/50 text-white"
                              placeholder="e.g., book-of-ra"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-purple-300">Short Description</Label>
                          <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="bg-purple-800/30 border-purple-600/50 text-white min-h-[80px]"
                            placeholder="Brief game description for cards and listings..."
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-purple-300">Thumbnail Image</Label>
                            <div className="flex gap-2">
                              <Input
                                value={formData.thumbnail}
                                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                                className="bg-purple-800/30 border-purple-600/50 text-white flex-1"
                                placeholder="https://..."
                              />
                              <input
                                ref={thumbnailInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleThumbnailChange}
                                className="hidden"
                                id="thumbnail-upload"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => thumbnailInputRef.current?.click()}
                                disabled={uploadingThumbnail}
                                className="border-purple-600 text-purple-300 hover:bg-purple-700 shrink-0"
                              >
                                {uploadingThumbnail ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Upload className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                            {formData.thumbnail && (
                              <img
                                src={formData.thumbnail}
                                alt="Thumbnail preview"
                                className="w-24 h-16 object-cover rounded mt-2"
                              />
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label className="text-purple-300">Banner Image</Label>
                            <div className="flex gap-2">
                              <Input
                                value={formData.bannerImage}
                                onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                                className="bg-purple-800/30 border-purple-600/50 text-white flex-1"
                                placeholder="https://..."
                              />
                              <input
                                ref={bannerInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleBannerChange}
                                className="hidden"
                                id="banner-upload"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => bannerInputRef.current?.click()}
                                disabled={uploadingBanner}
                                className="border-purple-600 text-purple-300 hover:bg-purple-700 shrink-0"
                              >
                                {uploadingBanner ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Upload className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                            {formData.bannerImage && (
                              <img
                                src={formData.bannerImage}
                                alt="Banner preview"
                                className="w-full h-16 object-cover rounded mt-2"
                              />
                            )}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-purple-300">Category</Label>
                            <Select 
                              value={formData.category} 
                              onValueChange={(value) => setFormData({ ...formData, category: value as Game['category'] })}
                            >
                              <SelectTrigger className="bg-purple-800/30 border-purple-600/50 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-purple-900 border-purple-700">
                                {gameCategories.map(cat => (
                                  <SelectItem key={cat.id} value={cat.id}>{cat.icon} {cat.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-purple-300">Provider</Label>
                            <Input
                              value={formData.provider}
                              onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                              className="bg-purple-800/30 border-purple-600/50 text-white"
                              placeholder="e.g., Novomatic"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-purple-300">Download Link</Label>
                          <Input
                            value={formData.downloadLink || ''}
                            onChange={(e) => setFormData({ ...formData, downloadLink: e.target.value })}
                            className="bg-purple-800/30 border-purple-600/50 text-white"
                            placeholder="https://example.com/download/game.apk"
                          />
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.isFeatured}
                              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                              className="w-4 h-4 rounded bg-purple-800 border-purple-600"
                            />
                            <span className="text-purple-300">Featured</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.isNew}
                              onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                              className="w-4 h-4 rounded bg-purple-800 border-purple-600"
                            />
                            <span className="text-purple-300">New</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.isPopular}
                              onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                              className="w-4 h-4 rounded bg-purple-800 border-purple-600"
                            />
                            <span className="text-purple-300">Popular</span>
                          </label>
                        </div>
                      </TabsContent>

                      {/* Game Details Tab */}
                      <TabsContent value="details" className="space-y-6 mt-0">
                        <div className="grid md:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <Label className="text-purple-300">Min Bet</Label>
                            <Input
                              type="number"
                              value={formData.minBet}
                              onChange={(e) => setFormData({ ...formData, minBet: parseInt(e.target.value) || 0 })}
                              className="bg-purple-800/30 border-purple-600/50 text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-purple-300">Max Bet</Label>
                            <Input
                              type="number"
                              value={formData.maxBet}
                              onChange={(e) => setFormData({ ...formData, maxBet: parseInt(e.target.value) || 0 })}
                              className="bg-purple-800/30 border-purple-600/50 text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-purple-300">RTP %</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={formData.rtp || ''}
                              onChange={(e) => setFormData({ ...formData, rtp: parseFloat(e.target.value) || undefined })}
                              className="bg-purple-800/30 border-purple-600/50 text-white"
                              placeholder="96.5"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-purple-300">Jackpot</Label>
                            <Input
                              type="number"
                              value={formData.jackpot || ''}
                              onChange={(e) => setFormData({ ...formData, jackpot: parseInt(e.target.value) || undefined })}
                              className="bg-purple-800/30 border-purple-600/50 text-white"
                              placeholder="50000"
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-purple-300">Volatility</Label>
                            <Select 
                              value={formData.volatility || 'medium'} 
                              onValueChange={(value) => setFormData({ ...formData, volatility: value as 'low' | 'medium' | 'high' })}
                            >
                              <SelectTrigger className="bg-purple-800/30 border-purple-600/50 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-purple-900 border-purple-700">
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-purple-300">Reels</Label>
                            <Input
                              type="number"
                              value={formData.reels || ''}
                              onChange={(e) => setFormData({ ...formData, reels: parseInt(e.target.value) || undefined })}
                              className="bg-purple-800/30 border-purple-600/50 text-white"
                              placeholder="5"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-purple-300">Paylines</Label>
                            <Input
                              type="number"
                              value={formData.paylines || ''}
                              onChange={(e) => setFormData({ ...formData, paylines: parseInt(e.target.value) || undefined })}
                              className="bg-purple-800/30 border-purple-600/50 text-white"
                              placeholder="20"
                            />
                          </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-2">
                          <Label className="text-purple-300">Game Features</Label>
                          <div className="flex gap-2">
                            <Input
                              value={featureInput}
                              onChange={(e) => setFeatureInput(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                              className="bg-purple-800/30 border-purple-600/50 text-white"
                              placeholder="e.g., Free Spins"
                            />
                            <Button onClick={addFeature} variant="outline" className="border-purple-600 text-purple-300">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {formData.features?.map((feature, i) => (
                              <Badge key={i} className="bg-purple-700/50 text-white pr-1">
                                {feature}
                                <button onClick={() => removeFeature(i)} className="ml-2 hover:text-red-400">
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </TabsContent>

                      {/* Blog Content Tab */}
                      <TabsContent value="blog" className="space-y-6 mt-0">
                        <div className="space-y-2">
                          <Label className="text-purple-300 flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Game Overview
                          </Label>
                          <Textarea
                            value={formData.gameOverview || ''}
                            onChange={(e) => setFormData({ ...formData, gameOverview: e.target.value })}
                            className="bg-purple-800/30 border-purple-600/50 text-white min-h-[120px]"
                            placeholder="Write a comprehensive overview of the game..."
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-purple-300 flex items-center gap-2">
                            <Gamepad2 className="h-4 w-4" />
                            How to Play
                          </Label>
                          <Textarea
                            value={formData.howToPlay || ''}
                            onChange={(e) => setFormData({ ...formData, howToPlay: e.target.value })}
                            className="bg-purple-800/30 border-purple-600/50 text-white min-h-[120px]"
                            placeholder="Explain how to play the game step by step..."
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-purple-300">Tips & Strategies</Label>
                          <div className="flex gap-2">
                            <Input
                              value={tipInput}
                              onChange={(e) => setTipInput(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTip())}
                              className="bg-purple-800/30 border-purple-600/50 text-white"
                              placeholder="Add a tip or strategy..."
                            />
                            <Button onClick={addTip} variant="outline" className="border-purple-600 text-purple-300">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="space-y-2 mt-2">
                            {formData.tipsAndStrategies?.map((tip, i) => (
                              <div key={i} className="flex items-start gap-2 p-2 bg-purple-800/20 rounded-lg">
                                <span className="text-yellow-400 font-bold">{i + 1}.</span>
                                <span className="text-white flex-1">{tip}</span>
                                <button onClick={() => removeTip(i)} className="text-purple-400 hover:text-red-400">
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-purple-300">Game History</Label>
                          <Textarea
                            value={formData.gameHistory || ''}
                            onChange={(e) => setFormData({ ...formData, gameHistory: e.target.value })}
                            className="bg-purple-800/30 border-purple-600/50 text-white min-h-[100px]"
                            placeholder="Background and history of the game..."
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-purple-300">How to Create Account</Label>
                          <Textarea
                            value={formData.howToCreateAccount || ''}
                            onChange={(e) => setFormData({ ...formData, howToCreateAccount: e.target.value })}
                            className="bg-purple-800/30 border-purple-600/50 text-white min-h-[100px]"
                            placeholder="Steps to create an account..."
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-purple-300">How to Download & Install</Label>
                          <Textarea
                            value={formData.howToDownloadAndInstall || ''}
                            onChange={(e) => setFormData({ ...formData, howToDownloadAndInstall: e.target.value })}
                            className="bg-purple-800/30 border-purple-600/50 text-white min-h-[100px]"
                            placeholder="Download and installation instructions..."
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-purple-300">Conclusion</Label>
                          <Textarea
                            value={formData.conclusion || ''}
                            onChange={(e) => setFormData({ ...formData, conclusion: e.target.value })}
                            className="bg-purple-800/30 border-purple-600/50 text-white min-h-[100px]"
                            placeholder="Final thoughts and conclusion..."
                          />
                        </div>
                      </TabsContent>

                      {/* FAQs Tab */}
                      <TabsContent value="faqs" className="space-y-6 mt-0">
                        <div className="space-y-4">
                          <Label className="text-purple-300">Frequently Asked Questions</Label>
                          
                          {/* Add FAQ */}
                          <Card className="bg-purple-800/20 border-purple-700/30">
                            <CardContent className="p-4 space-y-3">
                              <Input
                                value={faqInput.question}
                                onChange={(e) => setFaqInput({ ...faqInput, question: e.target.value })}
                                className="bg-purple-800/30 border-purple-600/50 text-white"
                                placeholder="Question..."
                              />
                              <Textarea
                                value={faqInput.answer}
                                onChange={(e) => setFaqInput({ ...faqInput, answer: e.target.value })}
                                className="bg-purple-800/30 border-purple-600/50 text-white min-h-[80px]"
                                placeholder="Answer..."
                              />
                              <Button onClick={addFaq} variant="outline" className="border-purple-600 text-purple-300">
                                <Plus className="h-4 w-4 mr-2" />
                                Add FAQ
                              </Button>
                            </CardContent>
                          </Card>

                          {/* FAQ List */}
                          <div className="space-y-3">
                            {formData.faqs?.map((faq, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-purple-800/20 rounded-lg border border-purple-700/30"
                              >
                                <div className="flex justify-between items-start gap-4">
                                  <div>
                                    <p className="text-white font-medium">Q: {faq.question}</p>
                                    <p className="text-purple-300 mt-1">A: {faq.answer}</p>
                                  </div>
                                  <button
                                    onClick={() => removeFaq(i)}
                                    className="text-purple-400 hover:text-red-400 shrink-0"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                    </ScrollArea>

                    {/* Save Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-purple-700/30 mt-4">
                      <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Game
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingGame(null);
                          setIsAdding(false);
                          setFormData(emptyGame);
                        }}
                        className="border-purple-600 text-purple-300"
                      >
                        Cancel
                      </Button>
                    </div>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Games List */}
        <Card className="bg-gradient-to-br from-purple-900/50 to-purple-950/50 border-purple-700/30">
          <CardHeader>
            <CardTitle className="text-white">Games Library</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
              </div>
            ) : filteredGames.length > 0 ? (
              <div className="space-y-3">
                {filteredGames.map((game) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 p-4 bg-purple-800/20 rounded-lg hover:bg-purple-800/40 transition-colors"
                  >
                    <img
                      src={game.thumbnail}
                      alt={game.name}
                      className="w-16 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-white font-medium truncate">{game.name}</h3>
                        {game.isFeatured && <Badge className="bg-yellow-500 text-black text-xs">Featured</Badge>}
                        {game.isNew && <Badge className="bg-green-500 text-white text-xs">New</Badge>}
                        {game.isPopular && <Badge className="bg-pink-500 text-white text-xs">Popular</Badge>}
                      </div>
                      <p className="text-purple-400 text-sm truncate">{game.provider} • {game.category}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(game)}
                        className="border-purple-600 text-purple-300 hover:bg-purple-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-purple-900 border-purple-700">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">Delete Game</AlertDialogTitle>
                            <AlertDialogDescription className="text-purple-300">
                              Are you sure you want to delete "{game.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-purple-800 text-white border-purple-700">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(game.id)}
                              className="bg-red-500 text-white hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Gamepad2 className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <p className="text-purple-400">No games found. Add your first game to get started!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Main Admin Page
export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return <AdminPanel />;
}
