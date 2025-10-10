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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TireWidthService = void 0;
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const tire_width_model_1 = require("./tire-width.model");
const createTireWidth = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tire_width_model_1.TireWidth.create(payload);
    return result;
});
const getSingleTireWidth = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tire_width_model_1.TireWidth.findById(id);
    return result;
});
const getAllTireWidth = (paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    // Dynamic  Sort needs  field to  do sorting
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const result = yield tire_width_model_1.TireWidth.find()
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield tire_width_model_1.TireWidth.countDocuments();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const updateTireWidth = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tire_width_model_1.TireWidth.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
const deleteTireWidth = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tire_width_model_1.TireWidth.findByIdAndDelete(id);
    return result;
});
exports.TireWidthService = {
    createTireWidth,
    getSingleTireWidth,
    getAllTireWidth,
    updateTireWidth,
    deleteTireWidth,
};
