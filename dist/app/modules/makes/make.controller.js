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
exports.MakeController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const make_service_1 = require("./make.service");
const pagination_1 = require("../../../constants/pagination");
const pick_1 = __importDefault(require("../../../shared/pick"));
const fileHandlers_1 = require("../../../helpers/fileHandlers");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const make_model_1 = require("./make.model");
const createMake = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const makeData = __rest(req.body, []);
    const existingMake = yield make_model_1.Make.findOne({ make: makeData.make });
    if (existingMake) {
        if (req.file) {
            (0, fileHandlers_1.deleteFile)(req.file.filename);
        }
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Make already exists");
    }
    if (req.file) {
        makeData.logo = (0, fileHandlers_1.getFileUrl)(req.file.filename);
    }
    const result = yield make_service_1.MakeService.createMake(makeData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Make created successfully",
        data: result,
    });
}));
const getSingleMake = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield make_service_1.MakeService.getSingleMake(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Make fetched successfully",
        data: result,
    });
}));
const getAllMakes = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield make_service_1.MakeService.getAllMakes(paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Makes fetched successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const updateMake = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updateData = __rest(req.body, []);
    const existingMake = yield make_model_1.Make.findById(id);
    if (!existingMake) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Make not found");
    }
    if (req.file) {
        if (existingMake.logo) {
            const oldFilename = existingMake.logo.split("/").pop();
            (0, fileHandlers_1.deleteFile)(oldFilename !== null && oldFilename !== void 0 ? oldFilename : "");
        }
        updateData.logo = (0, fileHandlers_1.getFileUrl)(req.file.filename);
    }
    const result = yield make_service_1.MakeService.updateMake(id, updateData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Make updated successfully",
        data: result,
    });
}));
const deleteMake = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const make = yield make_service_1.MakeService.getSingleMake(id);
    if (!make) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Make not found");
    }
    if (make.logo) {
        const filename = make.logo.split("/").pop();
        (0, fileHandlers_1.deleteFile)(filename !== null && filename !== void 0 ? filename : "");
    }
    const result = yield make_service_1.MakeService.deleteMake(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Make deleted successfully",
        data: result,
    });
}));
exports.MakeController = {
    createMake,
    getSingleMake,
    getAllMakes,
    updateMake,
    deleteMake,
};
