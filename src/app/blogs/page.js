// src/app/blogs/page.js

export default async function BlogsPage() {
    const res = await fetch("http://localhost:3000/api/blogs", { cache: "no-store" }); // Disables caching
    const blogs = await res.json();
  
    return (
      <div>
        <h1>Blogs</h1>
        <ul>
          {blogs.map((blog) => (
            <li key={blog._id}>
              <h2>{blog.title}</h2>
              <p>{blog.content}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  