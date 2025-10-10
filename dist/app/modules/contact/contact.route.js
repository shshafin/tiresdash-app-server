"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const contact_controller_1 = require("./contact.controller");
const contact_validation_1 = require("./contact.validation");
const user_1 = require("../../../enum/user");
const router = express_1.default.Router();
router.post("/create", (0, validateRequest_1.default)(contact_validation_1.ContactValidation.createContactZodSchema), contact_controller_1.ContactController.createContact);
router.get("/:id", contact_controller_1.ContactController.getSingleContact);
router.get("/", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), contact_controller_1.ContactController.getAllContacts);
router.patch("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), 
// validateRequest(ContactValidation.updateContactZodSchema),
contact_controller_1.ContactController.updateContact);
router.delete("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), contact_controller_1.ContactController.deleteContact);
exports.ContactRoutes = router;
