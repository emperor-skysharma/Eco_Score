const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireRole } = require('./auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all modules with optional filtering
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = { isActive: true };
    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;

    const [modules, total] = await Promise.all([
      prisma.module.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          quizzes: {
            select: {
              id: true,
              question: true,
              options: true,
              points: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.module.count({ where })
    ]);

    res.json({
      modules,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Modules fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch modules' });
  }
});

// Get single module by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const module = await prisma.module.findUnique({
      where: { id },
      include: {
        quizzes: {
          select: {
            id: true,
            question: true,
            options: true,
            points: true
          }
        }
      }
    });

    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    if (!module.isActive) {
      return res.status(404).json({ error: 'Module is not available' });
    }

    res.json({ module });

  } catch (error) {
    console.error('Module fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch module' });
  }
});

// Create new module (Admin/Teacher only)
router.post('/', authenticateToken, requireRole(['ADMIN', 'TEACHER']), [
  body('title').trim().isLength({ min: 1 }),
  body('description').trim().isLength({ min: 1 }),
  body('content').trim().isLength({ min: 1 }),
  body('category').isIn(['CLIMATE_CHANGE', 'RENEWABLE_ENERGY', 'WASTE_MANAGEMENT', 'BIODIVERSITY', 'WATER_CONSERVATION', 'SUSTAINABLE_LIVING']),
  body('difficulty').isIn(['EASY', 'MEDIUM', 'HARD']),
  body('points').isInt({ min: 1 }),
  body('duration').isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, content, category, difficulty, points, duration } = req.body;

    const module = await prisma.module.create({
      data: {
        title,
        description,
        content,
        category,
        difficulty,
        points,
        duration
      }
    });

    res.status(201).json({
      message: 'Module created successfully',
      module
    });

  } catch (error) {
    console.error('Module creation error:', error);
    res.status(500).json({ error: 'Failed to create module' });
  }
});

// Update module (Admin/Teacher only)
router.put('/:id', authenticateToken, requireRole(['ADMIN', 'TEACHER']), [
  body('title').optional().trim().isLength({ min: 1 }),
  body('description').optional().trim().isLength({ min: 1 }),
  body('content').optional().trim().isLength({ min: 1 }),
  body('category').optional().isIn(['CLIMATE_CHANGE', 'RENEWABLE_ENERGY', 'WASTE_MANAGEMENT', 'BIODIVERSITY', 'WATER_CONSERVATION', 'SUSTAINABLE_LIVING']),
  body('difficulty').optional().isIn(['EASY', 'MEDIUM', 'HARD']),
  body('points').optional().isInt({ min: 1 }),
  body('duration').optional().isInt({ min: 1 }),
  body('isActive').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Check if module exists
    const existingModule = await prisma.module.findUnique({
      where: { id }
    });

    if (!existingModule) {
      return res.status(404).json({ error: 'Module not found' });
    }

    const module = await prisma.module.update({
      where: { id },
      data: updateData
    });

    res.json({
      message: 'Module updated successfully',
      module
    });

  } catch (error) {
    console.error('Module update error:', error);
    res.status(500).json({ error: 'Failed to update module' });
  }
});

// Delete module (Admin only)
router.delete('/:id', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;

    // Check if module exists
    const existingModule = await prisma.module.findUnique({
      where: { id }
    });

    if (!existingModule) {
      return res.status(404).json({ error: 'Module not found' });
    }

    // Soft delete by setting isActive to false
    await prisma.module.update({
      where: { id },
      data: { isActive: false }
    });

    res.json({ message: 'Module deleted successfully' });

  } catch (error) {
    console.error('Module deletion error:', error);
    res.status(500).json({ error: 'Failed to delete module' });
  }
});

// Add quiz to module (Admin/Teacher only)
router.post('/:id/quizzes', authenticateToken, requireRole(['ADMIN', 'TEACHER']), [
  body('question').trim().isLength({ min: 1 }),
  body('options').isArray({ min: 2, max: 6 }),
  body('correct').isInt({ min: 0 }),
  body('points').isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { question, options, correct, points } = req.body;

    // Validate correct answer index
    if (correct >= options.length) {
      return res.status(400).json({ error: 'Correct answer index is out of range' });
    }

    // Check if module exists
    const module = await prisma.module.findUnique({
      where: { id }
    });

    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    const quiz = await prisma.quiz.create({
      data: {
        moduleId: id,
        question,
        options: JSON.stringify(options),
        correct,
        points
      }
    });

    res.status(201).json({
      message: 'Quiz added successfully',
      quiz: {
        ...quiz,
        options: JSON.parse(quiz.options)
      }
    });

  } catch (error) {
    console.error('Quiz creation error:', error);
    res.status(500).json({ error: 'Failed to create quiz' });
  }
});

// Get module categories
router.get('/categories/list', (req, res) => {
  const categories = [
    { value: 'CLIMATE_CHANGE', label: 'Climate Change' },
    { value: 'RENEWABLE_ENERGY', label: 'Renewable Energy' },
    { value: 'WASTE_MANAGEMENT', label: 'Waste Management' },
    { value: 'BIODIVERSITY', label: 'Biodiversity' },
    { value: 'WATER_CONSERVATION', label: 'Water Conservation' },
    { value: 'SUSTAINABLE_LIVING', label: 'Sustainable Living' }
  ];

  res.json({ categories });
});

// Get difficulty levels
router.get('/difficulties/list', (req, res) => {
  const difficulties = [
    { value: 'EASY', label: 'Easy' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HARD', label: 'Hard' }
  ];

  res.json({ difficulties });
});

module.exports = router;