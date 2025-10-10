"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const user_model_1 = require("../users/user.model");
const jwtHelper_1 = require("../../../helpers/jwtHelper");
const config_1 = __importDefault(require("../../../config"));
const sendEmail_1 = require("./sendEmail");
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    // If user does not exist or password is incorrect
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "user does not exist");
    }
    // Check if user exists and password is correct
    if (isUserExist.password &&
        !(yield user_model_1.User.isPasswordMatched(password, isUserExist.password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Password is incorrect");
    }
    // If user exists and password is correct, return the user object with the token and refresh token
    const { email: userEmail, role, needsPasswordChange, _id: userId, } = isUserExist;
    // TODO: generate token and refresh token here
    const accessToken = jwtHelper_1.jwtHelpers.createToken({ userEmail, role, userId }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    // refresh token
    const refreshToken = jwtHelper_1.jwtHelpers.createToken({ userEmail, role, userId }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    const _a = isUserExist.toObject(), { password: userPassword } = _a, res = __rest(_a, ["password"]);
    return {
        accessToken,
        refreshToken,
        user: res,
        needsPasswordChange,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    //verify token
    // invalid token
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelper_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid token");
    }
    // checking deleted user's refresh token
    const { userEmail } = verifiedToken;
    const isUserExist = yield user_model_1.User.isUserExist(userEmail);
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User does not exist");
    }
    // generate new token and refresh token
    const newAccessToken = jwtHelper_1.jwtHelpers.createToken({
        email: isUserExist.email,
        role: isUserExist.role,
    }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    // return new tokens
    return {
        accessToken: newAccessToken,
    };
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = payload;
    // // checking is user exist
    // const isUserExist = await User.isUserExist({id: user?.userId});
    //alternative way
    const isUserExist = yield user_model_1.User.findOne({ email: user === null || user === void 0 ? void 0 : user.userEmail }).select("+password");
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User does not exist");
    }
    // check old password matching
    if (isUserExist.password &&
        !(yield user_model_1.User.isPasswordMatched(oldPassword, isUserExist.password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Old Password is incorrect");
    }
    isUserExist.password = newPassword;
    isUserExist.needsPasswordChange = true;
    // updating using save()
    isUserExist.save();
});
const forgotPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Find user by id with email and name fields
    const email = payload.email;
    const result = yield user_model_1.User.aggregate([
        {
            $match: { email },
        },
        {
            $project: {
                role: 1,
                email: 1,
                firstName: 1,
                lastName: 1,
            },
        },
        {
            $unionWith: {
                coll: "fleetusers",
                pipeline: [
                    { $match: { email } },
                    {
                        $project: {
                            role: 1,
                            email: 1,
                            firstName: 1,
                            lastName: 1,
                        },
                    },
                ],
            },
        },
    ]);
    const user = result[0] || null;
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User Not Found!");
    }
    if (!user.email) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User email is not found!");
    }
    // Generate password reset token (expires in 50 minutes)
    const passResetToken = yield jwtHelper_1.jwtHelpers.resetToken({ email: user.email }, config_1.default.jwt.secret, "50m");
    // Create reset link
    const resetLink = `${config_1.default.resetlink}?token=${passResetToken}`;
    // Send email
    yield (0, sendEmail_1.sendEmail)(user.email, `
    <div>
      <p>Hi, ${user.firstName} ${user.lastName}</p>
      <p>Your password reset link: <a href="${resetLink}">Click Here</a></p>
      <p>This link will expire in 50 minutes.</p>
      <p>Thank you</p>
    </div>
    `);
    return {
        message: "Password reset link sent to your email",
        resetToken: passResetToken, // Optional: return token for testing
    };
});
// const resetPassword = async (
//   userEmail: string | undefined,
//   newPassword: string,
//   token: string
// ) => {
//   const user = await User.findOne({ email: userEmail }, { email: 1 });
//   if (!user) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "User Not Found!");
//   }
//   const isVarified = await jwtHelpers.verifyToken(
//     token,
//     config.jwt.secret as string
//   );
//   if (!isVarified) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "Invalid or Expired Token!");
//   }
//   const password = await bcrypt.hash(
//     newPassword,
//     Number(config.bycrypt_salt_rounds)
//   );
//   await User.updateOne({ email: userEmail }, { password });
// };
const resetPassword = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    const { newPassword } = payload;
    if (!token) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Reset token is missing!");
    }
    // Token verify & decode
    let decoded;
    try {
        decoded = yield jwtHelper_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid or expired token!");
    }
    const email = decoded.email;
    // Find user by email
    const user = yield user_model_1.User.findOne({ email }, { email: 1 });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User not found!");
    }
    // Hash new password
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bycrypt_salt_rounds));
    // Update password
    yield user_model_1.User.updateOne({ email }, { password: hashedPassword });
});
exports.AuthService = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword,
};
