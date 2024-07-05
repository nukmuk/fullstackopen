import { useLazyQuery, useQuery } from "@apollo/client";
import { BOOKS_IN_GENRE, ME } from "../queries";
import { useEffect } from "react";

const Recommendations = ({ show }) => {
  const userResult = useQuery(ME);
  const [getBooks, booksResult] = useLazyQuery(BOOKS_IN_GENRE);

  useEffect(() => {
    if (userResult.loading) return;
    const genre = userResult.data.me.favoriteGenre;
    getBooks({ variables: { genre } });
  }, [userResult.loading]);

  if (!show) return null;

  if (userResult.loading || !booksResult.called) return <p>loading...</p>;

  const favoriteGenre = userResult.data.me.favoriteGenre;

  return (
    <>
      <h2>recommendations</h2>
      books in your favorite genre <b>{favoriteGenre}</b>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksResult.data.allBooks.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Recommendations;
