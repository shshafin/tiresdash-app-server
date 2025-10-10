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
exports.WheelDiameterService = void 0;
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const wheel_diameter_model_1 = require("./wheel-diameter.model");
const createWheelDiameter = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield wheel_diameter_model_1.WheelDiameter.create(payload);
    return result;
});
const getSingleWheelDiameter = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield wheel_diameter_model_1.WheelDiameter.findById(id);
    return result;
});
const getAllWheelDiameter = (paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    // Dynamic  Sort needs  field to  do sorting
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const result = yield wheel_diameter_model_1.WheelDiameter.find()
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield wheel_diameter_model_1.WheelDiameter.countDocuments();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const updateWheelDiameter = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield wheel_diameter_model_1.WheelDiameter.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return result;
});
const deleteWheelDiameter = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield wheel_diameter_model_1.WheelDiameter.findByIdAndDelete(id);
    return result;
});
exports.WheelDiameterService = {
    createWheelDiameter,
    getSingleWheelDiameter,
    getAllWheelDiameter,
    updateWheelDiameter,
    deleteWheelDiameter,
};
