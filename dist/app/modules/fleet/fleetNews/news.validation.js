"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FleetNewsValidation = void 0;
const zod_1 = require("zod");
const createFleetNewsZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        badge: zod_1.z.string({
            required_error: "Badge is required",
        }),
        title: zod_1.z.string({
            required_error: "Title is required",
        }),
        description: zod_1.z.string({
            required_error: "Description is required",
        }),
        status: zod_1.z.enum(["featured", "recent"]).optional(),
    }),
});
const updateFleetNewsZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        badge: zod_1.z.string().optional(),
        title: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        status: zod_1.z.enum(["featured", "recent"]).optional(),
    }),
});
exports.FleetNewsValidation = {
    createFleetNewsZodSchema,
    updateFleetNewsZodSchema,
};
