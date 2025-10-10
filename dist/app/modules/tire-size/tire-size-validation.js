"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TireSizeValidation = void 0;
const zod_1 = require("zod");
const createTireSizeZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        tireSize: zod_1.z.string({
            required_error: "Tire Size name is required",
        }),
        make: zod_1.z.string({
            required_error: "Make is required",
        }),
        model: zod_1.z.string({
            required_error: "Model is required",
        }),
        trim: zod_1.z.string({
            required_error: "trim is required",
        }),
        year: zod_1.z.string({
            required_error: "Year is required",
        }),
    }),
});
const updateTireSizeZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        tireSize: zod_1.z.string().optional(),
        make: zod_1.z.string().optional(),
        model: zod_1.z.string().optional(),
        trim: zod_1.z.string().optional(),
        year: zod_1.z.string().optional(),
    }),
});
exports.TireSizeValidation = {
    createTireSizeZodSchema,
    updateTireSizeZodSchema,
};
