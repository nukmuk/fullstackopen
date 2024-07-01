import { gql, useQuery } from "@apollo/client";

const Books = (props) => {
  if (!props.show) {
    return null;
  }

  const ALL_BOOKS = gql`
    query {
      allBooks {
        title
        author
        published
      }
    }
  `;

  const booksResult = useQuery(ALL_BOOKS);
  console.log(booksResult);

  if (booksResult.loading) return <div>loading...</div>;

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksResult.data.allBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
