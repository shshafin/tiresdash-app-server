"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleType = void 0;
const mongoose_1 = require("mongoose");
const VehicleTypeSchema = new mongoose_1.Schema({
    vehicleType: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.VehicleType = (0, mongoose_1.model)("VehicleType", VehicleTypeSchema);
