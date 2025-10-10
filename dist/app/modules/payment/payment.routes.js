"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enum/user");
const conditionalAuth_1 = __importDefault(require("../../middlewares/conditionalAuth"));
const router = express_1.default.Router();
router.post("/create-payment-intent", conditionalAuth_1.default, payment_controller_1.PaymentController.createPayment);
router.post("/verify-stripe", conditionalAuth_1.default, payment_controller_1.PaymentController.verifyStripePayment);
router.post("/verify-paypal", conditionalAuth_1.default, payment_controller_1.PaymentController.verifyPaypalPayment);
router.get("/:paymentId", conditionalAuth_1.default, payment_controller_1.PaymentController.getPaymentDetails);
router.get("/user/history", conditionalAuth_1.default, payment_controller_1.PaymentController.getUserPaymentHistory);
router.get("/admin/history", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), payment_controller_1.PaymentController.getAllPayments);
exports.PaymentRoutes = router;
