// pages/api/blogs/[id]/route.js
import clientPromise from '@/utils/db';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const client = await clientPromise;
    const db = client.db("InspiraAI");

    const blog = await db.collection("blogs").findOne({ _id: new ObjectId(id) });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 });
  }
}
