"use client";
import { z } from "zod";

export const SignInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address." }),
  password: z.string().min(7, { message: "A valid password is required" }),
});
export type SignInSchema = z.infer<typeof SignInSchema>;

export const SignUpSchema = z.object({
  firstName: z.string().min(1, { message: "A first name is required." }),
  lastName: z.string().min(1, { message: "A last name is required." }),
  address: z.string().min(1, { message: "An address is required." }),

  city: z.string().min(1, { message: "A city is required." }),
  state: z
    .string()
    .length(2, {
      message: "A valid state abbreviation (e.g., NY, CA) is required.",
    })
    .regex(/^[A-Z]{2}$/, {
      message: "State must be two uppercase letters (e.g., NY).",
    }),

  postalCode: z
    .string()
    .length(5, { message: "A valid postal code is required (5 digits)." })
    .regex(/^\d{5}$/, { message: "Postal code must contain only numbers." }),

  dateOfBirth: z
    .string()
    .date("A valid date is required")
    .refine(
      (dateStr) => {
        const date = new Date(dateStr);
        const today = new Date();
        const eighteenYearsAgo = new Date(
          today.getFullYear() - 18,
          today.getMonth(),
          today.getDate()
        );
        
        return date <= eighteenYearsAgo;
      },
      {
        message: "You must be at least 18 years old",
      }
    ),

  ssn: z
    .string()
    .length(4, { message: "SSN must be exactly 4 digits." })
    .regex(/^\d{4}$/, { message: "SSN must contain only numbers." }),

  email: z
    .string({ message: "Email is required" })
    .email({
      message: "Please enter a valid email address.",
    })
    .trim(),

  password: z
    .string({
      message: "Password is required",
    })
    .min(7, { message: "Password must be at least 7 characters long." })
    .max(50, { message: "Password must be at most 50 characters long." })
    // .regex(/[A-Z]/, {
    //   message: "Password must contain at least one uppercase letter.",
    // })
    // .regex(/[a-z]/, {
    //   message: "Password must contain at least one lowercase letter.",
    // })
    // .regex(/[0-9]/, { message: "Password must contain at least one number." })
    // .regex(/[\W_]/, {
    //   message: "Password must contain at least one special character.",
    // })
    .trim(),
});
export type SignUpSchema = z.infer<typeof SignUpSchema>;
