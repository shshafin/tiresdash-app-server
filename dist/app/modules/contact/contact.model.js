"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contact = void 0;
const mongoose_1 = require("mongoose");
const ContactSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    contactInfo: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
ContactSchema.index({ name: 1, contactInfo: 1 });
exports.Contact = (0, mongoose_1.model)("Contact", ContactSchema);
