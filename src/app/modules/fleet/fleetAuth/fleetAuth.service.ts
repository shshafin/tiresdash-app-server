import bcrypt from "bcrypt";
import httpStatus from "http-status";
import {
  IFleetChangePassword,
  IFleetLoginUser,
  IFleetLoginUserResponse,
  IFleetRefreshTokenResponse,
} from "./fleetAuth.interface";
import { FleetUser } from "../fleetUser/fleetUser.model";
import ApiError from "../../../../errors/ApiError";
import { jwtHelpers } from "../../../../helpers/jwtHelper";
import config from "../../../../config";
import { JwtPayload, Secret } from "jsonwebtoken";
import { sendEmail } from "../../auth/sendEmail";

const loginFleetUser = async (
  payload: IFleetLoginUser
): Promise<IFleetLoginUserResponse> => {
  const { email, password } = payload;

  const isUserExist = await FleetUser.findOne({ email }).select(
    "+password role needsPasswordChange email _id isAdminApproved"
  );

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Fleet user does not exist");
  }

  if (!isUserExist?.isAdminApproved) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Your account is not approved by admin"
    );
  }

  if (
    isUserExist.password &&
    !(await FleetUser.isPasswordMatched(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "password mismatch");
  }

  const {
    email: userEmail,
    role,
    needsPasswordChange,
    _id: userId,
  } = isUserExist;

  const accessToken = jwtHelpers.createToken(
    { userEmail, role, userId },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  // refresh token
  const refreshToken = jwtHelpers.createToken(
    { userEmail, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange,
  };
};

const refreshToken = async (
  token: string
): Promise<IFleetRefreshTokenResponse> => {
  //verify token
  // invalid token
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(token, config.jwt.secret as Secret);
  } catch (err) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid token");
  }

  // checking deleted user's refresh token
  const { userEmail } = verifiedToken;
  const isUserExist = await FleetUser.isUserExist(userEmail);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
  }

  // generate new token and refresh token

  const newAccessToken = jwtHelpers.createToken(
    {
      email: isUserExist.email,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );
  // return new tokens
  return {
    accessToken: newAccessToken,
  };
};

const changePassword = async (
  user: JwtPayload | null,
  payload: IFleetChangePassword
): Promise<void> => {
  const { oldPassword, newPassword } = payload;

  // // checking is user exist
  // const isUserExist = await User.isUserExist({id: user?.userId});

  //alternative way
  const isUserExist = await FleetUser.findOne({
    email: user?.userEmail,
  }).select("+password");

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
  }

  // check old password matching
  if (
    isUserExist.password &&
    !(await FleetUser.isPasswordMatched(oldPassword, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Old Password is incorrect");
  }

  isUserExist.password = newPassword;
  isUserExist.needsPasswordChange = true;
  // updating using save()
  isUserExist.save();
};

const forgotPassword = async (payload: { email: string }) => {
  // Find user by id with email and name fields
  const user = await FleetUser.findOne(
    { email: payload.email },
    {
      role: 1,
      email: 1,
      firstName: 1,
      lastName: 1,
    }
  ).lean();

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User Not Found!");
  }

  if (!user.email) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User email is not found!");
  }

  // Generate password reset token (expires in 50 minutes)
  const passResetToken = await jwtHelpers.resetToken(
    { email: user.email },
    config.jwt.secret as string,
    "50m"
  );

  // Create reset link
  const resetLink: string = `${config.fleetResetLink}?token=${passResetToken}`;

  // Send email
  await sendEmail(
    user.email,
    `
    <div>
      <p>Hi, ${user.firstName} ${user.lastName}</p>
      <p>Your password reset link: <a href="${resetLink}">Click Here</a></p>
      <p>This link will expire in 50 minutes.</p>
      <p>Thank you</p>
    </div>
    `
  );

  return {
    message: "Password reset link sent to your email",
    resetToken: passResetToken, // Optional: return token for testing
  };
};

// const resetPassword = async (
//   payload: { email: string; newPassword: string },
//   token: string
// ) => {
//   const { email, newPassword } = payload;

//   const user = await FleetUser.findOne({ email: email }, { email: 1 });

//   if (!user) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "User Not Found!");
//   }
//   const isVarified = await jwtHelpers.verifyToken(
//     token,
//     config.jwt.secret as string
//   );

//   const password = await bcrypt.hash(
//     newPassword,
//     Number(config.bycrypt_salt_rounds)
//   );

//   await FleetUser.updateOne({ email: email }, { password });
// };

const resetPassword = async (
  payload: { newPassword: string },
  token: string
) => {
  const { newPassword } = payload;

  if (!token) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Reset token is missing!");
  }

  // Token verify & decode
  let decoded: any;
  try {
    decoded = await jwtHelpers.verifyToken(token, config.jwt.secret as string);
  } catch (err) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid or expired token!");
  }

  const email = decoded.email;

  // Find user by email
  const user = await FleetUser.findOne({ email }, { email: 1 });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.bycrypt_salt_rounds)
  );

  // Update password
  await FleetUser.updateOne({ email }, { password: hashedPassword });
};

export const FleetAuthService = {
  loginFleetUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
