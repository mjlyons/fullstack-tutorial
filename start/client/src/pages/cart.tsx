import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import Header from "../components/header";
import Loading from "../components/loading";
import CartItem from "../containers/cart-item";
import BookTrips from "../containers/book-trips";
import { GET_CART_ITEMS } from "../graphql";

interface IProps {
  path: string;
}
export default (props: IProps): JSX.Element => (
  <Query query={GET_CART_ITEMS}>
    {({ data, loading, error }) => {
      if (loading) return <Loading />;
      if (error) return <p>ERROR: {error.message}</p>;

      return (
        <>
          <Header>My Cart</Header>
          {!data.cartItems || !data.cartItems.length ? (
            <p data-testid="empty-message">No items in your cart</p>
          ) : (
            <>
              {data.cartItems.map((launchId: string) => (
                <CartItem key={launchId} launchId={launchId} />
              ))}
              <BookTrips cartItems={data.cartItems} />
            </>
          )}
        </>
      );
    }}
  </Query>
);
