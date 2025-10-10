"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FleetSupport = void 0;
const mongoose_1 = require("mongoose");
const fleetSupportSchema = new mongoose_1.Schema({
    issueType: {
        type: String,
        required: true,
        enum: [
            "Billing Question",
            "Service Issue",
            "Account Access",
            "Technical Problem",
            "Appointment Scheduling",
            "Fleet Management",
            "Other",
        ],
    },
    priority: {
        type: String,
        required: true,
        enum: [
            "Low-General inquiry",
            "Medium-Service needed",
            "High-Urgent issue",
            "Critical-Emergency",
        ],
    },
    subject: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    report: {
        type: String,
        required: false,
    },
    files: {
        type: [String],
        default: [],
    },
    status: {
        type: String,
        enum: ["Open", "In Progress", "Resolved", "Closed"],
        default: "Open",
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "FleetUser",
        required: false, // Optional, can be set later
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.FleetSupport = (0, mongoose_1.model)("FleetSupport", fleetSupportSchema);
