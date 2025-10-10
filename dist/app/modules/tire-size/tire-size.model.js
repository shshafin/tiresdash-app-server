"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TireSize = void 0;
const mongoose_1 = require("mongoose");
const TireSizeSchema = new mongoose_1.Schema({
    tireSize: {
        type: String,
        required: true,
    },
    year: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Year",
        required: true,
    },
    make: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Make",
        required: true,
    },
    model: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "CarModel",
        required: true,
    },
    trim: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Trim",
        required: true,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
// Indexes
// ModelSchema.index({ name: 1, make: 1, year: 1 }, { unique: true });
exports.TireSize = (0, mongoose_1.model)("TireSize", TireSizeSchema);
