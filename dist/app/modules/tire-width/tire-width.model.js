"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TireWidth = void 0;
const mongoose_1 = require("mongoose");
const TireWidthSchema = new mongoose_1.Schema({
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
exports.TireWidth = (0, mongoose_1.model)("TireWidth", TireWidthSchema);
