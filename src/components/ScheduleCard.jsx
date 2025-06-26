export default function ScheduleCard({ lesson, status }) {
  const { start, end, subject, type, theme, room } = lesson;

  const color = {
    passed:   '#eeeeee',
    ongoing:  '#c8e6c9',
    upcoming: '#fff9c4'
  }[status] || '#ffffff';

  return (
    <div style={{
      border:'1px solid #ccc',borderRadius:8,padding:8,margin:6,
      background: color
    }}>
      <div><strong>{start}–{end}</strong></div>
      <div>{subject} • {type}</div>
      <div style={{fontSize:12}}>{theme}</div>
      <div style={{fontSize:12,color:'#555'}}>{room}</div>
    </div>
  );
}
