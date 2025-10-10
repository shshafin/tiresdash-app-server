"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const deal_controller_1 = require("./deal.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_1 = require("../../../enum/user");
const deal_validation_1 = require("./deal.validation");
const router = express_1.default.Router();
// ADMIN ROUTES
router.post("/", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(deal_validation_1.DealValidation.createDealZodSchema), deal_controller_1.DealController.createDeal);
router.patch("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(deal_validation_1.DealValidation.updateDealZodSchema), deal_controller_1.DealController.updateDeal);
router.delete("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), deal_controller_1.DealController.deleteDeal);
router.get("/admin/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), deal_controller_1.DealController.getSingleDeal);
router.get("/admin", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), deal_controller_1.DealController.getAllDeals);
// CUSTOMER ROUTES
router.get("/active", deal_controller_1.DealController.getActiveDeals);
router.get("/discounted/:brandId/:collection", deal_controller_1.DealController.getDiscountedItems);
exports.default = router;
