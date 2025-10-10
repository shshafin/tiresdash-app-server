import express from "express";
import { FleetAuthValidation } from "./fleetAuth.validation";
import validateRequest from "../../../middlewares/validateRequest";
import { FleetAuthController } from "./fleetAuth.controller";
import FleetAuth from "../../../middlewares/fleetAuth";
import { ENUM_USER_ROLE } from "../../../../enum/user";

const router = express.Router();

router.post(
  "/login",
  validateRequest(FleetAuthValidation.FleetloginSchema),
  FleetAuthController.FleetLoginUser
);

router.post("/logout", FleetAuthController.FleetLogoutUser);

router.post(
  "/refresh-token",
  validateRequest(FleetAuthValidation.refreshTokenZodSchema),
  FleetAuthController.refreshToken
);

router.post(
  "/change-password",
  validateRequest(FleetAuthValidation.changePasswordZodSchema),
  FleetAuth(ENUM_USER_ROLE.FLEET_USER),
  FleetAuthController.changePassword
);

router.post("/forgot-password", FleetAuthController.forgotPassword);

router.post("/reset-password", FleetAuthController.resetPassword);

export const FleetAuthRoutes = router;
