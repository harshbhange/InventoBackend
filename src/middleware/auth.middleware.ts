import type { NextFunction, Request, Response } from "express";
import tokenParser from "../utils/token-parser";
import { db } from "../prisma/db";

export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      return res.status(401).json({
        message: "Authentication token not found",
      });
    }

    const jwtPayload = tokenParser(token);

    const verifiedUser = await db.user.findUnique({
      where: {
        id: jwtPayload.id,
      },
    });

    if (!verifiedUser) {
      return res.status(401).json({
        message: "User is not authenticated",
      });
    }

    req.user = jwtPayload;

    return next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      message: "Invalid or expired authentication token",
    });
  }
}
