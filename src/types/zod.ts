import z from "zod";

export const registerZodSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{10,16}$/,
      "Password must be 10–16 characters and include uppercase, lowercase, a number, and a special character",
    ),
  provider: z.enum(["CREDENTIALS", "GOOGLE"]),
});
export const loginZodSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{10,16}$/,
      "Password must be 10–16 characters and include uppercase, lowercase, a number, and a special character",
    ),
  provider: z.enum(["CREDENTIALS", "GOOGLE"]),
});

export const createProfileZodSchema = z.object({
  name: z
    .string("Name is required")
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),

  dob: z.coerce.date("Date of birth is required"),

  phone: z
    .string("Phone number is required")
    .trim()
    .regex(/^[0-9]{10,15}$/, "Phone number must contain 10 to 15 digits"),

  address: z
    .string("Address is required")
    .trim()
    .min(5, "Address must be at least 5 characters")
    .max(300, "Address must not exceed 300 characters"),

  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    message: "Gender must be MALE, FEMALE, or OTHER",
  }),

  bio: z
    .string("Bio is required")
    .trim()
    .min(10, "Bio must be at least 10 characters")
    .max(500, "Bio must not exceed 500 characters"),
});

export const createCompanyZodSchema = z.object({
  name: z
    .string("Name is required")
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),
  description: z
    .string("Description is required")
    .trim()
    .min(5, "Description must be at least 5 characters")
    .max(300, "Description must not exceed 300 characters")
    .optional(),
  tags: z
    .array(
      z
        .string()
        .trim()
        .min(2, "tag must be at least 2 characters")
        .max(50, "tag must not exceed 50 characters"),
    )
    .optional(),
});

export const acceptJoinRequestZodSchema = z.object({
  requestId: z.string().uuid("Invalid request ID"),
  role: z.enum(["ADMIN", "EMPLOYEE"]),
});

export const rejectJoinRequestZodSchema = z.object({
  requestId: z.string().uuid("Invalid request ID"),
});

export const updateMemberRoleZodSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  role: z.enum(["ADMIN", "EMPLOYEE"]),
});
export const updateCompanyZodSchema = createCompanyZodSchema.partial();

export const updateProfileZodSchema = createProfileZodSchema.partial();
