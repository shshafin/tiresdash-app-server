"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FleetNewsRoutes = void 0;
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const user_1 = require("../../../../enum/user");
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const news_validation_1 = require("./news.validation");
const news_controller_1 = require("./news.controller");
const fleetAuth_1 = __importDefault(require("../../../middlewares/fleetAuth"));
const conditionalAuth_1 = __importDefault(require("../../../middlewares/conditionalAuth"));
const router = express_1.default.Router();
router.post("/create", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.default)(news_validation_1.FleetNewsValidation.createFleetNewsZodSchema), news_controller_1.FleetNewsController.createFleetNews);
router.get("/", conditionalAuth_1.default, news_controller_1.FleetNewsController.getAllFleetNews);
router.get("/:id", conditionalAuth_1.default, news_controller_1.FleetNewsController.getSingleFleetNews);
router.patch("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.default)(news_validation_1.FleetNewsValidation.updateFleetNewsZodSchema), news_controller_1.FleetNewsController.updateFleetNews);
router.delete("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), news_controller_1.FleetNewsController.deleteFleetNews);
// Additional Routes
router.get("/featured/news", (0, fleetAuth_1.default)(user_1.ENUM_USER_ROLE.FLEET_USER), news_controller_1.FleetNewsController.getFeaturedNews);
router.get("/recent/news", (0, fleetAuth_1.default)(user_1.ENUM_USER_ROLE.FLEET_USER), news_controller_1.FleetNewsController.getRecentNews);
exports.FleetNewsRoutes = router;
