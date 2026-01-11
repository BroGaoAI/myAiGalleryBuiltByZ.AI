import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const artworks = await db.artwork.findMany({
      where: {
        isPublic: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
            ratings: true,
          },
        },
        ratings: {
          select: {
            score: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const artworksWithStats = artworks.map(artwork => {
      const avgRating = artwork.ratings.length > 0
        ? artwork.ratings.reduce((sum, r) => sum + r.score, 0) / artwork.ratings.length
        : 0;

      return {
        id: artwork.id,
        title: artwork.title,
        description: artwork.description,
        imageUrl: artwork.imageUrl,
        prompt: artwork.prompt,
        category: artwork.category,
        style: artwork.style,
        author: artwork.author,
        avgRating,
        commentCount: artwork._count.comments,
        likeCount: 0,
        createdAt: artwork.createdAt,
      };
    });

    return NextResponse.json(artworksWithStats);
  } catch (error) {
    console.error('Failed to fetch artworks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artworks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, imageUrl, prompt, category, style, authorId } = body;

    if (!title || !imageUrl || !category || !authorId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const artwork = await db.artwork.create({
      data: {
        title,
        description,
        imageUrl,
        prompt,
        category,
        style,
        authorId,
        isPublic: true,
      },
    });

    return NextResponse.json(artwork, { status: 201 });
  } catch (error) {
    console.error('Failed to create artwork:', error);
    return NextResponse.json(
      { error: 'Failed to create artwork' },
      { status: 500 }
    );
  }
}
