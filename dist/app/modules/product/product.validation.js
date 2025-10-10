"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidation = void 0;
const zod_1 = require("zod");
const createProductZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "Product name is required",
        }),
        slug: zod_1.z.string({
            required_error: "Product slug is required",
        }),
        description: zod_1.z.string({
            required_error: "Description is required",
        }),
        price: zod_1.z.number({
            required_error: "Price is required",
        }),
        discountPrice: zod_1.z.number().optional(),
        stock: zod_1.z.number({
            required_error: "Stock is required",
        }),
        sku: zod_1.z.string({
            required_error: "SKU is required",
        }),
        images: zod_1.z.array(zod_1.z.string()).optional(),
        thumbnail: zod_1.z.string().optional(),
        category: zod_1.z.string({
            required_error: "Category is required",
        }),
        compatibleVehicles: zod_1.z
            .array(zod_1.z.object({
            year: zod_1.z.string().optional(),
            make: zod_1.z.string().optional(),
            model: zod_1.z.string().optional(),
            trim: zod_1.z.string().optional(),
        }))
            .optional(),
        brand: zod_1.z.string().optional(),
    }),
});
const updateProductZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        slug: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        price: zod_1.z.number().optional(),
        discountPrice: zod_1.z.number().optional(),
        stock: zod_1.z.number().optional(),
        sku: zod_1.z.string().optional(),
        images: zod_1.z.array(zod_1.z.string()).optional(),
        thumbnail: zod_1.z.string().optional(),
        category: zod_1.z.string().optional(),
        compatibleVehicles: zod_1.z
            .array(zod_1.z.object({
            year: zod_1.z.string().optional(),
            make: zod_1.z.string().optional(),
            model: zod_1.z.string().optional(),
            trim: zod_1.z.string().optional(),
        }))
            .optional(),
        brand: zod_1.z.string().optional(),
    }),
});
exports.ProductValidation = {
    createProductZodSchema,
    updateProductZodSchema,
};
