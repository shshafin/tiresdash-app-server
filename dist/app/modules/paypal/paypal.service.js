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
exports.PayPalService = void 0;
const axios_1 = __importDefault(require("axios"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const getPayPalAccessToken = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const auth = Buffer.from(`${config_1.default.paypal.client_id}:${config_1.default.paypal.secret}`).toString("base64");
        const { data } = yield axios_1.default.post(`${config_1.default.paypal.base_url}/v1/oauth2/token`, "grant_type=client_credentials", {
            headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        return data.access_token;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Failed to get PayPal access token");
    }
});
const verifyPayPalPayment = (paymentId) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = yield getPayPalAccessToken();
    try {
        const { data } = yield axios_1.default.get(`${config_1.default.paypal.base_url}/v2/checkout/orders/${paymentId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return data.status === "COMPLETED";
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Payment verification failed");
    }
});
exports.PayPalService = {
    verifyPayPalPayment,
};
