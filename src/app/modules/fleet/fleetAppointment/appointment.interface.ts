import { Model, Types } from "mongoose";

export interface IFleetAppointment {
  fleetUser: string | Types.ObjectId;
  fleetVehicle: string | Types.ObjectId;
  serviceType:
    | "Tire Replacement"
    | "Flat Repair"
    | "Balance"
    | "Rotation"
    | "Other";

  date: string;
  time: string;
  address: string;
  notes: string;
  files: string[];
  status?: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  assignedTo?: string | Types.ObjectId; // User ID of the technician assigned
  estimatedDuration?: number; // in minutes
  costEstimate?: number; // estimated cost of the appointment
  fleetRef?: {
    phone: string;
    email: string;
    note: string;
  };
}

export type IFleetAppointmentModel = Model<
  IFleetAppointment,
  Record<string, unknown>
>;
