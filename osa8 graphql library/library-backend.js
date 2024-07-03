const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { v1: uuid } = require("uuid");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const Author = require("./model/author");
const Book = require("./model/book");

require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log("connecting to", MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

const typeDefs = `
  type Book {
    title: String!,
    author: Author!,
    published: Int!,
    genres: [String!]!,
    id: ID!
  }

  type Author {
    name: String!,
    born: Int,
    bookCount: Int!,
  }

  type Query {
    bookCount: Int!,
    authorCount: Int!,
    allBooks(author: String, genre: String): [Book]!,
    allAuthors: [Author]!,
  }

  type Mutation {
    addBook (
      title: String!,
      author: String!,
      published: Int!,
      genres: [String!]!,
    ): Book,
    editAuthor (
      name: String!,
      setBornTo: Int!,
    ): Author,
  }
`;

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      return await Book.find({});
    },
    allAuthors: async () => {
      const authors = await Author.find({});
      return authors;
    },
  },
  Mutation: {
    addBook: async (root, args) => {
      args.published = Number.parseInt(args.published);
      const book = new Book({ ...args });
      let author = await Author.findOne({ name: args.author });
      console.log("found author:", author);
      if (!author) {
        author = new Author({ name: args.author });
        await author.save();
      }
      book.author = author;
      return await book.save();
    },
    editAuthor: (root, { name, setBornTo }) => {
      let authorToEdit = authors.find((a) => a.name === name);
      if (!authorToEdit) return null;
      authorToEdit.born = setBornTo;
      return authorToEdit;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
