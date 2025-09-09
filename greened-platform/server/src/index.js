import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

// Load environment from monorepo root if present
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envCandidates = [
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../.env'),
  path.resolve(__dirname, '../../../.env'),
];
for (const p of envCandidates) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
    break;
  }
}

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Ensure upload dir exists and static serve
const uploadDir = process.env.UPLOAD_DIR || path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname || '');
    cb(null, `${unique}${ext}`);
  },
});
export const upload = multer({ storage });

// Attach prisma to request
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// Routes
import authRouter from './routes/auth.js';
import modulesRouter from './routes/modules.js';
import challengesRouter from './routes/challenges.js';
import submissionsRouter from './routes/submissions.js';

app.use('/api/auth', authRouter);
app.use('/api/modules', modulesRouter);
app.use('/api/challenges', challengesRouter);
app.use('/api/submissions', submissionsRouter);

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 4000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

export default app;

