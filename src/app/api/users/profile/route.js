import clientPromise from "@/utils/db";
import { verifyToken } from "@/utils/auth";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// Mark this route as dynamic
export const dynamic = 'force-dynamic';
// Specify the runtime
export const runtime = 'nodejs';

export async function GET(req) {
  try {
    // Get JWT token from the request header
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the token
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("InspiraAI");

    // Fetch user data
    const user = await db.collection("users").findOne(
      { _id: new ObjectId(decoded.userId) },
      {
        projection: {
          username: 1,
          email: 1,
          createdBlogs: 1,
          favouriteBlogs: 1,
          likedBlogs: 1
        }
      }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}