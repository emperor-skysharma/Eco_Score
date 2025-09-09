import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

function signToken(user) {
  const payload = { id: user.id, role: user.role, name: user.name };
  return jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
}

router.post('/register', async (req, res) => {
  const prisma = req.prisma;
  try {
    const { name, email, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name: name || 'Student', email, passwordHash: hash, role: role || 'STUDENT' },
      select: { id: true, name: true, email: true, role: true, ecoPoints: true },
    });
    const token = signToken(user);
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', details: String(err) });
  }
});

router.post('/login', async (req, res) => {
  const prisma = req.prisma;
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const publicUser = { id: user.id, name: user.name, email: user.email, role: user.role, ecoPoints: user.ecoPoints };
    const token = signToken(publicUser);
    res.json({ user: publicUser, token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: String(err) });
  }
});

export function authMiddleware(requiredRoles = []) {
  return (req, res, next) => {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing token' });
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
      req.user = payload;
      if (requiredRoles.length && !requiredRoles.includes(payload.role)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      next();
    } catch (e) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };
}

export default router;

