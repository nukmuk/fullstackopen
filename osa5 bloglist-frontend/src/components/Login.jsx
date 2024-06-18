import { useState } from "react";
import loginService from "../services/login";
import { Notifications } from "./Notifications";

const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });

      console.log("user:", user);

      props.setUser(user);
      window.localStorage.setItem("user", JSON.stringify(user));
      setUsername("");
      setPassword("");
    } catch (exception) {
      props.addNotification({
        message: "wrong username or password",
        error: true,
      });
      console.error(exception);
    }
  };

  return (
    <div>
      <h1>log in to application</h1>
      <Notifications notifications={props.notifications} />
      <form onSubmit={handleLogin}>
        username{" "}
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          data-testid="username"
        />
        <br />
        password{" "}
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          data-testid="password"
        />
        <br />
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default Login;
