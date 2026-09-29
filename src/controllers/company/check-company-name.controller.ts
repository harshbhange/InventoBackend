import type { Response, Request } from "express";
import { db } from "../../prisma/db";

export default async function checkIfCompanyNameExist(
  req: Request,
  res: Response,
) {
  try {
    const companyName = req.query.companyName;

    if (typeof companyName !== "string" || !companyName.trim()) {
      return res.status(400).json({
        message: "Company name is required",
      });
    }

    const existingCompany = await db.company.findUnique({
      where: {
        name: companyName.trim(),
      },
    });
    if (!existingCompany) {
      return res.status(200).json({
        isNameAvailable: true,
        message: "Company Name Available",
      });
    }

    return res.status(409).json({
      isNameAvailable: false,
      message: "Company Name Unavailable",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
