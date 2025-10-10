import auth from "../../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../../enum/user";
import express from "express";
import validateRequest from "../../../middlewares/validateRequest";
import { FleetNewsValidation } from "./news.validation";
import { FleetNewsController } from "./news.controller";
import FleetAuth from "../../../middlewares/fleetAuth";
import conditionalAuth from "../../../middlewares/conditionalAuth";

const router = express.Router();

router.post(
  "/create",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(FleetNewsValidation.createFleetNewsZodSchema),
  FleetNewsController.createFleetNews
);

router.get("/", conditionalAuth, FleetNewsController.getAllFleetNews);
router.get("/:id", conditionalAuth, FleetNewsController.getSingleFleetNews);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(FleetNewsValidation.updateFleetNewsZodSchema),
  FleetNewsController.updateFleetNews
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  FleetNewsController.deleteFleetNews
);

// Additional Routes
router.get(
  "/featured/news",
  FleetAuth(ENUM_USER_ROLE.FLEET_USER),
  FleetNewsController.getFeaturedNews
);
router.get(
  "/recent/news",
  FleetAuth(ENUM_USER_ROLE.FLEET_USER),
  FleetNewsController.getRecentNews
);

export const FleetNewsRoutes = router;
