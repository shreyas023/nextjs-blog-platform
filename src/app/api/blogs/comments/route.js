// /api/blogs/comments/route.js
import clientPromise from "@/utils/db";
import { verifyToken } from "@/utils/auth";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// Mark as dynamic route
export const dynamic = 'force-dynamic';

// GET comments for a blog
export async function GET(req) {
  try {
    // Get the blog ID from URL parameters
    const { searchParams } = new URL(req.url);
    const blogId = searchParams.get('id');

    if (!blogId) {
      return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("InspiraAI");

    // Find the blog and project only the comments field
    const blog = await db.collection("blogs").findOne(
      { _id: new ObjectId(blogId) },
      { projection: { comments: 1 } }
    );

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Return the comments array (or empty array if no comments)
    return NextResponse.json({ 
      comments: blog.comments || [] 
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

// POST a new comment
export async function POST(req) {
  try {
    // Verify authentication
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Get request body
    const { blogId, commentText } = await req.json();
    const userId = decoded.userId;

    if (!blogId || !commentText) {
      return NextResponse.json({ error: "Blog ID and comment text are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("InspiraAI");

    // Check if blog exists
    const blog = await db.collection("blogs").findOne({ _id: new ObjectId(blogId) });
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Create comment object
    const comment = {
      commentText,
      userId: new ObjectId(userId),
      commentedAt: new Date()
    };

    // Update blog with new comment
    await db.collection("blogs").updateOne(
      { _id: new ObjectId(blogId) },
      { 
        $push: { 
          comments: comment
        }
      }
    );

    // Update user's comments
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      {
        $push: {
          comments: {
            commentText,
            blogId: new ObjectId(blogId),
            commentedAt: comment.commentedAt
          }
        }
      }
    );

    return NextResponse.json({ 
      message: "Comment added successfully",
      newComment: comment 
    }, { status: 201 });
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}