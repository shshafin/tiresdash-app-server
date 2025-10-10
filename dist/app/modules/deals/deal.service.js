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
exports.DealService = void 0;
const product_model_1 = require("../product/product.model");
const deal_model_1 = require("./deal.model");
const tire_model_1 = require("../tire/tire.model");
const wheel_model_1 = require("../wheel/wheel.model");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = require("mongoose");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const deals_constant_1 = require("./deals.constant");
// Create a new deal
const createDeal = (dealData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield deal_model_1.Deal.create(dealData);
    return result;
});
// Get deals for a specific brand
const getDealsForBrand = (brandId) => __awaiter(void 0, void 0, void 0, function* () {
    const currentDate = new Date();
    const deals = yield deal_model_1.Deal.find({
        brand: brandId,
        validFrom: { $lte: currentDate },
        validTo: { $gte: currentDate },
    });
    return deals;
});
// Get discounted tires by brand
const getDiscountedTiresByBrand = (brandId) => __awaiter(void 0, void 0, void 0, function* () {
    const deals = yield getDealsForBrand(brandId);
    // Filter deals based on applicable products (tire)
    const tireDeals = deals.filter((deal) => deal.applicableProducts.includes("tire"));
    const tires = yield tire_model_1.Tire.find({
        brand: brandId,
    });
    // Apply discounts to each tire based on the deals
    tireDeals.forEach((deal) => {
        tires.forEach((tire) => {
            const discountAmount = (tire.price * deal.discountPercentage) / 100;
            tire.discountPrice = tire.price - discountAmount;
            tire.save();
        });
    });
    return tires;
});
// Get discounted wheels by brand
const getDiscountedWheelsByBrand = (brandId) => __awaiter(void 0, void 0, void 0, function* () {
    const deals = yield getDealsForBrand(brandId);
    // Filter deals based on applicable products (wheel)
    const wheelDeals = deals.filter((deal) => deal.applicableProducts.includes("wheel"));
    const wheels = yield wheel_model_1.Wheel.find({
        brand: brandId,
    });
    // Apply discounts to each wheel based on the deals
    wheelDeals.forEach((deal) => {
        wheels.forEach((wheel) => {
            const discountAmount = (wheel.price * deal.discountPercentage) / 100;
            wheel.discountPrice = wheel.price - discountAmount;
            wheel.save();
        });
    });
    return wheels;
});
// Get discounted products by brand (simple products)
const getDiscountedProductsByBrand = (brandId) => __awaiter(void 0, void 0, void 0, function* () {
    const deals = yield getDealsForBrand(brandId);
    // Filter deals based on applicable products (product)
    const productDeals = deals.filter((deal) => deal.applicableProducts.includes("product"));
    const products = yield product_model_1.Product.find({
        brand: brandId,
    });
    // Apply discounts to each product based on the deals
    productDeals.forEach((deal) => {
        products.forEach((product) => {
            const discountAmount = (product.price * deal.discountPercentage) / 100;
            product.discountPrice = product.price - discountAmount;
            product.save();
        });
    });
    return products;
});
// Apply discount to a tire
const applyDiscountToTire = (tireId) => __awaiter(void 0, void 0, void 0, function* () {
    const tire = yield tire_model_1.Tire.findById(tireId);
    if (!tire) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Tire not found");
    }
    const applicableDeals = yield getDealsForBrand(tire.brand.toString());
    applicableDeals.forEach((deal) => {
        const discountAmount = (tire.price * deal.discountPercentage) / 100;
        const discountedPrice = tire.price - discountAmount;
        tire.discountPrice = discountedPrice;
    });
    yield tire.save();
    return tire;
});
// Apply discount to a wheel
const applyDiscountToWheel = (wheelId) => __awaiter(void 0, void 0, void 0, function* () {
    const wheel = yield wheel_model_1.Wheel.findById(wheelId);
    if (!wheel) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Wheel not found");
    }
    const applicableDeals = yield getDealsForBrand(wheel.brand.toString());
    applicableDeals.forEach((deal) => {
        const discountAmount = (wheel.price * deal.discountPercentage) / 100;
        const discountedPrice = wheel.price - discountAmount;
        wheel.discountPrice = discountedPrice;
    });
    yield wheel.save();
    return wheel;
});
// Apply discount to a simple product
const applyDiscountToProduct = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.Product.findById(productId);
    if (!product) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Product not found");
    }
    if (!product.brand) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Product brand is undefined");
    }
    const applicableDeals = yield getDealsForBrand(product.brand.toString());
    applicableDeals.forEach((deal) => {
        const discountAmount = (product.price * deal.discountPercentage) / 100;
        const discountedPrice = product.price - discountAmount;
        product.discountPrice = discountedPrice;
    });
    yield product.save();
    return product;
});
const getSingleDeal = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield deal_model_1.Deal.findById(id).populate("brand");
    return result;
});
const getAllDeals = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: deals_constant_1.dealSearchableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: "i",
                },
            })),
        });
    }
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => {
                // Handle ObjectId fields
                if (field === "brand") {
                    return { [field]: new mongoose_1.Types.ObjectId(String(value)) };
                }
                // Handle numeric fields
                if (field === "discountPercentage") {
                    return { [field]: Number(value) };
                }
                // Handle date fields
                if (field === "validFrom" || field === "validTo") {
                    return { [field]: new Date(String(value)) };
                }
                // Handle array fields
                if (field === "applicableProducts") {
                    return { [field]: { $in: [value] } };
                }
                // Handle other fields
                return { [field]: value };
            }),
        });
    }
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield deal_model_1.Deal.find(whereConditions)
        .populate("brand")
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield deal_model_1.Deal.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const updateDeal = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield deal_model_1.Deal.findById(id);
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Deal not found");
    }
    const result = yield deal_model_1.Deal.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    }).populate("brand");
    return result;
});
const deleteDeal = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield deal_model_1.Deal.findByIdAndDelete(id);
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Deal not found");
    }
    return result;
});
exports.DealService = {
    createDeal,
    getDealsForBrand,
    getDiscountedTiresByBrand,
    getDiscountedWheelsByBrand,
    getDiscountedProductsByBrand,
    applyDiscountToTire,
    applyDiscountToWheel,
    applyDiscountToProduct,
    getSingleDeal,
    getAllDeals,
    updateDeal,
    deleteDeal,
};
