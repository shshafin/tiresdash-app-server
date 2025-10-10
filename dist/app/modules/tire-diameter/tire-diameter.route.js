"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TireDiameterRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enum/user");
const tire_diameter_validation_1 = require("./tire-diameter.validation");
const tire_diameter_controller_1 = require("./tire-diameter.controller");
const router = express_1.default.Router();
router.post("/create", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.default)(tire_diameter_validation_1.TireDiameterValidation.create), tire_diameter_controller_1.TireDiameterController.createTireDiameter);
router.get("/:id", tire_diameter_controller_1.TireDiameterController.getSingleTireDiameter);
router.get("/", tire_diameter_controller_1.TireDiameterController.getAllTireDiameter);
router.patch("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.default)(tire_diameter_validation_1.TireDiameterValidation.update), tire_diameter_controller_1.TireDiameterController.updateTireDiameter);
router.delete("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), tire_diameter_controller_1.TireDiameterController.deleteTireDiameter);
exports.TireDiameterRoutes = router;
