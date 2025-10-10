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
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const jwtHelper_1 = require("../../helpers/jwtHelper");
const user_1 = require("../../enum/user");
const conditionalAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // First verify the token
        // console.log(req.cookies.accessToken);
        // return;
        const token = req.headers.authorization || req.cookies.accessToken;
        if (!token) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized");
        }
        // Verify token and set req.user
        const verifiedUser = jwtHelper_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
        req.user = verifiedUser;
        if (!req.user || !req.user.role) {
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Forbidden: You do not have permission.");
        }
        const userRole = req.user.role;
        // Role-based routing
        if ([
            user_1.ENUM_USER_ROLE.ADMIN,
            user_1.ENUM_USER_ROLE.SUPER_ADMIN,
            user_1.ENUM_USER_ROLE.USER,
        ].includes(userRole)) {
            next();
        }
        else if (userRole === user_1.ENUM_USER_ROLE.FLEET_USER) {
            next();
        }
        else {
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Forbidden: You do not have permission.");
        }
    }
    catch (error) {
        next(error);
    }
});
exports.default = conditionalAuth;
