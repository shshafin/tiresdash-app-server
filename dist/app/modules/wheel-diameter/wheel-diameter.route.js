"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WheelDiameterRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enum/user");
const wheel_diameter_controller_1 = require("./wheel-diameter.controller");
const wheel_diameter_validation_1 = require("./wheel-diameter.validation");
const router = express_1.default.Router();
router.post("/create", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.default)(wheel_diameter_validation_1.WheelDiameterValidation.create), wheel_diameter_controller_1.WheelDiameterController.createWheelDiameter);
router.get("/:id", wheel_diameter_controller_1.WheelDiameterController.getSingleWheelDiameter);
router.get("/", wheel_diameter_controller_1.WheelDiameterController.getAllWheelDiameter);
router.patch("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.default)(wheel_diameter_validation_1.WheelDiameterValidation.update), wheel_diameter_controller_1.WheelDiameterController.updateWheelDiameter);
router.delete("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), wheel_diameter_controller_1.WheelDiameterController.deleteWheelDiameter);
exports.WheelDiameterRoutes = router;
