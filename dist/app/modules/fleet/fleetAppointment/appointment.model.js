"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FleetAppointment = void 0;
const mongoose_1 = require("mongoose");
const fleetAppointmentSchema = new mongoose_1.Schema({
    fleetUser: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "FleetUser",
        required: true,
    },
    fleetVehicle: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "FleetVehicle",
        required: true,
    },
    serviceType: {
        type: String,
        required: true,
        enum: ["Tire Replacement", "Flat Repair", "Balance", "Rotation", "Other"],
    },
    date: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
    },
    files: {
        type: [String],
        default: [],
    },
    status: {
        type: String,
        enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
        default: "Pending",
    },
    assignedTo: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    estimatedDuration: {
        type: Number, // in minutes
    },
    costEstimate: {
        type: Number,
    },
    fleetRef: {
        phone: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        note: {
            type: String,
            trim: true,
        },
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.FleetAppointment = (0, mongoose_1.model)("FleetAppointment", fleetAppointmentSchema);
