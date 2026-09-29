import type { Request, Response } from "express";
import { db } from "../../prisma/db";

export default async function getAllCompanies(_: Request, res: Response) {
  try {
    const companies = await db.company.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        tags: true,
        members: {
          where: {
            role: "OWNER",
          },
          select: {
            user: {
              select: {
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

    const result = companies.map((company) => ({
      id: company.id,
      name: company.name,
      description: company.description,
      tags: company.tags,
      ownerName: company.members[0]?.user.profile?.name ?? null,
    }));

    return res.status(200).json({
      companies: result,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
