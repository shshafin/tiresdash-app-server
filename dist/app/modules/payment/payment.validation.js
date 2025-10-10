"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentValidation = void 0;
const zod_1 = require("zod");
const paymentMethodEnum = zod_1.z.enum([
    "credit_card",
    "paypal",
    "stripe",
    "bank_transfer",
    "cash_on_delivery",
]);
const paymentStatusEnum = zod_1.z.enum([
    "pending",
    "completed",
    "failed",
    "refunded",
    "partially_refunded",
]);
const createPaymentZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        order: zod_1.z.string({
            required_error: "Order ID is required",
        }),
        paymentMethod: paymentMethodEnum,
        amount: zod_1.z
            .number({
            required_error: "Amount is required",
        })
            .positive("Amount must be positive"),
        paymentDetails: zod_1.z.record(zod_1.z.any()).optional(),
    }),
});
const updatePaymentStatusZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: paymentStatusEnum,
        transactionId: zod_1.z.string().optional(),
    }),
});
const processPaymentZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        paymentMethod: paymentMethodEnum,
        paymentDetails: zod_1.z.record(zod_1.z.any()),
    }),
});
exports.PaymentValidation = {
    createPaymentZodSchema,
    updatePaymentStatusZodSchema,
    processPaymentZodSchema,
};
