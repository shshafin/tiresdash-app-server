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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TireService = void 0;
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const tire_size_model_1 = require("./tire-size.model");
const mongoose_1 = require("mongoose");
const tire_size_constants_1 = require("./tire-size.constants");
const createTireSize = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tire_size_model_1.TireSize.create(payload);
    return result;
});
const getSingleTireSize = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tire_size_model_1.TireSize.findById(id)
        .populate("make")
        .populate("model")
        .populate("year")
        .populate("trim");
    return result;
});
const getAllTireSizes = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    // Search implementation
    if (searchTerm) {
        andConditions.push({
            $or: tire_size_constants_1.tireSizeSearchableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: "i",
                },
            })),
        });
    }
    // Filters implementation
    if (Object.keys(filtersData).length) {
        const filterConditions = Object.entries(filtersData).map(([field, value]) => {
            // Handle ObjectId fields (make, model, year, trim)
            if (["make", "model", "year", "trim"].includes(field)) {
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
    const result = yield tire_size_model_1.TireSize.find(whereConditions)
        .populate("make")
        .populate("model")
        .populate("year")
        .populate("trim")
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield tire_size_model_1.TireSize.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const updateTireSize = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tire_size_model_1.TireSize.findByIdAndUpdate(id, payload, {
        new: true,
    })
        .populate("make")
        .populate("model")
        .populate("trim")
        .populate("year");
    return result;
});
const deleteTireSize = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tire_size_model_1.TireSize.findByIdAndDelete(id);
    return result;
});
exports.TireService = {
    createTireSize,
    getSingleTireSize,
    getAllTireSizes,
    updateTireSize,
    deleteTireSize,
};
