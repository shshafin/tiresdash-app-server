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
exports.uploadController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const upload_service_1 = require("./upload.service");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const createMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return (0, sendResponse_1.default)(res, {
                statusCode: http_status_1.default.BAD_REQUEST,
                success: false,
                message: "No images uploaded!",
            });
        }
        const images = files.map((file) => {
            var _a;
            return ({
                filename: file.filename,
                url: `/storage/${file.filename}`,
                userId: ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id) || undefined,
            });
        });
        const result = yield upload_service_1.uploadService.createMedia(images);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Images uploaded successfully!",
            data: result,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.INTERNAL_SERVER_ERROR,
            success: false,
            message: error instanceof Error ? error.message : "Upload failed",
        });
    }
});
exports.uploadController = { createMedia };
