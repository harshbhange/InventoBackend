import type { Request, Response } from "express";
import { db } from "../../prisma/db";

export default async function getCompanyProducts(req: Request, res: Response) {
  try {
    const { id: userId } = req.user;

    const companyMember = await db.companyMember.findFirst({
      where: {
        userId,
        role: {
          in: ["OWNER", "ADMIN"],
        },
      },
    });

    if (!companyMember) {
      return res.status(403).json({
        message: "Only the owner or admin can view company products",
      });
    }

    const products = await db.product.findMany({
      where: {
        companyId: companyMember.companyId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
