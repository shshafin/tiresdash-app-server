"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const wishlist_controller_1 = require("./wishlist.controller");
const wishlist_validation_1 = require("./wishlist.validation");
const conditionalAuth_1 = __importDefault(require("../../middlewares/conditionalAuth"));
const router = express_1.default.Router();
router.post("/", conditionalAuth_1.default, (0, validateRequest_1.default)(wishlist_validation_1.WishlistValidation.createWishlistZodSchema), wishlist_controller_1.WishlistController.createWishlist);
router.get("/my-wishlist", conditionalAuth_1.default, wishlist_controller_1.WishlistController.getMyWishlist);
router.post("/items", conditionalAuth_1.default, (0, validateRequest_1.default)(wishlist_validation_1.WishlistValidation.addItemToWishlistZodSchema), wishlist_controller_1.WishlistController.addItemToWishlist);
router.delete("/items/:productId", conditionalAuth_1.default, wishlist_controller_1.WishlistController.removeItemFromWishlist);
router.delete("/clear", conditionalAuth_1.default, wishlist_controller_1.WishlistController.clearWishlist);
exports.WishlistRoutes = router;
