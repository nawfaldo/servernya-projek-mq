import { prisma } from "./../utils/database";
import { v4 } from "uuid";
import { MyContext } from "../utils/types.js";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../utils/constants.js";
import { sendEmail } from "../utils/sendEmail.js";

const Query = {
  myCart: async (parent: any, args: any, { req }: MyContext) => {
    const cart = await prisma.cart.findUnique({
      where: {
        userId: req.session.userId,
      },
    });

    const cartItems = await prisma.cartItem.findMany({
      where: {
        cartId: cart?.id,
      },
    });

    const getRestaurant = async (restaurantId: any) => {
      const restaurant = await prisma.restaurant.findUnique({
        where: {
          id: restaurantId,
        },
      });
      return restaurant;
    };

    cartItems.every((o: any) => (o.restaurant = getRestaurant(o.restaurantId)));

    const getItem = async (itemId: any) => {
      const item = await prisma.restaurantItem.findUnique({
        where: {
          id: itemId,
        },
      });
      return item;
    };

    cartItems.every((o: any) => (o.item = getItem(o.itemId)));

    let totalPrice: any = [];

    cartItems.every((o: any) => totalPrice.push(o.subPrice));

    const sum = totalPrice.reduce(
      (partialSum: any, a: any) => partialSum + a,
      0
    );

    return {
      id: cart?.id,
      totalPrice: sum,
      cartItem: cartItems,
    };
  },
};

const Mutation = {
  addToCart: async (parent: any, args: any, { req }: MyContext) => {
    const cartItem = await prisma.cartItem.create({
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
  removeFromCart: async (parent: any, args: any, { req }: MyContext) => {
    const cartItem = await prisma.cartItem.deleteMany({
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
  increaseQuantity: async (parent: any, args: any, { req }: MyContext) => {
    const cartItem = await prisma.cartItem.update({
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
  decreaseQuantity: async (parent: any, args: any, { req }: MyContext) => {
    const cartItem = await prisma.cartItem.update({
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
  pay: async (parent: any, args: any, { req }: MyContext) => {
    const user = await prisma.user.findUnique({
      where: {
        id: req.session.userId,
      },
    });
    if (!user) {
      return null;
    }

    const receipt = await prisma.receipt.create({
      data: {
        totalPrice: args.totalPrice,
        userId: user.id,
        userName: user.name,
      },
    });

    const createReceiptItem = async (o: any) => {
      await prisma.receiptItem.create({
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

    args.receiptItem.every((o: any) => createReceiptItem(o));

    const updateRestaurantItem = async (itemId: any, quantity: any) => {
      await prisma.restaurantItem.updateMany({
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

    args.receiptItem.every((o: any) =>
      updateRestaurantItem(o.itemId, o.quantity)
    );

    const deleteCartItem = async (id: any) => {
      await prisma.cartItem.deleteMany({
        where: {
          id: id,
        },
      });
    };

    args.receiptItem.every((o: any) => deleteCartItem(o.id));

    return receipt;
  },
};

export const cartResolvers = { Query, Mutation };
