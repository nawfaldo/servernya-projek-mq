"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.receiptResolvers = void 0;
const database_1 = require("./../utils/database");
const Query = {
    myReceipts: async (parent, args, { req }) => {
        const receipts = await database_1.prisma.receipt.findMany({
            where: {
                userId: req.session.userId,
            },
        });
        const getReceiptItems = async (id) => {
            const receiptItems = await database_1.prisma.receiptItem.findMany({
                where: {
                    receiptId: id,
                },
            });
            return receiptItems;
        };
        receipts.every((o) => (o.receiptItem = getReceiptItems(o.id)));
        return receipts;
    },
    restaurantReceipts: async (parent, args, { req }) => {
        const receipts = await database_1.prisma.receiptItem.findMany({
            where: {
                restaurantId: args.id,
            },
        });
        return receipts;
    },
};
exports.receiptResolvers = { Query };
//# sourceMappingURL=receipt.resolvers.js.map