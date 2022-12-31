import { gql } from "apollo-server-express";

export const receiptTypeDefs = gql`
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
