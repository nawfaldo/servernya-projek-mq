import { prisma } from "../utils/database.js";
import { v4 } from "uuid";
import { MyContext } from "../utils/types.js";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../utils/constants.js";
import { sendEmail } from "../utils/sendEmail.js";

const Query = {
  me: async (parent: any, args: any, { req }: MyContext) => {
    const user = await prisma.user.findUnique({
      where: {
        id: req.session.userId,
      },
    });

    const userRole = await prisma.userRole.findUnique({
      where: {
        id: user?.roleId,
      },
    });

    let restRole = null;

    if (args.restaurantId) {
      const restaurant = await prisma.restaurantOrganizer.findFirst({
        where: {
          userId: req.session.userId,
          restaurantId: args.restaurantId,
        },
      });

      const restaurantRole = await prisma.restaurantOrganizerRole.findUnique({
        where: {
          id: restaurant?.roleId,
        },
      });

      restRole = {
        id: restaurantRole?.id,
        name: restaurantRole?.name,
      };
    }

    return {
      id: user?.id,
      name: user?.name,
      image: user?.image,
      email: user?.email,
      userRole: userRole,
      restaurantRole: args.restaurantId ? restRole : null,
    };
  },
  getUsers: async (parent: any, args: any, { req }: MyContext) => {
    const users = await prisma.user.findMany({});

    const getUserRole = async (id: any) => {
      const role = await prisma.userRole.findUnique({
        where: {
          id: id,
        },
      });
      return role;
    };

    users.every((user: any) => (user.userRole = getUserRole(user.roleId)));

    return users;
  },
  getUserRoles: async (parent: any, args: any, { req }: MyContext) => {
    const roles = await prisma.userRole.findMany({});
    return roles;
  },
};

const Mutation = {
  register: async (parent: any, args: any, { req }: MyContext) => {
    const userId = v4();

    req.session.userId = userId;

    const user = await prisma.user.create({
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

    await prisma.cart.create({
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
  login: async (parent: any, args: any, { req }: MyContext) => {
    const user = await prisma.user.findUnique({
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
  logout: (parent: any, args: any, { req, res }: MyContext) => {
    res.clearCookie(COOKIE_NAME);
    return { id: "removed" };
  },
  forgotPassword: async (
    parent: any,
    args: any,
    { req, res, redis }: MyContext
  ) => {
    const user = await prisma.user.findUnique({
      where: {
        email: args.email,
      },
    });

    if (!user) {
      throw new Error("User Not Found");
    }

    const token = v4();

    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      "ex",
      1000 * 60 * 60 * 24 * 3
    ); // 3 days

    await sendEmail(
      args.email,
      `<a href="http://localhost:3000/change-password/${token}">reset password</a>`
    );

    return user;
  },
  changePassword: async (
    parent: any,
    args: any,
    { req, res, redis }: MyContext
  ) => {
    const key = FORGET_PASSWORD_PREFIX + args.token;
    const userId = await redis.get(key);
    if (!userId) {
      throw new Error("UserId Not Found");
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!userId) {
      throw new Error("User Not Found");
    }
    const updateUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: args.password,
      },
    });

    await redis.del(key);

    req.session.userId = user?.id;

    return updateUser;
  },
  editUser: async (parent: any, args: any, { req }: MyContext) => {
    const user = await prisma.user.update({
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
      await prisma.user.update({
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
  createUser: async (parent: any, args: any, { req }: MyContext) => {
    const userId = v4();

    const user = await prisma.user.create({
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

    await prisma.cart.create({
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
  deleteUser: async (parent: any, args: any, { req }: MyContext) => {
    const user = await prisma.user.delete({
      where: {
        id: args.id,
      },
    });

    return user;
  },
};

export const userResolvers = { Query, Mutation };
