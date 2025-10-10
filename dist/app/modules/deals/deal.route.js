"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DealRoutes = void 0;
const express_1 = __importDefault(require("express"));
const deal_controller_1 = require("./deal.controller");
const fileHandlers_1 = require("../../../helpers/fileHandlers");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enum/user");
const router = express_1.default.Router();
// Route to get discounted tires by brand
router.get("/discounted-tires/:brandId", deal_controller_1.DealController.getDiscountedTiresByBrand);
// Route to get discounted wheels by brand
router.get("/discounted-wheels/:brandId", deal_controller_1.DealController.getDiscountedWheelsByBrand);
// Route to get discounted products by brand (Simple Products)
router.get("/discounted-products/:brandId", deal_controller_1.DealController.getDiscountedProductsByBrand);
// Route to apply a deal to a tire
router.post("/apply-deal-to-tire/:tireId", deal_controller_1.DealController.applyDealToTire);
// Route to apply a deal to a wheel
router.post("/apply-deal-to-wheel/:wheelId", deal_controller_1.DealController.applyDealToWheel);
// Route to apply a deal to a product
router.post("/apply-deal-to-product/:productId", deal_controller_1.DealController.applyDealToProduct);
// Route to create a new deal
router.post("/create", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), fileHandlers_1.uploadImage, deal_controller_1.DealController.createDeal);
router.get("/:id", deal_controller_1.DealController.getSingleDeal);
router.get("/", deal_controller_1.DealController.getAllDeals);
router.patch("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), fileHandlers_1.uploadImage, deal_controller_1.DealController.updateDeal);
router.delete("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), deal_controller_1.DealController.deleteDeal);
exports.DealRoutes = router;
