"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wheel = void 0;
const mongoose_1 = require("mongoose");
const WheelSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    drivingType: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "DrivingType",
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
    tireSize: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "TireSize",
        required: true,
    },
    brand: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Brand",
        required: true,
    },
    width: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "WheelWidth",
    },
    ratio: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "WheelRatio",
    },
    diameter: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "WheelDiameter",
    },
    vehicleType: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "VehicleType",
    },
    widthType: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "WheelWidthType",
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    description: {
        type: String,
    },
    images: {
        type: [String],
        default: [],
    },
    productLine: {
        type: [String],
        default: [],
    },
    unitName: {
        type: String,
    },
    grossWeight: {
        type: String,
    },
    conditionInfo: {
        type: String,
    },
    GTIN: {
        type: String,
    },
    ATVOffset: {
        type: String,
    },
    BoltsQuantity: {
        type: String,
    },
    wheelColor: {
        type: String,
    },
    hubBore: {
        type: String,
    },
    materialType: {
        type: String,
    },
    wheelSize: {
        type: String,
    },
    wheelAccent: {
        type: String,
    },
    wheelPieces: {
        type: String,
    },
    rimWidth: {
        type: Number,
        required: true,
    },
    boltPattern: {
        type: String,
        required: true,
    },
    offset: {
        type: Number,
        required: true,
    },
    hubBoreSize: {
        type: Number,
        required: true,
    },
    numberOFBolts: {
        type: Number,
        required: true,
    },
    loadCapacity: {
        type: Number,
        required: true,
    },
    loadRating: {
        type: Number,
    },
    finish: {
        type: String,
        required: true,
    },
    warranty: {
        type: String,
        required: true,
    },
    constructionType: {
        type: String,
        required: true,
    },
    wheelType: {
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
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
// Add text index for search
WheelSchema.index({
    name: "text",
    description: "text",
    wheelType: "text",
    constructionType: "text",
});
exports.Wheel = (0, mongoose_1.model)("Wheel", WheelSchema);
