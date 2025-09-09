// Mock verification worker. Replace with real Vision/Plant APIs later.
export async function verifySubmission({ submission, challenge }) {
  const filename = submission.imageUrl || '';
  const lower = filename.toLowerCase();
  const hints = ['tree', 'sapling', 'plant', 'waste', 'bin', 'cleanup'];
  const approved = hints.some((h) => lower.includes(h));
  return {
    approved,
    confidence: approved ? 0.9 : 0.4,
    notes: approved ? 'Likely valid eco-task' : 'Image may not match task criteria',
  };
}

