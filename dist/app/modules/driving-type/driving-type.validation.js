"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrivingTypeValidation = void 0;
const zod_1 = require("zod");
const createDrivingTypeZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({
            required_error: "Title is required",
        }),
        subTitle: zod_1.z.string({
            required_error: "Subtitle is required",
        }),
        options: zod_1.z.array(zod_1.z.string()).nonempty({
            message: "Options array must not be empty",
        }),
    }),
});
const updateDrivingTypeZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        subTItle: zod_1.z.string().optional(),
        options: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.DrivingTypeValidation = {
    createDrivingTypeZodSchema,
    updateDrivingTypeZodSchema,
};
