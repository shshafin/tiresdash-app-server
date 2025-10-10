"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WheelWidthType = void 0;
const mongoose_1 = require("mongoose");
const WheelWidthTypeSchema = new mongoose_1.Schema({
    widthType: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.WheelWidthType = (0, mongoose_1.model)("WheelWidthType", WheelWidthTypeSchema);
