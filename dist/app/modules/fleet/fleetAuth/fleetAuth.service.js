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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FleetAuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const fleetUser_model_1 = require("../fleetUser/fleetUser.model");
const ApiError_1 = __importDefault(require("../../../../errors/ApiError"));
const jwtHelper_1 = require("../../../../helpers/jwtHelper");
const config_1 = __importDefault(require("../../../../config"));
const sendEmail_1 = require("../../auth/sendEmail");
const loginFleetUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const isUserExist = yield fleetUser_model_1.FleetUser.findOne({ email }).select("+password role needsPasswordChange email _id isAdminApproved");
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Fleet user does not exist");
    }
    if (!(isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.isAdminApproved)) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Your account is not approved by admin");
    }
    if (isUserExist.password &&
        !(yield fleetUser_model_1.FleetUser.isPasswordMatched(password, isUserExist.password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "password mismatch");
    }
    const { email: userEmail, role, needsPasswordChange, _id: userId, } = isUserExist;
    const accessToken = jwtHelper_1.jwtHelpers.createToken({ userEmail, role, userId }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    // refresh token
    const refreshToken = jwtHelper_1.jwtHelpers.createToken({ userEmail, role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken,
        refreshToken,
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
    const isUserExist = yield fleetUser_model_1.FleetUser.isUserExist(userEmail);
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
    const isUserExist = yield fleetUser_model_1.FleetUser.findOne({
        email: user === null || user === void 0 ? void 0 : user.userEmail,
    }).select("+password");
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User does not exist");
    }
    // check old password matching
    if (isUserExist.password &&
        !(yield fleetUser_model_1.FleetUser.isPasswordMatched(oldPassword, isUserExist.password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Old Password is incorrect");
    }
    isUserExist.password = newPassword;
    isUserExist.needsPasswordChange = true;
    // updating using save()
    isUserExist.save();
});
const forgotPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Find user by id with email and name fields
    const user = yield fleetUser_model_1.FleetUser.findOne({ email: payload.email }, {
        role: 1,
        email: 1,
        firstName: 1,
        lastName: 1,
    }).lean();
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User Not Found!");
    }
    if (!user.email) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User email is not found!");
    }
    // Generate password reset token (expires in 50 minutes)
    const passResetToken = yield jwtHelper_1.jwtHelpers.resetToken({ email: user.email }, config_1.default.jwt.secret, "50m");
    // Create reset link
    const resetLink = `${config_1.default.fleetResetLink}?token=${passResetToken}`;
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
    const user = yield fleetUser_model_1.FleetUser.findOne({ email }, { email: 1 });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User not found!");
    }
    // Hash new password
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bycrypt_salt_rounds));
    // Update password
    yield fleetUser_model_1.FleetUser.updateOne({ email }, { password: hashedPassword });
});
exports.FleetAuthService = {
    loginFleetUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword,
};
