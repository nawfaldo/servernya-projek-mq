"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const receipt_resolvers_1 = require("./receipt.resolvers");
const cart_resolvers_1 = require("./cart.resolvers");
const restaurant_resolvers_1 = require("./restaurant.resolvers");
const user_resolvers_1 = require("./user.resolvers");
const merge_1 = require("@graphql-tools/merge");
const resolvers = [
    user_resolvers_1.userResolvers,
    restaurant_resolvers_1.restaurantResolvers,
    cart_resolvers_1.cartResolvers,
    receipt_resolvers_1.receiptResolvers,
];
exports.default = (0, merge_1.mergeResolvers)(resolvers);
//# sourceMappingURL=index.js.map