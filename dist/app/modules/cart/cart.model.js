"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = void 0;
const mongoose_1 = require("mongoose");
const cartSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    userType: {
        type: String,
        enum: ["user", "fleet_user"],
        required: true,
    },
    items: [
        {
            product: {
                type: mongoose_1.Schema.Types.ObjectId,
                required: true,
                refPath: "items.productType",
            },
            productType: {
                type: String,
                enum: ["tire", "wheel", "product"],
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
            price: {
                type: Number,
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            thumbnail: {
                type: String,
            },
        },
    ],
    totalPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    totalItems: {
        type: Number,
        required: true,
        default: 0,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
// Calculate total price before saving
cartSchema.pre("save", function (next) {
    this.totalPrice = this.items.reduce((total, item) => total + item.price * item.quantity, 0);
    this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
    next();
});
exports.Cart = (0, mongoose_1.model)("Cart", cartSchema);
