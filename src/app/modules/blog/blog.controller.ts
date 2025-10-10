import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { BlogService } from "./blog.service";
import { IBlog } from "./blog.interface";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { blogFilterableFields } from "./blog.constants";
import { deleteFile, getFileUrl } from "../../../helpers/fileHandlers";
import ApiError from "../../../errors/ApiError";

const createBlog = catchAsync(async (req: Request, res: Response) => {
  const { ...blogData } = JSON.parse(req.body.data);

  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Blog image is required");
  }

  blogData.image = getFileUrl(req.file.filename);

  const result = await BlogService.createBlog(blogData);

  sendResponse<IBlog>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog created successfully",
    data: result,
  });
});

const getSingleBlog = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BlogService.getSingleBlog(id);

  sendResponse<IBlog>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog fetched successfully",
    data: result,
  });
});

const getAllBlogs = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, blogFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await BlogService.getAllBlogs(filters, paginationOptions);

  sendResponse<IBlog[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blogs fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateBlog = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...blogData } = req.body;

  const existingBlog = await BlogService.getSingleBlog(id);
  if (!existingBlog) {
    if (req.file) {
      deleteFile(req.file.filename);
    }
    throw new ApiError(httpStatus.NOT_FOUND, "Blog not found");
  }

  if (req.file) {
    if (existingBlog.image) {
      const oldFilename = existingBlog.image.split("/").pop();
      deleteFile(oldFilename ?? "");
    }
    blogData.image = getFileUrl(req.file.filename);
  }

  const result = await BlogService.updateBlog(id, blogData);

  sendResponse<IBlog>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog updated successfully",
    data: result,
  });
});

const deleteBlog = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const blog = await BlogService.getSingleBlog(id);
  if (!blog) {
    throw new ApiError(httpStatus.NOT_FOUND, "Blog not found");
  }

  if (blog.image) {
    const filename = blog.image.split("/").pop();
    deleteFile(filename ?? "");
  }

  const result = await BlogService.deleteBlog(id);

  sendResponse<IBlog>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog deleted successfully",
    data: result,
  });
});

export const BlogController = {
  createBlog,
  getSingleBlog,
  getAllBlogs,
  updateBlog,
  deleteBlog,
};
