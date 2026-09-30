import { Router } from "express";
import getCompanyMembers from "../../controllers/company-members/get-company-members.controller";
import updateMemberRole from "../../controllers/company-members/update-member-role.controller";
import removeCompanyMember from "../../controllers/company-members/remove-company-member.controller";

const memberRoute = Router();

memberRoute.get("/all", getCompanyMembers);
memberRoute.patch("/update/role", updateMemberRole);
memberRoute.delete("/delete", removeCompanyMember); // under testing

export { memberRoute };
