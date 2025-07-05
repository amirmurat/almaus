const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/grades - получить все оценки
router.get('/', async (req, res) => {
  try {
    const { studentId, subjectId } = req.query;
    
    const where = {};
    if (studentId) where.studentId = studentId;
    if (subjectId) where.subjectId = subjectId;

    const grades = await prisma.grade.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            studentId: true
          }
        },
        subject: {
          select: {
            id: true,
            name: true
          }
        },
        gradeType: true
      },
      orderBy: {
        date: 'desc'
      }
    });

    res.json(grades);
  } catch (error) {
    console.error('Error fetching grades:', error);
    res.status(500).json({ error: 'Failed to fetch grades' });
  }
});

// GET /api/grades/:id - получить оценку по ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const grade = await prisma.grade.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            studentId: true
          }
        },
        subject: {
          select: {
            id: true,
            name: true
          }
        },
        gradeType: true
      }
    });

    if (!grade) {
      return res.status(404).json({ error: 'Grade not found' });
    }

    res.json(grade);
  } catch (error) {
    console.error('Error fetching grade:', error);
    res.status(500).json({ error: 'Failed to fetch grade' });
  }
});

// POST /api/grades - создать новую оценку
router.post('/', async (req, res) => {
  try {
    const { studentId, subjectId, gradeTypeId, value, maxValue, date } = req.body;

    if (!studentId || !subjectId || !gradeTypeId || !value || !date) {
      return res.status(400).json({ 
        error: 'Student ID, subject ID, grade type ID, value, and date are required' 
      });
    }

    const grade = await prisma.grade.create({
      data: {
        studentId,
        subjectId,
        gradeTypeId,
        value: parseInt(value),
        maxValue: parseInt(maxValue) || 100,
        date: new Date(date)
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            studentId: true
          }
        },
        subject: {
          select: {
            id: true,
            name: true
          }
        },
        gradeType: true
      }
    });

    res.status(201).json(grade);
  } catch (error) {
    console.error('Error creating grade:', error);
    res.status(500).json({ error: 'Failed to create grade' });
  }
});

// PUT /api/grades/:id - обновить оценку
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { value, maxValue, date } = req.body;

    const grade = await prisma.grade.update({
      where: { id },
      data: {
        value: value ? parseInt(value) : undefined,
        maxValue: maxValue ? parseInt(maxValue) : undefined,
        date: date ? new Date(date) : undefined
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            studentId: true
          }
        },
        subject: {
          select: {
            id: true,
            name: true
          }
        },
        gradeType: true
      }
    });

    res.json(grade);
  } catch (error) {
    console.error('Error updating grade:', error);
    res.status(500).json({ error: 'Failed to update grade' });
  }
});

// DELETE /api/grades/:id - удалить оценку
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.grade.delete({
      where: { id }
    });

    res.json({ message: 'Grade deleted successfully' });
  } catch (error) {
    console.error('Error deleting grade:', error);
    res.status(500).json({ error: 'Failed to delete grade' });
  }
});

// GET /api/grades/types - получить все типы оценок
router.get('/types/all', async (req, res) => {
  try {
    const gradeTypes = await prisma.gradeType.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    res.json(gradeTypes);
  } catch (error) {
    console.error('Error fetching grade types:', error);
    res.status(500).json({ error: 'Failed to fetch grade types' });
  }
});

// POST /api/grades/types - создать новый тип оценки
router.post('/types', async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ 
        error: 'Name is required' 
      });
    }

    const gradeType = await prisma.gradeType.create({
      data: {
        name,
        description: description || null
      }
    });

    res.status(201).json(gradeType);
  } catch (error) {
    console.error('Error creating grade type:', error);
    res.status(500).json({ error: 'Failed to create grade type' });
  }
});

module.exports = router; 