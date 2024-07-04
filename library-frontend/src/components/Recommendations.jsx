import { useQuery } from "@apollo/client";
import { ALL_BOOKS, ME } from "../queries";

const Recommendations = ({ show }) => {
  const userResult = useQuery(ME);
  const booksResult = useQuery(ALL_BOOKS);
  if (!show) return null;

  if (userResult.loading || booksResult.loading) return <p>loading...</p>;

  console.log("userRes", userResult);
  console.log("bookRes", booksResult);

  const favoriteGenre = userResult.data.me.favoriteGenre;
  console.log("genre", favoriteGenre);

  const booksInGenre = booksResult.data.allBooks.reduce((books, book) => {
    if (book.genres.includes(favoriteGenre)) return books.concat(book);
    return books;
  }, []);
  console.log("hello", booksInGenre);

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
