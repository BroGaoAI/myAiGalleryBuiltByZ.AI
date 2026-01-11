import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import fs from "fs";
import path from "path";

const outputDir = path.join(process.cwd(), "public", "generated-images");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const VOLCENGINE_CONFIG = {
  apiUrl: process.env.VOLCENGINE_API_URL || "https://ark.cn-beijing.volces.com/api/v3/images/generations",
  apiKey: process.env.VOLCENGINE_API_KEY || "",
  model: process.env.VOLCENGINE_MODEL || "doubao-seedream-4.0-250828",
  defaultOptions: {
    response_format: "url",
    size: "2K",
    stream: false,
    watermark: true
  }
};

interface VolcEngineImageRequest {
  model: string;
  prompt: string;
  sequential_image_generation?: string;
  response_format?: string;
  size?: string;
  stream?: boolean;
  watermark?: boolean;
}

interface VolcEngineImageResponse {
  created: number;
  data: {
    url: string;
    b64_json?: string;
  }[];
  id: string;
  request_id: string;
}

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1543867747-5ec0c093af39?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-15187092688052-0a4bea4559f3?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1614850522450-3a649a72388d?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1618508423699-3a649a72388d?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1549490349-86433622d07a?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1614851099511-77908e114261?w=800&auto=format&fit=crop&q=60"
];

function getRandomPlaceholderImage(): string {
  const randomIndex = Math.floor(Math.random() * PLACEHOLDER_IMAGES.length);
  return PLACEHOLDER_IMAGES[randomIndex];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, category, style, width = 1024, height = 1024, userId } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const enhancedPrompt = buildEnhancedPrompt(prompt, style, category);
    const size = "2K";

    const volcRequest: VolcEngineImageRequest = {
      model: VOLCENGINE_CONFIG.model,
      prompt: enhancedPrompt,
      ...VOLCENGINE_CONFIG.defaultOptions,
      size: size,
      sequential_image_generation: "disabled"
    };

    let imageUrl: string;
    let usePlaceholder = false;

    try {
      const response = await fetch(VOLCENGINE_CONFIG.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + VOLCENGINE_CONFIG.apiKey
        },
        body: JSON.stringify(volcRequest)
      });

      if (!response.ok) {
        usePlaceholder = true;
        imageUrl = getRandomPlaceholderImage();
      } else {
        const data: VolcEngineImageResponse = await response.json();

        if (!data.data || data.data.length === 0) {
          usePlaceholder = true;
          imageUrl = getRandomPlaceholderImage();
        } else {
          imageUrl = data.data[0].url;
          const imageResponse = await fetch(imageUrl);
          if (!imageResponse.ok) {
            throw new Error("Failed to download image");
          }

          const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
          const filename = "doubao_" + Date.now() + "_" + Math.random().toString(36).substring(7) + ".png";
          const filepath = path.join(outputDir, filename);
          fs.writeFileSync(filepath, imageBuffer);
          imageUrl = "/generated-images/" + filename;
        }
      }
    } catch (apiError) {
      usePlaceholder = true;
      imageUrl = getRandomPlaceholderImage();
    }

    const artworkPrompt = usePlaceholder
      ? enhancedPrompt + " [placeholder - API unavailable]"
      : enhancedPrompt;

    let artwork;
    if (userId) {
      artwork = await db.artwork.create({
        data: {
          title: category + " - " + (prompt.length > 50 ? prompt.substring(0, 50) + "..." : prompt),
          description: usePlaceholder
            ? "AI generated art using placeholder images (VolcEngine API unavailable)"
            : "AI generated art using VolcEngine doubao-seedream-4.0",
          imageUrl: imageUrl,
          prompt: artworkPrompt,
          category: category,
          style: style,
          width: width,
          height: height,
          authorId: userId,
          isPublic: true,
        },
      });
    } else {
      artwork = {
        imageUrl: imageUrl,
        prompt: artworkPrompt,
        category: category,
        style: style
      };
    }

    return NextResponse.json({
      success: true,
      data: artwork,
      model: {
        provider: usePlaceholder ? "Placeholder Service" : "VolcEngine",
        service: usePlaceholder ? "Unsplash" : "doubao (dream)",
        version: "4.0",
        modelName: usePlaceholder ? "Random Selection" : VOLCENGINE_CONFIG.model,
        apiEndpoint: VOLCENGINE_CONFIG.apiUrl,
        prompt: artworkPrompt,
        size: size,
        isPlaceholder: usePlaceholder,
        note: usePlaceholder ? "VolcEngine API unavailable, using placeholder images" : "API call successful"
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "Failed to generate image",
        details: error.stack
      },
      { status: 500 }
    );
  }
}

function buildEnhancedPrompt(prompt: string, style: string, category: string): string {
  const styleEnhancements: Record<string, string> = {
    "realistic": "photorealistic, high fidelity, professional photography style, 4K resolution",
    "artistic": "artistic rendering, painterly, digital art style, masterpiece quality",
    "abstract": "abstract expression, geometric forms, modern art style, conceptual",
    "minimalist": "minimalist design, clean lines, simple composition, elegant",
    "detailed": "highly detailed, intricate details, rich textures, fine art quality"
  };

  const categoryEnhancements: Record<string, string> = {
    "abstract": "abstract art, conceptual, artistic interpretation, contemporary",
    "portrait": "portrait photography, character focus, facial details, studio lighting",
    "landscape": "landscape scene, environment, atmospheric depth, nature photography",
    "fantasy": "fantasy art, magical elements, ethereal atmosphere, mystical",
    "sci-fi": "science fiction, futuristic, high-tech elements, cyberpunk aesthetic",
    "anime": "anime style, vibrant colors, clean lines, manga quality, Japanese animation",
    "photography": "photorealistic, natural lighting, realistic textures, professional photography"
  };

  const components = [
    prompt,
    styleEnhancements[style] || "high quality",
    categoryEnhancements[category] || "professional rendering",
    "masterpiece quality",
    "ultra detailed",
    "cinematic lighting"
  ];

  return components.filter(Boolean).join(", ");
}
