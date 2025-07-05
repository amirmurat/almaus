const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testScheduleAPI() {
  try {
    console.log('🧪 Тестирование API расписания...');
    
    // Получить расписание для группы IT-23-1
    const schedules = await prisma.schedule.findMany({
      where: { groupName: 'IT-23-1' },
      include: {
        subject: true,
        teacher: true
      }
    });
    
    console.log(`📊 Найдено ${schedules.length} записей`);
    
    if (schedules.length > 0) {
      console.log('\n📅 Первые 5 записей с датами:');
      schedules.slice(0, 5).forEach((s, i) => {
        console.log(`${i+1}. ${s.date} - ${s.subject.name} (${s.startTime}-${s.endTime})`);
      });
      
      // Проверим формат дат
      console.log('\n📅 Формат дат:');
      schedules.slice(0, 3).forEach(s => {
        const dateStr = s.date.toISOString().slice(0, 10);
        console.log(`Исходная: ${s.date}`);
        console.log(`ISO slice: ${dateStr}`);
        console.log(`---`);
      });
      
      // Проверим уникальные даты
      const uniqueDates = [...new Set(schedules.map(s => s.date.toISOString().slice(0, 10)))];
      console.log(`\n📅 Уникальных дат: ${uniqueDates.length}`);
      console.log('Первые 10 дат:', uniqueDates.slice(0, 10));
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testScheduleAPI(); 