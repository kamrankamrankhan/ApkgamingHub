'use client';

import { useGameStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/DynamicSEO';

export default function ProfilePage() {
  const { user, transactions } = useGameStore();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-950 via-purple-900 to-purple-950">
        <SEOHead view="profile" />
        <Header />
        <main className="flex-1 container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-purple-200">Please log in to view your profile.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const stats = [
    { label: 'Total Games Played', value: transactions.length },
    { label: 'Total Wins', value: transactions.filter((t) => t.type === 'win').length },
    { label: 'Total Losses', value: transactions.filter((t) => t.type === 'loss').length },
    {
      label: 'Biggest Win',
      value: Math.max(0, ...transactions.filter((t) => t.type === 'win').map((t) => t.amount)),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-950 via-purple-900 to-purple-950">
      <SEOHead view="profile" />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-500">
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{user.name}</h1>
              <p className="text-purple-300">@{user.username}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <Card
                key={i}
                className="bg-gradient-to-br from-purple-900/50 to-purple-950/50 border-purple-700/30"
              >
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-white">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </p>
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
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          transaction.amount > 0 ? 'bg-green-500/20' : 'bg-red-500/20'
                        }`}
                      >
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
                    <span
                      className={`font-bold ${
                        transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {transaction.amount > 0 ? '+' : ''}
                      {transaction.amount.toLocaleString()}
                    </span>
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

