import type { Request, Response } from "express";
import { db } from "../../prisma/db";
export default async function removeCompanyMember(req: Request, res: Response) {
  try {
    const { id: ownerId } = req.user;
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    } // Check whether logged-in user is the owner
    const ownerMembership = await db.companyMember.findFirst({
      where: { userId: ownerId, role: "OWNER" },
    });
    if (!ownerMembership) {
      return res
        .status(403)
        .json({ message: "Only the company owner can remove members" });
    } // Prevent owner from removing themselves
    if (userId === ownerId) {
      return res
        .status(403)
        .json({ message: "The owner cannot remove themselves" });
    } // Find the member in the owner's company
    if (typeof userId !== "string" || !userId.trim()) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const member = await db.companyMember.findFirst({
      where: {
        userId,
        companyId: ownerMembership.companyId,
      },
    });
    if (!member) {
      return res.status(404).json({ message: "Company member not found" });
    } // Extra protection in case the target somehow has OWNER role
    if (member.role === "OWNER") {
      return res
        .status(403)
        .json({ message: "The company owner cannot be removed" });
    }
    await db.companyMember.delete({ where: { id: member.id } });
    return res
      .status(200)
      .json({ message: "Company member removed successfully", userId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
