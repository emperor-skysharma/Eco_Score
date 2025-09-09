import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@greened.local' },
    update: {},
    create: { name: 'Admin', email: 'admin@greened.local', passwordHash, role: 'ADMIN' },
  });
  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@greened.local' },
    update: {},
    create: { name: 'Teacher', email: 'teacher@greened.local', passwordHash, role: 'TEACHER' },
  });
  const student = await prisma.user.upsert({
    where: { email: 'student@greened.local' },
    update: {},
    create: { name: 'Student', email: 'student@greened.local', passwordHash, role: 'STUDENT' },
  });

  const module = await prisma.module.upsert({
    where: { id: 1 },
    update: {},
    create: { title: 'Sustainability Basics', summary: 'Learn the fundamentals of sustainability.' },
  });

  await prisma.lesson.createMany({
    data: [
      { title: 'What is Sustainability?', content: 'Sustainability means meeting our needs without compromising future generations.', moduleId: module.id },
      { title: 'Reduce, Reuse, Recycle', content: 'Waste management principles for sustainable living.', moduleId: module.id },
    ],
    skipDuplicates: true,
  });

  const quiz = await prisma.quiz.create({ data: { title: 'Basics Quiz', moduleId: module.id } });
  await prisma.quizQuestion.createMany({
    data: [
      { question: 'Which is NOT an R of waste management?', options: JSON.stringify(['Reduce', 'Reuse', 'Recycle', 'React']), answer: 3, quizId: quiz.id },
      { question: 'Sustainability aims to balance?', options: JSON.stringify(['Economy', 'Environment', 'Society', 'All of the above']), answer: 3, quizId: quiz.id },
    ],
  });

  await prisma.challenge.createMany({
    data: [
      { title: 'Plant a Tree', description: 'Plant a sapling and upload a photo', points: 20 },
      { title: 'Segregate Waste', description: 'Segregate waste at home/school', points: 10 },
    ],
    skipDuplicates: true,
  });

  console.log('Seed complete:', { admin: admin.email, teacher: teacher.email, student: student.email });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});

