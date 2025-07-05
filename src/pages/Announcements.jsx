import { useEffect, useState } from 'react';
import { fetchJson } from '../utils/api';
import AnnouncementItem from '../components/AnnouncementItem';
import { useNavigate } from 'react-router-dom';
import { BiCheckDouble } from 'react-icons/bi';
import '../App.css';

const CATEGORY_LABELS = {
  academic: 'Учебные',
  administrative: 'Административные',
  event: 'События',
  urgent: 'Важные',
  general: 'Общие',
  archive: 'Архив',
};

const CATEGORY_ORDER = [
  'urgent',
  'academic',
  'administrative',
  'event',
  'general',
  'archive',
];

export default function Announcements() {
  const [notes, setNotes] = useState(null);
  const [collapsed, setCollapsed] = useState([]);
  const [read, setRead] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('read_announcements') || '[]');
    } catch { return []; }
  });
  const nav = useNavigate();
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    fetchJson('announcements.json').then(setNotes);
  }, []);

  // Сохраняем прочитанные анонсы
  useEffect(() => {
    localStorage.setItem('read_announcements', JSON.stringify(read));
    // Отправляем событие для обновления индикатора в BottomNav
    window.dispatchEvent(new Event('announcementsRead'));
  }, [read]);

  // Автоматически сворачиваем секции без непрочитанных анонсов (кроме urgent)
  useEffect(() => {
    if (!notes) return;
    const newCollapsed = [];
    const categoryMap = {};
    notes.forEach(n => {
      const cat = n.type || 'general';
      if (!categoryMap[cat]) categoryMap[cat] = [];
      categoryMap[cat].push(n);
    });
    Object.keys(categoryMap).forEach(cat => {
      const hasUnread = categoryMap[cat].some(n => !read.includes(n.id));
      if (!hasUnread) newCollapsed.push(cat);
    });
    setCollapsed(prev => Array.from(new Set([...prev, ...newCollapsed])));
  }, [notes, read]);

  if (!notes) return <p style={{ textAlign: 'center', marginTop: '20vh' }}>Загрузка…</p>;

  // Группировка по категориям
  const categoryMap = {};
  notes.forEach(n => {
    const cat = n.type || 'general';
    if (!categoryMap[cat]) categoryMap[cat] = [];
    categoryMap[cat].push(n);
  });
  // Исключаем technical из отображения
  const categories = Object.keys(categoryMap)
    .filter(cat => cat !== 'technical')
    .sort((a, b) => {
      const ia = CATEGORY_ORDER.indexOf(a);
      const ib = CATEGORY_ORDER.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });

  return (
    <div style={{ padding: 0, margin: 0, maxWidth: 680, boxSizing: 'border-box' }}>
      <div style={{ padding: 16 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: 8,
        }}>
          <button
            onClick={() => setRead(notes.map(n => n.id))}
            style={{
              background: 'none',
              border: 'none',
              color: '#1976d2',
              cursor: 'pointer',
              padding: 4,
              borderRadius: 0,
              boxShadow: 'none',
              outline: 'none',
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label="Отметить все как прочитанные"
            title="Отметить все как прочитанные"
            onPointerDown={() => setPressed(true)}
            onPointerUp={() => setPressed(false)}
            onPointerLeave={() => setPressed(false)}
          >
            <BiCheckDouble style={{
              fontSize: 18,
              color: 'inherit',
              verticalAlign: 'middle',
              transition: 'transform .13s cubic-bezier(.4,1.6,.6,1), box-shadow .13s',
              transform: pressed ? 'scale(0.85)' : 'none',
              boxShadow: pressed ? '0 2px 8px #1976d233' : 'none',
            }} />
          </button>
        </div>
        {categories.map(cat => {
          const isCollapsed = collapsed.includes(cat);
          const hasUnread = categoryMap[cat].some(n => !read.includes(n.id));
          // Для категории 'urgent' больше не меняем название
          const categoryTitle = CATEGORY_LABELS[cat] || cat;
          return (
            <section key={cat} style={{ marginBottom: 18, padding: '0 8px' }}>
              <h3
                className="announcement-category-title"
                style={{
                  margin: '18px 0 10px 0',
                  fontSize: '18px',
                  color: cat === 'urgent' && hasUnread ? '#d32f2f' : '#23272f',
                  cursor: 'pointer',
                  userSelect: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between', // стрелка справа
                  fontWeight: hasUnread ? 700 : 400,
                  transition: 'font-weight .18s, color .18s',
                }}
                onClick={() => setCollapsed(prev =>
                  prev.includes(cat)
                    ? prev.filter(s => s !== cat)
                    : [...prev, cat]
                )}
              >
                {categoryTitle}
                <span style={{
                  display: 'inline-block',
                  transition: 'transform 0.2s',
                  transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                  width: 18, height: 18
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                </span>
              </h3>
              <div style={{
                maxHeight: isCollapsed ? 0 : 999,
                opacity: isCollapsed ? 0 : 1,
                overflow: 'hidden',
                transition: 'max-height 0.32s cubic-bezier(.33,1,.68,1), opacity 0.22s',
              }}>
                {!isCollapsed && (
                  <div className="announcements-list">
                    {categoryMap[cat].map(n => (
                      <div
                        key={n.id}
                        style={{ 
                          cursor: 'pointer', 
                          transition: 'font-weight .18s, color .18s, opacity .18s',
                          fontWeight: read.includes(n.id) ? 400 : 700,
                          color: cat === 'urgent' && !read.includes(n.id) ? '#d32f2f' : undefined,
                          opacity: read.includes(n.id) ? 0.6 : 1
                        }}
                        onClick={() => {
                          if (!read.includes(n.id)) {
                            setRead(r => [...r, n.id]);
                            setTimeout(() => nav(`/announcements/${n.id}`), 100);
                          } else {
                            nav(`/announcements/${n.id}`);
                          }
                        }}
                      >
                        <AnnouncementItem note={n} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
