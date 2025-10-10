"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FleetNews = void 0;
const mongoose_1 = require("mongoose");
const fleetNewsSchema = new mongoose_1.Schema({
    badge: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["featured", "recent"],
        default: "recent",
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.FleetNews = (0, mongoose_1.model)("FleetNews", fleetNewsSchema);
