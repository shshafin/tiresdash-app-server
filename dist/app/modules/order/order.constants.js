"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderSearchableFields = exports.orderFilterableFields = void 0;
exports.orderFilterableFields = [
    "searchTerm",
    "status",
    "user",
    "createdAt",
];
exports.orderSearchableFields = [
    "trackingNumber",
    "items.name",
    "shippingAddress.city",
    "shippingAddress.country",
];
