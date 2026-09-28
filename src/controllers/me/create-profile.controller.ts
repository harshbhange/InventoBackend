import type { Request, Response } from "express";
import { createProfileZodSchema } from "../../types/zod";
import { db } from "../../prisma/db";

export default async function createProfile(req: Request, res: Response) {
  try {
    const { id } = req.user;

    // 1. Validate request body
    const result = createProfileZodSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.format(),
      });
    }

    // 2. Check if profile already exists
    const existingProfile = await db.profile.findUnique({
      where: {
        userId: id,
      },
    });

    if (existingProfile) {
      return res.status(409).json({
        message: "Profile already exists. Please update your profile.",
      });
    }

    // 3. Create profile
    const profile = await db.profile.create({
      data: {
        userId: id,
        ...result.data,
      },
    });

    // 4. Return created profile
    return res.status(201).json({
      message: "Profile created successfully",
      profile,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
