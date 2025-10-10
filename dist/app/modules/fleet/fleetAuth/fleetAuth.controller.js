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
exports.FleetAuthController = exports.resetPassword = void 0;
const catchAsync_1 = __importDefault(require("../../../../shared/catchAsync"));
const fleetAuth_service_1 = require("./fleetAuth.service");
const sendResponse_1 = __importDefault(require("../../../../shared/sendResponse"));
const FleetLoginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginData = __rest(req.body, []);
    const result = yield fleetAuth_service_1.FleetAuthService.loginFleetUser(loginData);
    const { refreshToken, accessToken } = result;
    // set refresh token into cookie
    const cookieOptions = {
        secure: true,
        httpOnly: true,
        sameSite: "none",
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
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Fleet User logged in successfully !",
        data: result,
    });
}));
const refreshToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    const result = yield fleetAuth_service_1.FleetAuthService.refreshToken(refreshToken);
    // set refresh token into cookie
    const cookieOptions = {
        secure: true,
        httpOnly: true,
        sameSite: "none",
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
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Fleet User logged in successfully !",
        data: result,
    });
}));
const changePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const passwordData = __rest(req.body, []);
    yield fleetAuth_service_1.FleetAuthService.changePassword(user, passwordData);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Password changed successfully !",
    });
}));
const forgotPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield fleetAuth_service_1.FleetAuthService.forgotPassword(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Check your email!",
    });
}));
// const resetPassword = catchAsync(async (req: Request, res: Response) => {
//   const token = req.headers.authorization || "";
//   await FleetAuthService.resetPassword(req.body, token);
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Account recovered!",
//   });
// });
exports.resetPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization || "";
    yield fleetAuth_service_1.FleetAuthService.resetPassword({ newPassword: req.body.newPassword }, token);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Account recovered!",
    });
}));
const FleetLogoutUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        sameSite: "lax",
        path: "/",
    };
    res.clearCookie("refreshToken", cookieOptions);
    res.clearCookie("accessToken", cookieOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Fleet User logged out successfully!",
    });
}));
exports.FleetAuthController = {
    FleetLoginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword: exports.resetPassword,
    FleetLogoutUser,
};
