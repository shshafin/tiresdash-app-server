"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactValidation = void 0;
const zod_1 = require("zod");
const createContactZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "Contact name is required",
        }),
        address: zod_1.z.string().optional(),
        contactInfo: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
    }),
});
const updateContactZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
        contactInfo: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
    }),
});
exports.ContactValidation = {
    createContactZodSchema,
    updateContactZodSchema,
};
