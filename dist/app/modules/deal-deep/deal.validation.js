"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DealValidation = void 0;
const zod_1 = require("zod");
const createDealZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: "Title is required" }),
        description: zod_1.z.string().optional(),
        discountType: zod_1.z.enum(["percentage", "fixed"], {
            required_error: "Discount type is required",
        }),
        discountValue: zod_1.z.number({ required_error: "Discount value is required" }),
        brand: zod_1.z.string({ required_error: "Brand ID is required" }),
        applyTo: zod_1.z
            .object({
            tires: zod_1.z.boolean().default(false),
            wheels: zod_1.z.boolean().default(false),
            products: zod_1.z.boolean().default(false),
        })
            .refine((data) => data.tires || data.wheels || data.products, {
            message: "Must apply to at least one product type",
        }),
        minOrderAmount: zod_1.z.number().min(0).optional(),
        maxDiscount: zod_1.z.number().min(0).optional(),
        startDate: zod_1.z.string({ required_error: "Start date is required" }),
        endDate: zod_1.z.string({ required_error: "End date is required" }),
        isActive: zod_1.z.boolean().default(true),
    }),
});
const updateDealZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        discountType: zod_1.z.enum(["percentage", "fixed"]).optional(),
        discountValue: zod_1.z.number().optional(),
        applyTo: zod_1.z
            .object({
            tires: zod_1.z.boolean().optional(),
            wheels: zod_1.z.boolean().optional(),
            products: zod_1.z.boolean().optional(),
        })
            .optional(),
        minOrderAmount: zod_1.z.number().min(0).optional(),
        maxDiscount: zod_1.z.number().min(0).optional(),
        startDate: zod_1.z.string().optional(),
        endDate: zod_1.z.string().optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.DealValidation = {
    createDealZodSchema,
    updateDealZodSchema,
};
