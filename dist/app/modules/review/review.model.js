"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        unique: true,
    },
    userType: {
        type: String,
        enum: ["user", "fleet_user"],
        required: true,
    },
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    productType: {
        type: String,
        enum: ["tire", "wheel", "product"],
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        maxlength: 500,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            delete ret.__v;
            return ret;
        },
    },
});
// Prevent duplicate reviews from same user for same product
reviewSchema.index({ user: 1, product: 1, productType: 1 }, { unique: true });
exports.Review = (0, mongoose_1.model)("Review", reviewSchema);
