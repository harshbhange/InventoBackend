import type { Response, Request } from "express";
import express from "express";
import dotenv from "dotenv";
import apiRouter from "./route/index.route";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/", apiRouter);
app.get("/health", (_, res: Response) => {
  return res.status(200).json({
    message: "Server Running",
  });
});
app.use((req: Request, res: Response) => {
  return res.status(404).json({
    message: "Unidentified API Route",
    method: req.method,
    path: req.originalUrl,
  });
});

const port = process.env.PORT ?? 5030;
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
