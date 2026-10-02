import type { Request, Response } from "express";
import { db } from "../../prisma/db";

export default async function getProfile(req: Request, res: Response) {
  try {
    const { id: userId } = req.user;
    const exProfile = await db.profile.findFirst({
      where: {
        userId,
      },
    });
    if (!exProfile) {
      return res.status(404).json({ message: "Profile not found Create One" });
    }
    return res.status(201).json({ message: "Profile found", exProfile });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
