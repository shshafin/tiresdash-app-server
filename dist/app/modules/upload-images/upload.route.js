"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadRoutes = void 0;
// routes/mediaRoutes.ts
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enum/user");
const upload_controller_1 = require("./upload.controller");
const fileHandlers_1 = require("../../../helpers/fileHandlers");
const router = express_1.default.Router();
router.post("/images", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), fileHandlers_1.uploadImages, upload_controller_1.uploadController.createMedia);
exports.UploadRoutes = router;
