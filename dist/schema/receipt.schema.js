"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.receiptTypeDefs = void 0;
const apollo_server_express_1 = require("apollo-server-express");
exports.receiptTypeDefs = (0, apollo_server_express_1.gql) `
  type ReceiptItems {
    id: ID
    quantity: Int
    subPrice: Int
    pricePerItem: Int
    expired: String
    restaurantId: String
    restaurantName: String
    itemId: String
    itemName: String
  }

  type Receipts {
    id: ID
    totalPrice: Int
    receiptItem: [ReceiptItems]
    userId: String
    userName: String
  }

  type Query {
    myReceipts: [Receipts]
    restaurantReceipts(id: ID!): [ReceiptItems]
  }
`;
//# sourceMappingURL=receipt.schema.js.map