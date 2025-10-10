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
exports.FleetAppointmentService = void 0;
const ApiError_1 = __importDefault(require("../../../../errors/ApiError"));
const fileHandlers_1 = require("../../../../helpers/fileHandlers");
const paginationHelper_1 = require("../../../../helpers/paginationHelper");
const appointment_constants_1 = require("./appointment.constants");
const appointment_model_1 = require("./appointment.model");
const http_status_1 = __importDefault(require("http-status"));
const createFleetAppointment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check for overlapping appointments for the same vehicle
    const existingAppointment = yield appointment_model_1.FleetAppointment.findOne({
        fleetVehicle: payload.fleetVehicle,
        date: payload.date,
        time: payload.time,
        status: { $ne: "Cancelled" },
    });
    if (existingAppointment) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "An appointment already exists for this vehicle at the selected time");
    }
    const result = yield appointment_model_1.FleetAppointment.create(payload);
    return result;
});
const getAllFleetAppointments = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: appointment_constants_1.fleetAppointmentSearchableFields.map((field) => ({
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
    const result = yield appointment_model_1.FleetAppointment.find(whereConditions)
        .populate("fleetVehicle")
        .populate("assignedTo")
        .populate("fleetUser")
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield appointment_model_1.FleetAppointment.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getSingleFleetAppointment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield appointment_model_1.FleetAppointment.findById(id)
        .populate("fleetVehicle")
        .populate("assignedTo");
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Fleet appointment not found");
    }
    return result;
});
const getAppointmentsByFleetUser = (fleetUserId, filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [
        { fleetUser: fleetUserId }, // Filter by the specific fleet user
    ];
    if (searchTerm) {
        andConditions.push({
            $or: appointment_constants_1.fleetAppointmentSearchableFields.map((field) => ({
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
    const result = yield appointment_model_1.FleetAppointment.find(whereConditions)
        .populate("fleetVehicle")
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield appointment_model_1.FleetAppointment.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const updateFleetAppointment = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield appointment_model_1.FleetAppointment.findById(id);
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Fleet appointment not found");
    }
    // Check for overlapping appointments when updating time/date
    if (payload.date || payload.time) {
        const date = payload.date || isExist.date;
        const time = payload.time || isExist.time;
        const vehicleId = payload.fleetVehicle || isExist.fleetVehicle;
        const overlappingAppointment = yield appointment_model_1.FleetAppointment.findOne({
            _id: { $ne: id },
            fleetVehicle: vehicleId,
            date,
            time,
            status: { $ne: "Cancelled" },
        });
        if (overlappingAppointment) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "An appointment already exists for this vehicle at the selected time");
        }
    }
    const result = yield appointment_model_1.FleetAppointment.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    })
        .populate("fleetVehicle")
        .populate("assignedTo");
    return result;
});
const updateFleetRef = (id, fleetRef) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield appointment_model_1.FleetAppointment.findById(id);
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Fleet appointment not found");
    }
    const result = yield appointment_model_1.FleetAppointment.findOneAndUpdate({ _id: id }, {
        $set: {
            fleetRef: Object.assign(Object.assign({}, (isExist.fleetRef || {})), fleetRef),
        },
    }, { new: true })
        .populate("fleetVehicle")
        .populate("assignedTo");
    return result;
});
const deleteFleetAppointment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield appointment_model_1.FleetAppointment.findByIdAndDelete(id);
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Fleet appointment not found");
    }
    // Delete associated files
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
// Additional Functions
const getAppointmentsByVehicle = (vehicleId, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const result = yield appointment_model_1.FleetAppointment.find({ fleetVehicle: vehicleId })
        .populate("fleetVehicle")
        .populate("assignedTo")
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield appointment_model_1.FleetAppointment.countDocuments({
        fleetVehicle: vehicleId,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const updateAppointmentStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield appointment_model_1.FleetAppointment.findByIdAndUpdate(id, { status }, { new: true })
        .populate("fleetVehicle")
        .populate("assignedTo");
    return result;
});
const getUpcomingAppointments = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (days = 7) {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);
    const result = yield appointment_model_1.FleetAppointment.find({
        date: {
            $gte: today.toISOString().split("T")[0],
            $lte: futureDate.toISOString().split("T")[0],
        },
        status: { $in: ["Pending", "Confirmed"] },
    })
        .populate("fleetVehicle")
        .populate("assignedTo")
        .sort({ date: 1, time: 1 });
    return result;
});
exports.FleetAppointmentService = {
    createFleetAppointment,
    getAllFleetAppointments,
    getSingleFleetAppointment,
    getAppointmentsByFleetUser,
    updateFleetAppointment,
    updateFleetRef,
    deleteFleetAppointment,
    getAppointmentsByVehicle,
    updateAppointmentStatus,
    getUpcomingAppointments,
};
