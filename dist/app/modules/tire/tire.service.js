"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TireService = void 0;
const tire_model_1 = require("./tire.model");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const mongoose_1 = require("mongoose");
const tire_constants_1 = require("./tire.constants");
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const year_model_1 = require("../year/year.model");
const make_model_1 = require("../makes/make.model");
const model_model_1 = require("../models/model.model");
const trim_model_1 = require("../trims/trim.model");
const tire_size_model_1 = require("../tire-size/tire-size.model");
const brand_model_1 = require("../brand/brand.model");
const category_model_1 = require("../category/category.model");
const driving_type_model_1 = require("../driving-type/driving-type.model");
const tire_width_model_1 = require("../tire-width/tire-width.model");
const tire_ratio_model_1 = require("../tire-ratio/tire-ratio.model");
const tire_diameter_model_1 = require("../tire-diameter/tire-diameter.model");
const vehicle_type_model_1 = require("../vehicle-type/vehicle-type.model");
const createTire = (tireData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tire_model_1.Tire.create(tireData);
    return result;
});
const getAllTires = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: tire_constants_1.tireSearchableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: "i",
                },
            })),
        });
    }
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => {
                // Handle ObjectId fields
                if ([
                    "year",
                    "make",
                    "model",
                    "trim",
                    "tireSize",
                    "drivingType",
                    "brand",
                    "category",
                    "width",
                    "ratio",
                    "diameter",
                    "vehicleType",
                ].includes(field)) {
                    return { [field]: new mongoose_1.Types.ObjectId(String(value)) };
                }
                // Handle numeric fields
                if (field === "price" ||
                    field === "stockQuantity" ||
                    field === "sectionWidth" ||
                    field === "rimDiameter" ||
                    field === "loadIndex") {
                    return { [field]: Number(value) };
                }
                // Handle other fields
                return { [field]: value };
            }),
        });
    }
    // Rest of your code remains the same...
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield tire_model_1.Tire.find(whereConditions)
        .populate("year")
        .populate("make")
        .populate("model")
        .populate("trim")
        .populate("tireSize")
        .populate("drivingType")
        .populate("brand")
        .populate("category")
        .populate("width")
        .populate("ratio")
        .populate("diameter")
        .populate("vehicleType")
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield tire_model_1.Tire.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getSingleTire = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tire_model_1.Tire.findById(id).populate("year make model trim tireSize brand category drivingType width ratio diameter vehicleType");
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Tire not found");
    }
    return result;
});
const updateTire = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield tire_model_1.Tire.findById(id);
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Tire not found");
    }
    const result = yield tire_model_1.Tire.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    })
        .populate("year")
        .populate("make")
        .populate("model")
        .populate("trim")
        .populate("tireSize")
        .populate("drivingType")
        .populate("brand")
        .populate("category")
        .populate("width")
        .populate("ratio")
        .populate("diameter")
        .populate("vehicleType");
    return result;
});
const deleteTire = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tire_model_1.Tire.findByIdAndDelete(id);
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Tire not found");
    }
    return result;
});
const parseNumber = (value, defaultValue = 0) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
};
const uploadCSVTires = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    const results = [];
    yield new Promise((resolve, reject) => {
        fs_1.default.createReadStream(filePath)
            .pipe((0, csv_parser_1.default)())
            .on("data", (row) => results.push(row))
            .on("end", resolve)
            .on("error", reject);
    });
    for (const row of results) {
        try {
            const year = yield year_model_1.Year.findOneAndUpdate({ year: parseInt(row.year) }, { $setOnInsert: { year: parseInt(row.year) } }, { upsert: true, new: true });
            const make = yield make_model_1.Make.findOneAndUpdate({ make: row.make }, { $setOnInsert: { make: row.make, logo: row.logo || "" } }, { upsert: true, new: true });
            const model = yield model_model_1.CarModel.findOneAndUpdate({ model: row.model, make: make._id, year: year._id }, { $setOnInsert: { model: row.model, make: make._id, year: year._id } }, { upsert: true, new: true });
            const trim = yield trim_model_1.Trim.findOneAndUpdate({ trim: row.trim, model: model._id, make: make._id, year: year._id }, {
                $setOnInsert: {
                    trim: row.trim,
                    model: model._id,
                    make: make._id,
                    year: year._id,
                },
            }, { upsert: true, new: true });
            const tireSize = yield tire_size_model_1.TireSize.findOneAndUpdate({
                tireSize: row.tireSize,
                model: model._id,
                make: make._id,
                year: year._id,
                trim: trim._id,
            }, {
                $setOnInsert: {
                    tireSize: row.tireSize,
                    trim: trim._id,
                    model: model._id,
                    make: make._id,
                    year: year._id,
                },
            }, { upsert: true, new: true });
            const brand = yield brand_model_1.Brand.findOneAndUpdate({ name: row.brand }, {
                $setOnInsert: {
                    name: row.brand,
                    description: row.brandDescription || "",
                    logo: row.brandLogo || "",
                },
            }, { upsert: true, new: true });
            const category = yield category_model_1.Category.findOneAndUpdate({ name: row.category }, {
                $setOnInsert: {
                    name: row.category,
                    slug: row.categorySlug || row.category.toLowerCase(),
                    isActive: true,
                },
            }, { upsert: true, new: true });
            const drivingType = yield driving_type_model_1.DrivingType.findOneAndUpdate({
                title: row.drivingTypeTitle,
                subTitle: row.drivingTypeSubTitle,
            }, {
                $setOnInsert: {
                    title: row.drivingTypeTitle,
                    subTitle: row.drivingTypeSubTitle,
                    options: row.drivingTypeOptions
                        ? row.drivingTypeOptions.split(",")
                        : [],
                },
            }, { upsert: true, new: true });
            const width = yield tire_width_model_1.TireWidth.findOneAndUpdate({ width: row.width }, { $setOnInsert: { width: row.width } }, { upsert: true, new: true });
            const ratio = yield tire_ratio_model_1.TireRatio.findOneAndUpdate({ ratio: row.ratio }, { $setOnInsert: { ratio: row.ratio } }, { upsert: true, new: true });
            const diameter = yield tire_diameter_model_1.TireDiameter.findOneAndUpdate({ diameter: row.diameter }, { $setOnInsert: { diameter: row.diameter } }, { upsert: true, new: true });
            const vehicleType = yield vehicle_type_model_1.VehicleType.findOneAndUpdate({ vehicleType: row.vehicleType }, { $setOnInsert: { vehicleType: row.vehicleType } }, { upsert: true, new: true });
            yield tire_model_1.Tire.findOneAndUpdate({
                name: row.name,
                year: year._id,
                make: make._id,
                model: model._id,
                trim: trim._id,
                tireSize: tireSize._id,
                drivingType: drivingType === null || drivingType === void 0 ? void 0 : drivingType._id,
            }, {
                $setOnInsert: {
                    name: row.name,
                    year: year._id,
                    make: make._id,
                    model: model._id,
                    trim: trim._id,
                    tireSize: tireSize._id,
                    drivingType: drivingType === null || drivingType === void 0 ? void 0 : drivingType._id,
                    brand: brand._id,
                    category: category._id,
                    width: width._id,
                    ratio: ratio._id,
                    diameter: diameter._id,
                    vehicleType: vehicleType._id,
                    description: row.description || "",
                    images: row.images ? row.images.split(",") : [],
                    productLine: row.productLine || "",
                    unitName: row.unitName || "",
                    conditionInfo: row.conditionInfo || "",
                    grossWeightRange: row.grossWeightRange || "",
                    gtinRange: row.gtinRange || "",
                    loadIndexRange: row.loadIndexRange || "",
                    mileageWarrantyRange: row.mileageWarrantyRange || "",
                    maxAirPressureRange: row.maxAirPressureRange || "",
                    speedRatingRange: row.speedRatingRange || "",
                    sidewallDescriptionRange: row.sidewallDescriptionRange || "",
                    temperatureGradeRange: row.temperatureGradeRange || "",
                    sectionWidthRange: row.sectionWidthRange || "",
                    wheelRimDiameterRange: row.wheelRimDiameterRange || "",
                    tractionGradeRange: row.tractionGradeRange || "",
                    treadDepthRange: row.treadDepthRange || "",
                    treadWidthRange: row.treadWidthRange || "",
                    overallWidthRange: row.overallWidthRange || "",
                    treadwearGradeRange: row.treadwearGradeRange || "",
                    sectionWidth: parseNumber(row.sectionWidth),
                    overallDiameter: parseNumber(row.overallDiameter),
                    rimWidthRange: parseNumber(row.rimWidthRange),
                    treadDepth: parseNumber(row.treadDepth),
                    loadIndex: parseNumber(row.loadIndex),
                    loadRange: row.loadRange || "",
                    maxPSI: parseNumber(row.maxPSI),
                    warranty: row.warranty || "",
                    aspectRatioRange: row.aspectRatioRange || "",
                    treadPattern: row.treadPattern || "",
                    loadCapacity: parseNumber(row.loadCapacity),
                    constructionType: row.constructionType || "",
                    tireType: row.tireType || "",
                    price: parseNumber(row.price),
                    discountPrice: parseNumber(row.discountPrice),
                    stockQuantity: parseNumber(row.stockQuantity),
                },
            }, { upsert: true });
        }
        catch (error) {
            console.error(`Error processing row: ${JSON.stringify(row)}`, error);
        }
    }
    return { message: "CSV data processed successfully" };
});
exports.TireService = {
    createTire,
    getAllTires,
    getSingleTire,
    updateTire,
    deleteTire,
    uploadCSVTires,
};
