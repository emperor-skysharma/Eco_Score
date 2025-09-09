import { Router } from "express";

const router = Router();

router.get("/quizzes", async (req, res) => {
  const { prisma } = req;
  const quizzes = await prisma.quiz.findMany({ include: { questions: true } });
  res.json(quizzes);
});

export default router;