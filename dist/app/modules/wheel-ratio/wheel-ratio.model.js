"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WheelRatio = void 0;
const mongoose_1 = require("mongoose");
const WheelRatioSchema = new mongoose_1.Schema({
    ratio: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.WheelRatio = (0, mongoose_1.model)("WheelRatio", WheelRatioSchema);
