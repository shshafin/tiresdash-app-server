import express from "express";
import { PaymentController } from "./payment.controller";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";
import conditionalAuth from "../../middlewares/conditionalAuth";

const router = express.Router();

router.post(
  "/create-payment-intent",
  conditionalAuth,
  PaymentController.createPayment
);

router.post(
  "/verify-stripe",
  conditionalAuth,
  PaymentController.verifyStripePayment
);

router.post(
  "/verify-paypal",
  conditionalAuth,
  PaymentController.verifyPaypalPayment
);

router.get("/:paymentId", conditionalAuth, PaymentController.getPaymentDetails);

router.get(
  "/user/history",
  conditionalAuth,
  PaymentController.getUserPaymentHistory
);

router.get(
  "/admin/history",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  PaymentController.getAllPayments
);

export const PaymentRoutes = router;
