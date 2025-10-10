import { Request, Response } from "express";
import catchAsync from "../../../../shared/catchAsync";
import { FleetAuthService } from "./fleetAuth.service";
import sendResponse from "../../../../shared/sendResponse";
import {
  IFleetLoginUserResponse,
  IFleetRefreshTokenResponse,
} from "./fleetAuth.interface";

const FleetLoginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await FleetAuthService.loginFleetUser(loginData);
  const { refreshToken, accessToken } = result;
  // set refresh token into cookie
  const cookieOptions = {
    secure: true,
    httpOnly: true,
    sameSite: "none" as "none",
    domain: ".tiresdash.com", // important: main + fleet share cookie
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  };

  // const cookieOptions = {
  //   secure: false,
  //   httpOnly: true,
  //   sameSite: "lax" as "lax",
  //   path: "/",
  // };

  res.cookie("refreshToken", refreshToken, cookieOptions);
  res.cookie("accessToken", accessToken, cookieOptions);

  sendResponse<IFleetLoginUserResponse>(res, {
    statusCode: 200,
    success: true,
    message: "Fleet User logged in successfully !",
    data: result,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await FleetAuthService.refreshToken(refreshToken);

  // set refresh token into cookie
  const cookieOptions = {
    secure: true,
    httpOnly: true,
    sameSite: "none" as "none",
    domain: ".tiresdash.com", // important: main + fleet share cookie
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  };
  // const cookieOptions = {
  //   secure: false,
  //   httpOnly: true,
  //   sameSite: "lax" as "lax",
  //   path: "/",
  // };

  res.cookie("refreshToken", refreshToken, cookieOptions);

  sendResponse<IFleetRefreshTokenResponse>(res, {
    statusCode: 200,
    success: true,
    message: "Fleet User logged in successfully !",
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { ...passwordData } = req.body;

  await FleetAuthService.changePassword(user, passwordData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password changed successfully !",
  });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  await FleetAuthService.forgotPassword(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Check your email!",
  });
});

// const resetPassword = catchAsync(async (req: Request, res: Response) => {
//   const token = req.headers.authorization || "";
//   await FleetAuthService.resetPassword(req.body, token);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Account recovered!",
//   });
// });

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || "";

  await FleetAuthService.resetPassword(
    { newPassword: req.body.newPassword },
    token
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Account recovered!",
  });
});

const FleetLogoutUser = catchAsync(async (req: Request, res: Response) => {
  // Clear cookies
  // const cookieOptions = {
  //   secure: true,
  //   httpOnly: true,
  //   sameSite: "none" as "none",
  //   domain: ".tiresdash.com", // important: main + fleet share cookie
  //   path: "/",
  // };
  const cookieOptions = {
    secure: false,
    httpOnly: true,
    sameSite: "lax" as "lax",
    path: "/",
  };

  res.clearCookie("refreshToken", cookieOptions);
  res.clearCookie("accessToken", cookieOptions);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Fleet User logged out successfully!",
  });
});

export const FleetAuthController = {
  FleetLoginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
  FleetLogoutUser,
};
