import { useEffect, useState } from "react";
import blogService from "../services/blogs";

const BlogInfo = ({ matchedBlog, blogId, likeFunction }) => {
  const [blog, setBlog] = useState(matchedBlog);

  useEffect(() => {
    if (!matchedBlog) {
      blogService.get(blogId).then((newBlog) => setBlog(newBlog));
    }
  }, []);

  if (!blog) return null;

  console.log("blog:", blog);

  const handleLike = async (e) => {
    e.preventDefault();
    const updatedBlog = await likeFunction(blog.id);
    setBlog((prev) => ({ ...prev, likes: updatedBlog.likes }));
  };

  const handleComment = async (e) => {
    e.preventDefault();
    const comment = e.target.comment.value;
    e.target.comment.value = "";
    await blogService.comment(blogId, comment);
    blogService.get(blogId).then((newBlog) => setBlog(newBlog));
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
      <h2>comments</h2>
      <form onSubmit={handleComment}>
        <input name="comment" />
        <button>add comment</button>
      </form>
      <ul>
        {blog.comments.map((c) => (
          <li key={c._id}>{c.content}</li>
        ))}
      </ul>
    </div>
  );
};

export default BlogInfo;
