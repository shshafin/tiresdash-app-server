"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TireWidthTypeRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enum/user");
const wheel_width_type_validation_1 = require("./wheel-width-type.validation");
const wheel_width_type_controller_1 = require("./wheel-width-type.controller");
const router = express_1.default.Router();
router.post("/create", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.default)(wheel_width_type_validation_1.WheelWidthTypeValidation.create), wheel_width_type_controller_1.WheelWidthTypeController.createWheelWidthType);
router.get("/:id", wheel_width_type_controller_1.WheelWidthTypeController.getSingleWheelWidthType);
router.get("/", wheel_width_type_controller_1.WheelWidthTypeController.getAllWheelWidthType);
router.patch("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.default)(wheel_width_type_validation_1.WheelWidthTypeValidation.update), wheel_width_type_controller_1.WheelWidthTypeController.updateWheelWidthType);
router.delete("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), wheel_width_type_controller_1.WheelWidthTypeController.deleteWheelWidthType);
exports.TireWidthTypeRoutes = router;
