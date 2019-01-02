import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Button from "../components/button";
import { GET_LAUNCH } from "./cart-item";
import { LAUNCH_IS_IN_CART } from "../graphql";

const BOOK_TRIPS = gql`
  mutation BookTrips($launchIds: [ID]!) {
    bookTrips(launchIds: $launchIds) {
      success
      message
      launches {
        id
        isBooked
      }
    }
  }
`;

interface IProps {
  cartItems: string[];
}

export default ({ cartItems }: IProps): JSX.Element => (
  <Mutation
    mutation={BOOK_TRIPS}
    variables={{ launchIds: cartItems }}
    refetchQueries={cartItems.map((launchId: string) => ({
      query: GET_LAUNCH,
      variables: { launchId }
    }))}
    update={cache => {
      debugger;

      // Update each Launch's `isInCart` field
      cartItems.map((launchId: string) => {
        const id = `Launch:${launchId}`;
        const launch = cache.readFragment({ fragment: LAUNCH_IS_IN_CART, id });
        const data = { ...launch, isInCart: false };
        cache.writeFragment({ fragment: LAUNCH_IS_IN_CART, id, data });
      });

      // Update root's `cartItems` field
      cache.writeData({ data: { cartItems: [] } });
    }}
  >
    {(bookTrips, { data, loading, error }) =>
      data && data.bookTrips && !data.bookTrips.success ? (
        <p data-testid="message">{data.bookTrips.messsage}</p>
      ) : (
        <Button onClick={() => bookTrips()} data-testid="book-button">
          Book All
        </Button>
      )
    }
  </Mutation>
);
