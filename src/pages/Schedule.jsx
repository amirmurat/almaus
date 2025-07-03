import { useEffect, useState } from 'react';
import { fetchJson } from '../utils/api';
import ScheduleCard, { ScheduleCardSkeleton } from '../components/ScheduleCard';
import { loadDone, saveDone } from '../utils/doneStore';
import '../components/ScheduleCard.css';
import Modal from '../components/Modal';
import { useNavigate } from 'react-router-dom';

const weekdayI18n = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export default function Schedule() {
  const [week, setWeek] = useState(null);   // schedule.json
  const [tasks, setTasks] = useState(null); // assignments.json
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [doneSet, setDoneSet] = useState(loadDone());
  const [collapsedDays, setCollapsedDays] = useState([]);

  useEffect(() => { fetchJson('schedule.json').then(d => setWeek(d.week)); }, []);
  useEffect(() => { fetchJson('assignments.json').then(setTasks); }, []);
  useEffect(() => { saveDone(doneSet); }, [doneSet]);
  useEffect(() => {
    if (week) {
      const todayDateObj = new Date();
      const pad = n => n.toString().padStart(2, '0');
      const todayISO = `${todayDateObj.getFullYear()}-${pad(todayDateObj.getMonth() + 1)}-${pad(todayDateObj.getDate())}`;
      setCollapsedDays(
        week.filter(day => new Date(day.date) < new Date(todayISO)).map(day => day.date)
      );
    }
  }, [week]);

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
    const isCollapsed = collapsedDays.includes(day.date);
    return (
      <section key={day.date} style={{ padding: '0 8px', marginTop: isToday ? 12 : 20 }}>
        <h4
          style={{
            margin: '8px 0',
            fontWeight: isToday ? 700 : 500,
            color: isToday ? 'var(--accent, #1976d2)' : 'var(--text)',
            fontSize: 17,
            opacity: isToday ? 1 : isPast ? 0.7 : 0.9,
            filter: isPast ? 'grayscale(0.08)' : 'none',
            cursor: 'pointer',
            userSelect: 'none',
            display: 'flex', alignItems: 'center', gap: 8
          }}
          onClick={() => {
            setCollapsedDays(prev =>
              prev.includes(day.date)
                ? prev.filter(d => d !== day.date)
                : [...prev, day.date]
            );
          }}
        >
          {weekdayI18n[new Date(day.date).getDay() === 0 ? 6 : new Date(day.date).getDay() - 1]} • {day.date}
          <span style={{
            display: 'inline-block',
            transition: 'transform 0.2s',
            transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
            width: 18, height: 18
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </span>
        </h4>
        <div
          style={{
            maxHeight: isCollapsed ? 0 : 1000,
            opacity: isCollapsed ? 0 : 1,
            overflow: 'hidden',
            pointerEvents: isCollapsed ? 'none' : 'auto',
            transition: 'max-height 0.35s cubic-bezier(.4,0,.2,1), opacity 0.25s',
          }}
        >
          {lessons.map((lesson, i) => {
            const status = getStatus(day.date, lesson);
            const isPassed = status === 'passed';
            return (
              <div key={lesson.id} style={{ opacity: isPassed ? 0.6 : 1, transition: 'opacity 0.25s' }}>
                <ScheduleCard
                  lesson={lesson}
                  status={status}
                  onClick={() => setSelectedLesson({ ...lesson, date: day.date })}
                  highlight={isToday && status === 'ongoing' ? 'current' : undefined}
                  hasHomework={hasHomeworkFor(lesson, day.date)}
                  noIcon
                  noStripe
                />
              </div>
            );
          })}
        </div>
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
    <div
      style={{
        padding: '16px',
        maxWidth: 800,
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
      className="schedule-root"
    >
      {week.map(renderDay)}
      <LessonModal lesson={selectedLesson} onClose={() => setSelectedLesson(null)} tasks={tasks} doneSet={doneSet} onMarkDone={handleMarkDone} />
    </div>
  );
}

function LessonModal({ lesson, onClose, tasks, doneSet, onMarkDone }) {
  const nav = useNavigate();
  if (!lesson) return null;
  const { subject, start, end, room, status, intervals, date, ...rest } = lesson;
  // Найти все невыполненные задачи по предмету, у которых дедлайн не раньше даты урока
  let hw = [];
  if (tasks && subject && date) {
    const norm = s => String(s).toLowerCase().replace(/\s+/g, '');
    hw = tasks.filter(t =>
      norm(t.subject) === norm(subject) &&
      new Date(t.deadline) >= new Date() && // дедлайн ещё не прошёл
      (t.type === undefined || t.type === 'assignment')
    );
  }
  return (
    <Modal open={!!lesson} onClose={onClose}>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 2, letterSpacing: 0.2 }}>{subject}</div>
        <div style={{ fontSize: 15, color: '#555', marginBottom: 2 }}>{start}–{end} <span style={{color:'#bbb',marginLeft:8}}>ауд. <b>{room || '—'}</b></span></div>
        {intervals && intervals.length > 0 && (
          <div style={{ marginBottom: 4 }}>
            <div style={{ fontSize: 13, color: '#aaa', marginBottom: 2 }}>Интервалы:</div>
            {intervals.map((iv, idx) => (
              <div key={idx} style={{ fontSize: 13, color: '#888', marginBottom: 1 }}>
                {iv.start}–{iv.end} <span style={{ color: '#aaa' }}>{iv.status}</span>
              </div>
            ))}
          </div>
        )}
        {status && <div style={{ fontSize: 13, color: '#aaa', marginBottom: 4 }}>Статус: {status}</div>}
        {rest.theme && (
          <div style={{ fontSize: 14, color: '#1976d2', margin: '8px 0 4px 0', fontWeight: 500 }}>
            Тема: <span style={{ color: 'var(--text)' }}>{rest.theme}</span>
          </div>
        )}
        <div style={{height:1,background:'var(--border,#eee)',margin:'16px 0 12px 0',opacity:0.5}} />
        {hw.length > 0 && (
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 10, letterSpacing:0.1 }}>Домашние задания:</div>
            {hw.map(t => (
              <div key={t.id} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12,
                background: 'none', border: 'none', boxShadow: '0 2px 8px #1976d211',
                padding: '12px 10px', borderRadius: 0, width: '100%', cursor: 'pointer',
                transition: 'box-shadow 0.18s',
                outline: '1.5px solid var(--primary,#1976d2)', outlineOffset: '-1.5px',
                position: 'relative',
              }}
                onClick={() => nav(`/assignments/${t.id}`)}
                tabIndex={0}
                title="Открыть задачу"
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 500, textDecoration: 'underline', color: 'var(--primary,#1976d2)' }}>{t.title}</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>Дедлайн: {t.deadline}</div>
                  {t.description && <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{t.description}</div>}
                </div>
                <span style={{fontSize:18, color:'var(--primary,#1976d2)',marginLeft:6,alignSelf:'center'}}>→</span>
              </div>
            ))}
          </div>
        )}
        {Object.keys(rest)
          .filter(key => !['id','type','theme','subject','start','end','room','status','intervals','date'].includes(key))
          .map(key => (
            <div key={key} style={{ fontSize: 12, color: '#bbb' }}>{key}: {String(rest[key])}</div>
          ))}
      </div>
    </Modal>
  );
}
