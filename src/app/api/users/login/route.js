import clientPromise from "@/utils/db";
import bcrypt from "bcryptjs";
import { signToken } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("InspiraAI");

    const { email, password } = await req.json();

    // Check if the user exists
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Generate a JWT token
    const token = signToken({ userId: user._id, username: user.username, email: user.email });

    // Update the last login time
    await db.collection("users").updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    );

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
