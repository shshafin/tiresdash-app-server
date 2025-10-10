import { Model } from "mongoose";

export interface IContact {
  name: string;
  address?: string;
  contactInfo?: string;
  description?: string;
}

export type IContactModel = Model<IContact, Record<string, unknown>>;

export interface IContactFilter {
  searchTerm?: string;
  name?: string;
  contactInfo?: string;
  description?: string;
}
