import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../../config";
import ApiError from "../../errors/ApiError";
import { jwtHelpers } from "../../helpers/jwtHelper";
import { ENUM_USER_ROLE } from "../../enum/user";

const conditionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // First verify the token

    // console.log(req.cookies.accessToken);
    // return;

    const token = req.headers.authorization || req.cookies.accessToken;
    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
    }

    // Verify token and set req.user
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );
    req.user = verifiedUser;

    if (!req.user || !req.user.role) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "Forbidden: You do not have permission."
      );
    }

    const userRole = req.user.role;

    // Role-based routing
    if (
      [
        ENUM_USER_ROLE.ADMIN,
        ENUM_USER_ROLE.SUPER_ADMIN,
        ENUM_USER_ROLE.USER,
      ].includes(userRole)
    ) {
      next();
    } else if (userRole === ENUM_USER_ROLE.FLEET_USER) {
      next();
    } else {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "Forbidden: You do not have permission."
      );
    }
  } catch (error) {
    next(error);
  }
};

export default conditionalAuth;
