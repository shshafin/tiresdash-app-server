import { Schema, model } from "mongoose";
import { IWishlist, IWishlistModel } from "./wishlist.interface";

const wishlistSchema = new Schema<IWishlist, IWishlistModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    userType: {
      type: String,
      enum: ["user", "fleet_user"],
      required: true,
    },
    items: [
      {
        product: { type: Schema.Types.ObjectId, required: true },
        productType: {
          type: String,
          enum: ["tire", "wheel", "product"],
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export const Wishlist = model<IWishlist, IWishlistModel>(
  "Wishlist",
  wishlistSchema
);
