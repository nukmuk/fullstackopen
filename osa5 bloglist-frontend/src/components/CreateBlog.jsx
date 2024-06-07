import { useState } from "react";
import blogService from "../services/blogs";

export const CreateBlog = (props) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleClick = async (event) => {
    try {
      event.preventDefault();
      const newBlog = { title, author, url };
      await blogService.create(newBlog, props.user);
      props.addNotification({
        message: `a new blog ${newBlog.title} by ${newBlog.author} added`,
      });
      blogService.getAll().then((blogs) => props.setBlogs(blogs));
    } catch (exception) {
      console.error(exception);
      props.addNotification({
        message: exception.response.data.error,
        error: true,
      });
    }
  };

  return (
    <>
      <h2>create new</h2>
      <form>
        title:{" "}
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <br />
        author:{" "}
        <input value={author} onChange={(e) => setAuthor(e.target.value)} />
        <br />
        url: <input value={url} onChange={(e) => setUrl(e.target.value)} />
        <br />
        <button onClick={handleClick}>create</button>
      </form>
    </>
  );
};
