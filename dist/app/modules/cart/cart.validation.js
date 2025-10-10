"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartValidation = void 0;
const zod_1 = require("zod");
const cartItemSchema = zod_1.z.object({
    product: zod_1.z.string({
        required_error: "Product ID is required",
    }),
    productType: zod_1.z.enum(["tire", "wheel", "product"], {
        required_error: "Product type is required and must be 'tire', 'wheel', or 'product'",
    }),
    quantity: zod_1.z
        .number({
        required_error: "Quantity is required",
    })
        .min(1, "Quantity must be at least 1"),
    price: zod_1.z
        .number({
        required_error: "Price is required",
    })
        .positive("Price must be a positive number"),
    name: zod_1.z.string({
        required_error: "Product name is required",
    }),
    thumbnail: zod_1.z.string().optional(),
});
const createCartZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        user: zod_1.z.string({
            required_error: "User ID is required",
        }),
        items: zod_1.z.array(cartItemSchema).optional().default([]),
        totalPrice: zod_1.z.number().optional().default(0),
        totalItems: zod_1.z.number().optional().default(0),
    }),
});
const addItemToCartZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        product: zod_1.z.string({
            required_error: "Product ID is required",
        }),
        productType: zod_1.z.enum(["tire", "wheel", "product"], {
            required_error: "Product type is required and must be 'tire', 'wheel', or 'product'",
        }),
        quantity: zod_1.z
            .number({
            required_error: "Quantity is required",
        })
            .min(1, "Quantity must be at least 1"),
    }),
});
const updateCartItemZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        productType: zod_1.z.enum(["tire", "wheel", "product"], {
            required_error: "Product type is required for update",
        }),
        quantity: zod_1.z
            .number({
            required_error: "Quantity is required",
        })
            .min(1, "Quantity must be at least 1"),
    }),
});
exports.CartValidation = {
    createCartZodSchema,
    addItemToCartZodSchema,
    updateCartItemZodSchema,
};
