import { Model, Types } from "mongoose";

export interface IMake {
  data?: any;
  make: string;
  logo?: string;
}

export type IMakeModel = Model<IMake, Record<string, unknown>>;
export type IMakeFilters = {
  searchTerm?: string;
};
