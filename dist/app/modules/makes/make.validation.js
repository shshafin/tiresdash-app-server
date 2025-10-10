"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeValidation = void 0;
const zod_1 = require("zod");
const createMakeZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        make: zod_1.z.string({
            required_error: "Make name is required",
        }),
    }),
});
const updateMakeZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        make: zod_1.z.string().optional(),
        logo: zod_1.z.string().optional(),
    }),
});
exports.MakeValidation = {
    createMakeZodSchema,
    updateMakeZodSchema,
};
