const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireRole } = require('./auth');

const router = express.Router();
const prisma = new PrismaClient();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, videos, and PDFs are allowed.'));
    }
  }
});

// Submit challenge response
router.post('/', authenticateToken, upload.single('file'), [
  body('challengeId').isUUID(),
  body('type').isIn(['TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT']),
  body('content').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { challengeId, type, content } = req.body;
    const userId = req.user.userId;

    // Check if challenge exists and is active
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId }
    });

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    if (!challenge.isActive) {
      return res.status(400).json({ error: 'Challenge is not active' });
    }

    // Validate submission type and content
    if (type === 'TEXT' && !content) {
      return res.status(400).json({ error: 'Text content is required for text submissions' });
    }

    if ((type === 'IMAGE' || type === 'VIDEO' || type === 'DOCUMENT') && !req.file) {
      return res.status(400).json({ error: 'File is required for this submission type' });
    }

    // Create file URL if file was uploaded
    let fileUrl = null;
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
    }

    // Create submission
    const submission = await prisma.submission.create({
      data: {
        userId,
        challengeId,
        type,
        content: type === 'TEXT' ? content : null,
        imageUrl: type === 'IMAGE' ? fileUrl : null,
        videoUrl: type === 'VIDEO' ? fileUrl : null,
        status: 'PENDING'
      }
    });

    // Start verification process in background
    if (type === 'IMAGE' && fileUrl) {
      // In a real implementation, this would call an AI service
      // For now, we'll simulate verification
      setTimeout(async () => {
        try {
          await verifyImageSubmission(submission.id);
        } catch (error) {
          console.error('Verification error:', error);
        }
      }, 5000);
    }

    res.status(201).json({
      message: 'Submission created successfully',
      submission
    });

  } catch (error) {
    console.error('Submission creation error:', error);
    res.status(500).json({ error: 'Failed to create submission' });
  }
});

// Get user's submissions
router.get('/my-submissions', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, challengeId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = { userId: req.user.userId };
    if (status) where.status = status;
    if (challengeId) where.challengeId = challengeId;

    const [submissions, total] = await Promise.all([
      prisma.submission.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          challenge: {
            select: {
              id: true,
              title: true,
              category: true,
              points: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.submission.count({ where })
    ]);

    res.json({
      submissions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('User submissions fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Get all submissions (Admin/Teacher only)
router.get('/', authenticateToken, requireRole(['ADMIN', 'TEACHER']), async (req, res) => {
  try {
    const { page = 1, limit = 10, status, challengeId, userId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (status) where.status = status;
    if (challengeId) where.challengeId = challengeId;
    if (userId) where.userId = userId;

    const [submissions, total] = await Promise.all([
      prisma.submission.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              school: true,
              grade: true
            }
          },
          challenge: {
            select: {
              id: true,
              title: true,
              category: true,
              points: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.submission.count({ where })
    ]);

    res.json({
      submissions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('All submissions fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Get single submission
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await prisma.submission.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            school: true,
            grade: true
          }
        },
        challenge: {
          select: {
            id: true,
            title: true,
            description: true,
            category: true,
            points: true,
            requirements: true
          }
        }
      }
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Check if user can view this submission
    if (submission.userId !== req.user.userId && 
        !['ADMIN', 'TEACHER'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Not authorized to view this submission' });
    }

    res.json({ submission });

  } catch (error) {
    console.error('Submission fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch submission' });
  }
});

// Update submission status (Admin/Teacher only)
router.put('/:id/status', authenticateToken, requireRole(['ADMIN', 'TEACHER']), [
  body('status').isIn(['PENDING', 'APPROVED', 'REJECTED', 'NEEDS_REVISION']),
  body('feedback').optional().trim(),
  body('points').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status, feedback, points } = req.body;

    // Check if submission exists
    const existingSubmission = await prisma.submission.findUnique({
      where: { id },
      include: { user: true, challenge: true }
    });

    if (!existingSubmission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    const updateData = { status, feedback };
    
    // If approved, award points
    if (status === 'APPROVED') {
      const pointsToAward = points || existingSubmission.challenge.points;
      updateData.points = pointsToAward;
      updateData.verifiedAt = new Date();

      // Update user points and level
      await updateUserPoints(existingSubmission.userId, pointsToAward);
    }

    const submission = await prisma.submission.update({
      where: { id },
      data: updateData
    });

    res.json({
      message: 'Submission status updated successfully',
      submission
    });

  } catch (error) {
    console.error('Submission update error:', error);
    res.status(500).json({ error: 'Failed to update submission' });
  }
});

// Delete submission (Admin only)
router.delete('/:id', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;

    // Check if submission exists
    const existingSubmission = await prisma.submission.findUnique({
      where: { id }
    });

    if (!existingSubmission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Delete associated file if exists
    if (existingSubmission.imageUrl || existingSubmission.videoUrl) {
      const filePath = existingSubmission.imageUrl || existingSubmission.videoUrl;
      try {
        await fs.unlink(`.${filePath}`);
      } catch (error) {
        console.error('File deletion error:', error);
      }
    }

    await prisma.submission.delete({
      where: { id }
    });

    res.json({ message: 'Submission deleted successfully' });

  } catch (error) {
    console.error('Submission deletion error:', error);
    res.status(500).json({ error: 'Failed to delete submission' });
  }
});

// Helper function to update user points and level
async function updateUserPoints(userId, points) {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) return;

  const newPoints = user.points + points;
  const newLevel = Math.floor(newPoints / 100) + 1; // Level up every 100 points

  await prisma.user.update({
    where: { id: userId },
    data: {
      points: newPoints,
      level: newLevel
    }
  });

  // Check for badge eligibility
  await checkBadgeEligibility(userId, newPoints, newLevel);
}

// Helper function to check badge eligibility
async function checkBadgeEligibility(userId, points, level) {
  const badges = await prisma.badge.findMany();
  
  for (const badge of badges) {
    const hasBadge = await prisma.userBadge.findUnique({
      where: {
        userId_badgeId: {
          userId,
          badgeId: badge.id
        }
      }
    });

    if (!hasBadge && points >= badge.points) {
      await prisma.userBadge.create({
        data: {
          userId,
          badgeId: badge.id
        }
      });
    }
  }
}

// Mock verification function for image submissions
async function verifyImageSubmission(submissionId) {
  // In a real implementation, this would use Google Vision API or similar
  // For now, we'll simulate verification with a random result
  
  const isVerified = Math.random() > 0.3; // 70% chance of approval
  
  await prisma.submission.update({
    where: { id: submissionId },
    data: {
      status: isVerified ? 'APPROVED' : 'REJECTED',
      feedback: isVerified 
        ? 'Image verified successfully! Great work on your environmental contribution.' 
        : 'Image could not be verified. Please ensure the image clearly shows your environmental activity.',
      verifiedAt: new Date()
    }
  });

  if (isVerified) {
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: { challenge: true, user: true }
    });

    if (submission) {
      await updateUserPoints(submission.userId, submission.challenge.points);
    }
  }
}

module.exports = router;