import React from "react";
import styled from "react-emotion";

import { unit } from "../styles";
import { cardClassName, getBackgroundImage } from "./launch-tile";
import { IRocket } from "../interfaces";

const LaunchDetail = ({
  id,
  site,
  rocket
}: {
  id: number;
  site: string;
  rocket: IRocket;
}): JSX.Element => (
  <Card
    style={{
      backgroundImage: getBackgroundImage(id)
    }}
  >
    <h3>
      {rocket.name} ({rocket.type})
    </h3>
    <h5>{site}</h5>
  </Card>
);

/**
 * STYLED COMPONENTS USED IN THIS FILE ARE BELOW HERE
 */

const Card = styled("div")(cardClassName, {
  height: 365,
  marginBottom: unit * 4
});

export default LaunchDetail;
