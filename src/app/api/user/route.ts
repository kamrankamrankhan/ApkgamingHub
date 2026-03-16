import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const DEMO_USER_ID = 'demo-user-001';

export async function GET() {
  try {
    let user = await db.user.findUnique({
      where: { id: DEMO_USER_ID },
    });

    if (!user) {
      // Create demo user if doesn't exist
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { twists, xp, vipPoints, level, vipStatus } = body;

    const updateData: Record<string, unknown> = {};
    if (typeof twists === 'number') updateData.twists = twists;
    if (typeof xp === 'number') updateData.xp = xp;
    if (typeof vipPoints === 'number') updateData.vipPoints = vipPoints;
    if (typeof level === 'number') updateData.level = level;
    if (vipStatus) updateData.vipStatus = vipStatus;

    const user = await db.user.update({
      where: { id: DEMO_USER_ID },
      data: updateData,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
