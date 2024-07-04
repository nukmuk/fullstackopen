import { useEffect, useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import { useApolloClient } from "@apollo/client";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const client = useApolloClient();

  useEffect(() => {
    const token = localStorage.getItem("user-token");
    if (token) setToken(token);
  }, []);

  const handleLogout = (event) => {
    event.preventDefault();
    setToken(null);
    // localStorage.removeItem("user-token");
    localStorage.clear();
    client.resetStore();
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {!token && <button onClick={() => setPage("login")}>login</button>}
        {token && (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={handleLogout}>logout</button>
          </>
        )}
      </div>

      <Authors show={page === "authors"} />

      <Books show={page === "books"} books={[]} />

      <NewBook show={page === "add"} />
      <LoginForm show={page === "login"} setToken={setToken} />
    </div>
  );
};

export default App;
