import React, { ReactNode } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import LaunchTile from "../components/launch-tile";
import Header from "../components/header";
import Button from "../components/button";
import Loading from "../components/loading";
import { ILaunch } from "../interfaces";
import { LAUNCH_TILE_DATA } from "../graphql";

const GET_LAUNCHES = gql`
  query launchList($after: String) {
    launches(after: $after) {
      cursor
      hasMore
      launches {
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`;

interface IProps {
  path: string;
}

export default (props: IProps): JSX.Element => {
  return (
    <Query query={GET_LAUNCHES}>
      {({ data, loading, error, fetchMore }) => {
        if (loading) return <Loading />;
        if (error) return <p>ERROR</p>;
        return (
          <>
            <Header />
            {data.launches &&
              data.launches.launches &&
              data.launches.launches.map((launch: ILaunch) => (
                <LaunchTile key={launch.id} launch={launch} />
              ))}
            {data.launches && data.launches.hasMore && (
              <Button
                onClick={() =>
                  fetchMore({
                    variables: {
                      after: data.launches.cursor
                    },
                    updateQuery: (prev, { fetchMoreResult, ...rest }) => {
                      if (!fetchMoreResult) return prev;
                      return {
                        ...fetchMoreResult,
                        launches: {
                          ...fetchMoreResult.launches,
                          launches: [
                            ...prev.launches.launches,
                            ...fetchMoreResult.launches.launches
                          ]
                        }
                      };
                    }
                  })
                }
              >
                Load More
              </Button>
            )}
          </>
        );
      }}
    </Query>
  );
};
