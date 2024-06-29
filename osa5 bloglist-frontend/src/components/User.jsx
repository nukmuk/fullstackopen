import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import users from "../services/users";

const User = ({ matchedUser, userId }) => {
  const [user, setUser] = useState(matchedUser);

  useEffect(() => {
    if (!matchedUser) {
      users.get(userId).then((newUser) => setUser(newUser));
    }
  }, []);

  if (!user) return null;

  console.log("user:", user);
  return (
    <div>
      {<h1>{user.name}</h1>}
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default User;
