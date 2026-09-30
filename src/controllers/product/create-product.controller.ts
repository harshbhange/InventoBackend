import type { Request, Response } from "express";
import { db } from "../../prisma/db";
import { createProductZodSchema } from "../../types/zod";
export default async function createProduct(req: Request, res: Response) {
  try {
    const { id: userId } = req.user;
    const result = createProductZodSchema.safeParse(req.body);
    if (!result.success) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: result.error.format() });
    }
    const companyMember = await db.companyMember.findFirst({
      where: { userId, role: { in: ["OWNER", "ADMIN"] } },
    });
    if (!companyMember) {
      return res
        .status(403)
        .json({ message: "Only the owner or admin can create products" });
    }
    const existingProduct = await db.product.findUnique({
      where: {
        companyId_sku: {
          companyId: companyMember.companyId,
          sku: result.data.sku,
        },
      },
    });
    if (existingProduct) {
      return res
        .status(409)
        .json({ message: "A product with this SKU already exists" });
    }
    const product = await db.product.create({
      data: { companyId: companyMember.companyId, ...result.data },
    });
    return res
      .status(201)
      .json({ message: "Product created successfully", product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
