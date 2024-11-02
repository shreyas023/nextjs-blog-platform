// pages/blog/[id].js
'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // Import useParams
import Modal from '@/components/Modal';
import Image from 'next/image';

export default function BlogPage() {
  const { id } = useParams(); // Capture the blog id from the URL
  const [blog, setBlog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch the blog details based on the id
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Error fetching blog: ${res.statusText}`);
        }

        const data = await res.json();
        setBlog(data);
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  if (!blog) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 mt-10">
      {/* Featured Image */}
      {blog.featuredImage && (
        <Image 
          src={blog.featuredImage} 
          alt={blog.title} 
          className="w-full h-64 object-cover rounded-md mb-6 shadow-lg"
        />
      )}

      {/* Blog Title */}
      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>

      {/* Blog Content */}
      <div className="text-lg text-gray-700 mb-8 leading-relaxed">
        {blog.content}
      </div>

      {/* Date Info */}
      <div className="text-gray-500 mb-6">
        <p>Published on: {new Date(blog.createdAt).toLocaleDateString()}</p>
        {blog.updatedAt && (
          <p>Last updated: {new Date(blog.updatedAt).toLocaleDateString()}</p>
        )}
      </div>

      {/* Likes and Comments */}
      <div className="flex items-center gap-8 text-gray-600 mb-10">
        <div className="flex items-center">
          <span>{blog.likes.length} Likes</span>
        </div>
        <button
          className="flex items-center focus:outline-none"
          onClick={() => setIsModalOpen(true)}
        >
          <span>{blog.comments.length} Comments</span>
        </button>
      </div>

      {/* Comments Modal */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h2 className="text-2xl font-bold mb-4">Comments</h2>
          {blog.comments.length > 0 ? (
            <ul className="space-y-4">
              {blog.comments.map((comment, index) => (
                <li key={index} className="p-4 border border-gray-200 rounded-md">
                  {comment}
                </li>
              ))}
            </ul>
          ) : (
            <p>No comments yet.</p>
          )}
        </Modal>
      )}
    </div>
  );
}
