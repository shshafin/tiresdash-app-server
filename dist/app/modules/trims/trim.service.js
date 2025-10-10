"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.TrimService = void 0;
const trim_model_1 = require("./trim.model");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const mongoose_1 = require("mongoose");
const fs = __importStar(require("fs"));
const year_model_1 = require("../year/year.model");
const csv_parser_1 = __importDefault(require("csv-parser"));
const make_model_1 = require("../makes/make.model");
const model_model_1 = require("../models/model.model");
const trim_constants_1 = require("./trim.constants");
const createTrim = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield trim_model_1.Trim.create(payload);
    return result;
});
const getSingleTrim = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield trim_model_1.Trim.findById(id)
        .populate("make")
        .populate("model")
        .populate("year");
    return result;
});
const getAllTrims = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    // Search implementation
    if (searchTerm) {
        andConditions.push({
            $or: trim_constants_1.trimSearchableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: "i",
                },
            })),
        });
    }
    if (Object.keys(filtersData).length) {
        const filterConditions = Object.entries(filtersData).map(([field, value]) => {
            if (["make", "model", "year"].includes(field)) {
                return { [field]: new mongoose_1.Types.ObjectId(value) };
            }
            return { [field]: value };
        });
        andConditions.push({ $and: filterConditions });
    }
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield trim_model_1.Trim.find(whereConditions)
        .populate("make")
        .populate("model")
        .populate("year")
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield trim_model_1.Trim.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const updateTrim = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield trim_model_1.Trim.findByIdAndUpdate(id, payload, {
        new: true,
    })
        .populate("make")
        .populate("model")
        .populate("year");
    return result;
});
const deleteTrim = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield trim_model_1.Trim.findByIdAndDelete(id);
    return result;
});
// const processCSVUpload = async (filePath: string): Promise<any> => {
//   const results: any[] = [];
//   // Read and parse the CSV file
//   await new Promise<void>((resolve, reject) => {
//     fs.createReadStream(filePath)
//       .pipe(csv())
//       .on("data", (row: Record<string, any>) => {
//         results.push(row);
//       })
//       .on("end", () => {
//         resolve();
//       })
//       .on("error", (err: Error) => {
//         reject(err);
//       });
//   });
//   for (const row of results) {
//     // Check and create year
//     const yearExists = await Year.findOne({ year: Number(row.year) });
//     let year;
//     if (!yearExists) {
//       year = await Year.create({
//         year: { numeric: Number(row.year), display: row.year.toString() },
//       });
//     } else {
//       year = yearExists;
//     }
//     // Check and create make
//     const makeExists = await Make.findOne({ make: row.make });
//     let make;
//     if (!makeExists) {
//       make = await Make.create({
//         make: row.make,
//         logo: row.logo || "",
//       });
//     } else {
//       make = makeExists;
//     }
//     // Check and create model
//     const modelExists = await CarModel.findOne({ model: row.model });
//     let modelDoc;
//     if (!modelExists) {
//       modelDoc = await CarModel.create({
//         model: row.model,
//         make: make._id,
//         year: year._id,
//       });
//     } else {
//       modelDoc = modelExists;
//     }
//     // Check and create trim
//     const trimExists = await Trim.findOne({
//       trim: row.trim,
//     });
//     if (!trimExists) {
//       await Trim.create({
//         trim: row.trim,
//         make: make._id,
//         model: modelDoc._id,
//         year: year._id,
//       });
//     }
//   }
//   return { message: "CSV data processed successfully" };
// };
const processCSVUpload = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    const results = [];
    // Read and parse the CSV file
    yield new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (row) => {
            results.push(row);
        })
            .on("end", () => {
            resolve();
        })
            .on("error", (err) => {
            reject(err);
        });
    });
    // Process each row
    for (const row of results) {
        try {
            // 1. Handle Year - find or create
            const year = yield year_model_1.Year.findOneAndUpdate({ "year.numeric": Number(row.year) }, {
                $setOnInsert: {
                    year: { numeric: Number(row.year), display: row.year.toString() },
                },
            }, { upsert: true, new: true });
            // 2. Handle Make - find or create
            const make = yield make_model_1.Make.findOneAndUpdate({ make: row.make }, { $setOnInsert: { make: row.make, logo: row.logo || "" } }, { upsert: true, new: true });
            // 3. Handle Model - find or create under this specific make and year
            const model = yield model_model_1.CarModel.findOneAndUpdate({
                model: row.model,
                make: make._id,
                year: year._id,
            }, {
                $setOnInsert: {
                    model: row.model,
                    make: make._id,
                    year: year._id,
                },
            }, { upsert: true, new: true });
            // 4. Handle Trim - find or create under this specific model, make, and year
            yield trim_model_1.Trim.findOneAndUpdate({
                trim: row.trim,
                model: model._id,
                make: make._id,
                year: year._id,
            }, {
                $setOnInsert: {
                    trim: row.trim,
                    model: model._id,
                    make: make._id,
                    year: year._id,
                },
            }, { upsert: true });
        }
        catch (error) {
            console.error(`Error processing row: ${JSON.stringify(row)}`, error);
            // You might want to continue processing other rows or throw the error
        }
    }
    return { message: "CSV data processed successfully" };
});
function csv() {
    return (0, csv_parser_1.default)();
}
exports.TrimService = {
    createTrim,
    getSingleTrim,
    getAllTrims,
    updateTrim,
    deleteTrim,
    processCSVUpload,
};
