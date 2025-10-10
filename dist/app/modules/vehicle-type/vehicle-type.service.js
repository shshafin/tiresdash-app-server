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
exports.VehicleTypeService = void 0;
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const vehicle_type_model_1 = require("./vehicle-type.model");
const createVehicleType = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vehicle_type_model_1.VehicleType.create(payload);
    return result;
});
const getSingleVehicleType = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vehicle_type_model_1.VehicleType.findById(id);
    return result;
});
const getAllVehicleType = (paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    // Dynamic  Sort needs  field to  do sorting
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const result = yield vehicle_type_model_1.VehicleType.find()
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield vehicle_type_model_1.VehicleType.countDocuments();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const updateVehicleType = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vehicle_type_model_1.VehicleType.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return result;
});
const deleteVehicleType = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vehicle_type_model_1.VehicleType.findByIdAndDelete(id);
    return result;
});
exports.VehicleTypeService = {
    createVehicleType,
    getSingleVehicleType,
    getAllVehicleType,
    updateVehicleType,
    deleteVehicleType,
};
