import { Model } from "mongoose";

export interface IFleetUser {
  buisnessName: string;
  state: string;
  city: string;
  numberOfbuisnessYear: string;
  numberOFvehicles: string; // minimum 5
  moreLocation: boolean;
  centralLocation: boolean;
  fleetProgram: "Fleet Sales Specialist" | "Store" | "Website" | "Other";
  preferredLocation: boolean;
  additionalServices:
    | "Coast Fuel Savings"
    | "Discount Tire Telematics by Motorq"
    // | "Revvo Smart Tire"
    | "Roadside Assistance by NSD"
    | "Spiffy Mobile Oil Change Service";
  firstName: string;
  lastName: string;
  title: string;
  phone: string;
  phoneExtension: string;
  email: string;
  password: string;
  AdditionalComments: string;
  isVerified: boolean;
  role: string;
  needsPasswordChange: boolean;
  isAdminApproved: boolean;
}

// export type IFleetUserModel = Model<IFleetUser, Record<string, unknown>>;

export interface IFleetUserModel extends Model<IFleetUser> {
  isUserExist(
    email: string
  ): Promise<Pick<
    IFleetUser,
    "email" | "password" | "role" | "needsPasswordChange"
  > | null>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
}

export interface IFleetUserFilters {
  searchTerm?: string;
  buisnessName?: string;
  state?: string;
  city?: string;
  fleetProgram?: "Fleet Sales Specialist" | "Store" | "Website" | "Other";
  additionalServices?:
    | "Coast Fuel Savings"
    | "Discount Tire Telematics by Motorq"
    | "Revvo Smart Tire"
    | "Roadside Assistance by NSD"
    | "Spiffy Mobile Oil Change Service";
}
