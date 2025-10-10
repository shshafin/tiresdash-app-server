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
exports.FleetUserService = void 0;
const fleetUser_model_1 = require("./fleetUser.model");
const fleetUser_constants_1 = require("./fleetUser.constants");
const ApiError_1 = __importDefault(require("../../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const paginationHelper_1 = require("../../../../helpers/paginationHelper");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../../../config"));
const createFleetUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if email already exists
    const existingUser = yield fleetUser_model_1.FleetUser.findOne({ email: payload.email });
    if (existingUser) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Email already exists");
    }
    const result = yield fleetUser_model_1.FleetUser.create(payload);
    return result;
});
const getAllFleetUsers = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: fleetUser_constants_1.fleetUserSearchableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: "i",
                },
            })),
        });
    }
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => {
                // Handle array fields
                if (field === "additionalServices") {
                    return { [field]: { $in: [value] } };
                }
                return { [field]: value };
            }),
        });
    }
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield fleetUser_model_1.FleetUser.find(whereConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield fleetUser_model_1.FleetUser.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getSingleFleetUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield fleetUser_model_1.FleetUser.findById(id);
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Fleet user not found");
    }
    return result;
});
const updateFleetUser = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield fleetUser_model_1.FleetUser.findById(id);
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Fleet user not found");
    }
    const { email } = payload, rest = __rest(payload, ["email"]);
    // Prevent email change
    if (email && email !== isExist.email) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Email cannot be changed");
    }
    const result = yield fleetUser_model_1.FleetUser.findOneAndUpdate({ _id: id }, rest, {
        new: true,
    });
    return result;
});
const deleteFleetUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield fleetUser_model_1.FleetUser.findByIdAndDelete(id);
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Fleet user not found");
    }
    return result;
});
// Additional Functions
const getFleetUserProfile = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield fleetUser_model_1.FleetUser.findById(id);
    return result;
});
const updateFleetUserProfile = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield fleetUser_model_1.FleetUser.findById(id);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Fleet user not found");
    }
    const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
    // Prevent email change
    if (email && email !== user.email) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Email cannot be changed");
    }
    // Handle password update separately
    let updatePayload = Object.assign({}, rest);
    if (password) {
        const hashedPassword = yield bcrypt_1.default.hash(password, Number(config_1.default.bycrypt_salt_rounds));
        updatePayload = Object.assign(Object.assign({}, rest), { password: hashedPassword });
    }
    const result = yield fleetUser_model_1.FleetUser.findOneAndUpdate({ _id: id }, updatePayload, {
        new: true,
    });
    return result;
});
const getMyProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield fleetUser_model_1.FleetUser.findOne({ _id: userId });
    return result;
});
exports.FleetUserService = {
    createFleetUser,
    getAllFleetUsers,
    getSingleFleetUser,
    updateFleetUser,
    deleteFleetUser,
    getFleetUserProfile,
    updateFleetUserProfile,
    getMyProfile,
};
