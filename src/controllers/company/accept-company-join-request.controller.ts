import type { Request, Response } from "express";
import { db } from "../../prisma/db";
import { acceptJoinRequestZodSchema } from "../../types/zod";

export default async function acceptCompanyJoinRequest(
  req: Request,
  res: Response,
) {
  try {
    const { id: ownerId } = req.user;

    const result = acceptJoinRequestZodSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.format(),
      });
    }

    const { requestId, role } = result.data;

    // Check whether the logged-in user is an owner
    const ownerMembership = await db.companyMember.findFirst({
      where: {
        userId: ownerId,
        role: "OWNER",
      },
    });

    if (!ownerMembership) {
      return res.status(403).json({
        message: "Only the company owner can accept join requests",
      });
    }

    // Find the join request
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

    // Make sure the request belongs to the owner's company
    if (joinRequest.companyId !== ownerMembership.companyId) {
      return res.status(403).json({
        message: "This join request does not belong to your company",
      });
    }

    // Request must still be pending
    if (joinRequest.status !== "PENDING") {
      return res.status(409).json({
        message: `Join request has already been ${joinRequest.status.toLowerCase()}`,
      });
    }

    const resultTransaction = await db.$transaction(async (tx) => {
      const member = await tx.companyMember.create({
        data: {
          companyId: joinRequest.companyId,
          userId: joinRequest.userId,
          role,
        },
      });

      const updatedRequest = await tx.companyJoinRequest.update({
        where: {
          id: joinRequest.id,
        },
        data: {
          status: "ACCEPTED",
        },
      });

      return {
        member,
        request: updatedRequest,
      };
    });

    return res.status(200).json({
      message: "Join request accepted successfully",
      member: resultTransaction.member,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
