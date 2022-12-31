"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.organizerTypeDefs = void 0;
const apollo_server_express_1 = require("apollo-server-express");
exports.organizerTypeDefs = (0, apollo_server_express_1.gql) `
  type Role {
    id: ID!
    name: String!
  }

  type Query {
    getRestaurantOrganizerRoles: [Role!]!
  }

  #   type Mutation {}
`;
//# sourceMappingURL=organizer.schema.js.map