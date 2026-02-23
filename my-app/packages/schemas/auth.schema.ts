
import { z } from "zod";

export const signupSchema = z.object({

    name: z.string().min(2, "Name is required"),

  email: z
    .string()
    .email("Invalid email"),

  password: z
    .string()
    .min(8, "Password must be at least 8 chars"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email"),

  password: z
    .string()
    .min(8, "Password must be at least 8 chars"),
});


export type SignupType = z.infer<typeof signupSchema>;
export type LoginType = z.infer<typeof loginSchema>;

export const authSchema = z.object({
  name: z.string().min(2, 'Name is required').optional(),

  email: z.string().email('Invalid email'),

  password: z.string().min(8, 'Password must be at least 8 chars'),
});

export type AuthType = z.infer<typeof authSchema>;

export const patchTodoSchema = z.object({
  status: z.enum([
    'todo',
    'backlog',
    'inprogress',
    'done',
    'cancelled',
  ]).optional(),

  text: z.string().optional(),
  description: z.string().optional(),
})
