"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WheelRoutes = void 0;
const express_1 = __importDefault(require("express"));
const wheel_controller_1 = require("./wheel.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enum/user");
const fileHandlers_1 = require("../../../helpers/fileHandlers");
const router = express_1.default.Router();
router.post("/import-csv", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), fileHandlers_1.uploadCSV, wheel_controller_1.WheelController.uploadCSVTires);
router.post("/create", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), fileHandlers_1.uploadImages, wheel_controller_1.WheelController.createWheel);
router.get("/", wheel_controller_1.WheelController.getAllWheels);
router.get("/:id", wheel_controller_1.WheelController.getSingleWheel);
router.patch("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), fileHandlers_1.uploadImages, wheel_controller_1.WheelController.updateWheel);
router.delete("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), wheel_controller_1.WheelController.deleteWheel);
exports.WheelRoutes = router;
