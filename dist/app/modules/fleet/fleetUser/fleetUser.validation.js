"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FleetUserValidation = void 0;
const zod_1 = require("zod");
const additionalServicesOptions = [
    "Coast Fuel Savings",
    "Discount Tire Telematics by Motorq",
    // "Revvo Smart Tire",
    "Roadside Assistance by NSD",
    "Spiffy Mobile Oil Change Service",
];
const createFleetUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        buisnessName: zod_1.z.string({
            required_error: "Business name is required",
        }),
        state: zod_1.z.string({
            required_error: "State is required",
        }),
        city: zod_1.z.string({
            required_error: "City is required",
        }),
        numberOfbuisnessYear: zod_1.z.string({
            required_error: "Number of business years is required",
        }),
        numberOFvehicles: zod_1.z.string().refine((val) => parseInt(val) >= 5, {
            message: "Number of vehicles must be at least 5",
        }),
        moreLocation: zod_1.z.boolean({
            required_error: "More location status is required",
        }),
        centralLocation: zod_1.z.boolean({
            required_error: "Central location status is required",
        }),
        fleetProgram: zod_1.z.enum(["Fleet Sales Specialist", "Store", "Website", "Other"], {
            required_error: "Fleet program is required",
        }),
        preferredLocation: zod_1.z.boolean({
            required_error: "Preferred location status is required",
        }),
        additionalServices: zod_1.z
            .array(zod_1.z.enum(additionalServicesOptions))
            .optional(),
        firstName: zod_1.z.string({
            required_error: "First name is required",
        }),
        lastName: zod_1.z.string({
            required_error: "Last name is required",
        }),
        title: zod_1.z.string({
            required_error: "Title is required",
        }),
        phone: zod_1.z.string({
            required_error: "Phone number is required",
        }),
        phoneExtension: zod_1.z.string().optional(),
        email: zod_1.z
            .string({
            required_error: "Email is required",
        })
            .email(),
        password: zod_1.z
            .string({
            required_error: "Password is required",
        })
            .min(6, "Password must be at least 6 characters"),
        AdditionalComments: zod_1.z.string().optional(),
    }),
});
const updateFleetUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        buisnessName: zod_1.z.string().optional(),
        state: zod_1.z.string().optional(),
        city: zod_1.z.string().optional(),
        numberOfbuisnessYear: zod_1.z.string().optional(),
        numberOFvehicles: zod_1.z
            .string()
            .refine((val) => parseInt(val) >= 5, {
            message: "Number of vehicles must be at least 5",
        })
            .optional(),
        moreLocation: zod_1.z.boolean().optional(),
        centralLocation: zod_1.z.boolean().optional(),
        fleetProgram: zod_1.z
            .enum(["Fleet Sales Specialist", "Store", "Website", "Other"])
            .optional(),
        preferredLocation: zod_1.z.boolean().optional(),
        additionalServices: zod_1.z
            .array(zod_1.z.enum(additionalServicesOptions))
            .optional(),
        firstName: zod_1.z.string().optional(),
        lastName: zod_1.z.string().optional(),
        title: zod_1.z.string().optional(),
        phone: zod_1.z.string().optional(),
        phoneExtension: zod_1.z.string().optional(),
        email: zod_1.z.string().email().optional(),
        password: zod_1.z
            .string()
            .min(6, "Password must be at least 6 characters")
            .optional(),
        AdditionalComments: zod_1.z.string().optional(),
    }),
});
const loginZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            required_error: "Email is required",
        }),
        password: zod_1.z.string({
            required_error: "Password is required",
        }),
    }),
});
exports.FleetUserValidation = {
    createFleetUserZodSchema,
    updateFleetUserZodSchema,
    loginZodSchema,
};
