import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { AuthService } from "./auth.service";
import config from "../../../config";
import sendResponse from "../../../shared/sendResponse";
import { ILoginUserResponse, IRefreshTokenResponse } from "./auth.interface";

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await AuthService.loginUser(loginData);
  const { refreshToken, accessToken, user } = result;

  // set refresh token into cookie
  const cookieOptions = {
    secure: false,
    httpOnly: true,
    sameSite: "none" as "none",
    domain: ".tiresdash.com",
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

  sendResponse<ILoginUserResponse>(res, {
    statusCode: 200,
    success: true,
    message: "User logged in successfully !",
    data: result,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await AuthService.refreshToken(refreshToken);

  // set refresh token into cookie
  const cookieOptions = {
    secure: false,
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

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: 200,
    success: true,
    message: "User logged in successfully !",
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { ...passwordData } = req.body;

  await AuthService.changePassword(user, passwordData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password changed successfully !",
  });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  await AuthService.forgotPassword(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Check your email!",
  });
});

// const resetPassword = catchAsync(async (req: Request, res: Response) => {
//   const token = req.headers.authorization || "";

//   const userEmail = req.user?.userEmail;

//   const { newPassword } = req.body;
//   await AuthService.resetPassword(userEmail, newPassword, token);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Account recovered!",
//   });
// });

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || "";

  await AuthService.resetPassword({ newPassword: req.body.newPassword }, token);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Account recovered!",
  });
});
export const AuthController = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
