import express from 'express';
import { authMiddleware } from './auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const prisma = req.prisma;
  const modules = await prisma.module.findMany({
    include: {
      lessons: true,
      quizzes: {
        include: { questions: true },
      },
    },
  });
  res.json({ modules });
});

router.get('/quizzes/:id', authMiddleware(), async (req, res) => {
  const prisma = req.prisma;
  const quiz = await prisma.quiz.findUnique({
    where: { id: Number(req.params.id) },
    include: { questions: true },
  });
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
  res.json({ quiz });
});

export default router;

