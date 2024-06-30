import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import Login from "./components/Login";
import { CreateBlog } from "./components/CreateBlog";
import { Notifications } from "./components/Notifications";
import Togglable from "./components/Togglable";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "./reducers/notificationsReducer";
import {
  initializeBlogs,
  createBlog as createNewBlog,
} from "./reducers/blogReducer";
import { initializeUser, setUser } from "./reducers/userReducer";
import { Link, Route, Routes, useMatch } from "react-router-dom";
import Users from "./components/Users";
import User from "./components/User";
import BlogInfo from "./components/BlogInfo";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableContainer,
  Toolbar,
  Typography,
} from "@mui/material";

const App = () => {
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);
  const users = useSelector((state) => state.users);

  const newBlogRef = useRef();

  const dispatch = useDispatch();

  const userMatch = useMatch("/users/:id");
  const userMatchId = userMatch ? userMatch.params.id : null;
  const matchedUser = userMatch
    ? users.find((user) => user.id === userMatch.params.id)
    : null;

  const blogMatch = useMatch("/blogs/:id");
  const blogMatchId = blogMatch ? blogMatch.params.id : null;
  const matchedBlog = blogMatch
    ? blogs.find((blog) => blog.id === blogMatch.params.id)
    : null;

  useEffect(() => {
    dispatch(initializeBlogs());
    dispatch(initializeUser());
    console.log(
      "set user to:",
      JSON.parse(window.localStorage.getItem("user"))
    );
  }, [dispatch]);

  const handleLogout = (event) => {
    event.preventDefault();
    window.localStorage.removeItem("user");
    dispatch(setUser(null));
  };

  const createBlog = async (newBlog) => {
    try {
      const { title, author, url } = newBlog;
      dispatch(createNewBlog(title, author, url, user));
      dispatch(showNotification(`a new blog ${title} by ${author} added`));
      newBlogRef.current.toggleVisibility();
    } catch (exception) {
      console.error(exception);
      dispatch(showNotification(exception.response.data.error, true));
    }
  };

  return (
    <Container>
      <Typography variant="body1">
        {!user && (
          <>
            <Login user={user} />
          </>
        )}
        {user && (
          <Box display="flex" flexDirection="column" gap={1}>
            <AppBar position="static">
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                ></IconButton>
                <Box my={2} gap={2} display="flex" alignItems={"center"}>
                  <Button color="inherit" component={Link} to={"/"}>
                    blogs
                  </Button>
                  <Button color="inherit" component={Link} to={"/users"}>
                    users
                  </Button>
                  {user.name} logged in{" "}
                  <Button
                    color="inherit"
                    variant="outlined"
                    onClick={handleLogout}
                    sx={{ ml: 1 }}
                  >
                    logout
                  </Button>
                </Box>
              </Toolbar>
            </AppBar>
            <Typography
              variant="h3"
              fontFamily={"cursive"}
              marginTop={0}
              marginBottom={1}
            >
              <b>blog app</b>
            </Typography>
            <Notifications />
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Togglable buttonLabel="new blog" ref={newBlogRef}>
                      <CreateBlog
                        user={user}
                        newBlogRef={newBlogRef}
                        createBlog={createBlog}
                      />
                    </Togglable>

                    <TableContainer component={Paper}>
                      <Table>
                        <TableBody>
                          {[...blogs]
                            .sort((a, b) => b.likes - a.likes)
                            .map((blog) => (
                              <Blog
                                key={blog.id}
                                blog={blog}
                                user={user}
                                likeFunction={blogService.like}
                              />
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                }
              />
              <Route path="/users" element={<Users />} />
              <Route
                path="/users/:id"
                element={
                  <User matchedUser={matchedUser} userId={userMatchId} />
                }
              />
              <Route
                path="/blogs/:id"
                element={
                  <BlogInfo
                    matchedBlog={matchedBlog}
                    blogId={blogMatchId}
                    likeFunction={blogService.like}
                  />
                }
              />
            </Routes>
          </Box>
        )}
      </Typography>
    </Container>
  );
};

export default App;
