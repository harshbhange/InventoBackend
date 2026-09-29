import type { Request, Response } from "express";
import { updateMemberRoleZodSchema } from "../../types/zod";
import { db } from "../../prisma/db";

export default async function updateMemberRole(req: Request, res: Response) {
  try {
    const { id: ownerId } = req.user;

    const result = updateMemberRoleZodSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.format(),
      });
    }

    const { userId, role } = result.data;

    // Check whether logged-in user is the owner
    const ownerMembership = await db.companyMember.findFirst({
      where: {
        userId: ownerId,
        role: "OWNER",
      },
    });

    if (!ownerMembership) {
      return res.status(403).json({
        message: "Only the company owner can update member roles",
      });
    }

    // Find the member inside the owner's company
    const member = await db.companyMember.findFirst({
      where: {
        userId,
        companyId: ownerMembership.companyId,
      },
    });

    if (!member) {
      return res.status(404).json({
        message: "Company member not found",
      });
    }

    // Prevent changing the owner
    if (member.role === "OWNER") {
      return res.status(403).json({
        message: "The owner role cannot be changed",
      });
    }

    // Don't update if role is already the same
    if (member.role === role) {
      return res.status(409).json({
        message: `User is already an ${role.toLowerCase()}`,
      });
    }

    const updatedMember = await db.companyMember.update({
      where: {
        id: member.id,
      },
      data: {
        role,
      },
    });

    return res.status(200).json({
      message: "Member role updated successfully",
      member: updatedMember,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
