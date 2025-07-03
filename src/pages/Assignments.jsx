import { useEffect, useState } from 'react';
import { fetchJson } from '../utils/api';
import AssignmentCard from '../components/AssignmentCard';
import { useNavigate } from 'react-router-dom';

export default function Assignments() {
  const [tasks, setTasks] = useState(null);     // список из JSON
  const [collapsedSubjects, setCollapsedSubjects] = useState([]); // список свернутых предметов
  const [collapsedArchives, setCollapsedArchives] = useState([]); // <-- для архивов
  const nav = useNavigate();

  // загрузка assignments.json один раз
  useEffect(() => {
    fetchJson('assignments.json').then(setTasks);
  }, []);

  // Сворачиваем архивы по умолчанию
  useEffect(() => {
    if (tasks) {
      const now = new Date();
      const subjectsWithArchives = tasks
        .filter(t => new Date(t.deadline) < now)
        .map(t => t.subject);
      setCollapsedArchives(Array.from(new Set(subjectsWithArchives)));
      // --- автосворачивание предметов без активных задач ---
      const subjectMap = {};
      tasks.forEach(t => {
        if (!subjectMap[t.subject]) subjectMap[t.subject] = { active: [], archived: [] };
        const deadlineDate = new Date(t.deadline);
        if (deadlineDate < now) subjectMap[t.subject].archived.push(t);
        else subjectMap[t.subject].active.push(t);
      });
      const subjectsNoActive = Object.keys(subjectMap).filter(s => subjectMap[s].active.length === 0);
      setCollapsedSubjects(prev => Array.from(new Set([...prev, ...subjectsNoActive])));
    }
  }, [tasks]);

  if (!tasks) {
    return <p style={{ textAlign: 'center', marginTop: '20vh' }}>Загрузка…</p>;
  }

  // Группируем задачи по предметам на активные и архивные
  const now = new Date();

  const subjectMap = {};
  tasks.forEach(t => {
    if (!subjectMap[t.subject]) {
      subjectMap[t.subject] = { active: [], archived: [] };
    }
    const deadlineDate = new Date(t.deadline);
    if (deadlineDate < now) {
      subjectMap[t.subject].archived.push(t);
    } else {
      subjectMap[t.subject].active.push(t);
    }
  });
  // Сортируем задачи внутри предмета по дедлайну (по возрастанию)
  Object.values(subjectMap).forEach(group => {
    group.active.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    group.archived.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  });
  // Сортируем предметы: те, у кого есть активные задачи, идут выше, сортируются по ближайшему дедлайну; архивные — внизу
  const subjects = Object.keys(subjectMap).sort((s1, s2) => {
    const g1 = subjectMap[s1];
    const g2 = subjectMap[s2];
    const next1 = g1.active[0] ? new Date(g1.active[0].deadline) : new Date(8640000000000000);
    const next2 = g2.active[0] ? new Date(g2.active[0].deadline) : new Date(8640000000000000);
    return next1 - next2;
  });

  return (
    <div style={{ padding: '0 8px' }}>
      {subjects.map(subject => {
        const isCollapsed = collapsedSubjects.includes(subject);
        const subjectData = subjectMap[subject];
        const hasActive = subjectData.active.length > 0;
        const hasArchive = subjectData.archived.length > 0;
        const isArchiveCollapsed = collapsedArchives.includes(subject);

        if (!hasActive && !hasArchive) return null;

        return (
          <section key={subject} style={{ marginBottom: 18 }}>
            <h3
              style={{
                margin: '18px 0 10px 0',
                fontWeight: 700,
                fontSize: 18,
                color: 'var(--accent, #1976d2)',
                cursor: 'pointer',
                userSelect: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
              onClick={() => setCollapsedSubjects(prev =>
                prev.includes(subject)
                  ? prev.filter(s => s !== subject)
                  : [...prev, subject]
              )}
            >
              {subject}
              <span style={{ fontSize: 16, color: '#888' }}>
                {hasActive ? subjectData.active.length : '—'}
              </span>
              <span style={{ fontSize: 16, color: '#888' }}>{isCollapsed ? '▼' : '▲'}</span>
            </h3>
            
            {/* --- Активные задачи --- */}
            {!isCollapsed && subjectData.active.map(t => (
              <AssignmentCard
                key={t.id}
                task={t}
                hideSubject={true}
              />
            ))}

            {/* --- Архив --- */}
            {!isCollapsed && hasArchive && (
              <div style={{ marginTop: 12, paddingLeft: 12, borderLeft: '2px solid #eee' }}>
                <h4
                  style={{ cursor: 'pointer', userSelect: 'none', color: '#888', margin: '8px 0' }}
                  onClick={() => setCollapsedArchives(prev =>
                    prev.includes(subject)
                      ? prev.filter(s => s !== subject)
                      : [...prev, subject]
                  )}
                >
                  Архив {isArchiveCollapsed ? '▼' : '▲'}
                </h4>
                {!isArchiveCollapsed && subjectData.archived.map(t => (
                  <AssignmentCard
                    key={t.id}
                    task={t}
                    hideSubject={true}
                    isPastDeadline={true}
                  />
                ))}
              </div>
            )}
            
          </section>
        );
      })}
    </div>
  );
}
