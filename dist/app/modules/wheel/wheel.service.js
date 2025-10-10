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
exports.WheelService = void 0;
const wheel_model_1 = require("./wheel.model");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const mongoose_1 = require("mongoose");
const wheel_constants_1 = require("./wheel.constants");
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
const wheel_width_model_1 = require("../wheel-width/wheel-width.model");
const wheel_ratio_model_1 = require("../wheel-ratio/wheel-ratio.model");
const wheel_diameter_model_1 = require("../wheel-diameter/wheel-diameter.model");
const vehicle_type_model_1 = require("../vehicle-type/vehicle-type.model");
const wheel_width_type_model_1 = require("../wheel-width-type/wheel-width-type.model");
const createWheel = (wheelData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield wheel_model_1.Wheel.create(wheelData);
    return result;
});
const getAllWheels = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: wheel_constants_1.wheelSearchableFields.map((field) => ({
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
                    "widthType",
                ].includes(field)) {
                    if (!mongoose_1.Types.ObjectId.isValid(String(value))) {
                        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Invalid ${field} ID`);
                    }
                    return { [field]: new mongoose_1.Types.ObjectId(String(value)) };
                }
                if (field === "price" ||
                    field === "stockQuantity" ||
                    field === "rimDiameter" ||
                    field === "rimWidth" ||
                    field === "offset" ||
                    field === "hubBoreSize" ||
                    field === "numberOFBolts" ||
                    field === "loadCapacity") {
                    return { [field]: Number(value) };
                }
                return { [field]: value };
            }),
        });
    }
    // Sorting
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    // Database query
    const result = yield wheel_model_1.Wheel.find(whereConditions)
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
        .populate("widthType")
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield wheel_model_1.Wheel.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getSingleWheel = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield wheel_model_1.Wheel.findById(id).populate("year make model trim tireSize brand category drivingType width ratio diameter vehicleType widthType");
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Wheel not found");
    }
    return result;
});
const updateWheel = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield wheel_model_1.Wheel.findById(id);
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Wheel not found");
    }
    const result = yield wheel_model_1.Wheel.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    }).populate([
        { path: "year", select: "year" },
        { path: "make", select: "name" },
        { path: "model", select: "name" },
        { path: "trim", select: "name" },
        { path: "tireSize", select: "size" },
        { path: "drivingType", select: "title" },
        { path: "brand", select: "name" },
        { path: "width", select: "width" },
        { path: "ratio", select: "ratio" },
        { path: "diameter", select: "diameter" },
        { path: "vehicleType", select: "vehicleType" },
        { path: "widthType", select: "widthType" },
    ]);
    return result;
});
const deleteWheel = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield wheel_model_1.Wheel.findByIdAndDelete(id);
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Wheel not found");
    }
    return result;
});
// const uploadWheelCSV = async (filePath: string): Promise<any> => {
//   const results: any[] = [];
//   // Read the CSV file
//   await new Promise<void>((resolve, reject) => {
//     fs.createReadStream(filePath)
//       .pipe(csv())
//       .on("data", (row) => results.push(row))
//       .on("end", resolve)
//       .on("error", reject);
//   });
//   // Iterate over each row of CSV data
//   for (const row of results) {
//     try {
//       // Look up or insert the Year
//       const year = await Year.findOneAndUpdate(
//         { year: parseInt(row.year) },
//         { $setOnInsert: { year: parseInt(row.year) } },
//         { upsert: true, new: true }
//       );
//       // Look up or insert the Make
//       const make = await Make.findOneAndUpdate(
//         { make: row.make },
//         { $setOnInsert: { make: row.make, logo: row.logo || "" } },
//         { upsert: true, new: true }
//       );
//       // Look up or insert the Car Model
//       const model = await CarModel.findOneAndUpdate(
//         { model: row.model, make: make._id, year: year._id },
//         { $setOnInsert: { model: row.model, make: make._id, year: year._id } },
//         { upsert: true, new: true }
//       );
//       // Look up or insert the Trim
//       const trim = await Trim.findOneAndUpdate(
//         { trim: row.trim, model: model._id, make: make._id, year: year._id },
//         {
//           $setOnInsert: {
//             trim: row.trim,
//             model: model._id,
//             make: make._id,
//             year: year._id,
//           },
//         },
//         { upsert: true, new: true }
//       );
//       // Look up or insert the Tire Size
//       const tireSize = await TireSize.findOneAndUpdate(
//         {
//           tireSize: row.tireSize,
//           make: make._id,
//           model: model._id,
//           year: year._id,
//           trim: trim._id,
//         },
//         {
//           $setOnInsert: {
//             tireSize: row.tireSize,
//             trim: trim._id,
//             model: model._id,
//             make: make._id,
//             year: year._id,
//           },
//         },
//         { upsert: true, new: true }
//       );
//       // Look up or insert the Brand
//       const brand = await Brand.findOneAndUpdate(
//         { name: row.brand },
//         {
//           $setOnInsert: {
//             name: row.brand,
//             description: row.brandDescription || "",
//             logo: row.brandLogo || "",
//           },
//         },
//         { upsert: true, new: true }
//       );
//       // Look up or insert the Category
//       const category = await Category.findOneAndUpdate(
//         { name: row.category },
//         {
//           $setOnInsert: {
//             name: row.category,
//             slug: row.categorySlug || row.category.toLowerCase(),
//             isActive: true,
//           },
//         },
//         { upsert: true, new: true }
//       );
//       // Look up or insert the Driving Type
//       const drivingType = await DrivingType.findOneAndUpdate(
//         {
//           title: row.drivingTypeTitle,
//           subTitle: row.drivingTypeSubTitle,
//         },
//         {
//           $setOnInsert: {
//             title: row.drivingTypeTitle,
//             subTitle: row.drivingTypeSubTitle,
//             options: row.drivingTypeOptions
//               ? row.drivingTypeOptions.split(",")
//               : [],
//           },
//         },
//         { upsert: true, new: true }
//       );
//       const width = await WheelWidth.findOneAndUpdate(
//         { width: row.width },
//         { $setOnInsert: { width: row.width } },
//         { upsert: true, new: true }
//       );
//       const ratio = await WheelRatio.findOneAndUpdate(
//         { ratio: row.ratio },
//         { $setOnInsert: { ratio: row.ratio } },
//         { upsert: true, new: true }
//       );
//       const diameter = await WheelDiameter.findOneAndUpdate(
//         { diameter: row.diameter },
//         { $setOnInsert: { diameter: row.diameter } },
//         { upsert: true, new: true }
//       );
//       const vehicleType = await VehicleType.findOneAndUpdate(
//         { vehicleType: row.vehicleType },
//         { $setOnInsert: { vehicleType: row.vehicleType } },
//         { upsert: true, new: true }
//       );
//       const widthType = await WheelWidthType.findOneAndUpdate(
//         { widthType: row.widthType },
//         { $setOnInsert: { widthType: row.widthType } },
//         { upsert: true, new: true }
//       );
//       // Look up or insert the Wheel data
//       await Wheel.findOneAndUpdate(
//         {
//           year: year._id,
//           make: make._id,
//           model: model._id,
//           trim: trim._id,
//           tireSize: tireSize._id,
//           drivingType: drivingType?._id,
//         },
//         {
//           $setOnInsert: {
//             name: row.name,
//             year: year._id,
//             make: make._id,
//             model: model._id,
//             trim: trim._id,
//             tireSize: tireSize._id,
//             drivingType: drivingType?._id,
//             brand: brand._id,
//             category: category._id,
//             width: width?._id,
//             ratio: ratio?._id,
//             diameter: diameter?._id,
//             vehicleType: vehicleType?._id,
//             widthType: widthType?._id,
//             description: row.description || "",
//             images: row.images ? row.images.split(",") : [],
//             productLine: row.productLine || "",
//             unitName: row.unitName || "",
//             grossWeight: row.grossWeight || "",
//             conditionInfo: row.conditionInfo || "",
//             GTIN: row.GTIN || "",
//             ATVOffset: row.ATVOffset || "",
//             BoltsQuantity: row.BoltsQuantity || "",
//             wheelColor: row.wheelColor || "",
//             hubBore: row.hubBore || "",
//             materialType: row.materialType || "",
//             wheelSize: row.wheelSize || "",
//             wheelAccent: row.wheelAccent || "",
//             wheelPieces: row.wheelPieces || "",
//             RimDiameter: parseNumber(row.RimDiameter),
//             RimWidth: parseNumber(row.RimWidth),
//             boltPattern: row.boltPattern || "",
//             offset: parseNumber(row.offset),
//             hubBoreSize: parseNumber(row.hubBoreSize),
//             numberOFBolts: parseNumber(row.numberOFBolts),
//             loadCapacity: parseNumber(row.loadCapacity),
//             loadRating: parseNumber(row.loadRating),
//             finish: row.finish || "",
//             warranty: row.warranty || "",
//             constructionType: row.constructionType || "",
//             wheelType: row.wheelType || "",
//             price: parseNumber(row.price),
//             discountPrice: parseNumber(row.discountPrice),
//             stockQuantity: parseNumber(row.stockQuantity),
//           },
//         },
//         { upsert: true }
//       );
//     } catch (error) {
//       console.error(`Error processing row: ${JSON.stringify(row)}`, error);
//     }
//   }
//   return { message: "CSV data processed successfully" };
// };
const uploadWheelCSV = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    const results = [];
    // Read the CSV file
    yield new Promise((resolve, reject) => {
        fs_1.default.createReadStream(filePath)
            .pipe((0, csv_parser_1.default)())
            .on("data", (row) => results.push(row))
            .on("end", resolve)
            .on("error", reject);
    });
    // Iterate over each row of CSV data
    for (const row of results) {
        try {
            // Check and create or find the Year
            let year = yield year_model_1.Year.findOne({ year: parseInt(row.year) });
            if (!year) {
                year = yield year_model_1.Year.create({ year: parseInt(row.year) });
            }
            // Check and create or find the Make
            let make = yield make_model_1.Make.findOne({ make: row.make });
            if (!make) {
                make = yield make_model_1.Make.create({ make: row.make, logo: row.logo || "" });
            }
            // Check and create or find the Car Model
            let model = yield model_model_1.CarModel.findOne({
                model: row.model,
                make: make._id,
                year: year._id,
            });
            if (!model) {
                model = yield model_model_1.CarModel.create({
                    model: row.model,
                    make: make._id,
                    year: year._id,
                });
            }
            // Check and create or find the Trim
            let trim = yield trim_model_1.Trim.findOne({
                trim: row.trim,
                model: model._id,
                make: make._id,
                year: year._id,
            });
            if (!trim) {
                trim = yield trim_model_1.Trim.create({
                    trim: row.trim,
                    model: model._id,
                    make: make._id,
                    year: year._id,
                });
            }
            // Check and create or find the Tire Size
            let tireSize = yield tire_size_model_1.TireSize.findOne({
                tireSize: row.tireSize,
                trim: trim._id,
            });
            if (!tireSize) {
                tireSize = yield tire_size_model_1.TireSize.create({
                    tireSize: row.tireSize,
                    trim: trim._id,
                    model: model._id,
                    make: make._id,
                    year: year._id,
                });
            }
            // Check and create or find the Brand
            let brand = yield brand_model_1.Brand.findOne({ name: row.brand });
            if (!brand) {
                brand = yield brand_model_1.Brand.create({
                    name: row.brand,
                    description: row.brandDescription || "",
                    logo: row.brandLogo || "",
                });
            }
            // Check and create or find the Category
            let category = yield category_model_1.Category.findOne({ name: row.category });
            if (!category) {
                category = yield category_model_1.Category.create({
                    name: row.category,
                    slug: row.categorySlug || row.category.toLowerCase(),
                    isActive: true,
                });
            }
            // Check and create or find the Driving Type
            let drivingType = yield driving_type_model_1.DrivingType.findOne({
                title: row.drivingTypeTitle,
                subTitle: row.drivingTypeSubTitle,
            });
            if (!drivingType) {
                drivingType = yield driving_type_model_1.DrivingType.create({
                    title: row.drivingTypeTitle,
                    subTitle: row.drivingTypeSubTitle,
                    options: row.drivingTypeOptions
                        ? row.drivingTypeOptions.split(",")
                        : [],
                });
            }
            // Check and create or find the Wheel Width
            let width = yield wheel_width_model_1.WheelWidth.findOne({ width: row.width });
            if (!width) {
                width = yield wheel_width_model_1.WheelWidth.create({ width: row.width });
            }
            // Check and create or find the Wheel Ratio
            let ratio = yield wheel_ratio_model_1.WheelRatio.findOne({ ratio: row.ratio });
            if (!ratio) {
                ratio = yield wheel_ratio_model_1.WheelRatio.create({ ratio: row.ratio });
            }
            // Check and create or find the Wheel Diameter
            let diameter = yield wheel_diameter_model_1.WheelDiameter.findOne({ diameter: row.diameter });
            if (!diameter) {
                diameter = yield wheel_diameter_model_1.WheelDiameter.create({ diameter: row.diameter });
            }
            // Check and create or find the Vehicle Type
            let vehicleType = yield vehicle_type_model_1.VehicleType.findOne({
                vehicleType: row.vehicleType,
            });
            if (!vehicleType) {
                vehicleType = yield vehicle_type_model_1.VehicleType.create({
                    vehicleType: row.vehicleType,
                });
            }
            // Check and create or find the Wheel Width Type
            let widthType = yield wheel_width_type_model_1.WheelWidthType.findOne({
                widthType: row.widthType,
            });
            if (!widthType) {
                widthType = yield wheel_width_type_model_1.WheelWidthType.create({ widthType: row.widthType });
            }
            // Now create or update the Wheel data
            yield wheel_model_1.Wheel.findOneAndUpdate({
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
                    width: width === null || width === void 0 ? void 0 : width._id,
                    ratio: ratio === null || ratio === void 0 ? void 0 : ratio._id,
                    diameter: diameter === null || diameter === void 0 ? void 0 : diameter._id,
                    vehicleType: vehicleType === null || vehicleType === void 0 ? void 0 : vehicleType._id,
                    widthType: widthType === null || widthType === void 0 ? void 0 : widthType._id,
                    description: row.description || "",
                    images: row.images ? row.images.split(",") : [],
                    productLine: row.productLine || "",
                    unitName: row.unitName || "",
                    grossWeight: row.grossWeight || "",
                    conditionInfo: row.conditionInfo || "",
                    GTIN: row.GTIN || "",
                    ATVOffset: row.ATVOffset || "",
                    BoltsQuantity: row.BoltsQuantity || "",
                    wheelColor: row.wheelColor || "",
                    hubBore: row.hubBore || "",
                    materialType: row.materialType || "",
                    wheelSize: row.wheelSize || "",
                    wheelAccent: row.wheelAccent || "",
                    wheelPieces: row.wheelPieces || "",
                    RimDiameter: parseNumber(row.RimDiameter),
                    RimWidth: parseNumber(row.RimWidth),
                    boltPattern: row.boltPattern || "",
                    offset: parseNumber(row.offset),
                    hubBoreSize: parseNumber(row.hubBoreSize),
                    numberOFBolts: parseNumber(row.numberOFBolts),
                    loadCapacity: parseNumber(row.loadCapacity),
                    loadRating: parseNumber(row.loadRating),
                    finish: row.finish || "",
                    warranty: row.warranty || "",
                    constructionType: row.constructionType || "",
                    wheelType: row.wheelType || "",
                    price: parseNumber(row.price),
                    discountPrice: parseNumber(row.discountPrice),
                    stockQuantity: parseNumber(row.stockQuantity),
                },
            }, { upsert: true });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error processing row: ${JSON.stringify(row)} - Error: ${error.message}`);
            }
            else {
                console.error(`Error processing row: ${JSON.stringify(row)} - Error: ${String(error)}`);
            }
        }
    }
    return { message: "CSV data processed successfully" };
});
function parseNumber(value) {
    return isNaN(value) ? 0 : parseFloat(value);
}
exports.WheelService = {
    createWheel,
    getAllWheels,
    getSingleWheel,
    updateWheel,
    deleteWheel,
    uploadWheelCSV,
};
