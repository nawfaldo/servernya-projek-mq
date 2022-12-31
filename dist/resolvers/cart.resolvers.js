"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartResolvers = void 0;
const database_1 = require("./../utils/database");
const Query = {
    myCart: async (parent, args, { req }) => {
        const cart = await database_1.prisma.cart.findUnique({
            where: {
                userId: req.session.userId,
            },
        });
        const cartItems = await database_1.prisma.cartItem.findMany({
            where: {
                cartId: cart === null || cart === void 0 ? void 0 : cart.id,
            },
        });
        const getRestaurant = async (restaurantId) => {
            const restaurant = await database_1.prisma.restaurant.findUnique({
                where: {
                    id: restaurantId,
                },
            });
            return restaurant;
        };
        cartItems.every((o) => (o.restaurant = getRestaurant(o.restaurantId)));
        const getItem = async (itemId) => {
            const item = await database_1.prisma.restaurantItem.findUnique({
                where: {
                    id: itemId,
                },
            });
            return item;
        };
        cartItems.every((o) => (o.item = getItem(o.itemId)));
        let totalPrice = [];
        cartItems.every((o) => totalPrice.push(o.subPrice));
        const sum = totalPrice.reduce((partialSum, a) => partialSum + a, 0);
        return {
            id: cart === null || cart === void 0 ? void 0 : cart.id,
            totalPrice: sum,
            cartItem: cartItems,
        };
    },
};
const Mutation = {
    addToCart: async (parent, args, { req }) => {
        const cartItem = await database_1.prisma.cartItem.create({
            data: {
                subPrice: args.price,
                quantity: 1,
                restaurant: {
                    connect: {
                        id: args.restaurantId,
                    },
                },
                item: {
                    connect: {
                        id: args.itemId,
                    },
                },
                cart: {
                    connect: {
                        userId: req.session.userId,
                    },
                },
            },
        });
        return cartItem;
    },
    removeFromCart: async (parent, args, { req }) => {
        const cartItem = await database_1.prisma.cartItem.deleteMany({
            where: {
                cart: {
                    userId: req.session.userId,
                },
                itemId: args.itemId,
                restaurantId: args.restaurantId,
            },
        });
        return cartItem;
    },
    increaseQuantity: async (parent, args, { req }) => {
        const cartItem = await database_1.prisma.cartItem.update({
            where: {
                id: args.cartItemId,
            },
            data: {
                subPrice: {
                    increment: args.price,
                },
                quantity: {
                    increment: 1,
                },
            },
        });
        return cartItem;
    },
    decreaseQuantity: async (parent, args, { req }) => {
        const cartItem = await database_1.prisma.cartItem.update({
            where: {
                id: args.cartItemId,
            },
            data: {
                subPrice: {
                    decrement: args.price,
                },
                quantity: {
                    decrement: 1,
                },
            },
        });
        return cartItem;
    },
    pay: async (parent, args, { req }) => {
        const user = await database_1.prisma.user.findUnique({
            where: {
                id: req.session.userId,
            },
        });
        if (!user) {
            return null;
        }
        const receipt = await database_1.prisma.receipt.create({
            data: {
                totalPrice: args.totalPrice,
                userId: user.id,
                userName: user.name,
            },
        });
        const createReceiptItem = async (o) => {
            await database_1.prisma.receiptItem.create({
                data: {
                    quantity: o.quantity,
                    subPrice: o.subPrice,
                    pricePerItem: o.pricePerItem,
                    expired: o.expired,
                    restaurantId: o.restaurantId,
                    restaurantName: o.restaurantName,
                    itemId: o.itemId,
                    itemName: o.itemName,
                    receipt: {
                        connect: {
                            id: receipt.id,
                        },
                    },
                },
            });
        };
        args.receiptItem.every((o) => createReceiptItem(o));
        const updateRestaurantItem = async (itemId, quantity) => {
            await database_1.prisma.restaurantItem.updateMany({
                where: {
                    id: itemId,
                },
                data: {
                    stock: {
                        decrement: quantity,
                    },
                },
            });
        };
        args.receiptItem.every((o) => updateRestaurantItem(o.itemId, o.quantity));
        const deleteCartItem = async (id) => {
            await database_1.prisma.cartItem.deleteMany({
                where: {
                    id: id,
                },
            });
        };
        args.receiptItem.every((o) => deleteCartItem(o.id));
        return receipt;
    },
};
exports.cartResolvers = { Query, Mutation };
//# sourceMappingURL=cart.resolvers.js.map