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
exports.CartService = void 0;
const cart_model_1 = require("./cart.model");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const tire_model_1 = require("../tire/tire.model");
const wheel_model_1 = require("../wheel/wheel.model");
const product_model_1 = require("../product/product.model");
const mongoose_1 = require("mongoose");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const cart_constants_1 = require("./cart.constants");
const mongoose_2 = __importDefault(require("mongoose"));
const getProductDetails = (productId, productType, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let product;
    switch (productType) {
        case "tire":
            product = yield tire_model_1.Tire.findById(productId);
            break;
        case "wheel":
            product = yield wheel_model_1.Wheel.findById(productId);
            break;
        case "product":
            product = yield product_model_1.Product.findById(productId);
            break;
        default:
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Invalid product type");
    }
    if (!product) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Product not found");
    }
    // Check stock availability
    if (product.stockQuantity < quantity) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Only ${product.stockQuantity} items available in stock`);
    }
    return {
        name: product.name,
        price: product.discountPrice || product.price,
        thumbnail: ((_a = product.images) === null || _a === void 0 ? void 0 : _a[0]) || "",
        stock: product.stockQuantity,
    };
});
const createCart = (userId, userType) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // find and create atomically using upsert
        const cart = yield cart_model_1.Cart.findOneAndUpdate({ user: userId, userType }, // query
        {
            $setOnInsert: {
                // only insert if not exists
                items: [],
                totalPrice: 0,
                totalItems: 0,
            },
        }, { new: true, upsert: true } // upsert: create if not exists
        );
        return cart;
    }
    catch (error) {
        // handle duplicate key edge-case
        if (error.code === 11000) {
            // someone else created the cart at the same time
            return (yield cart_model_1.Cart.findOne({ user: userId, userType }));
        }
        throw error;
    }
});
const addItemToCart = (userId_1, userType_1, productId_1, productType_1, ...args_1) => __awaiter(void 0, [userId_1, userType_1, productId_1, productType_1, ...args_1], void 0, function* (userId, userType, productId, productType, quantity = 1) {
    // Validate input
    if (!mongoose_1.Types.ObjectId.isValid(productId)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Invalid product ID");
    }
    if (quantity < 1) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Quantity must be at least 1");
    }
    // Get product details with stock check
    const { name, price, thumbnail } = yield getProductDetails(productId, productType, quantity);
    // Find or create cart atomically
    let cart = yield cart_model_1.Cart.findOneAndUpdate({ user: userId, userType }, { $setOnInsert: { items: [], totalPrice: 0, totalItems: 0 } }, { new: true, upsert: true });
    // Check if product already exists in cart
    const existingItemIndex = cart.items.findIndex((item) => item.product.toString() === productId && item.productType === productType);
    if (existingItemIndex !== -1) {
        // Update quantity if product exists
        cart.items[existingItemIndex].quantity += quantity;
    }
    else {
        // Add new item if product doesn't exist
        cart.items.push({
            product: new mongoose_1.Types.ObjectId(productId),
            productType,
            quantity,
            price,
            name,
            thumbnail,
        });
    }
    // Recalculate totals
    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    yield cart.save();
    return cart;
});
const removeItemFromCart = (userId, userType, productId, productType) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = yield cart_model_1.Cart.findOne({ user: userId, userType });
    if (!cart) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Cart not found");
    }
    const initialItemCount = cart.items.length;
    cart.items = cart.items.filter((item) => item.product.toString() !== productId || item.productType !== productType);
    if (cart.items.length === initialItemCount) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Item not found in cart");
    }
    yield cart.save();
    return cart;
});
const updateItemQuantity = (userId, userType, productId, productType, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate input
    if (quantity < 1) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Quantity must be at least 1");
    }
    const cart = yield cart_model_1.Cart.findOne({ user: userId, userType });
    if (!cart) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Cart not found");
    }
    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId && item.productType === productType);
    if (itemIndex === -1) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Item not found in cart");
    }
    // Check stock availability before updating quantity
    const { stock } = yield getProductDetails(productId, productType, quantity);
    if (stock < quantity) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Only ${stock} items available in stock`);
    }
    cart.items[itemIndex].quantity = quantity;
    yield cart.save();
    return cart;
});
const getCartByUserId = (userId, userType) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = yield cart_model_1.Cart.findOne({ user: userId, userType });
    if (!cart) {
        return yield cart_model_1.Cart.create({
            user: new mongoose_1.Types.ObjectId(userId),
            userType,
            items: [],
            totalPrice: 0,
            totalItems: 0,
        });
    }
    // Populate product details and check availability
    const populatedItems = yield Promise.all(cart.items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { stock } = yield getProductDetails(item.product.toString(), item.productType, item.quantity);
            let productDetails;
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
            return {
                product: item.product,
                productType: item.productType,
                quantity: item.quantity,
                price: item.price,
                name: item.name,
                thumbnail: item.thumbnail,
                productDetails,
                availableStock: stock,
                isAvailable: stock >= item.quantity,
            };
        }
        catch (error) {
            // If product is not found, mark it as unavailable
            return {
                product: item.product,
                productType: item.productType,
                quantity: item.quantity,
                price: item.price,
                name: item.name,
                thumbnail: item.thumbnail,
                productDetails: null,
                availableStock: 0,
                isAvailable: false,
            };
        }
    })));
    // Create a new object with the cart properties and populated items
    const result = {
        _id: cart._id,
        user: cart.user,
        userType: cart.userType,
        items: populatedItems,
        totalPrice: cart.totalPrice,
        totalItems: cart.totalItems,
    };
    return result;
});
const clearCart = (userId, userType) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = yield cart_model_1.Cart.findOneAndUpdate({ user: userId, userType }, { items: [], totalPrice: 0, totalItems: 0 }, { new: true });
    if (!cart) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Cart not found");
    }
    return cart;
});
const getAllCarts = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: cart_constants_1.cartFilterableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: "i",
                },
            })),
        });
    }
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
    const result = yield cart_model_1.Cart.find(whereConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    // Manually populate users based on userType
    const populatedResults = yield Promise.all(result.map((cart) => __awaiter(void 0, void 0, void 0, function* () {
        let populatedUser = null;
        try {
            if (cart.userType === "user") {
                populatedUser = yield mongoose_2.default
                    .model("User")
                    .findById(cart.user)
                    .select("firstName lastName email")
                    .lean();
            }
            else {
                populatedUser = yield mongoose_2.default
                    .model("FleetUser")
                    .findById(cart.user)
                    .select("firstName lastName email")
                    .lean();
            }
        }
        catch (error) {
            console.error(`Error populating user ${cart.user}:`, error);
        }
        return Object.assign(Object.assign({}, cart.toObject()), { user: populatedUser || cart.user });
    })));
    const total = yield cart_model_1.Cart.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: populatedResults,
    };
});
exports.CartService = {
    createCart,
    getCartByUserId,
    addItemToCart,
    removeItemFromCart,
    updateItemQuantity,
    getAllCarts,
    clearCart,
};
