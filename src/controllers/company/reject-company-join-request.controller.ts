import type { Request, Response } from "express";
import { db } from "../../prisma/db";
import { rejectJoinRequestZodSchema } from "../../types/zod";

export default async function rejectCompanyJoinRequest(
  req: Request,
  res: Response,
) {
  try {
    const { id: ownerId } = req.user;

    const result = rejectJoinRequestZodSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.format(),
      });
    }

    const { requestId } = result.data;

    const ownerMembership = await db.companyMember.findFirst({
      where: {
        userId: ownerId,
        role: "OWNER",
      },
    });

    if (!ownerMembership) {
      return res.status(403).json({
        message: "Only the company owner can reject join requests",
      });
    }

    const joinRequest = await db.companyJoinRequest.findUnique({
      where: {
        id: requestId,
      },
    });

    if (!joinRequest) {
      return res.status(404).json({
        message: "Join request not found",
      });
    }

    if (joinRequest.companyId !== ownerMembership.companyId) {
      return res.status(403).json({
        message: "This join request does not belong to your company",
      });
    }

    if (joinRequest.status !== "PENDING") {
      return res.status(409).json({
        message: `Join request has already been ${joinRequest.status.toLowerCase()}`,
      });
    }

    const rejectedRequest = await db.companyJoinRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status: "REJECTED",
      },
    });

    return res.status(200).json({
      message: "Join request rejected successfully",
      request: rejectedRequest,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
