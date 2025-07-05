import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const CATEGORY_LABELS = {
  academic: 'Учебные',
  administrative: 'Административные',
  event: 'События',
  urgent: 'Важные',
  general: 'Общие',
  archive: 'Архив',
};

export default function AnnouncementDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const [note, setNote] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch('/data/announcements.json')
      .then(r => r.json())
      .then(list => {
        const found = list.find(n => String(n.id) === String(id));
        if (found) {
          setNote(found);
          // Отмечаем анонс как прочитанный
          const read = JSON.parse(localStorage.getItem('read_announcements') || '[]');
          if (!read.includes(found.id)) {
            const newRead = [...read, found.id];
            localStorage.setItem('read_announcements', JSON.stringify(newRead));
            // Отправляем событие для обновления индикатора
            window.dispatchEvent(new Event('announcementsRead'));
          }
        } else {
          setNotFound(true);
        }
      });
  }, [id]);

  if (notFound) return <div style={{padding:24, textAlign:'center'}}>Анонс не найден</div>;
  if (!note) return <div style={{padding:24, textAlign:'center'}}>Загрузка…</div>;

  const categoryRu = CATEGORY_LABELS[note.type] || note.type || '—';

  return (
    <div style={{maxWidth:600,margin:'0 auto',padding:24}}>
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:18}}>
        <button
          onClick={()=>nav(-1)}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: '#23272f',
            fontSize: 0,
            transition: 'color 0.18s',
          }}
          onMouseDown={e => e.currentTarget.style.color = 'var(--primary,#1976d2)'}
          onMouseUp={e => e.currentTarget.style.color = '#23272f'}
          onMouseLeave={e => e.currentTarget.style.color = '#23272f'}
          aria-label="Назад"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{display:'block'}}><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h2 className="announcement-details-title" style={{fontSize:22,margin:0,whiteSpace:'pre-line',wordBreak:'break-word'}}>{note.title}</h2>
      </div>
      <div style={{color:'#23272f',marginBottom:12}}>Автор: {note.author}</div>
      <div className="announcement-details-category" style={{fontSize:15,marginBottom:16}}>Категория: {categoryRu}</div>
      {note.content && (
        <div style={{
          fontSize: 16,
          lineHeight: 1.6,
          color: '#23272f',
          whiteSpace: 'pre-line',
          wordBreak: 'break-word'
        }}>
          {note.content}
        </div>
      )}
    </div>
  );
} 