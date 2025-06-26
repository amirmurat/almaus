// src/components/ScheduleCard.jsx
export default function ScheduleCard({ lesson, status }) {
  const { start, end, subject, type, theme, room } = lesson;

  /* status: "passed" | "ongoing" | "upcoming" | undefined */
  const cls = 'card ' + (status || '');            // добавляем CSS‑класс

  return (
    <div className={cls}>
      <div><strong>{start}–{end}</strong></div>
      <div>{subject} • {type}</div>
      <div style={{ fontSize: 12 }}>{theme}</div>
      <div style={{ fontSize: 12 }}>{room}</div>
    </div>
  );
}
