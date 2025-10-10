"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TireRoutes = void 0;
const express_1 = __importDefault(require("express"));
const tire_controller_1 = require("./tire.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enum/user");
const fileHandlers_1 = require("../../../helpers/fileHandlers");
const router = express_1.default.Router();
router.post("/import-csv", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), fileHandlers_1.uploadCSV, tire_controller_1.TireController.uploadCSVTires);
router.post("/create", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), fileHandlers_1.uploadImages, tire_controller_1.TireController.createTire);
router.get("/", tire_controller_1.TireController.getAllTires);
router.get("/:id", tire_controller_1.TireController.getSingleTire);
router.patch("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), fileHandlers_1.uploadImages, tire_controller_1.TireController.updateTire);
router.delete("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), tire_controller_1.TireController.deleteTire);
exports.TireRoutes = router;
