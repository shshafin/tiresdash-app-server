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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YearService = void 0;
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const year_model_1 = require("./year.model");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const createYear = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isYearExist = yield year_model_1.Year.findOne({ year: payload.year });
    if (isYearExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Year exist");
    }
    const result = yield year_model_1.Year.create(payload);
    return result;
});
const getSingleYear = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield year_model_1.Year.findById(id);
    return result;
});
const getAllYears = (paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    // Dynamic  Sort needs  field to  do sorting
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const result = yield year_model_1.Year.find().sort(sortConditions).skip(skip).limit(limit);
    const total = yield year_model_1.Year.countDocuments();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const updateYear = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield year_model_1.Year.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return result;
});
const deleteYear = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield year_model_1.Year.findByIdAndDelete(id);
    return result;
});
exports.YearService = {
    createYear,
    getSingleYear,
    getAllYears,
    updateYear,
    deleteYear,
};
