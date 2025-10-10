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
exports.FleetNewsController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../../shared/catchAsync"));
const news_service_1 = require("./news.service");
const sendResponse_1 = __importDefault(require("../../../../shared/sendResponse"));
const pick_1 = __importDefault(require("../../../../shared/pick"));
const news_constants_1 = require("./news.constants");
const pagination_1 = require("../../../../constants/pagination");
const news_model_1 = require("./news.model");
const ApiError_1 = __importDefault(require("../../../../errors/ApiError"));
const createFleetNews = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = req.body;
    if (typeof data === "string") {
        data = JSON.parse(data);
    }
    const result = yield news_service_1.FleetNewsService.createFleetNews(data);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Fleet news created successfully",
        data: result,
    });
}));
const getAllFleetNews = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, news_constants_1.fleetNewsFilterableFields);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield news_service_1.FleetNewsService.getAllFleetNews(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Fleet news retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const getSingleFleetNews = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield news_service_1.FleetNewsService.getSingleFleetNews(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Fleet news retrieved successfully",
        data: result,
    });
}));
const updateFleetNews = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let { updatedData } = req.body;
    if (typeof updatedData === "string") {
        updatedData = JSON.parse(updatedData);
    }
    const existingNews = yield news_model_1.FleetNews.findById(id);
    if (!existingNews) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Fleet news not found");
    }
    const result = yield news_service_1.FleetNewsService.updateFleetNews(id, updatedData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Fleet news updated successfully",
        data: result,
    });
}));
const deleteFleetNews = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const news = yield news_model_1.FleetNews.findById(id);
    if (!news) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Fleet news not found");
    }
    const result = yield news_service_1.FleetNewsService.deleteFleetNews(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Fleet news deleted successfully",
        data: result,
    });
}));
// Additional Controllers
const getFeaturedNews = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = req.query.limit ? Number(req.query.limit) : 3;
    const result = yield news_service_1.FleetNewsService.getFeaturedFleetNews(limit);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Featured fleet news retrieved successfully",
        data: result,
    });
}));
const getRecentNews = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const result = yield news_service_1.FleetNewsService.getRecentFleetNews(limit);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Recent fleet news retrieved successfully",
        data: result,
    });
}));
exports.FleetNewsController = {
    createFleetNews,
    getAllFleetNews,
    getSingleFleetNews,
    updateFleetNews,
    deleteFleetNews,
    getFeaturedNews,
    getRecentNews,
};
