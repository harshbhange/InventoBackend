import type { Request, Response } from "express";
import { db } from "../../prisma/db";
export default async function requestToJoinCompany(
  req: Request,
  res: Response,
) {
  try {
    const { id: userId } = req.user;
    const { companyId } = req.query;
    if (typeof companyId !== "string" || !companyId.trim()) {
      return res.status(400).json({ message: "Company ID is required" });
    }
    // Check if company exists
    const company = await db.company.findUnique({ where: { id: companyId } });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    // Check if user already belongs to a company
    const existingMember = await db.companyMember.findFirst({
      where: { userId },
    });
    if (existingMember) {
      return res
        .status(409)
        .json({ message: "You already belong to a company" });
    } // Check if request already exists
    const existingRequest = await db.companyJoinRequest.findUnique({
      where: { companyId_userId: { companyId, userId } },
    });
    if (existingRequest) {
      return res
        .status(409)
        .json({
          message: "You have already requested to join this company",
          status: existingRequest.status,
        });
    } // Create join request
    const joinRequest = await db.companyJoinRequest.create({
      data: { userId, companyId },
    });
    return res
      .status(201)
      .json({
        message: "Join request sent successfully",
        request: joinRequest,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
