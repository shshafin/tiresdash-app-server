"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WheelDiameter = void 0;
const mongoose_1 = require("mongoose");
const WheelDiameterSchema = new mongoose_1.Schema({
    diameter: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.WheelDiameter = (0, mongoose_1.model)("WheelDiameter", WheelDiameterSchema);
