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
const leaveTypes = [
  "sick leave",
  "casual leave",
  "annual leave",
  "unpaid leave",
  "maternity leave",
  "paternity leave",
  "bereavement leave"
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
export const signupSchema = z
  .object({
    firstname: z.string().min(1, "First name is required"),
    lastname: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    cpassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.cpassword, {
    message: "Passwords do not match",
    path: ["cpassword"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;