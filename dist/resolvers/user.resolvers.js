"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userResolvers = void 0;
const database_js_1 = require("../utils/database.js");
const uuid_1 = require("uuid");
const constants_js_1 = require("../utils/constants.js");
const sendEmail_js_1 = require("../utils/sendEmail.js");
const Query = {
    me: async (parent, args, { req }) => {
        const user = await database_js_1.prisma.user.findUnique({
            where: {
                id: req.session.userId,
            },
        });
        const userRole = await database_js_1.prisma.userRole.findUnique({
            where: {
                id: user === null || user === void 0 ? void 0 : user.roleId,
            },
        });
        let restRole = null;
        if (args.restaurantId) {
            const restaurant = await database_js_1.prisma.restaurantOrganizer.findFirst({
                where: {
                    userId: req.session.userId,
                    restaurantId: args.restaurantId,
                },
            });
            const restaurantRole = await database_js_1.prisma.restaurantOrganizerRole.findUnique({
                where: {
                    id: restaurant === null || restaurant === void 0 ? void 0 : restaurant.roleId,
                },
            });
            restRole = {
                id: restaurantRole === null || restaurantRole === void 0 ? void 0 : restaurantRole.id,
                name: restaurantRole === null || restaurantRole === void 0 ? void 0 : restaurantRole.name,
            };
        }
        return {
            id: user === null || user === void 0 ? void 0 : user.id,
            name: user === null || user === void 0 ? void 0 : user.name,
            image: user === null || user === void 0 ? void 0 : user.image,
            email: user === null || user === void 0 ? void 0 : user.email,
            userRole: userRole,
            restaurantRole: args.restaurantId ? restRole : null,
        };
    },
    getUsers: async (parent, args, { req }) => {
        const users = await database_js_1.prisma.user.findMany({});
        const getUserRole = async (id) => {
            const role = await database_js_1.prisma.userRole.findUnique({
                where: {
                    id: id,
                },
            });
            return role;
        };
        users.every((user) => (user.userRole = getUserRole(user.roleId)));
        return users;
    },
    getUserRoles: async (parent, args, { req }) => {
        const roles = await database_js_1.prisma.userRole.findMany({});
        return roles;
    },
};
const Mutation = {
    register: async (parent, args, { req }) => {
        const userId = (0, uuid_1.v4)();
        req.session.userId = userId;
        const user = await database_js_1.prisma.user.create({
            data: {
                id: userId,
                name: args.name,
                email: args.email,
                password: args.password,
                role: {
                    connect: {
                        name: "normie",
                    },
                },
            },
        });
        await database_js_1.prisma.cart.create({
            data: {
                user: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });
        return user;
    },
    login: async (parent, args, { req }) => {
        const user = await database_js_1.prisma.user.findUnique({
            where: {
                email: args.email,
            },
        });
        if (!user) {
            throw new Error("User Not Found");
        }
        if (args.password != user.password) {
            throw new Error("Wrong Password");
        }
        req.session.userId = user.id;
        return user;
    },
    logout: (parent, args, { req, res }) => {
        res.clearCookie(constants_js_1.COOKIE_NAME);
        return { id: "removed" };
    },
    forgotPassword: async (parent, args, { req, res, redis }) => {
        const user = await database_js_1.prisma.user.findUnique({
            where: {
                email: args.email,
            },
        });
        if (!user) {
            throw new Error("User Not Found");
        }
        const token = (0, uuid_1.v4)();
        await redis.set(constants_js_1.FORGET_PASSWORD_PREFIX + token, user.id, "ex", 1000 * 60 * 60 * 24 * 3);
        await (0, sendEmail_js_1.sendEmail)(args.email, `<a href="http://localhost:3000/change-password/${token}">reset password</a>`);
        return user;
    },
    changePassword: async (parent, args, { req, res, redis }) => {
        const key = constants_js_1.FORGET_PASSWORD_PREFIX + args.token;
        const userId = await redis.get(key);
        if (!userId) {
            throw new Error("UserId Not Found");
        }
        const user = await database_js_1.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!userId) {
            throw new Error("User Not Found");
        }
        const updateUser = await database_js_1.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                password: args.password,
            },
        });
        await redis.del(key);
        req.session.userId = user === null || user === void 0 ? void 0 : user.id;
        return updateUser;
    },
    editUser: async (parent, args, { req }) => {
        const user = await database_js_1.prisma.user.update({
            where: {
                id: !args.id ? req.session.userId : args.id,
            },
            data: {
                image: !args.image ? undefined : args.image,
                name: !args.name ? undefined : args.name,
                email: !args.email ? undefined : args.email,
            },
        });
        if (args.role !== undefined) {
            await database_js_1.prisma.user.update({
                where: {
                    id: !args.id ? req.session.userId : args.id,
                },
                data: {
                    role: {
                        connect: {
                            name: args.role,
                        },
                    },
                },
            });
        }
        return user;
    },
    createUser: async (parent, args, { req }) => {
        const userId = (0, uuid_1.v4)();
        const user = await database_js_1.prisma.user.create({
            data: {
                id: userId,
                image: args.image,
                name: args.name,
                email: args.email,
                password: args.password,
                role: {
                    connect: {
                        name: args.role,
                    },
                },
            },
        });
        await database_js_1.prisma.cart.create({
            data: {
                user: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });
        return user;
    },
    deleteUser: async (parent, args, { req }) => {
        const user = await database_js_1.prisma.user.delete({
            where: {
                id: args.id,
            },
        });
        return user;
    },
};
exports.userResolvers = { Query, Mutation };
//# sourceMappingURL=user.resolvers.js.map