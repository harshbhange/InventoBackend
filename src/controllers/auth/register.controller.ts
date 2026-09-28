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

    const { email, password, provider } = result.data;

    // 2. Hash password
    const hashPass = await hashPassword(password);

    // 3. Create user
    const user = await db.user.create({
      data: {
        email,
        password: hashPass,
        provider,
      },
    });

    // 4. Generate authentication token
    const token = generateToken(user);

    // 5. Set HTTP-only cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // 6. Remove password before sending user data
    const { password: _, ...safeUser } = user;

    return res.status(201).json({
      message: "User registered successfully",
      user: safeUser,
    });
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
