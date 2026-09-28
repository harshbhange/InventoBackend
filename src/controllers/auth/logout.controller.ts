import type { Request, Response } from "express";

export default async function logoutUser(_: Request, res: Response) {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  return res.status(200).json({ message: "User logged out successfully" });
}
