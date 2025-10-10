"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = require("mongoose");
const ProductSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discountPrice: {
        type: Number,
    },
    stockQuantity: {
        type: Number,
        required: true,
    },
    sku: {
        type: String,
        required: true,
        unique: true,
    },
    images: [String],
    thumbnail: {
        type: String,
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    brand: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Brand",
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
// Calculate average rating
ProductSchema.methods.calculateAverageRating = function () {
    if (this.ratings && this.ratings.length > 0) {
        const totalRating = this.ratings.reduce((acc, rating) => acc + rating.value, 0);
        this.averageRating = totalRating / this.ratings.length;
    }
};
// Index for product name and slug
ProductSchema.index({ name: 1, slug: 1 }, { unique: true });
exports.Product = (0, mongoose_1.model)("Product", ProductSchema);
