import type { Request, Response } from "express";
import { db } from "../../prisma/db";

export default async function deleteCompany(req: Request, res: Response) {
  try {
    const { id: userId } = req.user;
    const { companyId } = req.query;

    if (typeof companyId !== "string" || !companyId.trim()) {
      return res.status(400).json({
        message: "Company ID is required",
      });
    }

    const companyMember = await db.companyMember.findUnique({
      where: {
        companyId_userId: {
          companyId,
          userId,
        },
      },
    });

    if (!companyMember || companyMember.role !== "OWNER") {
      return res.status(403).json({
        message: "Only the company owner can delete the company",
      });
    }

    await db.$transaction(async (tx) => {
      await tx.companyMember.deleteMany({
        where: {
          companyId,
        },
      });

      await tx.company.delete({
        where: {
          id: companyId,
        },
      });
    });

    return res.status(200).json({
      message: "Company deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
