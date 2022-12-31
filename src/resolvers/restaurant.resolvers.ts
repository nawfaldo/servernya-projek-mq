import { prisma } from "./../utils/database";
import { v4 } from "uuid";
import { MyContext } from "../utils/types.js";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../utils/constants.js";
import { sendEmail } from "../utils/sendEmail.js";

const Query = {
  home: async (parent: any, args: any, { req }: MyContext) => {
    const restaurants = await prisma.restaurant.findMany({});

    const getTypes = async (id: any) => {
      const type = await prisma.restaurantType.findMany({
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

    restaurants.every((o: any) => (o.type = getTypes(o.id)));

    const getItems = async (id: any) => {
      const item = await prisma.restaurantItem.findMany({
        take: 7,
        where: {
          restaurantId: id,
        },
      });

      return item;
    };

    restaurants.every((o: any) => (o.item = getItems(o.id)));

    return restaurants;
  },
  search: async (parent: any, args: any, { req }: MyContext) => {
    const restaurants = await prisma.restaurant.findMany({
      where: {
        name: {
          contains: args.name,
        },
      },
    });

    const getTypes = async (id: any) => {
      const type = await prisma.restaurantType.findMany({
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

    restaurants.every((o: any) => (o.type = getTypes(o.id)));

    const getItems = async (id: any) => {
      const item = await prisma.restaurantItem.findMany({
        take: 7,
        where: {
          restaurantId: id,
        },
      });

      return item;
    };

    restaurants.every((o: any) => (o.item = getItems(o.id)));

    return restaurants;
  },
  detail: async (parent: any, args: any, { req }: MyContext) => {
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id: args.id,
      },
    });

    const types = await prisma.restaurantType.findMany({
      where: {
        restaurants: {
          some: {
            restaurantId: args.id,
          },
        },
      },
    });

    const items = await prisma.restaurantItem.findMany({
      where: {
        restaurantId: args.id,
      },
    });

    const getItemType = async (id: any) => {
      const type = await prisma.restaurantItemType.findUnique({
        where: {
          id: id,
        },
      });

      return type;
    };

    items.every((o: any) => (o.type = getItemType(o.typeId)));

    if (req.session.userId) {
      const getIsItemAddedToCart = async (id: any) => {
        const cart = await prisma.cart.findUnique({
          where: {
            userId: req.session.userId,
          },
        });

        const cartItem = await prisma.cartItem.findFirst({
          where: {
            itemId: id,
            cartId: cart?.id,
          },
        });

        if (cartItem) {
          return true;
        }
        return false;
      };

      items.every((o: any) => (o.isAddedToCart = getIsItemAddedToCart(o.id)));
    }

    const restaurantOrganizer = await prisma.restaurantOrganizer.findMany({
      where: {
        restaurantId: args.id,
      },
    });

    const getRole = async (id: any) => {
      const user = await prisma.restaurantOrganizerRole.findUnique({
        where: {
          id: id,
        },
      });
      return user;
    };

    await restaurantOrganizer.every((o: any) => (o.role = getRole(o.roleId)));

    const getUser = async (id: any) => {
      const user = await prisma.user.findUnique({
        where: {
          id: id,
        },
      });
      return user;
    };

    await restaurantOrganizer.every((o: any) => (o.user = getUser(o.userId)));

    return {
      id: restaurant?.id,
      name: restaurant?.name,
      image: restaurant?.image,
      banner: restaurant?.banner,
      description: restaurant?.description,
      type: types,
      item: items,
      organizer: restaurantOrganizer,
    };
  },
  getRestaurantTypes: async (parent: any, args: any, { req }: MyContext) => {
    const result = await prisma.restaurantType.findMany({});
    return result;
  },
  getRestaurantItemsByRestaurantId: async (
    parent: any,
    args: any,
    { req }: MyContext
  ) => {
    const items = await prisma.restaurantItem.findMany({
      where: {
        restaurantId: args.id,
      },
      orderBy: {
        price: args.price ? args.price : undefined,
        stock: args.stock ? args.stock : undefined,
        expired: args.expired ? args.expired : undefined,
      },
    });

    const getUser = async (id: any) => {
      const restaurantOrganizer = await prisma.restaurantOrganizer.findUnique({
        where: {
          id: id,
        },
      });

      const user = await prisma.user.findUnique({
        where: {
          id: restaurantOrganizer?.userId,
        },
      });

      const role = await prisma.restaurantOrganizerRole.findUnique({
        where: {
          id: restaurantOrganizer?.roleId,
        },
      });

      return {
        id: restaurantOrganizer?.id,
        name: user?.name,
        role: role?.name,
      };
    };

    items.every((o: any) => (o.user = getUser(o.userId)));

    const getType = async (id: any) => {
      const type = await prisma.restaurantItemType.findUnique({
        where: {
          id: id,
        },
      });

      return type;
    };

    items.every((o: any) => (o.type = getType(o.typeId)));

    return items;
  },
  getRestaurantItemTypes: async (
    parent: any,
    args: any,
    { req }: MyContext
  ) => {
    const result = await prisma.restaurantItemType.findMany({});
    return result;
  },
  getRestaurants: async (parent: any, args: any, { req }: MyContext) => {
    const restaurants = await prisma.restaurant.findMany({});

    const getRole = async (id: any) => {
      const types = await prisma.restaurantType.findMany({
        where: {
          restaurants: {
            some: {
              restaurantId: id?.id,
            },
          },
        },
      });
      return types;
    };

    await restaurants.every((o: any) => (o.type = getRole(o.id)));

    return restaurants;
  },
  getRestaurantsOrganizedByMe: async (
    parent: any,
    args: any,
    { req }: MyContext
  ) => {
    const restaurantsOrganizedByMe = await prisma.restaurantOrganizer.findMany({
      where: {
        userId: req.session.userId,
      },
    });

    const getRole = async (roleId: any) => {
      const role = await prisma.restaurantOrganizerRole.findUnique({
        where: {
          id: roleId,
        },
      });
      return role;
    };

    await restaurantsOrganizedByMe.every(
      (o: any) => (o.role = getRole(o.roleId))
    );

    const getRestaurant = async (restaurantId: any) => {
      let restaurant = await prisma.restaurant.findUnique({
        where: {
          id: restaurantId,
        },
      });

      const type = await prisma.restaurantType.findMany({
        where: {
          restaurants: {
            some: {
              restaurantId: restaurant?.id,
            },
          },
        },
      });

      return {
        id: restaurant?.id,
        name: restaurant?.name,
        image: restaurant?.image,
        banner: restaurant?.banner,
        description: restaurant?.description,
        type: type,
      };
    };

    await restaurantsOrganizedByMe.every(
      (o: any) => (o.restaurant = getRestaurant(o.restaurantId))
    );

    const getAssignments = await prisma.typesOnRestaurants.findMany({
      where: {
        restaurant: {
          id: "339a4537-aaa5-4c3d-86c6-4d33837aebfe",
        },
      },
    });

    return restaurantsOrganizedByMe;
  },
  getRestaurantById: async (parent: any, args: any, { req }: MyContext) => {
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id: args.id,
      },
    });

    const type = await prisma.restaurantType.findMany({
      where: {
        restaurants: {
          some: {
            restaurantId: restaurant?.id,
          },
        },
      },
    });

    return {
      id: restaurant?.id,
      name: restaurant?.name,
      image: restaurant?.image,
      banner: restaurant?.banner,
      description: restaurant?.description,
      type: type,
    };
  },
  getRestaurantOrganizerById: async (
    parent: any,
    args: any,
    { req }: MyContext
  ) => {
    const restaurantOrganizer = await prisma.restaurantOrganizer.findMany({
      where: {
        restaurantId: args.id,
      },
    });

    const getRole = async (id: any) => {
      const user = await prisma.restaurantOrganizerRole.findUnique({
        where: {
          id: id,
        },
      });
      return user;
    };

    await restaurantOrganizer.every((o: any) => (o.role = getRole(o.roleId)));

    const getUser = async (id: any) => {
      const user = await prisma.user.findUnique({
        where: {
          id: id,
        },
      });
      return user;
    };

    await restaurantOrganizer.every((o: any) => (o.user = getUser(o.userId)));

    return restaurantOrganizer;
  },
  getRestaurantOrganizerRoles: async (
    parent: any,
    args: any,
    { req }: MyContext
  ) => {
    const roles = await prisma.restaurantOrganizerRole.findMany({});
    return roles;
  },
};

