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
exports.FleetSupportController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../../shared/catchAsync"));
const fileHandlers_1 = require("../../../../helpers/fileHandlers");
const support_service_1 = require("./support.service");
const sendResponse_1 = __importDefault(require("../../../../shared/sendResponse"));
const pick_1 = __importDefault(require("../../../../shared/pick"));
const support_constants_1 = require("./support.constants");
const pagination_1 = require("../../../../constants/pagination");
const support_model_1 = require("./support.model");
const ApiError_1 = __importDefault(require("../../../../errors/ApiError"));
const createFleetSupport = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { data } = req.body;
    if (typeof data === "string") {
        data = JSON.parse(data);
    }
    if (req.files) {
        const files = req.files.map((file) => (0, fileHandlers_1.getFileUrl)(file.filename));
        data.files = files;
    }
    const result = yield support_service_1.FleetSupportService.createFleetSupport(data);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Fleet support request created successfully",
        data: result,
    });
}));
const getAllFleetSupports = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, support_constants_1.fleetSupportFilterableFields);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield support_service_1.FleetSupportService.getAllFleetSupports(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Fleet support requests retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const getSingleFleetSupport = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield support_service_1.FleetSupportService.getSingleFleetSupport(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Fleet support request retrieved successfully",
        data: result,
    });
}));
const updateFleetSupport = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let { updatedData } = req.body;
    if (typeof updatedData === "string") {
        updatedData = JSON.parse(updatedData);
    }
    const existingSupport = yield support_model_1.FleetSupport.findById(id);
    if (!existingSupport) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Fleet support request not found");
    }
    if (req.files) {
        if (existingSupport.files && existingSupport.files.length > 0) {
            yield Promise.all(existingSupport.files.map((fileUrl) => __awaiter(void 0, void 0, void 0, function* () {
                const filename = fileUrl.split("/").pop();
                if (filename) {
                    (0, fileHandlers_1.deleteFile)(filename);
                }
            })));
        }
        const newFiles = req.files.map((file) => (0, fileHandlers_1.getFileUrl)(file.filename));
        updatedData.files = newFiles;
    }
    const result = yield support_service_1.FleetSupportService.updateFleetSupport(id, updatedData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Fleet support request updated successfully",
        data: result,
    });
}));
const deleteFleetSupport = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const support = yield support_model_1.FleetSupport.findById(id);
    if (!support) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Fleet support request not found");
    }
    if ((_a = support.files) === null || _a === void 0 ? void 0 : _a.length) {
        const deletionResults = yield Promise.allSettled(support.files.map((fileUrl) => __awaiter(void 0, void 0, void 0, function* () {
            const filename = fileUrl.split("/").pop();
            if (filename) {
                (0, fileHandlers_1.deleteFile)(filename);
            }
        })));
        deletionResults.forEach((result, index) => {
            var _a;
            if (result.status === "rejected") {
                console.error(`Failed to delete file ${(_a = support.files) === null || _a === void 0 ? void 0 : _a[index]}:`, result.reason);
            }
        });
    }
    const result = yield support_service_1.FleetSupportService.deleteFleetSupport(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Fleet support request deleted successfully",
        data: result,
    });
}));
// Get support requests by user ID
const getSupportsByUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield support_service_1.FleetSupportService.getFleetSupportsByUser(userId, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User's fleet support requests retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
}));
// Update support request status
const updateStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    const result = yield support_service_1.FleetSupportService.updateSupportStatus(id, status);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Support request status updated successfully",
        data: result,
    });
}));
// Add response to support ticket
const addResponse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let { userId, message } = req.body;
    let files = [];
    if (req.files) {
        files = req.files.map((file) => (0, fileHandlers_1.getFileUrl)(file.filename));
    }
    const result = yield support_service_1.FleetSupportService.addResponseToSupport(id, {
        userId,
        message,
        files,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Response added to support request successfully",
        data: result,
    });
}));
// Get support statistics
const getStatistics = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield support_service_1.FleetSupportService.getSupportStatistics();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Support statistics retrieved successfully",
        data: result,
    });
}));
exports.FleetSupportController = {
    createFleetSupport,
    getAllFleetSupports,
    getSingleFleetSupport,
    updateFleetSupport,
    deleteFleetSupport,
    getSupportsByUser,
    updateStatus,
    addResponse,
    getStatistics,
};
