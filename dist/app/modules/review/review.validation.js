"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewValidation = void 0;
const zod_1 = require("zod");
// import { productTypes } from "../product/product.constant";
const createReviewZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        product: zod_1.z.string(),
        productType: zod_1.z.enum(["tire", "wheel", "product"]),
        rating: zod_1.z.number().min(1).max(5),
        comment: zod_1.z.string().optional(),
    }),
});
const updateReviewZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        rating: zod_1.z.number().min(1).max(5).optional(),
        comment: zod_1.z.string().optional(),
    }),
});
exports.ReviewValidation = {
    createReviewZodSchema,
    updateReviewZodSchema,
};
