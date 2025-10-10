import { IContact, IContactFilter } from "./contact.interface";
import { Contact } from "./contact.model";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder } from "mongoose";
import { contactSearchableFields } from "./contact.constants";

const createContact = async (payload: IContact): Promise<IContact | null> => {
  const result = await Contact.create(payload);
  return result;
};

const getSingleContact = async (id: string): Promise<IContact | null> => {
  const result = await Contact.findById(id);
  return result;
};

const getAllContacts = async (
  filters: IContactFilter,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IContact[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  // Search implementation
  if (searchTerm) {
    andConditions.push({
      $or: contactSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  // Filters implementation
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Contact.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Contact.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateContact = async (
  id: string,
  payload: Partial<IContact>
): Promise<IContact | null> => {
  const result = await Contact.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteContact = async (id: string): Promise<IContact | null> => {
  const result = await Contact.findByIdAndDelete(id);
  return result;
};

export const ContactService = {
  createContact,
  getSingleContact,
  getAllContacts,
  updateContact,
  deleteContact,
};
