"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleTypeRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enum/user");
const vehicle_type_validation_1 = require("./vehicle-type.validation");
const vehicle_type_controller_1 = require("./vehicle-type.controller");
const router = express_1.default.Router();
router.post("/create", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.default)(vehicle_type_validation_1.VehicleTypeValidation.create), vehicle_type_controller_1.VehicleTypeController.createVehicleType);
router.get("/:id", vehicle_type_controller_1.VehicleTypeController.getSingleVehicleType);
router.get("/", vehicle_type_controller_1.VehicleTypeController.getAllVehicleType);
router.patch("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.default)(vehicle_type_validation_1.VehicleTypeValidation.update), vehicle_type_controller_1.VehicleTypeController.updateVehicleType);
router.delete("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), vehicle_type_controller_1.VehicleTypeController.deleteVehicleType);
exports.VehicleTypeRoutes = router;
