import clientPromise from "@/utils/db";
import { NextResponse } from "next/server";

// GET: Fetch all blogs
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const blogs = await db.collection("blogs").find().toArray();
    
    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

// POST: Create a new blog
export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db();

    const { title, content, authorId } = await req.json();
    
    const newBlog = {
      title,
      content,
      authorId,
      createdAt: new Date(),
    };

    const result = await db.collection("blogs").insertOne(newBlog);
    
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
  }
}
