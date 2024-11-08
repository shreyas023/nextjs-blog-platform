'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaCopy } from "react-icons/fa6";
import { FaDownload } from "react-icons/fa";
import { FaMagic } from "react-icons/fa";
import Image from 'next/image';

export default function ImageGeneratorPage() {
    const router = useRouter();
    const [prompt, setPrompt] = useState('');
    const [generatedImage, setGeneratedImage] = useState('');
    const [imageCaption, setImageCaption] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Sample prompts for inspiration
    const samplePrompts = [
        "A serene mountain landscape at sunset with snow-capped peaks, ultra realistic, 4k",
        "Minimalist tech workspace with a laptop and coffee cup, soft morning light, professional photography",
        "Abstract digital art representing artificial intelligence, vibrant colors, highly detailed",
        "Vintage style illustration of a bustling city street, watercolor technique"
    ];

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push('/login');
            return;
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) {
            setError('Please enter a description for the image');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: prompt }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate image');
            }

            const data = await response.json();
            // The API now returns base64 image data
            setGeneratedImage(data.imageUrl); // This is already in base64 format
            setImageCaption(data.caption);
        } catch (err) {
            setError('Error generating image. Please try again.');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const downloadImage = () => {
        try {
            // Create a link element
            const link = document.createElement('a');
            
            // Use the base64 image data directly
            link.href = generatedImage;
            link.download = `generated-image-${Date.now()}.png`;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            setError('Error downloading image. Please try again.');
            console.error('Error:', err);
        }
    };

    const copyPrompt = () => {
        navigator.clipboard.writeText(prompt);
        alert('Prompt copied to clipboard!');
    };

    const useSamplePrompt = (samplePrompt) => {
        setPrompt(samplePrompt);
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">AI Image Generator</h1>
            <p className="mb-6">
                Create stunning blog hero images by describing what you want. 
                Our AI will generate a unique image based on your description using 
                Stable Diffusion technology.
            </p>

            {/* Sample Prompts Section */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Try these prompts:</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {samplePrompts.map((samplePrompt, index) => (
                        <button
                            key={index}
                            onClick={() => useSamplePrompt(samplePrompt)}
                            className="text-left p-2 text-sm border rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                            <FaMagic className="text-blue-500" />
                            {samplePrompt.length > 60 ? samplePrompt.substring(0, 60) + '...' : samplePrompt}
                        </button>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="mb-8">
                <div className="mb-4">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="w-full p-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="Describe the image you want to generate... Be specific about style, mood, and details."
                        rows={4}
                    />
                </div>

                <button 
                    type="submit" 
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors w-full sm:w-auto disabled:bg-blue-300"
                    disabled={loading || !prompt.trim()}
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                        </span>
                    ) : 'Generate Image'}
                </button>
            </form>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {generatedImage && (
                <div className="space-y-6">
                    <div className="border rounded-lg p-4 bg-gray-50">
                        <h2 className="text-2xl font-bold mb-4">Generated Image:</h2>
                        <div className="relative w-full h-[400px] mb-4">
                            <Image 
                                src={generatedImage}
                                alt={imageCaption}
                                fill
                                className="object-contain rounded-lg"
                                priority
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button 
                                onClick={downloadImage}
                                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                            >
                                <FaDownload /> Download Image
                            </button>
                            <button 
                                onClick={copyPrompt}
                                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                <FaCopy /> Copy Prompt
                            </button>
                        </div>
                    </div>

                    {imageCaption && (
                        <div className="border rounded-lg p-4 bg-gray-50">
                            <h2 className="text-2xl font-bold mb-2">Image Caption:</h2>
                            <p className="text-gray-700">{imageCaption}</p>
                        </div>
                    )}
                </div>
            )}

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Tips for Better Results:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Be specific about the subject, style, and mood you want</li>
                    <li>Add technical terms like "4K", "HDR", "ultra-detailed" for higher quality</li>
                    <li>Specify artistic styles: "watercolor", "oil painting", "digital art"</li>
                    <li>Include lighting details: "soft morning light", "dramatic sunset"</li>
                    <li>Add camera details: "wide angle", "close-up", "aerial view"</li>
                </ul>
            </div>
        </div>
    );
}