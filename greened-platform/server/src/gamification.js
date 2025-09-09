export async function awardPointsAndBadges(prisma, userId, points) {
  // Update user points
  const user = await prisma.user.update({
    where: { id: userId },
    data: { ecoPoints: { increment: Number(points) || 0 } },
  });

  // Award badges based on thresholds
  const thresholds = [
    { points: 50, badge: { name: 'Eco Starter', description: 'Reached 50 eco points' } },
    { points: 100, badge: { name: 'Green Champion', description: 'Reached 100 eco points' } },
    { points: 200, badge: { name: 'Planet Guardian', description: 'Reached 200 eco points' } },
  ];

  for (const t of thresholds) {
    if (user.ecoPoints >= t.points) {
      const exists = await prisma.badge.findFirst({ where: { name: t.badge.name } });
      const badge = exists || (await prisma.badge.create({ data: t.badge }));
      const already = await prisma.userBadge.findFirst({ where: { userId, badgeId: badge.id } });
      if (!already) {
        await prisma.userBadge.create({ data: { userId, badgeId: badge.id } });
      }
    }
  }
  return user;
}

