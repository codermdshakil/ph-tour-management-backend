import z from "zod";

export const createGuideZodSchema = z.object({
  divisionId: z
    .string({ message: "DivisionId must be string" })
});