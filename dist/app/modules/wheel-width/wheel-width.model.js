"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WheelWidth = void 0;
const mongoose_1 = require("mongoose");
const WheelWidthSchema = new mongoose_1.Schema({
    width: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.WheelWidth = (0, mongoose_1.model)("WheelWidth", WheelWidthSchema);
