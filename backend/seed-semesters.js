const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedSemesters() {
  try {
    console.log('🌱 Seeding semesters...');

    // Очищаем существующие семестры
    await prisma.semester.deleteMany();

    // 3 семестра в год, 3 года обучения
    // Семестр 1: сентябрь-декабрь
    // Семестр 2: январь-апрель
    // Семестр 3: май-август
    // Начало с сентября 2024
    const semesters = [
      // 2024/2025 учебный год
      {
        number: 1,
        startDate: new Date('2024-09-01'),
        endDate: new Date('2024-12-31'),
        isActive: false
      },
      {
        number: 2,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-04-30'),
        isActive: false
      },
      {
        number: 3,
        startDate: new Date('2025-05-01'),
        endDate: new Date('2025-08-31'),
        isActive: true // Текущий семестр (июль 2025)
      },
      // 2025/2026 учебный год
      {
        number: 4,
        startDate: new Date('2025-09-01'),
        endDate: new Date('2025-12-31'),
        isActive: false
      },
      {
        number: 5,
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-04-30'),
        isActive: false
      },
      {
        number: 6,
        startDate: new Date('2026-05-01'),
        endDate: new Date('2026-08-31'),
        isActive: false
      },
      // 2026/2027 учебный год
      {
        number: 7,
        startDate: new Date('2026-09-01'),
        endDate: new Date('2026-12-31'),
        isActive: false
      },
      {
        number: 8,
        startDate: new Date('2027-01-01'),
        endDate: new Date('2027-04-30'),
        isActive: false
      },
      {
        number: 9,
        startDate: new Date('2027-05-01'),
        endDate: new Date('2027-08-31'),
        isActive: false
      }
    ];

    for (const semester of semesters) {
      await prisma.semester.create({
        data: semester
      });
    }

    console.log('✅ Semesters seeded successfully!');
    console.log('📅 Current semester: 3 (2025-05-01 to 2025-08-31)');

  } catch (error) {
    console.error('❌ Error seeding semesters:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedSemesters(); 