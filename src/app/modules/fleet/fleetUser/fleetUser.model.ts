import { Schema, model } from "mongoose";
import { IFleetUser, IFleetUserModel } from "./fleetUser.interface";
import bcrypt from "bcrypt";
import config from "../../../../config";

const fleetUserSchema = new Schema<IFleetUser, IFleetUserModel>(
  {
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
        validator: function (v: string) {
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
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);

// Password hashing before saving
fleetUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(
    this.password,
    Number(config.bycrypt_salt_rounds)
  );
  next();
});

// Static method to check if user exists
fleetUserSchema.statics.isUserExist = async function (
  email: string
): Promise<IFleetUser | null> {
  return await FleetUser.findOne(
    { email: email },
    { email: 1, password: 1, role: 1, needsPasswordChange: 1 }
  );
};

// Static method to check password match
fleetUserSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

export const FleetUser = model<IFleetUser, IFleetUserModel>(
  "FleetUser",
  fleetUserSchema
);
