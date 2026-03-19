'use client';

import { useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/DynamicSEO';
import { GameBlogView } from '@/components/games/GameBlogView';
import { useGameStore } from '@/lib/store';
import { motion } from 'framer-motion';

export default function GameDetailPage() {
  const params = useParams();
  const rawId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const segment = useMemo(() => {
    try {
      return decodeURIComponent(rawId);
    } catch {
      return rawId;
    }
  }, [rawId]);

  const { games, gamesLoaded, fetchGames } = useGameStore();

  useEffect(() => {
    if (!gamesLoaded) fetchGames();
  }, [gamesLoaded, fetchGames]);

  const game = useMemo(() => {
    if (!segment || !games.length) return null;
    return (
      games.find((g) => g.id === segment || g.slug === segment) ??
      games.find((g) => encodeURIComponent(g.slug || g.id) === rawId) ??
      null
    );
  }, [games, segment, rawId]);

  if (!gamesLoaded) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-950 via-purple-900 to-purple-950">
        <SEOHead />
        <Header />
        <main className="flex-1 container mx-auto px-4 py-6 flex flex-col items-center justify-center min-h-[50vh]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full"
          />
          <p className="text-purple-300 mt-4">Loading game...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-950 via-purple-900 to-purple-950">
        <SEOHead />
        <Header />
        <main className="flex-1 container mx-auto px-4 py-6 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Game not found</h1>
          <p className="text-purple-300 mb-6">This game does not exist or was removed.</p>
          <Link href="/slots" className="text-yellow-400 hover:underline">
            Browse games
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-950 via-purple-900 to-purple-950">
      <SEOHead game={game} />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <GameBlogView game={game} games={games} />
      </main>
      <Footer />
    </div>
  );
}
