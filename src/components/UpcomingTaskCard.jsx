import { Link } from 'react-router-dom';

export default function UpcomingTaskCard({ task }) {
  const { id, subject, title, deadline } = task;
  return (
    <Link to={`/assignments/${id}`} style={{textDecoration:'none',color:'inherit'}}>
      <div style={{
        border:'1px solid #ffeb3b',
        background:'#fffde7',
        borderRadius:6,
        padding:6,
        marginBottom:6
      }}>
        <strong>{subject}</strong><br/>
        <span>{title}</span><br/>
        <small>дедлайн — {deadline}</small>
      </div>
    </Link>
  );
}
