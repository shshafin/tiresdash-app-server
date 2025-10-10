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
exports.WishlistService = void 0;
const wishlist_model_1 = require("./wishlist.model");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const createWishlist = (userId, userType) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield wishlist_model_1.Wishlist.findOne({ user: userId, userType });
    if (isExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Wishlist already exists for this user");
    }
    const result = yield wishlist_model_1.Wishlist.create({ user: userId, userType, items: [] });
    return result;
});
const getWishlistByUserId = (userId, userType) => __awaiter(void 0, void 0, void 0, function* () {
    // First fetch the wishlist
    const wishlist = yield wishlist_model_1.Wishlist.findOne({ user: userId, userType })
        .lean()
        .exec();
    if (!wishlist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Wishlist not found");
    }
    // Populate user based on userType
    let populatedUser = null;
    try {
        if (userType === "user") {
            populatedUser = yield mongoose_1.default.model("User").findById(userId);
        }
        else {
            populatedUser = yield mongoose_1.default.model("FleetUser").findById(userId);
        }
    }
    catch (error) {
        console.error(`Error populating user ${userId}:`, error);
    }
    // Manually populate each product based on its type
    const populatedItems = yield Promise.all(wishlist.items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        let populatedProduct = item.product;
        try {
            switch (item.productType) {
                case "tire":
                    populatedProduct = yield mongoose_1.default
                        .model("Tire")
                        .findById(item.product);
                    break;
                case "wheel":
                    populatedProduct = yield mongoose_1.default
                        .model("Wheel")
                        .findById(item.product);
                    break;
                case "product":
                    populatedProduct = yield mongoose_1.default
                        .model("Product")
                        .findById(item.product);
                    break;
            }
        }
        catch (error) {
            console.error(`Error populating product ${item.product}:`, error);
        }
        return Object.assign(Object.assign({}, item), { product: populatedProduct &&
                typeof populatedProduct.toObject === "function"
                ? populatedProduct.toObject()
                : item.product });
    })));
    return Object.assign(Object.assign({}, wishlist), { user: populatedUser || userId, items: populatedItems });
});
const addItemToWishlist = (userId, userType, item) => __awaiter(void 0, void 0, void 0, function* () {
    let wishlist = yield wishlist_model_1.Wishlist.findOne({ user: userId, userType });
    if (!wishlist) {
        wishlist = yield wishlist_model_1.Wishlist.create({
            user: userId,
            userType,
            items: [],
        });
    }
    if (!["tire", "wheel", "product"].includes(item.productType)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Invalid product type");
    }
    const itemExists = wishlist.items.some((wishlistItem) => wishlistItem.product.toString() === item.product.toString());
    if (itemExists) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Item already exists in wishlist");
    }
    wishlist.items.push(item);
    yield wishlist.save();
    return wishlist;
});
const removeItemFromWishlist = (userId, userType, productId) => __awaiter(void 0, void 0, void 0, function* () {
    const wishlist = yield wishlist_model_1.Wishlist.findOne({ user: userId, userType });
    if (!wishlist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Wishlist not found");
    }
    wishlist.items = wishlist.items.filter((item) => item.product.toString() !== productId);
    yield wishlist.save();
    return wishlist;
});
const clearWishlist = (userId, userType) => __awaiter(void 0, void 0, void 0, function* () {
    const wishlist = yield wishlist_model_1.Wishlist.findOneAndUpdate({ user: userId, userType }, { items: [] }, { new: true });
    if (!wishlist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Wishlist not found");
    }
    return wishlist;
});
exports.WishlistService = {
    createWishlist,
    getWishlistByUserId,
    addItemToWishlist,
    removeItemFromWishlist,
    clearWishlist,
};
