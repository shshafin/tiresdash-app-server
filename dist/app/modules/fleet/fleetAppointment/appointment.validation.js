"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FleetAppointmentValidation = void 0;
const zod_1 = require("zod");
const createFleetAppointmentZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        fleetUser: zod_1.z.string({}).optional(),
        fleetVehicle: zod_1.z.string({
            required_error: "Fleet vehicle ID is required",
        }),
        serviceType: zod_1.z.enum(["Tire Replacement", "Flat Repair", "Balance", "Rotation", "Other"], {
            required_error: "Service type is required",
        }),
        date: zod_1.z.string({
            required_error: "Date is required",
        }),
        time: zod_1.z.string({
            required_error: "Time is required",
        }),
        address: zod_1.z.string({
            required_error: "Address is required",
        }),
        notes: zod_1.z.string().optional(),
        files: zod_1.z.array(zod_1.z.string()).optional(),
        status: zod_1.z.enum(["Pending", "Confirmed", "Completed", "Cancelled"]).optional(),
        assignedTo: zod_1.z.string().optional(),
        estimatedDuration: zod_1.z.number().optional(),
        costEstimate: zod_1.z.number().optional(),
        fleetRef: zod_1.z
            .object({
            phone: zod_1.z.string().optional(),
            email: zod_1.z.string().email("Invalid email address").optional(),
            note: zod_1.z.string().max(200, "Note cannot exceed 200 characters").optional(),
        })
            .optional(),
    }),
});
const updateFleetAppointmentZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        fleetVehicle: zod_1.z.string().optional(),
        serviceType: zod_1.z.enum(["Tire Replacement", "Flat Repair", "Balance", "Rotation", "Other"]).optional(),
        date: zod_1.z.string().optional(),
        time: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
        notes: zod_1.z.string().optional(),
        files: zod_1.z.array(zod_1.z.string()).optional(),
        status: zod_1.z.enum(["Pending", "Confirmed", "Completed", "Cancelled"]).optional(),
        assignedTo: zod_1.z.string().optional(),
        estimatedDuration: zod_1.z.number().optional(),
        costEstimate: zod_1.z.number().optional(),
        fleetRef: zod_1.z
            .object({
            phone: zod_1.z.string().optional(),
            email: zod_1.z.string().email("Invalid email address").optional(),
            note: zod_1.z.string().max(200, "Note cannot exceed 200 characters").optional(),
        })
            .optional(),
    }),
});
exports.FleetAppointmentValidation = {
    createFleetAppointmentZodSchema,
    updateFleetAppointmentZodSchema,
};
