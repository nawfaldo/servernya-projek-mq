"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userTypeDefs = void 0;
const apollo_server_express_1 = require("apollo-server-express");
exports.userTypeDefs = (0, apollo_server_express_1.gql) `
  type UserRole {
    id: ID!
    name: String!
  }

  type RestaurantRole {
    id: ID!
    name: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    image: String
    password: String!
    userRole: UserRole!
    restaurantRole: RestaurantRole
    restaurant: [Restaurant]
    roleId: ID!
  }

  type Query {
    me(restaurantId: ID): User
    getUsers: [User!]!
    getUserRoles: [Role!]!
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): User!
    logout(id: String!): User!
    forgotPassword(email: String!): User!
    changePassword(token: String!, password: String!): User!
    editUser(
      image: String
      name: String
      email: String
      id: ID
      role: String
    ): User!
    createUser(
      image: String!
      name: String!
      email: String!
      password: String!
      role: String!
    ): User!
    deleteUser(id: ID!): User!
  }
`;
//# sourceMappingURL=user.schema.js.map