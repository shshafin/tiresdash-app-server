"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const paymentSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    userType: {
        type: String,
        enum: ["user", "fleet_user"],
    },
    cart: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Cart",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    paymentMethod: {
        type: String,
        enum: [
            "paypal",
            "stripe",
            "cash_on_delivery",
            "bank_transfer",
            "credit_card",
            "debit_card",
        ],
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: [
            "pending",
            "processing",
            "completed",
            "failed",
            "refunded",
            "cancelled",
        ],
        default: "pending",
    },
    transactionId: {
        type: String,
    },
    paymentDetails: {
        type: mongoose_1.Schema.Types.Mixed,
    },
    billingAddress: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
    },
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.Payment = (0, mongoose_1.model)("Payment", paymentSchema);
