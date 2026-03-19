'use client';

import { useEffect } from 'react';
import { GamesListView } from '@/components/pages/GamesListView';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/DynamicSEO';
import { useGameStore } from '@/lib/store';

export default function PokerPage() {
  const { fetchGames, gamesLoaded } = useGameStore();

  useEffect(() => {
    if (!gamesLoaded) fetchGames();
  }, [gamesLoaded, fetchGames]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-950 via-purple-900 to-purple-950">
      <SEOHead view="poker" />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <GamesListView category="poker" />
      </main>
      <Footer />
    </div>
  );
}

