"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restaurantResolvers = void 0;
const database_1 = require("./../utils/database");
const Query = {
    home: async (parent, args, { req }) => {
        const restaurants = await database_1.prisma.restaurant.findMany({});
        const getTypes = async (id) => {
            const type = await database_1.prisma.restaurantType.findMany({
                where: {
                    restaurants: {
                        some: {
                            restaurantId: id,
                        },
                    },
                },
            });
            return type;
        };
        restaurants.every((o) => (o.type = getTypes(o.id)));
        const getItems = async (id) => {
            const item = await database_1.prisma.restaurantItem.findMany({
                take: 7,
                where: {
                    restaurantId: id,
                },
            });
            return item;
        };
        restaurants.every((o) => (o.item = getItems(o.id)));
        return restaurants;
    },
    search: async (parent, args, { req }) => {
        const restaurants = await database_1.prisma.restaurant.findMany({
            where: {
                name: {
                    contains: args.name,
                },
            },
        });
        const getTypes = async (id) => {
            const type = await database_1.prisma.restaurantType.findMany({
                where: {
                    restaurants: {
                        some: {
                            restaurantId: id,
                        },
                    },
                },
            });
            return type;
        };
        restaurants.every((o) => (o.type = getTypes(o.id)));
        const getItems = async (id) => {
            const item = await database_1.prisma.restaurantItem.findMany({
                take: 7,
                where: {
                    restaurantId: id,
                },
            });
            return item;
        };
        restaurants.every((o) => (o.item = getItems(o.id)));
        return restaurants;
    },
    detail: async (parent, args, { req }) => {
        const restaurant = await database_1.prisma.restaurant.findUnique({
            where: {
                id: args.id,
            },
        });
        const types = await database_1.prisma.restaurantType.findMany({
            where: {
                restaurants: {
                    some: {
                        restaurantId: args.id,
                    },
                },
            },
        });
        const items = await database_1.prisma.restaurantItem.findMany({
            where: {
                restaurantId: args.id,
            },
        });
        const getItemType = async (id) => {
            const type = await database_1.prisma.restaurantItemType.findUnique({
                where: {
                    id: id,
                },
            });
            return type;
        };
        items.every((o) => (o.type = getItemType(o.typeId)));
        if (req.session.userId) {
            const getIsItemAddedToCart = async (id) => {
                const cart = await database_1.prisma.cart.findUnique({
                    where: {
                        userId: req.session.userId,
                    },
                });
                const cartItem = await database_1.prisma.cartItem.findFirst({
                    where: {
                        itemId: id,
                        cartId: cart === null || cart === void 0 ? void 0 : cart.id,
                    },
                });
                if (cartItem) {
                    return true;
                }
                return false;
            };
            items.every((o) => (o.isAddedToCart = getIsItemAddedToCart(o.id)));
        }
        const restaurantOrganizer = await database_1.prisma.restaurantOrganizer.findMany({
            where: {
                restaurantId: args.id,
            },
        });
        const getRole = async (id) => {
            const user = await database_1.prisma.restaurantOrganizerRole.findUnique({
                where: {
                    id: id,
                },
            });
            return user;
        };
        await restaurantOrganizer.every((o) => (o.role = getRole(o.roleId)));
        const getUser = async (id) => {
            const user = await database_1.prisma.user.findUnique({
                where: {
                    id: id,
                },
            });
            return user;
        };
        await restaurantOrganizer.every((o) => (o.user = getUser(o.userId)));
        return {
            id: restaurant === null || restaurant === void 0 ? void 0 : restaurant.id,
            name: restaurant === null || restaurant === void 0 ? void 0 : restaurant.name,
            image: restaurant === null || restaurant === void 0 ? void 0 : restaurant.image,
            banner: restaurant === null || restaurant === void 0 ? void 0 : restaurant.banner,
            description: restaurant === null || restaurant === void 0 ? void 0 : restaurant.description,
            type: types,
            item: items,
            organizer: restaurantOrganizer,
        };
    },
    getRestaurantTypes: async (parent, args, { req }) => {
        const result = await database_1.prisma.restaurantType.findMany({});
        return result;
    },
    getRestaurantItemsByRestaurantId: async (parent, args, { req }) => {
        const items = await database_1.prisma.restaurantItem.findMany({
            where: {
                restaurantId: args.id,
            },
            orderBy: {
                price: args.price ? args.price : undefined,
                stock: args.stock ? args.stock : undefined,
                expired: args.expired ? args.expired : undefined,
            },
        });
        const getUser = async (id) => {
            const restaurantOrganizer = await database_1.prisma.restaurantOrganizer.findUnique({
                where: {
                    id: id,
                },
            });
            const user = await database_1.prisma.user.findUnique({
                where: {
                    id: restaurantOrganizer === null || restaurantOrganizer === void 0 ? void 0 : restaurantOrganizer.userId,
                },
            });
            const role = await database_1.prisma.restaurantOrganizerRole.findUnique({
                where: {
                    id: restaurantOrganizer === null || restaurantOrganizer === void 0 ? void 0 : restaurantOrganizer.roleId,
                },
            });
            return {
                id: restaurantOrganizer === null || restaurantOrganizer === void 0 ? void 0 : restaurantOrganizer.id,
                name: user === null || user === void 0 ? void 0 : user.name,
                role: role === null || role === void 0 ? void 0 : role.name,
            };
        };
        items.every((o) => (o.user = getUser(o.userId)));
        const getType = async (id) => {
            const type = await database_1.prisma.restaurantItemType.findUnique({
                where: {
                    id: id,
                },
            });
            return type;
        };
        items.every((o) => (o.type = getType(o.typeId)));
        return items;
    },
    getRestaurantItemTypes: async (parent, args, { req }) => {
        const result = await database_1.prisma.restaurantItemType.findMany({});
        return result;
    },
    getRestaurants: async (parent, args, { req }) => {
        const restaurants = await database_1.prisma.restaurant.findMany({});
        const getRole = async (id) => {
            const types = await database_1.prisma.restaurantType.findMany({
                where: {
                    restaurants: {
                        some: {
                            restaurantId: id === null || id === void 0 ? void 0 : id.id,
                        },
                    },
                },
            });
            return types;
        };
        await restaurants.every((o) => (o.type = getRole(o.id)));
        return restaurants;
    },
    getRestaurantsOrganizedByMe: async (parent, args, { req }) => {
        const restaurantsOrganizedByMe = await database_1.prisma.restaurantOrganizer.findMany({
            where: {
                userId: req.session.userId,
            },
        });
        const getRole = async (roleId) => {
            const role = await database_1.prisma.restaurantOrganizerRole.findUnique({
                where: {
                    id: roleId,
                },
            });
            return role;
        };
        await restaurantsOrganizedByMe.every((o) => (o.role = getRole(o.roleId)));
        const getRestaurant = async (restaurantId) => {
            let restaurant = await database_1.prisma.restaurant.findUnique({
                where: {
                    id: restaurantId,
                },
            });
            const type = await database_1.prisma.restaurantType.findMany({
                where: {
                    restaurants: {
                        some: {
                            restaurantId: restaurant === null || restaurant === void 0 ? void 0 : restaurant.id,
                        },
                    },
                },
            });
            return {
                id: restaurant === null || restaurant === void 0 ? void 0 : restaurant.id,
                name: restaurant === null || restaurant === void 0 ? void 0 : restaurant.name,
                image: restaurant === null || restaurant === void 0 ? void 0 : restaurant.image,
                banner: restaurant === null || restaurant === void 0 ? void 0 : restaurant.banner,
                description: restaurant === null || restaurant === void 0 ? void 0 : restaurant.description,
                type: type,
            };
        };
        await restaurantsOrganizedByMe.every((o) => (o.restaurant = getRestaurant(o.restaurantId)));
        const getAssignments = await database_1.prisma.typesOnRestaurants.findMany({
            where: {
                restaurant: {
                    id: "339a4537-aaa5-4c3d-86c6-4d33837aebfe",
                },
            },
        });
        return restaurantsOrganizedByMe;
    },
    getRestaurantById: async (parent, args, { req }) => {
        const restaurant = await database_1.prisma.restaurant.findUnique({
            where: {
                id: args.id,
            },
        });
        const type = await database_1.prisma.restaurantType.findMany({
            where: {
                restaurants: {
                    some: {
                        restaurantId: restaurant === null || restaurant === void 0 ? void 0 : restaurant.id,
                    },
                },
            },
        });
        return {
            id: restaurant === null || restaurant === void 0 ? void 0 : restaurant.id,
            name: restaurant === null || restaurant === void 0 ? void 0 : restaurant.name,
            image: restaurant === null || restaurant === void 0 ? void 0 : restaurant.image,
            banner: restaurant === null || restaurant === void 0 ? void 0 : restaurant.banner,
            description: restaurant === null || restaurant === void 0 ? void 0 : restaurant.description,
            type: type,
        };
    },
    getRestaurantOrganizerById: async (parent, args, { req }) => {
        const restaurantOrganizer = await database_1.prisma.restaurantOrganizer.findMany({
            where: {
                restaurantId: args.id,
            },
        });
        const getRole = async (id) => {
            const user = await database_1.prisma.restaurantOrganizerRole.findUnique({
                where: {
                    id: id,
                },
            });
            return user;
        };
        await restaurantOrganizer.every((o) => (o.role = getRole(o.roleId)));
        const getUser = async (id) => {
            const user = await database_1.prisma.user.findUnique({
                where: {
                    id: id,
                },
            });
            return user;
        };
        await restaurantOrganizer.every((o) => (o.user = getUser(o.userId)));
        return restaurantOrganizer;
    },
    getRestaurantOrganizerRoles: async (parent, args, { req }) => {
        const roles = await database_1.prisma.restaurantOrganizerRole.findMany({});
        return roles;
    },
};
const Mutation = {
    addRestaurant: async (parent, args, { req }) => {
        const array = [];
        await args.types.every((o) => array.push({ restaurantType: { connect: { name: o.name } } }));
        const restaurant = await database_1.prisma.restaurant.create({
            data: {
                name: args.name,
                image: args.image,
                banner: args.banner,
                description: args.description,
                types: {
                    create: array,
                },
            },
        });
        const owner = await database_1.prisma.restaurantOrganizer.create({
            data: {
                role: {
                    connect: {
                        name: "owner",
                    },
                },
                restaurant: {
                    connect: {
                        id: restaurant.id,
                    },
                },
                user: {
                    connect: {
                        id: req.session.userId,
                    },
                },
            },
        });
        return restaurant;
    },
    editRestaurant: async (parent, args, { req }) => {
        if (args.types != undefined && args.types.length != 0) {
            await database_1.prisma.typesOnRestaurants.deleteMany({
                where: {
                    restaurantId: args.id,
                },
            });
            let array = [];
            await args.types.every((o) => array.push({ restaurantType: { connect: { name: o.name } } }));
            const restaurant = await database_1.prisma.restaurant.update({
                where: {
                    id: args.id,
                },
                data: {
                    types: {
                        create: array,
                    },
                },
            });
        }
        const restaurant = await database_1.prisma.restaurant.update({
            where: {
                id: args.id,
            },
            data: {
                name: !args.name ? undefined : args.name,
                image: !args.image ? undefined : args.image,
                banner: !args.banner ? undefined : args.banner,
                description: !args.description ? undefined : args.description,
            },
        });
        return restaurant;
    },
    createOrganizer: async (parent, args, { req }) => {
        const organizer = await database_1.prisma.restaurantOrganizer.create({
            data: {
                role: {
                    connect: {
                        name: args.role,
                    },
                },
                restaurant: {
                    connect: {
                        id: args.restaurantId,
                    },
                },
                user: {
                    connect: {
                        id: args.userId,
                    },
                },
            },
        });
        return organizer;
    },
    deleteOrganizer: async (parent, args, { req }) => {
        const organizer = await database_1.prisma.restaurantOrganizer.delete({
            where: {
                id: args.id,
            },
        });
        return organizer;
    },
    createRestaurantType: async (parent, args, { req }) => {
        const type = await database_1.prisma.restaurantType.create({
            data: {
                name: args.name,
            },
        });
        return type;
    },
    deleteRestaurantType: async (parent, args, { req }) => {
        await database_1.prisma.typesOnRestaurants.deleteMany({
            where: {
                restaurantTypeId: args.id,
            },
        });
        const type = await database_1.prisma.restaurantType.delete({
            where: {
                id: args.id,
            },
        });
        return type;
    },
    createItem: async (parent, args, { req }) => {
        const user = await database_1.prisma.restaurantOrganizer.findFirst({
            where: {
                userId: req.session.userId,
                restaurantId: args.restaurantId,
            },
        });
        const item = await database_1.prisma.restaurantItem.create({
            data: {
                name: args.name,
                description: args.description,
                image: args.image,
                price: args.price,
                stock: args.stock,
                expired: args.expired,
                user: {
                    connect: {
                        id: user === null || user === void 0 ? void 0 : user.id,
                    },
                },
                type: {
                    connect: {
                        id: args.typeId,
                    },
                },
                restaurant: {
                    connect: {
                        id: args.restaurantId,
                    },
                },
            },
        });
        return item;
    },
    editItem: async (parent, args, { req }) => {
        const item = await database_1.prisma.restaurantItem.update({
            where: {
                id: args.id,
            },
            data: {
                image: args.image ? args.image : undefined,
                name: args.name ? args.name : undefined,
                price: args.price ? args.price : undefined,
                expired: args.expired ? args.expired : undefined,
                stock: args.stock ? args.stock : undefined,
            },
        });
        if (args.typeId !== undefined) {
            await database_1.prisma.restaurantItem.update({
                where: {
                    id: args.id,
                },
                data: {
                    type: {
                        connect: {
                            id: args.typeId,
                        },
                    },
                },
            });
        }
        if (args.price !== undefined) {
            const cartItems = await database_1.prisma.cartItem.findMany({
                where: {
                    item: {
                        id: args.id,
                    },
                },
            });
            const updateCartItem = async (id, quantity) => {
                await database_1.prisma.cartItem.update({
                    where: {
                        id: id,
                    },
                    data: {
                        subPrice: args.price * quantity,
                    },
                });
            };
            cartItems.every((o) => updateCartItem(o.id, o.quantity));
        }
        return item;
    },
    deleteItem: async (parent, args, { req }) => {
        const item = await database_1.prisma.restaurantItem.delete({
            where: {
                id: args.id,
            },
        });
        return item;
    },
};
exports.restaurantResolvers = { Query, Mutation };
//# sourceMappingURL=restaurant.resolvers.js.map