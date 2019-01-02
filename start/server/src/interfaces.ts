import SQL from "sequelize";

export interface IContext {
  headers: any;
  user: IUser | null;
}

export interface IStore {
  users: SQL.Model<UserInstance, IUser>;
  trips: TripModel;
}

export interface IUser {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  token: string;
}

export type UserInstance = SQL.Instance<IUser> & IUser;
export type UserModel = SQL.Model<UserInstance, IUser>;

export interface ITrip {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  launchId: number;
  userId: number;
}

export type TripInstance = SQL.Instance<ITrip> & ITrip;
export type TripModel = SQL.Model<TripInstance, ITrip>;

export interface IRESTLaunch {
  flight_number?: number;
  launch_date_unix: number;
  launch_site?: IRESTLaunchSite;
  mission_name: string;
  links: IRESTLaunchLinks;
  rocket: IRESTRocket;
}

interface IRESTLaunchSite {
  site_name: string;
}

interface IRESTLaunchLinks {
  mission_patch_small: string;
  mission_patch: string;
}

interface IRESTRocket {
  rocket_id: string;
  rocket_name: string;
  rocket_type: string;
}

export interface IGqlLaunch {
  id: number;
  cursor: string;
  site?: string;
  mission: IGqlMission;
  rocket: IGqlRocket;
}

export interface IGqlRocket {
  id: string;
  name: string;
  type: string;
}

export interface IGqlMission {
  name: string;
  missionPatchSmall: string;
  missionPatchLarge: string;
}

export enum MissionPatchSize {
  LARGE = "LARGE",
  SMALL = "SMALL"
}

export interface IGqlPaginatedLaunches {
  launches: IGqlLaunch[];
  cursor: string | null;
  hasMore: boolean;
}

export interface ITripMutationResponse {
  success: boolean;
  message: string;
  launches?: IGqlLaunch[];
}
