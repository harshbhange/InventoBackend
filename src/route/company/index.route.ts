import { Router } from "express";
import createCompany from "../../controllers/company/create-company.controller";
import checkIfCompanyNameExist from "../../controllers/company/check-company-name.controller";
import updateCompanyDetails from "../../controllers/company/update-company-details.controller";
import deleteCompany from "../../controllers/company/delete-company.controller";
import getMyCompanyDetails from "../../controllers/company/get-my-company.controller";

const companyRouter = Router();

companyRouter.get("/check-name", checkIfCompanyNameExist);
companyRouter.post("/create", createCompany);
companyRouter.patch("/update", updateCompanyDetails);
companyRouter.delete("/delete", deleteCompany);
companyRouter.get("/my/details", getMyCompanyDetails);

export { companyRouter };
