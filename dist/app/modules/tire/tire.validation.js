"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TireValidation = void 0;
const zod_1 = require("zod");
const createTireZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            required_error: "Name is required",
        })
            .trim(),
        year: zod_1.z.string({
            required_error: "Year is required",
        }),
        make: zod_1.z.string({
            required_error: "Make is required",
        }),
        model: zod_1.z.string({
            required_error: "Model is required",
        }),
        trim: zod_1.z.string({
            required_error: "Trim is required",
        }),
        tireSize: zod_1.z.string({
            required_error: "Tire size is required",
        }),
        drivingType: zod_1.z.string({
            required_error: "driving type is required",
        }),
        brand: zod_1.z.string({
            required_error: "Brand is required",
        }),
        category: zod_1.z.string({
            required_error: "Category is required",
        }),
        description: zod_1.z.string().optional(),
        images: zod_1.z.array(zod_1.z.string()).optional(),
        productLine: zod_1.z.string().optional(),
        unitName: zod_1.z.string().optional(),
        conditionInfo: zod_1.z.string().optional(),
        grossWeightRange: zod_1.z.string().optional(),
        gtinRange: zod_1.z.string().optional(),
        loadIndexRange: zod_1.z.string().optional(),
        mileageWarrantyRange: zod_1.z.string().optional(),
        maxAirPressureRange: zod_1.z.string().optional(),
        speedRatingRange: zod_1.z.string().optional(),
        sidewallDescriptionRange: zod_1.z.string().optional(),
        temperatureGradeRange: zod_1.z.string().optional(),
        sectionWidthRange: zod_1.z.string().optional(),
        diameterRange: zod_1.z.number().optional(),
        wheelRimDiameterRange: zod_1.z.string().optional(),
        tractionGradeRange: zod_1.z.string().optional(),
        treadDepthRange: zod_1.z.string().optional(),
        treadWidthRange: zod_1.z.string().optional(),
        overallWidthRange: zod_1.z.string().optional(),
        treadwearGradeRange: zod_1.z.string().optional(),
        sectionWidth: zod_1.z.number({
            required_error: "Section width is required",
        }),
        aspectRatio: zod_1.z.number({
            required_error: "Aspect ratio is required",
        }),
        rimDiameter: zod_1.z.number({
            required_error: "Rim diameter is required",
        }),
        overallDiameter: zod_1.z.number({
            required_error: "Overall diameter is required",
        }),
        rimWidthRange: zod_1.z.number({
            required_error: "Rim width range is required",
        }),
        width: zod_1.z.number({
            required_error: "Width is required",
        }),
        treadDepth: zod_1.z.number({
            required_error: "Tread depth is required",
        }),
        loadIndex: zod_1.z.number({
            required_error: "Load index is required",
        }),
        loadRange: zod_1.z.string({
            required_error: "Load range is required",
        }),
        maxPSI: zod_1.z.number({
            required_error: "Max PSI is required",
        }),
        warranty: zod_1.z.string({
            required_error: "Warranty is required",
        }),
        aspectRatioRange: zod_1.z.string({
            required_error: "Aspect ratio range is required",
        }),
        treadPattern: zod_1.z.string({
            required_error: "Tread pattern is required",
        }),
        loadCapacity: zod_1.z.number({
            required_error: "Load capacity is required",
        }),
        constructionType: zod_1.z.string({
            required_error: "Construction type is required",
        }),
        tireType: zod_1.z.string({
            required_error: "Tire type is required",
        }),
        price: zod_1.z.number({
            required_error: "Price is required",
        }),
        discountPrice: zod_1.z.number().optional(),
        stockQuantity: zod_1.z.number({
            required_error: "Stock quantity is required",
        }),
    }),
});
const updateTireZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().trim().optional(),
        year: zod_1.z.string().optional(),
        make: zod_1.z.string().optional(),
        model: zod_1.z.string().optional(),
        trim: zod_1.z.string().optional(),
        tireSize: zod_1.z.string().optional(),
        brand: zod_1.z.string().optional(),
        category: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        images: zod_1.z.array(zod_1.z.string()).optional(),
        productLine: zod_1.z.string().optional(),
        unitName: zod_1.z.string().optional(),
        conditionInfo: zod_1.z.string().optional(),
        grossWeightRange: zod_1.z.string().optional(),
        gtinRange: zod_1.z.string().optional(),
        loadIndexRange: zod_1.z.string().optional(),
        mileageWarrantyRange: zod_1.z.string().optional(),
        maxAirPressureRange: zod_1.z.string().optional(),
        speedRatingRange: zod_1.z.string().optional(),
        sidewallDescriptionRange: zod_1.z.string().optional(),
        temperatureGradeRange: zod_1.z.string().optional(),
        sectionWidthRange: zod_1.z.string().optional(),
        diameterRange: zod_1.z.number().optional(),
        wheelRimDiameterRange: zod_1.z.string().optional(),
        tractionGradeRange: zod_1.z.string().optional(),
        treadDepthRange: zod_1.z.string().optional(),
        treadWidthRange: zod_1.z.string().optional(),
        overallWidthRange: zod_1.z.string().optional(),
        treadwearGradeRange: zod_1.z.string().optional(),
        sectionWidth: zod_1.z.number().optional(),
        aspectRatio: zod_1.z.number().optional(),
        rimDiameter: zod_1.z.number().optional(),
        overallDiameter: zod_1.z.number().optional(),
        rimWidthRange: zod_1.z.number().optional(),
        width: zod_1.z.number().optional(),
        treadDepth: zod_1.z.number().optional(),
        loadIndex: zod_1.z.number().optional(),
        loadRange: zod_1.z.string().optional(),
        maxPSI: zod_1.z.number().optional(),
        warranty: zod_1.z.string().optional(),
        aspectRatioRange: zod_1.z.string().optional(),
        treadPattern: zod_1.z.string().optional(),
        loadCapacity: zod_1.z.number().optional(),
        constructionType: zod_1.z.string().optional(),
        tireType: zod_1.z.string().optional(),
        price: zod_1.z.number().optional(),
        discountPrice: zod_1.z.number().optional(),
        stockQuantity: zod_1.z.number().optional(),
    }),
});
exports.TireValidation = {
    createTireZodSchema,
    updateTireZodSchema,
};
