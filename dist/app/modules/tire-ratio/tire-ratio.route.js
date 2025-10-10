"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TireRatioRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enum/user");
const tire_ratio_validation_1 = require("./tire-ratio.validation");
const tire_ratio_controller_1 = require("./tire-ratio.controller");
const router = express_1.default.Router();
router.post("/create", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.default)(tire_ratio_validation_1.TireRatioValidation.create), tire_ratio_controller_1.TireRatioController.createTireRatio);
router.get("/:id", tire_ratio_controller_1.TireRatioController.getSingleTireRatio);
router.get("/", tire_ratio_controller_1.TireRatioController.getAllTireRatio);
router.patch("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.default)(tire_ratio_validation_1.TireRatioValidation.update), tire_ratio_controller_1.TireRatioController.updateTireRatio);
router.delete("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), tire_ratio_controller_1.TireRatioController.deleteTireRatio);
exports.TireRatioRoutes = router;
