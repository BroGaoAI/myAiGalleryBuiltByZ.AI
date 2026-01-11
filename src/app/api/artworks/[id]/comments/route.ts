import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const comments = await db.comment.findMany({
      where: {
        artworkId: id,
      },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: artworkId } = await params;
    const body = await request.json();
    const { content, userId } = body;

    if (!content || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const comment = await db.comment.create({
      data: {
        content,
        artworkId,
        userId,
      },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Failed to create comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
