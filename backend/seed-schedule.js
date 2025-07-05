const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

async function seedSchedule() {
  try {
    console.log('🌱 Seeding schedule for IT-23-1, 3 семестр (повторяемость по датам)...');

    // Удаляем старое расписание для группы
    await prisma.schedule.deleteMany({ where: { groupName: 'IT-23-1' } });

    // Получить 3 семестр
    const semester = await prisma.semester.findFirst({ where: { number: 3 } });
    if (!semester) throw new Error('Нет 3 семестра!');
    const startDate = new Date(semester.startDate);
    const endDate = new Date(semester.endDate);

    // Получить все предметы 3 семестра
    const subjects = await prisma.subject.findMany({ where: { semester: 3 } });
    if (!subjects.length) throw new Error('Нет предметов для 3 семестра!');

    // Получить всех преподавателей
    const teachers = await prisma.teacher.findMany();
    if (!teachers.length) throw new Error('Нет преподавателей!');

    // Время пар (пример)
    const times = [
      { start: '09:00', end: '10:30' },
      { start: '10:40', end: '12:10' },
      { start: '12:40', end: '14:10' },
      { start: '14:20', end: '15:50' },
      { start: '16:00', end: '17:30' },
    ];

    // Считаем количество недель в семестре
    const msInWeek = 7 * 24 * 60 * 60 * 1000;
    const totalWeeks = Math.floor((endDate - startDate) / msInWeek);
    const weeksToGenerate = Math.max(1, totalWeeks - 3); // кроме последних 3 недель

    for (let week = 0; week < weeksToGenerate; week++) {
      for (let day = 1; day <= 5; day++) { // Пн–Пт
        const subject = subjects[(day - 1) % subjects.length];
        const teacher = teachers[(day - 1) % teachers.length];
        const time = times[(day - 1) % times.length];
        
        // Найти первый понедельник после начала семестра
        const firstMonday = new Date(startDate);
        const dayOfWeek = firstMonday.getDay(); // 0=вс, 1=пн, ..., 6=сб
        const daysToAdd = dayOfWeek === 0 ? 1 : (8 - dayOfWeek); // до следующего понедельника
        firstMonday.setDate(firstMonday.getDate() + daysToAdd);
        
        // Дата: первый понедельник + week*7 + (day-1)
        const date = addDays(firstMonday, week * 7 + (day - 1));
        
        await prisma.schedule.create({
          data: {
            groupName: 'IT-23-1',
            subjectId: subject.id,
            teacherId: teacher.id,
            dayOfWeek: day,
            startTime: time.start,
            endTime: time.end,
            room: `${101 + day}`,
            lessonType: 'lecture',
            date: date,
          }
        });
      }
    }

    console.log('✅ Schedule seeded for all недели 3 семестра!');
  } catch (error) {
    console.error('❌ Error seeding schedule:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedSchedule(); 