

import { z } from "zod";

const nameRegex = /^[a-zA-Z0-9 _-]+$/;
const egyptianPhone = /^(010|011|012|015)\d{8}$/;

// ── Register ───────────────────────────────────────────────────────
export const regSchema = z
  .object({
    userName: z
      .string()
      .nonempty("Name is required!")
      .min(5, "Name must be at least 5 characters")
      .max(20, "Name must be less than 20 characters")
      .regex(/^[A-Za-z\s]+$/, "Name must contain only letters")
      .refine((val) => val.trim().includes(" "), {
        message: "Please enter your full name (first and last name)",
      }),

    email: z
      .string()
      .nonempty("Email is required!")
      .email("Invalid email format"),

    password: z.string().min(8, "Password must be at least 8 characters"),

    rePassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters"),

    age: z.coerce
      .number({ invalid_type_error: "Age must be a number" })
      .min(18, "Age must be at least 18")
      .max(60, "Age must be less than 60"),

    gender: z.enum(["male", "female"], {
      errorMap: () => ({ message: "Please choose your gender (male or female)" }),
    }),

    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.rePassword, {
    path: ["rePassword"],
    message: "Passwords do not match",
  });

// ── Login ──────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// ── Update Profile ─────────────────────────────────────────────────
export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(3, "First name must be at least 3 characters")
    .max(30, "First name must be at most 30 characters")
    .regex(nameRegex, "Only letters, numbers, spaces, - or _ allowed"),
  lastName: z
    .string()
    .min(3, "Last name must be at least 3 characters")
    .max(30, "Last name must be at most 30 characters")
    .regex(nameRegex, "Only letters, numbers, spaces, - or _ allowed"),
  gender: z.enum(["male", "female"], { message: "Gender is required" }),
  phone: z
    .string()
    .regex(egyptianPhone, "Phone must be a valid Egyptian number (010/011/012/015 + 8 digits)")
    .optional()
    .or(z.literal("")),
  age: z.coerce
    .number({ invalid_type_error: "Age must be a number" })
    .int("Age must be an integer")
    .min(18, "You must be at least 18 years old"),
});

// ── Update Password ────────────────────────────────────────────────
export const updatePasswordSchema = z
  .object({
    oldPassword: z.string().min(8, "Current password must be at least 8 characters"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your new password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((d) => d.oldPassword !== d.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

// ── Forget Password ────────────────────────────────────────────────
export const forgetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// ── Confirm OTP ────────────────────────────────────────────────────
export const confirmOTPSchema = z.object({
  otp: z.string().min(1, "OTP is required"),
});

// ── Reset Password ─────────────────────────────────────────────────
export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    rePassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((d) => d.newPassword === d.rePassword, {
    message: "Passwords don't match",
    path: ["rePassword"],
  });