const Mutation = {
  addRestaurant: async (parent: any, args: any, { req }: MyContext) => {
    const array: any = [];
    await args.types.every((o: any) =>
      array.push({ restaurantType: { connect: { name: o.name } } })
    );

    const restaurant = await prisma.restaurant.create({
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

    const owner = await prisma.restaurantOrganizer.create({
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
  editRestaurant: async (parent: any, args: any, { req }: MyContext) => {
    if (args.types != undefined && args.types.length != 0) {
      await prisma.typesOnRestaurants.deleteMany({
        where: {
          restaurantId: args.id,
        },
      });

      let array: any = [];
      await args.types.every((o: any) =>
        array.push({ restaurantType: { connect: { name: o.name } } })
      );

      const restaurant = await prisma.restaurant.update({
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

    const restaurant = await prisma.restaurant.update({
      where: {
        id: args.id!,
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
  createOrganizer: async (parent: any, args: any, { req }: MyContext) => {
    const organizer = await prisma.restaurantOrganizer.create({
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
  deleteOrganizer: async (parent: any, args: any, { req }: MyContext) => {
    const organizer = await prisma.restaurantOrganizer.delete({
      where: {
        id: args.id,
      },
    });

    return organizer;
  },
  createRestaurantType: async (parent: any, args: any, { req }: MyContext) => {
    const type = await prisma.restaurantType.create({
      data: {
        name: args.name,
      },
    });

    return type;
  },
  deleteRestaurantType: async (parent: any, args: any, { req }: MyContext) => {
    await prisma.typesOnRestaurants.deleteMany({
      where: {
        restaurantTypeId: args.id,
      },
    });

    const type = await prisma.restaurantType.delete({
      where: {
        id: args.id,
      },
    });

    return type;
  },
  createItem: async (parent: any, args: any, { req }: MyContext) => {
    const user = await prisma.restaurantOrganizer.findFirst({
      where: {
        userId: req.session.userId,
        restaurantId: args.restaurantId,
      },
    });

    const item = await prisma.restaurantItem.create({
      data: {
        name: args.name,
        description: args.description,
        image: args.image,
        price: args.price,
        stock: args.stock,
        expired: args.expired,
        user: {
          connect: {
            id: user?.id,
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
  editItem: async (parent: any, args: any, { req }: MyContext) => {
    const item = await prisma.restaurantItem.update({
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
      await prisma.restaurantItem.update({
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
      const cartItems = await prisma.cartItem.findMany({
        where: {
          item: {
            id: args.id,
          },
        },
      });

      const updateCartItem = async (id: any, quantity: any) => {
        await prisma.cartItem.update({
          where: {
            id: id,
          },
          data: {
            subPrice: args.price * quantity,
          },
        });
      };

      cartItems.every((o: any) => updateCartItem(o.id, o.quantity));
    }

    return item;
  },
  deleteItem: async (parent: any, args: any, { req }: MyContext) => {
    const item = await prisma.restaurantItem.delete({
      where: {
        id: args.id,
      },
    });

    return item;
  },
};

export const restaurantResolvers = { Query, Mutation };
