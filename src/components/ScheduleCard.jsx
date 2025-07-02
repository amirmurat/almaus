// src/components/ScheduleCard.jsx
import React from 'react';
import './ScheduleCard.css';

const statusColor = {
  ongoing: '#388e3c',
  cancelled: '#d32f2f',
  moved: '#f9a825',
  passed: '#888',
  upcoming: '#1976d2',
};

const statusI18n = {
  ongoing: 'Идёт',
  cancelled: 'Отменено',
  moved: 'Перемещено',
  passed: 'Окончено',
  upcoming: 'Скоро начнётся',
};

// Функция выбора эмодзи по предмету
function subjectIcon(subject) {
  const s = subject.toLowerCase();
  if (s.includes('матем')) return '📐';
  if (s.includes('физ')) return '🧲';
  if (s.includes('информ')) return '💻';
  if (s.includes('англ')) return '🇬🇧';
  if (s.includes('рус')) return '🇷🇺';
  if (s.includes('истор')) return '🏺';
  if (s.includes('биол')) return '🧬';
  if (s.includes('хим')) return '⚗️';
  if (s.includes('геог')) return '🌍';
  if (s.includes('литер')) return '📚';
  if (s.includes('спорт')) return '🏃';
  if (s.includes('эконом')) return '💸';
  if (s.includes('прав')) return '⚖️';
  return '📖';
}

/**
 * Карточка пары расписания
 * @param {{ lesson: Object, status?: string, onClick?: function, highlight?: string, hasHomework: boolean, noIcon?: boolean, noStripe?: boolean }} props
 */
function ScheduleCard({ lesson, status, onClick, highlight, hasHomework, noIcon, noStripe }) {
  const { start, end, subject, room, status: lessonStatus, intervals } = lesson;
  // intervals: [{start, end, status}] — если есть дополнительные интервалы
  const mainStatus = lessonStatus || status;
  let highlightClass = '';
  if (highlight === 'current') highlightClass = 'schedule-card-current';
  if (highlight === 'next') highlightClass = 'schedule-card-next';
  const card = (
    <div className={`schedule-card fade-in schedule-card-modern ${highlightClass}`}>
      {!noStripe && <div className="schedule-card-stripe" style={{background: statusColor[mainStatus] || '#bbb'}} />}
      <div className="schedule-card-row">
        <div className="schedule-card-left">
          <div className="schedule-card-subject">
            {!noIcon && <span className="schedule-card-icon" aria-hidden>{subjectIcon(subject)}</span>}
            <span>{subject}</span>
            {hasHomework && (
              <span className="schedule-card-hw" title="Есть домашка" aria-label="Есть домашка">📒</span>
            )}
          </div>
          <div className="schedule-card-time">{start}–{end}</div>
          {intervals && intervals.length > 0 && intervals.map((iv, idx) => (
            <div key={idx} className="schedule-card-interval">
              {iv.start}–{iv.end} <span style={{color: statusColor[iv.status] || '#888'}}>{statusI18n[iv.status] || ''}</span>
            </div>
          ))}
        </div>
        <div className="schedule-card-right">
          <div className="schedule-card-room">{room || '—'}</div>
          <div className="schedule-card-status" style={{color: statusColor[mainStatus] || '#888'}}>{statusI18n[mainStatus] || ''}</div>
        </div>
      </div>
      <div className="schedule-card-divider" />
    </div>
  );
  if (onClick) {
    return <div style={{cursor:'pointer'}} onClick={onClick}>{card}</div>;
  }
  return card;
}

/**
 * Скелетон для карточки пары
 * @returns {JSX.Element}
 */
export function ScheduleCardSkeleton() {
  return (
    <div className="schedule-card">
      <div className="schedule-card-row">
        <div className="schedule-card-left">
          <div className="skeleton skeleton-subject" />
          <div className="skeleton skeleton-time" />
          <div className="skeleton skeleton-interval" />
        </div>
        <div className="schedule-card-right">
          <div className="skeleton skeleton-room" />
          <div className="skeleton skeleton-status" />
        </div>
      </div>
      <div className="schedule-card-divider" />
    </div>
  );
}

export default React.memo(ScheduleCard);
