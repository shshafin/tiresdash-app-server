import { Schema, Types, model } from "mongoose";
import { IBlog, IBlogModel } from "./blog.interface";

const BlogSchema = new Schema<IBlog, IBlogModel>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Blog = model<IBlog, IBlogModel>("Blog", BlogSchema);
