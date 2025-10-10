"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrimValidation = void 0;
const zod_1 = require("zod");
const createTrimZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        trim: zod_1.z.string({
            required_error: "Trim name is required",
        }),
        make: zod_1.z.string({
            required_error: "Make is required",
        }),
        model: zod_1.z.string({
            required_error: "Model is required",
        }),
        year: zod_1.z.string({
            required_error: "Year is required",
        }),
    }),
});
const updateTrimZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        trim: zod_1.z.string().optional(),
        make: zod_1.z.string().optional(),
        model: zod_1.z.string().optional(),
        year: zod_1.z.string().optional(),
    }),
});
exports.TrimValidation = {
    createTrimZodSchema,
    updateTrimZodSchema,
};
