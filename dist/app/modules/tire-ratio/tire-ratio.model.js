"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TireRatio = void 0;
const mongoose_1 = require("mongoose");
const TireRatioSchema = new mongoose_1.Schema({
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
exports.TireRatio = (0, mongoose_1.model)("TireRatio", TireRatioSchema);
