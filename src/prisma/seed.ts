import { PrismaClient } from "@prisma/client";
import { v4 } from "uuid";

const prisma = new PrismaClient();

async function main() {
  // Create User Role
  await prisma.userRole.create({
    data: {
      name: "owner",
    },
  });
  await prisma.userRole.create({
    data: {
      name: "admin",
    },
  });
  await prisma.userRole.create({
    data: {
      name: "normie",
    },
  });

  // Create Admin
  const id = v4();

  await prisma.user.create({
    data: {
      id: id,
      name: "noir",
      password: "123",
      email: "noir@gmail.com",
      role: {
        connect: {
          name: "owner",
        },
      },
    },
  });
  await prisma.cart.create({
    data: {
      user: {
        connect: {
          id: id,
        },
      },
    },
  });

  // Create Restaurant Type
  await prisma.restaurantType.create({
    data: {
      name: "indonesian",
    },
  });
  await prisma.restaurantType.create({
    data: {
      name: "malaysian",
    },
  });
  await prisma.restaurantType.create({
    data: {
      name: "thailand",
    },
  });
  await prisma.restaurantType.create({
    data: {
      name: "philipine",
    },
  });
  await prisma.restaurantType.create({
    data: {
      name: "singapore",
    },
  });

  // Create Restaurant Organizer Role
  await prisma.restaurantOrganizerRole.create({
    data: {
      name: "owner",
    },
  });
  await prisma.restaurantOrganizerRole.create({
    data: {
      name: "admin",
    },
  });
  await prisma.restaurantOrganizerRole.create({
    data: {
      name: "servants",
    },
  });
  await prisma.restaurantOrganizerRole.create({
    data: {
      name: "chef",
    },
  });

  // Create Restaurant Item Type
  await prisma.restaurantItemType.create({
    data: {
      name: "food",
    },
  });
  await prisma.restaurantItemType.create({
    data: {
      name: "drink",
    },
  });
  await prisma.restaurantItemType.create({
    data: {
      name: "snack",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
