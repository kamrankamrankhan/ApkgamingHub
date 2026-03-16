import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const DEMO_USER_ID = 'demo-user-001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gameId, betAmount } = body;

    if (!gameId || typeof betAmount !== 'number' || betAmount <= 0) {
      return NextResponse.json(
        { error: 'Invalid game ID or bet amount' },
        { status: 400 }
      );
    }

    // Get user
    const user = await db.user.findUnique({
      where: { id: DEMO_USER_ID },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.twists < betAmount) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Get game
    const game = await db.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    // Simulate game outcome
    // For demo, we'll use a simple random win/loss calculation
    const winChance = game.rtp ? game.rtp / 100 : 0.5; // Use RTP if available
    const volatility = game.volatility || 'medium';
    
    // Calculate multiplier based on volatility
    let maxMultiplier: number;
    switch (volatility) {
      case 'high':
        maxMultiplier = 10;
        break;
      case 'low':
        maxMultiplier = 2;
        break;
      default:
        maxMultiplier = 5;
    }

    // Determine outcome
    const random = Math.random();
    let winAmount = 0;
    let outcome: 'win' | 'loss' = 'loss';

    if (random < winChance) {
      // Win - random multiplier up to max
      const multiplier = 1 + Math.random() * (maxMultiplier - 1);
      winAmount = Math.floor(betAmount * multiplier);
      outcome = 'win';
    }

    // Update user balance and XP
    const balanceChange = winAmount - betAmount;
    const xpGained = Math.floor(betAmount / 10); // 1 XP per 10 twists bet
    const vipPointsGained = Math.floor(betAmount / 100); // 1 VIP point per 100 twists

    // Calculate new level
    let newXP = user.xp + xpGained;
    let newLevel = user.level;
    const xpPerLevel = 1000;
    
    while (newXP >= xpPerLevel * newLevel) {
      newXP -= xpPerLevel * newLevel;
      newLevel++;
    }

    // Calculate new VIP status
    const newVIPPoints = user.vipPoints + vipPointsGained;
    let newVIPStatus = user.vipStatus;
    if (newVIPPoints >= 50000) newVIPStatus = 'Diamond';
    else if (newVIPPoints >= 15000) newVIPStatus = 'Platinum';
    else if (newVIPPoints >= 5000) newVIPStatus = 'Gold';
    else if (newVIPPoints >= 1000) newVIPStatus = 'Silver';
    else newVIPStatus = 'Bronze';

    // Update user
    await db.user.update({
      where: { id: DEMO_USER_ID },
      data: {
        twists: user.twists + balanceChange,
        xp: newXP,
        level: newLevel,
        vipPoints: newVIPPoints,
        vipStatus: newVIPStatus,
      },
    });

    // Create game session
    await db.gameSession.create({
      data: {
        userId: DEMO_USER_ID,
        gameId,
        betAmount,
        winAmount,
        outcome,
      },
    });

    // Create transaction
    if (winAmount > 0) {
      await db.transaction.create({
        data: {
          userId: DEMO_USER_ID,
          type: 'win',
          amount: winAmount,
          description: `Win in ${game.name}`,
          status: 'completed',
        },
      });
    } else {
      await db.transaction.create({
        data: {
          userId: DEMO_USER_ID,
          type: 'loss',
          amount: -betAmount,
          description: `Loss in ${game.name}`,
          status: 'completed',
        },
      });
    }

    // Get updated user
    const updatedUser = await db.user.findUnique({
      where: { id: DEMO_USER_ID },
    });

    return NextResponse.json({
      outcome,
      betAmount,
      winAmount,
      balanceChange,
      xpGained,
      vipPointsGained,
      leveledUp: newLevel > user.level,
      newLevel: newLevel > user.level ? newLevel : undefined,
      newVIPStatus: newVIPStatus !== user.vipStatus ? newVIPStatus : undefined,
      user: updatedUser ? {
        id: updatedUser.id,
        twists: updatedUser.twists,
        level: updatedUser.level,
        xp: updatedUser.xp,
        vipStatus: updatedUser.vipStatus,
        vipPoints: updatedUser.vipPoints,
      } : null,
    });
  } catch (error) {
    console.error('Error playing game:', error);
    return NextResponse.json(
      { error: 'Failed to play game' },
      { status: 500 }
    );
  }
}
