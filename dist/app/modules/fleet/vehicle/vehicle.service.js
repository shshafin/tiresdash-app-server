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
exports.FleetVehicleService = void 0;
const vehicle_model_1 = require("./vehicle.model");
const paginationHelper_1 = require("../../../../helpers/paginationHelper");
const vehicle_constants_1 = require("./vehicle.constants");
const createFleetVehicle = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingVehicle = yield vehicle_model_1.FleetVehicle.findOne({
        year: payload.year,
        make: payload.make,
        model: payload.model,
        licensePlate: payload.licensePlate,
    });
    if (existingVehicle) {
        throw new Error("A vehicle with the same year, make, model, and license plate already exists");
    }
    const result = yield vehicle_model_1.FleetVehicle.create(payload);
    return result;
});
const getSingleFleetVehicle = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vehicle_model_1.FleetVehicle.findById(id);
    return result;
});
const getAllFleetVehicles = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    // Search implementation
    if (searchTerm) {
        andConditions.push({
            $or: vehicle_constants_1.fleetVehicleSearchableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: "i",
                },
            })),
        });
    }
    // Filters implementation
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
    const result = yield vehicle_model_1.FleetVehicle.find(whereConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield vehicle_model_1.FleetVehicle.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const updateFleetVehicle = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vehicle_model_1.FleetVehicle.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteFleetVehicle = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vehicle_model_1.FleetVehicle.findByIdAndDelete(id);
    return result;
});
exports.FleetVehicleService = {
    createFleetVehicle,
    getSingleFleetVehicle,
    getAllFleetVehicles,
    updateFleetVehicle,
    deleteFleetVehicle,
};
