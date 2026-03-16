import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const filter = searchParams.get('filter');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: Record<string, unknown> = {};

    if (category && category !== 'all') {
      where.category = category;
    }

    if (filter === 'new') {
      where.isNew = true;
    } else if (filter === 'popular') {
      where.isPopular = true;
    } else if (filter === 'featured') {
      where.isFeatured = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const games = await db.game.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: [{ isFeatured: 'desc' }, { isPopular: 'desc' }, { name: 'asc' }],
    });

    const total = await db.game.count({ where });

    return NextResponse.json({
      games,
      total,
      hasMore: offset + games.length < total,
    });
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}
