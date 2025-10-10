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
exports.FleetUser = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../../../config"));
const fleetUserSchema = new mongoose_1.Schema({
    buisnessName: {
        type: String,
        required: true,
        trim: true,
    },
    state: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    numberOfbuisnessYear: {
        type: String,
        required: true,
    },
    numberOFvehicles: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return parseInt(v) >= 5;
            },
            message: "Number of vehicles must be at least 5",
        },
    },
    moreLocation: {
        type: Boolean,
        required: true,
    },
    centralLocation: {
        type: Boolean,
        required: true,
    },
    fleetProgram: {
        type: String,
        required: true,
        enum: ["Fleet Sales Specialist", "Store", "Website", "Other"],
    },
    preferredLocation: {
        type: Boolean,
        required: true,
    },
    additionalServices: [
        {
            type: String,
            enum: [
                "Coast Fuel Savings",
                "Discount Tire Telematics by Motorq",
                // "Revvo Smart Tire",
                "Roadside Assistance by NSD",
                "Spiffy Mobile Oil Change Service",
            ],
        },
    ],
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    title: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    phoneExtension: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: 0,
    },
    AdditionalComments: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ["fleet_user"],
        default: "fleet_user",
    },
    needsPasswordChange: {
        type: Boolean,
        default: true,
    },
    isAdminApproved: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            delete ret.password;
            return ret;
        },
    },
});
// Password hashing before saving
fleetUserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password"))
            return next();
        this.password = yield bcrypt_1.default.hash(this.password, Number(config_1.default.bycrypt_salt_rounds));
        next();
    });
});
// Static method to check if user exists
fleetUserSchema.statics.isUserExist = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.FleetUser.findOne({ email: email }, { email: 1, password: 1, role: 1, needsPasswordChange: 1 });
    });
};
// Static method to check password match
fleetUserSchema.statics.isPasswordMatched = function (givenPassword, savedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(givenPassword, savedPassword);
    });
};
exports.FleetUser = (0, mongoose_1.model)("FleetUser", fleetUserSchema);
