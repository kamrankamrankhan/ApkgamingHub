import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const DEMO_USER_ID = 'demo-user-001';

export async function GET() {
  try {
    const favorites = await db.favorite.findMany({
      where: { userId: DEMO_USER_ID },
      include: {
        game: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      favorites: favorites.map((f) => f.game),
      favoriteIds: favorites.map((f) => f.gameId),
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gameId, action } = body;

    if (!gameId) {
      return NextResponse.json(
        { error: 'Game ID is required' },
        { status: 400 }
      );
    }

    if (action === 'add') {
      // Check if already favorited
      const existing = await db.favorite.findUnique({
        where: {
          userId_gameId: {
            userId: DEMO_USER_ID,
            gameId,
          },
        },
      });

      if (existing) {
        return NextResponse.json({ message: 'Already favorited' });
      }

      await db.favorite.create({
        data: {
          userId: DEMO_USER_ID,
          gameId,
        },
      });

      return NextResponse.json({ success: true, action: 'added' });
    } else if (action === 'remove') {
      await db.favorite.deleteMany({
        where: {
          userId: DEMO_USER_ID,
          gameId,
        },
      });

      return NextResponse.json({ success: true, action: 'removed' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error updating favorite:', error);
    return NextResponse.json(
      { error: 'Failed to update favorite' },
      { status: 500 }
    );
  }
}
