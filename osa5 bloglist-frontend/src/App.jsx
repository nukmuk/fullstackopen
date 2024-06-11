import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import Login from "./components/Login";
import { CreateBlog } from "./components/CreateBlog";
import { Notifications } from "./components/Notifications";
import Togglable from "./components/Togglable";

let notificationIndex = 0;

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState();
  const [notifications, setNotifications] = useState([]);

  const newBlogRef = useRef();

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

  const addNotification = (notification) => {
    notification.index = notificationIndex;
    setNotifications((prev) => prev.concat(notification));
    notificationIndex++;
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n !== notification));
    }, 5000);
  };

  return (
    <>
      {!user && (
        <>
          <Login
            user={user}
            setUser={setUser}
            notifications={notifications}
            addNotification={addNotification}
          />
        </>
      )}
      {user && (
        <div>
          <h2>blogs</h2>
          <Notifications notifications={notifications} />
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>
          <Togglable buttonLabel="new blog" ref={newBlogRef}>
            <CreateBlog
              user={user}
              setBlogs={setBlogs}
              addNotification={addNotification}
              newBlogRef={newBlogRef}
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
                addNotification={addNotification}
                likeFunction={blogService.like}
              />
            ))}
        </div>
      )}
    </>
  );
};

export default App;
