import z from "zod"
export const workfromhomeSchema = z.object({
  start_date: z
    .string()
    .min(1, "start Date is required"),
  end_date: z
    .string()
    .min(1, "end Date is required"),
  reason: z
    .string()
    .min(1, "reason is required")
})
export type WorkFromHomePayload = z.infer<typeof workfromhomeSchema>;
const leaveTypes = [
  "sick",
  "casual",
  "annual",
  "unpaid",
  "maternity",
  "paternity",
  "bereavement"
] as const;
export const leavesSchema = z.object({
  leave_type: z
    .string()
    .refine((val) => leaveTypes.includes(val as any), {
      message: "leave type required",
    }),
  start_date: z
    .string()
    .min(1, "start Date is required"),
  end_date: z
    .string()
    .min(1, "End Date is required"),
  reason: z
    .string()
    .min(1, "Reason is required")
})
export const holidaySchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters"),
  holiday_date: z
    .string()
    .min(1, "Holidate Date is required")
})
export type HolidaysPayload = z.infer<typeof holidaySchema>;

export const forgetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .refine((val) => val === "" || /\S+@\S+\.\S+/.test(val), {
      message: "Invalid email address",
    }),
})

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .refine((val) => val === "" || /\S+@\S+\.\S+/.test(val), {
      message: "Invalid email address",
    }),
  password: z
    .string()
    .min(1, "password is required")
})
export type LoginPayload = z.infer<typeof loginSchema>;
export const registerSchema = z
  .object({
    firstname: z.string().min(1, "First name is required"),
    lastname: z.string().min(1, "Last name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .refine((val) => val === "" || /\S+@\S+\.\S+/.test(val), {
        message: "Invalid email address",
      }),
    password: z.string().min(6, "Password must be at least 6 characters"),
    cpassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.cpassword, {
    message: "Passwords do not match",
    path: ["cpassword"],
  });

export type registerPayload = z.infer<typeof registerSchema>;