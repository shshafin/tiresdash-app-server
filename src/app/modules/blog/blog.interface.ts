import { Model, Types } from "mongoose";

export interface IBlog {
  title: string;
  description: string;
  image: string;
  category?: string;
}

export type IBlogModel = Model<IBlog, Record<string, unknown>>;

export interface IBlogFilter {
  searchTerm?: string;
  title?: string;
  description?: string;
  category?: string;
}
