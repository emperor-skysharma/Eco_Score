import { PrismaClient } from '@prisma/client';
import { awardPointsAndBadges } from '../src/gamification.js';

const prisma = new PrismaClient();

describe('Gamification', () => {
  it('awards points and badges at thresholds', async () => {
    const user = await prisma.user.create({ data: { name: 'T', email: `t${Date.now()}@t.t`, passwordHash: 'x' } });
    await awardPointsAndBadges(prisma, user.id, 120);
    const updated = await prisma.user.findUnique({ where: { id: user.id } });
    expect(updated.ecoPoints).toBeGreaterThanOrEqual(120);
  });
});

