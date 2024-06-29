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
import { Route, Routes } from "react-router-dom";
import Users from "./components/Users";

const App = () => {
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);

  const newBlogRef = useRef();

  const dispatch = useDispatch();

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
    <>
      {!user && (
        <>
          <Login user={user} />
        </>
      )}
      {user && (
        <div>
          <h2>blogs</h2>
          <Notifications />
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>
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
                </>
              }
            />
            <Route path="/users" element={<Users />} />
          </Routes>
        </div>
      )}
    </>
  );
};

export default App;
