'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaCopy } from "react-icons/fa6";

export default function ContentGeneratorPage() {
    const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      router.push('/login');
      return;
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }

      const data = await response.json();
      console.log(data);
      setBlogContent(data.blog);
      setSeoKeywords(data.keywords);
    } catch (err) {
      setError('Error generating content. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">AI Content Generator</h1>
      <p className="mb-6">Generate high-quality blog content and SEO keywords by entering a topic below.</p>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-2"
          placeholder="Enter your topic here"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      {blogContent && (
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-2">Generated Blog:</h2>
          <div className="p-4 border rounded bg-gray-100">{blogContent}</div>
          <button onClick={() => copyToClipboard(blogContent)} className="flex items-center mt-2 text-blue-500">
            <FaCopy className="mr-1" /> Copy Blog
          </button>
        </div>
      )}
      {seoKeywords && (
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-2">SEO Keywords:</h2>
          <div className="p-4 border rounded bg-gray-100">{seoKeywords}</div>
          <button onClick={() => copyToClipboard(seoKeywords)} className="flex items-center mt-2 text-blue-500">
            <FaCopy className="mr-1" /> Copy Keywords
          </button>
        </div>
      )}
    </div>
  );
}
