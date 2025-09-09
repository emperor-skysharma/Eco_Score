import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.quiz.create({
    data: {
      title: "Basics of Recycling",
      questions: {
        create: [
          { prompt: "What color bin is typically used for paper?", answer: "Blue" },
          { prompt: "What number inside triangle means PET plastic?", answer: "1" }
        ]
      }
    }
  });

  await prisma.challenge.createMany({
    data: [
      { title: "Plant a Tree", description: "Plant any sapling and upload photo", points: 20 },
      { title: "Clean Up Drive", description: "Collect litter in your neighborhood", points: 15 }
    ]
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());