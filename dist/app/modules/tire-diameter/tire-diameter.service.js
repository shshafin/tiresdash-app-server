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
exports.TireDiameterService = void 0;
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const tire_diameter_model_1 = require("./tire-diameter.model");
const createTireDiameter = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tire_diameter_model_1.TireDiameter.create(payload);
    return result;
});
const getSingleTireDiameter = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tire_diameter_model_1.TireDiameter.findById(id);
    return result;
});
const getAllTireDiameter = (paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    // Dynamic  Sort needs  field to  do sorting
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const result = yield tire_diameter_model_1.TireDiameter.find()
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield tire_diameter_model_1.TireDiameter.countDocuments();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const updateTireDiameter = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tire_diameter_model_1.TireDiameter.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return result;
});
const deleteTireDiameter = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tire_diameter_model_1.TireDiameter.findByIdAndDelete(id);
    return result;
});
exports.TireDiameterService = {
    createTireDiameter,
    getSingleTireDiameter,
    getAllTireDiameter,
    updateTireDiameter,
    deleteTireDiameter,
};
