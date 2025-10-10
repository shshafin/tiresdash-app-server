import { z } from "zod";

const createBlogZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Blog title is required",
    }),
    description: z.string({
      required_error: "Blog description is required",
    }),
    // image: z.string({
    //   required_error: "Blog image is required",
    // }),
    category: z.string().optional(),
  }),
});

const updateBlogZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    category: z.string().optional(),
  }),
});

export const BlogValidation = {
  createBlogZodSchema,
  updateBlogZodSchema,
};
