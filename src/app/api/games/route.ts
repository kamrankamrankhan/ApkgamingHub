import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch all games
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const filter = searchParams.get('filter');
    const search = searchParams.get('search');
    const slug = searchParams.get('slug');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // If slug is provided, get single game
    if (slug) {
      const game = await db.game.findUnique({
        where: { slug },
      });
      
      if (!game) {
        return NextResponse.json({ error: 'Game not found' }, { status: 404 });
      }
      
      return NextResponse.json({ game });
    }

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
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
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

// POST - Create a new game
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if slug already exists
    const existingGame = await db.game.findUnique({
      where: { slug: body.slug },
    });
    
    if (existingGame) {
      return NextResponse.json(
        { error: 'A game with this slug already exists' },
        { status: 400 }
      );
    }

    // Convert arrays to JSON strings
    const gameData = {
      ...body,
      features: body.features ? JSON.stringify(body.features) : null,
      tipsAndStrategies: body.tipsAndStrategies ? JSON.stringify(body.tipsAndStrategies) : null,
      faqs: body.faqs ? JSON.stringify(body.faqs) : null,
    };

    const game = await db.game.create({
      data: gameData,
    });

    return NextResponse.json({ game, success: true });
  } catch (error) {
    console.error('Error creating game:', error);
    return NextResponse.json(
      { error: 'Failed to create game' },
      { status: 500 }
    );
  }
}

// PUT - Update a game
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Game ID is required' },
        { status: 400 }
      );
    }

    // Check if game exists
    const existingGame = await db.game.findUnique({
      where: { id },
    });

    if (!existingGame) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    // Check if new slug conflicts with another game
    if (updateData.slug && updateData.slug !== existingGame.slug) {
      const slugConflict = await db.game.findUnique({
        where: { slug: updateData.slug },
      });
      if (slugConflict) {
        return NextResponse.json(
          { error: 'A game with this slug already exists' },
          { status: 400 }
        );
      }
    }

    // Convert arrays to JSON strings
    const gameData = {
      ...updateData,
      features: updateData.features ? JSON.stringify(updateData.features) : null,
      tipsAndStrategies: updateData.tipsAndStrategies ? JSON.stringify(updateData.tipsAndStrategies) : null,
      faqs: updateData.faqs ? JSON.stringify(updateData.faqs) : null,
    };

    const game = await db.game.update({
      where: { id },
      data: gameData,
    });

    return NextResponse.json({ game, success: true });
  } catch (error) {
    console.error('Error updating game:', error);
    return NextResponse.json(
      { error: 'Failed to update game' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a game
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Game ID is required' },
        { status: 400 }
      );
    }

    // Check if game exists
    const existingGame = await db.game.findUnique({
      where: { id },
    });

    if (!existingGame) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    await db.game.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting game:', error);
    return NextResponse.json(
      { error: 'Failed to delete game' },
      { status: 500 }
    );
  }
}
