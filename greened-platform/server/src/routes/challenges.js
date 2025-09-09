import express from 'express';
import { authMiddleware } from './auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const prisma = req.prisma;
  const challenges = await prisma.challenge.findMany();
  res.json({ challenges });
});

router.get('/leaderboard', async (req, res) => {
  const prisma = req.prisma;
  const users = await prisma.user.findMany({
    orderBy: { ecoPoints: 'desc' },
    select: { id: true, name: true, ecoPoints: true },
    take: 20,
  });
  res.json({ leaderboard: users });
});

// Example teacher-only create challenge
router.post('/', authMiddleware(['TEACHER', 'ADMIN']), async (req, res) => {
  const prisma = req.prisma;
  const { title, description, points } = req.body;
  const challenge = await prisma.challenge.create({ data: { title, description, points: points || 10 } });
  res.json({ challenge });
});

export default router;

