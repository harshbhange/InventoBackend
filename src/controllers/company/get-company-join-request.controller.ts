import type { Request, Response } from "express";
import { db } from "../../prisma/db";

export default async function getCompanyJoinRequests(
  req: Request,
  res: Response,
) {
  try {
    const { id: userId } = req.user;

    const companyMember = await db.companyMember.findFirst({
      where: {
        userId,
        role: "OWNER",
      },
    });

    if (!companyMember) {
      return res.status(403).json({
        message: "Only the company owner can view join requests",
      });
    }

    const joinRequests = await db.companyJoinRequest.findMany({
      where: {
        companyId: companyMember.companyId,
        status: "PENDING",
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        userId: true,
        status: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      message: "Join requests fetched successfully",
      requests: joinRequests,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
