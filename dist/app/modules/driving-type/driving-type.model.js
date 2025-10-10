"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrivingType = void 0;
const mongoose_1 = require("mongoose");
const DrivingTypeSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    subTitle: {
        type: String,
        required: true,
    },
    options: {
        type: [String],
        required: true,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.DrivingType = (0, mongoose_1.model)("DrivingType", DrivingTypeSchema);
