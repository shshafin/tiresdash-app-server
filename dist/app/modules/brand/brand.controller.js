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
exports.BrandController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const brand_service_1 = require("./brand.service");
const pick_1 = __importDefault(require("../../../shared/pick"));
const pagination_1 = require("../../../constants/pagination");
const brand_constants_1 = require("./brand.constants");
const brand_model_1 = require("./brand.model");
const fileHandlers_1 = require("../../../helpers/fileHandlers");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const createBrand = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const brandData = __rest(req.body, []);
    const existingBrand = yield brand_model_1.Brand.findOne({ name: brandData.name });
    if (existingBrand) {
        if (req.file) {
            (0, fileHandlers_1.deleteFile)(req.file.filename);
        }
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Brand already exists");
    }
    if (req.file) {
        brandData.logo = (0, fileHandlers_1.getFileUrl)(req.file.filename);
    }
    const result = yield brand_service_1.BrandService.createBrand(brandData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Brand created successfully",
        data: result,
    });
}));
const getAllBrands = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, brand_constants_1.brandFilterableFields);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield brand_service_1.BrandService.getAllBrands(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Brands retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const getSingleBrand = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield brand_service_1.BrandService.getSingleBrand(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Brand retrieved successfully",
        data: result,
    });
}));
const updateBrand = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updateData = __rest(req.body, []);
    const existingBrand = yield brand_model_1.Brand.findById(id);
    if (!existingBrand) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Brand not found");
    }
    if (req.file) {
        if (existingBrand.logo) {
            const oldFilename = existingBrand.logo.split("/").pop();
            (0, fileHandlers_1.deleteFile)(oldFilename !== null && oldFilename !== void 0 ? oldFilename : "");
        }
        updateData.logo = (0, fileHandlers_1.getFileUrl)(req.file.filename);
    }
    const result = yield brand_service_1.BrandService.updateBrand(id, updateData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Brand updated successfully",
        data: result,
    });
}));
const deleteBrand = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const brand = yield brand_service_1.BrandService.getSingleBrand(id);
    if (!brand) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Brand not found");
    }
    if (brand.logo) {
        const filename = brand.logo.split("/").pop();
        (0, fileHandlers_1.deleteFile)(filename !== null && filename !== void 0 ? filename : "");
    }
    const result = yield brand_service_1.BrandService.deleteBrand(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Brand deleted successfully",
        data: result,
    });
}));
exports.BrandController = {
    createBrand,
    getAllBrands,
    getSingleBrand,
    updateBrand,
    deleteBrand,
};
