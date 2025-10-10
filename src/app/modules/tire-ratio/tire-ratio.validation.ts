import { z } from "zod";

const create = z.object({
  body: z.object({
    ratio: z.string({
      required_error: "Ratio is required",
    }),
  }),
});

const update = z.object({
  body: z.object({
    ratio: z.string().optional(),
  }),
});

export const TireRatioValidation = {
  create,
  update,
};
