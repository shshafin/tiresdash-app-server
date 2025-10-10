"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TireDiameter = void 0;
const mongoose_1 = require("mongoose");
const TireDiameterSchema = new mongoose_1.Schema({
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
exports.TireDiameter = (0, mongoose_1.model)("TireDiameter", TireDiameterSchema);
