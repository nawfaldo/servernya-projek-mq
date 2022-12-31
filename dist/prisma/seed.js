"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient();
async function main() {
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
    const id = (0, uuid_1.v4)();
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
//# sourceMappingURL=seed.js.map