"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WheelWidthTypeValidation = void 0;
const zod_1 = require("zod");
const create = zod_1.z.object({
    body: zod_1.z.object({
        widthType: zod_1.z.string({
            required_error: "width type is required",
        }),
    }),
});
const update = zod_1.z.object({
    body: zod_1.z.object({
        width: zod_1.z.string().optional(),
    }),
});
exports.WheelWidthTypeValidation = {
    create,
    update,
};
