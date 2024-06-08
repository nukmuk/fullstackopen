import { useState } from "react";
import "./Blog.css";
import blogService from "../services/blogs";

const Blog = ({ blog, setBlogs, user, addNotification }) => {
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

  const handleRemove = async (event) => {
    try {
      event.preventDefault();
      if (
        !confirm(
          `Remove blog ${blog.title} ${
            blog.author !== undefined ? "by " + blog.author : ""
          }`
        )
      )
        return;

      await blogService.remove(blog.id, user);
      console.log("removed", blog);
      await setBlogs(await blogService.getAll());
    } catch (exception) {
      addNotification({ message: exception.response.data.error, error: true });
    }
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
          <br />
          {user.id === blog.user.id && (
            <>
              <button onClick={handleRemove}>remove</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Blog;
