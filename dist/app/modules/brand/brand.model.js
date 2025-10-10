"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Brand = void 0;
const mongoose_1 = require("mongoose");
const BrandSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    description: {
        type: String,
        default: null,
    },
    logo: {
        type: String,
        default: null,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.Brand = (0, mongoose_1.model)("Brand", BrandSchema);
