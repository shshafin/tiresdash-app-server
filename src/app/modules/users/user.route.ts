import express from "express";
import { UserController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";
import conditionalAuth from "../../middlewares/conditionalAuth";

const router = express.Router();

router.get(
  "/",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  UserController.getUsers
);
router.get("/:email", conditionalAuth, UserController.FindSingleUser);

router.post(
  "/create",
  validateRequest(UserValidation.createUserZodSchema),
  UserController.create
);

router.patch(
  "/:id",
  conditionalAuth,
  validateRequest(UserValidation.updateUserZodSchema),
  UserController.updateUser
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  UserController.deleteUser
);

export const UserRoutes = router;
