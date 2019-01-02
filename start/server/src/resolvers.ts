import { DataSources } from "apollo-server-core/dist/graphqlOptions";
import {
  IGqlLaunch,
  IUser,
  IGqlPaginatedLaunches,
  IGqlMission,
  MissionPatchSize,
  ITripMutationResponse
} from "./interfaces";
import { LaunchAPI } from "./datasources/launch";
import { UserAPI } from "./datasources/user";
import { IResolvers, IResolverObject } from "graphql-tools";
import { paginateResults } from "./utils";

interface IContext {
  dataSources: IDataSources;
}

interface IDataSources {
  launchAPI: LaunchAPI;
  userAPI: UserAPI;
}

export const resolvers: IResolvers = {
  Query: {
    launches: async (
      _: any,
      { pageSize = 20, after }: { pageSize?: number; after?: string },
      { dataSources }: IContext,
      ___: any
    ): Promise<IGqlPaginatedLaunches> => {
      const allLaunches = await dataSources.launchAPI.getAllLaunches();
      // we want these in reverse cronological order
      allLaunches.reverse();

      const launches = paginateResults({
        after,
        pageSize,
        results: allLaunches
      });

      return {
        launches,
        cursor: launches.length ? launches[launches.length - 1].cursor : null,
        hasMore: launches.length
          ? launches[launches.length - 1].cursor !==
            allLaunches[allLaunches.length - 1].cursor
          : false
      };
    },

    launch: async (
      _: any,
      { id }: { id?: number },
      { dataSources }: IContext
    ): Promise<IGqlLaunch | null> =>
      !!id ? dataSources.launchAPI.getLaunchById({ launchId: id }) : null,

    me: async (
      _: any,
      __: any,
      { dataSources }: IContext,
      ___: any
    ): Promise<IUser | null> => dataSources.userAPI.findOrCreateUser()
  },

  Mutation: {
    login: async (
      _: any,
      { email }: { email?: string },
      { dataSources }: IContext
    ): Promise<string | null> => {
      if (!email) {
        return null;
      }
      const user = await dataSources.userAPI.findOrCreateUser({ email });
      return !!user ? new Buffer(email).toString("base64") : null;
    },

    bookTrips: async (
      _: any,
      { launchIds }: { launchIds?: number[] },
      { dataSources }: IContext
    ): Promise<ITripMutationResponse> => {
      if (!launchIds) {
        return {
          success: false,
          message: "launchIds not provided"
        };
      }
      const results = await dataSources.userAPI.bookTrips({ launchIds });
      const launches = await dataSources.launchAPI.getLaunchesByIds({
        launchIds
      });

      return {
        success: results && results.length === launchIds.length,
        message:
          results.length === launchIds.length
            ? "trips booked successfullly"
            : `the following launches couldn't be booked ${launchIds.filter(
                id => !results.includes(id)
              )}`,
        launches
      };
    },

    cancelTrip: async (
      _: any,
      { launchId }: { launchId?: number },
      { dataSources }: IContext
    ): Promise<ITripMutationResponse> => {
      if (!launchId) {
        return {
          success: false,
          message: "launchId not provided"
        };
      }
      const result = dataSources.userAPI.cancelTrip({ launchId });
      if (!result) {
        return {
          success: false,
          message: "failed to cancel trip"
        };
      }

      const launch = await dataSources.launchAPI.getLaunchById({ launchId });
      return {
        success: true,
        message: "trip cancelled",
        launches: [launch]
      };
    }
  },

  Mission: {
    // make sure the default size is 'large' in case the user doesn't specify
    missionPatch: (
      mission: IGqlMission,
      { size }: { size?: MissionPatchSize } = { size: MissionPatchSize.LARGE },
      _: any,
      __: any
    ) => {
      return size === "SMALL"
        ? mission.missionPatchSmall
        : mission.missionPatchLarge;
    }
  },

  Launch: {
    isBooked: async (
      launch: IGqlLaunch,
      _: any,
      { dataSources }: IContext,
      __: any
    ) => dataSources.userAPI.isBookedOnLaunch({ launchId: launch.id })
  },

  User: {
    trips: async (_: any, __: any, { dataSources }: IContext, ___: any) => {
      // get ids of launches by user
      const launchIds = await dataSources.userAPI.getLaunchIdsByUser();

      if (!launchIds.length) return [];

      // look up those launches by the their ids
      return dataSources.launchAPI.getLaunchesByIds({ launchIds }) || [];
    }
  }
};
