import { Router } from "express";
import authRouter from "./auth/index.route";
import { meRoute } from "./me/index.route";

const apiRouter = Router();
apiRouter.use("/api/auth", authRouter);
apiRouter.use("/api/auth/me", meRoute);
export default apiRouter;
