import express from "express";
import { ReviewController } from "./review.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ReviewValidation } from "./review.validation";
import conditionalAuth from "../../middlewares/conditionalAuth";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/",
  conditionalAuth,
  validateRequest(ReviewValidation.createReviewZodSchema),
  ReviewController.createReview
);

router.get("/", ReviewController.getAllReviews);
router.get("/:id", ReviewController.getSingleReview);
router.get(
  "/product/:productId/:productType",
  ReviewController.getReviewsByProduct
);

// New route for getting review statistics
router.get("/stats/:productId/:productType", ReviewController.getReviewStats);

// New route for getting user's own reviews
router.get("/my-reviews", conditionalAuth, ReviewController.getMyReviews);

router.patch(
  "/:id",
  conditionalAuth,
  validateRequest(ReviewValidation.updateReviewZodSchema),
  ReviewController.updateReview
);

router.delete("/:id", conditionalAuth, ReviewController.deleteReview);

export const ReviewRoutes = router;
