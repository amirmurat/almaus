// src/components/AssignmentCard.jsx
import { Link } from 'react-router-dom';

export default function AssignmentCard({ task, done, onToggle }) {
  const { id, title, subject, deadline } = task;

  /* CSS‑класс card + модификатор done  */
  const cls = 'card' + (done ? ' done' : '');

  return (
    <Link
      to={`/assignments/${id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div
        className={cls}
        style={{ display: 'flex', gap: 8 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* чекбокс слева */}
        <input
          type="checkbox"
          checked={done}
          onClick={(e) => e.stopPropagation()}
          onChange={() => onToggle(id)}
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
