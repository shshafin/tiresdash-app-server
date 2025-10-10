"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YearValidation = void 0;
const zod_1 = require("zod");
const createYearZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        year: zod_1.z
            .number({
            required_error: "Year is required",
            invalid_type_error: "Year must be a number",
        })
            .min(1900, "Year must be greater than or equal to 1900")
            .max(new Date().getFullYear() + 1, "Year must be less than or equal to the current year"),
    }),
});
const updateYearZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        year: zod_1.z
            .number()
            .min(1900, "Year must be greater than or equal to 1900")
            .max(new Date().getFullYear() + 1, "Year must be less than or equal to the current year")
            .optional(),
    }),
});
exports.YearValidation = {
    createYearZodSchema,
    updateYearZodSchema,
};
