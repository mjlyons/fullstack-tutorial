import { RESTDataSource } from "apollo-datasource-rest";
import { IRESTLaunch, IGqlLaunch } from "../interfaces";

export class LaunchAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://api.spacexdata.com/v2/";
  }

  public async getAllLaunches(): Promise<IGqlLaunch[]> {
    const res = await this.get("launches");
    return res && res.length
      ? res.map((launch: IRESTLaunch) => this.launchReducer(launch))
      : [];
  }

  public async getLaunchById({
    launchId
  }: {
    launchId: number;
  }): Promise<IGqlLaunch> {
    const res = await this.get("launches", { flight_number: launchId });
    return this.launchReducer(res[0]);
  }

  public getLaunchesByIds({
    launchIds
  }: {
    launchIds: number[];
  }): Promise<IGqlLaunch[]> {
    return Promise.all<IGqlLaunch>(
      launchIds.map((launchId: number) => this.getLaunchById({ launchId }))
    );
  }

  private launchReducer(launch: IRESTLaunch): IGqlLaunch {
    return {
      id: launch.flight_number || 0,
      cursor: `${launch.launch_date_unix}`,
      site: launch.launch_site && launch.launch_site.site_name,
      mission: {
        name: launch.mission_name,
        missionPatchSmall: launch.links.mission_patch_small,
        missionPatchLarge: launch.links.mission_patch
      },
      rocket: {
        id: launch.rocket.rocket_id,
        name: launch.rocket.rocket_name,
        type: launch.rocket.rocket_type
      }
    };
  }
}
