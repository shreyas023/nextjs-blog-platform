import Link from "next/link";

const BlogCard = ({ blog }) => {
  return (
    <div key={blog._id} className="border rounded-lg overflow-hidden shadow-lg">
      <img src={blog.featuredImage} alt={blog.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-xl font-semibold">{blog.title}</h2>
        <p className="text-gray-600 mt-2">{blog.content.substring(0, 100)}...</p>
        <Link href={`/blogs/${blog._id}`} className="text-blue-500 hover:text-blue-700 mt-4 block">Read More</Link>
      </div>
    </div>
  );
};

export default BlogCard;