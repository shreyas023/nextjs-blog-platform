import { NextResponse } from 'next/server';
import { HfInference } from "@huggingface/inference";

// Initialize Hugging Face inference client
const hf = new HfInference(process.env.HF_SECRET);

export async function POST(req) {
    try {
        // Parse the request body
        const body = await req.json();
        const { topic } = body;

        if (!topic) {
            return NextResponse.json(
                { error: "Topic is required" },
                { status: 400 }
            );
        }

        // Improved prompt with clear structure and instructions
        const prompt = `write a blog on the topic "${topic}" with SEO keywords the response should be in the format "BLOG:" and ending with "SEO KEYWORDS:"`;

        // Call the Hugging Face text generation API
        const response = await hf.textGeneration({
            model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
            inputs: prompt,
            parameters: {
                max_new_tokens: 800,
                temperature: 0.7,
                top_p: 0.95,
                return_full_text: false,
                repetition_penalty: 1.2,
                do_sample: true,
                num_return_sequences: 1
            },
        });

        // Extract content with improved parsing
        const generatedText = response.generated_text;
        let blogContent = '';
        let keywords = '';

        // Split the content using regex to handle various possible formats
        const blogMatch = generatedText.match(/BLOG:?([\s\S]*?)(?=SEO KEYWORDS:|$)/i);
        const keywordsMatch = generatedText.match(/SEO KEYWORDS:?([^]*)$/i);

        if (blogMatch) {
            blogContent = blogMatch[1].trim();
        }

        if (keywordsMatch) {
            keywords = keywordsMatch[1].trim();
        }

        // If no keywords were found, try alternative parsing
        if (!keywords) {
            const lines = generatedText.split('\n');
            const keywordLineIndex = lines.findIndex(line =>
                line.toLowerCase().includes('keywords:') ||
                line.toLowerCase().includes('seo keywords:')
            );

            if (keywordLineIndex !== -1 && keywordLineIndex + 1 < lines.length) {
                keywords = lines[keywordLineIndex + 1].trim();
            }
        }

        // Clean up keywords if they're in an array format
        keywords = keywords
            .replace(/[\[\]'"`]/g, '') // Remove brackets and quotes
            .split(',')
            .map(k => k.trim())
            .filter(k => k) // Remove empty items
            .join(', ');

        return NextResponse.json({
            blog: blogContent || 'No content found',
            keywords: keywords || 'No keywords found',
        });

    } catch (error) {
        console.error("Error generating content:", error);

        return NextResponse.json(
            {
                error: "Failed to generate content",
                details: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}

export const runtime = 'edge';