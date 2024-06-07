import { useState } from "react";
import loginService from "../services/login";

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
      console.error(exception);
    }
  };

  return (
    <div>
      <h1>log in to application</h1>
      <form>
        username{" "}
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
        <br />
        password{" "}
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
        <br />
        <button onClick={handleLogin}>login</button>
      </form>
    </div>
  );
};

export default Login;
