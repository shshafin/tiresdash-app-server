import express from "express";
import { FleetUserController } from "./fleetUser.controller";
import { FleetUserValidation } from "./fleetUser.validation";
import validateRequest from "../../../middlewares/validateRequest";
import auth from "../../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../../enum/user";
import FleetAuth from "../../../middlewares/fleetAuth";
import conditionalAuth from "../../../middlewares/conditionalAuth";

const router = express.Router();

router.post(
  "/register",
  validateRequest(FleetUserValidation.createFleetUserZodSchema),
  FleetUserController.createFleetUser
);

router.get("/", auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), FleetUserController.getAllFleetUsers);

router.get(
  "/:id",
  // auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  FleetUserController.getSingleFleetUser
);

router.patch(
  "/:id",
  // auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(FleetUserValidation.updateFleetUserZodSchema),
  FleetUserController.updateFleetUser
);

router.delete("/:id", auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), FleetUserController.deleteFleetUser);

router.get("/profile/me", FleetAuth(ENUM_USER_ROLE.FLEET_USER), FleetUserController.getMyProfile);

// Profile routes
router.get("/profile/:id", FleetAuth(ENUM_USER_ROLE.FLEET_USER), FleetUserController.getFleetUserProfile);

router.patch(
  "/profile/:id",
  FleetAuth(ENUM_USER_ROLE.FLEET_USER),
  validateRequest(FleetUserValidation.updateFleetUserZodSchema),
  FleetUserController.updateFleetUserProfile
);

export const FleetUserRoutes = router;
