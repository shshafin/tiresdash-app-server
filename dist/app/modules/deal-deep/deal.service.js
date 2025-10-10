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
exports.DealService = void 0;
const deal_model_1 = require("./deal.model");
const tire_model_1 = require("../tire/tire.model");
const wheel_model_1 = require("../wheel/wheel.model");
const product_model_1 = require("../product/product.model");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = require("mongoose");
// ADMIN SERVICES
const createDeal = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!payload.applyTo.tires &&
        !payload.applyTo.wheels &&
        !payload.applyTo.products) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Deal must apply to at least one product type");
    }
    return deal_model_1.DealDeep.create(payload);
});
const updateDeal = (dealId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const existingDeal = yield deal_model_1.DealDeep.findById(dealId);
    if (!existingDeal) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Deal not found");
    }
    return deal_model_1.DealDeep.findByIdAndUpdate(dealId, updateData, { new: true });
});
const deleteDeal = (dealId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield deal_model_1.DealDeep.findByIdAndDelete(dealId);
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Deal not found");
    }
});
const getDealById = (dealId) => __awaiter(void 0, void 0, void 0, function* () {
    const deal = yield deal_model_1.DealDeep.findById(dealId).populate("brand", "name logo");
    if (!deal) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Deal not found");
    }
    return deal;
});
const getAllDeals = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    return deal_model_1.DealDeep.find(filters)
        .populate("brand", "name logo")
        .sort({ createdAt: -1 });
});
// CUSTOMER SERVICES
const getActiveDeals = (brandId) => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    const query = {
        startDate: { $lte: now },
        endDate: { $gte: now },
        isActive: true,
    };
    if (brandId)
        query.brand = new mongoose_1.Types.ObjectId(brandId);
    return deal_model_1.DealDeep.find(query).populate("brand", "name logo");
});
const getDiscountedItems = (brandId, collection) => __awaiter(void 0, void 0, void 0, function* () {
    const Model = collection === "tires" ? tire_model_1.Tire : collection === "wheels" ? wheel_model_1.Wheel : product_model_1.Product;
    const [items, deals] = yield Promise.all([
        Model.find({ brand: brandId }),
        getActiveDeals(brandId),
    ]);
    const relevantDeals = deals.filter((deal) => deal.applyTo[collection]);
    return items.map((item) => {
        let finalPrice = item.price;
        const appliedDeals = [];
        for (const deal of relevantDeals) {
            const discountAmount = deal.discountType === "percentage"
                ? Math.min(item.price * (deal.discountValue / 100), deal.maxDiscount || Infinity)
                : deal.discountValue;
            finalPrice -= discountAmount;
            appliedDeals.push({
                dealId: deal._id,
                title: deal.title,
                discountValue: deal.discountValue,
                discountType: deal.discountType === "fixed" ? "flat" : deal.discountType,
            });
        }
        return Object.assign(Object.assign({}, item.toObject()), { originalPrice: item.price, finalPrice: Math.max(finalPrice, 0), appliedDeals });
    });
});
exports.DealService = {
    createDeal,
    updateDeal,
    deleteDeal,
    getDealById,
    getAllDeals,
    getActiveDeals,
    getDiscountedItems,
};
