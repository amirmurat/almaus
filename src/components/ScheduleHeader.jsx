import React, { useRef, useState } from 'react';
import CalendarPopover from './CalendarPopover';

function CalendarIconMode({ mode, color, fill, onClick, iconRef }) {
  return (
    <svg ref={iconRef} onClick={onClick} width="32" height="32" viewBox="0 0 32 32" style={{cursor:'pointer', verticalAlign:'middle', display:'block'}}>
      {/* Ушки */}
      <line x1="10" y1="10" x2="10" y2="4" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <line x1="22" y1="10" x2="22" y2="4" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      {/* Внешний прямоугольник */}
      <rect x="4" y="8" width="24" height="20" fill={fill} stroke={color} strokeWidth="2"/>
      {/* Внутренний прямоугольник (даты) */}
      <rect x="4" y="14" width="24" height="14" fill={fill} stroke="none"/>
      {/* Число */}
      <text x="16" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill={color}>{mode === 'week' ? '7' : '1'}</text>
    </svg>
  );
}

function ArrowBtn({ dir, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: 'none', border: 'none', padding: 0, margin: '0 2px', cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.3 : 1, height: 32, width: 32, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }} aria-label={dir === 'left' ? 'Назад' : 'Вперёд'}>
      <svg width="24" height="24" viewBox="0 0 24 24">
        {dir === 'left' ? <polyline points="15 18 9 12 15 6" fill="none" stroke="currentColor" strokeWidth="2"/> : <polyline points="9 6 15 12 9 18" fill="none" stroke="currentColor" strokeWidth="2"/>}
      </svg>
    </button>
  );
}

/**
 * Шапка расписания (день/неделя, календарь, стрелки)
 * @param {{ view: string, dayIdx: number, week: Array, todayIdxReal: number, onPrev: function, onNext: function, onToday: function, onToggleView: function, currentDateStr: string, weekdayI18n: Array, onSelectDate?: function }} props
 */
export default function ScheduleHeader({
  view, dayIdx, week, todayIdxReal, onPrev, onNext, onToday, onToggleView, currentDateStr, weekdayI18n, onSelectDate
}) {
  // Цвета для темы
  const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const color = isDark ? '#fff' : '#222';
  const fill = isDark ? '#222' : '#fff';

  // Текст слева
  let leftText;
  if (view === 'today') {
    leftText = `${weekdayI18n[dayIdx]}, ${currentDateStr}`;
  } else {
    // ISO неделя
    const getWeekNumber = date => {
      const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      const dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
      return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
    };
    const currentDay = week[dayIdx];
    const currentDate = currentDay ? new Date(currentDay.date) : new Date();
    const weekNum = getWeekNumber(currentDate);
    leftText = `${weekNum} неделя`;
  }

  // Calendar popover logic
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarIconRef = useRef(null);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'var(--card)', color: 'var(--text)', padding: '16px 16px 12px 16px',
      borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 10,
      minHeight: 56, boxShadow: '0 2px 8px 0 rgba(60,60,60,0.04)',
      backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      transition: 'background 0.3s, box-shadow 0.3s',
    }}>
      <div style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer', minWidth: 0}} onClick={onToday}>
        <span style={{fontSize: 16, fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{leftText}</span>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:2,position:'relative'}}>
        <span style={{display:'flex',alignItems:'center'}}>
          <CalendarIconMode mode={view} color={color} fill={fill} onClick={()=>setShowCalendar(v=>!v)} iconRef={calendarIconRef} />
        </span>
        <ArrowBtn dir="left" onClick={onPrev} disabled={dayIdx<=0}/>
        <ArrowBtn dir="right" onClick={onNext} disabled={dayIdx>=week.length-1}/>
        <CalendarPopover open={showCalendar} anchorRef={calendarIconRef} onSelect={onSelectDate} onClose={()=>setShowCalendar(false)} />
      </div>
    </div>
  );
} 