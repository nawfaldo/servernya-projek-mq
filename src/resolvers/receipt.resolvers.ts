import { prisma } from "./../utils/database";
import { v4 } from "uuid";
import { MyContext } from "../utils/types.js";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../utils/constants.js";
import { sendEmail } from "../utils/sendEmail.js";

const Query = {
  myReceipts: async (parent: any, args: any, { req }: MyContext) => {
    const receipts = await prisma.receipt.findMany({
      where: {
        userId: req.session.userId,
      },
    });

    const getReceiptItems = async (id: any) => {
      const receiptItems = await prisma.receiptItem.findMany({
        where: {
          receiptId: id,
        },
      });

      return receiptItems;
    };

    receipts.every((o: any) => (o.receiptItem = getReceiptItems(o.id)));

    return receipts;
  },
  restaurantReceipts: async (parent: any, args: any, { req }: MyContext) => {
    const receipts = await prisma.receiptItem.findMany({
      where: {
        restaurantId: args.id,
      },
    });

    return receipts;
  },
};
export const receiptResolvers = { Query };
