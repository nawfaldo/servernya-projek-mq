import { receiptTypeDefs } from "./receipt.schema";
import { cartTypeDefs } from "./cart.schema";
import { restaurantTypeDefs } from "./restaurant.schema";
import { userTypeDefs } from "./user.schema";

import { mergeTypeDefs } from "@graphql-tools/merge";

const typeDefs = [
  userTypeDefs,
  restaurantTypeDefs,
  cartTypeDefs,
  receiptTypeDefs,
];

export default mergeTypeDefs(typeDefs);
