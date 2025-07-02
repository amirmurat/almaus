import React from 'react';
import ScheduleCard from './ScheduleCard';

/**
 * Секция одного дня расписания
 * @param {{ day: Object, idx: number, todayIdx: number, getStatus: function, renderCard?: function, onLessonClick?: function, tasks?: Array }} props
 * @param {Object} props.day - объект дня (date, lessons[])
 * @param {number} props.idx - индекс дня в неделе
 * @param {number} props.todayIdx - индекс сегодняшнего дня
 * @param {function} props.getStatus - функция (dateStr, lessons, i) => status
 * @param {function} [props.renderCard] - функция рендера карточки пары (lesson, status)
 * @param {function} [props.onLessonClick] - обработчик клика по паре (lesson)
 * @param {Array} [props.tasks] - массив заданий
 */
function DaySection({ day, idx, todayIdx, getStatus, renderCard, onLessonClick, tasks }) {
  const renderLessonCard = renderCard || ((lesson, status, highlight, hasHomework) => <ScheduleCard key={lesson.id} lesson={lesson} status={status} onClick={onLessonClick ? () => onLessonClick(lesson) : undefined} highlight={highlight} hasHomework={hasHomework} />);
  // Заголовок: день недели и дата
  const weekday = ['Понедельник','Вторник','Среда','Четверг','Пятница','Суббота','Воскресенье'][idx] || '';

  // Определяем текущую и следующую пару (только для сегодняшнего дня)
  let currentIdx = -1, nextIdx = -1;
  if (idx === todayIdx && day.lessons.length > 0) {
    const now = new Date();
    for (let i = 0; i < day.lessons.length; i++) {
      const l = day.lessons[i];
      const start = new Date(day.date + 'T' + l.start);
      const end = new Date(day.date + 'T' + l.end);
      if (now >= start && now <= end) currentIdx = i;
      if (now < start && nextIdx === -1) nextIdx = i;
    }
  }

  // Проверка наличия домашки для пары
  const hasHomeworkFor = lesson => {
    if (!tasks) return false;
    return tasks.some(t => t.subject === lesson.subject && t.date === day.date);
  };

  return (
    <section className="fade-in" style={{padding:'0 8px'}}>
      <h4 style={{margin:'8px 0', fontWeight: idx === todayIdx ? 700 : 500, color: idx === todayIdx ? 'var(--accent, #1976d2)' : 'var(--text)'}}>
        {weekday} • {day.date}
      </h4>
      {day.lessons.length === 0 ? (
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'16px 0 8px 0',color:'#bbb'}}>
          <svg width="44" height="44" viewBox="0 0 48 48" fill="none" style={{marginBottom:8}}>
            <rect x="8" y="16" width="32" height="20" rx="4" fill="#eee"/>
            <rect x="14" y="22" width="20" height="4" rx="2" fill="#ddd"/>
            <rect x="14" y="28" width="12" height="4" rx="2" fill="#ddd"/>
          </svg>
          <span style={{fontSize:14, color:'#bbb'}}>Нет пар</span>
        </div>
      ) : (
        day.lessons.map((l,i)=>{
          const status = idx!==todayIdx ? null : getStatus(day.date, day.lessons, i);
          let highlight = undefined;
          if (idx === todayIdx) {
            if (i === currentIdx) highlight = 'current';
            else if (i === nextIdx) highlight = 'next';
          }
          const hasHomework = hasHomeworkFor(l);
          return renderLessonCard(l, status, highlight, hasHomework);
        })
      )}
    </section>
  );
}

export default React.memo(DaySection); 