import { useState } from "react";
import "./Blog.css";
import { useDispatch } from "react-redux";
import { showNotification } from "../reducers/notificationsReducer";
import { initializeBlogs, removeBlog } from "../reducers/blogReducer";

const Blog = ({ blog, user, likeFunction }) => {
  const [visible, setVisible] = useState(false);

  const dispatch = useDispatch();

  const toggleVisibility = (event) => {
    event.preventDefault();
    setVisible((prev) => !prev);
  };

  const handleLike = async (event) => {
    event.preventDefault();
    const response = await likeFunction(blog.id);

    // setBlogs((prev) => {
    //   return prev.map((b) => {
    //     if (b.id === blog.id) {
    //       b.likes = response.likes;
    //     }
    //     return b;
    //   });
    // });

    // or

    dispatch(initializeBlogs());
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

      dispatch(removeBlog(blog.id, user));
    } catch (exception) {
      dispatch(showNotification(exception.response.data.error, true));
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
