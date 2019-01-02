import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import gql from "graphql-tag";
import ReactDOM from "react-dom";
import { Query, ApolloProvider } from "react-apollo";
import { ApolloCache } from "apollo-cache";
import Pages from "./pages/pages";
import Login from "./pages/login";
import React from "react";
import { resolvers, typeDefs } from "./resolvers";
import injectStyles from "./styles";

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

const link = new HttpLink({
  uri: "http://localhost:4000/graphql",
  headers: { authorization: localStorage.getItem("token") }
});
const cache = new InMemoryCache();

const client = new ApolloClient({
  link,
  cache,
  initializers: {
    isLoggedIn: () => !!localStorage.getItem("token"),
    cartItems: () => []
  },
  resolvers,
  typeDefs
});

injectStyles();
ReactDOM.render(
  <ApolloProvider client={client}>
    <Query query={IS_LOGGED_IN}>
      {({ data }) => (data.isLoggedIn ? <Pages /> : <Login />)}
    </Query>
  </ApolloProvider>,
  document.getElementById("root")
);
