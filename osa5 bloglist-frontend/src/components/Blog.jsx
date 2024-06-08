import { useState } from "react";
import "./Blog.css";
import blogService from "../services/blogs";

const Blog = ({ blog, setBlogs }) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = (event) => {
    event.preventDefault();
    setVisible((prev) => !prev);
  };

  const handleLike = async (event) => {
    event.preventDefault();
    const response = await blogService.like(blog.id);

    setBlogs((prev) => {
      return prev.map((b) => {
        if (b.id === blog.id) {
          b.likes = response.likes;
        }
        return b;
      });
    });

    // or

    // await setBlogs(await blogService.getAll());
  };

  return (
    <div className="blog">
      {blog.title} {blog.author}{" "}
      <button onClick={toggleVisibility}>{visible ? "hide" : "view"}</button>
      {visible && (
        <>
          <br />
          {blog.url}
          <br />
          likes {blog.likes} <button onClick={handleLike}>like</button>
          <br />
          {blog.user.name}
        </>
      )}
    </div>
  );
};

export default Blog;
