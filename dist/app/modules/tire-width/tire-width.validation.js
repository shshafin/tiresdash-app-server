"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TireWidthValidation = void 0;
const zod_1 = require("zod");
const create = zod_1.z.object({
    body: zod_1.z.object({
        width: zod_1.z.string({
            required_error: "Width is required",
        }),
    }),
});
const update = zod_1.z.object({
    body: zod_1.z.object({
        width: zod_1.z.string().optional(),
    }),
});
exports.TireWidthValidation = {
    create,
    update,
};
