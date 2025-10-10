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
exports.PaymentService = exports.getPaymentById = exports.verifyPaypalPayment = void 0;
const payment_model_1 = require("./payment.model");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = require("mongoose");
const cart_model_1 = require("../cart/cart.model");
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../../../config"));
const tire_model_1 = require("../tire/tire.model");
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(config_1.default.stripe.secret_key || "", {
    apiVersion: "2025-04-30.basil",
});
const wheel_model_1 = require("../wheel/wheel.model");
const product_model_1 = require("../product/product.model");
const order_service_1 = require("../order/order.service");
const order_model_1 = require("../order/order.model");
const cart_service_1 = require("../cart/cart.service");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const user_model_1 = require("../users/user.model");
const sendOrderConfirmationEmail_1 = require("../../../shared/sendOrderConfirmationEmail");
const createPaymentIntent = (userId, cartId, paymentMethod, addressData) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch cart data
    const cart = yield cart_model_1.Cart.findOne({
        _id: cartId,
        user: userId,
        userType: { $in: ["user", "fleet_user"] },
    });
    if (!cart) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Cart not found");
    }
    if (cart.items.length === 0) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Cart is empty");
    }
    // Dynamically populate each product based on productType
    const populatedItems = yield Promise.all(cart.items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        let populatedProduct;
        switch (item.productType) {
            case "tire":
                populatedProduct = yield tire_model_1.Tire.findById(item.product);
                break;
            case "wheel":
                populatedProduct = yield wheel_model_1.Wheel.findById(item.product);
                break;
            case "product":
                populatedProduct = yield product_model_1.Product.findById(item.product);
                break;
            default:
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Invalid product type");
        }
        if (!populatedProduct) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Product not found");
        }
        return Object.assign(Object.assign({}, item), { product: populatedProduct });
    })));
    // Do not assign populatedItems to cart.items to avoid type errors
    // Create payment record
    const payment = yield payment_model_1.Payment.create({
        user: userId,
        cart: cartId,
        userType: cart.userType,
        amount: cart.totalPrice,
        paymentMethod,
        paymentStatus: "pending",
        billingAddress: addressData.billingAddress,
        shippingAddress: addressData.shippingAddress,
    });
    try {
        if (paymentMethod === "stripe") {
            return yield createStripePayment(payment, cart);
        }
        else {
            return yield createPaypalPayment(payment, cart);
        }
    }
    catch (error) {
        yield payment_model_1.Payment.findByIdAndUpdate(payment._id, { paymentStatus: "failed" });
        throw error;
    }
});
const createStripePayment = (payment, cart) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const populatedItems = yield Promise.all(cart.items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            let productDetails = null;
            if (item.productType === "tire") {
                productDetails = yield tire_model_1.Tire.findById(item.product);
            }
            else if (item.productType === "wheel") {
                productDetails = yield wheel_model_1.Wheel.findById(item.product);
            }
            else if (item.productType === "product") {
                productDetails = yield product_model_1.Product.findById(item.product);
            }
            if (!productDetails) {
                throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Product not found");
            }
            return {
                product: productDetails,
                productType: item.productType,
                quantity: item.quantity,
                price: item.price,
                name: item.name,
                thumbnail: item.thumbnail,
            };
        })));
        const session = yield stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: populatedItems.map((item) => ({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.product.name,
                    },
                    unit_amount: Math.round(item.product.price * 100),
                },
                quantity: item.quantity,
            })),
            mode: "payment",
            success_url: `${config_1.default.frontend_url}/payment/success?paymentId=${payment._id}`,
            cancel_url: `${config_1.default.frontend_url}/payment/cancel?paymentId=${payment._id}`,
            metadata: {
                paymentId: payment._id.toString(),
                userId: payment.user.toString(),
                cartId: payment.cart.toString(),
            },
        });
        yield payment_model_1.Payment.findByIdAndUpdate(payment._id, {
            transactionId: session.id,
            paymentDetails: {
                sessionId: session.id,
                url: session.url,
            },
        });
        return {
            paymentId: payment._id,
            sessionId: session.id,
            url: session.url,
        };
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, `Stripe payment error: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
});
const createPaypalPayment = (payment, cart) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // Create PayPal order
        const paypalOrder = {
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: payment.amount.toFixed(2),
                    },
                    description: `Order for cart ${payment.cart}`,
                },
            ],
            application_context: {
                brand_name: "Tiredash",
                return_url: `${config_1.default.frontend_url}/payment/success?paymentId=${payment._id}`,
                cancel_url: `${config_1.default.frontend_url}/payment/cancel?paymentId=${payment._id}`,
            },
        };
        const response = yield axios_1.default.post(`${config_1.default.paypal.base_url}/v2/checkout/orders`, paypalOrder, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${yield getPaypalAccessToken()}`,
            },
        });
        // Update payment with PayPal details
        yield payment_model_1.Payment.findByIdAndUpdate(payment._id, {
            transactionId: response.data.id,
            paymentDetails: {
                orderId: response.data.id,
                links: response.data.links,
            },
        });
        return {
            paymentId: payment._id,
            orderId: response.data.id,
            links: response.data.links,
            amount: payment.amount,
        };
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, `PayPal payment error: ${axios_1.default.isAxiosError(error) ? ((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || error.message : error instanceof Error ? error.message : "Unknown error"}`);
    }
});
const getPaypalAccessToken = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log("Using client:", config_1.default.paypal.client_id);
        const response = yield axios_1.default.post(`${config_1.default.paypal.base_url}/v1/oauth2/token`, "grant_type=client_credentials", {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            auth: {
                username: config_1.default.paypal.client_id || "",
                password: config_1.default.paypal.secret || "",
            },
        });
        return response.data.access_token;
    }
    catch (error) {
        console.error("PayPal Token Error:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to get PayPal access token");
    }
});
const verifyStripePayment = (paymentId, sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Retrieve the checkout session using the session ID
        const session = yield stripe.checkout.sessions.retrieve(sessionId);
        // The Payment Intent ID is part of the session object
        const paymentIntentId = session.payment_intent;
        if (!paymentIntentId) {
            throw new Error("Payment Intent ID not found in the session.");
        }
        // Now you can use the paymentIntentId to verify the payment
        const paymentIntent = yield stripe.paymentIntents.retrieve(typeof paymentIntentId === "string" ? paymentIntentId : paymentIntentId.id);
        if (paymentIntent.status === "succeeded") {
            // Payment was successful
            // Fetch the payment record from the database
            const payment = yield payment_model_1.Payment.findById(paymentId);
            if (!payment) {
                throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Payment not found");
            }
            // Fetch the cart from the database
            const cart = yield cart_model_1.Cart.findOne({
                _id: payment.cart,
                user: payment.user,
                userType: payment.userType,
            });
            if (!cart) {
                throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Cart not found");
            }
            // Remove the items from the cart
            for (const item of cart.items) {
                yield cart_service_1.CartService.removeItemFromCart(payment.user.toString(), payment.userType, item.product.toString(), item.productType);
            }
            // Create an order based on the payment and cart data
            const order = yield order_model_1.Order.create({
                user: payment.user,
                payment: payment._id,
                items: cart.items.map((item) => ({
                    product: item.product,
                    productType: item.productType,
                    quantity: item.quantity,
                    price: item.price,
                    name: item.name,
                    thumbnail: item.thumbnail,
                })),
                totalPrice: cart.totalPrice,
                totalItems: cart.totalItems,
                shippingAddress: payment.shippingAddress,
                billingAddress: payment.billingAddress,
                status: "pending",
            });
            // Update payment status to 'completed' and attach order details
            yield payment_model_1.Payment.findByIdAndUpdate(paymentId, {
                paymentStatus: "completed",
                paymentDetails: paymentIntent,
            });
            // Fetch user details for email
            const user = yield user_model_1.User.findById(payment.user);
            if (!user) {
                throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
            }
            try {
                yield (0, sendOrderConfirmationEmail_1.sendOrderConfirmationEmail)(user.email, order, paymentIntent);
            }
            catch (emailError) {
                console.error("Failed to send confirmation email:", emailError);
            }
            return { success: true, paymentIntent, order };
        }
        else {
            // Payment failed
            console.log("Payment failed:", paymentIntent);
            // Update payment status in your database
            yield payment_model_1.Payment.findByIdAndUpdate(paymentId, {
                paymentStatus: "failed",
                paymentDetails: paymentIntent,
            });
            return { success: false, paymentIntent };
        }
    }
    catch (error) {
        console.error("Stripe payment verification failed:", error);
        throw new Error("Payment verification failed");
    }
});
const verifyPaypalPayment = (paymentId, orderId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch the payment from the database
        const payment = yield payment_model_1.Payment.findById(paymentId);
        if (!payment) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Payment not found");
        }
        if (payment.paymentStatus !== "pending") {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Payment already processed");
        }
        // Get PayPal access token and verify payment
        const accessToken = yield getPaypalAccessToken();
        const response = yield axios_1.default.get(`${config_1.default.paypal.base_url}/v2/checkout/orders/${orderId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
        // If payment is successful
        if (response.data.status === "COMPLETED") {
            // Update payment status to 'completed'
            yield payment_model_1.Payment.findByIdAndUpdate(paymentId, {
                paymentStatus: "completed",
                paymentDetails: response.data,
            });
            // Fetch the cart from the database
            const cart = yield cart_model_1.Cart.findById(payment.cart);
            if (!cart) {
                throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Cart not found");
            }
            // Remove the items from the cart
            for (const item of cart.items) {
                yield cart_service_1.CartService.removeItemFromCart(payment.user.toString(), null, item.product.toString(), item.productType);
            }
            // Create an order based on the payment and cart data
            const order = yield order_model_1.Order.create({
                user: payment.user,
                payment: payment._id,
                items: cart.items.map((item) => ({
                    product: item.product,
                    productType: item.productType,
                    quantity: item.quantity,
                    price: item.price,
                    name: item.name,
                    thumbnail: item.thumbnail,
                })),
                totalPrice: cart.totalPrice,
                totalItems: cart.totalItems,
                shippingAddress: payment.shippingAddress,
                billingAddress: payment.billingAddress,
                status: "pending", // Update as necessary
            });
            const user = yield user_model_1.User.findById(payment.user);
            if (!user) {
                throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
            }
            try {
                yield (0, sendOrderConfirmationEmail_1.sendOrderConfirmationEmail)(user.email, order, payment);
            }
            catch (emailError) {
                console.error("Failed to send confirmation email:", emailError);
            }
            return { success: true, payment, order };
        }
        else {
            // Payment failed
            yield payment_model_1.Payment.findByIdAndUpdate(paymentId, {
                paymentStatus: "failed",
                paymentDetails: response.data,
            });
            return { success: false, payment };
        }
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, `Payment verification failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
});
exports.verifyPaypalPayment = verifyPaypalPayment;
const handleSuccessfulPayment = (payment) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Update product stock quantities
    const cart = yield cart_model_1.Cart.findById(payment.cart);
    if (cart) {
        for (const item of cart.items) {
            yield updateProductStock(item.product, item.productType, item.quantity);
        }
        // 2. Create an order
        yield order_service_1.OrderService.createOrderFromPayment(payment._id);
        // 3. Clear the cart
        yield cart_model_1.Cart.findByIdAndUpdate(payment.cart, {
            items: [],
            totalPrice: 0,
            totalItems: 0,
        });
    }
});
const updateProductStock = (productId, productType, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    let model;
    switch (productType) {
        case "tire":
            model = tire_model_1.Tire;
            break;
        case "wheel":
            model = wheel_model_1.Wheel;
            break;
        case "product":
            model = product_model_1.Product;
            break;
        default:
            throw new Error("Invalid product type");
    }
    if (model === tire_model_1.Tire || model === wheel_model_1.Wheel || model === product_model_1.Product) {
        if (model === tire_model_1.Tire) {
            yield tire_model_1.Tire.findByIdAndUpdate(productId, {
                $inc: { stockQuantity: -quantity },
            });
        }
        else if (model === wheel_model_1.Wheel) {
            yield wheel_model_1.Wheel.findByIdAndUpdate(productId, {
                $inc: { stockQuantity: -quantity },
            });
        }
        else if (model === product_model_1.Product) {
            yield product_model_1.Product.findByIdAndUpdate(productId, {
                $inc: { stockQuantity: -quantity },
            });
        }
        else {
            throw new Error("Invalid model type");
        }
    }
    else {
        throw new Error("Invalid model type");
    }
});
const getPaymentById = (paymentId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.Payment.findOne({
        _id: paymentId,
        user: userId,
    }).populate("cart");
    if (!payment) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Payment not found");
    }
    return payment;
});
exports.getPaymentById = getPaymentById;
// Define searchable fields for payments
const paymentSearchableFields = [
    "paymentMethod",
    "paymentStatus",
    "transactionId",
];
// For Admin: Fetching All Payments with Filters
const getAllPayments = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    // Handle searchTerm (search across multiple fields)
    if (searchTerm) {
        andConditions.push({
            $or: paymentSearchableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: "i",
                },
            })),
        });
    }
    // Apply specific filters
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => {
                // Handle ObjectId fields like user and cart
                if (["user", "cart"].includes(field)) {
                    return { [field]: new mongoose_1.Types.ObjectId(String(value)) };
                }
                // Handle numeric fields like amount
                if (field === "amount") {
                    return { [field]: Number(value) };
                }
                return { [field]: value };
            }),
        });
    }
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    // Fetch payments with the filter, populate, and pagination
    const result = yield payment_model_1.Payment.find(whereConditions)
        .populate("user")
        .populate("cart")
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield payment_model_1.Payment.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
// For User: Fetching Payment History
const userPaymentHistory = (userId, filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    // Handle searchTerm (search across multiple fields)
    if (searchTerm) {
        andConditions.push({
            $or: paymentSearchableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: "i",
                },
            })),
        });
    }
    // Apply specific filters
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => {
                // Handle ObjectId fields like user and cart
                if (["cart"].includes(field)) {
                    return { [field]: new mongoose_1.Types.ObjectId(String(value)) };
                }
                // Handle numeric fields like amount
                if (field === "amount") {
                    return { [field]: Number(value) };
                }
                return { [field]: value };
            }),
        });
    }
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereConditions = Object.assign({ user: userId }, (andConditions.length > 0 ? { $and: andConditions } : {}));
    // Fetch payments for the specific user with the filter, populate, and pagination
    const result = yield payment_model_1.Payment.find(whereConditions)
        .populate("user")
        .populate("cart")
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield payment_model_1.Payment.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
exports.PaymentService = {
    createPaymentIntent,
    verifyStripePayment,
    verifyPaypalPayment: exports.verifyPaypalPayment,
    getPaymentById: exports.getPaymentById,
    getAllPayments,
    userPaymentHistory,
};
