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
exports.WheelRatioService = void 0;
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const wheel_ratio_model_1 = require("./wheel-ratio.model");
const createWheelRatio = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield wheel_ratio_model_1.WheelRatio.create(payload);
    return result;
});
const getSingleWheelRatio = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield wheel_ratio_model_1.WheelRatio.findById(id);
    return result;
});
const getAllWheelRatio = (paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    // Dynamic  Sort needs  field to  do sorting
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const result = yield wheel_ratio_model_1.WheelRatio.find()
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield wheel_ratio_model_1.WheelRatio.countDocuments();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const updateWheelRatio = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield wheel_ratio_model_1.WheelRatio.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
const deleteWheelRatio = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield wheel_ratio_model_1.WheelRatio.findByIdAndDelete(id);
    return result;
});
exports.WheelRatioService = {
    createWheelRatio,
    getSingleWheelRatio,
    getAllWheelRatio,
    updateWheelRatio,
    deleteWheelRatio,
};
