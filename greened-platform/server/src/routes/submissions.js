import { Router } from "express";
import multer from "multer";
import { v4 as uuid } from "uuid";

const upload = multer({ dest: "uploads/" });
const router = Router();

router.post("/", upload.single("evidence"), async (req, res) => {
  const { prisma } = req;
  const { challengeId } = req.body;
  const submission = await prisma.submission.create({
    data: {
      userId: req.userId ?? 1, // TODO: replace with auth middleware
      challengeId: parseInt(challengeId, 10),
      evidencePath: req.file.path,
      status: "PENDING"
    }
  });
  // enqueue mock verification (here we just simulate success)
  setTimeout(async () => {
    await prisma.submission.update({ where: { id: submission.id }, data: { status: "APPROVED" } });
    // award points
    const challenge = await prisma.challenge.findUnique({ where: { id: submission.challengeId } });
    await prisma.user.update({
      where: { id: submission.userId },
      data: { points: { increment: challenge.points } }
    });
  }, 1000);
  res.json({ id: submission.id, status: "PENDING" });
});

export default router;