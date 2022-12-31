"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./utils/constants");
const index_1 = __importDefault(require("./resolvers/index"));
const index_2 = __importDefault(require("./schema/index"));
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
    app.use(session({
        name: constants_1.COOKIE_NAME,
        store: new RedisStore({
            client: redis,
            disableTouch: true,
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
            httpOnly: true,
            sameSite: "lax",
            secure: constants_1.__prod__,
        },
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET,
        resave: false,
    }));
    const apolloServer = new ApolloServer({
        resolvers: index_1.default,
        typeDefs: index_2.default,
        context: ({ req, res }) => ({
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
//# sourceMappingURL=index.js.map