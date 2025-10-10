"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DealDeep = void 0;
const mongoose_1 = require("mongoose");
const DealSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    discountType: {
        type: String,
        enum: ["percentage", "fixed"],
        required: true,
    },
    discountValue: {
        type: Number,
        required: true,
        min: [0, "Discount cannot be negative"],
    },
    brand: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Brand",
        required: true,
    },
    applyTo: {
        tires: { type: Boolean, default: false },
        wheels: { type: Boolean, default: false },
        products: { type: Boolean, default: false },
    },
    minOrderAmount: {
        type: Number,
        default: 0,
        min: [0, "Minimum order amount cannot be negative"],
    },
    maxDiscount: {
        type: Number,
        min: [0, "Max discount cannot be negative"],
    },
    startDate: { type: Date, required: true },
    endDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value > this.startDate;
            },
            message: "End date must be after start date",
        },
    },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
// Indexes for performance
DealSchema.index({ brand: 1, isActive: 1 });
DealSchema.index({ startDate: 1, endDate: 1 });
exports.DealDeep = (0, mongoose_1.model)("DealDeep", DealSchema);
