import { Router } from "express";
import registerUser from "../../controllers/auth/register.controller";
import loginUser from "../../controllers/auth/login.controller";
import logoutUser from "../../controllers/auth/logout.controller";

const authRouter = Router();

authRouter.post("/credentials/register", registerUser);
authRouter.post("/credentials/login", loginUser);
authRouter.post("/credentials/logout", logoutUser);

export default authRouter;
