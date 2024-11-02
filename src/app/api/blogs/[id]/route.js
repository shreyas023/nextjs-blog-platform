import clientPromise from "@/utils/db";
import { verifyToken } from "@/utils/auth";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const client = await clientPromise;
    const db = client.db("InspiraAI");

    const blog = await db.collection("blogs").findOne({ _id: new ObjectId(id) });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Extract token from the headers
    const token = req.headers.get("authorization")?.split(" ")[1];
    let isLikedByUser = false;

    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        const userId = decoded.userId;

        // Check if the current user has liked this blog
        isLikedByUser = blog.likes.includes(userId);
      }
    }

    // Include `isLikedByUser` in the response
    return NextResponse.json({ ...blog, isLikedByUser }, { status: 200 });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
  }
}
