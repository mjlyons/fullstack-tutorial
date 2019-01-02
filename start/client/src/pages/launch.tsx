import React, { Fragment } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import Loading from "../components/loading";
import Header from "../components/header";
import ActionButton from "../containers/action-button";
import LaunchDetail from "../components/launch-detail";
import { GET_LAUNCH_DETAILS, LAUNCH_TILE_DATA } from "../graphql";

interface IProps {
  path: string;
  launchId?: string;
}
export default ({ launchId }: IProps): JSX.Element => (
  <Query query={GET_LAUNCH_DETAILS} variables={{ launchId }}>
    {({ data, loading, error }) => {
      if (loading) return <Loading />;
      if (error) return <p>ERROR: {error.message}</p>;

      return (
        <>
          <Header image={data.launch.mission.missionPatch}>
            {data.launch.mission.name}
          </Header>
          <LaunchDetail {...data.launch} />
          <ActionButton {...data.launch} />
        </>
      );
    }}
  </Query>
);
