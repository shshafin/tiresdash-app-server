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
exports.Year = void 0;
// src/models/year.model.ts
const mongoose_1 = require("mongoose");
const YearSchema = new mongoose_1.Schema({
    year: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
// Static method
YearSchema.statics.isYearExist = function (year) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield this.findOne({ year: year });
    });
};
exports.Year = (0, mongoose_1.model)("Year", YearSchema);
