import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";
import { useState } from "react";

const Books = (props) => {
  const booksResult = useQuery(ALL_BOOKS);
  const [genre, setGenre] = useState(null);

  if (!props.show) {
    return null;
  }

  if (booksResult.loading) return <div>loading...</div>;

  const genres = booksResult.data.allBooks.reduce((genres, book) => {
    const result = genres;
    book.genres.forEach((genre) => {
      if (!genres.includes(genre)) result.push(genre);
    });
    return result;
  }, []);

  console.log("genres:", genres);

  console.log("res:", booksResult);

  const genreFilter = (book) => (genre ? book.genres.includes(genre) : true);

  return (
    <div>
      <h2>books</h2>

      <p style={{ visibility: genre ? "visible" : "hidden" }}>
        in genre <b>{genre}</b>
      </p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksResult.data.allBooks.filter(genreFilter).map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {genres.map((genre) => (
        <button key={genre} onClick={() => setGenre(genre)}>
          {genre}
        </button>
      ))}
      <button onClick={() => setGenre(null)}>all genres</button>
    </div>
  );
};

export default Books;
