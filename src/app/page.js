import clientPromise from "@/utils/db";
import Link from "next/link";
import BlogCard from "@/components/BlogCard";

export default async function Home() {
  // Fetch blogs from the MongoDB collection
  const client = await clientPromise;
  const db = client.db("InspiraAI"); // Your database name
  const blogs = await db.collection("blogs").find().toArray(); // Fetch all blogs

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Blog Section */}
      <main className="container mx-auto flex-grow p-4">
        <h1 className="text-3xl font-bold mb-8">Latest Blogs</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      </main>
    </div>
  );
}
