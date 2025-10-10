"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FleetSupportRoutes = void 0;
const express_1 = __importDefault(require("express"));
const fileHandlers_1 = require("../../../../helpers/fileHandlers");
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const support_validation_1 = require("./support.validation");
const support_controller_1 = require("./support.controller");
const conditionalAuth_1 = __importDefault(require("../../../middlewares/conditionalAuth"));
const router = express_1.default.Router();
router.post("/create", conditionalAuth_1.default, fileHandlers_1.uploadFiles, (0, validateRequest_1.default)(support_validation_1.FleetSupportValidation.createFleetSupportZodSchema), support_controller_1.FleetSupportController.createFleetSupport);
router.get("/", 
// auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
support_controller_1.FleetSupportController.getAllFleetSupports);
router.get("/:id", 
// auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
support_controller_1.FleetSupportController.getSingleFleetSupport);
router.patch("/:id", 
// auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
fileHandlers_1.uploadFiles, (0, validateRequest_1.default)(support_validation_1.FleetSupportValidation.updateFleetSupportZodSchema), support_controller_1.FleetSupportController.updateFleetSupport);
router.delete("/:id", 
// auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
support_controller_1.FleetSupportController.deleteFleetSupport);
// Add these to your existing router
router.get("/user/:userId", 
// auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
support_controller_1.FleetSupportController.getSupportsByUser);
router.patch("/:id/status", 
// auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
support_controller_1.FleetSupportController.updateStatus);
router.post("/:id/response", 
// auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
fileHandlers_1.uploadFiles, support_controller_1.FleetSupportController.addResponse);
router.get("/statistics", 
// auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
support_controller_1.FleetSupportController.getStatistics);
exports.FleetSupportRoutes = router;
