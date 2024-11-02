'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Modal from '@/components/Modal';
import Image from 'next/image';
import { FaHeart, FaComment } from "react-icons/fa6";

export default function BlogPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);

  // Memoize fetchBlogData with useCallback
  const fetchBlogData = useCallback(async () => {
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Error fetching blog: ${res.statusText}`);
      }

      const data = await res.json();
      setBlog(data);
      setIsLiked(data.likes.includes(localStorage.getItem("userId")));
      setLikeCount(data.likes.length);
    } catch (error) {
      console.error("Error fetching blog:", error);
    }
  }, [id]);

  // Memoize fetchComments with useCallback
  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/blogs/comments?id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setComments(data.comments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }, [id]);

  // Combined useEffect for fetching data
  useEffect(() => {
    if (id) {
      fetchBlogData();
      fetchComments();
    }
  }, [id, fetchBlogData, fetchComments]);

  const handleCommentSubmit = async () => {
    try {
      const res = await fetch(`/api/blogs/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ blogId: id, commentText: newComment }),
      });

      if (res.ok) {
        const data = await res.json();
        setComments(prevComments => [...prevComments, data.newComment]);
        setNewComment('');
      } else {
        console.error("Failed to submit comment");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleLikeToggle = async () => {
    try {
      const res = await fetch('/api/blogs/likes', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ blogId: id }),
      });

      if (!res.ok) {
        throw new Error(`Error liking blog: ${res.statusText}`);
      }

      const result = await res.json();
      setLikeCount(prevCount => isLiked ? prevCount - 1 : prevCount + 1);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  if (!blog) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 mt-10">
      {blog.featuredImage && (
        <Image 
          src={blog.featuredImage} 
          width={800}
          height={400}
          alt={blog.title} 
          className="w-full h-64 object-cover rounded-md mb-6 shadow-lg"
        />
      )}
      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
      <div className="text-lg text-gray-700 mb-8 leading-relaxed">
        {blog.content}
      </div>
      <div className="text-gray-500 mb-6">
        <p>Published on: {new Date(blog.createdAt).toLocaleDateString()}</p>
        {blog.updatedAt && (
          <p>Last updated: {new Date(blog.updatedAt).toLocaleDateString()}</p>
        )}
      </div>

      <div className="flex items-center gap-8 text-gray-600 mb-10">
        <button 
          className={`flex gap-2 items-center ${isLiked ? 'text-red-500' : 'text-gray-600'}`}
          onClick={handleLikeToggle}
        >
          {likeCount} <FaHeart />
        </button>
        <button
          className="flex gap-2 items-center focus:outline-none"
          onClick={() => setIsModalOpen(true)}
        >
          {comments.length} <FaComment />
        </button>
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h2 className="text-2xl font-bold mb-4">Comments</h2>
          <div className="mb-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Write a comment..."
              rows="3"
            />
            <button
              onClick={handleCommentSubmit}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Submit Comment
            </button>
          </div>
          {comments.length > 0 ? (
            <ul className="space-y-4">
              {comments.map((comment, index) => (
                <li key={index} className="p-4 border border-gray-200 rounded-md">
                  {comment.commentText} 
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