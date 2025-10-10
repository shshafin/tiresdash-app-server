"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FleetAppointmentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../../enum/user");
const fileHandlers_1 = require("../../../../helpers/fileHandlers");
const appointment_validation_1 = require("./appointment.validation");
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const appointment_controller_1 = require("./appointment.controller");
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const fleetAuth_1 = __importDefault(require("../../../middlewares/fleetAuth"));
const conditionalAuth_1 = __importDefault(require("../../../middlewares/conditionalAuth"));
const router = express_1.default.Router();
router.post("/create", (0, fleetAuth_1.default)(user_1.ENUM_USER_ROLE.FLEET_USER), fileHandlers_1.uploadFiles, (0, validateRequest_1.default)(appointment_validation_1.FleetAppointmentValidation.createFleetAppointmentZodSchema), appointment_controller_1.FleetAppointmentController.createFleetAppointment);
router.get("/", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), appointment_controller_1.FleetAppointmentController.getAllFleetAppointments);
router.get("/my-appointments", (0, fleetAuth_1.default)(user_1.ENUM_USER_ROLE.FLEET_USER), appointment_controller_1.FleetAppointmentController.getMyFleetAppointments);
router.get("/:id", conditionalAuth_1.default, appointment_controller_1.FleetAppointmentController.getSingleFleetAppointment);
router.patch("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), fileHandlers_1.uploadFiles, (0, validateRequest_1.default)(appointment_validation_1.FleetAppointmentValidation.updateFleetAppointmentZodSchema), appointment_controller_1.FleetAppointmentController.updateFleetAppointment);
router.patch("/:id/fleet-ref", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), appointment_controller_1.FleetAppointmentController.updateFleetRef);
router.delete("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), appointment_controller_1.FleetAppointmentController.deleteFleetAppointment);
// Additional Routes
router.get("/vehicle/:vehicleId", 
// auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
appointment_controller_1.FleetAppointmentController.getAppointmentsByVehicle);
router.patch("/:id/status", 
// auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
appointment_controller_1.FleetAppointmentController.updateAppointmentStatus);
router.get("/upcoming/appointments", 
// auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
appointment_controller_1.FleetAppointmentController.getUpcomingAppointments);
exports.FleetAppointmentRoutes = router;
