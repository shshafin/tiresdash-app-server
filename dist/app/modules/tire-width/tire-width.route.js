"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TireWidthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enum/user");
const tire_width_validation_1 = require("./tire-width.validation");
const tire_width_controller_1 = require("./tire-width.controller");
const router = express_1.default.Router();
router.post("/create", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.default)(tire_width_validation_1.TireWidthValidation.create), tire_width_controller_1.TireWidthController.createTireWidth);
router.get("/:id", tire_width_controller_1.TireWidthController.getSingleTireWidth);
router.get("/", tire_width_controller_1.TireWidthController.getAllTireWidth);
router.patch("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.default)(tire_width_validation_1.TireWidthValidation.update), tire_width_controller_1.TireWidthController.updateTireWidth);
router.delete("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), tire_width_controller_1.TireWidthController.deleteTireWidth);
exports.TireWidthRoutes = router;
