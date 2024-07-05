const { GraphQLError } = require("graphql");
const Author = require("./model/author");
const Book = require("./model/book");

const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, { author, genre }) => {
      let search = {};
      if (genre) {
        search.genres = genre;
      }
      const result = await Book.find(search).populate("author");
      return result;
    },
    allAuthors: async () => {
      const authors = await Author.find({});
      const books = await Book.find({}).populate("author");
      return authors.map((author) => {
        author.bookCount = books.filter((book) =>
          book.author ? book.author.name === author.name : false
        ).length;
        return author;
      });
    },
    me: async (root, args, context) => {
      return context.currentUser;
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser)
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });

      args.published = Number.parseInt(args.published);
      const book = new Book({ ...args });
      let author = await Author.findOne({ name: args.author });
      if (!author) {
        author = new Author({ name: args.author });
        try {
          await author.save();
        } catch (error) {
          throw new GraphQLError("Saving author failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.author,
              error,
            },
          });
        }
      }
      book.author = author;
      try {
        const savedBook = await book.save();
        pubsub.publish("BOOK_ADDED", { bookAdded: savedBook });
        return savedBook;
      } catch (error) {
        throw new GraphQLError("Saving book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title,
            error,
          },
        });
      }
    },
    editAuthor: async (root, { name, setBornTo }, context) => {
      if (!context.currentUser)
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      let authorToEdit = await Author.findOne({ name });
      if (!authorToEdit) return null;
      authorToEdit.born = setBornTo;
      return authorToEdit.save();
    },
    createUser: async (root, args) => {
      const user = new User({ ...args });
      return user.save().catch((error) => {
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        });
      });
    },
    login: async (root, { username, password }) => {
      const user = await User.findOne({ username });

      if (!user || password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;
