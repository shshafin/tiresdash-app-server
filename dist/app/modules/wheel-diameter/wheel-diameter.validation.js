"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WheelDiameterValidation = void 0;
const zod_1 = require("zod");
const create = zod_1.z.object({
    body: zod_1.z.object({
        diameter: zod_1.z.string({
            required_error: "Diameter is required",
        }),
    }),
});
const update = zod_1.z.object({
    body: zod_1.z.object({
        ratio: zod_1.z.string().optional(),
    }),
});
exports.WheelDiameterValidation = {
    create,
    update,
};
