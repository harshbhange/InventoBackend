import type { Request, Response } from "express";
import { db } from "../../prisma/db";
export default async function getCompanyMembers(req: Request, res: Response) {
  try {
    const { id: userId } = req.user;
    const companyMember = await db.companyMember.findFirst({
      where: { userId, role: { in: ["OWNER", "ADMIN"] } },
    });
    if (!companyMember) {
      return res
        .status(403)
        .json({ message: "Only the owner or admin can view company members" });
    }
    const members = await db.companyMember.findMany({
      where: { companyId: companyMember.companyId },
      select: {
        id: true,
        userId: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "asc" },
    });
    return res
      .status(200)
      .json({ message: "Company members fetched successfully", members });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
