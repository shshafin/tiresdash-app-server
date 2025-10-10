import { Request, Response } from "express";
import httpStatus from "http-status";

import { FleetUserService } from "./fleetUser.service";

import { IFleetUser } from "./fleetUser.interface";
import catchAsync from "../../../../shared/catchAsync";
import sendResponse from "../../../../shared/sendResponse";
import pick from "../../../../shared/pick";
import { fleetUserFilterableFields } from "./fleetUser.constants";
import { paginationFields } from "../../../../constants/pagination";

const createFleetUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await FleetUserService.createFleetUser(payload);

  sendResponse<IFleetUser>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Fleet user created successfully",
    data: result,
  });
});

const getAllFleetUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, fleetUserFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await FleetUserService.getAllFleetUsers(
    filters,
    paginationOptions
  );

  sendResponse<IFleetUser[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fleet users retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleFleetUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await FleetUserService.getSingleFleetUser(id);

  sendResponse<IFleetUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fleet user retrieved successfully",
    data: result,
  });
});

const updateFleetUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;

  const result = await FleetUserService.updateFleetUser(id, payload);

  sendResponse<IFleetUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fleet user updated successfully",
    data: result,
  });
});

const deleteFleetUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await FleetUserService.deleteFleetUser(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fleet user deleted successfully",
    data: result,
  });
});

// Additional Controllers
const getFleetUserProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user || !user._id) {
    return sendResponse<null>(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "User not found or invalid user id",
      data: null,
    });
  }
  const result = await FleetUserService.getFleetUserProfile(user._id);

  sendResponse<IFleetUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile retrieved successfully",
    data: result,
  });
});

const updateFleetUserProfile = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;

    const payload = req.body;

    if (!user || !user.userId) {
      return sendResponse<null>(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: "User not found or invalid user id",
        data: null,
      });
    }

    const result = await FleetUserService.updateFleetUserProfile(
      user.userId,
      payload
    );

    sendResponse<IFleetUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User profile updated successfully",
      data: result,
    });
  }
);

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user || !user.userId) {
    return sendResponse<null>(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "User not found or invalid user id",
      data: null,
    });
  }
  const result = await FleetUserService.getMyProfile(user.userId);

  sendResponse<IFleetUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile retrieved successfully",
    data: result,
  });
});

export const FleetUserController = {
  createFleetUser,
  getAllFleetUsers,
  getSingleFleetUser,
  updateFleetUser,
  deleteFleetUser,
  getFleetUserProfile,
  updateFleetUserProfile,
  getMyProfile,
};
