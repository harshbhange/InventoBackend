import { Router } from "express";
import authRouter from "./auth/index.route";
import { meRoute } from "./me/index.route";
import authMiddleware from "../middleware/auth.middleware";
import { companyRouter } from "./company/index.route";
import { memberRoute } from "./company-member/index.route";
import { productRoute } from "./product/index.route";

const apiRouter = Router();
apiRouter.use("/api/auth", authRouter);
apiRouter.use(authMiddleware);
apiRouter.use("/api/auth/me", meRoute);
apiRouter.use("/api/auth/company", companyRouter);
apiRouter.use("/api/auth/company/member", memberRoute);
apiRouter.use("/api/auth/company/products", productRoute);
export default apiRouter;
