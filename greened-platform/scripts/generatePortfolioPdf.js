#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

const outputPath = path.resolve(process.cwd(), 'portfolio-sample.pdf');

function generatePortfolioPdf({ name, points, badges, activities }) {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  doc.pipe(fs.createWriteStream(outputPath));

  doc.fontSize(22).text('GreenEd: Green Career Portfolio', { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`Student: ${name}`);
  doc.text(`Total Eco Points: ${points}`);

  doc.moveDown().fontSize(16).text('Badges');
  (badges || []).forEach((b) => {
    doc.fontSize(12).text(`- ${b.name}: ${b.description}`);
  });

  doc.moveDown().fontSize(16).text('Activities');
  (activities || []).forEach((a) => {
    doc.fontSize(12).text(`- ${a.title} (${a.points} pts) - ${a.date}`);
  });

  doc.end();
  return outputPath;
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const pdf = generatePortfolioPdf({
    name: 'Sample Student',
    points: 120,
    badges: [
      { name: 'Tree Planter', description: 'Planted 5 trees' },
      { name: 'Waste Warrior', description: 'Led a cleanup drive' },
    ],
    activities: [
      { title: 'Planted a neem sapling', points: 20, date: '2025-08-01' },
      { title: 'Segregated waste at school', points: 10, date: '2025-08-05' },
    ],
  });
  console.log(`Portfolio PDF generated at: ${pdf}`);
}

export default generatePortfolioPdf;

