import type { Request, Response } from "express";
import { db } from "../../prisma/db";

export default async function getMyCompanyDetails(req: Request, res: Response) {
  try {
    const { id: userId } = req.user;

    // 1. Find the logged-in user's company membership
    const companyMember = await db.companyMember.findFirst({
      where: {
        userId,
      },
      select: {
        userId: true,
        companyId: true,
        role: true,
      },
    });

    if (!companyMember) {
      return res.status(404).json({
        message: "You are not a member of any company",
      });
    }

    // 2. Find the company and its members
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
            user: {
              select: {
                email: true,
                profile: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    // 3. Prepare company details
    const companyDetails = {
      id: company.id,
      name: company.name,
      description: company.description,
      tags: company.tags,
    };

    // 4. Check the logged-in user's role
    const canViewAllMembers =
      companyMember.role === "OWNER" || companyMember.role === "ADMIN";

    // 5. Employees can only see their own member record
    if (!canViewAllMembers) {
      const currentMember = company.members.find(
        (member) => member.userId === userId,
      );

      return res.status(200).json({
        company: companyDetails,

        members: {
          owner: null,
          admins: [],
          employees:
            currentMember?.role === "EMPLOYEE"
              ? [
                  {
                    id: currentMember.userId,
                    userName: currentMember.user.profile?.name ?? null,
                    email: currentMember.user.email ?? null,
                  },
                ]
              : [],
        },
      });
    }

    // 6. OWNER and ADMIN can see all member groups
    const owner = company.members.find((member) => member.role === "OWNER");

    const admins = company.members.filter((member) => member.role === "ADMIN");

    const employees = company.members.filter(
      (member) => member.role === "EMPLOYEE",
    );

    // 7. Return the role-appropriate response
    return res.status(200).json({
      company: companyDetails,

      members: {
        owner: owner
          ? {
              id: owner.userId,
              userName: owner.user.profile?.name ?? null,
              email: owner.user.email ?? null,
            }
          : null,

        admins: admins.map((admin) => ({
          id: admin.userId,
          userName: admin.user.profile?.name ?? null,
          email: admin.user.email ?? null,
        })),

        employees: employees.map((employee) => ({
          id: employee.userId,
          userName: employee.user.profile?.name ?? null,
          email: employee.user.email ?? null,
        })),
      },
    });
  } catch (error) {
    console.error("getMyCompanyDetails error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
