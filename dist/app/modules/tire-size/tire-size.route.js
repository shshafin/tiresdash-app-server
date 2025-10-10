"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TireSizeRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const tire_size_validation_1 = require("./tire-size-validation");
const tire_size_controller_1 = require("./tire-size.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enum/user");
const router = express_1.default.Router();
router.post("/create", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.default)(tire_size_validation_1.TireSizeValidation.createTireSizeZodSchema), tire_size_controller_1.TireSizeController.createTireSize);
router.get("/:id", tire_size_controller_1.TireSizeController.deleteTireSize);
router.get("/", tire_size_controller_1.TireSizeController.getAllTireSizes);
router.patch("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.default)(tire_size_validation_1.TireSizeValidation.updateTireSizeZodSchema), tire_size_controller_1.TireSizeController.updateTireSize);
router.delete("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), tire_size_controller_1.TireSizeController.deleteTireSize);
exports.TireSizeRoutes = router;
