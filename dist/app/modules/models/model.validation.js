"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelValidation = void 0;
const zod_1 = require("zod");
const createModelZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        model: zod_1.z.string({
            required_error: "Car model is required",
        }),
        make: zod_1.z.string({
            required_error: "Make is required",
        }),
        year: zod_1.z.string({
            required_error: "Year is required",
        }),
    }),
});
const updateModelZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        model: zod_1.z.string().optional(),
        make: zod_1.z.string().optional(),
        year: zod_1.z.string().optional(),
    }),
});
exports.ModelValidation = {
    createModelZodSchema,
    updateModelZodSchema,
};
