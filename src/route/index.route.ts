import { Router } from "express";
import authRouter from "./auth/index.route";
import { meRoute } from "./me/index.route";
import authMiddleware from "../middleware/auth.middleware";

const apiRouter = Router();
apiRouter.use("/api/auth", authRouter);
apiRouter.use("/api/auth/me", authMiddleware, meRoute);
export default apiRouter;
