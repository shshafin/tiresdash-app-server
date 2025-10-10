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
exports.FleetSupportService = void 0;
const paginationHelper_1 = require("../../../../helpers/paginationHelper");
const support_constants_1 = require("./support.constants");
const support_model_1 = require("./support.model");
const ApiError_1 = __importDefault(require("../../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const fileHandlers_1 = require("../../../../helpers/fileHandlers");
const createFleetSupport = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield support_model_1.FleetSupport.create(payload);
    return result;
});
const getAllFleetSupports = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: support_constants_1.fleetSupportSearchableFields.map((field) => ({
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
    const result = yield support_model_1.FleetSupport.find(whereConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield support_model_1.FleetSupport.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getSingleFleetSupport = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield support_model_1.FleetSupport.findById(id);
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Fleet support request not found");
    }
    return result;
});
const updateFleetSupport = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield support_model_1.FleetSupport.findById(id);
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Fleet support request not found");
    }
    const result = yield support_model_1.FleetSupport.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return result;
});
const deleteFleetSupport = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield support_model_1.FleetSupport.findByIdAndDelete(id);
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Fleet support request not found");
    }
    if (result.files && result.files.length > 0) {
        yield Promise.allSettled(result.files.map((fileUrl) => __awaiter(void 0, void 0, void 0, function* () {
            const filename = fileUrl.split("/").pop();
            if (filename) {
                yield (0, fileHandlers_1.deleteFile)(filename);
            }
        })));
    }
    return result;
});
// Get support requests by user ID
const getFleetSupportsByUser = (userId, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const result = yield support_model_1.FleetSupport.find({ user: userId })
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield support_model_1.FleetSupport.countDocuments({ user: userId });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
// Update support request status (e.g., Open, In Progress, Resolved)
const updateSupportStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const validStatuses = ["Open", "In Progress", "Resolved", "Closed"];
    if (!validStatuses.includes(status)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Invalid status value");
    }
    const result = yield support_model_1.FleetSupport.findByIdAndUpdate(id, { status }, { new: true });
    return result;
});
// Add response to a support ticket
const addResponseToSupport = (id, response) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield support_model_1.FleetSupport.findByIdAndUpdate(id, {
        $push: {
            responses: {
                user: response.userId,
                message: response.message,
                files: response.files || [],
                createdAt: new Date(),
            },
        },
        $set: { updatedAt: new Date() },
    }, { new: true });
    return result;
});
const getSupportStatistics = () => __awaiter(void 0, void 0, void 0, function* () {
    const [open, inProgress, resolved, total] = yield Promise.all([
        support_model_1.FleetSupport.countDocuments({ status: "Open" }),
        support_model_1.FleetSupport.countDocuments({ status: "In Progress" }),
        support_model_1.FleetSupport.countDocuments({ status: "Resolved" }),
        support_model_1.FleetSupport.countDocuments(),
    ]);
    return { open, inProgress, resolved, total };
});
exports.FleetSupportService = {
    createFleetSupport,
    getAllFleetSupports,
    getSingleFleetSupport,
    updateFleetSupport,
    deleteFleetSupport,
    getFleetSupportsByUser,
    updateSupportStatus,
    addResponseToSupport,
    getSupportStatistics,
};
