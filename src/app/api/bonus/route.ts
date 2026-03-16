import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const DEMO_USER_ID = 'demo-user-001';

export async function POST() {
  try {
    const user = await db.user.findUnique({
      where: { id: DEMO_USER_ID },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if bonus already claimed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastBonus = await db.transaction.findFirst({
      where: {
        userId: DEMO_USER_ID,
        type: 'daily_bonus',
        createdAt: { gte: today },
      },
    });

    if (lastBonus) {
      return NextResponse.json(
        { error: 'Daily bonus already claimed today', alreadyClaimed: true },
        { status: 400 }
      );
    }

    // Calculate bonus based on level and VIP status
    const baseBonus = 1000;
    const levelBonus = user.level * 100;
    
    let vipMultiplier = 1;
    switch (user.vipStatus) {
      case 'Silver': vipMultiplier = 1.2; break;
      case 'Gold': vipMultiplier = 1.5; break;
      case 'Platinum': vipMultiplier = 2; break;
      case 'Diamond': vipMultiplier = 3; break;
    }

    const totalBonus = Math.floor((baseBonus + levelBonus) * vipMultiplier);

    // Update user balance
    await db.user.update({
      where: { id: DEMO_USER_ID },
      data: {
        twists: user.twists + totalBonus,
      },
    });

    // Create transaction
    await db.transaction.create({
      data: {
        userId: DEMO_USER_ID,
        type: 'daily_bonus',
        amount: totalBonus,
        description: `Daily login bonus (Level ${user.level}, ${user.vipStatus})`,
        status: 'completed',
      },
    });

    return NextResponse.json({
      success: true,
      amount: totalBonus,
      baseBonus,
      levelBonus,
      vipMultiplier,
      message: `You received ${totalBonus.toLocaleString()} Twists!`,
    });
  } catch (error) {
    console.error('Error claiming bonus:', error);
    return NextResponse.json(
      { error: 'Failed to claim bonus' },
      { status: 500 }
    );
  }
}
