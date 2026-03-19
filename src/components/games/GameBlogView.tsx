'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ChevronRight,
  Heart,
  Share2,
  Settings,
  Clock,
  Users,
  Target,
  Award,
  Check,
  Download,
  Info,
  Gamepad2,
  MessageCircle,
  Eye,
  ThumbsUp,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Game } from '@/lib/games-data';
import { useGameStore } from '@/lib/store';
import { getGameBlogContent } from '@/lib/game-blog-content';
import { gamesListHrefForCategory, getGameDetailHref } from '@/lib/game-routes';

export interface GameBlogViewProps {
  game: Game;
  games: Game[];
}

export function GameBlogView({ game, games }: GameBlogViewProps) {
  const { favorites, toggleFavorite } = useGameStore();
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const blogContent = getGameBlogContent(game);
  const isFavorite = favorites.includes(game.id);
  const backHref = gamesListHrefForCategory(game.category);

  const handleDownload = () => {
    if (game.downloadLink) {
      window.open(game.downloadLink, '_blank');
      setDownloaded(true);
    } else {
      setDownloading(true);
      setTimeout(() => {
        setDownloading(false);
        setDownloaded(true);
      }, 2000);
    }
  };

  const relatedGames = games
    .filter((g) => g.category === game.category && g.id !== game.id)
    .slice(0, 4);

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-8">
      <Button variant="ghost" className="text-purple-300 hover:text-white" asChild>
        <Link href={backHref}>
          <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
          Back to Games
        </Link>
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden"
      >
        <div className="aspect-[21/9] relative">
          <img
            src={game.bannerImage || game.thumbnail}
            alt={game.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-950 via-purple-950/50 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {game.isNew && <Badge className="bg-green-500 text-white">NEW</Badge>}
                {game.isFeatured && <Badge className="bg-yellow-500 text-black">FEATURED</Badge>}
                {game.isPopular && <Badge className="bg-pink-500 text-white">POPULAR</Badge>}
                <Badge variant="outline" className="border-purple-500 text-purple-300">
                  {game.provider}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{game.name}</h1>
              <p className="text-purple-300 text-lg">{game.description}</p>
            </div>

            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }}>
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

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-950/50 border-purple-700/30">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {game.rtp && (
                  <div className="text-center p-4 bg-purple-800/30 rounded-lg">
                    <p className="text-2xl font-bold text-green-400">{game.rtp}%</p>
                    <p className="text-sm text-purple-400">RTP</p>
                  </div>
                )}
                <div className="text-center p-4 bg-purple-800/30 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-400">{game.minBet}</p>
                  <p className="text-sm text-purple-400">Min Bet</p>
                </div>
                <div className="text-center p-4 bg-purple-800/30 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-400">{game.maxBet.toLocaleString()}</p>
                  <p className="text-sm text-purple-400">Max Bet</p>
                </div>
                {game.volatility && (
                  <div className="text-center p-4 bg-purple-800/30 rounded-lg">
                    <p className="text-2xl font-bold text-white capitalize">{game.volatility}</p>
                    <p className="text-sm text-purple-400">Volatility</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-950/50 border-purple-700/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Info className="h-5 w-5 text-yellow-400" />
                Game Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-200 leading-relaxed text-lg">{blogContent.overview}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-950/50 border-purple-700/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Gamepad2 className="h-5 w-5 text-yellow-400" />
                How to Play
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-200 leading-relaxed">{blogContent.howToPlay}</p>
            </CardContent>
          </Card>

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

          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-950/50 border-purple-700/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-400" />
                Game History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-200 leading-relaxed">{blogContent.history}</p>
            </CardContent>
          </Card>

          {game.features && game.features.length > 0 && (
            <Card className="bg-gradient-to-br from-purple-900/50 to-purple-950/50 border-purple-700/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-400" />
                  Game Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {game.features.map((feature, i) => (
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

          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-950/50 border-purple-700/30">
            <CardHeader>
              <CardTitle className="text-white">Game Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {game.reels && (
                  <div className="flex justify-between py-2 border-b border-purple-700/30">
                    <span className="text-purple-400">Reels</span>
                    <span className="text-white font-medium">{game.reels}</span>
                  </div>
                )}
                {game.paylines && (
                  <div className="flex justify-between py-2 border-b border-purple-700/30">
                    <span className="text-purple-400">Paylines</span>
                    <span className="text-white font-medium">{game.paylines}</span>
                  </div>
                )}
                {game.jackpot && (
                  <div className="flex justify-between py-2 border-b border-purple-700/30">
                    <span className="text-purple-400">Max Jackpot</span>
                    <span className="text-yellow-400 font-medium">{game.jackpot.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-purple-700/30">
                  <span className="text-purple-400">Category</span>
                  <span className="text-white font-medium capitalize">{game.category}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-purple-700/30">
                  <span className="text-purple-400">Provider</span>
                  <span className="text-white font-medium">{game.provider}</span>
                </div>
                {game.volatility && (
                  <div className="flex justify-between py-2 border-b border-purple-700/30">
                    <span className="text-purple-400">Volatility</span>
                    <span className="text-white font-medium capitalize">{game.volatility}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {game.howToDownloadAndInstall && (
            <Card className="bg-gradient-to-br from-purple-900/50 to-purple-950/50 border-purple-700/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Download className="h-5 w-5 text-yellow-400" />
                  How to Download and Install
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-purple-200 leading-relaxed whitespace-pre-line">
                  {game.howToDownloadAndInstall}
                </div>
              </CardContent>
            </Card>
          )}

          {game.howToCreateAccount && (
            <Card className="bg-gradient-to-br from-purple-900/50 to-purple-950/50 border-purple-700/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-yellow-400" />
                  How to Create Account
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-purple-200 leading-relaxed whitespace-pre-line">
                  {game.howToCreateAccount}
                </div>
              </CardContent>
            </Card>
          )}

          {game.faqs && game.faqs.length > 0 && (
            <Card className="bg-gradient-to-br from-purple-900/50 to-purple-950/50 border-purple-700/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-yellow-400" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {game.faqs.map((faq, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-4 bg-purple-800/30 rounded-lg"
                    >
                      <h4 className="font-semibold text-yellow-400 mb-2">{faq.question}</h4>
                      <p className="text-purple-200 text-sm">{faq.answer}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {game.conclusion && (
            <Card className="bg-gradient-to-br from-purple-900/50 to-purple-950/50 border-purple-700/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-400" />
                  Conclusion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-200 leading-relaxed">{game.conclusion}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
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
                onClick={() => toggleFavorite(game.id)}
              >
                <Heart className="h-5 w-5 mr-2" fill={isFavorite ? 'currentColor' : 'none'} />
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>

              <Button
                variant="outline"
                className="w-full border-purple-600 text-purple-300"
                type="button"
                onClick={handleShare}
              >
                <Share2 className="h-5 w-5 mr-2" />
                Copy link
              </Button>
            </CardContent>
          </Card>

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

          {relatedGames.length > 0 && (
            <Card className="bg-gradient-to-br from-purple-900/50 to-purple-950/50 border-purple-700/30">
              <CardHeader>
                <CardTitle className="text-white">Related Games</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {relatedGames.map((g) => (
                  <Link
                    key={g.id}
                    href={getGameDetailHref(g)}
                    className="flex items-center gap-3 p-2 rounded-lg bg-purple-800/20 hover:bg-purple-800/40 transition-colors"
                  >
                    <img src={g.thumbnail} alt={g.name} className="w-16 h-12 object-cover rounded" />
                    <div>
                      <p className="text-white font-medium text-sm">{g.name}</p>
                      <p className="text-purple-400 text-xs">{g.provider}</p>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
