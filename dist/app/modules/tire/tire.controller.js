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
exports.TireController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const tire_service_1 = require("./tire.service");
const pick_1 = __importDefault(require("../../../shared/pick"));
const pagination_1 = require("../../../constants/pagination");
const tire_constants_1 = require("./tire.constants");
const fileHandlers_1 = require("../../../helpers/fileHandlers");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const tire_model_1 = require("./tire.model");
const mongoose_1 = require("mongoose");
const createTire = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { data } = req.body;
    if (typeof data === "string") {
        data = JSON.parse(data);
    }
    const objectIdFields = [
        "year",
        "make",
        "model",
        "trim",
        "tireSize",
        "drivingType",
        "brand",
        "category",
        "width",
        "ratio",
        "diameter",
        "vehicleType",
    ];
    for (const field of objectIdFields) {
        if (data[field] && !mongoose_1.Types.ObjectId.isValid(data[field])) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Invalid ${field} ID`);
        }
    }
    if (req.files) {
        const images = req.files.map((file) => (0, fileHandlers_1.getFileUrl)(file.filename));
        data.images = images;
    }
    const result = yield tire_service_1.TireService.createTire(data);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Tire created successfully",
        data: result,
    });
}));
const uploadCSVTires = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        throw new Error("No file uploaded");
    }
    const filePath = req.file.path;
    const result = yield tire_service_1.TireService.uploadCSVTires(filePath);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message || "CSV processed successfully",
        data: {
            processedCount: result.processedCount,
            // You can add more metadata here if needed
        },
    });
}));
const getAllTires = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, tire_constants_1.tireFilterableFields);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield tire_service_1.TireService.getAllTires(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Tires retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const getSingleTire = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield tire_service_1.TireService.getSingleTire(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Tire retrieved successfully",
        data: result,
    });
}));
const updateTire = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let { updatedData } = req.body;
    if (typeof updatedData === "string") {
        updatedData = JSON.parse(updatedData);
    }
    const existingTire = yield tire_model_1.Tire.findById(id);
    if (!existingTire) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Tire not found");
    }
    if (req.files) {
        if (existingTire.images && existingTire.images.length > 0) {
            yield Promise.all(existingTire.images.map((imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
                const filename = imageUrl.split("/").pop();
                if (filename) {
                    (0, fileHandlers_1.deleteFile)(filename);
                }
            })));
        }
        const newImages = req.files.map((file) => (0, fileHandlers_1.getFileUrl)(file.filename));
        updatedData.images = newImages;
    }
    const result = yield tire_service_1.TireService.updateTire(id, updatedData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Tire updated successfully",
        data: result,
    });
}));
const deleteTire = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const tire = yield tire_model_1.Tire.findById(id);
    if (!tire) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Tire not found");
    }
    if ((_a = tire.images) === null || _a === void 0 ? void 0 : _a.length) {
        const deletionResults = yield Promise.allSettled(tire.images.map((imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
            const filename = imageUrl.split("/").pop();
            if (filename) {
                (0, fileHandlers_1.deleteFile)(filename);
            }
        })));
        deletionResults.forEach((result, index) => {
            var _a;
            if (result.status === "rejected") {
                console.error(`Failed to delete image ${(_a = tire.images) === null || _a === void 0 ? void 0 : _a[index]}:`, result.reason);
            }
        });
    }
    const result = yield tire_service_1.TireService.deleteTire(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Tire deleted successfully",
        data: result,
    });
}));
exports.TireController = {
    createTire,
    getAllTires,
    getSingleTire,
    updateTire,
    deleteTire,
    uploadCSVTires,
};
