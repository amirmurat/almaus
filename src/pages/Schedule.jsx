import { useEffect, useState } from 'react';
import { fetchJson } from '../utils/api';
import ScheduleCard, { ScheduleCardSkeleton } from '../components/ScheduleCard';
import { loadDone, saveDone } from '../utils/doneStore';
import '../components/ScheduleCard.css';
import Modal from '../components/Modal';

const weekdayI18n = ['Понедельник','Вторник','Среда','Четверг','Пятница','Суббота','Воскресенье'];

export default function Schedule() {
  const [week, setWeek] = useState(null);   // schedule.json
  const [tasks, setTasks] = useState(null); // assignments.json
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [doneSet, setDoneSet] = useState(loadDone());

  useEffect(() => { fetchJson('schedule.json').then(d => setWeek(d.week)); }, []);
  useEffect(() => { fetchJson('assignments.json').then(setTasks); }, []);
  useEffect(() => { saveDone(doneSet); }, [doneSet]);

  if (!week || !tasks) {
    return (
      <div style={{ padding: '24px 8px 0 8px' }}>
        {[...Array(4)].map((_, i) => <ScheduleCardSkeleton key={i} />)}
      </div>
    );
  }

  // --- определяем сегодняшний день ---
  const todayDateObj = new Date();
  const pad = n => n.toString().padStart(2, '0');
  const todayISO = `${todayDateObj.getFullYear()}-${pad(todayDateObj.getMonth() + 1)}-${pad(todayDateObj.getDate())}`;
  let todayIdx = week.findIndex(d => d.date === todayISO);
  if (todayIdx === -1) todayIdx = 0;

  // --- сортируем: сегодня всегда сверху ---
  const sortedWeek = week;

  // --- Проверка наличия домашки для пары ---
  const hasHomeworkFor = (lesson, date) => {
    if (!tasks) return false;
    return tasks.some(t => t.subject === lesson.subject && t.date === date);
  };

  // --- Статус пары ---
  const getStatus = (dateStr, lesson) => {
    const now = new Date();
    const start = new Date(dateStr + 'T' + lesson.start);
    const end = new Date(dateStr + 'T' + lesson.end);
    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'ongoing';
    return 'passed';
  };

  // --- Рендер дня ---
  const renderDay = (day, idx) => {
    const isToday = new Date(day.date).toISOString().slice(0, 10) === todayISO;
    const isPast = new Date(day.date) < new Date(todayISO);
    const lessons = (day.lessons || []);
    if (lessons.length === 0) return null; // не показывать дни без пар
    return (
      <section key={day.date} className="fade-in" style={{ padding: '0 8px', marginTop: isToday ? 12 : 20 }}>
        <h4 style={{
          margin: '8px 0',
          fontWeight: isToday ? 700 : 500,
          color: isToday ? 'var(--accent, #1976d2)' : isPast ? '#aaa' : 'var(--text)',
          fontSize: 17,
          opacity: isPast ? 0.55 : 1,
          filter: isPast ? 'grayscale(0.2)' : 'none',
        }}>
          {weekdayI18n[new Date(day.date).getDay() === 0 ? 6 : new Date(day.date).getDay() - 1]} • {day.date}
        </h4>
        {lessons.map((lesson, i) => (
          <ScheduleCard
            key={lesson.id}
            lesson={lesson}
            status={getStatus(day.date, lesson)}
            onClick={() => setSelectedLesson({ ...lesson, date: day.date })}
            highlight={isToday && getStatus(day.date, lesson) === 'ongoing' ? 'current' : undefined}
            hasHomework={hasHomeworkFor(lesson, day.date)}
            noIcon // кастомный проп для отключения эмодзи
            noStripe // кастомный проп для отключения синей линии
          />
        ))}
      </section>
    );
  };

  // --- обработчик отметки домашки как выполненной ---
  const handleMarkDone = (id) => {
    const set = new Set(doneSet);
    set.add(id);
    setDoneSet(set);
    setSelectedLesson(null); // закрыть модалку
  };

  return (
    <div>
      {week.map(renderDay)}
      <LessonModal lesson={selectedLesson} onClose={() => setSelectedLesson(null)} tasks={tasks} doneSet={doneSet} onMarkDone={handleMarkDone} />
    </div>
  );
}

function LessonModal({ lesson, onClose, tasks, doneSet, onMarkDone }) {
  if (!lesson) return null;
  const { subject, start, end, room, status, intervals, date, ...rest } = lesson;
  // Найти домашки по предмету и дате, которые не выполнены
  let hw = [];
  if (tasks && subject && date) {
    const norm = s => String(s).toLowerCase().replace(/\s+/g, '');
    hw = tasks.filter(t => norm(t.subject) === norm(subject) && t.deadline === date && !(doneSet && doneSet.has(t.id)));
  }
  return (
    <Modal open={!!lesson} onClose={onClose}>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 4 }}>{subject}</div>
        <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>{start}–{end}</div>
        <div style={{ fontSize: 14, color: '#888', marginBottom: 4 }}>Кабинет: <b>{room || '—'}</b></div>
        {intervals && intervals.length > 0 && (
          <div style={{ marginBottom: 4 }}>
            <div style={{ fontSize: 13, color: '#aaa' }}>Интервалы:</div>
            {intervals.map((iv, idx) => (
              <div key={idx} style={{ fontSize: 13, color: '#888' }}>
                {iv.start}–{iv.end} <span style={{ color: '#aaa' }}>{iv.status}</span>
              </div>
            ))}
          </div>
        )}
        {status && <div style={{ fontSize: 13, color: '#aaa', marginBottom: 4 }}>Статус: {status}</div>}
        {hw.length > 0 && (
          <div style={{ margin: '12px 0 0 0', padding: '8px', background: 'var(--card,#fff)', border: '1px solid var(--border,#eee)' }}>
            <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 6 }}>Домашние задания:</div>
            {hw.map(t => (
              <div key={t.id} style={{
                display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10, background: 'var(--card,#fff)', border: '1px solid var(--border,#ccc)', padding: 8, borderRadius: 0, boxShadow: 'none', width: '100%'
              }}>
                <input
                  type="checkbox"
                  checked={false}
                  onChange={() => onMarkDone(t.id)}
                  style={{ marginTop: 3 }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{t.title}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>Дедлайн: {t.deadline}</div>
                  {t.description && <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{t.description}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
        {Object.keys(rest).filter(key => !['id','type'].includes(key)).map(key => (
          <div key={key} style={{ fontSize: 12, color: '#bbb' }}>{key}: {String(rest[key])}</div>
        ))}
      </div>
    </Modal>
  );
}
