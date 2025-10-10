import { FleetUser } from "./fleetUser.model";
import { SortOrder } from "mongoose";
import { IFleetUser, IFleetUserFilters } from "./fleetUser.interface";
import {
  fleetUserFilterableFields,
  fleetUserSearchableFields,
} from "./fleetUser.constants";
import ApiError from "../../../../errors/ApiError";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../../../interfaces/pagination";
import { IGenericResponse } from "../../../../interfaces/common";
import { paginationHelpers } from "../../../../helpers/paginationHelper";
import bcrypt from "bcrypt";
import config from "../../../../config";

const createFleetUser = async (payload: IFleetUser): Promise<IFleetUser> => {
  // Check if email already exists
  const existingUser = await FleetUser.findOne({ email: payload.email });
  if (existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already exists");
  }

  const result = await FleetUser.create(payload);
  return result;
};

const getAllFleetUsers = async (
  filters: IFleetUserFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IFleetUser[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: fleetUserSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => {
        // Handle array fields
        if (field === "additionalServices") {
          return { [field]: { $in: [value] } };
        }
        return { [field]: value };
      }),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await FleetUser.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await FleetUser.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleFleetUser = async (id: string): Promise<IFleetUser | null> => {
  const result = await FleetUser.findById(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Fleet user not found");
  }
  return result;
};

const updateFleetUser = async (
  id: string,
  payload: Partial<IFleetUser>
): Promise<IFleetUser | null> => {
  const isExist = await FleetUser.findById(id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Fleet user not found");
  }

  const { email, ...rest } = payload;

  // Prevent email change
  if (email && email !== isExist.email) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email cannot be changed");
  }

  const result = await FleetUser.findOneAndUpdate({ _id: id }, rest, {
    new: true,
  });

  return result;
};

const deleteFleetUser = async (id: string): Promise<IFleetUser | null> => {
  const result = await FleetUser.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Fleet user not found");
  }
  return result;
};

// Additional Functions
const getFleetUserProfile = async (id: string): Promise<IFleetUser | null> => {
  const result = await FleetUser.findById(id);
  return result;
};

const updateFleetUserProfile = async (
  id: string,
  payload: Partial<IFleetUser>
): Promise<IFleetUser | null> => {
  const user = await FleetUser.findById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "Fleet user not found");
  }

  const { email, password, ...rest } = payload;

  // Prevent email change
  if (email && email !== user.email) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email cannot be changed");
  }

  // Handle password update separately
  let updatePayload: Partial<IFleetUser> = { ...rest };
  if (password) {
    const hashedPassword = await bcrypt.hash(
      password,
      Number(config.bycrypt_salt_rounds)
    );
    updatePayload = { ...rest, password: hashedPassword };
  }

  const result = await FleetUser.findOneAndUpdate({ _id: id }, updatePayload, {
    new: true,
  });

  return result;
};

const getMyProfile = async (userId: string) => {
  const result = await FleetUser.findOne({ _id: userId });
  return result;
};

export const FleetUserService = {
  createFleetUser,
  getAllFleetUsers,
  getSingleFleetUser,
  updateFleetUser,
  deleteFleetUser,
  getFleetUserProfile,
  updateFleetUserProfile,
  getMyProfile,
};
