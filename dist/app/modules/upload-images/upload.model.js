"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadMedia = void 0;
const mongoose_1 = require("mongoose");
const MediaSchema = new mongoose_1.Schema({
    filename: { type: String, required: true },
    url: { type: String, required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
exports.UploadMedia = (0, mongoose_1.model)("Media", MediaSchema);
