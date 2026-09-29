import { Router } from "express";
import createCompany from "../../controllers/company/create-company.controller";
import checkIfCompanyNameExist from "../../controllers/company/check-company-name.controller";
import updateCompanyDetails from "../../controllers/company/update-company-details.controller";
import deleteCompany from "../../controllers/company/delete-company.controller";
import getMyCompanyDetails from "../../controllers/company/get-my-company.controller";
import getCompanyJoinRequests from "../../controllers/company/get-company-join-request.controller";
import requestToJoinCompany from "../../controllers/company/request-join-company.controller";
import acceptCompanyJoinRequest from "../../controllers/company/accept-company-join-request.controller";
import getAllCompanies from "../../controllers/company/get-all-company.controller";
import rejectCompanyJoinRequest from "../../controllers/company/reject-company-join-request.controller";

const companyRouter = Router();

companyRouter.get("/check-name", checkIfCompanyNameExist);
companyRouter.post("/create", createCompany);
companyRouter.patch("/update", updateCompanyDetails);
companyRouter.delete("/delete", deleteCompany);
companyRouter.get("/my/details", getMyCompanyDetails);
companyRouter.get("/all", getAllCompanies);

companyRouter.post("/request/join", requestToJoinCompany);
companyRouter.get("/request/join/get", getCompanyJoinRequests);
companyRouter.patch("/request/join/accept", acceptCompanyJoinRequest);
companyRouter.patch("/request/join/reject", rejectCompanyJoinRequest);

export { companyRouter };
