import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "../../prisma/db";
import createProfile from "../../controllers/me/create-profile.controller";
import updateProfile from "../../controllers/me/update-profile.controller";

const meRoute = Router();

meRoute.get("/user", async (req: Request, res: Response) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id: req.user.id,
        email: req.user.email,
        provider: req.user.provider,
      },
      select: {
        id: true,
        email: true,
        provider: true,
        createdAt: true,
        updatedAt: true,
        profile: true,
      },
    });
    return res.status(201).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});
meRoute.post("/profile/create", createProfile);
meRoute.patch("/profile/update", updateProfile);
export { meRoute };
