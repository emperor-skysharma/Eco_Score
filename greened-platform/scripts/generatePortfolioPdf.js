import PDFDocument from "pdfkit";
import fs from "fs";

export async function generatePortfolio(user, filePath = "portfolio.pdf") {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));
  doc.fontSize(20).text(`Green Portfolio - ${user.name}`, { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Total Eco Points: ${user.points}`);
  if (user.badges?.length) {
    doc.text("Badges:");
    user.badges.forEach((b) => doc.text(`• ${b.name}`));
  }
  doc.end();
  return filePath;
}