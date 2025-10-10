"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tire = void 0;
const mongoose_1 = require("mongoose");
const TireSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
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
    drivingType: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "DrivingType",
        required: true,
    },
    brand: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Brand",
        required: true,
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    width: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "TireWidth",
        required: true,
    },
    ratio: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "TireRatio",
        required: true,
    },
    diameter: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "TireDiameter",
        required: true,
    },
    vehicleType: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "VehicleType",
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
        type: String,
    },
    unitName: {
        type: String,
    },
    conditionInfo: {
        type: String,
    },
    grossWeightRange: {
        type: String,
    },
    gtinRange: {
        type: String,
    },
    loadIndexRange: {
        type: String,
    },
    mileageWarrantyRange: {
        type: String,
    },
    maxAirPressureRange: {
        type: String,
    },
    speedRatingRange: {
        type: String,
    },
    sidewallDescriptionRange: {
        type: String,
    },
    temperatureGradeRange: {
        type: String,
    },
    sectionWidthRange: {
        type: String,
    },
    wheelRimDiameterRange: {
        type: String,
    },
    tractionGradeRange: {
        type: String,
    },
    treadDepthRange: {
        type: String,
    },
    treadWidthRange: {
        type: String,
    },
    overallWidthRange: {
        type: String,
    },
    treadwearGradeRange: {
        type: String,
    },
    sectionWidth: {
        type: Number,
        required: true,
    },
    overallDiameter: {
        type: Number,
        required: true,
    },
    rimWidthRange: {
        type: Number,
        required: true,
    },
    treadDepth: {
        type: Number,
        required: true,
    },
    loadIndex: {
        type: Number,
        required: true,
    },
    loadRange: {
        type: String,
        required: true,
    },
    maxPSI: {
        type: Number,
        required: true,
    },
    warranty: {
        type: String,
        required: true,
    },
    aspectRatioRange: {
        type: String,
        required: true,
    },
    treadPattern: {
        type: String,
        required: true,
    },
    loadCapacity: {
        type: Number,
        required: true,
    },
    constructionType: {
        type: String,
        required: true,
    },
    tireType: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discountPrice: {
        type: Number,
        required: false,
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
TireSchema.index({
    name: "text",
    description: "text",
    tireType: "text",
    constructionType: "text",
});
exports.Tire = (0, mongoose_1.model)("Tire", TireSchema);
