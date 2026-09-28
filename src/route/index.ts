import { Router } from "express";
import authRouter from "./auth/index.route";

const apiRouter = Router();
apiRouter.use("/api/auth", authRouter);
export default apiRouter;
