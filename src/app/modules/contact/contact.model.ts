import { Schema, model } from "mongoose";
import { IContact, IContactModel } from "./contact.interface";

const ContactSchema = new Schema<IContact, IContactModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    contactInfo: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

ContactSchema.index({ name: 1, contactInfo: 1 });

export const Contact = model<IContact, IContactModel>("Contact", ContactSchema);
