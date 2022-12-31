import { gql } from "apollo-server-express";

export const restaurantTypeDefs = gql`
  type Type {
    id: ID!
    name: String!
  }

  type Item {
    id: ID!
    restaurantId: ID!
    restaurant: Restaurant
    userId: ID!
    user: User
    typeId: ID!
    type: Type!
    name: String!
    image: String!
    description: String!
    price: Int!
    expired: String!
    stock: Int!
    isAddedToCart: Boolean
  }

  type Role {
    id: ID!
    name: String!
  }

  type User {
    id: ID!
    name: String!
    role: String
  }

  type Organizer {
    id: ID!
    role: Role!
    roleId: ID!
    user: User!
    userId: ID!
  }

  type Restaurant {
    id: ID!
    name: String!
    image: String!
    banner: String!
    description: String!
    type: [Type]!
    item: [Item]
    organizer: [Organizer!]!
  }

  type RestaurantsOrganizedByMe {
    id: ID!
    roleId: ID!
    role: Role!
    restaurantId: ID!
    restaurant: Restaurant
  }

  input TypesInput {
    name: String!
  }

  type Query {
    getRestaurantTypes: [Type!]!
    getRestaurantsOrganizedByMe: [RestaurantsOrganizedByMe]
    getRestaurantById(id: ID!): Restaurant!
    getRestaurantOrganizerById(id: ID!): [Organizer!]!
    getRestaurantOrganizerRoles: [Role!]!
    getRestaurants: [Restaurant!]!
    getRestaurantItemTypes: [Type!]!
    getRestaurantItemsByRestaurantId(
      id: ID!
      price: String
      stock: String
      expired: String
    ): [Item]
    home: [Restaurant]
    detail(id: ID!): Restaurant!
    search(name: String!): [Restaurant]
  }

  type Mutation {
    addRestaurant(
      name: String!
      image: String!
      banner: String!
      description: String!
      types: [TypesInput!]!
    ): Restaurant!
    editRestaurant(
      id: ID!
      name: String
      image: String
      banner: String
      description: String
      types: [TypesInput]
    ): Restaurant!
    createOrganizer(userId: ID!, role: String!, restaurantId: ID!): Role!
    deleteOrganizer(id: ID!): Role!
    createRestaurantType(name: String!): Type!
    deleteRestaurantType(id: ID!): Type!
    createItem(
      restaurantId: ID!
      typeId: ID!
      name: String!
      image: String!
      description: String!
      price: Int!
      expired: String!
      stock: Int!
    ): Item!
    editItem(
      id: ID!
      name: String
      image: String
      description: String
      price: Int
      expired: String
      stock: Int
      typeId: ID
    ): Item!
    deleteItem(id: ID!): Item!
  }
`;
