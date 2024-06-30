import { Box, Button, TextField, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
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
      <Typography variant="body1">
        create new:
        <form onSubmit={handleCreate}>
          <Box
            display="flex"
            flexDirection="column"
            // my={2}
            alignItems={"start"}
            // sx={{ padding: 0, margin: 0 }}
            gap={1}
          >
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              id="title-input"
            />
            <TextField
              label="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              id="author-input"
            />
            <TextField
              label="URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              id="url-input"
            />
            <Button type="submit" variant="contained" sx={{ mb: 1 }}>
              create
            </Button>
          </Box>
        </form>
      </Typography>
    </>
  );
};
