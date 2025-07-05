const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { getCurrentSemester } = require('../utils/semesterUtils');
const router = express.Router();
const prisma = new PrismaClient();

// Получить расписание для группы на текущий семестр
router.get('/:groupName', async (req, res) => {
  try {
    const { groupName } = req.params;
    // Получаем текущий семестр (номер)
    // Для примера берём первого студента этой группы
    const student = await prisma.student.findFirst({ where: { groupName } });
    if (!student) return res.status(404).json({ error: 'Группа не найдена' });
    const currentSemester = await getCurrentSemester(student.id);

    // Получаем расписание только за текущий семестр
    const schedule = await prisma.schedule.findMany({
      where: {
        groupName,
        subject: { semester: currentSemester }
      },
      include: {
        subject: {
          select: { name: true }
        },
        teacher: {
          select: { name: true }
        }
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    });

    // Формируем ответ
    const result = schedule.map(lesson => ({
      id: lesson.id,
      subject: lesson.subject?.name || '',
      teacher: lesson.teacher?.name || '',
      dayOfWeek: lesson.dayOfWeek,
      startTime: lesson.startTime,
      endTime: lesson.endTime,
      room: lesson.room,
      lessonType: lesson.lessonType,
      date: lesson.date ? lesson.date.toISOString().slice(0, 10) : null
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching schedule:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router; 