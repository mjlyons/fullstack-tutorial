import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schema";
import { LaunchAPI } from "./datasources/launch";
import { UserAPI } from "./datasources/user";
import { createStore } from "./utils";
import { resolvers } from "./resolvers";
import isEmail from "isemail";
import { IContext } from "./interfaces";

const store = createStore();

const server = new ApolloServer({
  context: async ({ req }: { req: IContext }): Promise<Partial<IContext>> => {
    // simple auth check on every request
    const auth = (req.headers && req.headers.authorization) || "";
    const email = new Buffer(auth, "base64").toString("ascii");

    // if the email isn't valid, return null for user
    if (!isEmail.validate(email)) return { user: null };
    // find a user by their email
    const users = await store.users.findOrCreate({ where: { email } });
    const user = users && users[0] ? users[0] : null;
    if (!user) {
      return { user: null };
    }

    return { user: { ...user.get({ plain: true }) } };
  },

  typeDefs,
  resolvers,
  dataSources: () => ({
    launchAPI: new LaunchAPI(),
    userAPI: new UserAPI({ store })
  }),
  debug: true
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
