import type { Request, Response } from "express";
import { comparePassword } from "../../utils/hashpass.utils";
import { loginZodSchema } from "../../types/zod";
import { db } from "../../prisma/db";
import generateToken from "../../utils/generated-token.utils";

export default async function loginUser(req: Request, res: Response) {
  try {
    // 1. Validate request body
    const result = loginZodSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.format(),
      });
    }

    const { email, password, provider } = result.data;

    // 2. Find user
    const exUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    // 3. User doesn't exist
    if (!exUser) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 4. Check provider
    if (exUser.provider !== provider) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 5. Check password
    if (!exUser.password) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await comparePassword({
      password,
      hashPass: exUser.password,
    });

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 6. Generate authentication token
    const token = generateToken(exUser);

    // 7. Set HTTP-only cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // 8. Remove password before sending user data
    const { password: _, ...safeUser } = exUser;

    return res.status(200).json({
      message: "User logged in successfully",
      user: safeUser,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
