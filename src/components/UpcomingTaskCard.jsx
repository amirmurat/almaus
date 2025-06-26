// src/components/UpcomingTaskCard.jsx
import { Link } from 'react-router-dom';

export default function UpcomingTaskCard({ task }) {
  const { id, subject, title, deadline } = task;

  return (
    <Link to={`/assignments/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        style={{
          background: 'var(--upcomingTask)',
          border: '1px solid var(--border)',
          borderRadius: 6,
          padding: 6,
          marginBottom: 6,
          color: 'var(--text)'
        }}
      >
        <strong>{subject}</strong><br />
        <span>{title}</span><br />
        <small>дедлайн — {deadline}</small>
      </div>
    </Link>
  );
}
