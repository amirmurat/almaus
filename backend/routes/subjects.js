const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/subjects - получить все предметы
router.get('/', async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany({
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            department: true
          }
        },
        grades: {
          include: {
            gradeType: true
          },
          orderBy: {
            date: 'desc'
          }
        },
        _count: {
          select: {
            grades: true,
            assignments: true,
            schedules: true,
            files: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    res.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

// GET /api/subjects/:id - получить предмет по ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const subject = await prisma.subject.findUnique({
      where: { id },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
            phone: true
          }
        },
        grades: {
          include: {
            gradeType: true
          },
          orderBy: {
            date: 'desc'
          }
        },
        assignments: {
          orderBy: {
            dueDate: 'asc'
          }
        },
        schedules: {
          orderBy: [
            { dayOfWeek: 'asc' },
            { startTime: 'asc' }
          ]
        },
        files: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        notes: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        statistics: {
          orderBy: {
            updatedAt: 'desc'
          },
          take: 1
        }
      }
    });

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    res.json(subject);
  } catch (error) {
    console.error('Error fetching subject:', error);
    res.status(500).json({ error: 'Failed to fetch subject' });
  }
});

// POST /api/subjects - создать новый предмет
router.post('/', async (req, res) => {
  try {
    const { 
      name, 
      credits, 
      semester, 
      teacherId, 
      description,
      sredniyTek1,
      sredniyTek2,
      rk1,
      rk2,
      exam
    } = req.body;

    if (!name || !credits || !semester) {
      return res.status(400).json({ 
        error: 'Name, credits, and semester are required' 
      });
    }

    const subject = await prisma.subject.create({
      data: {
        name,
        credits: parseInt(credits),
        semester: parseInt(semester),
        teacherId: teacherId || null,
        description: description || null,
        sredniyTek1: sredniyTek1 ? parseInt(sredniyTek1) : null,
        sredniyTek2: sredniyTek2 ? parseInt(sredniyTek2) : null,
        rk1: rk1 ? parseInt(rk1) : null,
        rk2: rk2 ? parseInt(rk2) : null,
        exam: exam ? parseInt(exam) : null
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            department: true
          }
        }
      }
    });

    res.status(201).json(subject);
  } catch (error) {
    console.error('Error creating subject:', error);
    res.status(500).json({ error: 'Failed to create subject' });
  }
});

// PUT /api/subjects/:id - обновить предмет
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      credits, 
      semester, 
      teacherId, 
      description,
      sredniyTek1,
      sredniyTek2,
      rk1,
      rk2,
      exam
    } = req.body;

    const subject = await prisma.subject.update({
      where: { id },
      data: {
        name: name || undefined,
        credits: credits ? parseInt(credits) : undefined,
        semester: semester ? parseInt(semester) : undefined,
        teacherId: teacherId || null,
        description: description || null,
        sredniyTek1: sredniyTek1 ? parseInt(sredniyTek1) : undefined,
        sredniyTek2: sredniyTek2 ? parseInt(sredniyTek2) : undefined,
        rk1: rk1 ? parseInt(rk1) : undefined,
        rk2: rk2 ? parseInt(rk2) : undefined,
        exam: exam ? parseInt(exam) : undefined
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            department: true
          }
        }
      }
    });

    res.json(subject);
  } catch (error) {
    console.error('Error updating subject:', error);
    res.status(500).json({ error: 'Failed to update subject' });
  }
});

// DELETE /api/subjects/:id - удалить предмет
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.subject.delete({
      where: { id }
    });

    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    console.error('Error deleting subject:', error);
    res.status(500).json({ error: 'Failed to delete subject' });
  }
});

module.exports = router; 