import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { BlogController } from "./blog.controller";
import { BlogValidation } from "./blog.validation";
import { ENUM_USER_ROLE } from "../../../enum/user";
import { uploadImage } from "../../../helpers/fileHandlers";

const router = express.Router();

router.post(
  "/create",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  uploadImage,
  validateRequest(BlogValidation.createBlogZodSchema),
  BlogController.createBlog
);

router.get("/:id", BlogController.getSingleBlog);
router.get("/", BlogController.getAllBlogs);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  uploadImage,
  validateRequest(BlogValidation.updateBlogZodSchema),
  BlogController.updateBlog
);

router.delete("/:id", auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), BlogController.deleteBlog);

export const BlogRoutes = router;
