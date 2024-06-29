import { useEffect, useState } from "react";
import userService from "../services/users";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { initializeUsers, setUsers } from "../reducers/usersReducer";
const Users = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(initializeUsers());
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
          {users.map((u) => (
            <tr key={u.id}>
              <td>
                <Link to={`/users/${u.id}`}>{u.name}</Link>
              </td>
              <td>{u.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
