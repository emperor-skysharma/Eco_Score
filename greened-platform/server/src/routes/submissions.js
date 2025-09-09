import express from 'express';
import { authMiddleware } from './auth.js';
import { upload } from '../index.js';
import { verifySubmission } from '../workers/verifySubmission.js';
import { awardPointsAndBadges } from '../gamification.js';

const router = express.Router();

router.post('/', authMiddleware(['STUDENT', 'TEACHER', 'ADMIN']), upload.single('image'), async (req, res) => {
  const prisma = req.prisma;
  try {
    const { challengeId } = req.body;
    if (!challengeId) return res.status(400).json({ error: 'challengeId is required' });
    if (!req.file) return res.status(400).json({ error: 'image file is required' });

    const challenge = await prisma.challenge.findUnique({ where: { id: Number(challengeId) } });
    if (!challenge) return res.status(404).json({ error: 'Challenge not found' });

    const submission = await prisma.submission.create({
      data: {
        userId: req.user.id,
        challengeId: challenge.id,
        imageUrl: `/uploads/${req.file.filename}`,
        status: 'PENDING',
      },
    });

    // Mock verification
    const verdict = await verifySubmission({ submission, challenge });
    let updated = submission;
    if (verdict.approved) {
      updated = await prisma.submission.update({
        where: { id: submission.id },
        data: { status: 'APPROVED', notes: verdict.notes || '', confidence: verdict.confidence || 0.9, pointsAwarded: challenge.points },
      });
      await awardPointsAndBadges(prisma, req.user.id, challenge.points);
    } else {
      updated = await prisma.submission.update({
        where: { id: submission.id },
        data: { status: 'REJECTED', notes: verdict.notes || '', confidence: verdict.confidence || 0.2 },
      });
    }

    res.json({ submission: updated, verdict });
  } catch (err) {
    res.status(500).json({ error: 'Submission failed', details: String(err) });
  }
});

router.get('/', authMiddleware(), async (req, res) => {
  const prisma = req.prisma;
  const subs = await prisma.submission.findMany({ where: { userId: req.user.id }, orderBy: { createdAt: 'desc' } });
  res.json({ submissions: subs });
});

// Teacher approval endpoint (manual override)
router.post('/:id/approve', authMiddleware(['TEACHER', 'ADMIN']), async (req, res) => {
  const prisma = req.prisma;
  const sub = await prisma.submission.update({ where: { id: Number(req.params.id) }, data: { status: 'APPROVED' } });
  if (sub.pointsAwarded && sub.userId) {
    await awardPointsAndBadges(prisma, sub.userId, sub.pointsAwarded);
  }
  res.json({ submission: sub });
});

export default router;

