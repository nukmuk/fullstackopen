import { useState } from "react";

export const CreateBlog = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleCreate = async (event) => {
    event.preventDefault();
    createBlog({ title, author, url });
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={handleCreate}>
        title:{" "}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          id="title-input"
        />
        <br />
        author:{" "}
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          id="author-input"
        />
        <br />
        url:{" "}
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          id="url-input"
        />
        <br />
        <button>create</button>
      </form>
    </>
  );
};
