import { z } from "zod";
import { parseISO, isAfter, isBefore } from "date-fns";

export const todoFormSchema = z
  .object({
    text: z.string().min(1, "Text is required"),

description: z
  .string()
  .min(5, "Description required")
  .max(100, "Description too long"),

   status: z.enum([
  "todo",
  "backlog",
  "inprogress",
  "done",
  "cancelled",
]),


    startDate: z
      .string()
      .min(1, "Start date is required"),

    startTime: z
      .string()
      .min(1, "Start time is required"),

    // End
    endDate: z
      .string()
      .min(1, "End date is required"),

    endTime: z
      .string()
      .min(1, "End time is required"),
  })

 .superRefine((data, ctx) => {
  const start = new Date(
    `${data.startDate}T${data.startTime}`
  );

  const end = new Date(
    `${data.endDate}T${data.endTime}`
  );

const today = new Date();
today.setHours(0, 0, 0, 0);

// Prevent past date
if (start < today) {
  ctx.addIssue({
    path: ["startDate"],
    message: "Only today or future dates allowed",
    code: z.ZodIssueCode.custom,
  });
}


if (end < today) {
  ctx.addIssue({
    path: ["endDate"],
    message: "End date must be today or later",
    code: z.ZodIssueCode.custom,
  });
}

});


export type TodoForm = z.infer<typeof todoFormSchema>;
