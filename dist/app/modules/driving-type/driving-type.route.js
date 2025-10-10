"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrivingTypeRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const driving_type_validation_1 = require("./driving-type.validation");
const driving_type_controller_1 = require("./driving-type.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enum/user");
const router = express_1.default.Router();
router.post("/create", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.default)(driving_type_validation_1.DrivingTypeValidation.createDrivingTypeZodSchema), driving_type_controller_1.DrivingTypeController.createDrivingType);
router.get("/:id", driving_type_controller_1.DrivingTypeController.getSingleDrivingType);
router.get("/", driving_type_controller_1.DrivingTypeController.getAllDrivingTypes);
router.patch("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.default)(driving_type_validation_1.DrivingTypeValidation.updateDrivingTypeZodSchema), driving_type_controller_1.DrivingTypeController.updateDrivingType);
router.delete("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), driving_type_controller_1.DrivingTypeController.deleteDrivingType);
exports.DrivingTypeRoutes = router;
