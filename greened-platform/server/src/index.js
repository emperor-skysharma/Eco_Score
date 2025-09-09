import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

import authRouter from "./routes/auth.js";
import modulesRouter from "./routes/modules.js";
import challengesRouter from "./routes/challenges.js";
import submissionsRouter from "./routes/submissions.js";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// inject prisma into request for convenience
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

app.get("/", (_req, res) => {
  res.json({ message: "GreenED API up" });
});

app.use("/auth", authRouter);
app.use("/modules", modulesRouter);
app.use("/challenges", challengesRouter);
app.use("/submissions", submissionsRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on :${PORT}`));