import express from "express";
import { ENUM_USER_ROLE } from "../../../../enum/user";
import { uploadFiles } from "../../../../helpers/fileHandlers";
import { FleetAppointmentValidation } from "./appointment.validation";
import validateRequest from "../../../middlewares/validateRequest";
import { FleetAppointmentController } from "./appointment.controller";
import auth from "../../../middlewares/auth";
import FleetAuth from "../../../middlewares/fleetAuth";
import conditionalAuth from "../../../middlewares/conditionalAuth";

const router = express.Router();

router.post(
  "/create",
  FleetAuth(ENUM_USER_ROLE.FLEET_USER),
  uploadFiles,
  validateRequest(FleetAppointmentValidation.createFleetAppointmentZodSchema),
  FleetAppointmentController.createFleetAppointment
);

router.get(
  "/",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  FleetAppointmentController.getAllFleetAppointments
);

router.get(
  "/my-appointments",
  FleetAuth(ENUM_USER_ROLE.FLEET_USER),
  FleetAppointmentController.getMyFleetAppointments
);

router.get(
  "/:id",
  conditionalAuth,
  FleetAppointmentController.getSingleFleetAppointment
);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  uploadFiles,
  validateRequest(FleetAppointmentValidation.updateFleetAppointmentZodSchema),
  FleetAppointmentController.updateFleetAppointment
);

router.patch(
  "/:id/fleet-ref",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  FleetAppointmentController.updateFleetRef
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  FleetAppointmentController.deleteFleetAppointment
);

// Additional Routes
router.get(
  "/vehicle/:vehicleId",
  // auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
  FleetAppointmentController.getAppointmentsByVehicle
);

router.patch(
  "/:id/status",
  // auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  FleetAppointmentController.updateAppointmentStatus
);

router.get(
  "/upcoming/appointments",
  // auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  FleetAppointmentController.getUpcomingAppointments
);

export const FleetAppointmentRoutes = router;
