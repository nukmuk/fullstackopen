import { useEffect, useState } from "react";
import blogs from "../services/blogs";

const BlogInfo = ({ matchedBlog, blogId, likeFunction }) => {
  const [blog, setBlog] = useState(matchedBlog);

  useEffect(() => {
    if (!matchedBlog) {
      blogs.get(blogId).then((newBlog) => setBlog(newBlog));
    }
  }, []);

  if (!blog) return null;

  console.log("blog:", blog);

  const handleLike = async (e) => {
    e.preventDefault();
    const updatedBlog = await likeFunction(blog.id);
    setBlog((prev) => ({ ...prev, likes: updatedBlog.likes }));
  };

  return (
    <div>
      <h1>
        {blog.title} {blog.author}
      </h1>
      <a href={blog.url}>{blog.url}</a>
      <br />
      {blog.likes} likes <button onClick={handleLike}>like</button>
      <br />
      added by {blog.user.name}
    </div>
  );
};

export default BlogInfo;
