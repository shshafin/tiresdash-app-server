"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wishlist = void 0;
const mongoose_1 = require("mongoose");
const wishlistSchema = new mongoose_1.Schema({
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
    items: [
        {
            product: { type: mongoose_1.Schema.Types.ObjectId, required: true },
            productType: {
                type: String,
                enum: ["tire", "wheel", "product"],
                required: true,
            },
        },
    ],
}, { timestamps: true });
exports.Wishlist = (0, mongoose_1.model)("Wishlist", wishlistSchema);
