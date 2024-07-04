import { useLazyQuery, useQuery } from "@apollo/client";
import { BOOKS_IN_GENRE, ME } from "../queries";
import { useEffect, useState } from "react";

const Recommendations = ({ show }) => {
  const userResult = useQuery(ME);
  const [getBooks, booksResult] = useLazyQuery(BOOKS_IN_GENRE);
  const [booksInGenre, setBooksInGenre] = useState([]);
  const [favoriteGenre, setFavoriteGenre] = useState(null);

  useEffect(() => {
    if (userResult.loading) return;
    setFavoriteGenre(userResult.data.me.favoriteGenre);
  }, [userResult.data]);

  useEffect(() => {
    getBooks({ variables: { genre: favoriteGenre } });
  }, [favoriteGenre]);

  useEffect(() => {
    if (booksResult.loading) return;
    if (!booksResult.data) return;
    setBooksInGenre(
      booksResult.data.allBooks.reduce((books, book) => {
        if (book.genres.includes(favoriteGenre)) return books.concat(book);
        return books;
      }, [])
    );
  }, [booksResult.data]);

  if (!show) return null;

  if (userResult.loading || booksResult.loading) return <p>loading...</p>;

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
          {booksInGenre.map((book) => (
            <tr key={book.name}>
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
