import { NextResponse } from 'next/server';
import { HfInference } from "@huggingface/inference";

// Initialize Hugging Face inference client
const hf = new HfInference(process.env.HF_SECRET);

export async function POST(req) {
    try {
        // Parse the request body
        const body = await req.json();
        const { prompt } = body;

        if (!prompt) {
            return NextResponse.json(
                { error: "Prompt is required" },
                { status: 400 }
            );
        }

        // Call the Hugging Face text-to-image generation API
        // Using stabilityai/stable-diffusion-2-1 for high-quality image generation
        const response = await hf.textToImage({
            model: "stabilityai/stable-diffusion-2-1",
            inputs: prompt,
            parameters: {
                negative_prompt: "blurry, bad quality, distorted, disfigured",
                num_inference_steps: 30,
                guidance_scale: 7.5,
                width: 768,
                height: 512,
            },
        });

        // Convert the binary image data to base64
        const imageBuffer = await response.arrayBuffer();
        const base64Image = Buffer.from(imageBuffer).toString('base64');
        const imageUrl = `data:image/jpeg;base64,${base64Image}`;

        // Generate a caption for the image using the original prompt
        let caption = prompt;
        try {
            // Optionally generate a refined caption using a language model
            const captionResponse = await hf.textGeneration({
                model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
                inputs: `Generate a concise, descriptive caption for an image based on this prompt: "${prompt}". Make it suitable for SEO and accessibility. Keep it under 100 characters.`,
                parameters: {
                    max_new_tokens: 100,
                    temperature: 0.7,
                    top_p: 0.95,
                    return_full_text: false,
                },
            });
            caption = captionResponse.generated_text.trim();
        } catch (captionError) {
            console.error("Error generating caption:", captionError);
            // Fall back to using the original prompt as caption
        }

        return NextResponse.json({
            imageUrl,
            caption,
            prompt
        });

    } catch (error) {
        console.error("Error generating image:", error);

        return NextResponse.json(
            {
                error: "Failed to generate image",
                details: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}

export const runtime = 'edge';