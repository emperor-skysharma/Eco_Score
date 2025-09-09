import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();
const SALT_ROUNDS = 10;

router.post("/signup", async (req, res) => {
  const { prisma } = req;
  const { name, email, password, role = "STUDENT" } = req.body;
  try {
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({ data: { name, email, password: hashed, role } });
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (e) {
    res.status(400).json({ error: "User exists or invalid data" });
  }
});

router.post("/login", async (req, res) => {
  const { prisma } = req;
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET);
  res.json({ token });
});

export default router;