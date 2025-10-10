"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const model_controller_1 = require("./model.controller");
const model_validation_1 = require("./model.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enum/user");
const router = express_1.default.Router();
router.post("/create", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.default)(model_validation_1.ModelValidation.createModelZodSchema), model_controller_1.ModelController.createModel);
router.get("/:id", model_controller_1.ModelController.getSingleModel);
router.get("/", model_controller_1.ModelController.getAllModels);
router.patch("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.default)(model_validation_1.ModelValidation.updateModelZodSchema), model_controller_1.ModelController.updateModel);
router.delete("/:id", model_controller_1.ModelController.deleteModel);
exports.ModelRoutes = router;
