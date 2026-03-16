import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { gamesData } from '@/lib/games-data';

const DEMO_USER_ID = 'demo-user-001';

export async function POST() {
  try {
    // Create demo user if not exists
    let user = await db.user.findUnique({
      where: { id: DEMO_USER_ID },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          id: DEMO_USER_ID,
          email: 'demo@gametwist.com',
          name: 'Demo Player',
          username: 'demoplayer',
          password: 'demo123',
          twists: 10000,
          level: 1,
          xp: 0,
          vipStatus: 'Bronze',
          vipPoints: 0,
        },
      });
    }

    // Check if games already exist
    const existingGamesCount = await db.game.count();
    
    if (existingGamesCount === 0) {
      // Seed games
      await db.game.createMany({
        data: gamesData.map((game) => ({
          ...game,
          thumbnail: game.thumbnail || `/games/${game.slug}.jpg`,
          bannerImage: game.bannerImage || `/games/${game.slug}-banner.jpg`,
        })),
      });
    }

    // Create some sample promotions if none exist
    const existingPromosCount = await db.promotion.count();
    
    if (existingPromosCount === 0) {
      await db.promotion.createMany({
        data: [
          {
            title: 'Welcome Bonus',
            description: 'Get 5,000 Twists FREE when you join!',
            bonusType: 'welcome',
            bonusAmount: 5000,
            isActive: true,
          },
          {
            title: 'Daily Login Bonus',
            description: 'Log in every day for free Twists!',
            bonusType: 'daily',
            bonusAmount: 1000,
            isActive: true,
          },
          {
            title: 'VIP Rewards',
            description: 'Exclusive bonuses for VIP members',
            bonusType: 'vip',
            bonusAmount: 2500,
            isActive: true,
          },
          {
            title: 'Weekend Special',
            description: 'Double XP on all games during weekends!',
            bonusType: 'weekly',
            bonusAmount: 0,
            isActive: true,
          },
        ],
      });
    }

    // Create banners if none exist
    const existingBannersCount = await db.banner.count();
    
    if (existingBannersCount === 0) {
      await db.banner.createMany({
        data: [
          {
            title: '🎰 Welcome to GameTwist!',
            subtitle: 'Get 10,000 FREE Twists to start playing',
            image: '/banners/welcome.jpg',
            link: '/play',
            buttonText: 'Play Now',
            order: 0,
          },
          {
            title: '🎲 New Games Added!',
            subtitle: 'Try our latest slots and casino games',
            image: '/banners/new-games.jpg',
            link: '/slots',
            buttonText: 'Explore',
            order: 1,
          },
          {
            title: '💎 VIP Program',
            subtitle: 'Join our exclusive VIP club for premium rewards',
            image: '/banners/vip.jpg',
            link: '/vip',
            buttonText: 'Learn More',
            order: 2,
          },
        ],
      });
    }

    const games = await db.game.findMany({
      take: 10,
      orderBy: { name: 'asc' },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      gamesCount: await db.game.count(),
      message: 'Database initialized successfully',
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    return NextResponse.json(
      { error: 'Failed to initialize database' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await db.user.findUnique({
      where: { id: DEMO_USER_ID },
    });

    const gamesCount = await db.game.count();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user || {};

    return NextResponse.json({
      initialized: !!user && gamesCount > 0,
      user: userWithoutPassword,
      gamesCount,
    });
  } catch (error) {
    console.error('Error checking initialization:', error);
    return NextResponse.json(
      { error: 'Failed to check initialization' },
      { status: 500 }
    );
  }
}
