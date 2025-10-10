"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deal = void 0;
const mongoose_1 = require("mongoose");
const DealSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    discountPercentage: { type: Number, required: true },
    applicableProducts: {
        type: [String],
        enum: ["tire", "wheel", "product"], // Specifies if the deal applies to tire, wheel, or general product
    },
    brand: { type: mongoose_1.Schema.Types.ObjectId, ref: "Brand", required: true },
    validFrom: { type: Date, required: true },
    validTo: { type: Date, required: true },
}, {
    timestamps: true,
});
exports.Deal = (0, mongoose_1.model)("Deal", DealSchema);
