import { Router } from "express";
import registerUser from "../../controllers/auth/register.controller";

const authRouter = Router();

authRouter.post("/credentials/register", registerUser);

export default authRouter;
