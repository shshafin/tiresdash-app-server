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
exports.OrderService = void 0;
const order_model_1 = require("./order.model");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const payment_model_1 = require("../payment/payment.model");
const cart_model_1 = require("../cart/cart.model");
const mongoose_1 = require("mongoose");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const order_constants_1 = require("./order.constants");
const tire_model_1 = require("../tire/tire.model");
const wheel_model_1 = require("../wheel/wheel.model");
const product_model_1 = require("../product/product.model");
const createOrderFromPayment = (paymentId) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.Payment.findById(paymentId).populate("cart");
    if (!payment) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Payment not found");
    }
    if (payment.paymentStatus !== "completed") {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Payment not completed");
    }
    const cart = yield cart_model_1.Cart.findById(payment.cart);
    if (!cart) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Cart not found");
    }
    // Create the order
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
        status: "processing",
        shippingAddress: payment.shippingAddress,
        billingAddress: payment.billingAddress,
    });
    return order;
});
const getAllOrders = (filters, paginationOptions, userRole, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    // Search term conditions
    if (searchTerm) {
        andConditions.push({
            $or: order_constants_1.orderFilterableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: "i",
                },
            })),
        });
    }
    // Filters data conditions
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    // For customers, only show their own orders
    if (userRole === "user" && userId) {
        andConditions.push({ user: userId });
    }
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield order_model_1.Order.find(whereConditions)
        .populate("user")
        .populate("payment")
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield order_model_1.Order.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getUserOrders = (userId, filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    // Add user condition to only get orders for the specific user
    andConditions.push({ user: userId });
    // Search term conditions
    if (searchTerm) {
        andConditions.push({
            $or: order_constants_1.orderFilterableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: "i",
                },
            })),
        });
    }
    // Filters data conditions
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield order_model_1.Order.find(whereConditions)
        .populate("user")
        .populate("payment")
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield order_model_1.Order.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getOrderById = (orderId, userId, userRole) => __awaiter(void 0, void 0, void 0, function* () {
    let order;
    if (userRole === "admin") {
        order = yield order_model_1.Order.findById(orderId).populate("user").populate("payment");
    }
    else {
        order = yield order_model_1.Order.findOne({
            _id: orderId,
            user: userId,
        })
            .populate("user")
            .populate("payment");
    }
    if (!order) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Order not found");
    }
    // Convert to plain object to avoid Mongoose document methods
    const orderPlainObject = order.toObject();
    const populatedItems = yield Promise.all(orderPlainObject.items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        let productDetails; // Replace `any` with a specific type if available for product details
        switch (item.productType) {
            case "tire":
                productDetails = yield tire_model_1.Tire.findById(item.product).lean();
                break;
            case "wheel":
                productDetails = yield wheel_model_1.Wheel.findById(item.product).lean();
                break;
            case "product":
                productDetails = yield product_model_1.Product.findById(item.product).lean();
                break;
        }
        return Object.assign(Object.assign({}, item), { productDetails });
    })));
    // Create a new object that matches IOrder interface
    const result = Object.assign(Object.assign({}, orderPlainObject), { items: populatedItems, 
        // Explicitly include all required IOrder properties
        user: orderPlainObject.user, payment: orderPlainObject.payment, totalPrice: orderPlainObject.totalPrice, totalItems: orderPlainObject.totalItems, status: orderPlainObject.status, shippingAddress: orderPlainObject.shippingAddress, billingAddress: orderPlainObject.billingAddress, createdAt: orderPlainObject.createdAt, updatedAt: orderPlainObject.updatedAt });
    return result;
});
const updateOrderStatus = (orderId, status, trackingNumber, estimatedDelivery) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.Order.findById(orderId);
    if (!order) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Order not found");
    }
    const updateData = { status };
    if (trackingNumber) {
        updateData.trackingNumber = trackingNumber;
    }
    if (estimatedDelivery) {
        updateData.estimatedDelivery = estimatedDelivery;
    }
    const updatedOrder = yield order_model_1.Order.findByIdAndUpdate(orderId, updateData, {
        new: true,
    })
        .populate("user")
        .populate("payment");
    if (!updatedOrder) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Order not found");
    }
    return updatedOrder;
});
const cancelOrder = (orderId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.Order.findOne({
        _id: orderId,
        user: userId,
    });
    if (!order) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Order not found");
    }
    // Only allow cancellation if order hasn't been shipped yet
    if (["shipped", "delivered"].includes(order.status)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Cannot cancel order that has already been shipped");
    }
    const updatedOrder = yield order_model_1.Order.findByIdAndUpdate(orderId, { status: "cancelled" }, { new: true })
        .populate("user")
        .populate("payment");
    if (!updatedOrder) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Order not found");
    }
    // Here you would typically initiate a refund if payment was made
    // and restock the products
    return updatedOrder;
});
const getUserTotalOrderAmount = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.Order.aggregate([
        {
            $match: {
                user: new mongoose_1.Types.ObjectId(userId),
                status: { $nin: ["cancelled", "refunded"] },
            },
        },
        {
            $group: {
                _id: null,
                totalOrderAmount: { $sum: "$totalPrice" },
                totalOrders: { $sum: 1 },
            },
        },
    ]);
    if (result.length === 0) {
        return {
            totalOrderAmount: 0,
            totalOrders: 0,
        };
    }
    return {
        totalOrderAmount: result[0].totalOrderAmount,
        totalOrders: result[0].totalOrders,
    };
});
const deleteOrder = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.Order.findByIdAndDelete(id);
    return result;
});
exports.OrderService = {
    createOrderFromPayment,
    getAllOrders,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder,
    getUserTotalOrderAmount,
    deleteOrder,
};
