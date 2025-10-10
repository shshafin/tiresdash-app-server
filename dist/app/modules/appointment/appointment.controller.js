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
exports.AppointmentController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const appointment_service_1 = require("./appointment.service");
const pick_1 = __importDefault(require("../../../shared/pick"));
const pagination_1 = require("../../../constants/pagination");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const appointment_model_1 = require("./appointment.model");
const appointmentFilterableFields_1 = require("./appointmentFilterableFields");
const createAppointment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const appointmentData = req.body;
    const result = yield appointment_service_1.AppointmentService.createAppointment(appointmentData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Appointment created successfully",
        data: result,
    });
}));
const getAllAppointments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, appointmentFilterableFields_1.appointmentFilterableFields);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield appointment_service_1.AppointmentService.getAllAppointments(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Appointments retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const getSingleAppointment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield appointment_service_1.AppointmentService.getSingleAppointment(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Appointment retrieved successfully",
        data: result,
    });
}));
const updateAppointment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let updatedData = req.body;
    if (typeof updatedData === "string") {
        updatedData = JSON.parse(updatedData);
    }
    const existingAppointment = yield appointment_model_1.Appointment.findById(id);
    if (!existingAppointment) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Appointment not found");
    }
    const result = yield appointment_service_1.AppointmentService.updateAppointment(id, updatedData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Appointment updated successfully",
        data: result,
    });
}));
const deleteAppointment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const appointment = yield appointment_model_1.Appointment.findById(id);
    if (!appointment) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Appointment not found");
    }
    const result = yield appointment_service_1.AppointmentService.deleteAppointment(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Appointment deleted successfully",
        data: result,
    });
}));
exports.AppointmentController = {
    createAppointment,
    getAllAppointments,
    getSingleAppointment,
    updateAppointment,
    deleteAppointment,
};
