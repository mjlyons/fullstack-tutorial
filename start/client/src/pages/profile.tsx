import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import Loading from "../components/loading";
import Header from "../components/header";
import LaunchTile from "../components/launch-tile";
import { LAUNCH_TILE_DATA } from "../graphql";
import { ILaunch } from "../interfaces";

const GET_MY_TRIPS = gql`
  query GetMyTrips {
    me {
      id
      email
      trips {
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`;

interface IProps {
  path: string;
}
export default (props: IProps): JSX.Element => (
  <Query query={GET_MY_TRIPS} fetchPolicy="network-only">
    {({ data, loading, error }) => {
      if (loading) return <Loading />;
      if (error) return <p>ERROR: {error.message}</p>;

      return (
        <>
          <Header>My Trips</Header>
          {data.me.trips.length ? (
            data.me.trips.map((launch: ILaunch) => (
              <LaunchTile key={launch.id} launch={launch} />
            ))
          ) : (
            <p>You haven't booked any trips</p>
          )}
        </>
      );
    }}
  </Query>
);
