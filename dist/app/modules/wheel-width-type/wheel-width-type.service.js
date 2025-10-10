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
exports.WheelWidthTypeService = void 0;
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const wheel_width_type_model_1 = require("./wheel-width-type.model");
const createWheelWidthType = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield wheel_width_type_model_1.WheelWidthType.create(payload);
    return result;
});
const getSingleWheelWidthType = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield wheel_width_type_model_1.WheelWidthType.findById(id);
    return result;
});
const getAllWheelWidthType = (paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    // Dynamic  Sort needs  field to  do sorting
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const result = yield wheel_width_type_model_1.WheelWidthType.find()
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield wheel_width_type_model_1.WheelWidthType.countDocuments();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const updateWheelWidthType = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield wheel_width_type_model_1.WheelWidthType.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return result;
});
const deleteWheelWidthType = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield wheel_width_type_model_1.WheelWidthType.findByIdAndDelete(id);
    return result;
});
exports.WheelWidthTypeService = {
    createWheelWidthType,
    getSingleWheelWidthType,
    getAllWheelWidthType,
    updateWheelWidthType,
    deleteWheelWidthType,
};
