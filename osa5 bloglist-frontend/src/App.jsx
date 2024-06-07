import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import Login from "./components/Login";
import { CreateBlog } from "./components/CreateBlog";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState();

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

  return (
    <>
      {!user && <Login user={user} setUser={setUser} />}
      {user && (
        <div>
          <h2>blogs</h2>
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>
          <CreateBlog user={user} setBlogs={setBlogs} />
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </>
  );
};

export default App;
