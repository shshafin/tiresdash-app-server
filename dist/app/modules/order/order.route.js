"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("./order.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enum/user");
const conditionalAuth_1 = __importDefault(require("../../middlewares/conditionalAuth"));
const router = express_1.default.Router();
router.post("/", conditionalAuth_1.default, order_controller_1.OrderController.createOrder);
router.get("/", 
// auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
conditionalAuth_1.default, order_controller_1.OrderController.getAllOrders);
router.get("/my-orders", (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER), order_controller_1.OrderController.getUserOrders);
router.get("/:id", 
// auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
conditionalAuth_1.default, order_controller_1.OrderController.getOrderById);
router.get("/user/total-amount", conditionalAuth_1.default, order_controller_1.OrderController.getUserTotalOrderAmount);
router.patch("/:id/status", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), 
// validateRequest(OrderValidation.updateOrderStatusZodSchema),
order_controller_1.OrderController.updateOrderStatus);
router.patch("/:id/cancel", conditionalAuth_1.default, order_controller_1.OrderController.cancelOrder);
router.delete("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), order_controller_1.OrderController.deleteOrder);
exports.OrderRoutes = router;
