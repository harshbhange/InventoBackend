import type { Request, Response } from "express";
import { db } from "../../prisma/db";

export default async function getMyCompanyDetails(req: Request, res: Response) {
  try {
    const { id: userId } = req.user;

    const companyMember = await db.companyMember.findFirst({
      where: {
        userId,
      },
    });

    if (!companyMember) {
      return res.status(404).json({
        message: "You are not a member of any company",
      });
    }

    const company = await db.company.findUnique({
      where: {
        id: companyMember.companyId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        tags: true,

        members: {
          select: {
            id: true,
            userId: true,
            role: true,
          },
        },
      },
    });

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    const owner = company.members.find((member) => member.role === "OWNER");

    const admins = company.members.filter((member) => member.role === "ADMIN");

    const employees = company.members.filter(
      (member) => member.role === "EMPLOYEE",
    );

    return res.status(200).json({
      company: {
        id: company.id,
        name: company.name,
        description: company.description,
        tags: company.tags,
      },

      members: {
        owner: owner
          ? {
              id: owner.userId,
            }
          : null,

        admins: admins.map((admin) => ({
          id: admin.userId,
        })),

        employees: employees.map((employee) => ({
          id: employee.userId,
        })),
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
