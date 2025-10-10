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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FleetAppointmentController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../../shared/catchAsync"));
const fileHandlers_1 = require("../../../../helpers/fileHandlers");
const appointment_service_1 = require("./appointment.service");
const sendResponse_1 = __importDefault(require("../../../../shared/sendResponse"));
const pick_1 = __importDefault(require("../../../../shared/pick"));
const appointment_constants_1 = require("./appointment.constants");
const pagination_1 = require("../../../../constants/pagination");
const appointment_model_1 = require("./appointment.model");
const ApiError_1 = __importDefault(require("../../../../errors/ApiError"));
const createFleetAppointment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const fleetUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!fleetUserId) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Fleet User ID required");
    }
    let { data } = req.body;
    if (typeof data === "string") {
        data = JSON.parse(data);
    }
    data.fleetUser = fleetUserId;
    if (req.files) {
        const files = req.files.map((file) => (0, fileHandlers_1.getFileUrl)(file.filename));
        data.files = files;
    }
    const result = yield appointment_service_1.FleetAppointmentService.createFleetAppointment(data);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Fleet appointment created successfully",
        data: result,
    });
}));
const getAllFleetAppointments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, appointment_constants_1.fleetAppointmentFilterableFields);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield appointment_service_1.FleetAppointmentService.getAllFleetAppointments(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Fleet appointments retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const getSingleFleetAppointment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield appointment_service_1.FleetAppointmentService.getSingleFleetAppointment(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Fleet appointment retrieved successfully",
        data: result,
    });
}));
const getMyFleetAppointments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const fleetUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!fleetUserId) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Fleet User ID required");
    }
    const filters = (0, pick_1.default)(req.query, appointment_constants_1.fleetAppointmentSearchableFields);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield appointment_service_1.FleetAppointmentService.getAppointmentsByFleetUser(fleetUserId, filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "My fleet appointments retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const updateFleetAppointment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let { updatedData } = req.body;
    if (typeof updatedData === "string") {
        updatedData = JSON.parse(updatedData);
    }
    const existingAppointment = yield appointment_model_1.FleetAppointment.findById(id);
    if (!existingAppointment) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Fleet appointment not found");
    }
    if (req.files) {
        if (existingAppointment.files && existingAppointment.files.length > 0) {
            yield Promise.all(existingAppointment.files.map((fileUrl) => __awaiter(void 0, void 0, void 0, function* () {
                const filename = fileUrl.split("/").pop();
                if (filename) {
                    (0, fileHandlers_1.deleteFile)(filename);
                }
            })));
        }
        const newFiles = req.files.map((file) => (0, fileHandlers_1.getFileUrl)(file.filename));
        updatedData.files = newFiles;
    }
    const result = yield appointment_service_1.FleetAppointmentService.updateFleetAppointment(id, updatedData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Fleet appointment updated successfully",
        data: result,
    });
}));
const updateFleetRef = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { fleetRef } = req.body;
    // Validate if fleetRef data exists in request
    if (!fleetRef || typeof fleetRef !== "object") {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Fleet reference data is required");
    }
    // Optional: Validate individual fields if needed
    if (fleetRef.phone && !/^\+?[1-9]\d{1,14}$/.test(fleetRef.phone)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Invalid phone number format. Please use E.164 format");
    }
    if (fleetRef.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fleetRef.email)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Invalid email address format");
    }
    const result = yield appointment_service_1.FleetAppointmentService.updateFleetRef(id, fleetRef);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Fleet reference updated successfully",
        data: result,
    });
}));
const deleteFleetAppointment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const appointment = yield appointment_model_1.FleetAppointment.findById(id);
    if (!appointment) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Fleet appointment not found");
    }
    if ((_a = appointment.files) === null || _a === void 0 ? void 0 : _a.length) {
        const deletionResults = yield Promise.allSettled(appointment.files.map((fileUrl) => __awaiter(void 0, void 0, void 0, function* () {
            const filename = fileUrl.split("/").pop();
            if (filename) {
                (0, fileHandlers_1.deleteFile)(filename);
            }
        })));
        deletionResults.forEach((result, index) => {
            var _a;
            if (result.status === "rejected") {
                console.error(`Failed to delete file ${(_a = appointment.files) === null || _a === void 0 ? void 0 : _a[index]}:`, result.reason);
            }
        });
    }
    const result = yield appointment_service_1.FleetAppointmentService.deleteFleetAppointment(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Fleet appointment deleted successfully",
        data: result,
    });
}));
// Additional Controllers
const getAppointmentsByVehicle = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vehicleId } = req.params;
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield appointment_service_1.FleetAppointmentService.getAppointmentsByVehicle(vehicleId, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Vehicle appointments retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const updateAppointmentStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    const result = yield appointment_service_1.FleetAppointmentService.updateAppointmentStatus(id, status);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Appointment status updated successfully",
        data: result,
    });
}));
const getUpcomingAppointments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const days = req.query.days ? Number(req.query.days) : 7;
    const result = yield appointment_service_1.FleetAppointmentService.getUpcomingAppointments(days);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Upcoming appointments retrieved successfully",
        data: result,
    });
}));
exports.FleetAppointmentController = {
    createFleetAppointment,
    getAllFleetAppointments,
    getSingleFleetAppointment,
    getMyFleetAppointments,
    updateFleetAppointment,
    updateFleetRef,
    deleteFleetAppointment,
    getAppointmentsByVehicle,
    updateAppointmentStatus,
    getUpcomingAppointments,
};
