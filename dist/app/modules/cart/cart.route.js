"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartRoutes = void 0;
const express_1 = __importDefault(require("express"));
const cart_controller_1 = require("./cart.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enum/user");
const conditionalAuth_1 = __importDefault(require("../../middlewares/conditionalAuth"));
const router = express_1.default.Router();
router.post("/", conditionalAuth_1.default, cart_controller_1.CartController.createCart);
// Get all carts - admin only
router.get("/", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), cart_controller_1.CartController.getAllCarts);
// Get user's own cart - user access
// Get specific user's cart - admin access
router.get("/:userId", (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN), cart_controller_1.CartController.getCartByUserId);
// Add item to cart - user can add to their own cart
router.post("/:userId/items", conditionalAuth_1.default, cart_controller_1.CartController.addItemToCart);
// Update cart item quantity - user can update their own cart
router.patch("/:userId/items/:productId", conditionalAuth_1.default, cart_controller_1.CartController.updateItemQuantity);
// Remove item from cart - user can modify their own cart
router.put("/:userId/items/:productId", conditionalAuth_1.default, cart_controller_1.CartController.removeItemFromCart);
// Clear cart - user can clear their own cart
router.delete("/:userId/clear", conditionalAuth_1.default, cart_controller_1.CartController.clearCart);
exports.CartRoutes = router;
