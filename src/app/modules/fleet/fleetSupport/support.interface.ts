import { Model, Types } from "mongoose";

export interface IFleetSupport {
  issueType:
    | "Billing Question"
    | "Service Issue"
    | "Account Access"
    | "Technical Problem"
    | "Appointment Scheduling"
    | "Fleet Management"
    | "Other";

  priority:
    | "Low-General inquiry"
    | "Medium-Service needed"
    | "High-Urgent issue"
    | "Critical-Emergency";
  subject: string;
  message: string;
  report?: string;
  files: string[];
  status?: "Open" | "In Progress" | "Resolved" | "Closed";
  user?: Types.ObjectId;
}

export type IFleetSupportModel = Model<IFleetSupport, Record<string, unknown>>;
