import { IWishlist, WishlistItem } from "./wishlist.interface";
import { Wishlist } from "./wishlist.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import mongoose from "mongoose";
import { Types } from "mongoose";

const createWishlist = async (
  userId: string,
  userType: "user" | "fleet_user"
): Promise<IWishlist> => {
  const isExist = await Wishlist.findOne({ user: userId, userType });
  if (isExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Wishlist already exists for this user"
    );
  }
  const result = await Wishlist.create({ user: userId, userType, items: [] });
  return result;
};

const getWishlistByUserId = async (
  userId: string,
  userType: "user" | "fleet_user"
): Promise<IWishlist | null> => {
  // First fetch the wishlist
  const wishlist = await Wishlist.findOne({ user: userId, userType })
    .lean()
    .exec();

  if (!wishlist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Wishlist not found");
  }

  // Populate user based on userType
  let populatedUser: any = null;
  try {
    if (userType === "user") {
      populatedUser = await mongoose.model("User").findById(userId);
    } else {
      populatedUser = await mongoose.model("FleetUser").findById(userId);
    }
  } catch (error) {
    console.error(`Error populating user ${userId}:`, error);
  }

  // Manually populate each product based on its type
  const populatedItems = await Promise.all(
    wishlist.items.map(async (item) => {
      let populatedProduct: Types.ObjectId | Document | null = item.product;

      try {
        switch (item.productType) {
          case "tire":
            populatedProduct = await mongoose
              .model("Tire")
              .findById(item.product);
            break;
          case "wheel":
            populatedProduct = await mongoose
              .model("Wheel")
              .findById(item.product);
            break;
          case "product":
            populatedProduct = await mongoose
              .model("Product")
              .findById(item.product);
            break;
        }
      } catch (error) {
        console.error(`Error populating product ${item.product}:`, error);
      }

      return {
        ...item,
        product:
          populatedProduct &&
          typeof (populatedProduct as any).toObject === "function"
            ? (populatedProduct as any).toObject()
            : item.product,
      };
    })
  );

  return {
    ...wishlist,
    user: populatedUser || userId,
    items: populatedItems,
  } as unknown as IWishlist;
};

const addItemToWishlist = async (
  userId: string,
  userType: "user" | "fleet_user",
  item: WishlistItem
): Promise<IWishlist | null> => {
  let wishlist = await Wishlist.findOne({ user: userId, userType });
  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: userId,
      userType,
      items: [],
    });
  }

  if (!["tire", "wheel", "product"].includes(item.productType)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid product type");
  }

  const itemExists = wishlist.items.some(
    (wishlistItem) =>
      wishlistItem.product.toString() === item.product.toString()
  );

  if (itemExists) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Item already exists in wishlist"
    );
  }

  wishlist.items.push(item);
  await wishlist.save();
  return wishlist;
};

const removeItemFromWishlist = async (
  userId: string,
  userType: "user" | "fleet_user",
  productId: string
): Promise<IWishlist | null> => {
  const wishlist = await Wishlist.findOne({ user: userId, userType });
  if (!wishlist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Wishlist not found");
  }

  wishlist.items = wishlist.items.filter(
    (item) => item.product.toString() !== productId
  );
  await wishlist.save();
  return wishlist;
};

const clearWishlist = async (
  userId: string,
  userType: "user" | "fleet_user"
): Promise<IWishlist | null> => {
  const wishlist = await Wishlist.findOneAndUpdate(
    { user: userId, userType },
    { items: [] },
    { new: true }
  );
  if (!wishlist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Wishlist not found");
  }
  return wishlist;
};

export const WishlistService = {
  createWishlist,
  getWishlistByUserId,
  addItemToWishlist,
  removeItemFromWishlist,
  clearWishlist,
};
