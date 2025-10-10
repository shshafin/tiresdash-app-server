"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentGateway = void 0;
const stripe_1 = __importDefault(require("stripe"));
// Stripe Client
const stripeClient = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-08-27.basil",
});
exports.paymentGateway = {
    stripe: stripeClient,
};
