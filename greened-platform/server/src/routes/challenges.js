import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  const challenges = await req.prisma.challenge.findMany();
  res.json(challenges);
});

export default router;