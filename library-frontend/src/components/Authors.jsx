import { gql, useMutation, useQuery } from "@apollo/client";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";

const Authors = (props) => {
  const authorsResult = useQuery(ALL_AUTHORS);
  const [setBornToFunction] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  if (!props.show) {
    return null;
  }
  // let authors = props.authors;

  if (authorsResult.loading) return <div>loading...</div>;

  const handleSetBirthyear = (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const born = Number(event.target.born.value);
    setBornToFunction({ variables: { name, setBornTo: born } });
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authorsResult.data.allAuthors.map((author) => (
            <tr key={author.name}>
              <td>{author.name}</td>
              <td>{author.born}</td>
              <td>{author.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Set birthyear</h3>
      <form onSubmit={handleSetBirthyear}>
        <select name="name">
          {authorsResult.data.allAuthors.map((author) => (
            <option key={author.name} value={author.name}>
              {author.name}
            </option>
          ))}
        </select>
        <br />
        born <input name="born" />
        <br />
        <button>update author</button>
      </form>
    </div>
  );
};

export default Authors;
