"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WheelValidation = void 0;
const zod_1 = require("zod");
const createWheelZodSchema = zod_1.z.object({
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
            required_error: "Driving type is required",
        }),
        brand: zod_1.z.string({
            required_error: "Brand is required",
        }),
        category: zod_1.z.string({
            required_error: "Category is required",
        }),
        width: zod_1.z.string().optional(),
        ratio: zod_1.z.string().optional(),
        diameter: zod_1.z.string().optional(),
        vehicleType: zod_1.z.string().optional(),
        widthType: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        images: zod_1.z.array(zod_1.z.string()).optional(),
        productLine: zod_1.z.array(zod_1.z.string()).optional(),
        unitName: zod_1.z.string().optional(),
        grossWeight: zod_1.z.string().optional(),
        conditionInfo: zod_1.z.string().optional(),
        GTIN: zod_1.z.string().optional(),
        ATVOffset: zod_1.z.string().optional(),
        BoltsQuantity: zod_1.z.string().optional(),
        wheelColor: zod_1.z.string().optional(),
        hubBore: zod_1.z.string().optional(),
        materialType: zod_1.z.string().optional(),
        wheelSize: zod_1.z.string().optional(),
        wheelAccent: zod_1.z.string().optional(),
        wheelPieces: zod_1.z.string().optional(),
        rimDiameter: zod_1.z.number({
            required_error: "Rim diameter is required",
        }),
        rimWidth: zod_1.z.number({
            required_error: "Rim width is required",
        }),
        boltPattern: zod_1.z.string({
            required_error: "Bolt pattern is required",
        }),
        offset: zod_1.z.number({
            required_error: "Offset is required",
        }),
        hubBoreSize: zod_1.z.number({
            required_error: "Hub bore size is required",
        }),
        numberOFBolts: zod_1.z.number({
            required_error: "Number of bolts is required",
        }),
        loadCapacity: zod_1.z.number({
            required_error: "Load capacity is required",
        }),
        loadRating: zod_1.z.number().optional(),
        finish: zod_1.z.string({
            required_error: "Finish is required",
        }),
        warranty: zod_1.z.string({
            required_error: "Warranty is required",
        }),
        constructionType: zod_1.z.string({
            required_error: "Construction type is required",
        }),
        wheelType: zod_1.z.string({
            required_error: "Wheel type is required",
        }),
        wheelStockQuantity: zod_1.z.number({
            required_error: "Wheel stock quantity is required",
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
const updateWheelZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().trim().optional(),
        year: zod_1.z.string().optional(),
        make: zod_1.z.string().optional(),
        model: zod_1.z.string().optional(),
        trim: zod_1.z.string().optional(),
        tireSize: zod_1.z.string().optional(),
        brand: zod_1.z.string().optional(),
        category: zod_1.z.string().optional(),
        width: zod_1.z.string().optional(),
        ratio: zod_1.z.string().optional(),
        diameter: zod_1.z.string().optional(),
        vehicleType: zod_1.z.string().optional(),
        widthType: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        images: zod_1.z.array(zod_1.z.string()).optional(),
        productLine: zod_1.z.array(zod_1.z.string()).optional(),
        unitName: zod_1.z.string().optional(),
        grossWeight: zod_1.z.string().optional(),
        conditionInfo: zod_1.z.string().optional(),
        GTIN: zod_1.z.string().optional(),
        ATVOffset: zod_1.z.string().optional(),
        BoltsQuantity: zod_1.z.string().optional(),
        wheelColor: zod_1.z.string().optional(),
        hubBore: zod_1.z.string().optional(),
        materialType: zod_1.z.string().optional(),
        wheelSize: zod_1.z.string().optional(),
        wheelAccent: zod_1.z.string().optional(),
        wheelPieces: zod_1.z.string().optional(),
        rimDiameter: zod_1.z.number().optional(),
        rimWidth: zod_1.z.number().optional(),
        boltPattern: zod_1.z.string().optional(),
        offset: zod_1.z.number().optional(),
        hubBoreSize: zod_1.z.number().optional(),
        numberOFBolts: zod_1.z.number().optional(),
        loadCapacity: zod_1.z.number().optional(),
        loadRating: zod_1.z.number().optional(),
        finish: zod_1.z.string().optional(),
        warranty: zod_1.z.string().optional(),
        constructionType: zod_1.z.string().optional(),
        wheelType: zod_1.z.string().optional(),
        wheelStockQuantity: zod_1.z.number().optional(),
        price: zod_1.z.number().optional(),
        discountPrice: zod_1.z.number().optional(),
        stockQuantity: zod_1.z.number().optional(),
    }),
});
exports.WheelValidation = {
    createWheelZodSchema,
    updateWheelZodSchema,
};
