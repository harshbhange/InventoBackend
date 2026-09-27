import express from "express";
import dotenv from "dotenv";
const app = express();
dotenv.config();
app.use(express.json());

const port = process.env.PORT ?? 5030;

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
