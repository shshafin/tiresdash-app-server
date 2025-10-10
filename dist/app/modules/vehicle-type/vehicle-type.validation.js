"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleTypeValidation = void 0;
const zod_1 = require("zod");
const create = zod_1.z.object({
    body: zod_1.z.object({
        vehicleType: zod_1.z.string({
            required_error: "Vehicle type is required",
        }),
    }),
});
const update = zod_1.z.object({
    body: zod_1.z.object({
        ratio: zod_1.z.string().optional(),
    }),
});
exports.VehicleTypeValidation = {
    create,
    update,
};
