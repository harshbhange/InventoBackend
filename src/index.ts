import type { Response, Request } from "express";
import express from "express";
import dotenv from "dotenv";
import apiRouter from "./route";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/", apiRouter);
app.get("/health", (req, res: Response) => {
  return res.status(200).json({
    message: "Server Running",
  });
});

const port = process.env.PORT ?? 5030;
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
