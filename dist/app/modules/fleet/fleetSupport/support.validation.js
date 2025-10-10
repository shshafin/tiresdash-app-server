"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FleetSupportValidation = void 0;
// fleetSupport.validation.ts
const zod_1 = require("zod");
const createFleetSupportZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        issueType: zod_1.z.enum([
            "Billing Question",
            "Service Issue",
            "Account Access",
            "Technical Problem",
            "Appointment Scheduling",
            "Fleet Management",
            "Other",
        ], {
            required_error: "Issue type is required",
        }),
        priority: zod_1.z.enum([
            "Low-General inquiry",
            "Medium-Service needed",
            "High-Urgent issue",
            "Critical-Emergency",
        ], {
            required_error: "Priority is required",
        }),
        subject: zod_1.z.string({
            required_error: "Subject is required",
        }),
        message: zod_1.z.string({
            required_error: "Message is required",
        }),
        files: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
const updateFleetSupportZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        issueType: zod_1.z
            .enum([
            "Billing Question",
            "Service Issue",
            "Account Access",
            "Technical Problem",
            "Appointment Scheduling",
            "Fleet Management",
            "Other",
        ])
            .optional(),
        priority: zod_1.z
            .enum([
            "Low-General inquiry",
            "Medium-Service needed",
            "High-Urgent issue",
            "Critical-Emergency",
        ])
            .optional(),
        subject: zod_1.z.string().optional(),
        message: zod_1.z.string().optional(),
        files: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.FleetSupportValidation = {
    createFleetSupportZodSchema,
    updateFleetSupportZodSchema,
};
