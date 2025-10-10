import { z } from "zod";

const createFleetAppointmentZodSchema = z.object({
  body: z.object({
    fleetUser: z.string({}).optional(),
    fleetVehicle: z.string({
      required_error: "Fleet vehicle ID is required",
    }),
    serviceType: z.enum(["Tire Replacement", "Flat Repair", "Balance", "Rotation", "Other"], {
      required_error: "Service type is required",
    }),
    date: z.string({
      required_error: "Date is required",
    }),
    time: z.string({
      required_error: "Time is required",
    }),
    address: z.string({
      required_error: "Address is required",
    }),
    notes: z.string().optional(),
    files: z.array(z.string()).optional(),
    status: z.enum(["Pending", "Confirmed", "Completed", "Cancelled"]).optional(),
    assignedTo: z.string().optional(),
    estimatedDuration: z.number().optional(),
    costEstimate: z.number().optional(),
    fleetRef: z
      .object({
        phone: z.string().optional(),
        email: z.string().email("Invalid email address").optional(),
        note: z.string().max(200, "Note cannot exceed 200 characters").optional(),
      })
      .optional(),
  }),
});

const updateFleetAppointmentZodSchema = z.object({
  body: z.object({
    fleetVehicle: z.string().optional(),
    serviceType: z.enum(["Tire Replacement", "Flat Repair", "Balance", "Rotation", "Other"]).optional(),
    date: z.string().optional(),
    time: z.string().optional(),
    address: z.string().optional(),
    notes: z.string().optional(),
    files: z.array(z.string()).optional(),
    status: z.enum(["Pending", "Confirmed", "Completed", "Cancelled"]).optional(),
    assignedTo: z.string().optional(),
    estimatedDuration: z.number().optional(),
    costEstimate: z.number().optional(),
    fleetRef: z
      .object({
        phone: z.string().optional(),
        email: z.string().email("Invalid email address").optional(),
        note: z.string().max(200, "Note cannot exceed 200 characters").optional(),
      })
      .optional(),
  }),
});

export const FleetAppointmentValidation = {
  createFleetAppointmentZodSchema,
  updateFleetAppointmentZodSchema,
};
