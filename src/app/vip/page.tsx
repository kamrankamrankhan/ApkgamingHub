'use client';

import { motion } from 'framer-motion';
import { Crown, Check, Target } from 'lucide-react';
import { useGameStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/DynamicSEO';

export default function VipPage() {
  const { user } = useGameStore();

  const vipTiers = [
    { name: 'Bronze', color: 'from-amber-700 to-amber-900', minPoints: 0, benefits: ['Daily Bonus', 'Basic Support'] },
    { name: 'Silver', color: 'from-gray-400 to-gray-600', minPoints: 1000, benefits: ['+10% Daily Bonus', 'Priority Support', 'Weekly Bonus'] },
    { name: 'Gold', color: 'from-yellow-500 to-yellow-700', minPoints: 5000, benefits: ['+20% Daily Bonus', 'VIP Support', 'Exclusive Games', 'Monthly Bonus'] },
    { name: 'Platinum', color: 'from-cyan-400 to-cyan-600', minPoints: 15000, benefits: ['+30% Daily Bonus', 'Personal Manager', 'All Games Unlocked', 'Exclusive Promotions'] },
    { name: 'Diamond', color: 'from-purple-400 to-purple-600', minPoints: 50000, benefits: ['+50% Daily Bonus', 'Dedicated Support', 'Highest Limits', 'VIP Events', 'Special Gifts'] },
  ] as const;

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-950 via-purple-900 to-purple-950">
        <SEOHead view="vip" />
        <Header />
        <main className="flex-1 container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white mb-2">VIP Program</h1>
          <p className="text-purple-200">Please log in to view your VIP status.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const currentTierIndex = vipTiers.findIndex((t) => t.name === user.vipStatus);
  const safeCurrentTierIndex = currentTierIndex >= 0 ? currentTierIndex : 0;
  const nextTier = safeCurrentTierIndex < vipTiers.length - 1 ? vipTiers[safeCurrentTierIndex + 1] : null;
  const progressToNext = nextTier ? ((user.vipPoints || 0) / nextTier.minPoints) * 100 : 100;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-950 via-purple-900 to-purple-950">
      <SEOHead view="vip" />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
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
            <div className={`h-2 bg-gradient-to-r ${vipTiers[safeCurrentTierIndex].color}`} />
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${vipTiers[safeCurrentTierIndex].color} flex items-center justify-center`}>
                    <Crown className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-400">Your VIP Status</p>
                    <h2 className="text-2xl font-bold text-white">{user.vipStatus}</h2>
                    <p className="text-purple-300">{user.vipPoints?.toLocaleString()} VIP Points</p>
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
                      {nextTier.minPoints - (user.vipPoints || 0)} points to next tier
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
                <Card
                  className={`bg-gradient-to-br from-purple-900/50 to-purple-950/50 border-purple-700/30 ${
                    tier.name === user.vipStatus ? 'ring-2 ring-yellow-500' : ''
                  } h-full`}
                >
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
                  { action: 'Daily Login', points: '10 points per day' },
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
      </main>
      <Footer />
    </div>
  );
}

