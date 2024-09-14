export default function Blogs({ blogs }) {
    return (
      <div>
        {blogs.map(blog => (
          <div key={blog._id}>
            <h2>{blog.title}</h2>
            <p>{blog.content}</p>
          </div>
        ))}
      </div>
    );
  }
  
  export async function getStaticProps() {
    const res = await fetch("http://localhost:3000/api/blogs");
    const blogs = await res.json();
    return { props: { blogs } };
  }
  