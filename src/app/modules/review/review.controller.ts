import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ReviewService } from "./review.service";
import { IReview } from "./review.interface";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";

const getUserTypeFromRole = (role: string): "user" | "fleet_user" => {
  return role === "fleet_user" ? "fleet_user" : "user";
};

const createReview = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const userRole = req.user?.role;
  const userType = getUserTypeFromRole(userRole);

  const payload = {
    ...req.body,
    user: userId,
    userType,
  };

  const result = await ReviewService.createReview(payload);

  sendResponse<IReview>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields);
  const result = await ReviewService.getAllReviews(
    req.query,
    paginationOptions
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviews retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ReviewService.getSingleReview(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review retrieved successfully",
    data: result,
  });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  const userRole = req.user?.role;
  const userType = getUserTypeFromRole(userRole);

  const result = await ReviewService.updateReview(
    id,
    req.body,
    userId,
    userType
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review updated successfully",
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  const userRole = req.user?.role;
  const userType = getUserTypeFromRole(userRole);

  const result = await ReviewService.deleteReview(id, userId, userType);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review deleted successfully",
    data: result,
  });
});

const getReviewsByProduct = catchAsync(async (req: Request, res: Response) => {
  const { productId, productType } = req.params;
  const result = await ReviewService.getReviewsByProduct(
    productId,
    productType as any
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product reviews retrieved successfully",
    data: result,
  });
});

const getReviewStats = catchAsync(async (req: Request, res: Response) => {
  const { productId, productType } = req.params;
  const result = await ReviewService.getReviewStats(
    productId,
    productType as any
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review stats retrieved successfully",
    data: result,
  });
});

const getMyReviews = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const userRole = req.user?.role;
  const userType = getUserTypeFromRole(userRole);

  const result = await ReviewService.getReviewsByUser(userId, userType);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your reviews retrieved successfully",
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getReviewsByProduct,
  getReviewStats,
  getMyReviews, // Added new controller
};
