"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandValidation = void 0;
const zod_1 = require("zod");
const createBrandZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "Name is required",
        }),
        description: zod_1.z.string({
            required_error: "Description is required",
        }),
        logo: zod_1.z.string().optional(),
    }),
});
const updateBrandZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        logo: zod_1.z.string().optional(),
    }),
});
exports.BrandValidation = {
    createBrandZodSchema,
    updateBrandZodSchema,
};
