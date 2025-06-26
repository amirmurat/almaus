import { Link } from 'react-router-dom';

export default function AssignmentCard({ task, done, onToggle }) {
  const { id, title, subject, deadline } = task;

  return (
    <Link
      to={`/assignments/${id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div
        style={{
          border: '1px solid #ccc',
          borderRadius: 8,
          padding: 8,
          margin: 6,
          background: done ? '#e0f2f1' : '#fff',
          display: 'flex',
          gap: 8,
        }}
        onClick={(e) => e.stopPropagation()}   /* клик по блоку не открывает ссылку */
      >
        <input
          type="checkbox"
          checked={done}
          onClick={(e) => e.stopPropagation()} /* не даём всплыть к <Link> */
          onChange={() => onToggle(id)}        /* меняем статус */
        />

        <div style={{ flex: 1 }}>
          <h4>{subject}</h4>
          <p>{title}</p>
          <small>до {deadline}</small>
        </div>
      </div>
    </Link>
  );
}
