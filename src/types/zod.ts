import z from "zod";

const registerZodSchema = z.object({
  email: z.email(),
  password: z.string(),
  provider: z.enum(["CREDENTIALS", "GOOGLE"]),
});
export { registerZodSchema };
