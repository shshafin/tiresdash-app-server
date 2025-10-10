"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FleetVehicle = void 0;
const mongoose_1 = require("mongoose");
const fleetVehicleSchema = new mongoose_1.Schema({
    year: {
        type: String,
        required: true,
    },
    make: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    vin: {
        type: String,
        required: true,
        unique: true,
    },
    licensePlate: {
        type: String,
        required: true,
        unique: true,
    },
    tireSize: {
        type: String,
        required: true,
    },
    note: {
        type: String,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.FleetVehicle = (0, mongoose_1.model)("FleetVehicle", fleetVehicleSchema);
