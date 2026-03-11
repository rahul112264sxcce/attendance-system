import z from "zod"
export const leavesSchema = z.object({
  leave_type: z
    .string()
    .min(3, "Title must be at least 3 characters"),
  start_date: z
    .string()
    .min(1, "start Date is required"),
  end_date: z
    .string()
    .min(1, "End Date is required"),
  reason: z
    .string()
    .min(1, "End Date is required")
})
export const holidaySchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters"),
  holiday_date: z
    .string()
    .min(1, "Date is required")
})
export const signinSchema = z.object({
  email: z
    .email(),
  password: z
    .string()
    .min(1, "password is required")
})
export const signupSchema = z.object({
  firstname: z.string().min(1, "first name is required"),
  lastname: z.string().min(1, "last name is required"),
  email: z
    .email(),
  password: z
    .string()
    .min(1, "password is required"),
  cpassword: z
    .string()
    .min(1, "confirm password is required"),
})