import { COOKIE_NAME, __prod__ } from "./utils/constants";
import resolvers from "./resolvers/index";
import typeDefs from "./schema/index";
const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const session = require("express-session");
const Redis = require("ioredis");
const connectRedis = require("connect-redis");
const cors = require("cors");

const main = async () => {
  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();

  // app.set("trust proxy", 1);
  // app.use(
  //   cors({
  //     origin: ["http://localhost:3000", "http://localhost:8081"],
  //     credentials: true,
  //   })
  // );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    resolvers,
    typeDefs,
    context: ({ req, res }: any) => ({
      req,
      res,
      redis,
    }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: true,
      credentials: true,
    },
  });

  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

main().catch((err) => {
  console.error(err);
});
