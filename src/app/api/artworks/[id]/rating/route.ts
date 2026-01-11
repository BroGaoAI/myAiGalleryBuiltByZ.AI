import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: artworkId } = await params;
    const body = await request.json();
    const { score, userId } = body;

    if (!score || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (score < 1 || score > 5) {
      return NextResponse.json(
        { error: 'Score must be between 1 and 5' },
        { status: 400 }
      );
    }

    // 使用 upsert 创建或更新评分
    const rating = await db.rating.upsert({
      where: {
        artworkId_userId: {
          artworkId,
          userId,
        },
      },
      update: {
        score,
      },
      create: {
        score,
        artworkId,
        userId,
      },
    });

    return NextResponse.json(rating);
  } catch (error) {
    console.error('Failed to rate artwork:', error);
    return NextResponse.json(
      { error: 'Failed to rate artwork' },
      { status: 500 }
    );
  }
}
