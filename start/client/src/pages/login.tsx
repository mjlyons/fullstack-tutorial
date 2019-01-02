import React from "react";
import { Mutation, ApolloConsumer } from "react-apollo";
import gql from "graphql-tag";

import LoginForm from "../components/login-form";

const LOGIN_USER = gql`
  mutation login($email: String!) {
    login(email: $email)
  }
`;

interface IProps {
  path?: string;
}

export default (props: IProps): JSX.Element => (
  <ApolloConsumer>
    {client => (
      <Mutation
        mutation={LOGIN_USER}
        onCompleted={({ login }) => {
          localStorage.setItem("token", login);
          client.writeData({ data: { isLoggedIn: true } });
        }}
      >
        {(login, { data }) => <LoginForm login={login} />}
      </Mutation>
    )}
  </ApolloConsumer>
);
