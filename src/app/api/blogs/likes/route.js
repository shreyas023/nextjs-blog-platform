import clientPromise from "@/utils/db";
import { verifyToken } from "@/utils/auth";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { blogId } = await req.json();
    const userId = decoded.userId;

    const client = await clientPromise;
    const db = client.db("InspiraAI");

    // Check if the blog exists
    const blog = await db.collection("blogs").findOne(
        { _id: new ObjectId(blogId) },
        { projection: { _id: 1, title: 1, content: 1 } }
      );
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Toggle the like
let action = "liked";
if ((blog.likes || []).includes(userId)) { // Check if likes array includes userId
  // Remove the user's ID from the blog's likes array
  await db.collection("blogs").updateOne(
    { _id: new ObjectId(blogId) },
    { $pull: { likes: userId } }
  );

  // Remove the blog's ID from likedBlogs and the blog document from favouriteBlogs
  await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    { 
      $pull: { 
        likedBlogs: blogId,
        favouriteBlogs: { _id: blog._id } // Matches based on the blog _id
      }
    }
  );

  action = "unliked";
} else {
  // Ensure likes array exists and add the user's ID to it
  await db.collection("blogs").updateOne(
    { _id: new ObjectId(blogId) },
    { $push: { likes: userId } }
  );

  // Add the blog's ID to likedBlogs and the blog document to favouriteBlogs
  await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    { 
      $push: { 
        likedBlogs: blogId,
        favouriteBlogs: blog // Insert full blog document here
      }
    }
  );
}


    return NextResponse.json({ 
      message: `Blog successfully ${action}`,
      action: action
    }, { status: 200 });
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
  }
}