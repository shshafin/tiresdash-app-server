"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistValidation = void 0;
const zod_1 = require("zod");
const wishlistItemSchema = zod_1.z.object({
    product: zod_1.z.string({
        required_error: "Product ID is required",
    }),
    productType: zod_1.z.enum(["tire", "wheel", "product"], {
        required_error: "Product type must be either 'tire', 'wheel', or 'product'",
    }),
});
const createWishlistZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        items: zod_1.z.array(wishlistItemSchema).optional(),
    }),
});
const addItemToWishlistZodSchema = zod_1.z.object({
    body: wishlistItemSchema,
});
exports.WishlistValidation = {
    createWishlistZodSchema,
    addItemToWishlistZodSchema,
};
