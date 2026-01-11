import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: artworkId } = await params;

    // TODO: 实现真正的点赞功能，使用关联表
    const artwork = await db.artwork.update({
      where: { id: artworkId },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({ success: true, views: artwork.views });
  } catch (error) {
    console.error('Failed to like artwork:', error);
    return NextResponse.json(
      { error: 'Failed to like artwork' },
      { status: 500 }
    );
  }
}
