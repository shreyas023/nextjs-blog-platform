import clientPromise from "@/utils/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db();

    const { username, email, password } = await req.json();
    
    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      username,
      email,
      password: hashedPassword,
      createdBlogs: [],
      likedBlogs: [],
      comments: [],
      genAIUsage: { articleGenerationTrials: 2, imageGenerationTrials: 2, seoSuggestionTrials: 2 },
      createdAt: new Date(),
      lastLogin: new Date(),
    };

    const result = await db.collection("users").insertOne(newUser);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
