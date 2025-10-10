"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderValidation = void 0;
const zod_1 = require("zod");
const createOrderZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        paymentId: zod_1.z.string({
            required_error: "Payment ID is required",
        }),
    }),
});
const updateOrderStatusZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum([
            "pending",
            "processing",
            "shipped",
            "delivered",
            "cancelled",
            "refunded",
        ]),
        trackingNumber: zod_1.z.string().optional(),
        estimatedDelivery: zod_1.z.string().optional(),
    }),
});
exports.OrderValidation = {
    createOrderZodSchema,
    updateOrderStatusZodSchema,
};
