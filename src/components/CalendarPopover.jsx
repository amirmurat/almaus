import React, { useEffect, useRef } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

// Локализация ru
const ru = {
  months: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
  weekdays: ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'],
  weekdaysShort: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
  today: 'Сегодня',
};

/**
 * Выпадающий календарь для выбора даты
 * @param {{ open: boolean, anchorRef: React.RefObject, onSelect: function, onClose: function }} props
 */
export default function CalendarPopover({ open, anchorRef, onSelect, onClose }) {
  const popoverRef = useRef(null);

  // Закрытие по клику вне
  useEffect(() => {
    if (!open) return;
    function handle(e) {
      if (popoverRef.current && !popoverRef.current.contains(e.target) && (!anchorRef || !anchorRef.current || !anchorRef.current.contains(e.target))) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  // Позиционирование под anchorRef (иконка)
  let style = { position: 'absolute', zIndex: 2000, top: 56, left: '50%', transform: 'translateX(-50%)', background: 'var(--card,#fff)', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.12)', padding: 8 };
  if (anchorRef && anchorRef.current) {
    const rect = anchorRef.current.getBoundingClientRect();
    style = { ...style, top: rect.bottom + 8, left: rect.left + rect.width/2, transform: 'translateX(-50%)' };
  }

  // Темная тема
  const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const themeStyles = isDark ? { background:'#222', color:'#fff' } : {};

  return (
    <div ref={popoverRef} style={{...style, ...themeStyles}}>
      <DayPicker
        locale={ru}
        weekStartsOn={1}
        showOutsideDays
        onDayClick={date => { onSelect && onSelect(date); onClose && onClose(); }}
        modifiersClassNames={{ today: 'calendar-today' }}
        styles={{
          caption: { color: isDark ? '#fff' : '#222' },
          head_cell: { color: isDark ? '#bbb' : '#888', fontWeight: 500 },
          cell: { borderRadius: 6 },
          day_selected: { background: 'var(--accent,#1976d2)', color: '#fff' },
        }}
      />
    </div>
  );
} 