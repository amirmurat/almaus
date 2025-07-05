const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { getCurrentSemester, getAvailableSemesters, getCourseInfo } = require('../utils/semesterUtils');
const router = express.Router();
const prisma = new PrismaClient();

// Получить профиль студента по ID
router.get('/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Получаем данные студента
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        grades: {
          include: {
            subject: true,
            gradeType: true
          }
        },
        statistics: {
          include: {
            subject: true
          }
        }
      }
    });

    if (!student) {
      return res.status(404).json({ error: 'Студент не найден' });
    }

    // Получаем текущий семестр студента
    const currentSemester = await getCurrentSemester(studentId);
    const availableSemesters = await getAvailableSemesters(studentId);
    const courseInfo = getCourseInfo(currentSemester);

    // Фильтруем оценки только по доступным семестрам
    const availableGrades = student.grades.filter(grade => 
      availableSemesters.includes(grade.subject.semester)
    );

    // Рассчитываем GPA по семестрам
    const semesterGPA = {};
    const totalGrades = [];
    
    availableGrades.forEach(grade => {
      const semester = grade.subject.semester;
      const gradeValue = grade.value;
      const maxValue = grade.maxValue;
      
      // Конвертируем в 4.0 шкалу
      const gpaValue = (gradeValue / maxValue) * 4.0;
      
      if (!semesterGPA[semester]) {
        semesterGPA[semester] = { total: 0, count: 0 };
      }
      
      semesterGPA[semester].total += gpaValue;
      semesterGPA[semester].count += 1;
      totalGrades.push(gpaValue);
    });

    // Вычисляем средний GPA для каждого семестра
    const semesterGPAResult = {};
    Object.keys(semesterGPA).forEach(semester => {
      const { total, count } = semesterGPA[semester];
      semesterGPAResult[semester] = count > 0 ? (total / count).toFixed(2) : '0.00';
    });

    // Общий GPA
    const overallGPA = totalGrades.length > 0 
      ? (totalGrades.reduce((sum, grade) => sum + grade, 0) / totalGrades.length).toFixed(2)
      : '0.00';

    // Статистика по предметам
    const subjectStats = {};
    availableGrades.forEach(grade => {
      const subjectId = grade.subjectId;
      if (!subjectStats[subjectId]) {
        subjectStats[subjectId] = {
          name: grade.subject.name,
          grades: [],
          semester: grade.subject.semester
        };
      }
      subjectStats[subjectId].grades.push(grade.value);
    });

    // Находим лучший и худший предмет
    let bestSubject = null;
    let worstSubject = null;
    let bestAverage = 0;
    let worstAverage = 100;

    Object.values(subjectStats).forEach(subject => {
      const average = subject.grades.reduce((sum, grade) => sum + grade, 0) / subject.grades.length;
      if (average > bestAverage) {
        bestAverage = average;
        bestSubject = {
          name: subject.name,
          average: average.toFixed(2)
        };
      }
      if (average < worstAverage) {
        worstAverage = average;
        worstSubject = {
          name: subject.name,
          average: average.toFixed(2)
        };
      }
    });

    // Подсчитываем количество сданных предметов
    const passedSubjects = Object.keys(subjectStats).length;
    const totalSubjects = await prisma.subject.count({
      where: {
        semester: {
          in: availableSemesters
        }
      }
    });

    const profileData = {
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        studentId: student.studentId,
        groupName: student.groupName,
        faculty: student.faculty,
        startDate: student.startDate
      },
      academicInfo: {
        currentSemester,
        currentCourse: courseInfo.course,
        semesterInCourse: courseInfo.semesterInCourse,
        availableSemesters
      },
      gpa: {
        overall: overallGPA,
        bySemester: semesterGPAResult
      },
      statistics: {
        passedSubjects,
        totalSubjects,
        bestSubject,
        worstSubject
      }
    };

    res.json(profileData);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получить список всех студентов (для тестирования)
router.get('/', async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        studentId: true,
        groupName: true,
        faculty: true,
        startDate: true
      }
    });
    
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router; 