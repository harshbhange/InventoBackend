import { Router } from "express";
import authRouter from "./auth/index.route";
import { meRoute } from "./me/index.route";
import authMiddleware from "../middleware/auth.middleware";
import { companyRouter } from "./company/index.route";

const apiRouter = Router();
apiRouter.use("/api/auth", authRouter);
apiRouter.use(authMiddleware);
apiRouter.use("/api/auth/me", meRoute);
apiRouter.use("/api/auth/company", companyRouter);
export default apiRouter;
