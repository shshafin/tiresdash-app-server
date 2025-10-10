"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WheelRatioRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enum/user");
const wheel_ratio_controller_1 = require("./wheel-ratio.controller");
const wheel_ratio_validation_1 = require("./wheel-ratio.validation");
const router = express_1.default.Router();
router.post("/create", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.default)(wheel_ratio_validation_1.WheelRatioValidation.create), wheel_ratio_controller_1.WheelRatioController.createWheelRatio);
router.get("/:id", wheel_ratio_controller_1.WheelRatioController.getSingleWheelRatio);
router.get("/", wheel_ratio_controller_1.WheelRatioController.getAllWheelRatio);
router.patch("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.default)(wheel_ratio_validation_1.WheelRatioValidation.update), wheel_ratio_controller_1.WheelRatioController.updateWheelRatio);
router.delete("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), wheel_ratio_controller_1.WheelRatioController.deleteWheelRatio);
exports.WheelRatioRoutes = router;
