import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ContactService } from "./contact.service";
import { IContact } from "./contact.interface";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { contactFilterableFields } from "./contact.constants";

const createContact = catchAsync(async (req: Request, res: Response) => {
  const { ...contactData } = req.body;
  const result = await ContactService.createContact(contactData);

  sendResponse<IContact>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Contact created successfully",
    data: result,
  });
});

const getSingleContact = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ContactService.getSingleContact(id);

  sendResponse<IContact>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Contact fetched successfully",
    data: result,
  });
});

const getAllContacts = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, contactFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await ContactService.getAllContacts(
    filters,
    paginationOptions
  );

  sendResponse<IContact[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Contacts fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateContact = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...contactData } = req.body;
  const result = await ContactService.updateContact(id, contactData);

  sendResponse<IContact>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Contact updated successfully",
    data: result,
  });
});

const deleteContact = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ContactService.deleteContact(id);

  sendResponse<IContact>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Contact deleted successfully",
    data: result,
  });
});

export const ContactController = {
  createContact,
  getSingleContact,
  getAllContacts,
  updateContact,
  deleteContact,
};
