"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const review_controller_1 = require("./review.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const review_validation_1 = require("./review.validation");
const conditionalAuth_1 = __importDefault(require("../../middlewares/conditionalAuth"));
const router = express_1.default.Router();
router.post("/", conditionalAuth_1.default, (0, validateRequest_1.default)(review_validation_1.ReviewValidation.createReviewZodSchema), review_controller_1.ReviewController.createReview);
router.get("/", review_controller_1.ReviewController.getAllReviews);
router.get("/:id", review_controller_1.ReviewController.getSingleReview);
router.get("/product/:productId/:productType", review_controller_1.ReviewController.getReviewsByProduct);
// New route for getting review statistics
router.get("/stats/:productId/:productType", review_controller_1.ReviewController.getReviewStats);
// New route for getting user's own reviews
router.get("/my-reviews", conditionalAuth_1.default, review_controller_1.ReviewController.getMyReviews);
router.patch("/:id", conditionalAuth_1.default, (0, validateRequest_1.default)(review_validation_1.ReviewValidation.updateReviewZodSchema), review_controller_1.ReviewController.updateReview);
router.delete("/:id", conditionalAuth_1.default, review_controller_1.ReviewController.deleteReview);
exports.ReviewRoutes = router;
