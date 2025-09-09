const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireRole } = require('./auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all challenges with optional filtering
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, type, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = { isActive: true };
    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;
    if (type) where.type = type;

    const [challenges, total] = await Promise.all([
      prisma.challenge.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true
            }
          },
          submissions: {
            select: {
              id: true,
              status: true,
              points: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.challenge.count({ where })
    ]);

    // Parse requirements JSON for each challenge
    const challengesWithParsedRequirements = challenges.map(challenge => ({
      ...challenge,
      requirements: challenge.requirements ? JSON.parse(challenge.requirements) : null
    }));

    res.json({
      challenges: challengesWithParsedRequirements,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Challenges fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch challenges' });
  }
});

// Get single challenge by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const challenge = await prisma.challenge.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true
          }
        },
        submissions: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    if (!challenge.isActive) {
      return res.status(404).json({ error: 'Challenge is not available' });
    }

    res.json({
      challenge: {
        ...challenge,
        requirements: challenge.requirements ? JSON.parse(challenge.requirements) : null
      }
    });

  } catch (error) {
    console.error('Challenge fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch challenge' });
  }
});

// Create new challenge (Admin/Teacher only)
router.post('/', authenticateToken, requireRole(['ADMIN', 'TEACHER']), [
  body('title').trim().isLength({ min: 1 }),
  body('description').trim().isLength({ min: 1 }),
  body('category').isIn(['TREE_PLANTING', 'WASTE_SEGREGATION', 'ENERGY_CONSERVATION', 'WATER_SAVING', 'RECYCLING', 'COMPOSTING', 'CLEANUP_DRIVE']),
  body('difficulty').isIn(['EASY', 'MEDIUM', 'HARD']),
  body('type').isIn(['QUIZ', 'TASK', 'PROJECT', 'COMMUNITY']),
  body('points').isInt({ min: 1 }),
  body('requirements').optional().isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, category, difficulty, type, points, requirements } = req.body;

    const challenge = await prisma.challenge.create({
      data: {
        title,
        description,
        category,
        difficulty,
        type,
        points,
        requirements: requirements ? JSON.stringify(requirements) : null,
        createdBy: req.user.userId
      }
    });

    res.status(201).json({
      message: 'Challenge created successfully',
      challenge: {
        ...challenge,
        requirements: challenge.requirements ? JSON.parse(challenge.requirements) : null
      }
    });

  } catch (error) {
    console.error('Challenge creation error:', error);
    res.status(500).json({ error: 'Failed to create challenge' });
  }
});

// Update challenge (Admin/Teacher only)
router.put('/:id', authenticateToken, requireRole(['ADMIN', 'TEACHER']), [
  body('title').optional().trim().isLength({ min: 1 }),
  body('description').optional().trim().isLength({ min: 1 }),
  body('category').optional().isIn(['TREE_PLANTING', 'WASTE_SEGREGATION', 'ENERGY_CONSERVATION', 'WATER_SAVING', 'RECYCLING', 'COMPOSTING', 'CLEANUP_DRIVE']),
  body('difficulty').optional().isIn(['EASY', 'MEDIUM', 'HARD']),
  body('type').optional().isIn(['QUIZ', 'TASK', 'PROJECT', 'COMMUNITY']),
  body('points').optional().isInt({ min: 1 }),
  body('requirements').optional().isObject(),
  body('isActive').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = { ...req.body };

    // Check if challenge exists
    const existingChallenge = await prisma.challenge.findUnique({
      where: { id }
    });

    if (!existingChallenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    // Check if user is the creator or admin
    if (existingChallenge.createdBy !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to update this challenge' });
    }

    // Convert requirements to JSON string if provided
    if (updateData.requirements) {
      updateData.requirements = JSON.stringify(updateData.requirements);
    }

    const challenge = await prisma.challenge.update({
      where: { id },
      data: updateData
    });

    res.json({
      message: 'Challenge updated successfully',
      challenge: {
        ...challenge,
        requirements: challenge.requirements ? JSON.parse(challenge.requirements) : null
      }
    });

  } catch (error) {
    console.error('Challenge update error:', error);
    res.status(500).json({ error: 'Failed to update challenge' });
  }
});

// Delete challenge (Admin only)
router.delete('/:id', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;

    // Check if challenge exists
    const existingChallenge = await prisma.challenge.findUnique({
      where: { id }
    });

    if (!existingChallenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    // Soft delete by setting isActive to false
    await prisma.challenge.update({
      where: { id },
      data: { isActive: false }
    });

    res.json({ message: 'Challenge deleted successfully' });

  } catch (error) {
    console.error('Challenge deletion error:', error);
    res.status(500).json({ error: 'Failed to delete challenge' });
  }
});

// Get challenge categories
router.get('/categories/list', (req, res) => {
  const categories = [
    { value: 'TREE_PLANTING', label: 'Tree Planting' },
    { value: 'WASTE_SEGREGATION', label: 'Waste Segregation' },
    { value: 'ENERGY_CONSERVATION', label: 'Energy Conservation' },
    { value: 'WATER_SAVING', label: 'Water Saving' },
    { value: 'RECYCLING', label: 'Recycling' },
    { value: 'COMPOSTING', label: 'Composting' },
    { value: 'CLEANUP_DRIVE', label: 'Cleanup Drive' }
  ];

  res.json({ categories });
});

// Get challenge types
router.get('/types/list', (req, res) => {
  const types = [
    { value: 'QUIZ', label: 'Quiz' },
    { value: 'TASK', label: 'Task' },
    { value: 'PROJECT', label: 'Project' },
    { value: 'COMMUNITY', label: 'Community' }
  ];

  res.json({ types });
});

// Get user's challenge submissions
router.get('/:id/submissions', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Check if challenge exists
    const challenge = await prisma.challenge.findUnique({
      where: { id }
    });

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const [submissions, total] = await Promise.all([
      prisma.submission.findMany({
        where: {
          challengeId: id,
          userId: req.user.userId
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.submission.count({
        where: {
          challengeId: id,
          userId: req.user.userId
        }
      })
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

module.exports = router;