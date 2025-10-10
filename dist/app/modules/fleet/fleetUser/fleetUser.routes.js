"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FleetUserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const fleetUser_controller_1 = require("./fleetUser.controller");
const fleetUser_validation_1 = require("./fleetUser.validation");
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const user_1 = require("../../../../enum/user");
const fleetAuth_1 = __importDefault(require("../../../middlewares/fleetAuth"));
const router = express_1.default.Router();
router.post("/register", (0, validateRequest_1.default)(fleetUser_validation_1.FleetUserValidation.createFleetUserZodSchema), fleetUser_controller_1.FleetUserController.createFleetUser);
router.get("/", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), fleetUser_controller_1.FleetUserController.getAllFleetUsers);
router.get("/:id", 
// auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
fleetUser_controller_1.FleetUserController.getSingleFleetUser);
router.patch("/:id", 
// auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
(0, validateRequest_1.default)(fleetUser_validation_1.FleetUserValidation.updateFleetUserZodSchema), fleetUser_controller_1.FleetUserController.updateFleetUser);
router.delete("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), fleetUser_controller_1.FleetUserController.deleteFleetUser);
router.get("/profile/me", (0, fleetAuth_1.default)(user_1.ENUM_USER_ROLE.FLEET_USER), fleetUser_controller_1.FleetUserController.getMyProfile);
// Profile routes
router.get("/profile/:id", (0, fleetAuth_1.default)(user_1.ENUM_USER_ROLE.FLEET_USER), fleetUser_controller_1.FleetUserController.getFleetUserProfile);
router.patch("/profile/:id", (0, fleetAuth_1.default)(user_1.ENUM_USER_ROLE.FLEET_USER), (0, validateRequest_1.default)(fleetUser_validation_1.FleetUserValidation.updateFleetUserZodSchema), fleetUser_controller_1.FleetUserController.updateFleetUserProfile);
exports.FleetUserRoutes = router;
