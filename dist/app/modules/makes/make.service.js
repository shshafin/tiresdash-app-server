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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeService = void 0;
const make_model_1 = require("./make.model");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const createMake = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield make_model_1.Make.create(payload);
    return result;
});
const getSingleMake = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield make_model_1.Make.findById(id);
    return result;
});
const getAllMakes = (paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    // Dynamic  Sort needs  field to  do sorting
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const result = yield make_model_1.Make.find().sort(sortConditions).skip(skip).limit(limit);
    const total = yield make_model_1.Make.countDocuments();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const updateMake = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield make_model_1.Make.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
const deleteMake = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield make_model_1.Make.findByIdAndDelete(id);
    return result;
});
exports.MakeService = {
    createMake,
    getSingleMake,
    getAllMakes,
    updateMake,
    deleteMake,
};
