const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Получить текущий семестр студента
async function getCurrentSemester(studentId) {
  try {
    // Получаем студента с датой начала обучения
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { startDate: true }
    });

    if (!student) {
      throw new Error('Студент не найден');
    }

    // Получаем все семестры, отсортированные по номеру
    const semesters = await prisma.semester.findMany({
      orderBy: { number: 'asc' }
    });

    if (semesters.length === 0) {
      throw new Error('Семестры не настроены');
    }

    const now = new Date();
    const startDate = new Date(student.startDate);
    
    // Находим текущий семестр
    let currentSemester = null;
    
    for (const semester of semesters) {
      const semesterStart = new Date(semester.startDate);
      const semesterEnd = new Date(semester.endDate);
      
      if (now >= semesterStart && now <= semesterEnd) {
        currentSemester = semester.number;
        break;
      }
    }

    // Если не нашли активный семестр, определяем по дате начала обучения
    if (!currentSemester) {
      const monthsSinceStart = (now.getFullYear() - startDate.getFullYear()) * 12 + 
                              (now.getMonth() - startDate.getMonth());
      
      // 6 месяцев на семестр (2 семестра в год)
      const semesterNumber = Math.floor(monthsSinceStart / 6) + 1;
      
      // Ограничиваем максимальным номером семестра в базе
      currentSemester = Math.min(semesterNumber, semesters.length);
    }

    return currentSemester;
  } catch (error) {
    console.error('Error getting current semester:', error);
    throw error;
  }
}

// Получить все семестры до текущего (включительно)
async function getAvailableSemesters(studentId) {
  try {
    const currentSemester = await getCurrentSemester(studentId);
    const availableSemesters = [];
    
    for (let i = 1; i <= currentSemester; i++) {
      availableSemesters.push(i);
    }
    
    return availableSemesters;
  } catch (error) {
    console.error('Error getting available semesters:', error);
    throw error;
  }
}

// Проверить, может ли студент видеть оценки за семестр
function canViewSemesterGrades(semesterNumber, currentSemester) {
  return semesterNumber <= currentSemester;
}

// Получить информацию о курсе на основе семестра
function getCourseInfo(semesterNumber) {
  let course;
  if (semesterNumber >= 7) {
    course = 3;
  } else if (semesterNumber >= 4) {
    course = 2;
  } else {
    course = 1;
  }
  const semesterInCourse = ((semesterNumber - 1) % 3) + 1;
  return {
    course: course,
    semesterInCourse: semesterInCourse
  };
}

module.exports = {
  getCurrentSemester,
  getAvailableSemesters,
  canViewSemesterGrades,
  getCourseInfo
}; 