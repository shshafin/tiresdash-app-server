"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FleetVehicleRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const vehicle_validation_1 = require("./vehicle.validation");
const vehicle_controller_1 = require("./vehicle.controller");
const router = express_1.default.Router();
router.post("/", 
// auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
(0, validateRequest_1.default)(vehicle_validation_1.FleetVehicleValidation.createFleetVehicleZodSchema), vehicle_controller_1.FleetVehicleController.createFleetVehicle);
router.get("/:id", vehicle_controller_1.FleetVehicleController.getSingleFleetVehicle);
router.get("/", vehicle_controller_1.FleetVehicleController.getAllFleetVehicles);
router.patch("/:id", 
// auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
(0, validateRequest_1.default)(vehicle_validation_1.FleetVehicleValidation.updateFleetVehicleZodSchema), vehicle_controller_1.FleetVehicleController.updateFleetVehicle);
router.delete("/:id", 
// auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
vehicle_controller_1.FleetVehicleController.deleteFleetVehicle);
exports.FleetVehicleRoutes = router;
