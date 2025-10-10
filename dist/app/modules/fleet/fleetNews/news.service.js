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
exports.FleetNewsService = void 0;
const paginationHelper_1 = require("../../../../helpers/paginationHelper");
const news_constants_1 = require("./news.constants");
const news_model_1 = require("./news.model");
const ApiError_1 = __importDefault(require("../../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const createFleetNews = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield news_model_1.FleetNews.create(payload);
    return result;
});
const getAllFleetNews = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: news_constants_1.fleetNewsSearchableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: "i",
                },
            })),
        });
    }
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield news_model_1.FleetNews.find(whereConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield news_model_1.FleetNews.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getSingleFleetNews = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield news_model_1.FleetNews.findById(id);
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Fleet news not found");
    }
    return result;
});
const updateFleetNews = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield news_model_1.FleetNews.findById(id);
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Fleet news not found");
    }
    const result = yield news_model_1.FleetNews.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return result;
});
const deleteFleetNews = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield news_model_1.FleetNews.findByIdAndDelete(id);
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Fleet news not found");
    }
    return result;
});
// Additional Functions
const getFeaturedFleetNews = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (limit = 3) {
    const result = yield news_model_1.FleetNews.find({ status: "featured" })
        .sort({ createdAt: -1 })
        .limit(limit);
    return result;
});
const getRecentFleetNews = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (limit = 5) {
    const result = yield news_model_1.FleetNews.find().sort({ createdAt: -1 }).limit(limit);
    return result;
});
exports.FleetNewsService = {
    createFleetNews,
    getAllFleetNews,
    getSingleFleetNews,
    updateFleetNews,
    deleteFleetNews,
    getFeaturedFleetNews,
    getRecentFleetNews,
};
