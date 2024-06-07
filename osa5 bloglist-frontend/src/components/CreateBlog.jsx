import { useState } from "react";
import blogService from "../services/blogs";

export const CreateBlog = (props) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleClick = async (event) => {
    event.preventDefault();
    const newBlog = { title, author, url };
    await blogService.create(newBlog, props.user);

    console.log("props:", props);

    blogService.getAll().then((blogs) => props.setBlogs(blogs));

    console.log("blogs set");
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
