// src/components/AssignmentCard.jsx
import { Link } from 'react-router-dom';
import './AssignmentCard.css';

// --- Хелпер для подсчёта времени до дедлайна ---
const parseDeadline = (deadlineStr, id) => {
  // Для задачи с id=1, если нет времени, ставим 15:00
  if (/^\d{4}-\d{2}-\d{2}$/.test(deadlineStr)) {
    if (id === 1) {
      return new Date(deadlineStr + 'T15:00');
    } else {
      // По умолчанию — до конца дня
      return new Date(deadlineStr + 'T23:59:59');
    }
  }
  return new Date(deadlineStr);
};

const getTimeRemaining = (deadlineStr, id) => {
  const deadlineDate = parseDeadline(deadlineStr, id);
  const diff = deadlineDate.getTime() - new Date().getTime();
  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 0) return `осталось ${days} д.`;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours > 0) return `осталось ${hours} ч.`;

  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes > 0) return `осталось ${minutes} мин.`;

  return null;
};

// --- Хелпер для форматирования даты и времени ---
const formatDateTime = (isoStr, id) => {
  const d = parseDeadline(isoStr, id);
  const pad = n => n.toString().padStart(2, '0');
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function AssignmentCard({ task, hideSubject, isPastDeadline }) {
  const { id, title, subject, deadline } = task;
  /* CSS‑класс card + модификатор archived  */
  const cls = 'card card-modern' + (isPastDeadline ? ' archived' : '');
  const remainingTime = !isPastDeadline ? getTimeRemaining(deadline, id) : null;
  return (
    <Link
      to={`/assignments/${id}`}
      style={{
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <div
        className={cls}
        style={{
          display: 'flex',
          gap: 8,
          opacity: isPastDeadline ? 0.65 : 1,
          cursor: 'pointer',
        }}
      >
        <div style={{ flex: 1 }}>
          {!hideSubject && <h4 style={{fontSize:16,fontWeight:500,marginBottom:4,marginTop:0}}>{subject}</h4>}
          <p style={{fontSize:15,fontWeight:500,margin:'0 0 2px 0'}}>{title}</p>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <small style={{fontSize:13,color:'#888'}}>
              до {formatDateTime(deadline, id)}
            </small>
            {remainingTime && (
              <span style={{ color: 'var(--accent-red, #d32f2f)', fontWeight: 500, fontSize:13, marginLeft: 8, whiteSpace:'nowrap' }}>
                {remainingTime}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
