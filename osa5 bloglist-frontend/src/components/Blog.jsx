import { useState } from "react";
import "./Blog.css";
import { useDispatch } from "react-redux";
import { showNotification } from "../reducers/notificationsReducer";
import { initializeBlogs, removeBlog } from "../reducers/blogReducer";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";

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
    <TableRow>
      <TableCell>
        <Typography variant="body1">
          <Box display="flex" alignItems="center" gap={2}>
            <Link to={`/blogs/${blog.id}`}>
              <Typography variant="subtitle1">
                {blog.title} {blog.author}{" "}
              </Typography>
            </Link>
            <Button
              onClick={toggleVisibility}
              // color={visible ? "secondary" : "primary"}
              variant={visible ? "outlined" : "text"}
            >
              {visible ? "hide" : "view"}
            </Button>
          </Box>
          {visible && (
            <>
              {blog.url}
              <br />
              likes {blog.likes} <br />
              {blog.user.name}
              <br />
              <Box display="flex" gap={1}>
                <Button
                  onClick={handleLike}
                  variant="contained"
                  color="success"
                >
                  like
                </Button>
                {user.id === blog.user.id && (
                  <Button
                    onClick={handleRemove}
                    variant="contained"
                    color="warning"
                  >
                    remove
                  </Button>
                )}
              </Box>
            </>
          )}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

export default Blog;
