import { DataSource, DataSourceConfig } from "apollo-datasource";
import isEmail from "isemail";
import { IStore, IUser, ITrip } from "../interfaces";
import { Context } from "apollo-server-core";

export class UserAPI extends DataSource {
  private store: IStore;
  private context: Context;

  constructor({ store }: { store: IStore }) {
    super();
    this.store = store;
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  initialize(config: DataSourceConfig<IUser>): void {
    this.context = config.context;
  }

  /**
   * User can be called with an argument that includes email, but it doesn't
   * have to be. If the user is already on the context, it will use that user
   * instead
   */
  async findOrCreateUser({ email: emailArg }: { email?: string } = {}) {
    const email =
      this.context && this.context.user ? this.context.user.email : emailArg;
    if (!email || !isEmail.validate(email)) return null;

    const users = await this.store.users.findOrCreate({ where: { email } });
    return users && users[0] ? users[0] : null;
  }

  async bookTrips({
    launchIds
  }: {
    launchIds: number[];
  }): Promise<(number | null)[]> {
    const userId = this.context.user.id;
    if (!userId) Promise.reject();

    let results = [];

    // for each launch id, try to book the trip and add it to the results array
    // if successful
    for (const launchId of launchIds) {
      const res = await this.bookTrip({ launchId });
      if (res) results.push(res);
    }

    return results;
  }

  async bookTrip({ launchId }: { launchId: number }): Promise<number | null> {
    const userId = this.context.user.id;
    const res = await this.store.trips.findOrCreate({
      where: { userId, launchId }
    });
    return res && res.length ? res[0].get("id") : null;
  }

  async cancelTrip({ launchId }: { launchId: number }): Promise<boolean> {
    const userId = this.context.user.id;
    return !!this.store.trips.destroy({ where: { userId, launchId } });
  }

  async getLaunchIdsByUser(): Promise<number[]> {
    const userId = this.context.user.id;
    const found = await this.store.trips.findAll({
      where: { userId }
    });
    return found && found.length
      ? found
          .map(launch => /*launch.dataValues.launchId*/ launch.launchId)
          .filter(launch => !!launch)
      : [];
  }

  async isBookedOnLaunch({ launchId }: { launchId: number }): Promise<boolean> {
    if (!this.context || !this.context.user) return false;
    const userId = this.context.user.id;
    const found = await this.store.trips.findAll({
      where: { userId, launchId }
    });
    return found && found.length > 0;
  }
}
