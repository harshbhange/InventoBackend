import type { Response, Request } from "express";
import { createCompanyZodSchema } from "../../types/zod";
import { db } from "../../prisma/db";

export default async function createCompany(req: Request, res: Response) {
  try {
    const { id } = req.user;

    const result = createCompanyZodSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.format(),
      });
    }

    // Check whether user already belongs to a company
    const existingMember = await db.companyMember.findFirst({
      where: {
        userId: id,
      },
    });

    if (existingMember) {
      return res.status(409).json({
        message: "User already belongs to a company",
      });
    }

    const { name, description, tags } = result.data;

    // Create company + owner membership together
    const resultTransaction = await db.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          name,
          description,
          tags,
        },
      });

      const companyMember = await tx.companyMember.create({
        data: {
          companyId: company.id,
          userId: id,
          role: "OWNER",
        },
      });

      return {
        company,
        companyMember,
      };
    });

    return res.status(201).json({
      message: "Company created successfully",
      company: resultTransaction.company,
    });
  } catch (error: any) {
    console.error(error);

    if (error?.code === "P2002") {
      return res.status(409).json({
        message: "Company name already exists",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
