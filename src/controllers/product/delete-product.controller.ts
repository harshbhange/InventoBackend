import type { Request, Response } from "express";
import { db } from "../../prisma/db";

export default async function deleteProduct(req: Request, res: Response) {
  try {
    const { id: userId } = req.user;
    const { productId } = req.params;

    if (typeof productId !== "string" || !productId.trim()) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    const cleanProductId = productId.trim();

    // Check if the user is an OWNER or ADMIN of their company
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
        message: "Only the owner or admin can delete products",
      });
    }

    // Verify the product exists and belongs to the user's company
    const product = await db.product.findFirst({
      where: {
        id: cleanProductId,
        companyId: companyMember.companyId,
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Delete the product
    await db.product.delete({
      where: {
        id: product.id,
      },
    });

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
