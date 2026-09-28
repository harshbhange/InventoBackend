import type { Request, Response } from "express";
import { hashPassword } from "../../utils/hashpass.utils";
import { registerZodSchema } from "../../types/zod";
import { db } from "../../prisma/db";
import generateToken from "../../utils/generated-token.utils";

export default async function registerUser(req: Request, res: Response) {
  try {
    // 1. Validate request body
    const result = registerZodSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.format(),
      });
    }
    console.log(result);
    const { email, password, provider } = result.data;

    // 2. Hash password
    const hashPass = await hashPassword(password);

    // 3. Create user
    const user = await db.user.create({
      data: {
        email,
        password: hashPass,
        provider,
        createdAt: new Date(),
      },
    });

    if (user.id) {
      const token = generateToken(user);
      res.cookie("authToken", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1,
      });
    }
  } catch (error: any) {
    console.error(error);

    // Duplicate email
    if (error?.code === "P2002") {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    // Unexpected error
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
