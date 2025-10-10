"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FleetVehicleValidation = void 0;
const zod_1 = require("zod");
const createFleetVehicleZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        year: zod_1.z.string({
            required_error: "Year is required",
        }),
        make: zod_1.z.string({
            required_error: "Make is required",
        }),
        model: zod_1.z.string({
            required_error: "Model is required",
        }),
        vin: zod_1.z.string({
            required_error: "VIN is required",
        }),
        licensePlate: zod_1.z.string({
            required_error: "License plate is required",
        }),
        tireSize: zod_1.z.string({
            required_error: "Tire size is required",
        }),
        note: zod_1.z.string().optional(),
    }),
});
const updateFleetVehicleZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        year: zod_1.z.string().optional(),
        make: zod_1.z.string().optional(),
        model: zod_1.z.string().optional(),
        vin: zod_1.z.string().optional(),
        licensePlate: zod_1.z.string().optional(),
        tireSize: zod_1.z.string().optional(),
        note: zod_1.z.string().optional(),
    }),
});
exports.FleetVehicleValidation = {
    createFleetVehicleZodSchema,
    updateFleetVehicleZodSchema,
};
