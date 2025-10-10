import { z } from "zod";

const createContactZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Contact name is required",
    }),
    address: z.string().optional(),
    contactInfo: z.string().optional(),
    description: z.string().optional(),
  }),
});

const updateContactZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    address: z.string().optional(),
    contactInfo: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const ContactValidation = {
  createContactZodSchema,
  updateContactZodSchema,
};
