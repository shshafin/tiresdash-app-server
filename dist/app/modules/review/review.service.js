"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.ReviewService = void 0;
const review_model_1 = require("./review.model");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const mongoose_1 = __importStar(require("mongoose"));
const review_constants_1 = require("./review.constants");
const getUserPreviewFields = "firstName lastName email avatar";
const createReview = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check for existing review
    const existingReview = yield review_model_1.Review.findOne({
        user: payload.user,
        userType: payload.userType,
        product: payload.product,
        productType: payload.productType,
    });
    if (existingReview) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "You have already reviewed this product");
    }
    return review_model_1.Review.create(payload);
});
const getAllReviews = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: review_constants_1.reviewSearchableFields.map((field) => ({
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
    const [result, total] = yield Promise.all([
        review_model_1.Review.find(whereConditions)
            .sort(sortConditions)
            .skip(skip)
            .limit(limit)
            .lean(),
        review_model_1.Review.countDocuments(whereConditions),
    ]);
    // Manually populate users based on userType
    const populatedResults = yield Promise.all(result.map((review) => __awaiter(void 0, void 0, void 0, function* () {
        let populatedUser = null;
        try {
            if (review.userType === "user") {
                populatedUser = yield mongoose_1.default
                    .model("User")
                    .findById(review.user)
                    .select(getUserPreviewFields)
                    .lean();
            }
            else {
                populatedUser = yield mongoose_1.default
                    .model("FleetUser")
                    .findById(review.user)
                    .select(getUserPreviewFields)
                    .lean();
            }
        }
        catch (error) {
            console.error(`Error populating user ${review.user}:`, error);
        }
        return Object.assign(Object.assign({}, review), { user: populatedUser || review.user });
    })));
    return {
        meta: { page, limit, total },
        data: populatedResults,
    };
});
const getSingleReview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield review_model_1.Review.findById(id)
        .orFail(() => new ApiError_1.default(http_status_1.default.NOT_FOUND, "Review not found"))
        .lean();
    // Manually populate user based on userType
    let populatedUser = null;
    try {
        if (review.userType === "user") {
            populatedUser = yield mongoose_1.default
                .model("User")
                .findById(review.user)
                .select(getUserPreviewFields)
                .lean();
        }
        else {
            populatedUser = yield mongoose_1.default
                .model("FleetUser")
                .findById(review.user)
                .select(getUserPreviewFields)
                .lean();
        }
    }
    catch (error) {
        console.error(`Error populating user ${review.user}:`, error);
    }
    return Object.assign(Object.assign({}, review), { user: populatedUser || review.user });
});
const updateReview = (id, payload, userId, userType) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield review_model_1.Review.findOne({ _id: id, userType }).orFail(() => new ApiError_1.default(http_status_1.default.NOT_FOUND, "Review not found"));
    if (review.user.toString() !== userId) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "You can only update your own reviews");
    }
    const updatedReview = yield review_model_1.Review.findByIdAndUpdate(id, payload, {
        new: true,
    }).lean();
    // Manually populate user based on userType
    let populatedUser = null;
    if (!updatedReview) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Review not found after update");
    }
    try {
        if (updatedReview.userType === "user") {
            populatedUser = yield mongoose_1.default
                .model("User")
                .findById(updatedReview.user)
                .select(getUserPreviewFields)
                .lean();
        }
        else {
            populatedUser = yield mongoose_1.default
                .model("FleetUser")
                .findById(updatedReview.user)
                .select(getUserPreviewFields)
                .lean();
        }
    }
    catch (error) {
        console.error(`Error populating user ${updatedReview.user}:`, error);
    }
    return Object.assign(Object.assign({}, updatedReview), { user: populatedUser || updatedReview.user });
});
const deleteReview = (id, userId, userType) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield review_model_1.Review.findOne({ _id: id, userType }).orFail(() => new ApiError_1.default(http_status_1.default.NOT_FOUND, "Review not found"));
    if (review.user.toString() !== userId) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "You can only delete your own reviews");
    }
    const deletedReview = yield review_model_1.Review.findByIdAndDelete(id).lean();
    // Manually populate user based on userType
    let populatedUser = null;
    if (!deletedReview) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Review not found after delete");
    }
    try {
        if (deletedReview.userType === "user") {
            populatedUser = yield mongoose_1.default
                .model("User")
                .findById(deletedReview.user)
                .select(getUserPreviewFields)
                .lean();
        }
        else {
            populatedUser = yield mongoose_1.default
                .model("FleetUser")
                .findById(deletedReview.user)
                .select(getUserPreviewFields)
                .lean();
        }
    }
    catch (error) {
        console.error(`Error populating user ${deletedReview.user}:`, error);
    }
    return Object.assign(Object.assign({}, deletedReview), { user: populatedUser || deletedReview.user });
});
const getReviewsByProduct = (productId, productType) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield review_model_1.Review.find({ product: productId, productType })
        .sort({ createdAt: -1 })
        .lean();
    // Manually populate users based on userType
    const populatedReviews = yield Promise.all(reviews.map((review) => __awaiter(void 0, void 0, void 0, function* () {
        let populatedUser = null;
        try {
            if (review.userType === "user") {
                populatedUser = yield mongoose_1.default
                    .model("User")
                    .findById(review.user)
                    .select(getUserPreviewFields)
                    .lean();
            }
            else {
                populatedUser = yield mongoose_1.default
                    .model("FleetUser")
                    .findById(review.user)
                    .select(getUserPreviewFields)
                    .lean();
            }
        }
        catch (error) {
            console.error(`Error populating user ${review.user}:`, error);
        }
        return Object.assign(Object.assign({}, review), { user: populatedUser || review.user });
    })));
    return populatedReviews;
});
const getReviewStats = (productId, productType) => __awaiter(void 0, void 0, void 0, function* () {
    const [stats] = yield review_model_1.Review.aggregate([
        {
            $match: {
                product: new mongoose_1.Types.ObjectId(productId),
                productType,
            },
        },
        {
            $group: {
                _id: null,
                averageRating: { $avg: "$rating" },
                reviewCount: { $sum: 1 },
                ratingDistribution: {
                    $push: "$rating",
                },
            },
        },
        {
            $project: {
                _id: 0,
                averageRating: { $round: ["$averageRating", 1] },
                reviewCount: 1,
                ratingDistribution: {
                    1: {
                        $size: {
                            $filter: {
                                input: "$ratingDistribution",
                                as: "rating",
                                cond: { $eq: ["$$rating", 1] },
                            },
                        },
                    },
                    2: {
                        $size: {
                            $filter: {
                                input: "$ratingDistribution",
                                as: "rating",
                                cond: { $eq: ["$$rating", 2] },
                            },
                        },
                    },
                    3: {
                        $size: {
                            $filter: {
                                input: "$ratingDistribution",
                                as: "rating",
                                cond: { $eq: ["$$rating", 3] },
                            },
                        },
                    },
                    4: {
                        $size: {
                            $filter: {
                                input: "$ratingDistribution",
                                as: "rating",
                                cond: { $eq: ["$$rating", 4] },
                            },
                        },
                    },
                    5: {
                        $size: {
                            $filter: {
                                input: "$ratingDistribution",
                                as: "rating",
                                cond: { $eq: ["$$rating", 5] },
                            },
                        },
                    },
                },
            },
        },
    ]);
    return (stats || {
        averageRating: 0,
        reviewCount: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    });
});
const getProductWithReviews = (productId, productType) => __awaiter(void 0, void 0, void 0, function* () {
    const modelName = productType.charAt(0).toUpperCase() + productType.slice(1);
    const productModel = mongoose_1.default.model(modelName);
    const [productDoc, reviews, stats] = yield Promise.all([
        productModel.findById(productId).lean(),
        getReviewsByProduct(productId, productType),
        getReviewStats(productId, productType),
    ]);
    if (!productDoc) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Product not found");
    }
    return {
        product: productDoc,
        reviews,
        stats,
    };
});
const getReviewsByUser = (userId, userType) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield review_model_1.Review.find({ user: userId, userType })
        .sort({ createdAt: -1 })
        .lean();
    // Manually populate users based on userType
    const populatedReviews = yield Promise.all(reviews.map((review) => __awaiter(void 0, void 0, void 0, function* () {
        let populatedUser = null;
        try {
            if (review.userType === "user") {
                populatedUser = yield mongoose_1.default
                    .model("User")
                    .findById(review.user)
                    .select(getUserPreviewFields)
                    .lean();
            }
            else {
                populatedUser = yield mongoose_1.default
                    .model("FleetUser")
                    .findById(review.user)
                    .select(getUserPreviewFields)
                    .lean();
            }
        }
        catch (error) {
            console.error(`Error populating user ${review.user}:`, error);
        }
        return Object.assign(Object.assign({}, review), { user: populatedUser || review.user });
    })));
    return populatedReviews;
});
exports.ReviewService = {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview,
    getReviewsByProduct,
    getReviewStats,
    getProductWithReviews,
    getReviewsByUser,
};
