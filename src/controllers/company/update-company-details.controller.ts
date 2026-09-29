import type { Request, Response } from "express";
import { updateCompanyZodSchema } from "../../types/zod";
import { db } from "../../prisma/db";

export default async function updateCompanyDetails(
  req: Request,
  res: Response,
) {
  try {
    const { id } = req.user;

    const result = updateCompanyZodSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.format(),
      });
    }

    const companyMember = await db.companyMember.findFirst({
      where: {
        userId: id,
        role: "OWNER",
      },
    });

    if (!companyMember) {
      return res.status(403).json({
        message: "Only the company owner can update company details",
      });
    }

    const { tags, ...companyData } = result.data;

    const updatedCompany = await db.company.update({
      where: {
        id: companyMember.companyId,
      },
      data: {
        ...companyData,

        ...(tags && {
          tags: {
            push: tags,
          },
        }),
      },
    });

    return res.status(200).json({
      message: "Company details updated successfully",
      company: updatedCompany,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
