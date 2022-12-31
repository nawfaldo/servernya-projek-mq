"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.organizerResolvers = void 0;
const database_js_1 = require("../utils/database.js");
const Query = {
    getRestaurantOrganizerRoles: async (parent, args, { req }) => {
        const roles = await database_js_1.prisma.restaurantOrganizerRole.findMany({});
        return roles;
    },
};
exports.organizerResolvers = { Query };
//# sourceMappingURL=organizer.resolvers.js.map