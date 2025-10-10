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
exports.WheelController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const wheel_service_1 = require("./wheel.service");
const pick_1 = __importDefault(require("../../../shared/pick"));
const pagination_1 = require("../../../constants/pagination");
const fileHandlers_1 = require("../../../helpers/fileHandlers");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const wheel_model_1 = require("./wheel.model");
const wheel_constants_1 = require("./wheel.constants");
const createWheel = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { data } = req.body;
    if (typeof data === "string") {
        data = JSON.parse(data);
    }
    if (req.files) {
        const images = req.files.map((file) => (0, fileHandlers_1.getFileUrl)(file.filename));
        data.images = images;
    }
    const result = yield wheel_service_1.WheelService.createWheel(data);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Wheel created successfully",
        data: result,
    });
}));
const uploadCSVTires = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        throw new Error("No file uploaded");
    }
    const filePath = req.file.path;
    const result = yield wheel_service_1.WheelService.uploadWheelCSV(filePath);
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
const getAllWheels = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, wheel_constants_1.wheelFilterableFields);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield wheel_service_1.WheelService.getAllWheels(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Wheels retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const getSingleWheel = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield wheel_service_1.WheelService.getSingleWheel(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Wheel retrieved successfully",
        data: result,
    });
}));
const updateWheel = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let { data } = req.body;
    if (typeof data === "string") {
        data = JSON.parse(data);
    }
    const existingWheel = yield wheel_model_1.Wheel.findById(id);
    if (!existingWheel) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Wheel not found");
    }
    if (req.files) {
        if (existingWheel.images && existingWheel.images.length > 0) {
            yield Promise.all(existingWheel.images.map((imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
                const filename = imageUrl.split("/").pop();
                if (filename) {
                    (0, fileHandlers_1.deleteFile)(filename);
                }
            })));
        }
        const newImages = req.files.map((file) => (0, fileHandlers_1.getFileUrl)(file.filename));
        data.images = newImages;
    }
    const result = yield wheel_service_1.WheelService.updateWheel(id, data);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Wheel updated successfully",
        data: result,
    });
}));
const deleteWheel = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const wheel = yield wheel_model_1.Wheel.findById(id);
    if (!wheel) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Wheel not found");
    }
    if ((_a = wheel.images) === null || _a === void 0 ? void 0 : _a.length) {
        const deletionResults = yield Promise.allSettled(wheel.images.map((imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
            const filename = imageUrl.split("/").pop();
            if (filename) {
                (0, fileHandlers_1.deleteFile)(filename);
            }
        })));
        deletionResults.forEach((result, index) => {
            var _a;
            if (result.status === "rejected") {
                console.error(`Failed to delete image ${(_a = wheel.images) === null || _a === void 0 ? void 0 : _a[index]}:`, result.reason);
            }
        });
    }
    const result = yield wheel_service_1.WheelService.deleteWheel(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Wheel deleted successfully",
        data: result,
    });
}));
exports.WheelController = {
    createWheel,
    getAllWheels,
    getSingleWheel,
    updateWheel,
    deleteWheel,
    uploadCSVTires,
};
