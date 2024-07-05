import { useEffect, useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import { useApolloClient, useSubscription } from "@apollo/client";
import Recommendations from "./components/Recommendations";
import { ALL_BOOKS, BOOK_ADDED } from "./queries";

export const updateCache = (cache, query, addedBook) => {
  const uniqByName = (a) => {
    let seen = new Set();
    return a.filter((item) => {
      let k = item.name;
      return seen.has(k) ? false : seen.add(k);
    });
  };

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook)),
    };
  });
};

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const client = useApolloClient();

  useEffect(() => {
    const token = localStorage.getItem("user-token");
    if (token) setToken(token);
  }, []);

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      console.log(data);
      const addedBook = data.data.bookAdded;
      alert(`book ${addedBook.title} added`);

      updateCache(client.cache, { query: ALL_BOOKS }, addedBook);
    },
  });

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
            <button onClick={() => setPage("recommendations")}>
              recommend
            </button>
            <button onClick={handleLogout}>logout</button>
          </>
        )}
      </div>

      <Authors show={page === "authors"} />

      <Books show={page === "books"} books={[]} />

      <NewBook show={page === "add"} />
      <LoginForm show={page === "login"} setToken={setToken} />
      <Recommendations show={page === "recommendations"} />
    </div>
  );
};

export default App;
