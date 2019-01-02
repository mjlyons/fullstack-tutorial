import gql from "graphql-tag";
import { ILaunch } from "./interfaces";
import { GET_CART_ITEMS, LAUNCH_IS_IN_CART } from "./graphql";
import { Context } from "react-apollo";

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    cartItems: [Launch]!
  }

  extend type Launch {
    isInCart: Boolean!
  }

  extend type Mutation {
    addOrRemoveFromCart(id: ID!): [Launch]
  }
`;

export const resolvers = {
  Launch: {
    isInCart: (launch: ILaunch, _: any, { cache }: Context): boolean => {
      const { cartItems } = cache.readQuery({ query: GET_CART_ITEMS });
      return cartItems.includes(launch.id);
    }
  },
  Mutation: {
    addOrRemoveFromCart: (
      _: any,
      params: { id: string },
      { cache }: Context
    ): string[] => {
      const { id } = params;

      // Update root's `cartItems`
      const { cartItems } = cache.readQuery({ query: GET_CART_ITEMS });
      const isInCart = cartItems.includes(id);
      const data = {
        cartItems: isInCart
          ? cartItems.filter((i: string) => i !== id)
          : [...cartItems, id]
      };
      cache.writeQuery({ query: GET_CART_ITEMS, data });

      // Update launch's `isInCart`
      const fqid = `Launch:${id}`;
      const launch = cache.readFragment({
        fragment: LAUNCH_IS_IN_CART,
        id: fqid
      });
      cache.writeFragment({
        fragment: LAUNCH_IS_IN_CART,
        id: fqid,
        data: { ...launch, isInCart: !isInCart }
      });
      return data.cartItems;
    }
  }
};
