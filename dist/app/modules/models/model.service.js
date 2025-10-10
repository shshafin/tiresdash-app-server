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
exports.ModelService = void 0;
const model_model_1 = require("./model.model");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const model_constants_1 = require("./model.constants");
const createModel = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (yield (yield model_model_1.CarModel.create(payload)).populate("make")).populate("year");
    return result;
});
const getSingleModel = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield model_model_1.CarModel.findById(id).populate("make").populate("year");
    return result;
});
const getAllModels = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    // Search implementation
    if (searchTerm) {
        andConditions.push({
            $or: model_constants_1.modelSearchableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: "i",
                },
            })),
        });
    }
    // Filters implementation
    if (Object.keys(filtersData).length) {
        const filterConditions = Object.entries(filtersData).map(([field, value]) => ({
            [field]: value,
        }));
        andConditions.push({ $and: filterConditions });
    }
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield model_model_1.CarModel.find(whereConditions)
        .populate("make")
        .populate("year")
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield model_model_1.CarModel.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const updateModel = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield model_model_1.CarModel.findByIdAndUpdate(id, payload, {
        new: true,
    })
        .populate("make")
        .populate("year");
    return result;
});
const deleteModel = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield model_model_1.CarModel.findByIdAndDelete(id);
    return result;
});
exports.ModelService = {
    createModel,
    getSingleModel,
    getAllModels,
    updateModel,
    deleteModel,
};
