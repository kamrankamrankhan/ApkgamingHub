'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit, Trash2, Save, X, Search, Upload, 
  Image, Gamepad2, Settings, AlertCircle, Check,
  ChevronLeft, ChevronRight, Eye, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { useGameStore, ViewType } from '@/lib/store';
import { Game } from '@/lib/games-data';
import { gameCategories } from '@/lib/games-data';

// Admin Login Component
export function AdminLogin() {
  const { setAdmin, setCurrentView } = useGameStore();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    // Simple password check (in production, use proper auth)
    if (password === 'admin123') {
      setAdmin(true);
      setCurrentView('admin');
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
            <Button
              variant="ghost"
              className="w-full text-purple-300 hover:text-white"
              onClick={() => setCurrentView('home')}
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// Admin Panel Component
export function AdminPanel() {
  const { games, addGame, updateGame, deleteGame, setCurrentView, isAdmin } = useGameStore();
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
    provider: 'GameTwist',
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
    reels: undefined
  };

  const [formData, setFormData] = useState<Game>(emptyGame);
  const [featureInput, setFeatureInput] = useState('');
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

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
    // Reset input
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
    // Reset input
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

  const handleSave = () => {
    if (!formData.name || !formData.slug) {
      alert('Please fill in required fields: Name and Slug');
      return;
    }

    if (isAdding) {
      const newGame = {
        ...formData,
        id: formData.slug || `game-${Date.now()}`
      };
      addGame(newGame);
    } else if (editingGame) {
      updateGame(formData);
    }

    setEditingGame(null);
    setIsAdding(false);
    setFormData(emptyGame);
  };

  const handleEdit = (game: Game) => {
    setEditingGame(game);
    setFormData(game);
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

  const handleDelete = (gameId: string) => {
    deleteGame(gameId);
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

  const handleLogout = () => {
    useGameStore.getState().setAdmin(false);
    setCurrentView('home');
  };

  if (!isAdmin) {
    return <AdminLogin />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
          <Button
            onClick={handleAdd}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Game
          </Button>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
      <Card className="bg-gradient-to-br from-purple-900/50 to-purple-950/50 border-purple-700/30">
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
              <CardContent className="space-y-6">
                {/* Basic Info */}
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
                  <Label className="text-purple-300">Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-purple-800/30 border-purple-600/50 text-white min-h-[80px]"
                    placeholder="Game description..."
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
                        className="w-20 h-16 object-cover rounded mt-2"
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

                {/* Category and Provider */}
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

                {/* Betting */}
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

                {/* Slot-specific */}
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
                  <Label className="text-purple-300">Features</Label>
                  <div className="flex gap-2">
                    <Input
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addFeature()}
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

                {/* Preview */}
                <div className="p-4 bg-purple-800/20 rounded-lg">
                  <p className="text-sm text-purple-400 mb-2">Preview</p>
                  <div className="flex items-center gap-4">
                    <img
                      src={formData.thumbnail}
                      alt="Preview"
                      className="w-20 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-bold text-white">{formData.name || 'Game Name'}</p>
                      <p className="text-sm text-purple-300">{formData.provider}</p>
                      <div className="flex gap-1 mt-1">
                        {formData.isFeatured && <Badge className="bg-yellow-500 text-black text-[10px]">HOT</Badge>}
                        {formData.isNew && <Badge className="bg-green-500 text-white text-[10px]">NEW</Badge>}
                        {formData.isPopular && <Badge className="bg-pink-500 text-white text-[10px]">POPULAR</Badge>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2">
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
                  <Button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isAdding ? 'Add Game' : 'Save Changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Games List */}
      <Card className="bg-gradient-to-br from-purple-900/50 to-purple-950/50 border-purple-700/30">
        <CardHeader>
          <CardTitle className="text-white">Games ({filteredGames.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredGames.map((game) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-4 p-3 bg-purple-800/20 rounded-lg hover:bg-purple-800/30 transition-colors"
              >
                <img
                  src={game.thumbnail}
                  alt={game.name}
                  className="w-16 h-12 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{game.name}</p>
                  <p className="text-sm text-purple-400">{game.provider} • {game.category}</p>
                </div>
                <div className="flex gap-1">
                  {game.isFeatured && <Badge className="bg-yellow-500/20 text-yellow-400 text-[10px]">HOT</Badge>}
                  {game.isNew && <Badge className="bg-green-500/20 text-green-400 text-[10px]">NEW</Badge>}
                  {game.isPopular && <Badge className="bg-pink-500/20 text-pink-400 text-[10px]">POP</Badge>}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(game)}
                    className="text-purple-300 hover:text-yellow-400"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-purple-300 hover:text-red-400"
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
                        <AlertDialogCancel className="bg-purple-800 text-white border-purple-600">Cancel</AlertDialogCancel>
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
        </CardContent>
      </Card>
    </div>
  );
}
