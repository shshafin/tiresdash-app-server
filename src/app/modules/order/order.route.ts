import express from "express";
import { OrderController } from "./order.controller";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";
import conditionalAuth from "../../middlewares/conditionalAuth";

const router = express.Router();

router.post("/", conditionalAuth, OrderController.createOrder);

router.get(
  "/",
  // auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  conditionalAuth,
  OrderController.getAllOrders
);
router.get(
  "/my-orders",
  auth(ENUM_USER_ROLE.USER),
  OrderController.getUserOrders
);

router.get(
  "/:id",
  // auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  conditionalAuth,
  OrderController.getOrderById
);
router.get(
  "/user/total-amount",
  conditionalAuth,
  OrderController.getUserTotalOrderAmount
);
router.patch(
  "/:id/status",
  auth(ENUM_USER_ROLE.ADMIN),
  // validateRequest(OrderValidation.updateOrderStatusZodSchema),
  OrderController.updateOrderStatus
);

router.patch("/:id/cancel", conditionalAuth, OrderController.cancelOrder);

router.delete("/:id", auth(ENUM_USER_ROLE.ADMIN), OrderController.deleteOrder);

export const OrderRoutes = router;
