"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const receipt_schema_1 = require("./receipt.schema");
const cart_schema_1 = require("./cart.schema");
const restaurant_schema_1 = require("./restaurant.schema");
const user_schema_1 = require("./user.schema");
const merge_1 = require("@graphql-tools/merge");
const typeDefs = [
    user_schema_1.userTypeDefs,
    restaurant_schema_1.restaurantTypeDefs,
    cart_schema_1.cartTypeDefs,
    receipt_schema_1.receiptTypeDefs,
];
exports.default = (0, merge_1.mergeTypeDefs)(typeDefs);
//# sourceMappingURL=index.js.map