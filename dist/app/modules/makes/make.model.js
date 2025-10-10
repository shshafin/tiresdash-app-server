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
exports.Make = void 0;
// src/models/make.model.ts
const mongoose_1 = require("mongoose");
const MakeSchema = new mongoose_1.Schema({
    make: {
        type: String,
        required: true,
        trim: true,
    },
    // year: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Year",
    //   required: true,
    // },
    logo: {
        type: String,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
// Indexes
// MakeSchema.index({ name: 1, year: 1 }, { unique: true });
// Static method
MakeSchema.statics.isMakeExist = function (make) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield this.findOne({ make });
    });
};
exports.Make = (0, mongoose_1.model)("Make", MakeSchema);
