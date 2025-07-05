const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Очистка базы данных
  console.log('🧹 Cleaning database...');
  await prisma.grade.deleteMany();
  await prisma.gradeType.deleteMany();
  await prisma.studentAssignment.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.file.deleteMany();
  await prisma.note.deleteMany();
  await prisma.statistic.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();

  // Создание преподавателей
  console.log('👨‍🏫 Creating teachers...');
  const teachers = await Promise.all([
    prisma.teacher.create({
      data: {
        name: 'Ахметов А.К.',
        email: 'akhmetov@almau.edu.kz',
        department: 'Информационные технологии',
        phone: '+7 777 123 4567'
      }
    }),
    prisma.teacher.create({
      data: {
        name: 'Иванова М.П.',
        email: 'ivanova@almau.edu.kz',
        department: 'Математика',
        phone: '+7 777 234 5678'
      }
    }),
    prisma.teacher.create({
      data: {
        name: 'Смирнов В.А.',
        email: 'smirnov@almau.edu.kz',
        department: 'Физика',
        phone: '+7 777 345 6789'
      }
    }),
    prisma.teacher.create({
      data: {
        name: 'Козлова Е.С.',
        email: 'kozlova@almau.edu.kz',
        department: 'Английский язык',
        phone: '+7 777 456 7890'
      }
    }),
    prisma.teacher.create({
      data: {
        name: 'Петров Д.И.',
        email: 'petrov@almau.edu.kz',
        department: 'Экономика',
        phone: '+7 777 567 8901'
      }
    }),
    prisma.teacher.create({
      data: {
        name: 'Сидорова А.М.',
        email: 'sidorova@almau.edu.kz',
        department: 'Психология',
        phone: '+7 777 678 9012'
      }
    }),
    prisma.teacher.create({
      data: {
        name: 'Волков С.Н.',
        email: 'volkov@almau.edu.kz',
        department: 'Философия',
        phone: '+7 777 789 0123'
      }
    }),
    prisma.teacher.create({
      data: {
        name: 'Морозова Т.В.',
        email: 'morozova@almau.edu.kz',
        department: 'История',
        phone: '+7 777 890 1234'
      }
    })
  ]);

  // Создание студента
  console.log('👨‍🎓 Creating student...');
  const student = await prisma.student.create({
    data: {
      name: 'Мамбетов Алихан',
      email: 'alihan@student.almau.edu.kz',
      studentId: '2023001',
      groupName: 'IT-23-1',
      faculty: 'Информационные технологии'
    }
  });

  // Создание типов оценок
  console.log('📊 Creating grade types...');
  const gradeTypes = await Promise.all([
    prisma.gradeType.create({
      data: { name: 'Ср.тек. 11', description: 'Средний текстовый контроль 11 неделя' }
    }),
    prisma.gradeType.create({
      data: { name: 'РК 1', description: 'Рубежный контроль 1' }
    }),
    prisma.gradeType.create({
      data: { name: 'РК 2', description: 'Рубежный контроль 2' }
    }),
    prisma.gradeType.create({
      data: { name: 'Экз.', description: 'Экзамен' }
    }),
    prisma.gradeType.create({
      data: { name: 'ДЗ 1', description: 'Домашнее задание 1' }
    }),
    prisma.gradeType.create({
      data: { name: 'ДЗ 2', description: 'Домашнее задание 2' }
    })
  ]);

  // Создание предметов за 8 семестров
  console.log('📚 Creating subjects...');
  const subjects = await Promise.all([
    // 1 семестр
    prisma.subject.create({
      data: {
        name: 'Программирование',
        credits: 3,
        semester: 1,
        teacherId: teachers[0].id,
        description: 'Основы программирования на JavaScript',
        sredniyTek1: 85.7,
        sredniyTek2: 88.3,
        rk1: 92.1,
        rk2: 90.8,
        exam: 87.5
      }
    }),
    prisma.subject.create({
      data: {
        name: 'Математика',
        credits: 4,
        semester: 1,
        teacherId: teachers[1].id,
        description: 'Высшая математика',
        sredniyTek1: 78.4,
        sredniyTek2: 82.9,
        rk1: 85.2,
        rk2: 88.7,
        exam: 83.1
      }
    }),
    prisma.subject.create({
      data: {
        name: 'Физика',
        credits: 3,
        semester: 1,
        teacherId: teachers[2].id,
        description: 'Общая физика',
        sredniyTek1: 90.6,
        sredniyTek2: 92.3,
        rk1: 88.9,
        rk2: 85.4,
        exam: 89.2
      }
    }),
    prisma.subject.create({
      data: {
        name: 'Английский язык',
        credits: 2,
        semester: 1,
        teacherId: teachers[3].id,
        description: 'Английский язык для IT',
        sredniyTek1: 88.2,
        sredniyTek2: 85.7,
        rk1: 90.4,
        rk2: 87.8,
        exam: 86.3
      }
    }),

    // 2 семестр
    prisma.subject.create({
      data: {
        name: 'Объектно-ориентированное программирование',
        credits: 4,
        semester: 2,
        teacherId: teachers[0].id,
        description: 'ООП на Java',
        sredniyTek1: 82.5,
        sredniyTek2: 86.1,
        rk1: 89.3,
        rk2: 84.7,
        exam: 86.8
      }
    }),
    prisma.subject.create({
      data: {
        name: 'Линейная алгебра',
        credits: 3,
        semester: 2,
        teacherId: teachers[1].id,
        description: 'Линейная алгебра и аналитическая геометрия',
        sredniyTek1: 75.8,
        sredniyTek2: 79.4,
        rk1: 82.6,
        rk2: 85.9,
        exam: 81.2
      }
    }),
    prisma.subject.create({
      data: {
        name: 'Электротехника',
        credits: 3,
        semester: 2,
        teacherId: teachers[2].id,
        description: 'Основы электротехники',
        sredniyTek1: 87.3,
        sredniyTek2: 89.8,
        rk1: 85.1,
        rk2: 88.4,
        exam: 87.6
      }
    }),
    prisma.subject.create({
      data: {
        name: 'Философия',
        credits: 2,
        semester: 2,
        teacherId: teachers[6].id,
        description: 'Основы философии',
        sredniyTek1: 91.2,
        sredniyTek2: 88.7,
        rk1: 85.4,
        rk2: 89.1,
        exam: 88.6
      }
    }),

    // 3 семестр
    prisma.subject.create({
      data: {
        name: 'Структуры данных и алгоритмы',
        credits: 4,
        semester: 3,
        teacherId: teachers[0].id,
        description: 'Алгоритмы и структуры данных',
        sredniyTek1: 88.9,
        sredniyTek2: 91.4,
        rk1: 86.7,
        rk2: 89.2,
        exam: 88.8
      }
    }),
    prisma.subject.create({
      data: {
        name: 'Математический анализ',
        credits: 4,
        semester: 3,
        teacherId: teachers[1].id,
        description: 'Дифференциальное и интегральное исчисление',
        sredniyTek1: 76.3,
        sredniyTek2: 80.8,
        rk1: 83.5,
        rk2: 87.1,
        exam: 82.4
      }
    }),
    prisma.subject.create({
      data: {
        name: 'Теория вероятностей',
        credits: 3,
        semester: 3,
        teacherId: teachers[1].id,
        description: 'Теория вероятностей и математическая статистика',
        sredniyTek1: 84.6,
        sredniyTek2: 87.9,
        rk1: 82.3,
        rk2: 85.8,
        exam: 85.2
      }
    }),
    prisma.subject.create({
      data: {
        name: 'Экономика',
        credits: 2,
        semester: 3,
        teacherId: teachers[4].id,
        description: 'Основы экономики',
        sredniyTek1: 89.5,
        sredniyTek2: 86.2,
        rk1: 88.7,
        rk2: 84.9,
        exam: 87.3
      }
    }),

    // 4 семестр
    prisma.subject.create({
      data: {
        name: 'Базы данных',
        credits: 4,
        semester: 4,
        teacherId: teachers[0].id,
        description: 'Проектирование и управление базами данных',
        sredniyTek1: 90.1,
        sredniyTek2: 88.6,
        rk1: 85.3,
        rk2: 89.7,
        exam: 88.4
      }
    }),
    prisma.subject.create({
      data: {
        name: 'Дискретная математика',
        credits: 3,
        semester: 4,
        teacherId: teachers[1].id,
        description: 'Дискретная математика и логика',
        sredniyTek1: 81.7,
        sredniyTek2: 85.2,
        rk1: 88.9,
        rk2: 83.6,
        exam: 85.1
      }
    }),
    prisma.subject.create({
      data: {
        name: 'Сети и телекоммуникации',
        credits: 3,
        semester: 4,
        teacherId: teachers[2].id,
        description: 'Компьютерные сети',
        sredniyTek1: 86.4,
        sredniyTek2: 89.1,
        rk1: 84.8,
        rk2: 87.5,
        exam: 86.9
      }
    }),
    prisma.subject.create({
      data: {
        name: 'История Казахстана',
        credits: 2,
        semester: 4,
        teacherId: teachers[7].id,
        description: 'История Республики Казахстан',
        sredniyTek1: 92.8,
        sredniyTek2: 89.3,
        rk1: 86.7,
        rk2: 90.2,
        exam: 89.6
      }
    }),

    // 5 семестр
    prisma.subject.create({
      data: {
        name: 'Веб-разработка',
        credits: 4,
        semester: 5,
        teacherId: teachers[0].id,
        description: 'Создание веб-приложений',
        sredniyTek1: 87.2,
        sredniyTek2: 90.5,
        rk1: 85.8,
        rk2: 88.3,
        exam: 87.9
      }
    }),
    prisma.subject.create({
      data: {
        name: 'Операционные системы',
        credits: 3,
        semester: 5,
        teacherId: teachers[0].id,
        description: 'Архитектура операционных систем',
        sredniyTek1: 89.6,
        sredniyTek2: 86.3,
        rk1: 88.1,
        rk2: 85.7,
        exam: 87.2
      }
    }),
    prisma.subject.create({
      data: {
        name: 'Теория информации',
        credits: 3,
        semester: 5,
        teacherId: teachers[1].id,
        description: 'Теория информации и кодирования',
        sredniyTek1: 83.9,
        sredniyTek2: 87.4,
        rk1: 85.2,
        rk2: 88.8,
        exam: 86.5
      }
    }),
    prisma.subject.create({
      data: {
        name: 'Психология',
        credits: 2,
        semester: 5,
        teacherId: teachers[5].id,
        description: 'Основы психологии',
        sredniyTek1: 90.7,
        sredniyTek2: 88.1,
        rk1: 86.4,
        rk2: 89.9,
        exam: 88.3
      }
    }),

    // 6 семестр
    prisma.subject.create({
      data: {
        name: 'Мобильная разработка',
        credits: 4,
        semester: 6,
        teacherId: teachers[0].id,
        description: 'Разработка мобильных приложений',
        sredniyTek1: 88.4,
        sredniyTek2: 91.7,
        rk1: 86.2,
        rk2: 89.5,
        exam: 88.8
      }
    }),
    prisma.subject.create({
      data: {
        name: 'Искусственный интеллект',
        credits: 4,
        semester: 6,
        teacherId: teachers[0].id,
        description: 'Основы искусственного интеллекта',
        sredniyTek1: 85.3,
        sredniyTek2: 88.9,
        rk1: 87.6,
        rk2: 84.1,
        exam: 86.7
      }
    }),
    prisma.subject.create({
      data: {
        name: 'Численные методы',
        credits: 3,
        semester: 6,
        teacherId: teachers[1].id,
        description: 'Численные методы в программировании',
        sredniyTek1: 82.8,
        sredniyTek2: 86.5,
        rk1: 89.2,
        rk2: 84.7,
        exam: 85.9
      }
    }),
    prisma.subject.create({
      data: {
        name: 'Менеджмент',
        credits: 2,
        semester: 6,
        teacherId: teachers[4].id,
        description: 'Основы менеджмента',
        sredniyTek1: 91.3,
        sredniyTek2: 87.8,
        rk1: 85.6,
        rk2: 89.4,
        exam: 88.2
      }
    }),

    // 7 семестр
    prisma.subject.create({
      data: {
        name: 'Кибербезопасность',
        credits: 4,
        semester: 7,
        teacherId: teachers[0].id,
        description: 'Основы информационной безопасности',
        sredniyTek1: 89.1,
        sredniyTek2: 86.7,
        rk1: 88.4,
        rk2: 85.9,
        exam: 87.3
      }
    }),
    prisma.subject.create({
      data: {
        name: 'Машинное обучение',
        credits: 4,
        semester: 7,
        teacherId: teachers[0].id,
        description: 'Алгоритмы машинного обучения',
        sredniyTek1: 87.5,
        sredniyTek2: 90.2,
        rk1: 86.8,
        rk2: 89.1,
        exam: 88.6
      }
    }),
    prisma.subject.create({
      data: {
        name: 'Оптимизация',
        credits: 3,
        semester: 7,
        teacherId: teachers[1].id,
        description: 'Методы оптимизации',
        sredniyTek1: 84.2,
        sredniyTek2: 87.9,
        rk1: 85.6,
        rk2: 88.3,
        exam: 86.8
      }
    }),
    prisma.subject.create({
      data: {
        name: 'Предпринимательство',
        credits: 2,
        semester: 7,
        teacherId: teachers[4].id,
        description: 'Основы предпринимательства',
        sredniyTek1: 92.6,
        sredniyTek2: 88.9,
        rk1: 86.3,
        rk2: 90.1,
        exam: 89.4
      }
    }),

    // 8 семестр
    prisma.subject.create({
      data: {
        name: 'Дипломный проект',
        credits: 6,
        semester: 8,
        teacherId: teachers[0].id,
        description: 'Выпускная квалификационная работа',
        sredniyTek1: 91.8,
        sredniyTek2: 89.4,
        rk1: 87.2,
        rk2: 90.7,
        exam: 89.8
      }
    }),
    prisma.subject.create({
      data: {
        name: 'Большие данные',
        credits: 3,
        semester: 8,
        teacherId: teachers[0].id,
        description: 'Обработка и анализ больших данных',
        sredniyTek1: 88.7,
        sredniyTek2: 91.2,
        rk1: 86.5,
        rk2: 89.8,
        exam: 88.9
      }
    }),
    prisma.subject.create({
      data: {
        name: 'Статистика',
        credits: 3,
        semester: 8,
        teacherId: teachers[1].id,
        description: 'Прикладная статистика',
        sredniyTek1: 85.4,
        sredniyTek2: 88.1,
        rk1: 87.6,
        rk2: 84.9,
        exam: 86.3
      }
    }),
    prisma.subject.create({
      data: {
        name: 'Профессиональная этика',
        credits: 2,
        semester: 8,
        teacherId: teachers[6].id,
        description: 'Этика в IT-профессии',
        sredniyTek1: 93.1,
        sredniyTek2: 89.7,
        rk1: 86.8,
        rk2: 90.4,
        exam: 89.9
      }
    })
  ]);

  // Создание оценок для всех предметов
  console.log('📈 Creating grades...');
  const grades = [];
  
  for (const subject of subjects) {
    // Создаем оценки для каждого предмета
    grades.push(
      prisma.grade.create({
        data: {
          studentId: student.id,
          subjectId: subject.id,
          gradeTypeId: gradeTypes[0].id, // Ср.тек. 11
          value: Math.floor(subject.sredniyTek1),
          maxValue: 100,
          date: new Date('2024-11-15')
        }
      }),
      prisma.grade.create({
        data: {
          studentId: student.id,
          subjectId: subject.id,
          gradeTypeId: gradeTypes[1].id, // РК 1
          value: Math.floor(subject.rk1),
          maxValue: 100,
          date: new Date('2024-12-10')
        }
      }),
      prisma.grade.create({
        data: {
          studentId: student.id,
          subjectId: subject.id,
          gradeTypeId: gradeTypes[4].id, // ДЗ 1
          value: Math.floor(subject.sredniyTek1 * 0.9 + Math.random() * 10),
          maxValue: 100,
          date: new Date('2024-10-20')
        }
      })
    );
  }

  await Promise.all(grades);

  console.log('✅ Database seeding completed successfully!');
  console.log(`📊 Created ${teachers.length} teachers`);
  console.log(`👨‍🎓 Created 1 student`);
  console.log(`📚 Created ${subjects.length} subjects across 8 semesters`);
  console.log(`📈 Created ${grades.length} grades`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 