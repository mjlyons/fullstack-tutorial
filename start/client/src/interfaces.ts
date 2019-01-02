export interface ILaunch {
  id: number;
  cursor: string;
  site?: string;
  mission: IMission;
  rocket: IRocket;
}

export interface IRocket {
  id: string;
  name: string;
  type: string;
}

export interface IMission {
  name: string;
  missionPatchSmall: string;
  missionPatchLarge: string;
}

export enum MissionPatchSize {
  LARGE = "LARGE",
  SMALL = "SMALL"
}
