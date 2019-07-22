const {ApolloServer, gql} = require('apollo-server');
const _ = require('lodash');

// This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.
const booksCollection = [
  {
    title: 'Harry Potter and the Chamber of Secrets',
    authorId: "1",
  },
    {
    title: 'Harry Potter 1.0',
    authorId: "1",
  },
  {
    title: 'Jurassic Park',
    authorId: "2",
  },
];

const authorsCollection = [
  {id: "1", name: 'J.K. Rowling'},
  {id: "2", name: 'Michael Crichton'},
]

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
    # these declarations express the relationships and the shape of the data to return, 
    # not where the data comes from or how it might be stored - which will be covered outside the SDL.
    type Book {
        title: String
        author: Author
    }

    type Author {
        name: String
        books: [Book]
    }

    # The "Query" type is the root of all GraphQL queries.
    # (A "Mutation" type will be covered later on.)
    type Query {
        books: [Book]
        author(id: ID!): Author
    }
`;


const resolvers = {
  Query: {
    author(parent, args, context, info) {
      return _.find(authorsCollection, {id: args.id});
    },
  },
  Author: {
    books: (author) => {
      console.log('author: ', author);
      const books = _.filter(booksCollection, {authorId: author.id});
      return books;
    },
  },
  Book: {
    author: (book) => {
      return _.find(authorsCollection, {id: book.authorId});
    },
  }
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({typeDefs, resolvers});

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({url}) => {
  console.log(`🚀  Server ready at ${url}`);
});