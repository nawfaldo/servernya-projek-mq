import { receiptResolvers } from "./receipt.resolvers";
import { cartResolvers } from "./cart.resolvers";
import { restaurantResolvers } from "./restaurant.resolvers";
import { userResolvers } from "./user.resolvers";

import { mergeResolvers } from "@graphql-tools/merge";

const resolvers = [
  userResolvers,
  restaurantResolvers,
  cartResolvers,
  receiptResolvers,
];

export default mergeResolvers(resolvers);
