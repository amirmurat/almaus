const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSchedule() {
  try {
    const schedules = await prisma.schedule.findMany({ 
      where: { groupName: 'IT-23-1' },
      include: { subject: true }
    });
    
    console.log('📊 Статистика расписания IT-23-1:');
    console.log(`Всего записей: ${schedules.length}`);
    
    if (schedules.length > 0) {
      console.log('\n📅 Первые 5 записей:');
      schedules.slice(0, 5).forEach((s, i) => {
        console.log(`${i+1}. ${s.date} - ${s.subject.name} (${s.startTime}-${s.endTime})`);
      });
      
      console.log('\n📅 Последние 5 записей:');
      schedules.slice(-5).forEach((s, i) => {
        console.log(`${i+1}. ${s.date} - ${s.subject.name} (${s.startTime}-${s.endTime})`);
      });
      
      // Группировка по неделям
      const byWeek = {};
      schedules.forEach(s => {
        const weekStart = new Date(s.date);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); // Понедельник
        const weekKey = weekStart.toISOString().slice(0, 10);
        if (!byWeek[weekKey]) byWeek[weekKey] = [];
        byWeek[weekKey].push(s);
      });
      
      console.log(`\n📅 Недель с парами: ${Object.keys(byWeek).length}`);
      console.log('Недели:', Object.keys(byWeek).sort());
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSchedule(); 