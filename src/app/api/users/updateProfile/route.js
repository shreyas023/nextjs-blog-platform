import clientPromise from "@/utils/db"; // Importing the database connection
import bcrypt from "bcryptjs"; // Importing bcrypt for password hashing
import { NextResponse } from "next/server"; // For structured response handling
import { verifyToken } from "@/utils/auth"; // Import your JWT verification method
import { ObjectId } from "mongodb"; // For MongoDB ObjectId

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

    const userId = decoded.userId;

    const { username, newPassword } = await req.json();

    const client = await clientPromise;
    const db = client.db("InspiraAI");

    // Convert the userId to ObjectId for the query
    const objectIdUserId = new ObjectId(userId);

    // Check if user exists first
    const userExists = await db.collection("users").findOne({ _id: objectIdUserId });
    
    if (!userExists) {
      console.log("User not found with ID:", userId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updateData = {};
    if (username) updateData.username = username;
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateData.password = hashedPassword;
    }

    // Perform the update operation
    const result = await db.collection("users").updateOne(
      { _id: objectIdUserId },
      { $set: updateData }
    );

    // Check if the update was successful
    if (result.matchedCount === 0) {
      console.log("Update failed, user not found after update with ID:", userId);
      return NextResponse.json({ error: "User not found after update" }, { status: 404 });
    }

    if (result.modifiedCount === 0) {
      console.log("User found but no update was made for ID:", userId);
      return NextResponse.json({ message: "No changes were made to the profile" }, { status: 200 });
    }

    // Fetch the updated user document after the update
    const updatedUser = await db.collection("users").findOne(
      { _id: objectIdUserId },
      { projection: { password: 0 } } // Exclude password
    );

    return NextResponse.json({
      message: "Profile updated successfully",
      username: updatedUser.username,
      email: updatedUser.email,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Error updating profile" }, { status: 500 });
  }
}

