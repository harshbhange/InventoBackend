import z from "zod";

const registerZodSchema = z.object({
  email: z.email(),
  password: z.string(),
  provider: z.enum(["CREDENTIALS", "GOOGLE"]),
});

const loginZodSchema = z.object({
  email: z.email(),
  password: z.string(),
  provider: z.enum(["CREDENTIALS", "GOOGLE"]),
});
export { registerZodSchema, loginZodSchema };
