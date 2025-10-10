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
exports.DealController = void 0;
const deal_service_1 = require("./deal.service");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const deal_model_1 = require("./deal.model");
const fileHandlers_1 = require("../../../helpers/fileHandlers");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const deals_constant_1 = require("./deals.constant");
const pagination_1 = require("../../../constants/pagination");
// Get discounted tires by brand
const getDiscountedTiresByBrand = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { brandId } = req.params;
    // Get all discounted tires for the brand
    const tires = yield deal_service_1.DealService.getDiscountedTiresByBrand(brandId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Discounted tires retrieved successfully",
        data: tires,
    });
}));
// Get discounted wheels by brand
const getDiscountedWheelsByBrand = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { brandId } = req.params;
    // Get all discounted wheels for the brand
    const wheels = yield deal_service_1.DealService.getDiscountedWheelsByBrand(brandId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Discounted wheels retrieved successfully",
        data: wheels,
    });
}));
// Get discounted products by brand
const getDiscountedProductsByBrand = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { brandId } = req.params;
    // Get all discounted products (simple products) for the brand
    const products = yield deal_service_1.DealService.getDiscountedProductsByBrand(brandId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Discounted products retrieved successfully",
        data: products,
    });
}));
// Apply deal to a tire
const applyDealToTire = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tireId } = req.params;
    const updatedTire = yield deal_service_1.DealService.applyDiscountToTire(tireId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Deal applied to tire successfully",
        data: updatedTire,
    });
}));
// Apply deal to a wheel
const applyDealToWheel = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { wheelId } = req.params;
    const updatedWheel = yield deal_service_1.DealService.applyDiscountToWheel(wheelId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Deal applied to wheel successfully",
        data: updatedWheel,
    });
}));
// Apply deal to a product
const applyDealToProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const updatedProduct = yield deal_service_1.DealService.applyDiscountToProduct(productId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Deal applied to product successfully",
        data: updatedProduct,
    });
}));
// Create a new deal
const createDeal = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dealData = JSON.parse(req.body.data);
    const existingDeals = yield deal_model_1.Deal.findOne({
        title: dealData.title,
    });
    if (existingDeals) {
        if (req.file) {
            (0, fileHandlers_1.deleteFile)(req.file.filename);
        }
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Deals already exists");
    }
    if (req.file) {
        dealData.image = (0, fileHandlers_1.getFileUrl)(req.file.filename);
    }
    const result = yield deal_service_1.DealService.createDeal(dealData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Deal created successfully",
        data: result,
    });
}));
const getSingleDeal = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield deal_service_1.DealService.getSingleDeal(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Single Deal fetched successfully",
        data: result,
    });
}));
const getAllDeals = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, deals_constant_1.dealFilterableFields);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield deal_service_1.DealService.getAllDeals(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Deals retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const updateDeal = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const payload = JSON.parse(req.body.data);
    const existingDeal = yield deal_model_1.Deal.findById(id);
    if (!existingDeal) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Deal not found!");
    }
    if (req.file) {
        if (existingDeal.image) {
            const oldFilename = existingDeal.image.split("/").pop();
            (0, fileHandlers_1.deleteFile)(oldFilename !== null && oldFilename !== void 0 ? oldFilename : "");
        }
        payload.image = (0, fileHandlers_1.getFileUrl)(req.file.filename);
    }
    const result = yield deal_service_1.DealService.updateDeal(id, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Deal updated successfully",
        data: result,
    });
}));
const deleteDeal = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deal = yield deal_model_1.Deal.findById(id);
    if (!deal) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Deal not found");
    }
    if (deal.image) {
        const filename = deal.image.split("/").pop();
        (0, fileHandlers_1.deleteFile)(filename !== null && filename !== void 0 ? filename : "");
    }
    const result = yield deal_service_1.DealService.deleteDeal(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Deal deleted successfully",
        data: result,
    });
}));
exports.DealController = {
    createDeal,
    getDiscountedTiresByBrand,
    getDiscountedWheelsByBrand,
    getDiscountedProductsByBrand,
    applyDealToTire,
    applyDealToWheel,
    applyDealToProduct,
    getSingleDeal,
    getAllDeals,
    updateDeal,
    deleteDeal,
};
