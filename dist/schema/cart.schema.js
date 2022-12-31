"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartTypeDefs = void 0;
const apollo_server_express_1 = require("apollo-server-express");
exports.cartTypeDefs = (0, apollo_server_express_1.gql) `
  type Item {
    id: ID
    name: String
    stock: Int
    price: Int
    expired: String
    image: String
  }

  type restaurant {
    id: ID
    name: String
    stock: Int
    price: Int
    expired: String
  }

  type CartItem {
    id: ID
    subPrice: Int
    item: Item
    quantity: Int
    restaurant: Restaurant
  }

  type Cart {
    id: ID
    totalPrice: Int
    cartItem: [CartItem]
  }

  input ReceiptItem {
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

  type Query {
    myCart: Cart
  }

  type Mutation {
    addToCart(itemId: ID!, restaurantId: ID!, price: Int!): Cart!
    removeFromCart(itemId: ID!, restaurantId: ID!): Cart!
    increaseQuantity(cartItemId: ID!, price: Int!): Cart!
    decreaseQuantity(cartItemId: ID!, price: Int!): Cart!
    pay(totalPrice: Int!, receiptItem: [ReceiptItem]): Cart!
  }
`;
//# sourceMappingURL=cart.schema.js.map