import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import Login from "./components/Login";
import { CreateBlog } from "./components/CreateBlog";
import { Notifications } from "./components/Notifications";
import Togglable from "./components/Togglable";
import { useDispatch } from "react-redux";
import { showNotification } from "./reducers/notificationsReducer";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState();

  const newBlogRef = useRef();

  const dispatch = useDispatch();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
    setUser(JSON.parse(window.localStorage.getItem("user")));
    console.log(
      "set user to:",
      JSON.parse(window.localStorage.getItem("user"))
    );
  }, []);

  const handleLogout = (event) => {
    event.preventDefault();
    window.localStorage.removeItem("user");
    setUser(null);
  };

  const createBlog = async (newBlog) => {
    try {
      await blogService.create(newBlog, user);
      const { title, author } = newBlog;
      dispatch(showNotification(`a new blog ${title} by ${author} added`));
      blogService.getAll().then((blogs) => setBlogs(blogs));
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
          <Login user={user} setUser={setUser} />
        </>
      )}
      {user && (
        <div>
          <h2>blogs</h2>
          <Notifications />
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>
          <Togglable buttonLabel="new blog" ref={newBlogRef}>
            <CreateBlog
              user={user}
              setBlogs={setBlogs}
              newBlogRef={newBlogRef}
              createBlog={createBlog}
            />
          </Togglable>
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                setBlogs={setBlogs}
                user={user}
                likeFunction={blogService.like}
              />
            ))}
        </div>
      )}
    </>
  );
};

export default App;
