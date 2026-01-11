import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const outputDir = path.join(process.cwd(), 'public', 'generated-images');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function buildEffectivePrompt(subject: string, style: string): string {
  const components = [
    subject,
    style,
    'high quality',
    'detailed'
  ];
  return components.filter(Boolean).join(', ');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, category, style, width = 1024, height = 1024, userId } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const effectivePrompt = buildEffectivePrompt(prompt, style);
    const size = `${width}x${height}`;
    const supportedSizes = [
      '1024x1024',
      '768x1344',
      '864x1152',
      '1344x768',
      '1152x864',
      '1440x720',
      '720x1440'
    ];

    if (!supportedSizes.includes(size)) {
      return NextResponse.json(
        { error: `Unsupported size: ${size}. Supported sizes: ${supportedSizes.join(', ')}` },
        { status: 400 }
      );
    }

    console.log('🎨 开始生成图像...');
    console.log('📝 提示词:', effectivePrompt);
    console.log('📐 尺寸:', size);
    console.log('🎭 风格:', style);
    console.log('📂 类别:', category);

    const zai = await ZAI.create();
    console.log('🤖 ZAI SDK已初始化');
    console.log('📡 调用图像生成API: zai.images.generations.create()');

    const response = await zai.images.generations.create({
      prompt: effectivePrompt,
      size: size as any
    });

    console.log('✅ API响应已收到');
    console.log('📊 响应数据:', JSON.stringify(response, null, 2));

    if (!response.data || !response.data[0] || !response.data[0].base64) {
      throw new Error('Invalid response from image generation API');
    }

    const imageBase64 = response.data[0].base64;
    const buffer = Buffer.from(imageBase64, 'base64');

    const filename = `art_${Date.now()}_${Math.random().toString(36).substring(7)}.png`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, buffer);

    const imageUrl = `/generated-images/${filename}`;

    console.log('💾 图像已保存:', filepath);
    console.log('🔗 图像URL:', imageUrl);

    let artwork;
    if (userId) {
      artwork = await db.artwork.create({
        data: {
          title: `${category} - ${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}`,
          description: `AI生成的${category}艺术作品`,
          imageUrl,
          prompt,
          category,
          style,
          width,
          height,
          authorId: userId,
          isPublic: true,
        },
      });
      console.log('💾 作品已保存到数据库，ID:', artwork.id);
    } else {
      artwork = {
        imageUrl,
        prompt,
        category,
        style
      };
      console.log('⚠️  未提供userId，仅返回图像信息');
    }

    return NextResponse.json({
      success: true,
      data: artwork,
      model: {
        provider: 'z-ai-web-dev-sdk',
        api: 'zai.images.generations.create()',
        prompt: effectivePrompt,
        size: size,
        features: ['AI图像生成', '多尺寸支持', 'Base64编码']
      }
    });
  } catch (error: any) {
    console.error('❌ 图像生成失败:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate image' },
      { status: 500 }
    );
  }
}
