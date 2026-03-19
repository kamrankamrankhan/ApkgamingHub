import type { Game } from '@/lib/games-data';

export function getGameBlogContent(game: Game) {
  const defaultContent: Record<
    string,
    { overview: string; howToPlay: string; tips: string[]; history: string }
  > = {
    slots: {
      overview: `${game.name} is an exciting slot machine game that brings the thrill of Vegas right to your screen. With ${game.reels || 5} reels and ${game.paylines || 'multiple'} paylines, this game offers endless entertainment and the chance to win big!`,
      howToPlay: `Playing ${game.name} is simple and straightforward. First, set your bet amount using the controls at the bottom of the screen. You can adjust your bet from ${game.minBet} to ${game.maxBet.toLocaleString()} Twists. Once you've set your bet, hit the spin button and watch the reels come to life! Match symbols across the paylines to win prizes.`,
      tips: [
        'Start with smaller bets to understand the game mechanics',
        'Look out for special symbols like Wilds and Scatters',
        game.features?.includes('Free Spins')
          ? 'Free Spins can significantly boost your winnings!'
          : 'Bonus rounds offer extra winning opportunities',
        'Set a budget before playing and stick to it',
        'Higher volatility means bigger but less frequent wins',
      ],
      history: `Slot machines have a rich history dating back to the late 19th century. ${game.name} continues this tradition while incorporating modern graphics and gameplay features that make it a favorite among players worldwide.`,
    },
    casino: {
      overview: `${game.name} brings the authentic casino experience to your fingertips. Whether you're a seasoned player or new to casino games, this classic offers excitement and strategy in equal measure.`,
      howToPlay: `Master ${game.name} by understanding the rules and developing your strategy. Place your bets wisely and make decisions based on probability and intuition. The game offers various betting options to suit different playing styles.`,
      tips: [
        'Learn the basic rules before placing large bets',
        'Understand the odds and payouts for each bet type',
        'Practice with smaller bets first',
        'Set win and loss limits for each session',
        'Take breaks to maintain focus',
      ],
      history: `${game.name} has been a staple in casinos around the world for decades. Its enduring popularity speaks to the perfect blend of luck and skill required to play.`,
    },
    poker: {
      overview: `${game.name} is one of the most popular poker variants in the world. Test your skills against other players and see if you have what it takes to win the pot!`,
      howToPlay: `In ${game.name}, each player receives their cards and must make the best possible hand. Use your knowledge of poker hand rankings and betting strategies to outplay your opponents. Bluffing, reading opponents, and knowing when to fold are key skills.`,
      tips: [
        'Learn the hand rankings thoroughly',
        "Position is crucial - play tighter from early positions",
        "Don't bluff too often, especially against beginners",
        'Manage your bankroll carefully',
        "Practice reading your opponents' behavior",
      ],
      history: `Poker has evolved over centuries, and ${game.name} has become one of the most beloved variants, played in casinos and homes around the world.`,
    },
    skill: {
      overview: `${game.name} combines strategy and skill for a uniquely engaging experience. Unlike pure chance games, your decisions directly influence the outcome!`,
      howToPlay: `Success in ${game.name} requires careful planning and strategic thinking. Study the rules, practice regularly, and develop your own winning strategies. Each game presents new challenges and opportunities.`,
      tips: [
        'Practice regularly to improve your skills',
        'Study different strategies and techniques',
        'Learn from your mistakes',
        'Play against different opponents to gain experience',
        'Stay patient and focused during matches',
      ],
      history: `${game.name} has a long tradition as a game of skill and strategy, enjoyed by players who appreciate mental challenges.`,
    },
    bingo: {
      overview: `${game.name} offers fast-paced bingo action with multiple ways to win! Mark off your numbers and shout BINGO to claim your prize!`,
      howToPlay: `Playing ${game.name} is easy - just watch as numbers are called and mark them off your card. Complete a line, pattern, or full house to win! Different patterns offer different payouts.`,
      tips: [
        'Play multiple cards to increase your chances',
        'Pay attention to the numbers being called',
        'Look for games with fewer players for better odds',
        'Set a budget and stick to it',
        'Have fun and enjoy the social aspect!',
      ],
      history: `Bingo has been bringing people together for generations, and ${game.name} continues that tradition in the digital age.`,
    },
  };

  const defaults = defaultContent[game.category] || defaultContent.slots;

  return {
    overview: game.gameOverview || defaults.overview,
    howToPlay: game.howToPlay || defaults.howToPlay,
    tips:
      game.tipsAndStrategies && game.tipsAndStrategies.length > 0
        ? game.tipsAndStrategies
        : defaults.tips,
    history: game.gameHistory || defaults.history,
  };
}
