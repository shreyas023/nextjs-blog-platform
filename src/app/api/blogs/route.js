import clientPromise from "@/utils/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// GET: Fetch all blogs
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("InspiraAI");
    
    const blogs = await db.collection("blogs").find().toArray();
    
    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

// POST: Create a new blog
export async function POST(req) {
  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("InspiraAI");

    // Parse the incoming request data
    const { title, content, authorId, featuredImage, seoKeywords } = await req.json();
    
    // Validate required fields
    if (!title || !content || !seoKeywords) {
      return NextResponse.json(
        { error: "Missing required fields: title, content, featuredImage, or seoKeywords" }, 
        { status: 400 }
      );
    }

    // Create the new blog document
    const newBlog = {
      authorId,
      title,
      content,
      featuredImage : featuredImage || "",
      seoKeywords: seoKeywords.split(",").map(keyword => keyword.trim()), // Convert keywords to array
      likes: [], // Initialize empty likes array
      comments: [], // Initialize empty comments array
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert the new blog into the "blogs" collection
    const result = await db.collection("blogs").insertOne(newBlog);

    // Return a success response
    return NextResponse.json(
      { message: "Blog created successfully", blogId: result.insertedId }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating blog:", error);

    // Return an error response
    return NextResponse.json(
      { error: "Failed to create blog" }, 
      { status: 500 }
    );
  }
}
