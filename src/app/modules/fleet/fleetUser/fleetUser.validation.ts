import { z } from "zod";

const additionalServicesOptions = [
  "Coast Fuel Savings",
  "Discount Tire Telematics by Motorq",
  // "Revvo Smart Tire",
  "Roadside Assistance by NSD",
  "Spiffy Mobile Oil Change Service",
];

const createFleetUserZodSchema = z.object({
  body: z.object({
    buisnessName: z.string({
      required_error: "Business name is required",
    }),
    state: z.string({
      required_error: "State is required",
    }),
    city: z.string({
      required_error: "City is required",
    }),
    numberOfbuisnessYear: z.string({
      required_error: "Number of business years is required",
    }),
    numberOFvehicles: z.string().refine((val) => parseInt(val) >= 5, {
      message: "Number of vehicles must be at least 5",
    }),
    moreLocation: z.boolean({
      required_error: "More location status is required",
    }),
    centralLocation: z.boolean({
      required_error: "Central location status is required",
    }),
    fleetProgram: z.enum(
      ["Fleet Sales Specialist", "Store", "Website", "Other"],
      {
        required_error: "Fleet program is required",
      }
    ),
    preferredLocation: z.boolean({
      required_error: "Preferred location status is required",
    }),
    additionalServices: z
      .array(z.enum(additionalServicesOptions as [string, ...string[]]))
      .optional(),
    firstName: z.string({
      required_error: "First name is required",
    }),
    lastName: z.string({
      required_error: "Last name is required",
    }),
    title: z.string({
      required_error: "Title is required",
    }),
    phone: z.string({
      required_error: "Phone number is required",
    }),
    phoneExtension: z.string().optional(),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email(),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(6, "Password must be at least 6 characters"),
    AdditionalComments: z.string().optional(),
  }),
});

const updateFleetUserZodSchema = z.object({
  body: z.object({
    buisnessName: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    numberOfbuisnessYear: z.string().optional(),
    numberOFvehicles: z
      .string()
      .refine((val) => parseInt(val) >= 5, {
        message: "Number of vehicles must be at least 5",
      })
      .optional(),
    moreLocation: z.boolean().optional(),
    centralLocation: z.boolean().optional(),
    fleetProgram: z
      .enum(["Fleet Sales Specialist", "Store", "Website", "Other"])
      .optional(),
    preferredLocation: z.boolean().optional(),
    additionalServices: z
      .array(z.enum(additionalServicesOptions as [string, ...string[]]))
      .optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    title: z.string().optional(),
    phone: z.string().optional(),
    phoneExtension: z.string().optional(),
    email: z.string().email().optional(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional(),
    AdditionalComments: z.string().optional(),
  }),
});

const loginZodSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: "Email is required",
    }),
    password: z.string({
      required_error: "Password is required",
    }),
  }),
});

export const FleetUserValidation = {
  createFleetUserZodSchema,
  updateFleetUserZodSchema,
  loginZodSchema,
};
