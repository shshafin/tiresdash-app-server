import { Schema, model } from "mongoose";
import { IFleetSupport, IFleetSupportModel } from "./support.interface";

const fleetSupportSchema = new Schema<IFleetSupport, IFleetSupportModel>(
  {
    issueType: {
      type: String,
      required: true,
      enum: [
        "Billing Question",
        "Service Issue",
        "Account Access",
        "Technical Problem",
        "Appointment Scheduling",
        "Fleet Management",
        "Other",
      ],
    },
    priority: {
      type: String,
      required: true,
      enum: [
        "Low-General inquiry",
        "Medium-Service needed",
        "High-Urgent issue",
        "Critical-Emergency",
      ],
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    report: {
      type: String,
      required: false,
    },
    files: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "FleetUser",
      required: false, // Optional, can be set later
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const FleetSupport = model<IFleetSupport, IFleetSupportModel>(
  "FleetSupport",
  fleetSupportSchema
);
