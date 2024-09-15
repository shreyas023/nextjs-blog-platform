import clientPromise from "@/utils/db";
import Link from "next/link";

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
            <div key={blog._id} className="border rounded-lg overflow-hidden shadow-lg">
              <img src={blog.featuredImage} alt={blog.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{blog.title}</h2>
                <p className="text-gray-600 mt-2">{blog.content.substring(0, 100)}...</p>
                <Link href={`/blog/${blog._id}`} className="text-blue-500 hover:text-blue-700 mt-4 block">Read More</Link>
              </div>
            </div>
          ))}
        </div>
      </main>
      
    </div>
  );
}
