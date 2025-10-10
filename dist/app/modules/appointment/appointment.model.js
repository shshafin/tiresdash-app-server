"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appointment = void 0;
const mongoose_1 = require("mongoose");
const AppointmentSchema = new mongoose_1.Schema({
    services: {
        mostPopularServices: {
            newTireWheelConsultation: {
                type: Boolean,
                required: true,
            },
            tireInspection: {
                type: Boolean,
                required: true,
            },
            tireRotationAndBalance: {
                type: Boolean,
                required: true,
            },
            flatRepair: {
                type: Boolean,
                required: true,
            },
        },
        otherServices: {
            webOrderInstallationPickUp: {
                type: Boolean,
                required: true,
            },
            tirePressureMonitoringSystemService: {
                type: Boolean,
                required: true,
            },
            winterTireChange: {
                type: Boolean,
                required: true,
            },
            tireBalancing: {
                type: Boolean,
                required: true,
            },
            fleetServices: {
                type: Boolean,
                required: true,
            },
            wiperBladeServices: {
                type: Boolean,
                required: true,
            },
        },
        additionalNotes: {
            type: String,
        },
    },
    schedule: {
        date: {
            type: String,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        planTo: {
            type: String,
            enum: ["waitInStore", "dropOff"],
            required: true,
        },
        someoneElseWillBringCar: {
            type: Boolean,
        },
    },
    user: {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        addressLine1: {
            type: String,
            required: true,
        },
        addressLine2: {
            type: String,
        },
        zipCode: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "completed", "cancelled"],
        default: "pending",
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
// Add text index for searching appointments based on user details or services
AppointmentSchema.index({
    "user.firstName": "text",
    "user.lastName": "text",
    "user.email": "text",
    "user.phoneNumber": "text",
    "services.mostPopularServices.newTireWheelConsultation": "text",
    "services.mostPopularServices.flatRepair": "text",
});
exports.Appointment = (0, mongoose_1.model)("Appointment", AppointmentSchema);
