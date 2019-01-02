import React from "react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { GET_LAUNCH_DETAILS, TOGGLE_CART } from "../graphql";
import Button from "../components/button";

const CANCEL_TRIP = gql`
  mutation cancel($launchId: ID!) {
    cancelTrip(launchId: $launchId) {
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
  isBooked: boolean;
  id: string;
  isInCart: boolean;
}

export default ({ isBooked, id, isInCart }: IProps): JSX.Element => (
  <Mutation
    mutation={isBooked ? CANCEL_TRIP : TOGGLE_CART}
    variables={{ launchId: id }}
    refetchQueries={[
      {
        query: GET_LAUNCH_DETAILS,
        variables: { launchId: id }
      }
    ]}
  >
    {(mutate, { loading, error }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>An error occurred</p>;

      return (
        <div>
          <Button onClick={() => mutate()} data-testid={"action-button"}>
            {isBooked
              ? "Cancel This trip"
              : isInCart
              ? "Remove from Cart"
              : "Add to Cart"}
          </Button>
        </div>
      );
    }}
  </Mutation>
);
