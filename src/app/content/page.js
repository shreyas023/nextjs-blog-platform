'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ContentGeneratorPage() {
  const router = useRouter();
  
  const [formState, setFormState] = useState({
    prompt: '',
    blogContent: '',
    seoKeywords: '',
    loading: false,
    error: ''
  });

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to continue');
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formState.prompt.trim()) {
      alert('Please enter a topic to generate content');
      return;
    }

    setFormState(prev => ({ ...prev, loading: true, error: '' }));

    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ topic: formState.prompt }),
      });

      if (!response.ok) {
        throw new Error(
          response.status === 401 ? 'Session expired. Please login again.' :
          response.status === 429 ? 'Too many requests. Please try again later.' :
          'Failed to generate content'
        );
      }

      const data = await response.json();
      
      setFormState(prev => ({
        ...prev,
        blogContent: data.blog,
        seoKeywords: data.keywords,
      }));

      alert('Content generated successfully!');

    } catch (err) {
      setFormState(prev => ({
        ...prev,
        error: err.message
      }));

      if (err.message.includes('Session expired')) {
        router.push('/login');
      }
    } finally {
      setFormState(prev => ({ ...prev, loading: false }));
    }
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(`${type} copied to clipboard`);
    } catch (err) {
      alert('Failed to copy. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-2">
          AI Content Generator
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Generate high-quality blog content and SEO keywords by entering a topic below
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <textarea
              value={formState.prompt}
              onChange={(e) => setFormState(prev => ({ ...prev, prompt: e.target.value }))}
              placeholder="Enter your topic here (e.g., 'Benefits of meditation for productivity')"
              className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button 
              type="submit" 
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
              disabled={formState.loading}
            >
              {formState.loading ? 'Generating...' : 'Generate Content'}
            </button>
          </div>
        </form>

        {formState.error && (
          <div className="text-red-500 text-center mt-4">
            {formState.error}
          </div>
        )}

        {formState.blogContent && (
          <div className="mt-8 bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Generated Blog Content:</h2>
            <pre className="whitespace-pre-wrap">{formState.blogContent}</pre>
            <button
              onClick={() => copyToClipboard(formState.blogContent, 'Content')}
              className="mt-2 bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Copy Content
            </button>
          </div>
        )}

        {formState.seoKeywords && (
          <div className="mt-8 bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">SEO Keywords:</h2>
            <p>{formState.seoKeywords}</p>
            <button
              onClick={() => copyToClipboard(formState.seoKeywords, 'SEO Keywords')}
              className="mt-2 bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Copy Keywords
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
