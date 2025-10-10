import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { WishlistController } from "./wishlist.controller";
import { WishlistValidation } from "./wishlist.validation";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";
import conditionalAuth from "../../middlewares/conditionalAuth";

const router = express.Router();

router.post(
  "/",
  conditionalAuth,
  validateRequest(WishlistValidation.createWishlistZodSchema),
  WishlistController.createWishlist
);

router.get("/my-wishlist", conditionalAuth, WishlistController.getMyWishlist);

router.post(
  "/items",
  conditionalAuth,
  validateRequest(WishlistValidation.addItemToWishlistZodSchema),
  WishlistController.addItemToWishlist
);

router.delete(
  "/items/:productId",
  conditionalAuth,
  WishlistController.removeItemFromWishlist
);

router.delete("/clear", conditionalAuth, WishlistController.clearWishlist);

export const WishlistRoutes = router;
